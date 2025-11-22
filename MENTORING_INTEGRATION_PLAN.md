# 멘토링 기능 통합 계획 (시나리오 C)

## 🎯 목표
6개 멘토링 브랜치를 분석하여 최적의 통합 구현 생성

## 📊 브랜치별 핵심 기능

### Branch 1 (01EsaQdVzkbxBLTWssdsG2am) - 쓰기 연습
- ✅ 일일 쓰기 챌린지 시스템
- ✅ 쓰기 분석 (패턴, 개선도)
- ✅ 연속 기록 추적
- ✅ 성취 시스템
- 🔥 **Best**: 상세한 쓰기 분석 로직

### Branch 2 (01MtK1R6adDTEq4UDbE4i82y) - 멘토링 기본
- ✅ 일일 체크인
- ✅ 학습 여정 추적
- ✅ 주간 플랜
- 🔥 **Best**: 간결한 UI 컴포넌트 구조

### Branch 3 (01SXwyYi5Vko85HtqRyRAPmQ) - 6단계 통합 ⭐
- ✅ 멘토링 대시보드
- ✅ 모의고사 시스템
- ✅ 스마트 복습
- ✅ 쓰기 챌린지
- ✅ 스터디 그룹
- ✅ 심리적 지원
- ✅ DB 마이그레이션 완료
- 🔥 **Best**: 완전한 아키텍처, DB 설계

### Branch 4 (01VtfASe188mTXbE69E2E163) - 3단계 시스템
- ✅ 멘토링 대시보드
- ✅ 모의고사 + AI 피드백
- ✅ Spaced Repetition 알고리즘
- 🔥 **Best**: SM-2 알고리즘 구현, 상세 문서

### Branch 5 (01F79Er9yY3RperqseSVMfhc) - Phase 1
- ✅ D-Day 트래커
- ✅ 진도 추적
- 🔥 **Best**: D-Day 계산 로직

### Branch 6 (01LNdxUqm64kX3m8cZ61QTGZ) - 모의고사
- ✅ 실전 타이머
- ✅ AI 피드백 API
- ✅ 상세 평가 (6가지 기준)
- 🔥 **Best**: 모의고사 타이머 UX

## 🔄 중복 기능 정리

| 기능 | B1 | B2 | B3 | B4 | B5 | B6 | 채택 기준 |
|------|----|----|----|----|----|----|---------|
| 멘토링 대시보드 | - | ✓ | ✓ | ✓ | ✓ | - | B3 (가장 포괄적) |
| 일일 체크인 | - | ✓ | ✓ | ✓ | ✓ | - | B3 (DB 연동) |
| 주간 플랜 | - | ✓ | ✓ | ✓ | ✓ | - | B3 (통합 디자인) |
| 모의고사 | - | - | ✓ | ✓ | - | ✓ | B3 base + B6 타이머 |
| 쓰기 연습 | ✓ | - | ✓ | - | - | - | B1 (상세 분석) |
| 복습 시스템 | - | - | ✓ | ✓ | - | - | B4 (SM-2 알고리즘) |
| 스터디 그룹 | - | - | ✓ | - | - | - | B3 (유일) |

## 🏗️ 통합 아키텍처

### 1단계: Base (Branch 3)
```
itpe-assistant/
├── app/
│   ├── mentoring/          # 대시보드
│   ├── mock-exam/          # 모의고사
│   ├── review/             # 복습
│   ├── writing-challenge/  # 쓰기
│   └── study-groups/       # 그룹
├── components/
│   ├── mentoring/
│   ├── mock-exam/
│   └── writing-practice/
└── db/schema.ts            # 통합 스키마
```

### 2단계: 기능 개선
- Branch 1 쓰기 분석 로직 → `writing-challenge/` 강화
- Branch 4 SM-2 알고리즘 → `lib/spaced-repetition.ts`
- Branch 6 타이머 UX → `mock-exam/` 개선

### 3단계: DB 최적화
```typescript
// 통합 테이블 구조
- studyGoals           // 학습 목표
- dailyCheckIns        // 일일 체크인
- weeklyPlans          // 주간 계획
- learningStreaks      // 연속 학습
- mockExamSessions     // 모의고사
- reviewSchedule       // 복습 (SM-2)
- writingChallenges    // 쓰기 연습
- writingAnalytics     // 쓰기 분석 (B1)
- studyGroups          // 스터디 그룹
- milestones           // 마일스톤
```

## 📝 구현 프롬프트

### Phase 1: 기본 구조 (1-2일)
```
itpe-assistant에 멘토링 시스템 통합 구현:

1. Branch 3 (01SXwyYi5Vko85HtqRyRAPmQ) 기반으로 시작
   - 6단계 구조 그대로 사용
   - DB 스키마 그대로 적용

2. 네비게이션 정리
   - 멘토링, 모의고사, 스마트 복습, 쓰기 챌린지, 스터디 그룹
   - 아이콘: Target, ClipboardCheck, RefreshCw, PenTool, UsersRound

3. DB 마이그레이션 실행
   - drizzle/0000_*.sql 적용
```

### Phase 2: 기능 강화 (2-3일)
```
1. 쓰기 분석 강화
   From: Branch 1 (01EsaQdVzkbxBLTWssdsG2am)

   통합 대상:
   - app/api/writing-analytics/route.ts
   - components/writing-practice/writing-analytics-card.tsx
   - components/writing-practice/achievements-card.tsx

   DB 추가:
   - writingAnalytics 테이블 (B1 스키마)
   - writingStreaks 관계 추가

2. SM-2 알고리즘 통합
   From: Branch 4 (01VtfASe188mTXbE69E2E163)

   추가 파일:
   - lib/spaced-repetition.ts (SM-2 구현)

   적용 위치:
   - app/review/page.tsx에 알고리즘 통합

3. 모의고사 타이머 개선
   From: Branch 6 (01LNdxUqm64kX3m8cZ61QTGZ)

   개선 항목:
   - components/mock-exam/exam-timer.tsx UI 개선
   - 10분 경고, 자동 제출 로직 강화
```

### Phase 3: 서버 액션 (3-4일)
```
1. 체크인 시스템
   - actions/check-in.ts
   - dailyCheckIns 테이블 CRUD
   - learningStreaks 자동 업데이트

2. 모의고사 평가
   - actions/evaluate-exam.ts
   - AI SDK 연동 (Claude)
   - 6가지 기준 평가

3. 복습 스케줄러
   - actions/review-schedule.ts
   - SM-2 기반 다음 복습일 계산
```

### Phase 4: AI 통합 (2-3일)
```
1. AI 평가 API
   - app/api/mock-exam/evaluate/route.ts
   - 6가지 평가 기준:
     * 완성도, 정확성, 구조, 명료성, 키워드, 기술 깊이
   - 잘한 점 / 개선점 / 제안사항

2. 쓰기 분석 AI
   - app/api/writing-analytics/route.ts (B1)
   - 패턴 분석, 강점/약점 추출

3. 격려 메시지
   - 상황별 맞춤 메시지
   - 슬럼프 감지
```

## ✅ Best Practices 추출

### From Branch 3
- 완전한 DB 스키마 설계
- 일관된 폴더 구조
- Phase별 명확한 구분

### From Branch 1
- 상세한 쓰기 분석 로직
- 성취 시스템 구조

### From Branch 4
- SM-2 알고리즘 구현
- 상세한 문서화
- D-Day 계산 로직

### From Branch 6
- 실전 타이머 UX
- AI 피드백 API 구조

## 🚀 실행 순서

```bash
# 1. 새 통합 브랜치 생성
git checkout -b claude/integrate-mentoring-system-unified

# 2. Branch 3 병합 (base)
git merge origin/claude/add-mentoring-dashboard-01SXwyYi5Vko85HtqRyRAPmQ

# 3. 선택적 체리픽
git cherry-pick <B1-commit> -- itpe-assistant/app/api/writing-analytics/
git cherry-pick <B4-commit> -- itpe-assistant/lib/spaced-repetition.ts
git cherry-pick <B6-commit> -- itpe-assistant/components/mock-exam/exam-timer.tsx

# 4. 충돌 해결 및 테스트
cd itpe-assistant
pnpm install
pnpm db:push
pnpm dev

# 5. 커밋 및 푸시
git commit -m "feat: Integrate unified mentoring system"
git push -u origin claude/integrate-mentoring-system-unified
```

## 📊 예상 결과

- **총 파일**: ~30개
- **총 라인**: ~8,000줄
- **DB 테이블**: 15개
- **API 엔드포인트**: 5개
- **주요 페이지**: 5개
- **컴포넌트**: 25개

## 🎯 성공 기준

1. ✅ 모든 6개 브랜치 핵심 기능 포함
2. ✅ DB 스키마 중복 없음
3. ✅ 네비게이션 일관성
4. ✅ 타입 안전성 100%
5. ✅ 빌드 에러 0개
6. ✅ 실행 가능한 상태

---

**예상 작업 기간**: 10-14일
**우선순위**: Phase 1 → Phase 2 → Phase 3 → Phase 4
