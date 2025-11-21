# HNSW (Hierarchical Navigable Small World) 알고리즘

## 1. 정의 및 배경

### 1.1 정의
**HNSW**는 그래프 기반 근사 최근접 이웃 탐색(ANN, Approximate Nearest Neighbor) 알고리즘으로, 계층적 네비게이블 작은 세상(Small World) 그래프 구조를 활용하여 고차원 벡터 공간에서 O(log n) 시간 복잡도로 유사 벡터를 검색한다.

### 1.2 출제 배경
- **문제**: 벡터 데이터베이스(137회 출제) ← RAG(검색증강생성) 대중화
- **근본 원인**: LLM의 한계(환각, 최신 정보 부족) → 외부 지식 검색 필요
  - 수백만~수억 개 임베딩 벡터에서 실시간 검색
  - 선형 탐색 O(n)은 비현실적 (1억 벡터 = 수초~수분)
  - 정확도와 속도의 균형 필요

### 1.3 필요성
1. **RAG 시스템 구축**: 밀리초(ms) 내 유사 문서 검색
2. **추천 시스템**: 실시간 유사 아이템 추천
3. **이미지 검색**: CLIP 임베딩 기반 유사 이미지 검색
4. **중복 탐지**: 유사 텍스트/이미지 찾기

---

## 2. 기존 방식의 한계

### 2.1 선형 탐색 (Brute Force)
```python
# O(n) - 모든 벡터와 거리 계산
def linear_search(query, vectors):
    distances = []
    for v in vectors:  # 1억 개
        dist = cosine_distance(query, v)  # 768차원
        distances.append((dist, v))
    return sorted(distances)[:k]

문제점:
- 1억 벡터 × 768차원 = 약 2초 소요 (GPU 기준)
- 실시간 서비스 불가능 (SLA 100ms 미만 요구)
```

### 2.2 Tree 기반 (KD-Tree, Ball Tree)
```
[고차원의 저주]

저차원 (2D, 3D):
- KD-Tree 효율적 (O(log n))

고차원 (768D):
- 공간 분할이 비효율적
- 대부분의 점이 경계 근처 위치
- 성능 O(n^(1-1/d)) → 거의 O(n)
```

### 2.3 해싱 기반 (LSH)
```
장점: O(1) 평균 시간
단점:
- Recall 낮음 (70-80%)
- 하이퍼파라미터 튜닝 어려움
- 메모리 사용량 높음 (여러 해시 테이블)
```

---

## 3. HNSW 알고리즘 상세

### 3.1 핵심 아이디어: Small World 현상

```
[Small World Network 특성]

일반 그래프:
A → B → C → D → E → F  (6 hops)

Small World:
A ⟶ F (1 hop via shortcut)
  ↘ B → C → D → E → F

특징:
1. 짧은 경로 길이 (log n)
2. 높은 클러스터링 (지역적 연결)
3. Long-range links (먼 거리 연결)
```

### 3.2 계층 구조 (Hierarchical)

```
[Multi-layer Skip List 유사 구조]

Layer 2 (top):    1 ─────────────────────→ 100
                  ↓                         ↓
Layer 1:          1 ─────→ 25 ─────────→ 100
                  ↓        ↓              ↓
Layer 0 (bottom): 1 → 5 → 25 → 50 → 75 → 100

검색 과정:
1. Layer 2에서 대략적 위치 파악 (long jump)
2. Layer 1에서 중간 범위 탐색
3. Layer 0에서 정밀 탐색

시간 복잡도: O(log n) per layer × log n layers = O(log² n)
```

### 3.3 삽입 알고리즘

```python
class HNSW:
    def __init__(self, M=16, ef_construction=200):
        """
        M: 각 노드의 최대 연결 수
        ef_construction: 삽입 시 탐색할 후보 수
        """
        self.M = M
        self.M_max = M
        self.M_max0 = M * 2  # Layer 0는 2배
        self.ef_construction = ef_construction
        self.levels = []  # [layer0_graph, layer1_graph, ...]
        self.entry_point = None

    def insert(self, new_vector, new_id):
        # 1. 레벨 결정 (지수 분포)
        level = self._select_level()  # P(level=l) = (1/M)^l

        # 2. 진입점부터 탐색 시작
        current = self.entry_point
        nearest = []

        # 3. Top layer부터 target layer까지 Greedy Search
        for lc in range(self.max_level, level, -1):
            current = self._search_layer(new_vector, current, 1, lc)

        # 4. Target layer부터 layer 0까지 삽입
        for lc in range(level, -1, -1):
            # 후보 탐색 (ef_construction개)
            candidates = self._search_layer(
                new_vector, current, self.ef_construction, lc
            )

            # M개 선택 (Heuristic 사용)
            neighbors = self._select_neighbors(
                new_vector, candidates, M=self.M, lc=lc
            )

            # 양방향 연결
            for neighbor in neighbors:
                self._add_bidirectional_link(new_id, neighbor, lc)

                # 이웃의 연결 수가 M_max 초과 시 가지치기
                self._prune_connections(neighbor, lc)

    def _select_level(self):
        """지수 분포로 레벨 선택"""
        import random
        m_L = 1.0 / math.log(2.0)  # normalization factor
        return int(-math.log(random.uniform(0, 1)) * m_L)

    def _search_layer(self, query, entry_point, ef, layer):
        """단일 레이어에서 Greedy Search"""
        visited = set()
        candidates = []  # min-heap (거리 기준)
        w = []  # ef개의 가장 가까운 이웃

        # 진입점 추가
        dist = self._distance(query, entry_point)
        heapq.heappush(candidates, (-dist, entry_point))
        heapq.heappush(w, (dist, entry_point))
        visited.add(entry_point)

        while candidates:
            # 가장 가까운 후보 선택
            _, current = heapq.heappop(candidates)

            # Stopping condition
            furthest_dist, _ = w[0]
            if self._distance(query, current) > furthest_dist:
                break

            # 이웃 탐색
            for neighbor in self.levels[layer][current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    furthest_dist, _ = w[0]
                    dist = self._distance(query, neighbor)

                    # ef개 유지 (가장 가까운 것만)
                    if dist < furthest_dist or len(w) < ef:
                        heapq.heappush(candidates, (-dist, neighbor))
                        heapq.heappush(w, (dist, neighbor))

                        if len(w) > ef:
                            heapq.heappop(w)

        return w
```

### 3.4 검색 알고리즘

```python
def search(self, query, k=10, ef=50):
    """
    k: 반환할 최근접 이웃 수
    ef: 검색 시 탐색할 후보 수 (ef >= k)
    """
    # 1. Top layer부터 시작
    current = self.entry_point

    # 2. Layer 1까지 Greedy Search
    for lc in range(self.max_level, 0, -1):
        current = self._search_layer(query, current, 1, lc)

    # 3. Layer 0에서 정밀 탐색 (ef개 후보)
    candidates = self._search_layer(query, current, ef, 0)

    # 4. 상위 k개 반환
    return sorted(candidates, key=lambda x: x[0])[:k]
```

---

## 4. 파라미터 튜닝 및 성능 분석

### 4.1 주요 파라미터

| 파라미터 | 의미 | 기본값 | 영향 |
|----------|------|--------|------|
| M | 노드당 최대 연결 수 | 16 | 높을수록 Recall↑, 메모리↑ |
| ef_construction | 삽입 시 후보 수 | 200 | 높을수록 그래프 품질↑, 구축 시간↑ |
| ef_search | 검색 시 후보 수 | 50 | 높을수록 Recall↑, 검색 시간↑ |

### 4.2 M 값 영향

```
[M=8 vs M=16 vs M=32]

M=8:
- 메모리: 낮음
- Recall@10: 85%
- QPS: 5000

M=16:
- 메모리: 중간
- Recall@10: 95%
- QPS: 3000

M=32:
- 메모리: 높음
- Recall@10: 98%
- QPS: 1500

권장: M=16 (Recall/성능 균형)
```

### 4.3 성능 벤치마크

```
[1억 벡터, 768차원, 코사인 유사도]

알고리즘    | Recall@10 | QPS   | 메모리  | 구축 시간
------------|-----------|-------|---------|----------
Linear      | 100%      | 10    | 300GB   | 0
HNSW (M=16) | 95%       | 3000  | 450GB   | 2시간
IVF (n=4096)| 85%       | 8000  | 350GB   | 30분
LSH         | 75%       | 10000 | 400GB   | 10분

결론: HNSW는 Recall/QPS 균형점에서 최고 성능
```

---

## 5. 구현 및 최적화

### 5.1 거리 계산 최적화

```python
# SIMD (AVX2) 활용
import numpy as np

def cosine_distance_simd(a, b):
    """AVX2 활용 코사인 거리"""
    # NumPy는 자동으로 SIMD 사용
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return 1.0 - (dot_product / (norm_a * norm_b))

# 배치 처리
def batch_distance(query, vectors):
    """GPU/SIMD로 병렬 계산"""
    # (1, 768) × (N, 768).T = (1, N)
    dots = np.dot(query, vectors.T)
    norms = np.linalg.norm(vectors, axis=1)
    return 1.0 - (dots / (np.linalg.norm(query) * norms))
```

### 5.2 메모리 최적화

```python
# Quantization (PQ - Product Quantization)
class HNSW_PQ:
    def __init__(self, M=16, num_subvectors=8):
        self.M = M
        self.num_subvectors = num_subvectors
        self.codebooks = []  # PQ codebooks

    def compress_vector(self, vector):
        """768D → 8 bytes"""
        # 768D를 8개 부분벡터로 분할 (각 96D)
        subvectors = np.split(vector, self.num_subvectors)
        codes = []

        for i, subvec in enumerate(subvectors):
            # 가장 가까운 centroid의 인덱스 저장 (1 byte)
            code = self._nearest_centroid(subvec, self.codebooks[i])
            codes.append(code)

        return bytes(codes)  # 8 bytes (96% 메모리 절감)

메모리 사용량:
- 원본: 1억 × 768 × 4 bytes = 300GB
- PQ 압축: 1억 × 8 bytes = 800MB (375배 절감)
```

### 5.3 병렬 검색

```python
import threading
from concurrent.futures import ThreadPoolExecutor

def parallel_search(queries, k=10):
    """멀티스레드 배치 검색"""
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [
            executor.submit(hnsw.search, query, k)
            for query in queries
        ]
        results = [f.result() for f in futures]
    return results
```

---

## 6. 실무 적용 사례

### 6.1 FAISS vs Milvus vs Qdrant

| 라이브러리 | HNSW 지원 | GPU 지원 | 분산 처리 | 특징 |
|------------|-----------|----------|-----------|------|
| FAISS (Meta) | ✅ | ✅ | ❌ | C++ 기반, 최고 성능 |
| Milvus | ✅ | ✅ | ✅ | 분산 벡터 DB, Kubernetes |
| Qdrant | ✅ | ❌ | ✅ | Rust 기반, 필터링 강력 |

### 6.2 RAG 시스템 통합

```python
# LangChain + FAISS HNSW
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

# 1. 문서 임베딩
embeddings = OpenAIEmbeddings()
documents = ["doc1", "doc2", ...]

# 2. HNSW 인덱스 구축
vectorstore = FAISS.from_documents(
    documents,
    embeddings,
    index_type="hnsw",  # HNSW 사용
    M=16,
    ef_construction=200
)

# 3. 검색 (ef_search 조정)
vectorstore.search_kwargs = {"ef": 50}
results = vectorstore.similarity_search("query", k=5)
```

### 6.3 하이브리드 검색

```python
# HNSW (Dense) + BM25 (Sparse) 결합
def hybrid_search(query, k=10, alpha=0.7):
    # Dense 검색 (HNSW)
    dense_results = hnsw.search(
        embeddings.embed(query), k=k*2
    )

    # Sparse 검색 (BM25)
    sparse_results = bm25_index.search(query, k=k*2)

    # Reciprocal Rank Fusion
    combined = reciprocal_rank_fusion(
        dense_results, sparse_results, alpha
    )
    return combined[:k]

Recall 개선: 92% → 97% (+5%p)
```

---

## 7. 한계 및 개선 방향

### 7.1 현재 한계
1. **삽입 비용**: O(log n) → 실시간 업데이트 어려움
2. **메모리 사용량**: M이 클수록 메모리 증가 (그래프 엣지)
3. **삭제 지원 약함**: 소프트 삭제만 가능 (재구축 필요)

### 7.2 개선 방향
1. **NSW (Non-Hierarchical)**: 단일 레이어로 단순화
2. **DiskANN**: 디스크 기반 HNSW (메모리 제약 완화)
3. **GPU HNSW**: CUDA 구현으로 100배 가속
4. **Filtered Search**: 메타데이터 필터링 통합

---

## 8. 시사점

### 8.1 기술적 시사점
- **Small World의 AI 응용**: 사회 네트워크 이론을 벡터 검색에 적용
- **계층 구조의 힘**: Skip List 개념으로 검색 효율성 극대화
- **근사의 실용성**: 5% Recall 희생으로 100배 속도 향상

### 8.2 산업적 시사점
1. **RAG 시스템 필수**: 모든 LLM 기반 서비스에 HNSW 활용
2. **실시간 검색 가능**: 추천, 검색 엔진에 광범위 적용
3. **오픈소스 생태계**: FAISS, Milvus 등 성숙한 라이브러리

### 8.3 출제 예상 각도
- "RAG 시스템 구축 시 벡터 검색 알고리즘 비교" (HNSW, IVF, LSH)
- "고차원 벡터 공간에서의 효율적 검색 기법"
- "HNSW 알고리즘의 동작 원리 및 파라미터 튜닝"
- "임베딩 검색 최적화 전략" (Quantization, 하이브리드 검색)

---

## 참고문헌
- HNSW 논문: "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs" (2018)
- FAISS: https://github.com/facebookresearch/faiss
- 관련 기술: IVF, PQ (Product Quantization), ScaNN
