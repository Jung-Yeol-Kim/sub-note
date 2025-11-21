# 서브노트 표준 양식 가이드

## 개요

이 문서는 정보관리기술사 시험 답안지 형식을 참고하여 정형화된 서브노트 양식을 설명합니다.

## 배경

기존 서브노트는 자유로운 형식이었으나, 실제 시험 답안 작성을 위해서는 정형화된 양식이 필요합니다.
- **답안지(표).pdf**: 실제 시험에서 사용되는 답안지 양식
- **출제기준_전체텍스트.txt**: 6개 대분류로 구성된 출제기준

## 표준 서브노트 구조

### 1. 메타데이터

```typescript
{
  title: string;                    // 제목
  syllabusMapping: {                // 출제기준 매핑
    categoryId: "1" | "2" | ... | "6";
    categoryName: string;
    subCategoryId?: string;
    subCategoryName?: string;
  };
  tags: string[];                   // 태그
  difficulty: 1 | 2 | 3 | 4 | 5;   // 난이도
}
```

### 2. 내용 구조

#### 2.1 정의 섹션 (필수)
```typescript
definition: {
  content: string;        // 명확한 정의
  keywords: string[];     // 핵심 키워드
  context?: string;       // 출제 배경/맥락
}
```

**작성 예시:**
```
OAuth 2.0은 인증 및 권한 부여를 위한 개방형 표준 프로토콜로,
리소스 소유자의 승인 하에 클라이언트가 보호된 리소스에 접근할 수 있도록 하는
프레임워크이다.

핵심 키워드: OAuth 2.0, 권한 부여, 리소스 소유자, 클라이언트
```

#### 2.2 설명 섹션 (필수)
```typescript
explanation: {
  title: string;              // 설명 제목
  subsections: AnswerSection[]; // 다이어그램, 표, 텍스트 등
}
```

**서브섹션 타입:**

1. **다이어그램 섹션**
   ```typescript
   {
     type: "diagram";
     title: string;
     content: string;        // ASCII art 또는 텍스트 다이어그램
     description?: string;   // 다이어그램 설명
   }
   ```

2. **표 섹션** (3열 권장)
   ```typescript
   {
     type: "table";
     title: string;
     headers: string[];      // ["항목", "내용", "비고"]
     rows: string[][];
     description?: string;
   }
   ```

3. **텍스트 섹션**
   ```typescript
   {
     type: "text";
     title?: string;
     content: string;
     bulletPoints?: string[];
   }
   ```

4. **프로세스 섹션**
   ```typescript
   {
     type: "process";
     title: string;
     steps: Array<{
       number: number;
       title: string;
       description: string;
     }>;
   }
   ```

#### 2.3 추가 내용 섹션 (선택)
```typescript
additional?: {
  title: string;
  content: string;
  subsections?: AnswerSection[];
}
```

### 3. 형식 메타데이터

```typescript
format: {
  estimatedLines: number;     // 예상 줄 수 (자동 계산)
  pageCount: 1 | 2;          // 페이지 수 (자동 계산)
  hasEmoji: boolean;         // 이모지 사용 여부 (기본 false)
  particlesOmitted: boolean; // 조사 생략 여부 (기본 true)
}
```

## 출제기준 분류

### 대분류 (6개)

1. **정보 전략 및 관리**
   - 정보전략 수립 및 관리
   - 경영정보
   - 정보 및 AI윤리
   - IT감리
   - 통계
   - 프로젝트 관리

2. **소프트웨어 공학**
   - 소프트웨어 개발방법론
   - 소프트웨어 분석 및 설계
   - 소프트웨어 구현 및 시험
   - 정보시스템 운영 및 유지보수
   - 소프트웨어 품질

3. **자료처리**
   - 자료구조론
   - 데이터모델링
   - DBMS과 분산파일처리
   - 데이터마이닝
   - 데이터 품질관리
   - 빅데이터분석

4. **컴퓨터 시스템 및 정보통신**
   - 컴퓨터 시스템
   - 정보통신

5. **정보보안**
   - 보안기술
   - 보안시스템
   - 정보보호
   - 관리적 보안
   - 디지털 포렌식
   - 개인정보보호 및 개인정보 활용

6. **최신기술, 법규 및 정책**
   - 최신기술
   - 법규 및 정책

## 웹 UI 사용법

### 1. 출제기준 브라우저

**컴포넌트**: `SyllabusBrowser`

**기능:**
- 6개 대분류별 주제 탐색
- 검색 기능 (카테고리, 주제, 세부항목)
- 계층 구조 표시 (접기/펼치기)
- 주제 선택 시 콜백

**사용 예시:**
```tsx
<SyllabusBrowser
  onSelect={(categoryId, topicId) => {
    console.log("Selected:", categoryId, topicId);
  }}
  selectedCategoryId="5"
  selectedTopicId="5-1"
/>
```

**Compact 모드:**
```tsx
<SyllabusBrowser compact />
```

### 2. 서브노트 에디터

**컴포넌트**: `SubNoteEditor`

**기능:**
- 구조화된 양식 제공
- 출제기준 선택
- 다이어그램/표/텍스트 섹션 추가
- 실시간 유효성 검사
- 예상 줄 수 자동 계산

**사용 예시:**
```tsx
<SubNoteEditor
  initialData={existingSubNote}
  onChange={(data) => console.log("Changed:", data)}
  onSave={(data) => {
    // Save logic
    const markdown = standardSubNoteToMarkdown(data);
    saveToFile(markdown);
  }}
/>
```

### 3. 출제기준 선택기

**컴포넌트**: `SyllabusSelector`

**기능:**
- 폼에서 사용할 수 있는 컴팩트한 선택기
- 드롭다운 형식
- 선택된 출제기준 표시

**사용 예시:**
```tsx
<SyllabusSelector
  value={{ categoryId: "5", topicId: "5-1" }}
  onChange={(categoryId, topicId) => {
    console.log("Selected:", categoryId, topicId);
  }}
/>
```

## 파일 구조

```
itpe-assistant/
├── lib/
│   ├── types/
│   │   └── subnote.ts              # StandardSubNote 타입 정의
│   └── data/
│       └── syllabus.json           # 출제기준 데이터
├── components/
│   ├── syllabus/
│   │   └── syllabus-browser.tsx   # 출제기준 브라우저
│   └── subnote/
│       └── subnote-editor.tsx     # 서브노트 에디터
└── app/
    └── sub-notes/
        └── new/
            └── page.tsx            # 새 서브노트 페이지
```

## 작성 가이드라인

### 1. 정의 작성
- **간결성**: 1-2문장으로 핵심만 표현
- **완결성**: 기술, 목적, 특징 포함
- **키워드**: 3-5개의 핵심 기술 용어

### 2. 설명 작성
- **다이어그램 우선**: 시각적 표현이 가능하면 다이어그램 사용
- **표 활용**: 분류, 비교 시 3열 표 권장
- **조사 생략**: "~을/를", "~이/가" 등 생략 (답안지 스타일)

### 3. 페이지 제한
- **1페이지**: 약 25줄 이내
- **2페이지**: 최대 50줄 (초과 시 내용 압축 필요)

### 4. 금지 사항
- 이모지 사용 금지 (기술 문서 형식)
- 과도한 장황함
- 불필요한 배경 설명

## 헬퍼 함수

### validateSubNote
```typescript
const { isValid, errors } = validateSubNote(subnote);
if (!isValid) {
  console.error("Validation errors:", errors);
}
```

### calculateEstimatedLines
```typescript
const lines = calculateEstimatedLines(subnote);
console.log(`예상 줄 수: ${lines}줄`);
```

### standardSubNoteToMarkdown
```typescript
const markdown = standardSubNoteToMarkdown(subnote);
// 파일로 저장하거나 DB에 저장
```

### markdownToStandardSubNote (부분 구현)
```typescript
const subnote = markdownToStandardSubNote(markdown);
// 기존 마크다운 파일을 표준 형식으로 변환
```

## 예시

### 완성된 서브노트 예시

**제목**: OAuth 2.0 Grant Types

**출제기준**: 5. 정보보안 > 5-1. 보안기술

**정의**:
```
OAuth 2.0은 인증 및 권한 부여를 위한 개방형 표준 프로토콜로,
리소스 소유자의 승인 하에 클라이언트가 보호된 리소스에 접근할 수 있도록 하는
프레임워크이다.

핵심 키워드: OAuth 2.0, 권한 부여, Access Token, Authorization Server
```

**설명 - Grant Types (표)**:

| Grant Type | 사용 시나리오 | 보안 수준 |
|------------|--------------|----------|
| Authorization Code | 서버 사이드 웹 앱 | 높음 |
| Implicit | SPA (레거시) | 중간 |
| Resource Owner Password | 신뢰할 수 있는 앱 | 낮음 |
| Client Credentials | 서버 간 통신 | 높음 |

**설명 - Authorization Code Flow (다이어그램)**:
```
[Client] --1. Authorization Request--> [Auth Server]
         <--2. Authorization Code------
         --3. Code + Client Secret----> [Auth Server]
         <--4. Access Token-------------
         --5. Access Token-------------> [Resource Server]
         <--6. Protected Resource-------
```

**추가 고려사항**:
```
- PKCE 확장 사용 권장 (모바일/SPA)
- Refresh Token 관리 전략
- Scope 최소 권한 원칙 적용
```

## 향후 개선 사항

1. **AI 기반 자동 완성**
   - 주제 입력 시 자동으로 정의 생성
   - 관련 키워드 추천
   - 다이어그램 템플릿 제공

2. **마크다운 에디터 지원**
   - 기존 마크다운 파일 import
   - 양방향 변환 (표준 형식 ↔ 마크다운)

3. **템플릿 라이브러리**
   - 주제별 템플릿 제공
   - 커뮤니티 공유 템플릿

4. **출력 기능**
   - PDF 생성 (답안지 형식)
   - 인쇄 최적화

## 참고

- 답안지 양식: `/data/답안지(표).pdf`
- 출제기준: `/data/syllabus/출제기준_전체텍스트.txt`
- 타입 정의: `/itpe-assistant/lib/types/subnote.ts`
- 출제기준 데이터: `/itpe-assistant/lib/data/syllabus.json`
