# 답안지 규격 시스템 (22줄 × 19칸)

> 정보관리기술사 실전 답안지 규격 준수 시스템

## 개요

정보관리기술사 시험의 실제 답안지 규격인 **22줄(행) × 19칸(열)**을 정확하게 준수하는 답안 작성 시스템입니다.

### 핵심 규칙

- **22줄(행)**: 답안지는 최대 22줄까지 작성 가능
- **19칸(열)**: 각 줄은 최대 19칸까지 작성 가능
- **문자 계산 방식**:
  - 한글 1자 = 1칸
  - 영문/숫자 2자 = 1칸
  - 특수문자 2자 = 1칸

### 실전 허용 범위

실제 시험에서는 약간의 오차가 허용됩니다:
- ±2줄 (20~24줄)
- 줄당 ±1칸 (18~20칸)

시스템은 **strict mode**와 **non-strict mode**를 모두 지원합니다.

---

## 구현 완료 항목

### 1. 타입 시스템 (`lib/types/answer-sheet.ts`)

#### 핵심 타입

```typescript
// 답안지 구조
interface AnswerSheet {
  lines: AnswerSheetLine[];      // 줄 배열 (최대 22개)
  totalLines: number;             // 총 줄 수
  totalCells: number;             // 총 칸 수
  averageCellsPerLine: number;    // 평균 칸/줄
  isValid: boolean;               // 규격 준수 여부
  validationErrors: string[];     // 오류 목록
  validationWarnings: string[];   // 경고 목록
}

// 개별 줄 구조
interface AnswerSheetLine {
  lineNumber: number;             // 줄 번호 (1-22)
  content: string;                // 줄 내용
  cellCount: number;              // 계산된 칸 수
  characterBreakdown: CharacterCellInfo[]; // 문자별 상세
  isValid: boolean;               // 19칸 이내 여부
  validationMessage?: string;     // 오류 메시지
}
```

#### 핵심 함수

```typescript
// 문자 타입 분류 및 칸 수 계산
function getCharacterCellInfo(char: string): CharacterCellInfo

// 줄의 총 칸 수 계산
function calculateLineCellCount(lineContent: string): {
  cellCount: number;
  breakdown: CharacterCellInfo[];
}

// 답안 전체 파싱 및 검증
function parseAnswerSheet(content: string): AnswerSheet

// 통계 계산
function getAnswerSheetStats(sheet: AnswerSheet): {
  totalCharacters: number;
  hangulCount: number;
  englishCount: number;
  numberCount: number;
  utilizationRate: number;  // 0-100%
  // ... 등
}
```

### 2. UI 컴포넌트 (`components/answer-sheet/answer-sheet-editor.tsx`)

#### 주요 기능

**실시간 검증**:
- 타이핑하면서 즉시 규격 체크
- 줄별 칸 수 표시
- 초과 시 색상으로 경고 (녹색/노란색/빨간색)

**시각적 피드백**:
- 줄 수 진행률 바 (22줄 대비)
- 평균 칸 수 진행률 바 (19칸 대비)
- 전체 활용률 표시

**줄별 상세 정보**:
- 각 줄의 칸 수 실시간 표시
- 규격 초과 줄 하이라이트
- 빈 줄 표시

**통계 대시보드**:
- 한글/영문/숫자 문자 수
- 총 칸 수
- 평균 칸/줄
- 활용률 (0-100%)

#### 사용 예시

```tsx
import { AnswerSheetEditor } from "@/components/answer-sheet/answer-sheet-editor";

export default function MyPage() {
  return (
    <AnswerSheetEditor
      initialContent=""
      onChange={(content, sheet) => {
        console.log('Valid:', sheet.isValid);
        console.log('Lines:', sheet.totalLines);
      }}
      showGridPreview={true}   // 줄별 미리보기 표시
      showStatistics={true}    // 통계 표시
    />
  );
}
```

### 3. 테스트 검증 (`lib/types/test-answer-sheet.ts`)

모든 핵심 기능 테스트 완료:

```bash
npx tsx lib/types/test-answer-sheet.ts
```

**테스트 결과**:
```
✓ 한글 문자 계산: 1칸
✓ 영문/숫자 계산: 0.5칸 (2자=1칸)
✓ 혼합 텍스트 계산: 정확
✓ 19칸 제한 검증: 작동
✓ 22줄 제한 검증: 작동
✓ 실제 시험 답안 형식 파싱: 성공
✓ 통계 계산: 정확
```

---

## 사용 가능한 페이지

### 테스트 페이지

```
http://localhost:3000/answer-sheet-test
```

이 페이지에서 다음 기능을 테스트할 수 있습니다:
- 샘플 답안 불러오기
- 실시간 규격 검증
- 줄별 칸 수 확인
- 통계 확인

---

## 통합 계획

### Phase 1: 서브노트 통합 (다음 단계)

**목표**: 기존 서브노트 시스템에 답안지 규격 적용

**변경 사항**:
1. `sub-notes` 페이지에 `AnswerSheetEditor` 적용
2. 서브노트 저장 시 규격 검증
3. 규격 초과 시 경고 표시 (강제 차단은 하지 않음)

### Phase 2: 모의고사 통합

**목표**: 모의고사 답안 작성 시 규격 준수

**변경 사항**:
1. `mock-exam` 답안 에디터를 `AnswerSheetEditor`로 교체
2. 제출 전 규격 검증
3. AI 평가 시 규격 준수 여부도 평가 항목에 추가

### Phase 3: DB 스키마 확장

**목표**: 구조화된 답안 형식 저장

**현재 스키마**:
```typescript
content: text("content").notNull()  // 단순 텍스트
```

**확장 스키마**:
```typescript
content: text("content").notNull()                    // 원본 텍스트
structuredAnswer: jsonb("structured_answer")          // 파싱된 AnswerSheet
lineCount: integer("line_count")                      // 줄 수
cellCount: integer("cell_count")                      // 칸 수
isValidFormat: boolean("is_valid_format").default(true)  // 규격 준수 여부
```

### Phase 4: AI 생성 통합

**목표**: AI가 답안 생성 시 22×19 규격 준수하도록 구조화된 출력

**구현 방법**:
```typescript
// AI에게 전달할 시스템 프롬프트
const systemPrompt = `
답안을 생성할 때 다음 규격을 반드시 준수하세요:
- 최대 22줄
- 각 줄은 최대 19칸 (한글 1자=1칸, 영문/숫자 2자=1칸)
- 줄이 19칸을 초과하면 줄바꿈하세요
`;

// AI 응답을 파싱하여 검증
const sheet = parseAnswerSheet(aiResponse);
if (!sheet.isValid) {
  // 재생성 요청 또는 자동 조정
}
```

---

## 실제 샘플 답안 테스트

### 테스트할 PDF 샘플

```
data/샘플_답안/1교시_보안_Purdue모델.pdf
data/샘플_답안/2교시_보안_디지털포렌식.pdf
data/샘플_답안/1교시_DB_옵티마이저.pdf
data/샘플_답안/2교시_네트워크_QoS.pdf
```

### 테스트 방법

1. PDF를 텍스트로 변환
2. `parseAnswerSheet()` 함수로 파싱
3. 규격 준수 여부 확인
4. 줄별 칸 수 분석

**예상 결과**:
- 실제 시험 답안은 대부분 규격 내에 작성됨
- 일부 줄이 19칸을 약간 초과할 수 있음 (허용 범위)
- 다이어그램/표 구조는 특별히 처리 필요

---

## 기술 스택

- **TypeScript**: 타입 안전성
- **React 19**: UI 컴포넌트
- **Tailwind CSS 4**: 스타일링
- **shadcn/ui**: UI 컴포넌트 라이브러리

---

## API 문서

### `parseAnswerSheet(content: string): AnswerSheet`

평문 텍스트를 파싱하여 구조화된 답안지 객체로 변환

**Parameters**:
- `content`: 답안 내용 (줄바꿈 포함)

**Returns**:
- `AnswerSheet`: 파싱된 답안지 객체

**Example**:
```typescript
const content = `정의: OAuth 2.0
구조: 인증 서버
특징: 토큰 기반`;

const sheet = parseAnswerSheet(content);
console.log(sheet.totalLines);  // 3
console.log(sheet.isValid);     // true
```

### `getAnswerSheetStats(sheet: AnswerSheet)`

답안지 통계 계산

**Returns**:
```typescript
{
  totalCharacters: number;    // 총 문자 수
  hangulCount: number;        // 한글 문자 수
  englishCount: number;       // 영문 문자 수
  numberCount: number;        // 숫자 문자 수
  specialCount: number;       // 특수문자 수
  spaceCount: number;         // 공백 수
  totalLines: number;         // 총 줄 수
  totalCells: number;         // 총 칸 수
  averageCellsPerLine: number; // 평균 칸/줄
  utilizationRate: number;    // 활용률 (0-100%)
}
```

### `formatValidationMessages(sheet: AnswerSheet)`

검증 메시지 포매팅

**Returns**:
```typescript
{
  hasErrors: boolean;
  hasWarnings: boolean;
  errorMessage?: string;      // 사용자에게 표시할 오류 메시지
  warningMessage?: string;    // 사용자에게 표시할 경고 메시지
}
```

---

## 설정

### Strict Mode 설정

```typescript
import { ANSWER_SHEET_CONFIG } from '@/lib/types/answer-sheet';

// Strict mode 활성화 (엄격한 검증)
const strictConfig = {
  ...ANSWER_SHEET_CONFIG,
  STRICT_VALIDATION: true,
  TOLERANCE_LINES: 0,
  TOLERANCE_CELLS: 0,
};

const sheet = parseAnswerSheet(content, strictConfig);
```

### Non-Strict Mode (기본값)

```typescript
// 실전 허용 범위 적용
const config = {
  STRICT_VALIDATION: false,
  TOLERANCE_LINES: 2,   // ±2줄
  TOLERANCE_CELLS: 1,   // ±1칸
};
```

---

## ✅ 완료된 통합 작업

### 1. DB 스키마 확장 ✅
**파일**: `db/schema.ts`

```typescript
subNotes, mockExamAnswers {
  structuredAnswer: jsonb       // Parsed AnswerSheet object
  lineCount: integer            // Total lines
  cellCount: integer            // Total cells
  isValidFormat: boolean        // Format compliance
  formatWarnings: text[]        // Warning messages
}
```

### 2. 서브노트 통합 ✅
**파일**: `app/sub-notes/new/page.tsx`
- "자유 형식 (22×19 규격)" 에디터 모드 추가
- AnswerSheetEditor 통합
- 실시간 규격 검증

### 3. 모의고사 통합 ✅
**파일**: `components/mock-exam/exam-answer-editor.tsx`
- 답안 작성 시 규격 검증
- 경고/오류 Alert 표시

### 4. 샘플 PDF 분석 ✅
**스크립트**: `scripts/analyze_answer_sheets.py`

```
Total PDFs: 6
Valid: 4/6 (66.7%)
Average: 14-16 cells/line
Finding: Real answers sometimes exceed 19 cells (20-23 acceptable)
```

### 5. AI 생성 규격 준수 ✅
**파일**: `.claude/skills/topic-generator/SKILL.md`
- 22×19 규격 가이드라인 추가
- 목표: 18-20줄, 평균 14-16칸/줄

---

## 실전 사용 가이드

### 서브노트 작성
```
1. /sub-notes/new
2. "자유 형식 (22×19 규격)" 선택
3. 실시간 검증 확인하며 작성
```

### AI 답안 생성
```
topic-generator 스킬 사용
→ 자동으로 규격 준수
```

### 검증 테스트
```bash
npx tsx lib/types/test-answer-sheet.ts
python3 scripts/analyze_answer_sheets.py
```

---

## 통계 및 인사이트

| 항목 | 값 |
|-----|---|
| 분석 PDF 수 | 6개 |
| 규격 준수 | 4/6 (66.7%) |
| 평균 줄 수 | 12-16줄 |
| 평균 칸/줄 | 14-16칸 |
| 최대 칸 초과 | 20-23칸 |

**인사이트**: 실제 합격 답안도 일부 초과. 경고만 표시하는 것이 적절.

---

**작성일**: 2025-11-23
**버전**: 2.0.0 (Full Integration)
**상태**: ✅ 전체 시스템 통합 완료
