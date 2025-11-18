---
name: answer-reviewer
description: Provide detailed, line-by-line review of IT Professional Examination (정보처리기술사) answer sheets with specific improvement suggestions. More detailed than grading, focuses on actionable feedback. Use when user wants in-depth review with alternative expressions and examples.
---

# Answer Reviewer (답안 리뷰어)

## Overview

Provide comprehensive, detailed review of answer sheets beyond basic grading. Offers line-by-line feedback, alternative expressions, concrete examples, and reference materials. Focuses on helping users improve specific aspects of their writing.

## Review Workflow

When user submits an answer for detailed review:

1. **Initial assessment**
   - Read through entire answer
   - Identify overall strengths and weaknesses
   - Note structure and completeness

2. **Line-by-line review**
   - Analyze each section (서론, 본론, 결론)
   - Identify specific issues in each sentence/paragraph
   - Mark areas for improvement

3. **Provide detailed feedback**
   - **Structure**: Organization and flow
   - **Content**: Completeness and accuracy
   - **Expression**: Writing style and clarity
   - **Technical depth**: Terminology and concepts

4. **Suggest alternatives**
   - Rewrite problematic sentences
   - Provide better expressions
   - Show concrete examples
   - Demonstrate improved versions

5. **Reference materials**
   - Link to relevant documentation
   - Suggest additional reading
   - Provide example answers

6. **Action plan**
   - Prioritized improvement list
   - Specific practice recommendations
   - Resources for weak areas

## Review Format

```markdown
# 상세 답안 리뷰

## 전체 평가

**강점:**
- [Overall strength 1]
- [Overall strength 2]

**개선 영역:**
- [Overall weakness 1]
- [Overall weakness 2]

---

## 섹션별 상세 리뷰

### 서론 (정의)

**원본:**
> [User's original text]

**분석:**
- ✓ 잘된 점: [Specific positive]
- ⚠ 개선점: [Specific issue]

**제안:**
> [Improved version]

**설명:**
[Why this is better, what changed, what to learn]

---

### 본론 - 그림

**원본:**
> [User's diagram]

**분석:**
- ✓ 잘된 점: [What works]
- ⚠ 개선점: [What needs improvement]

**제안:**
> [Improved diagram]

**설명:**
[How to improve, additional components to add]

---

### 본론 - 표

**원본:**
[User's table]

**분석:**
- ✓ 잘된 점: [Good aspects]
- ⚠ 개선점: [Issues]

**제안:**
[Improved table]

**설명:**
[Better grouping, clearer categories, more detail]

---

### 간글

**원본:**
> [User's 간글]

**분석:**
- ⚠ 문제점: [Issues]

**제안:**
> [Improved 간글]

**설명:**
[Key improvements, what makes it stronger]

---

### 결론

**원본:**
> [User's conclusion]

**분석:**
- ✓ 잘된 점: [Positives]
- ⚠ 개선점: [Issues]

**제안:**
> [Improved conclusion]

**설명:**
[How to make more insightful, forward-looking]

---

## 표현 개선 사항

### 조사 생략
| 원문 | 개선 |
|------|------|
| "DevOps는 개발과 운영을 통합하는" | "DevOps, 개발과 운영 통합하는" |

### 명사형 종결
| 원문 | 개선 |
|------|------|
| "~를 제공합니다" | "~를 제공하는 플랫폼" |

### 간결성
| 원문 | 개선 |
|------|------|
| "매우 중요한 역할을 수행하게 됩니다" | "핵심 역할 수행" |

---

## 기술 용어 개선

| 원문 (일반적) | 개선 (전문적) |
|--------------|--------------|
| "빠른 처리" | "지연시간 10ms 이하, 처리량 초당 10,000 TPS" |
| "데이터 복제" | "Master-Slave Replication, Async Replication" |
| "성능 향상" | "처리 속도 3배 향상, 응답시간 50% 감소" |

---

## 누락된 핵심 키워드

- [ ] [Missing keyword 1]: [Why important, where to add]
- [ ] [Missing keyword 2]: [Why important, where to add]
- [ ] [Missing keyword 3]: [Why important, where to add]

---

## 개선 우선순위

1. **[High Priority]** [Issue and solution]
2. **[Medium Priority]** [Issue and solution]
3. **[Low Priority]** [Issue and solution]

---

## 참고 자료

- [Topic] 공식 문서: [Link]
- 추천 블로그: [Link]
- 유사 문제 답안 예시: [Link]

---

## 실천 과제

1. [Specific practice task 1]
2. [Specific practice task 2]
3. [Specific practice task 3]
```

## Key Differences from Grading Skill

**Grading (채점):**
- Assigns numerical scores
- Evaluates based on 6 criteria
- Overall assessment
- Pass/fail level feedback

**Reviewing (리뷰):**
- Line-by-line detailed feedback
- Specific text improvements
- Alternative expressions
- Concrete rewrite examples
- Deep dive into each section
- Learning-focused

## Review Principles

1. **Be specific**: Point to exact text, not general areas
2. **Show, don't tell**: Provide actual rewrites, not just "make it better"
3. **Explain why**: Help user understand what makes it better
4. **Be constructive**: Balance criticism with encouragement
5. **Prioritize**: Not everything needs fixing, focus on high-impact changes
6. **Provide context**: Link improvements to evaluation criteria

## Common Review Areas

### Structure
- Incomplete 서론-본론-결론
- Missing sections (diagram, table, 간글)
- Poor flow between sections
- Unclear headings

### Content
- Missing key concepts
- Insufficient depth
- Factual errors
- Outdated information

### Expression
- Particles not omitted
- Verbose writing
- Not noun-form endings
- Unclear keywords

### Technical
- Generic terms vs specific terminology
- Lack of concrete examples
- Surface-level vs deep understanding
- Missing latest trends

## Example Usage

**User request:** "이 답안을 상세히 리뷰해주세요. [문제] [답안]"

**Process:**
1. Read entire answer
2. Identify 3-5 major improvement areas
3. Review each section with specific feedback
4. Rewrite problematic parts
5. Suggest alternative expressions
6. Provide reference materials
7. Create action plan

**Result:** Comprehensive review with actionable improvements and learning points
