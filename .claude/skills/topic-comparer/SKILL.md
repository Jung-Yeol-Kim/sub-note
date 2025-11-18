---
name: topic-comparer
description: Compare multiple answer sheets for the same IT Professional Examination (정보처리기술사) topic, analyze differences in approach, quality, and effectiveness. Use when user wants to compare their answers with others or track improvement over time.
---

# Topic Comparer (답안 비교 분석)

## Overview

Compare multiple answer sheets for the same topic to identify differences in approach, structure, content coverage, quality, and effectiveness. Helps users understand various approaches and track their improvement over multiple attempts.

## Comparison Workflow

When user submits multiple answers for comparison:

1. **Identify comparison type**
   - Same user, different attempts (improvement tracking)
   - Same user, different approaches (A/B testing)
   - User answer vs model answer
   - Multiple users' answers (learning from peers)

2. **Structural comparison**
   - Compare 서론-본론-결론 organization
   - Diagram and table presence and quality
   - Overall completeness

3. **Content comparison**
   - Keyword coverage
   - Depth of explanation
   - Technical accuracy
   - Completeness

4. **Quality comparison**
   - Based on 6 evaluation criteria
   - Writing style
   - Professional depth
   - Insightfulness

5. **Highlight differences**
   - Unique strengths of each
   - Unique weaknesses of each
   - What one has that others lack

6. **Provide synthesis**
   - Best elements from each
   - Ideal combined approach
   - Learning points

## Comparison Report Format

```markdown
# 답안 비교 분석

## 문제
[Question text]

## 비교 대상
- **답안 A**: [Description - e.g., "첫 번째 시도", "사용자 답안", "모범 답안"]
- **답안 B**: [Description]
- **답안 C**: [Description] (optional)

---

## 구조 비교

| 항목 | 답안 A | 답안 B | 답안 C |
|------|--------|--------|--------|
| 서론 (정의) | ✓ (2문장) | ✓ (3문장) | ✓ (2문장) |
| 본론 - 그림 | ✓ 있음 | ✗ 없음 | ✓ 있음 |
| 본론 - 표 | ✓ 있음 | ✓ 있음 | ✓ 있음 |
| 간글 (그림) | ✓ 있음 | - | ✓ 있음 |
| 간글 (표) | ✓ 있음 | ✓ 있음 | ✓ 있음 |
| 결론 | ✓ 있음 | ✗ 없음 | ✓ 있음 |
| 구조 완성도 | 100% | 60% | 100% |

**분석:**
- 답안 A, B: 구조 완성도 차이 큼
- 답안 C: 가장 완벽한 구조

---

## 키워드 커버리지 비교

### 필수 키워드 (예: Kubernetes)

| 키워드 | 답안 A | 답안 B | 답안 C |
|--------|--------|--------|--------|
| Control Plane | ✓ | ✓ | ✓ |
| Worker Node | ✓ | ✓ | ✓ |
| Pod | ✓ | ✗ | ✓ |
| Service | ✓ | ✓ | ✓ |
| etcd | ✗ | ✓ | ✓ |
| API Server | ✓ | ✗ | ✓ |
| kubelet | ✗ | ✗ | ✓ |
| Declarative API | ✗ | ✗ | ✓ |
| Self-healing | ✓ | ✗ | ✓ |
| **커버리지** | **6/9 (67%)** | **4/9 (44%)** | **9/9 (100%)** |

**분석:**
- 답안 C: 모든 필수 키워드 포함 ★
- 답안 A: 중요 키워드 일부 누락
- 답안 B: 커버리지 가장 낮음

---

## 내용 깊이 비교

### 정의 (서론)

**답안 A:**
> "Kubernetes, 컨테이너 오케스트레이션 플랫폼"

**답안 B:**
> "Kubernetes는 컨테이너를 관리하는 도구입니다"

**답안 C:**
> "Kubernetes, 선언적 API 기반 컨테이너 오케스트레이션 플랫폼으로 자동 배포, 스케일링, 관리 제공하는 CNCF 졸업 프로젝트"

**평가:**
- 답안 C: 특징, 목적, 배경 모두 포함 ★★★
- 답안 A: 간결하나 정보 부족 ★
- 답안 B: 조사 미생략, 명사형 미종결 ✗

---

### 다이어그램 비교

**답안 A:**
```
[Control Plane]
  - API Server
  - Scheduler
     ↓
[Worker Node]
  - kubelet
  - Pod
```
- 평가: 기본 구조, 간단함 ★★

**답안 B:**
없음
- 평가: 누락 ✗

**답안 C:**
```
[Control Plane]
  ├─ API Server ←→ etcd
  ├─ Scheduler
  └─ Controller Manager
         ↓ (API 통신)
[Worker Nodes]
  ├─ Node 1
  │   ├─ kubelet → Container Runtime
  │   ├─ kube-proxy
  │   └─ Pods
  └─ Node 2
      └─ ...
```
- 평가: 상세하고 완전함, 관계 명확 ★★★

**분석:**
- 답안 C: 컴포넌트 간 관계 명확, etcd 포함
- 답안 A: 기본적이나 etcd, Controller Manager 누락
- 답안 B: 시각 자료 없어 큰 감점

---

### 표 비교

**답안 A:** 2열 표 (항목 | 설명)
- 그룹핑 약함

**답안 B:** 3열 표 (구분 | 항목 | 설명)
- 그룹핑 있으나 항목 부족

**답안 C:** 3열 표 (구분 | 세부 항목 | 설명)
- Control Plane, Worker Node, 네트워킹으로 명확히 분류
- 각 항목별 상세 설명

**평가:**
- 답안 C: 계층적 구조 우수 ★★★
- 답안 B: 구조는 있으나 내용 부족 ★★
- 답안 A: 평면적 ★

---

## 6대 평가 기준 비교

| 기준 | 답안 A | 답안 B | 답안 C |
|------|--------|--------|--------|
| 첫인상 | 4/5 | 2/5 | 5/5 |
| 출제반영성 | 3.5/5 | 2.5/5 | 5/5 |
| 논리성 | 3/5 | 2/5 | 4.5/5 |
| 응용능력 | 3/5 | 2/5 | 5/5 |
| 특화 | 3/5 | 2.5/5 | 4.5/5 |
| 견해 | 2.5/5 | 2/5 | 4/5 |
| **총점** | **19/30** | **13/30** | **28/30** |

---

## 강점 비교

### 답안 A의 강점
- ✓ 기본 구조 갖춤
- ✓ 간결한 표현

### 답안 B의 강점
- ✓ 3열 표 사용 (구조는 좋음)

### 답안 C의 강점
- ✓ 완벽한 구조
- ✓ 모든 필수 키워드 포함
- ✓ 상세한 다이어그램
- ✓ 계층적 표 구성
- ✓ 실무 사례 포함
- ✓ 독창적 견해 제시

---

## 약점 비교

### 답안 A의 약점
- ⚠ 일부 필수 키워드 누락 (etcd, kubelet)
- ⚠ 다이어그램 간단함
- ⚠ 견해 부족
- ⚠ 실무 사례 없음

### 답안 B의 약점
- ⚠ 다이어그램 없음 (치명적)
- ⚠ 결론 없음
- ⚠ 키워드 커버리지 낮음
- ⚠ 조사 미생략
- ⚠ 깊이 부족

### 답안 C의 약점
- (거의 없음, 만점에 가까움)
- 일부 최신 트렌드 추가 가능 (매우 사소)

---

## 접근 방식 비교

| 측면 | 답안 A | 답안 B | 답안 C |
|------|--------|--------|--------|
| 전략 | 간결함 중시 | 텍스트 위주 | 완성도 중시 |
| 강조점 | 핵심만 간단히 | 설명 중심 | 구조+내용+견해 |
| 시간 배분 | 빠르게 작성 (15분?) | 중간 (20분?) | 충분히 활용 (25분) |
| 리스크 | 내용 부족 | 구조 불완전 | 없음 |

---

## 베스트 프랙티스 종합

답안 C를 기준으로 하되, 다음 요소 참고:

### 서론
```
[답안 C 활용]
"Kubernetes, 선언적 API 기반 컨테이너 오케스트레이션 플랫폼으로
자동 배포, 스케일링, 관리 제공하는 CNCF 졸업 프로젝트"
```

### 본론 - 그림
```
[답안 C의 상세한 다이어그램 활용]
- 모든 주요 컴포넌트 포함
- 관계 명확히 표시
- 화살표로 통신 흐름 표현
```

### 본론 - 표
```
[답안 C의 계층적 구조 활용]
| 구분 | 세부 항목 | 설명 |
- Control Plane, Worker Node, 네트워킹으로 분류
```

### 결론
```
[답안 C 활용]
- 미래 전망 구체적
- AI/ML, Edge Computing 융합 언급
```

---

## 학습 포인트

### 답안 A → 답안 C로 개선하려면
1. 누락된 키워드 추가 (etcd, kubelet, Declarative API)
2. 다이어그램 상세화 (컴포넌트 간 관계 표시)
3. 실무 사례 추가
4. 견해 강화 (미래 전망, 융합 기술)

### 답안 B → 답안 C로 개선하려면
1. **즉시**: 다이어그램 추가 (필수!)
2. **즉시**: 결론 추가
3. 조사 생략
4. 명사형 종결
5. 키워드 대폭 보강
6. 깊이 있는 설명

---

## 개선 추이 (시간 경과별 비교 시)

*답안 A: 1차 시도, 답안 B: 2차 시도라고 가정*

| 항목 | 1차 → 2차 변화 | 평가 |
|------|----------------|------|
| 구조 | 개선됨 | ↗ |
| 키워드 | 감소 | ↘ (주의 필요!) |
| 깊이 | 유사 | → |
| 점수 | 19 → 13 | ↘ 퇴보 |

**권장사항:**
- 2차 시도가 오히려 퇴보
- 1차의 강점 (구조, 키워드) 유지하며 개선 필요
- 다이어그램 추가에만 집중하지 말고 전체 균형 유지

---

## 권장 학습 방향

1. **답안 C의 접근 방식 학습**
   - 완벽한 구조
   - 충실한 키워드 커버리지
   - 실무 사례 포함

2. **단계적 개선**
   - 1단계: 구조 완성 (서론-본론-결론)
   - 2단계: 키워드 모두 포함
   - 3단계: 깊이와 견해 강화

3. **반복 연습**
   - 같은 주제로 여러 번 작성
   - 매번 이전 답안 참고하여 개선
   - 점수 향상 추이 확인
```

## Comparison Types

### Improvement Tracking
- User's 1st attempt vs 2nd attempt vs 3rd attempt
- Show progress over time
- Identify persistent weaknesses

### A/B Testing
- User's approach A vs approach B
- Which structure works better
- Experiment with different templates

### Benchmark Comparison
- User answer vs model answer
- Identify gaps
- Learn from excellence

### Peer Learning
- Multiple users' answers
- Different perspectives
- Diverse approaches

## Example Usage

**User request:** "같은 주제로 작성한 3개 답안을 비교해주세요. [문제] [답안1] [답안2] [답안3]"

**Process:**
1. Analyze structure of each
2. Compare keyword coverage
3. Evaluate content depth
4. Score based on 6 criteria
5. Identify unique strengths/weaknesses
6. Synthesize best practices
7. Show improvement trajectory (if temporal)

**Result:** Comprehensive comparison report with learning points and improvement recommendations
