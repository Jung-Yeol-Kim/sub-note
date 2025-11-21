# vLLM의 PagedAttention 알고리즘

## 1. 정의 및 배경

### 1.1 정의
**PagedAttention**은 LLM(Large Language Model) 추론 시 KV Cache를 페이징 기법으로 관리하여 메모리 효율성을 극대화하는 알고리즘이다. OS의 가상 메모리 시스템과 유사하게, 연속된 논리 주소를 불연속적인 물리 블록에 매핑한다.

### 1.2 출제 배경
- **문제**: LLM(133, 135, 136회 출제) ← 기업/공공기관 LLM 도입 가속화
- **근본 원인**: Transformer의 KV Cache 메모리 낭비 (최대 80%)
  - 동적 시퀀스 길이로 인한 Over-provisioning
  - 메모리 단편화 (Fragmentation)
  - 배치 처리 시 메모리 예측 불가

### 1.3 필요성
1. **GPU 메모리 제약**: A100 80GB에 13B 모델 배치 크기 제한
2. **서빙 비용 절감**: 메모리 효율 2-4배 개선 → 처리량 증가
3. **긴 컨텍스트 지원**: 128K 토큰 처리 시 메모리 부족 문제 해결

---

## 2. 기존 방식의 문제점

### 2.1 기존 KV Cache 관리
```
[기존 방식: 연속 메모리 할당]

Request 1: "Explain quantum"     → 2048 토큰 할당
Request 2: "Hi"                  → 2048 토큰 할당 (실제 2개만 사용)
Request 3: "Write a long essay"  → 2048 토큰 할당

문제점:
- Request 2는 2046 토큰 낭비 (99% 미사용)
- 최대 길이로 미리 할당 → 메모리 Over-provisioning
- 동적 확장 불가 → 배치 크기 제한
```

### 2.2 메모리 단편화
```
[메모리 단편화 예시]

Request 1 완료 → 메모리 해제
Request 2 완료 → 메모리 해제
Request 3 진행 중 → 큰 블록 필요

┌────────┬────────┬──────────┬────────┐
│  Free  │  Req3  │   Free   │  Req3  │  ← 단편화로 인해
└────────┴────────┴──────────┴────────┘     새 요청 할당 실패
```

---

## 3. PagedAttention 알고리즘 상세

### 3.1 핵심 아이디어 (OS Paging과의 유사성)

| 개념 | OS Virtual Memory | PagedAttention |
|------|-------------------|----------------|
| 논리 주소 | Virtual Address | 논리 KV Block |
| 물리 주소 | Physical Address | 물리 KV Block |
| 페이지 테이블 | Page Table | Block Table |
| 페이지 크기 | 4KB | 16-64 토큰 |
| 페이지 폴트 | Page Fault | 없음 (사전 할당) |

### 3.2 메모리 구조

```
[논리 블록 → 물리 블록 매핑]

논리 블록 (Logical Blocks):
┌───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │  Request A
└───┴───┴───┴───┘

┌───┬───┐
│ 0 │ 1 │  Request B
└───┴───┘

물리 메모리 (Physical Blocks):
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 7 │ 1 │ 3 │ 8 │ 5 │ 2 │ 0 │ 4 │
└───┴───┴───┴───┴───┴───┴───┴───┘
  ↑       ↑       ↑   ↑
  A0      A2      B0  A1

Block Table:
Req A: [7, 5, 1, 8]  (논리 블록 0→물리 7, 1→물리 5, ...)
Req B: [3, 2]
```

### 3.3 알고리즘 동작 과정

```python
# 1. 초기화: 물리 블록 풀 생성
physical_blocks = [Block(i) for i in range(num_blocks)]
free_blocks = Queue(physical_blocks)

# 2. 새 요청 시작
def new_request(prompt):
    logical_blocks = []
    num_blocks_needed = ceil(len(prompt) / BLOCK_SIZE)

    # 물리 블록 할당
    for _ in range(num_blocks_needed):
        if free_blocks.empty():
            # Preemption or Swapping
            evict_blocks()
        physical_block = free_blocks.pop()
        logical_blocks.append(physical_block)

    # Block Table 생성
    block_table[request_id] = logical_blocks
    return request_id

# 3. 토큰 생성 (Attention 연산)
def generate_token(request_id):
    logical_blocks = block_table[request_id]

    # KV Cache 접근 (물리 블록에서)
    for logical_idx, physical_block in enumerate(logical_blocks):
        kv_data = physical_block.data
        # Attention 연산 수행
        attention_score = compute_attention(query, kv_data)

    # 새 토큰 생성 시 블록 확장
    if current_block_full():
        new_block = free_blocks.pop()
        logical_blocks.append(new_block)

# 4. 요청 완료 시 블록 해제
def finish_request(request_id):
    for block in block_table[request_id]:
        free_blocks.push(block)
    del block_table[request_id]
```

### 3.4 Copy-on-Write (공유 접두사 최적화)

```
[Prefix Sharing 예시]

Request 1: "Translate to French: Hello"
Request 2: "Translate to French: Good morning"

공통 접두사: "Translate to French: "

┌─────────────────┐
│ Translate to    │ ← 물리 블록 A (공유)
└─────────────────┘
         ↑
    ┌────┴────┐
    │         │
Req 1:       Req 2:
┌─────┐      ┌───────────┐
│Hello│      │Good morning│
└─────┘      └───────────┘

효과: 메모리 55% 절약 (공통 접두사 1회만 저장)
```

---

## 4. 성능 분석 및 구현

### 4.1 메모리 효율성

```
[기존 방식 vs PagedAttention]

기존:
- 13B 모델, 2048 max length, batch=32
- 메모리: 32 * 2048 * 2 layers * head_dim = 280GB
- GPU: A100 80GB → batch=8 제한

PagedAttention:
- 실제 사용량만 할당 (평균 512 토큰)
- 메모리: 32 * 512 * ... = 70GB
- GPU: A100 80GB → batch=32 가능 (4배 증가)
```

### 4.2 블록 크기 선택

| Block Size | 메모리 효율 | 단편화 | I/O 오버헤드 |
|------------|-------------|--------|--------------|
| 8 토큰     | 낮음        | 적음   | 높음         |
| 16 토큰    | 중간        | 중간   | 중간         |
| 32 토큰    | 높음        | 많음   | 낮음         |

**최적값**: 16-32 토큰 (실험적으로 결정)

### 4.3 vLLM 구현 핵심 코드

```python
class BlockSpaceManager:
    def __init__(self, block_size, num_blocks):
        self.block_size = block_size
        self.free_blocks = list(range(num_blocks))
        self.block_tables = {}  # request_id -> [block_ids]

    def allocate(self, request_id, num_tokens):
        num_blocks = (num_tokens + self.block_size - 1) // self.block_size
        allocated_blocks = []

        for _ in range(num_blocks):
            if not self.free_blocks:
                raise OutOfMemoryError
            block_id = self.free_blocks.pop(0)
            allocated_blocks.append(block_id)

        self.block_tables[request_id] = allocated_blocks

    def append_slot(self, request_id):
        blocks = self.block_tables[request_id]
        last_block = blocks[-1]

        # 마지막 블록이 가득 찼으면 새 블록 할당
        if self._is_block_full(last_block):
            new_block = self.free_blocks.pop(0)
            blocks.append(new_block)
```

---

## 5. 실무 적용 사례

### 5.1 vLLM vs 기존 서빙 프레임워크

| 메트릭 | HuggingFace TGI | vLLM (PagedAttention) |
|--------|-----------------|------------------------|
| 처리량 (tok/s) | 340 | 1200 (+250%) |
| Latency (P99) | 2.3s | 0.8s (-65%) |
| GPU 활용률 | 45% | 85% |
| 배치 크기 | 8 | 32 |

### 5.2 긴 컨텍스트 처리

```
[128K 컨텍스트 처리 가능 여부]

기존 방식:
- 128K * 2 layers * 4096 dim * 2 bytes = 2GB/request
- A100 80GB → 최대 40 requests

PagedAttention:
- 블록 단위 할당 (평균 8K 사용)
- 8K * ... = 128MB/request
- A100 80GB → 최대 600 requests (15배 증가)
```

### 5.3 운영 환경 권장 사항

1. **블록 크기**: 16-32 토큰 (모델 크기에 따라 조정)
2. **메모리 예약**: 전체 GPU 메모리의 90% 할당 (10% 여유)
3. **Preemption 정책**: Priority-based (긴급 요청 우선)
4. **모니터링**: 블록 사용률, 단편화 비율 추적

---

## 6. 한계 및 개선 방향

### 6.1 현재 한계
1. **추가 메타데이터**: Block Table 오버헤드 (1-2%)
2. **블록 경계**: 마지막 블록 미사용 공간 (평균 50%)
3. **복잡도 증가**: 디버깅 및 최적화 어려움

### 6.2 개선 방향
1. **가변 블록 크기**: 짧은 요청은 작은 블록, 긴 요청은 큰 블록
2. **Hierarchical Paging**: 2단계 페이징 (Super Block)
3. **Swapping**: GPU ↔ CPU 메모리 간 블록 이동
4. **압축**: KV Cache 양자화 (INT8/INT4)

---

## 7. 시사점

### 7.1 기술적 시사점
- **OS 원리의 AI 응용**: 가상 메모리 개념을 LLM에 성공적으로 적용
- **메모리-처리량 트레이드오프**: 메모리 효율 → 배치 크기 증가 → 처리량 향상
- **범용성**: 모든 Transformer 기반 모델에 적용 가능

### 7.2 산업적 시사점
1. **비용 절감**: GPU 수 감소 → TCO 50% 절감
2. **서비스 품질**: Latency 개선 → 사용자 경험 향상
3. **확장성**: 긴 컨텍스트 지원 → 새로운 Use Case 창출

### 7.3 출제 예상 각도
- "LLM 추론 최적화 기법" (메모리 효율성 중심)
- "Transformer 서빙 시 메모리 관리 전략"
- "vLLM vs TensorRT-LLM 비교" (PagedAttention vs Inflight Batching)
- "GPU 메모리 제약 환경에서의 LLM 서빙 아키텍처"

---

## 참고문헌
- vLLM 논문: "Efficient Memory Management for Large Language Model Serving with PagedAttention" (2023)
- vLLM GitHub: https://github.com/vllm-project/vllm
- 관련 기술: Continuous Batching, KV Cache Quantization
