---
name: topic-generator
description: Generate structured answer sheets for IT Professional Examination (정보관리기술사) topics. Use when user requests to create answer sheet for a specific technology topic following Korean PE exam format with definition, diagrams, tables, and concise explanations. Follows strict 1-page format with omitted particles, clear structure, and emphasis on keywords.
---

# Topic Generator

## Overview

Generate structured answer sheets for IT Professional Examination topics following the Korean exam answer format. Produces comprehensive yet concise 1-page documents with definition, process diagram, classification table, and brief explanations.

## Answer Sheet Workflow

When user requests an answer for a specific topic:

1. **Research the topic with trusted sources**
   - Use reference websites in priority order (See [reference-websites.md](references/reference-websites.md))
   - Start with official documentation (Microsoft, AWS, Google Cloud, etc.)
   - Check IT Wiki (itwiki.kr) for structured Korean content
   - Review tech blogs for practical examples
   - Verify information from multiple sources

2. **Analyze the topic and question type**
   - Identify core concepts and keywords
   - Determine question type: 정의형, 설명형, 비교형, 절차형, 분석형
   - Classify as new technology vs. mature technology
   - Decide appropriate structure and template

3. **Create introduction (서론)**
   - Write clear definition including characteristics, purpose, technologies
   - For new tech: emphasize background and emergence
   - For mature tech: emphasize necessity and importance
   - End with noun form (명사형)
   - Keep to 2-3 sentences

4. **Create body (본론) - Part 1: Diagram**
   - Show relationships between components
   - Display architecture, process, or flow
   - Use ASCII art or markdown-based diagrams
   - Add arrows for flow visualization
   - Write 간글 (2-3 sentences) explaining the diagram

5. **Create body (본론) - Part 2: Table**
   - Use 3-column format: 구분 (Category) | 세부 항목 (Details) | 설명 (Description)
   - Group logically with clear keywords
   - Organize in meaningful order
   - Write 간글 (2-3 sentences) explaining the table

6. **Create conclusion (결론)**
   - For mature tech: discuss problems and solutions
   - For new tech: discuss application areas and development direction
   - Include expected effects and technology trends
   - Keep to 2-3 sentences

7. **Review against 6 evaluation criteria**
   - 첫인상: Structural and visual completeness
   - 출제반영성: Address question intent
   - 논리성: Logical structure and flow
   - 응용능력: Application and explanation ability
   - 특화: Professional expertise
   - 견해: Insightful perspective
   - Use checklist in [high-scoring-strategies.md](references/high-scoring-strategies.md)

8. **Final refinement**
   - Ensure 1-page length
   - Remove unnecessary words
   - Verify particle omission (조사 생략)
   - Check keyword clarity
   - Confirm 서론-본론-결론 structure

## Writing Style

**Critical requirements:**
- **Omit particles**: "DevOps는" → "DevOps"
- **Concise and clear**: No redundant modifiers
- **Keyword-focused**: Emphasize technical terms
- **Noun-form endings**: End definitions with nouns
- **1-page constraint**: Compress to essential content
- **22줄 × 19칸 규격**: Follow official answer sheet format (see below)

## Answer Sheet Format (22줄 × 19칸) ⭐ NEW

**Official Format Rules:**
- Maximum **22 lines (rows)**
- Maximum **19 cells per line (columns)**
- Cell counting: 한글 1자=1칸, 영문/숫자 2자=1칸, 특수문자 2자=1칸

**Format Compliance Guidelines:**

1. **Line Management**
   - Keep answers within 18-20 lines (buffer for safety)
   - Break long lines before reaching 19 cells
   - Use concise language to fit within limits

2. **Cell Counting Examples**
   ```
   "OAuth 2.0 인증" = 6칸 (OAuth=2.5칸, 2.0=1칸, 인증=2칸)
   "정보보안" = 4칸 (4 한글)
   "API Gateway" = 5칸 (10 영문 / 2 = 5칸)
   ```

3. **Line Breaking Strategy**
   - Break after diagram labels
   - Break between table rows naturally
   - Keep related content together
   - Use bullet points to save cells

4. **Content Compression**
   - Omit particles rigorously
   - Use abbreviations where appropriate
   - Prioritize keywords over explanatory text
   - Combine related points into single lines

5. **Validation**
   - After generating, mentally count cells per line
   - If a line exceeds 17 cells, consider breaking it
   - Aim for average 14-16 cells per line

## Structure Template

```markdown
# [Topic Name]

1. [Topic] 정의
   - [2-3 sentence definition including characteristics, purpose, technologies]

2. [Topic] 설명
   1) [Topic]의 [구조/프로세스/아키텍처] (그림)

      [Diagram showing component relationships]

      - 간글: [2-3 sentence explanation]

   2) [Topic]의 [분류/유형/특징] (표)

      | 구분 | 세부 항목 | 설명 |
      |------|-----------|------|
      | [Category1] | [Item1-1] | [Description] |
      | | [Item1-2] | [Description] |
      | [Category2] | [Item2-1] | [Description] |
      | | [Item2-2] | [Description] |
      | [Category3] | [Item3-1] | [Description] |
      | | [Item3-2] | [Description] |

      - 간글: [2-3 sentence explanation]
```

## Detailed Guidelines

For comprehensive writing principles, high-scoring strategies, and reference materials:
- **Writing guidelines**: See [guidelines.md](references/guidelines.md) for detailed rules
- **Structure templates**: See [template.md](references/template.md) for diagram and table examples
- **High-scoring strategies**: See [high-scoring-strategies.md](references/high-scoring-strategies.md) for:
  - 서론-본론-결론 structure guidance
  - 6 evaluation criteria (첫인상, 출제반영성, 논리성, 응용능력, 특화, 견해)
  - Differentiation strategies
  - Template selection guide (신기술형, 성숙기술형, 비교형, 절차형)
  - Time management strategies
- **Reference websites**: See [reference-websites.md](references/reference-websites.md) for:
  - Priority-ordered trusted sources
  - Official documentation (Microsoft, AWS, Google Cloud)
  - IT Wiki and standards (IETF, W3C, IEEE)
  - Tech blogs (Naver D2, Kakao, Woowa Bros, etc.)
  - Topic-specific recommended sources

## Output Format

Save output as markdown file in `self-test/` or `sub-notes/` directory:
- Filename: `[topic-name].md`
- Format: UTF-8 markdown
- Structure: Follow template exactly

## Examples

**User request:** "DevOps에 대해 설명하시오"

**Process:**
1. **Research**: Check AWS DevOps documentation, IT Wiki, Naver D2 blog
2. **Analyze**: DevOps = Development + Operations integration, 설명형 question, mature technology
3. **Introduction**: Define DevOps emphasizing automation, collaboration, continuous delivery
4. **Body - Diagram**: Create CI/CD pipeline flow showing stages + 간글
5. **Body - Table**: Categorize by development phase, operation phase, tools + 간글
6. **Conclusion**: Discuss challenges and solutions, future trends (serverless, GitOps)
7. **Review**: Check against 6 evaluation criteria
8. **Refine**: Verify 서론-본론-결론 structure, particle omission, 1-page constraint

**Result:** Complete answer sheet following 서론-본론-결론 structure with high-scoring strategies applied

---

**User request:** "Kubernetes와 Docker Swarm을 비교하시오"

**Process:**
1. **Research**: Kubernetes official docs, Docker Swarm docs, comparison articles
2. **Analyze**: 비교형 question, select comparison template
3. **Introduction**: Define both technologies briefly
4. **Body - Diagram**: Side-by-side architecture comparison + 간글
5. **Body - Table**: Compare features (scalability, complexity, ecosystem) + 간글
6. **Conclusion**: Selection guide based on use case, hybrid approach
7. **Review**: Check 견해 (perspective) - provide insights on selection criteria
8. **Refine**: Ensure balanced comparison, clear differentiation

**Result:** Comparative analysis with professional insights and practical selection guidance
