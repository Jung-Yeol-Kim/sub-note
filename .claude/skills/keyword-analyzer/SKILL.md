---
name: keyword-analyzer
description: Analyze IT Professional Examination (정보처리기술사) answers to extract keywords, identify missing critical terms, assess keyword hierarchy, and evaluate keyword density. Use when user wants to check if their answer covers essential concepts.
---

# Keyword Analyzer (키워드 분석기)

## Overview

Analyze answer sheets to identify present keywords, detect missing critical terms, evaluate keyword organization and hierarchy, and assess keyword density and prominence. Helps ensure answers cover all essential concepts.

## Analysis Workflow

When user submits an answer for keyword analysis:

1. **Extract existing keywords**
   - Identify all technical terms in answer
   - Categorize by domain/concept
   - Note frequency and placement

2. **Identify required keywords**
   - Based on question topic
   - Expected key concepts
   - Industry standard terminology
   - Latest technology terms

3. **Gap analysis**
   - Compare present vs required keywords
   - Identify critical missing terms
   - Assess coverage completeness
   - Prioritize missing keywords

4. **Hierarchy analysis**
   - Evaluate keyword organization
   - Check if grouped logically
   - Assess hierarchy clarity (대-중-소 분류)

5. **Density evaluation**
   - Keyword prominence
   - Appropriate repetition
   - Balance across sections

6. **Recommendations**
   - Which keywords to add
   - Where to add them
   - How to organize better
   - Terminology improvements

## Analysis Report Format

```markdown
# 키워드 분석 결과

## 1. 발견된 키워드 (✓)

### 핵심 개념
- [Keyword 1] - 출현 [N]회, 위치: [서론/본론/결론]
- [Keyword 2] - 출현 [N]회, 위치: [서론/본론/결론]

### 기술 용어
- [Tech term 1]
- [Tech term 2]

### 도구/플랫폼
- [Tool 1]
- [Tool 2]

---

## 2. 누락된 필수 키워드 (✗)

### 높은 우선순위 (반드시 추가)
- **[Missing keyword 1]**
  - 중요도: ★★★
  - 이유: [Why critical]
  - 추가 위치: [Where to add]
  - 사용 예시: "[Example sentence]"

- **[Missing keyword 2]**
  - 중요도: ★★★
  - 이유: [Why critical]
  - 추가 위치: [Where to add]
  - 사용 예시: "[Example sentence]"

### 중간 우선순위 (추가 권장)
- **[Missing keyword 3]**
  - 중요도: ★★
  - 이유: [Why important]
  - 추가 위치: [Where to add]

### 낮은 우선순위 (선택사항)
- [Missing keyword 4]

---

## 3. 키워드 계층 구조 분석

### 현재 구조
```
[대분류]
  ├─ [중분류]
  │   ├─ [소분류]
  │   └─ [소분류]
  └─ [중분류]
      └─ [소분류]
```

### 평가
- ✓ 잘된 점: [What's good about hierarchy]
- ⚠ 개선점: [Hierarchy issues]

### 개선된 구조
```
[대분류]
  ├─ [중분류]
  │   ├─ [소분류]
  │   ├─ [소분류]
  │   └─ [소분류]
  ├─ [중분류]
  │   ├─ [소분류]
  │   └─ [소분류]
  └─ [중분류]
      ├─ [소분류]
      └─ [소분류]
```

---

## 4. 키워드 밀도 분석

| 섹션 | 키워드 수 | 전체 단어 대비 | 평가 |
|------|-----------|----------------|------|
| 서론 | [N] | [X]% | [Good/Low/High] |
| 본론-그림 | [N] | [X]% | [Good/Low/High] |
| 본론-표 | [N] | [X]% | [Good/Low/High] |
| 결론 | [N] | [X]% | [Good/Low/High] |

**권장 밀도:**
- 서론: 15-20%
- 본론: 20-30%
- 결론: 15-20%

---

## 5. 용어 정확성 분석

### 부정확한 표현
| 현재 표현 (일반적) | 개선 표현 (전문적) |
|-------------------|-------------------|
| "[Generic term]" | "[Specific technical term]" |

### 약어 사용
| 현재 | 개선 |
|------|------|
| "[Abbreviation without full form]" | "[Full Name (Abbreviation)]" |

---

## 6. 키워드 강조도 분석

### 충분히 강조된 키워드 ✓
- [Keyword]: 정의, 표, 간글에 모두 등장

### 불충분하게 강조된 키워드 ⚠
- [Keyword]: 한 번만 언급, 맥락 부족

### 개선 방안
- [Keyword]: [Where to emphasize more, how]

---

## 7. 최신 트렌드 키워드 반영도

### 포함된 최신 키워드 ✓
- [Recent term 1] (2024)
- [Recent term 2] (2023)

### 누락된 최신 키워드 ✗
- [Missing recent term]: [Why relevant, where to add]

---

## 8. 개선 권장사항

### 즉시 개선 (High Impact)
1. [Add critical missing keyword X in section Y]
2. [Replace generic term A with specific term B]
3. [Reorganize keywords into better hierarchy]

### 중기 개선 (Medium Impact)
1. [Add additional context for keyword C]
2. [Include recent trend keyword D]

### 장기 개선 (Low Impact)
1. [Optional enhancement]

---

## 9. 참고: 토픽별 필수 키워드 체크리스트

### [Topic Name] 필수 키워드
- [ ] [Required keyword 1]
- [ ] [Required keyword 2]
- [ ] [Required keyword 3]
- [ ] [Required keyword 4]
- [ ] [Required keyword 5]

**커버리지: [X]% ([Y]/[Z] 키워드)**
```

## Keyword Database

The analyzer maintains topic-specific required keywords:

### Example: Kubernetes
**필수 키워드:**
- Control Plane, Worker Node
- Pod, Service, Ingress
- etcd, API Server, Scheduler
- kubelet, kube-proxy
- Container Runtime
- Declarative API, Desired State
- Self-healing, Auto-scaling

### Example: DevOps
**필수 키워드:**
- CI/CD Pipeline
- Automation, Collaboration
- Infrastructure as Code
- Continuous Integration, Continuous Delivery
- GitOps
- Monitoring, Observability
- Shift-Left

### Example: Zero Trust
**필수 키워드:**
- Never Trust, Always Verify
- Least Privilege, Micro-segmentation
- Identity-based Access
- Continuous Verification
- Zero Trust Network Access (ZTNA)
- Software Defined Perimeter (SDP)

## Analysis Principles

1. **Comprehensiveness**: Check against full required keyword list
2. **Context-aware**: Keywords should appear with proper context
3. **Hierarchy-conscious**: Evaluate organization, not just presence
4. **Trend-aware**: Include latest terminology
5. **Actionable**: Provide specific where/how to add keywords

## Example Usage

**User request:** "이 답안의 키워드를 분석해주세요. [문제: Kubernetes] [답안: ...]"

**Process:**
1. Extract all keywords from answer
2. Load Kubernetes required keyword list
3. Compare and identify gaps
4. Analyze hierarchy and organization
5. Check keyword density
6. Provide detailed recommendations

**Result:** Comprehensive keyword analysis with priority-based improvement suggestions
