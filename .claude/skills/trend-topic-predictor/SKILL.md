---
name: trend-topic-predictor
description: Predict likely IT Professional Examination topics by analyzing technology trends, security incidents timeline, and exam pattern correlations. Uses historical data to forecast topics 3-6 months ahead based on issue emergence timing.
---

# Trend Topic Predictor (시사성 기반 예상 토픽 예측기)

## Overview

정보관리기술사 시험의 출제 패턴을 분석하여, 시사성 있는 기술 이슈가 시험에 반영되는 시간차를 파악하고, 향후 시험에 출제될 가능성이 높은 토픽을 예측합니다.

## Historical Timeline Analysis (검증된 패턴)

### Case Study 1: MCP (Model Context Protocol)
**타임라인**:
- 2024년 11월 25일: Anthropic이 MCP 최초 발표
- 2025년 2월: 폭발적 인기 시작
- 2025년 3월: OpenAI 공식 채택 (업계 표준화)
- **2025년 5월 17일 (136회 시험)**: MCP 출제 ✅

**시간차 패턴**:
- 발표 후 **5.5개월** 만에 출제
- 인기 급증/표준화 후 **3개월** 만에 출제

**출제 배경**:
- AI 에이전트 간 통신 표준화라는 패러다임 전환
- OpenAI, Google DeepMind 등 주요 기업 채택
- 개발자 생태계 급속 확산

### Case Study 2: BPFdoor 악성코드
**타임라인**:
- 2021년: PwC가 최초 식별 (Chinese APT group)
- 2024년 3~7월: KT 서버 43대 감염 발견 (은폐 시도)
- 2024년 7월, 12월: 한국 통신업계 2차례 대규모 공격
- 2024~2025년: SKT USIM 정보 **2,695만 건** 유출 (23대 서버 감염)
- **2025년 8월 (137회 시험)**: BPFdoor 출제 ✅

**시간차 패턴**:
- 대규모 피해 발생 후 **6개월~1년** 만에 출제
- 언론 보도 집중 시점 기준 **8~12개월** 만에 출제

**출제 배경**:
- 국내 주요 통신사 연이은 피해
- 국가 기간망 보안 이슈로 확대
- 정부 조사 및 제도 개선 논의

## 출제 패턴 분류

### Pattern 1: 신기술 발표/표준화 (3~6개월 리드타임)
**특징**:
- 업계 표준으로 빠르게 채택되는 기술
- 주요 기업(Google, OpenAI, Microsoft 등)의 공식 지원
- 개발자 커뮤니티 급속 확산
- 패러다임 전환 성격

**예시**: MCP, Multimodal LLM, 프롬프트 엔지니어링

**탐지 방법**:
- GitHub Star 급증 (1주일 내 10K+ stars)
- Hacker News, Reddit 트렌딩
- 주요 기술 컨퍼런스 keynote
- 대기업 공식 블로그 발표

### Pattern 2: 보안 사건/사고 (6~12개월 리드타임)
**특징**:
- 국내 대규모 피해 사건
- 정부/기관 조사 진행
- 언론 집중 보도 (3일 이상 헤드라인)
- 법/제도 개선 논의

**예시**: BPFdoor, 대규모 개인정보 유출, 랜섬웨어 공격

**탐지 방법**:
- KISA/NCSC 보안 공지
- 국회 청문회/국정감사 이슈
- 과기정통부 정책 발표
- 주요 언론사 연속 보도

### Pattern 3: 정부 정책/법규 (발표 후 3~9개월)
**특징**:
- 정부 주도 디지털 전환 정책
- 새로운 법/규제 시행
- 국가 차원 기술 육성 전략
- 공공기관 도입 의무화

**예시**: AI 윤리기준, 데이터 3법, 제로 트러스트, AI 디지털교과서

**탐지 방법**:
- 과기정통부, 행안부 정책 발표
- 국가 디지털 전략 보고서
- 공공기관 가이드라인 배포
- 예산 편성 및 사업 공고

### Pattern 4: 학술/연구 성과 (6~18개월 리드타임)
**특징**:
- 주요 학회(NeurIPS, ICML, CVPR) 발표
- Nature/Science 게재
- 기술적 breakthrough
- 산업 적용 가능성 확인

**예시**: Transformer, VAE, GNN, 양자암호

**탐지 방법**:
- arXiv trending papers
- 주요 학회 Best Paper
- Google Scholar citations 급증
- 산업계 POC 성공 사례

## Prediction Workflow

### Step 1: 현재 시점 기준 이슈 수집
```
목표 시험일: 2026년 2월
현재 시점: 2025년 11월

탐색 범위:
- 신기술: 2025년 5월 ~ 11월 (3~6개월 전)
- 보안사건: 2024년 8월 ~ 2025년 5월 (6~12개월 전)
- 정부정책: 2025년 2월 ~ 8월 (3~9개월 전)
- 학술성과: 2024년 2월 ~ 2025년 5월 (6~18개월 전)
```

### Step 2: 이슈 스코어링
각 이슈를 다음 기준으로 평가 (0~10점):

**영향력 (Impact)**:
- [ ] 산업 전반에 영향 (8~10점)
- [ ] 특정 분야에 큰 영향 (5~7점)
- [ ] 제한적 영향 (1~4점)

**화제성 (Buzz)**:
- [ ] 주요 언론 연속 보도 (8~10점)
- [ ] 기술 커뮤니티 활발한 논의 (5~7점)
- [ ] 제한적 관심 (1~4점)

**국내 관련성 (Local Relevance)**:
- [ ] 국내 직접 영향/피해 (8~10점)
- [ ] 국내 기업/정부 채택 (5~7점)
- [ ] 해외 사례만 존재 (1~4점)

**출제기준 정합성 (Syllabus Fit)**:
- [ ] 6개 주요항목에 정확히 매칭 (8~10점)
- [ ] 여러 항목에 걸쳐 관련 (5~7점)
- [ ] 출제기준과 약한 연관 (1~4점)

**총점**: 32점 이상 → 고위험 토픽 ⚠️

### Step 3: 과거 출제 패턴 교차 검증
135~137회 분석 결과 활용:
- 최다 출제: 최신기술, 법규 및 정책 (평균 8.0문제, 26.7%)
- 안정 출제: 정보보안 (평균 4.0문제)
- 과소 출제: 소프트웨어 공학 (평균 3.7문제) → 반등 가능성

### Step 4: 예상 토픽 리스트 생성
우선순위별 분류:
1. **High Priority** (스코어 28점 이상): 출제 가능성 70%+
2. **Medium Priority** (스코어 20~27점): 출제 가능성 40~70%
3. **Low Priority** (스코어 12~19점): 출제 가능성 10~40%

### Step 5: 예상 문제 생성
각 토픽별:
- 출제 의도 분석
- 핵심 키워드 도출
- 예상 문제 유형 (정의형/설명형/비교형)
- 답안 작성 가이드

## 정보 수집 소스

### 국내 소스
**정부/공공**:
- 과기정통부 보도자료: https://www.msit.go.kr
- KISA 보안공지: https://www.kisa.or.kr
- 한국인터넷진흥원(KAIT)
- 국가정보자원관리원(NIRS)

**뉴스**:
- 전자신문, 디지털데일리, 블로터
- 보안뉴스, 데일리시큐
- IT조선, 지디넷코리아

**커뮤니티**:
- GeekNews (news.hada.io)
- OKKY
- 네이버 카페 (정보관리기술사)

### 해외 소스
**기술 트렌드**:
- Hacker News (news.ycombinator.com)
- Reddit r/programming, r/MachineLearning
- GitHub Trending
- arXiv.org (cs.AI, cs.CR)

**기업 블로그**:
- Google AI Blog
- OpenAI Blog
- Microsoft Research
- AWS Architecture Blog

**학회/컨퍼런스**:
- NeurIPS, ICML, CVPR (AI)
- USENIX Security, Black Hat (보안)
- SIGMOD, VLDB (데이터베이스)

## Output Format

```markdown
# 2026년 2월 정보관리기술사 예상 토픽 분석

## 분석 기준일: 2025년 11월 19일
## 목표 시험일: 2026년 2월 (D-75일)

---

## 🔥 High Priority Topics (출제 가능성 70%+)

### 1. [토픽명]
**카테고리**: [신기술/보안사건/정부정책/학술성과]
**출제기준**: [6개 항목 중 매칭]
**스코어**: [총점/40]

**타임라인**:
- [날짜]: [주요 이벤트]
- [날짜]: [주요 이벤트]
- 시험까지 경과: [X개월]

**출제 예상 근거**:
- [근거 1]
- [근거 2]
- [근거 3]

**핵심 키워드**:
- [키워드 1], [키워드 2], [키워드 3]

**예상 문제 유형**:
- [ ] 정의형: "[토픽]이란 무엇인가?"
- [ ] 설명형: "[토픽]에 대해 설명하시오"
- [ ] 비교형: "[A]와 [B]를 비교하시오"

**참고 자료**:
- [링크 1]
- [링크 2]

---

## ⚠️ Medium Priority Topics (출제 가능성 40~70%)

[동일 형식 반복]

---

## 📊 통계 요약

- High Priority: [N]개 토픽
- Medium Priority: [N]개 토픽
- Low Priority: [N]개 토픽

**출제기준별 분포**:
- 최신기술, 법규 및 정책: [N]개
- 정보보안: [N]개
- 컴퓨터 시스템 및 정보통신: [N]개
- 자료처리: [N]개
- 소프트웨어 공학: [N]개
- 정보 전략 및 관리: [N]개

**패턴별 분포**:
- 신기술: [N]개
- 보안사건: [N]개
- 정부정책: [N]개
- 학술성과: [N]개
```

## Integration with mock-exam-generator

이 skill은 `mock-exam-generator`와 연계하여 사용됩니다:

1. **trend-topic-predictor**: 예상 토픽 리스트 생성 (이 skill)
2. **mock-exam-generator**: 예상 토픽 기반 실전 모의 문제 생성

**연계 워크플로우**:
```bash
User: "2026년 2월 시험 대비 예상 토픽 분석해줘"
→ trend-topic-predictor 실행
→ High/Medium Priority 토픽 리스트 생성

User: "High Priority 토픽으로 모의고사 만들어줘"
→ mock-exam-generator 실행
→ 예상 토픽 기반 실전 문제 생성
```

## Example Usage

**User**: "2026년 2월 시험 대비 예상 토픽 분석해줘. 특히 AI와 보안 분야 중심으로"

**Process**:
1. 현재 시점 확인 (2025년 11월)
2. 탐색 범위 설정:
   - 신기술 (AI): 2025년 5~11월
   - 보안사건: 2024년 8월~2025년 5월
3. 이슈 수집 및 스코어링
4. 과거 패턴 교차 검증 (135~137회)
5. 우선순위별 토픽 리스트 생성

**Output**:
- High Priority: 5~7개 토픽
- Medium Priority: 8~12개 토픽
- 각 토픽별 상세 분석 및 예상 문제 유형

## Quality Assurance

생성된 예상 토픽은 다음을 충족해야 합니다:

✅ **근거 기반**: 명확한 타임라인과 이벤트 기록
✅ **패턴 검증**: 과거 출제 사례와 유사한 패턴
✅ **실용성**: 답안 작성 가능한 수준의 자료 존재
✅ **시사성**: 현재 업계/정부/학계에서 논의 중
✅ **출제기준 정합성**: 6개 주요항목에 명확히 매칭

## Continuous Updates

이 skill은 정기적으로 업데이트됩니다:
- **월별**: 새로운 이슈 추가 및 스코어 재평가
- **시험 후**: 실제 출제 결과로 패턴 검증 및 알고리즘 개선
- **분기별**: 탐지 소스 및 스코어링 기준 리뷰

---

## Related Skills

- **mock-exam-generator**: 예상 토픽 기반 모의 문제 생성
- **grading**: 예상 문제 답안 채점 및 피드백
- **topic-generator**: 예상 토픽 상세 답안지 생성
