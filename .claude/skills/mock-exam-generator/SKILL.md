---
name: mock-exam-generator
description: Generate realistic mock exam questions for IT Professional Examination (정보관리기술사) based on latest technology trends, exam patterns, and difficulty levels. Use when user wants to practice with realistic exam questions.
---

# Mock Exam Generator (모의 시험 문제 생성기)

## Overview

Generate realistic mock examination questions for IT Professional Examination following actual exam patterns and recent trends. Creates questions across various difficulty levels and question types, helping candidates prepare effectively.

## Question Generation Workflow

When user requests mock exam questions:

1. **Understand requirements**
   - Number of questions needed
   - Difficulty level (기본/중급/고급)
   - Specific domains (if any)
   - Question types (if specified)
   - Recent trend focus (yes/no)

2. **Select topics**
   - Analyze recent exam trends (2023-2024)
   - Choose from high-frequency domains
   - Balance between new and mature technologies
   - Consider seasonal trends (emerging technologies)

3. **Determine question types**
   - 정의형 (Definition): "~이란?", "정의하시오"
   - 설명형 (Explanation): "설명하시오"
   - 비교형 (Comparison): "비교하시오", "차이점"
   - 절차형 (Process): "절차", "프로세스"
   - 분석형 (Analysis): "분석하시오", "평가"

4. **Generate questions**
   - Use realistic exam language
   - Appropriate difficulty level
   - Clear and unambiguous phrasing
   - Follow actual exam format

5. **Provide reference information**
   - Key concepts to cover
   - Suggested structure
   - Evaluation keywords
   - Reference materials

6. **Include grading criteria** (optional)
   - Expected key points
   - Scoring rubric
   - Sample answer outline

## Question Types and Patterns

### 1. 정의형 (Definition Type)

**Pattern:**
- "[기술명]이란 무엇인가?"
- "[개념]을 정의하시오"
- "[기술]의 개념과 특징을 설명하시오"

**Example:**
"Zero Trust Security란 무엇인가?"

**Expected coverage:**
- 특징, 목적, 기술 포함한 명확한 정의
- 등장 배경 또는 필요성
- 기존 기술과의 차별점
- 핵심 구성 요소

### 2. 설명형 (Explanation Type)

**Pattern:**
- "[기술]에 대해 설명하시오"
- "[개념]을 설명하시오"
- "[시스템]의 구조와 동작 원리를 설명하시오"

**Example:**
"Service Mesh 아키텍처에 대해 설명하시오"

**Expected coverage:**
- 상세한 구조/아키텍처 (다이어그램)
- 주요 특징 및 기능 (표)
- 동작 원리
- 활용 사례

### 3. 비교형 (Comparison Type)

**Pattern:**
- "[A]와 [B]를 비교하시오"
- "[A]와 [B]의 차이점을 설명하시오"
- "[A]와 [B]의 장단점을 비교 분석하시오"

**Example:**
"REST API와 GraphQL을 비교하시오"

**Expected coverage:**
- 각 기술의 개요
- 주요 특징 대조 (표)
- 장단점 비교
- 적용 시나리오별 선택 기준

### 4. 절차형 (Process Type)

**Pattern:**
- "[프로세스]의 절차를 설명하시오"
- "[시스템] 구축 절차를 설명하시오"
- "[방법론]의 단계별 활동을 설명하시오"

**Example:**
"CI/CD 파이프라인 구축 절차를 설명하시오"

**Expected coverage:**
- 단계별 흐름도 (다이어그램)
- 각 단계별 활동 및 산출물 (표)
- 고려사항 및 주의점
- 도구 및 기술

### 5. 분석형 (Analysis Type)

**Pattern:**
- "[현상]을 분석하고 해결방안을 제시하시오"
- "[시스템]의 문제점을 분석하고 개선방안을 제시하시오"
- "[기술] 도입 시 고려사항을 분석하시오"

**Example:**
"마이크로서비스 아키텍처 도입 시 발생 가능한 문제점을 분석하고 해결방안을 제시하시오"

**Expected coverage:**
- 현황 및 배경
- 문제점 분석 (표)
- 해결방안 (구체적)
- 기대효과

## Topic Selection Guidelines

### High-Frequency Domains (2023-2024)

1. **Cloud & DevOps**
   - Kubernetes, Service Mesh, GitOps
   - Multi-Cloud, FinOps
   - Platform Engineering
   - Infrastructure as Code

2. **Security**
   - Zero Trust Security
   - DevSecOps
   - Container Security
   - Supply Chain Security

3. **Data & AI**
   - Data Mesh, Data Fabric
   - MLOps, LLMOps
   - Vector Database
   - Real-time Data Processing

4. **Architecture**
   - Microservices, Event-Driven Architecture
   - CQRS, Event Sourcing
   - API Gateway, BFF Pattern
   - Serverless Architecture

5. **Observability & Reliability**
   - OpenTelemetry
   - SRE (Site Reliability Engineering)
   - Chaos Engineering
   - AIOps

6. **Emerging Technologies**
   - WebAssembly (Wasm)
   - Edge Computing
   - Quantum Computing (basic concepts)
   - 6G Networks

### Difficulty Levels

**기본 (Basic):**
- Well-known, mature technologies
- Fundamental concepts
- Standard architectures
- Common patterns

**중급 (Intermediate):**
- Recent technologies (2-3 years)
- Advanced patterns
- Integration scenarios
- Trade-offs analysis

**고급 (Advanced):**
- Cutting-edge technologies (2023-2024)
- Complex architectures
- Deep technical principles
- Future trends and evolution

## Question Format

```markdown
## 문제 [번호]

[Question text]

**문제 유형**: [정의형/설명형/비교형/절차형/분석형]
**난이도**: [기본/중급/고급]
**도메인**: [Cloud/Security/Data/Architecture/etc.]
**예상 시간**: [20-25분]

### 출제 의도
- [Key point 1]
- [Key point 2]
- [Key point 3]

### 핵심 키워드
- [Keyword 1]
- [Keyword 2]
- [Keyword 3]

### 평가 포인트
- [Evaluation point 1]
- [Evaluation point 2]
- [Evaluation point 3]

### 참고 자료
- [Reference 1]
- [Reference 2]
```

## Reference Materials

For topic trends and question patterns:
- **Exam trends**: [exam-trends.md](references/exam-trends.md) - Recent exam topics and patterns (2022-2024)
- **Topic pool**: [topic-pool.md](references/topic-pool.md) - Categorized topic database
- **Question templates**: [question-templates.md](references/question-templates.md) - Templates for each question type

## Output Format

Generate questions in structured markdown format with:
- Clear question statement
- Question metadata (type, difficulty, domain)
- Key concepts to cover
- Evaluation criteria
- Reference materials

## Example Usage

**User request:** "클라우드 도메인에서 중급 난이도 문제 3개 만들어주세요"

**Process:**
1. **Select topics**: Kubernetes, Service Mesh, FinOps (recent trends in cloud)
2. **Determine types**:
   - Kubernetes: 설명형
   - Service Mesh vs API Gateway: 비교형
   - FinOps: 분석형
3. **Generate questions**: Create realistic questions with proper format
4. **Provide metadata**: Include 출제 의도, 핵심 키워드, 평가 포인트
5. **Add references**: Link to relevant documentation and resources

**Result:** Three well-structured mock exam questions ready for practice

---

## Advanced Features

### Exam Set Generation

When user requests a complete exam set:
- **1교시 모의고사**: 4 questions, 100 minutes
  - Mix of question types
  - Balanced difficulty
  - Diverse domains
- **2교시 모의고사**: 4 questions, 100 minutes
  - More specialized topics
  - Higher difficulty
  - Integration scenarios

### Trend-Based Generation

Focus on latest exam trends:
- Analyze recent exam topics (last 2 years)
- Identify emerging patterns
- Predict likely future topics
- Balance trendy vs classic topics (70:30 ratio)

### Customization

Allow user preferences:
- Specific technology stack
- Company/industry focus
- Exclude certain topics
- Emphasis on practical vs theoretical

## Quality Assurance

Ensure generated questions:
1. **Realistic**: Match actual exam style and difficulty
2. **Unambiguous**: Clear what is being asked
3. **Appropriate scope**: Not too broad or narrow
4. **Current**: Reflect latest technologies and trends
5. **Educational**: Help candidates learn and improve
