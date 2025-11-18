---
name: template-selector
description: Help select the most appropriate answer template for IT Professional Examination (정보처리기술사) questions based on question type, topic characteristics, and exam strategy. Use when user is unsure which template to use.
---

# Template Selector (템플릿 선택 도우미)

## Overview

Analyze exam questions and recommend the most appropriate answer template based on question type, topic characteristics (new vs mature technology), and strategic considerations. Provides structured guidance on template selection and customization.

## Selection Workflow

When user asks for template recommendation:

1. **Analyze question**
   - Extract question type keywords
   - Identify topic/technology
   - Determine scope and requirements

2. **Classify question type**
   - 정의형: "~이란?", "정의하시오"
   - 설명형: "설명하시오"
   - 비교형: "비교하시오", "차이점"
   - 절차형: "절차", "프로세스"
   - 분석형: "분석", "문제점과 해결방안"

3. **Classify technology maturity**
   - 신기술형: Recent technology (< 3 years)
   - 성숙기술형: Established technology (> 5 years)

4. **Recommend template**
   - Primary template based on question type
   - Adjustments based on technology maturity
   - Strategic considerations

5. **Provide structure guide**
   - Detailed section-by-section breakdown
   - What to include in each section
   - Time allocation

6. **Offer customization tips**
   - How to adapt template
   - When to deviate
   - Common pitfalls

## Template Selection Guide

### Decision Tree

```
문제 키워드 분석
    ↓
┌───────────────────────────────────────┐
│ 문제 유형은?                           │
└───────────────────────────────────────┘
    ↓
    ├─ "~이란?" / "정의" → 정의형
    ├─ "설명하시오" → 설명형
    ├─ "비교" / "차이점" → 비교형
    ├─ "절차" / "프로세스" → 절차형
    └─ "분석" / "문제점" → 분석형
    ↓
┌───────────────────────────────────────┐
│ 기술 성숙도는?                         │
└───────────────────────────────────────┘
    ↓
    ├─ 신기술 (< 3년) → 신기술형 조정
    └─ 성숙기술 (> 5년) → 성숙기술형 조정
    ↓
┌───────────────────────────────────────┐
│ 최종 템플릿 선택 및 커스터마이징        │
└───────────────────────────────────────┘
```

## Template Recommendation Format

```markdown
# 템플릿 추천

## 문제 분석

**문제:**
> [Question text]

**키워드 분석:**
- 유형 키워드: [정의/설명/비교/절차/분석]
- 주제: [Technology/concept]
- 기술 성숙도: [신기술/성숙기술]
- 추가 요구사항: [If any]

---

## 추천 템플릿: [Template Name]

**선택 이유:**
- [Reason 1]
- [Reason 2]
- [Reason 3]

**적합도: [★★★★★]**

---

## 템플릿 구조

### 1. 서론 (정의) - 3분

**목표:** [What to achieve]

**포함 내용:**
- [Element 1]
- [Element 2]
- [Element 3]

**예시:**
```
[Example opening]
```

**작성 팁:**
- [Tip 1]
- [Tip 2]

---

### 2. 본론 (설명) - 14분

#### 2-1. [첫 번째 항목] (그림) - 7분

**목표:** [What to show]

**다이어그램 유형:**
- [Diagram type recommendation]

**포함 요소:**
- [Component 1]
- [Component 2]

**예시:**
```
[Example diagram]
```

**간글 작성:**
- [What to explain in 간글]

---

#### 2-2. [두 번째 항목] (표) - 7분

**목표:** [What to organize]

**표 구조:**
- 열 구성: [Column structure]
- 행 분류: [Row categories]

**예시:**
```
| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| ... | ... | ... |
```

**간글 작성:**
- [What to summarize in 간글]

---

### 3. 결론 - 3분

**목표:** [What to conclude]

**포함 내용:**
- [Element 1]
- [Element 2]

**예시:**
```
[Example conclusion]
```

---

## 시간 배분 (총 25분)

| 섹션 | 시간 | 비율 |
|------|------|------|
| 서론 | 3분 | 12% |
| 본론 - 그림 | 7분 | 28% |
| 본론 - 표 | 7분 | 28% |
| 결론 | 3분 | 12% |
| 검토 | 2분 | 8% |
| 여유 | 3분 | 12% |

---

## 커스터마이징 가이드

### [신기술/성숙기술]에 따른 조정

**신기술일 경우:**
- 서론: 등장 배경 강조
- 결론: 응용 분야, 발전 방향 상세히

**성숙기술일 경우:**
- 서론: 필요성, 중요성 강조
- 결론: 현재 한계점, 해결 방안 제시

### 분량 조정

**기본 1페이지를 벗어날 경우:**
- 그림 간소화
- 표 항목 수 조정
- 간글 압축

---

## 대안 템플릿

**만약 이 템플릿이 맞지 않는다면:**

### 대안 1: [Alternative template]
- **언제 사용:** [When to use]
- **차이점:** [Differences]

### 대안 2: [Alternative template]
- **언제 사용:** [When to use]
- **차이점:** [Differences]

---

## 체크리스트

작성 전:
- [ ] 문제 유형 정확히 파악
- [ ] 신기술 vs 성숙기술 분류
- [ ] 템플릿 구조 숙지

작성 중:
- [ ] 시간 배분 준수
- [ ] 각 섹션 완성도 확인
- [ ] 간글 빠트리지 않기

작성 후:
- [ ] 서론-본론-결론 완성도 확인
- [ ] 그림+표 모두 포함
- [ ] 조사 생략 확인
- [ ] 명사형 종결 확인

---

## 유사 문제 참고

**비슷한 유형의 기출 문제:**
- [Similar past question 1]
- [Similar past question 2]

**참고 자료:**
- [Reference 1]
- [Reference 2]
```

## Template Library

### 1. 정의형 템플릿

**적용 문제:**
- "Zero Trust Security란 무엇인가?"
- "Platform Engineering을 정의하시오"

**구조:**
- 서론: 명확한 정의 (특징+목적+기술)
- 본론: 기본 개념 설명 (그림: 개념도, 표: 특징 분류)
- 결론: 중요성, 향후 전망

### 2. 설명형 - 신기술형 템플릿

**적용 문제:**
- "Service Mesh에 대해 설명하시오"
- "WebAssembly를 설명하시오"

**구조:**
- 서론: 등장 배경, 기술 정의
- 본론: 아키텍처, 핵심 기능
- 결론: 응용 분야, 발전 방향

### 3. 설명형 - 성숙기술형 템플릿

**적용 문제:**
- "RDBMS Transaction에 대해 설명하시오"
- "Load Balancing을 설명하시오"

**구조:**
- 서론: 필요성, 기술 정의
- 본론: 구조, 특징
- 결론: 현재 한계점, 해결 방안

### 4. 비교형 템플릿

**적용 문제:**
- "Kubernetes와 Docker Swarm을 비교하시오"
- "REST API와 GraphQL의 차이점을 설명하시오"

**구조:**
- 서론: 각 기술 간단 정의
- 본론: 아키텍처 비교 (그림), 특성 비교 (표)
- 결론: 선택 가이드, 융합 활용

### 5. 절차형 템플릿

**적용 문제:**
- "CI/CD 파이프라인 구축 절차를 설명하시오"
- "클라우드 마이그레이션 절차를 설명하시오"

**구조:**
- 서론: 프로세스 정의, 목적
- 본론: 흐름도 (그림), 단계별 활동 (표)
- 결론: 성공 요인, 자동화 방안

### 6. 분석형 템플릿

**적용 문제:**
- "MSA 도입 시 문제점을 분석하고 해결방안을 제시하시오"
- "레거시 시스템의 문제점과 현대화 전략을 제시하시오"

**구조:**
- 서론: 현황, 배경
- 본론: 문제점 분석 (그림: 현 상태), 해결방안 (표: 문제-해결 매칭)
- 결론: 기대효과, 단계적 접근

## Strategic Considerations

### Template Selection Strategy

1. **확실할 때**: 정석 템플릿 사용
2. **애매할 때**: 설명형 기본 템플릿 (가장 안전)
3. **복합형일 때**: 주요 유형 템플릿 + 부분 차용

### Time vs Quality Trade-off

- **25분 전부 사용**: 완성도 최대화
- **20분 제한**: 안전한 시간 확보
- **15분 작성**: 리스크 높음, 비추천

### Common Mistakes

- ❌ 문제 유형 오판하여 잘못된 템플릿 선택
- ❌ 템플릿에 과도하게 얽매여 유연성 상실
- ❌ 신기술/성숙기술 특성 무시
- ❌ 시간 배분 무시하고 한 섹션에 과도한 시간

## Example Usage

**User request:** "이 문제에 어떤 템플릿을 사용해야 할까요? '클라우드 네이티브 애플리케이션의 특징을 설명하시오'"

**Analysis:**
- 유형 키워드: "설명하시오" → 설명형
- 주제: "클라우드 네이티브" → 신기술 (2-3년)
- 추가 요구: "특징" → 특징 중심 서술

**Recommendation:**
- **템플릿**: 설명형 - 신기술형
- **구조**:
  - 서론: Cloud Native 정의 (컨테이너, MSA, 선언적 API)
  - 본론 - 그림: 아키텍처 (MSA + Kubernetes)
  - 본론 - 표: 특징 (확장성, 탄력성, 관찰성 등)
  - 결론: 응용 분야, Serverless와 융합 전망

**Result:** Detailed template recommendation with structure guide and time allocation
