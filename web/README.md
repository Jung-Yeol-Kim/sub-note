# 정보관리기술사 학습 플랫폼

AI를 활용한 정보관리기술사 시험 답안 생성 및 학습 플랫폼

## 기술 스택

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Anthropic Brand Colors)
- **AI**: Vercel AI SDK v6 beta + Anthropic Claude 3.5 Sonnet
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Package Manager**: pnpm

## 주요 기능

### Phase 1: 핵심 기능 (구현 완료 ✅)

1. **답안 생성** (`/generate`)
   - AI를 활용한 자동 답안 생성
   - 문제 유형 선택: 정의형, 설명형, 비교형, 절차형, 분석형
   - 난이도 선택: 초보 vs 고득점
   - 실시간 스트리밍 응답

2. **서론-본론-결론 구조**
   - 정보관리기술사 시험 형식 준수
   - 6대 평가 기준 반영
   - Anthropic 브랜드 디자인 적용

### Phase 2: 예정 기능 (🚧)

3. **답안 비교**
   - 초보 vs 고득점 답안 비교
   - 차이점 하이라이트
   - 개선 포인트 제시

4. **답안 평가**
   - 6대 평가 기준별 점수
   - AI 피드백
   - 개선 제안

5. **도메인 키워드 맵**
   - 인터랙티브 키워드 네트워크
   - 도메인별 핵심 개념
   - 관련 토픽 연결

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일이 이미 생성되어 있습니다. Anthropic API 키를 추가하세요:

```bash
# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Neon PostgreSQL (이미 설정됨)
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-holy-bonus-...neon.tech/neondb?sslmode=require
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 데이터베이스 스키마 푸시

Drizzle ORM을 사용하여 Neon PostgreSQL에 스키마를 푸시합니다:

```bash
pnpm db:push
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)를 열어 확인하세요.

## 프로젝트 구조

```
web/
├── app/
│   ├── api/
│   │   └── generate/          # 답안 생성 API
│   ├── generate/               # 답안 생성 페이지
│   ├── globals.css            # Anthropic 브랜드 컬러
│   ├── layout.tsx
│   └── page.tsx               # 홈 페이지
├── lib/
│   ├── ai/
│   │   └── client.ts          # Anthropic Claude 클라이언트
│   ├── db/
│   │   ├── schema.ts          # Drizzle ORM 스키마
│   │   ├── index.ts           # DB 클라이언트
│   │   └── migrations/        # 마이그레이션 파일
│   └── utils/
├── components/
│   ├── ui/                    # 공통 UI 컴포넌트 (예정)
│   ├── answer/                # 답안 관련 컴포넌트 (예정)
│   └── editor/                # 마크다운 에디터 (예정)
├── drizzle.config.ts          # Drizzle 설정
└── package.json
```

## 디자인 시스템

### Anthropic Brand Colors

```css
--brand-dark: #141413        /* 다크 모드 배경 */
--brand-light: #faf9f5       /* 라이트 모드 배경 */
--brand-mid-gray: #b0aea5    /* 보조 텍스트 */
--brand-light-gray: #e8e6dc  /* 서브틀 배경 */
--brand-orange: #d97757      /* Primary Accent */
--brand-blue: #6a9bcc        /* Secondary Accent */
--brand-green: #788c5d       /* Tertiary Accent */
```

### Typography

- **Headings**: Poppins (Google Fonts)
- **Body Text**: Lora (Google Fonts)

## 개발 가이드

### API 엔드포인트

#### POST `/api/generate`

답안 생성 API

**Request Body:**
```typescript
{
  topic: string              // 주제 (예: "Kubernetes")
  questionType: string       // 문제 유형: 정의형, 설명형, 비교형, 절차형, 분석형
  level: 'basic' | 'advanced' // 난이도
}
```

**Response:**
- Streaming response (Vercel AI SDK v6 beta)

### 데이터베이스 스키마

주요 테이블:
- `users`: 사용자 정보
- `answers`: 생성된 답안
- `evaluations`: 답안 평가 (6대 기준)
- `keywords`: 도메인별 키워드 맵
- `learning_progress`: 학습 진도

자세한 스키마는 `lib/db/schema.ts` 참조

## 배포

### Vercel 배포

```bash
vercel
```

### 환경 변수 설정

Vercel Dashboard에서 다음 환경 변수를 설정하세요:
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

## 라이선스

Private

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
