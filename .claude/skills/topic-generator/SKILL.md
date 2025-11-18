---
name: topic-generator
description: Generate structured answer sheets for IT Professional Examination (정보처리기술사) topics. Use when user requests to create answer sheet for a specific technology topic following Korean PE exam format with definition, diagrams, tables, and concise explanations. Follows strict 1-page format with omitted particles, clear structure, and emphasis on keywords.
---

# Topic Generator

## Overview

Generate structured answer sheets for IT Professional Examination topics following the Korean exam answer format. Produces comprehensive yet concise 1-page documents with definition, process diagram, classification table, and brief explanations.

## Answer Sheet Workflow

When user requests an answer for a specific topic:

1. **Analyze the topic**
   - Identify core concepts and keywords
   - Determine appropriate structure (architecture, process, classification, etc.)

2. **Create definition (1단락)**
   - Include characteristics, purpose, and technologies
   - End with noun form (명사형)
   - Keep to 2-3 sentences

3. **Create diagram (2.1)**
   - Show relationships between components
   - Display activities and technologies
   - Use ASCII art or markdown-based diagrams
   - Add arrows for flow visualization

4. **Create table (2.2)**
   - Use 3-column format: 구분 (Category) | 세부 항목 (Details) | 설명 (Description)
   - Group logically with clear keywords
   - Organize in meaningful order

5. **Add brief explanations (간글)**
   - Write 2-3 sentences below diagram
   - Write 2-3 sentences below table
   - Omit particles (조사)
   - Focus on essential information

6. **Review and refine**
   - Ensure 1-page length
   - Remove unnecessary words
   - Verify particle omission
   - Check keyword clarity

## Writing Style

**Critical requirements:**
- **Omit particles**: "DevOps는" → "DevOps"
- **Concise and clear**: No redundant modifiers
- **Keyword-focused**: Emphasize technical terms
- **Noun-form endings**: End definitions with nouns
- **1-page constraint**: Compress to essential content

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

For comprehensive writing principles and detailed examples:
- **Writing guidelines**: See [guidelines.md](references/guidelines.md) for detailed rules
- **Structure templates**: See [template.md](references/template.md) for diagram and table examples

## Output Format

Save output as markdown file in `self-test/` or `sub-notes/` directory:
- Filename: `[topic-name].md`
- Format: UTF-8 markdown
- Structure: Follow template exactly

## Examples

**User request:** "DevOps에 대해 설명하시오"

**Process:**
1. Analyze: DevOps = Development + Operations integration methodology
2. Define: Focus on automation, collaboration, continuous delivery
3. Diagram: CI/CD pipeline flow showing stages
4. Table: Categorize by development phase, operation phase, tools
5. Add explanations with particle omission
6. Review for 1-page constraint

**Result:** Complete answer sheet following exact template structure
