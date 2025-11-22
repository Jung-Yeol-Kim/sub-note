# 멘토링 시스템 구현 가이드

## 개요

정보관리기술사 시험 합격을 위한 **3단계 멘토링 시스템**을 구현했습니다.
실제 합격자들의 경험을 바탕으로 설계된 이 시스템은 다음 핵심 원칙을 따릅니다:

- **멘토링 필수**: 혼자 합격하기 매우 어려움
- **매일 쓰기 연습**: 2개월 이상 매일 작성이 합격 원동력
- **랜덤 복습**: 집중력 저하 방지, 전체 주제 균형 유지
- **구체적 피드백**: "4점을 5점으로" 올리는 전략
- **장기전 마인드**: 심리적 지원과 격려

## 구현된 기능

### Phase 1: 멘토링 대시보드 (`/mentoring`)

학습 여정을 추적하고 동기부여를 제공하는 개인화된 대시보드

#### 주요 컴포넌트:

1. **D-Day 트래커** (`components/mentoring/d-day-tracker.tsx`)
   - 시험일까지 남은 일수 표시
   - 주당 필요한 학습량 자동 계산
   - 경과 시간 시각화

2. **연속 학습 추적** (`components/mentoring/streak-tracker.tsx`)
   - 현재 연속 학습 일수
   - 7일 시각화 캘린더
   - 최장 기록 표시

3. **진도 개요** (`components/mentoring/progress-overview.tsx`)
   - 전체 진도율 (500개 주제 기준)
   - 주간 목표 진행률
   - 평균 점수 추이
   - 남은 주제 및 예상 소요 기간

4. **매일 체크인** (`components/mentoring/daily-check-in.tsx`)
   - 기분 선택 (최고/좋음/괜찮음/힘듦)
   - 학습 시간 기록
   - 완료한 주제 수 입력
   - 오늘의 메모

5. **주간 학습 플랜** (`components/mentoring/weekly-plan.tsx`)
   - 주간 목표 설정 및 추적
   - 진행률 시각화
   - 목표 완료 체크리스트

6. **동기부여 명언** (`components/mentoring/motivational-quote.tsx`)
   - 합격자 후기 기반 명언
   - 매일 다른 메시지 표시

### Phase 2: 실전 모의고사 시스템 (`/mentoring/mock-exam`)

실제 시험과 동일한 환경에서 연습하고 즉각적인 AI 피드백 제공

#### 주요 기능:

1. **모의고사 목록 페이지** (`app/mentoring/mock-exam/page.tsx`)
   - 사용 가능한 모의고사 목록
   - 난이도별 분류 (기초/중급/고급/실전)
   - 응시 이력 및 최고 점수 표시
   - 전체 통계 (총 응시 횟수, 평균 점수, 최고 점수)

2. **모의고사 응시 페이지** (`app/mentoring/mock-exam/[id]/page.tsx`)
   - 실시간 타이머 (문항당 25분 권장)
   - 문제별 답안 작성 영역
   - 문항 네비게이션 (답안 작성 여부 시각화)
   - 진행률 표시
   - 작성 팁 제공

3. **시험 타이머** (`components/mentoring/exam-timer.tsx`)
   - 실시간 카운트다운
   - 10분 남았을 때 경고 표시
   - 시간 종료 시 자동 제출

4. **결과 및 피드백** (`components/mentoring/exam-results.tsx`)
   - 종합 점수 및 등급
   - 문항별 상세 평가
   - 잘한 점 / 개선 방향 제시
   - 4점→5점 구체적 전략
   - 재응시 및 복습 액션

### Phase 3: 랜덤 복습 & 간격 반복 학습 (`/mentoring/random-review`)

무작위 주제 복습과 과학적 반복 학습 알고리즘

#### 주요 기능:

1. **랜덤 복습 페이지** (`app/mentoring/random-review/page.tsx`)
   - 주제 무작위 셔플
   - 답안 작성 영역 (선택)
   - 모범 답안 확인
   - 6단계 자가 평가 (완벽 ~ 전혀 모름)
   - 세션 통계 (복습 개수, 소요 시간)

2. **복습 카드** (`components/mentoring/review-card.tsx`)
   - 주제 정보 (카테고리, 난이도)
   - 마지막 복습 일자
   - 복습 횟수

3. **Spaced Repetition 알고리즘** (`lib/spaced-repetition.ts`)
   - SuperMemo 2 (SM-2) 알고리즘 구현
   - 6단계 품질 평가 기반
   - 다음 복습 일정 자동 계산
   - 난이도별 우선순위 정렬
   - 일일 권장 복습량 계산

## 데이터베이스 스키마

### 새로 추가된 테이블:

1. **user_settings** - 사용자 설정
   - examDate: 목표 시험 일자 (D-Day)
   - dailyGoalMinutes: 일일 목표 학습 시간
   - weeklyTopicsGoal: 주간 목표 주제 수
   - totalTopicsTarget: 전체 목표 주제 수 (기본 500)

2. **daily_check_ins** - 매일 체크인 기록
   - checkInDate: 체크인 날짜
   - studyMinutes: 학습 시간
   - topicsCompleted: 완료한 주제 수
   - mood: 기분 (great/good/okay/struggling)
   - notes: 메모
   - achievements: 성과 배열
   - challenges: 어려웠던 점

3. **weekly_plans** - 주간 학습 계획
   - weekStartDate, weekEndDate: 주 시작/종료일
   - goals: 주간 목표 배열
   - plannedTopics: 계획된 주제 ID 배열
   - status: 상태 (active/completed/abandoned)
   - completionRate: 완료율 (0-100)
   - review: 주간 회고

4. **mock_exams** - 모의고사 문제
   - title, description: 제목, 설명
   - questions: 문제 배열 (JSONB)
   - timeLimit: 제한 시간 (분)
   - difficulty: 난이도 (beginner/intermediate/advanced/actual)
   - isPublic: 공개 여부

5. **mock_exam_attempts** - 모의고사 응시 기록
   - mockExamId: 모의고사 ID
   - answers: 답안 (JSONB)
   - timeSpent: 소요 시간 (초)
   - score: 점수 (0-100)
   - aiEvaluationId: AI 평가 ID
   - detailedResults: 문항별 결과 (JSONB)
   - status: 상태 (in_progress/completed/abandoned)

6. **review_schedule** - 복습 스케줄 (Spaced Repetition)
   - subNoteId: 서브노트 ID
   - nextReviewDate: 다음 복습 날짜
   - interval: 다음 복습까지 간격 (일)
   - easeFactor: 난이도 계수 (SM-2 알고리즘)
   - repetitions: 연속 정답 횟수
   - lastReviewQuality: 마지막 평가 품질 (0-5)

7. **study_streaks** - 학습 연속 기록
   - currentStreak: 현재 연속 일수
   - longestStreak: 최장 연속 일수
   - lastStudyDate: 마지막 학습 날짜
   - totalStudyDays: 총 학습 일수
   - milestones: 마일스톤 데이터 (JSONB)

## 설치 및 실행

### 1. 데이터베이스 마이그레이션

```bash
cd itpe-assistant

# 스키마 생성
pnpm db:generate

# 데이터베이스에 적용
pnpm db:push

# 또는 마이그레이션 실행
pnpm db:migrate
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

### 3. 접속

브라우저에서 다음 경로로 이동:

- 멘토링 대시보드: http://localhost:3000/mentoring
- 모의고사: http://localhost:3000/mentoring/mock-exam
- 랜덤 복습: http://localhost:3000/mentoring/random-review

## 다음 단계 (TODO)

### 즉시 구현 필요:

1. **데이터베이스 통합**
   - 각 컴포넌트의 mock 데이터를 실제 DB 쿼리로 교체
   - Server Actions 구현 (체크인, 주간 계획 저장 등)

2. **AI 평가 API**
   - `/app/api/mock-exam/evaluate/route.ts` 구현
   - Anthropic Claude API 통합
   - 6가지 평가 기준 자동 채점

3. **사용자 설정**
   - D-Day 설정 페이지
   - 학습 목표 커스터마이징

### 향후 개선 사항:

4. **Phase 4: 쓰기 연습 모드**
   - 매일 쓰기 챌린지 (연속 기록)
   - 쓰기 패턴 분석
   - 속도 및 품질 추적

5. **Phase 5: 커뮤니티 멘토링**
   - 스터디 그룹 매칭
   - 멘토-멘티 시스템
   - 동료 피드백

6. **Phase 6: 심리적 지원**
   - 격려 메시지 시스템
   - 마일스톤 축하 알림
   - 슬럼프 감지 및 관리

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Database**: Drizzle ORM, PostgreSQL (Neon)
- **AI**: AI SDK (Anthropic Claude, OpenAI)
- **Algorithm**: SuperMemo 2 (SM-2) for Spaced Repetition

## 참고 자료

- [SuperMemo 2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Spaced Repetition Research](https://en.wikipedia.org/wiki/Spaced_repetition)
- 정보관리기술사 합격 후기 및 멘토링 가이드

## 기여

이 시스템은 실제 합격자들의 경험과 피드백을 바탕으로 개선되고 있습니다.
개선 사항이나 버그를 발견하시면 이슈를 등록해주세요.

---

**합격까지 함께 걸어가겠습니다! 화이팅! 💪**
