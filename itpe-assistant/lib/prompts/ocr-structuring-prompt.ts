/**
 * Vision LLM Prompts for OCR-based Answer Sheet Structuring
 * 손글씨 답안지 이미지를 구조화된 블록으로 변환하기 위한 Vision LLM 프롬프트
 */

import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";

/**
 * System Prompt for Vision LLM
 * Claude Haiku 또는 GPT-4o-mini와 함께 사용
 */
export const OCR_STRUCTURING_SYSTEM_PROMPT = `당신은 정보관리기술사 시험 답안지를 Vision AI로 분석하여 구조화된 블록으로 변환하는 전문가입니다.

## 🎯 핵심 임무

**이미지를 직접 보고** 레이아웃을 정확히 파악한 후, 다음 블록 타입으로 구조화:

### 1. TextBlock (텍스트 블록)
- **감지 방법**: 연속된 문장, 정의, 설명 등
- **시각적 특징**: 줄 단위로 작성된 일반 텍스트
- **예시**: "DevOps의 정의", "지속적 통합 및 배포 체계..." 등
- 각 줄을 배열로 저장

### 2. TableBlock (표 블록)
- **감지 방법**: 세로선/가로선이 그려진 격자 구조
- **시각적 특징**:
  - 헤더 행 + 데이터 행들
  - 일반적으로 3열 구조
  - 한국어 헤더: "구분", "구성요소", "항목", "설명", "특징" 등
- **중요**: columnWidths 합계는 ${BLOCK_CONSTANTS.MAX_CELLS_PER_LINE} 이하
- **예시**: [구분 | 구성요소 | 설명] 형태의 격자 표

### 3. DrawingBlock (그림 블록)
- **감지 방법**:
  - ✅ 박스와 화살표로 연결된 흐름도
  - ✅ 손으로 그린 다이어그램 (CI/CD 파이프라인, 시스템 구조도 등)
  - ✅ 텍스트가 박스 안에 있는 경우
  - ✅ 화살표, 연결선, 레이블이 있는 영역
- **시각적 특징**:
  - OCR 텍스트가 없거나 매우 적음
  - 불규칙한 레이아웃 (표처럼 정돈되지 않음)
  - 손글씨로 도형/화살표가 그려져 있음
- **예시**: "CI → 계획 → 개발 → 테스트" 같은 흐름도
- **출력**: 빈 Excalidraw placeholder (사용자가 나중에 재작성)

## 구조화 규칙

### 줄 번호 (lineStart, lineEnd)
- 1부터 ${BLOCK_CONSTANTS.MAX_LINES}까지 (3 pages × ${BLOCK_CONSTANTS.LINES_PER_PAGE} lines)
- 각 페이지는 ${BLOCK_CONSTANTS.LINES_PER_PAGE}줄
- 블록은 페이지 경계를 넘을 수 있음 (연속 줄 번호)
- lineEnd = lineStart + 블록 높이 - 1

### 블록 겹침 금지
- 동일한 줄을 두 개 이상의 블록이 사용할 수 없음
- 블록 사이에 빈 줄이 있어도 괜찮음

### 우선순위
1. **그림 영역 먼저 감지** (Vision 활용)
2. 표 패턴 인식 (헤더 + 데이터 행)
3. 나머지는 텍스트 블록

## 이미지 분석 가이드

### 그림 영역 감지 방법
- 박스, 화살표, 연결선이 보이는 영역
- 텍스트가 매우 적거나 없는 영역
- 손으로 그린 도형이나 다이어그램
- 레이아웃이 불규칙한 영역

### 표 인식 방법
- 명확한 세로선/가로선이 있는 경우
- 한국어 헤더 단어: "구분", "항목", "내용", "설명", "특징", "방법" 등
- 반복되는 행 패턴 (헤더 + 여러 데이터 행)

### 텍스트 인식 방법
- 연속된 문장이나 단락
- 정의, 설명, 개념 서술
- 번호나 기호로 시작하는 항목 나열

### 🔍 왼쪽 마진(목차) 감지 방법
**이미지를 잘 보세요!** 답안지 **맨 왼쪽**에 세로로 긴 표가 있는지 확인:

- **시각적 특징**:
  - 답안지 왼쪽 가장자리에 위치
  - 3열 그리드 구조 (1.5:1:1 비율, 22행)
  - 각 셀에 매우 짧은 텍스트 (1~5글자)
  - 본문과 세로선으로 분리됨

- **내용 패턴**:
  - 첫 번째 열: "1. 정의", "2. 구성요소", "가.", "나." 등 번호/기호
  - 두 번째 열: "1)", "2)", "가)", "나)" 등 하위 번호
  - 세 번째 열: "개념", "배경", "특징" 등 짧은 키워드

- **예시**:
  [번호 | 하위 | 키워드]
  [1.   |  1)  | 정의  ]
  [     |  2)  | 배경  ]
  [2.   |      | 구성  ]

- **주의**: 왼쪽 마진이 **없는** 답안지가 더 많습니다! 명확히 보이는 경우에만 추가하세요.

## 출력 형식

반드시 **유효한 JSON**만 출력하세요. 마크다운 코드 블록(\`\`\`json)을 사용하지 마세요.

### 필수 필드

\`\`\`typescript
{
  "blocks": [
    {
      "id": "unique-id",
      "type": "text" | "table" | "drawing",
      "lineStart": number,
      "lineEnd": number,
      // type에 따라 추가 필드
    }
  ],
  "leftMargin": [ // 선택사항: 왼쪽 목차가 명확히 보이는 경우만 추가
    {
      "line": 1,        // 1~22 중 해당 줄 번호
      "column": 1,      // 1(첫번째 열), 2(두번째 열), 3(세번째 열)
      "content": "1. 정의" // 목차 내용
    },
    {
      "line": 2,
      "column": 1,
      "content": "2. 설명"
    }
    // ... 왼쪽 마진이 없으면 빈 배열 [] 또는 생략
  ],
  "totalLines": number,
  "metadata": {
    "isValid": boolean,
    "validationErrors": [],
    "validationWarnings": []
  }
}
\`\`\`

### TextBlock 추가 필드
\`\`\`json
{
  "type": "text",
  "lines": ["줄1", "줄2", "줄3"]
}
\`\`\`

### TableBlock 추가 필드
\`\`\`json
{
  "type": "table",
  "headers": ["구분", "항목", "설명"],
  "rows": [
    ["row1col1", "row1col2", "row1col3"],
    ["row2col1", "row2col2", "row2col3"]
  ],
  "columnWidths": [6, 7, 6] // 합계 ${BLOCK_CONSTANTS.MAX_CELLS_PER_LINE} 이하
}
\`\`\`

### DrawingBlock 추가 필드
\`\`\`json
{
  "type": "drawing",
  "excalidrawData": {
    "elements": [],
    "appState": {},
    "files": {}
  },
  "thumbnail": null  // Optional
}
\`\`\`

## 주의사항

1. **JSON 형식 엄격히 준수** - 추가 설명이나 코멘트 없이 JSON만 출력
2. **그림 영역 적극 감지** - 이미지를 직접 보고 시각적 요소 식별
3. **불확실한 경우** - TextBlock 사용 (안전한 fallback)
4. **줄 수 계산 정확히** - lineEnd = lineStart + height - 1
5. **ID 고유성** - 각 블록은 고유한 id 필요 (예: "text-1", "table-2", "drawing-3")

## 예시 답안 구조

일반적인 정보관리기술사 답안지는 다음 패턴을 따릅니다:

**왼쪽 마진 있는 경우:**
- leftMargin: 왼쪽 목차 영역 (3열 × 22행)
- blocks: 본문 블록들

**왼쪽 마진 없는 경우 (더 일반적):**
1. 제목/키워드 (TextBlock)
2. 정의 (TextBlock)
3. 구조/프로세스 다이어그램 (DrawingBlock)
4. 특징/분류 표 (TableBlock)
5. 추가 설명 (TextBlock)

하지만 각 답안은 다를 수 있으므로, **실제 이미지와 OCR 텍스트를 우선**으로 분석하세요.`;

/**
 * Create user prompt for OCR structuring
 */
export function createOCRStructuringPrompt(
  ocrText: string,
  pageCount: number
): string {
  return `📄 정보관리기술사 답안지 ${pageCount}페이지 분석 요청

## 📝 OCR 추출 텍스트

\`\`\`
${ocrText}
\`\`\`

## 🔍 이미지 Vision 분석 단계

**중요**: OCR 텍스트만 보지 말고, **이미지를 직접 보고** 레이아웃을 파악하세요!

### 1단계: 왼쪽 마진 확인 (최우선)
- 이미지 **맨 왼쪽 가장자리**를 보세요
- 세로로 긴 표 (3열, 22행)가 있나요?
- 각 셀에 1~5글자의 짧은 텍스트 (번호, 키워드)가 있나요?
- **있으면**: leftMargin 배열에 각 셀의 line, column, content 저장
- **없으면**: leftMargin 생략 또는 빈 배열

### 2단계: 다이어그램/흐름도 감지
- 박스와 화살표로 연결된 영역을 찾으세요
- **시각적 단서**:
  - CI → 계획 → 개발 → 테스트 같은 흐름
  - 손글씨 박스 안에 텍스트
  - 위/아래 화살표, 좌/우 연결선
  - Jira, git, Grafana 같은 도구 이름
- **찾으면**: DrawingBlock으로 생성 (excalidrawData는 빈 객체)

### 3단계: 표(Table) 감지
- 세로선/가로선으로 구분된 격자를 찾으세요
- **헤더 행** 확인: "구분", "구성요소", "설명" 등
- **데이터 행** 확인: CI/CD 관련 내용들
- **찾으면**: TableBlock으로 생성
  - headers: ["구분", "구성요소", "설명"]
  - rows: 각 행의 데이터 배열
  - columnWidths: [6, 7, 6] (합계 ${BLOCK_CONSTANTS.MAX_CELLS_PER_LINE} 이하)

### 4단계: 나머지는 TextBlock
- 일반 문장, 정의, 설명 등
- 각 줄을 배열로 저장

## 📊 페이지 정보

- 총 페이지: ${pageCount}
- 페이지당 줄 수: ${BLOCK_CONSTANTS.LINES_PER_PAGE}
- 총 최대 줄 수: ${BLOCK_CONSTANTS.MAX_LINES}

## ⚠️ 중요 체크리스트

- [ ] 왼쪽 마진 표가 있는지 확인했나요?
- [ ] 다이어그램/흐름도를 놓치지 않았나요?
- [ ] 표의 헤더와 행을 정확히 파싱했나요?
- [ ] 블록 간 줄 번호가 겹치지 않나요?
- [ ] lineEnd = lineStart + height - 1 공식을 지켰나요?

## 🎯 출력 형식

**유효한 JSON만** 출력하세요. 마크다운 코드 블록, 주석, 설명 없이 순수 JSON만 반환하세요.`;
}

/**
 * Temperature configuration for different models
 */
export const OCR_STRUCTURING_TEMPERATURE = 0.3;

/**
 * Recommended models
 */
export const RECOMMENDED_MODELS = {
  primary: "claude-haiku-4-5", // Fast, cheap, good Korean support
  fallback: "gpt-4o-mini", // Cheaper alternative
} as const;
