---
name: grading
description: Grade IT Professional Examination (정보관리기술사) answer sheets based on 6 evaluation criteria. Provides detailed scoring, feedback, and improvement suggestions. Use when user wants to evaluate their practice answers.
---

# Grading (채점자)

## Overview

Grade answer sheets for IT Professional Examination following the official 6 evaluation criteria. Provides comprehensive scoring, detailed feedback on strengths and weaknesses, and specific improvement suggestions.

## Grading Workflow

When user submits an answer for grading:

1. **Receive answer and question**
   - Get the question/topic
   - Get the answer to evaluate
   - Identify question type (정의형, 설명형, 비교형, 절차형, 분석형)

2. **Structural analysis**
   - Check 서론-본론-결론 structure
   - Verify diagram presence and quality
   - Verify table presence and quality
   - Check 간글 (explanation) for diagram and table
   - Assess page length (1-page constraint)

3. **Content analysis**
   - Definition quality (characteristics, purpose, technologies)
   - Keyword identification and clarity
   - Technical accuracy
   - Logical flow
   - Professional depth

4. **Evaluate against 6 criteria**
   (See [evaluation-criteria.md](references/evaluation-criteria.md) for details)

   - **첫인상 (First Impression)**: /5 points
     - Structural completeness
     - Visual presentation
     - Readability

   - **출제반영성 (Question Reflection)**: /5 points
     - Addresses question intent
     - Covers required scope
     - Appropriate depth

   - **논리성 (Logical Consistency)**: /5 points
     - Hierarchical structure
     - Logical flow
     - Clear connections between sections

   - **응용능력 (Application Ability)**: /5 points
     - Beyond memorization
     - Explanatory power
     - Practical examples

   - **특화 (Specialization)**: /5 points
     - Technical terminology accuracy
     - Professional depth
     - Latest trends reflection

   - **견해 (Perspective)**: /5 points
     - Insightful opinions
     - Critical thinking
     - Future prospects

5. **Style evaluation**
   - Particle omission (조사 생략)
   - Noun-form endings (명사형 종결)
   - Conciseness
   - Keyword emphasis

6. **Generate detailed feedback**
   - Total score (/30 points)
   - Individual criterion scores
   - Strengths (잘된 점)
   - Weaknesses (개선 필요한 점)
   - Specific improvement suggestions
   - Example improvements

7. **Provide improvement plan**
   - Priority areas to improve
   - Concrete action items
   - Reference materials

## Scoring Rubric

Use the detailed rubric in [scoring-rubric.md](references/scoring-rubric.md)

### Score Levels
- **5 points**: Excellent - exceeds expectations
- **4 points**: Good - meets expectations well
- **3 points**: Adequate - meets basic expectations
- **2 points**: Needs improvement - below expectations
- **1 point**: Poor - significantly below expectations

### Passing Criteria
- Total score 18+ / 30: Pass level
- Total score 24+ / 30: High score level
- Each criterion minimum 3+ / 5 recommended

## Feedback Template

```markdown
# 채점 결과

## 총점: [X]/30

| 평가 항목 | 점수 | 평가 내용 |
|----------|------|-----------|
| 첫인상 | [X]/5 | [Brief assessment] |
| 출제반영성 | [X]/5 | [Brief assessment] |
| 논리성 | [X]/5 | [Brief assessment] |
| 응용능력 | [X]/5 | [Brief assessment] |
| 특화 | [X]/5 | [Brief assessment] |
| 견해 | [X]/5 | [Brief assessment] |

## 잘된 점 ✓

1. **[Aspect 1]**
   - [Specific positive point]
   - [Example from answer]

2. **[Aspect 2]**
   - [Specific positive point]
   - [Example from answer]

## 개선 필요한 점 ⚠

1. **[Aspect 1]** - 우선순위: 높음/중간/낮음
   - **문제점**: [Specific issue]
   - **개선 방안**: [Concrete suggestion]
   - **예시**:
     ```
     현재: [Current problematic text]
     개선: [Improved version]
     ```

2. **[Aspect 2]** - 우선순위: 높음/중간/낮음
   - **문제점**: [Specific issue]
   - **개선 방안**: [Concrete suggestion]
   - **예시**:
     ```
     현재: [Current problematic text]
     개선: [Improved version]
     ```

## 구조 분석

- **서론**: [분석 내용]
- **본론 - 그림**: [분석 내용]
- **본론 - 표**: [분석 내용]
- **결론**: [분석 내용]

## 개선 우선순위

1. [Most important improvement]
2. [Second priority]
3. [Third priority]

## 참고 사항

- [Additional tips]
- [Reference materials]
```

## Grading Principles

1. **Objective evaluation**
   - Follow official criteria strictly
   - No personal bias
   - Evidence-based scoring

2. **Constructive feedback**
   - Balance positive and negative
   - Specific, actionable suggestions
   - Encouraging tone

3. **Educational value**
   - Help user understand weaknesses
   - Provide clear improvement path
   - Reference to guidelines

4. **Comparative assessment**
   - Compare to high-scoring examples
   - Identify gaps
   - Show what excellence looks like

## Common Issues to Check

### Structural Issues
- Missing 서론/본론/결론
- No diagram or table
- Missing 간글
- Poor visual layout

### Content Issues
- Weak definition (missing characteristics/purpose/technologies)
- Insufficient technical depth
- Missing key concepts
- No future prospects

### Style Issues
- Particles not omitted
- Not ending with noun form
- Too verbose
- Keywords not clear

### Logic Issues
- Poor hierarchical structure
- Disconnected sections
- Unclear flow

## Reference Materials

For detailed evaluation criteria and scoring guidelines:
- **Evaluation criteria**: [evaluation-criteria.md](references/evaluation-criteria.md) - Detailed explanation of 6 criteria
- **Scoring rubric**: [scoring-rubric.md](references/scoring-rubric.md) - Point-by-point scoring guide
- **Feedback templates**: [feedback-templates.md](references/feedback-templates.md) - Sample feedback for common issues

## Output Format

Provide grading results in structured markdown format with:
- Overall score and breakdown
- Detailed feedback
- Specific examples
- Improvement priorities
- Actionable recommendations

## Example Usage

**User request:** "다음 답안을 채점해주세요. [문제: DevOps에 대해 설명하시오] [답안: ...]"

**Process:**
1. **Analyze structure**: Check 서론-본론-결론, diagram, table
2. **Evaluate content**: Definition quality, technical depth, completeness
3. **Score each criterion**: Apply 6 criteria with evidence
4. **Identify strengths**: What's done well
5. **Identify weaknesses**: What needs improvement with specific examples
6. **Provide improvements**: Concrete suggestions with before/after examples
7. **Prioritize actions**: What to fix first

**Result:** Comprehensive grading report with total score, detailed feedback, and improvement plan
