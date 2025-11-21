# MoE (Mixture of Experts) 라우팅 알고리즘

## 1. 정의 및 배경

### 1.1 정의
**MoE (Mixture of Experts)**는 다수의 전문가(Expert) 네트워크를 조건부로 활성화하는 희소 활성화(Sparse Activation) 아키텍처로, 라우터(Router)가 입력 토큰을 적절한 전문가에게 동적으로 할당하여 모델 용량을 증가시키면서도 계산 비용은 일정하게 유지한다.

### 1.2 출제 배경
- **문제**: Transformer & MoE (137회 출제) ← GPT-4, Mixtral 등 대형 모델 아키텍처
- **근본 원인**: Dense 모델의 확장 한계
  - GPT-3 175B → GPT-4 1.7T (10배) 시 FLOPs 10배 증가
  - 추론 비용 급증 → 서비스 불가능
  - 모든 파라미터를 항상 사용 → 비효율

### 1.3 필요성
1. **효율적 확장**: 파라미터 증가 without 계산 증가
2. **특화된 학습**: 전문가별 도메인 특화
3. **추론 비용 절감**: 일부 전문가만 활성화 (예: 2/8)

---

## 2. Dense vs MoE 비교

### 2.1 Dense Transformer

```
[모든 토큰이 모든 FFN 통과]

Input: [토큰1, 토큰2, ..., 토큰N]
         ↓       ↓            ↓
      ┌──────────────────────┐
      │   FFN (전체 활성화)  │  ← 13B 파라미터
      └──────────────────────┘
         ↓       ↓            ↓
Output: [출력1, 출력2, ..., 출력N]

계산량: N tokens × 13B params = 13B × N FLOPs
```

### 2.2 MoE Transformer

```
[토큰별로 일부 Expert만 활성화]

Input: [토큰1, 토큰2, 토큰3]
         ↓       ↓       ↓
      ┌─────────────────────┐
      │  Router (라우터)    │  ← 어느 Expert로?
      └─────────────────────┘
         ↓       ↓       ↓
    Expert1  Expert3  Expert2  (각 1.6B)
         ↓       ↓       ↓
Output: [출력1, 출력2, 출력3]

총 파라미터: 8 experts × 1.6B = 12.8B
활성 파라미터: 2 experts × 1.6B = 3.2B (토큰당)
계산량: N × 3.2B FLOPs (75% 절감)
```

---

## 3. 라우팅 알고리즘 상세

### 3.1 기본 라우팅 (Top-K)

```python
class Router(nn.Module):
    def __init__(self, d_model, num_experts):
        super().__init__()
        self.num_experts = num_experts
        # 라우터 게이트 (선형 레이어)
        self.gate = nn.Linear(d_model, num_experts)

    def forward(self, x):
        """
        x: [batch, seq_len, d_model]
        Returns: (expert_weights, expert_indices)
        """
        # 1. 각 전문가에 대한 로짓 계산
        gate_logits = self.gate(x)  # [batch, seq_len, num_experts]

        # 2. Softmax로 확률 변환
        gate_probs = F.softmax(gate_logits, dim=-1)

        # 3. Top-K 전문가 선택 (K=2)
        top_k_probs, top_k_indices = torch.topk(
            gate_probs, k=2, dim=-1
        )

        # 4. Normalize (선택된 전문가 확률 합=1)
        top_k_probs = top_k_probs / top_k_probs.sum(dim=-1, keepdim=True)

        return top_k_probs, top_k_indices


class MoELayer(nn.Module):
    def __init__(self, d_model, num_experts, expert_capacity):
        super().__init__()
        self.num_experts = num_experts
        self.experts = nn.ModuleList([
            FFN(d_model) for _ in range(num_experts)
        ])
        self.router = Router(d_model, num_experts)

    def forward(self, x):
        batch_size, seq_len, d_model = x.shape

        # 1. 라우팅 결정
        expert_weights, expert_indices = self.router(x)

        # 2. 각 전문가별로 토큰 분배
        expert_outputs = []
        for i in range(self.num_experts):
            # 이 전문가로 라우팅된 토큰 마스크
            mask = (expert_indices == i).any(dim=-1)
            expert_input = x[mask]

            # 전문가 실행
            if expert_input.numel() > 0:
                expert_output = self.experts[i](expert_input)
                expert_outputs.append((mask, expert_output))

        # 3. 출력 조합
        output = torch.zeros_like(x)
        for mask, expert_out in expert_outputs:
            output[mask] = expert_out

        # 4. 가중 합 (Top-K 확률 사용)
        output = output * expert_weights.sum(dim=-1, keepdim=True)

        return output
```

### 3.2 Switch Transformer 라우팅 (Top-1)

```python
class SwitchRouter(nn.Module):
    """
    Switch Transformer: Top-1 라우팅으로 단순화
    논문: https://arxiv.org/abs/2101.03961
    """
    def __init__(self, d_model, num_experts, capacity_factor=1.25):
        super().__init__()
        self.num_experts = num_experts
        self.capacity_factor = capacity_factor
        self.gate = nn.Linear(d_model, num_experts)

    def forward(self, x):
        batch_size, seq_len, d_model = x.shape
        num_tokens = batch_size * seq_len

        # 1. 라우팅 로짓
        gate_logits = self.gate(x)  # [batch, seq_len, num_experts]
        gate_logits = gate_logits.view(-1, self.num_experts)  # [num_tokens, num_experts]

        # 2. Top-1 선택
        expert_idx = torch.argmax(gate_logits, dim=-1)  # [num_tokens]
        expert_weights = F.softmax(gate_logits, dim=-1)

        # 3. Expert Capacity 계산
        capacity = int(self.capacity_factor * num_tokens / self.num_experts)

        # 4. Load Balancing (전문가별 토큰 수 제한)
        expert_mask = F.one_hot(expert_idx, self.num_experts)  # [num_tokens, num_experts]
        expert_counts = expert_mask.sum(dim=0)  # [num_experts]

        # 5. Capacity 초과 토큰은 버림 (Dropping)
        positions_in_expert = torch.cumsum(expert_mask, dim=0) * expert_mask
        expert_capacity_mask = positions_in_expert <= capacity

        # 6. 최종 마스크
        final_mask = expert_mask * expert_capacity_mask

        return expert_weights, expert_idx, final_mask
```

### 3.3 Mixtral 8x7B 라우팅

```python
class MixtralRouter(nn.Module):
    """
    Mixtral: Top-2 라우팅 + Load Balancing Loss
    8 experts × 7B params, 활성 2 experts
    """
    def __init__(self, d_model=4096, num_experts=8):
        super().__init__()
        self.num_experts = num_experts
        self.gate = nn.Linear(d_model, num_experts, bias=False)

    def forward(self, x):
        # 1. 라우팅 로짓
        router_logits = self.gate(x)  # [batch, seq, num_experts]

        # 2. Top-2 선택
        routing_weights = F.softmax(router_logits, dim=-1)
        top2_weights, top2_indices = torch.topk(
            routing_weights, k=2, dim=-1
        )

        # 3. Normalize Top-2
        top2_weights = top2_weights / top2_weights.sum(dim=-1, keepdim=True)

        # 4. Load Balancing Loss 계산
        # 목표: 각 전문가가 균등하게 토큰 처리
        expert_counts = torch.zeros(self.num_experts, device=x.device)
        for i in range(self.num_experts):
            expert_counts[i] = (top2_indices == i).float().sum()

        # Coefficient of Variation (CV)
        mean_count = expert_counts.mean()
        load_balance_loss = (expert_counts - mean_count).pow(2).sum()

        return top2_weights, top2_indices, load_balance_loss
```

---

## 4. 핵심 문제 및 해결 방법

### 4.1 Load Imbalance (부하 불균형)

```
[문제]

Expert 1: ████████████████████ (80% 토큰) ← 과부하
Expert 2: ████                  (20% 토큰)
Expert 3: ░░░░                  (0% 토큰)  ← 사용 안 됨

원인:
- 라우터가 특정 전문가 선호
- 일부 전문가만 학습됨
```

**해결: Auxiliary Loss (보조 손실)**

```python
def compute_load_balance_loss(expert_indices, num_experts):
    """
    Switch Transformer의 Load Balancing Loss
    목표: 각 전문가가 1/N의 토큰을 처리하도록 유도
    """
    num_tokens = expert_indices.numel()

    # 각 전문가가 처리한 토큰 비율
    expert_mask = F.one_hot(expert_indices, num_experts).float()
    fraction_per_expert = expert_mask.sum(dim=0) / num_tokens

    # 라우터가 각 전문가에 할당한 확률
    routing_prob_per_expert = routing_probs.mean(dim=0)

    # Load Balance Loss = N * Σ(f_i * P_i)
    # 목표: 1/N² (완벽한 균형)
    loss = num_experts * (
        fraction_per_expert * routing_prob_per_expert
    ).sum()

    return loss

# 최종 손실 함수
total_loss = cross_entropy_loss + α * load_balance_loss
```

### 4.2 Expert Capacity Overflow

```
[문제]

Expert 1 Capacity: 100 토큰
실제 할당: 150 토큰 → 50 토큰 버림 (Token Dropping)

영향:
- 버려진 토큰은 학습/추론 미참여
- 성능 저하
```

**해결 방법**

1. **Capacity Factor 증가**
```python
capacity = int(capacity_factor * num_tokens / num_experts)
# capacity_factor = 1.0 → 정확히 균등 분배
# capacity_factor = 1.25 → 25% 여유
```

2. **Expert Choice Routing** (전문가가 토큰 선택)
```python
# 기존: 토큰이 전문가 선택
token_chooses_expert = torch.argmax(router_logits, dim=-1)

# 개선: 전문가가 토큰 선택
expert_chooses_token = torch.topk(
    router_logits.T,  # [num_experts, num_tokens]
    k=capacity,
    dim=-1
)
# 각 전문가가 정확히 capacity개 토큰 선택 → Overflow 없음
```

### 4.3 All-to-All Communication (분산 학습)

```
[문제: 멀티 GPU 환경]

GPU 0: 토큰 → Expert 3 (GPU 2)
GPU 1: 토큰 → Expert 5 (GPU 3)
GPU 2: 토큰 → Expert 1 (GPU 0)
                ↑
           네트워크 통신 병목

통신량: O(batch_size × seq_len × d_model × num_gpus)
```

**해결: Expert Parallelism**

```python
# DeepSpeed-MoE
# 각 GPU가 일부 전문가만 소유
GPU 0: Experts [0, 1]
GPU 1: Experts [2, 3]
GPU 2: Experts [4, 5]
GPU 3: Experts [6, 7]

# All-to-All 통신으로 토큰 재분배
def all_to_all_expert_parallel(tokens, expert_indices):
    # 1. 각 전문가로 가는 토큰 그룹화
    expert_tokens = [[] for _ in range(num_experts)]
    for token, expert_idx in zip(tokens, expert_indices):
        expert_tokens[expert_idx].append(token)

    # 2. All-to-All 통신
    local_experts = [expert_tokens[i] for i in local_expert_range]

    # 3. 로컬 전문가 실행
    outputs = [expert(tokens) for expert, tokens in zip(experts, local_experts)]

    # 4. All-to-All 역방향 통신
    return gather_outputs(outputs)
```

---

## 5. 구현 예시: Mixtral 8x7B

### 5.1 전체 아키텍처

```python
class MixtralBlock(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.attention = MultiHeadAttention(config)
        self.moe = MoELayer(
            d_model=config.d_model,
            num_experts=8,
            top_k=2
        )
        self.norm1 = RMSNorm(config.d_model)
        self.norm2 = RMSNorm(config.d_model)

    def forward(self, x):
        # 1. Attention
        x = x + self.attention(self.norm1(x))

        # 2. MoE FFN (Dense FFN 대체)
        x = x + self.moe(self.norm2(x))

        return x


class MoELayer(nn.Module):
    def __init__(self, d_model, num_experts, top_k):
        super().__init__()
        self.experts = nn.ModuleList([
            Expert(d_model) for _ in range(num_experts)
        ])
        self.router = MixtralRouter(d_model, num_experts)
        self.top_k = top_k

    def forward(self, x):
        batch, seq, d = x.shape
        x_flat = x.view(-1, d)  # [batch*seq, d]

        # 1. 라우팅
        router_weights, router_indices, lb_loss = self.router(x_flat)

        # 2. 전문가 실행
        final_output = torch.zeros_like(x_flat)

        for i in range(self.top_k):
            expert_idx = router_indices[:, i]
            expert_weight = router_weights[:, i:i+1]

            # 각 전문가별로 처리
            for expert_id in range(len(self.experts)):
                mask = (expert_idx == expert_id)
                if mask.any():
                    expert_input = x_flat[mask]
                    expert_output = self.experts[expert_id](expert_input)

                    # 가중치 적용
                    final_output[mask] += expert_weight[mask] * expert_output

        return final_output.view(batch, seq, d), lb_loss
```

### 5.2 Expert 네트워크

```python
class Expert(nn.Module):
    """
    SwiGLU FFN (Mixtral 사용)
    """
    def __init__(self, d_model, d_ff=None):
        super().__init__()
        d_ff = d_ff or 4 * d_model
        self.w1 = nn.Linear(d_model, d_ff, bias=False)  # Gate
        self.w2 = nn.Linear(d_ff, d_model, bias=False)  # Down
        self.w3 = nn.Linear(d_model, d_ff, bias=False)  # Up

    def forward(self, x):
        # SwiGLU: swish(W1 x) ⊙ (W3 x)
        return self.w2(F.silu(self.w1(x)) * self.w3(x))
```

---

## 6. 성능 분석

### 6.1 Mixtral 8x7B vs Llama 2 70B

| 메트릭 | Mixtral 8x7B | Llama 2 70B | 비고 |
|--------|--------------|-------------|------|
| 총 파라미터 | 46.7B | 70B | MoE가 작음 |
| 활성 파라미터 | 12.9B | 70B | MoE가 5배 효율적 |
| MMLU | 70.6 | 68.9 | MoE 승 |
| 추론 속도 | 1.2x | 1.0x | MoE 빠름 |
| 메모리 | 100GB | 140GB | MoE 적음 |

### 6.2 확장 효율성

```
[Dense vs MoE 확장]

Dense:
175B → 1.7T params: FLOPs 10배, 메모리 10배

MoE:
175B → 1.7T params (64 experts):
- FLOPs: 2배만 증가 (Top-2 활성화)
- 메모리: 10배 증가 (모든 전문가 로드 필요)
- 품질: Dense 1.7T와 동등

결론: 계산 효율성 5배 향상
```

---

## 7. 시사점

### 7.1 기술적 시사점
- **희소성의 힘**: 전체 용량 증가 without 계산 증가
- **동적 전문가 활용**: 입력에 따라 적응적 계산
- **분산 학습 필수**: All-to-All 통신 최적화 중요

### 7.2 산업적 시사점
1. **GPT-4 아키텍처**: MoE로 추정 (1.7T, 8 experts)
2. **Mixtral 오픈소스**: Apache 2.0, 상업적 활용 가능
3. **비용 절감**: 추론 FLOPs 75% 절감 → 서빙 비용 감소

### 7.3 출제 예상 각도
- "MoE 아키텍처의 동작 원리 및 라우팅 알고리즘"
- "Switch Transformer vs Mixtral 비교" (Top-1 vs Top-2)
- "MoE의 Load Imbalance 문제 및 해결 방법"
- "분산 환경에서의 MoE 학습 최적화"

---

## 참고문헌
- Switch Transformer 논문 (2021)
- Mixtral 8x7B 논문 (2023)
- DeepSpeed-MoE
- GPT-4 Technical Report
