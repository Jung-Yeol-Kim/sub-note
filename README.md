# 정보관리기술사 Topic Sub-note

이 저장소는 정보관리기술사(IT Professional Examination) 대비를 위한 개인용 토픽 서브노트 모음입니다. 각 토픽은 실전 답안 작성 연습과 정리 자료를 바탕으로 주기적으로 보완됩니다.

## 프로젝트 목적
- Claude Code Skills를 활용한 토픽별 서브노트 자동 생성 및 관리
- AI 생성 토픽과 개인 재정의 서브노트의 체계적 분류 관리
- 템플릿과 레퍼런스를 정리하여 일관된 답안 스타일 확립
- **기출문제 분석**: 출제 경향 파악 및 전략적 학습 계획 수립

## 디렉터리 구조
```
sub-note/
├── .claude/
│   └── skills/              # Claude Code Skills
│       ├── topic-generator/     # AI 답안지 생성
│       ├── grading/             # 답안 채점
│       ├── keyword-analyzer/    # 키워드 분석
│       └── topic-comparer/      # 답안 비교
├── scripts/              # 기출문제 분석 도구
│   ├── exam_data_helper.py   # 문제 데이터 입력 헬퍼
│   ├── analyze.py            # 범용 분석 스크립트 (통합)
│   └── README.md             # 도구 사용 가이드
├── reports/              # 분석 리포트
│   ├── 129회_분석_리포트.md
│   ├── 130회_분석_리포트.md
│   └── ...
├── data/                 # 분석 데이터
│   ├── syllabus/            # 출제기준 원본 데이터
│   └── exam_results/        # 회차별 분석 결과
│       ├── 129회_문제목록.json
│       ├── 129회_출제기준_매칭결과_상세.json
│       ├── 129회_분석결과.json
│       └── ...
├── sub-notes/            # 주제별 서브노트
│   ├── ai/                  # Skills로 생성한 AI 토픽
│   └── human/               # 개인 재정의 서브노트
└── kpc/                  # 개인 학습 자료 (gitignore)
    ├── 00. 답안지 관련
    ├── 10. 기출풀이
    ├── 20. 모의고사
    ├── 30. 서브노트
    ├── 40. 주간모의고사
    └── 50. 자료실
```

## 답안지 작성 가이드

### 기본 원칙
1. **정의**: 특징/목적/기술이 포함된 명확한 구성 (명사형 마무리)
2. **목차 구성**: 문제에 집중한 1단락, 2단락 구성 (목차만 봐도 내용 파악 가능)
3. **그림(2.1)**: 구성요소 간 관계/활동/기술이 보이도록 균형있고 깔끔하게 작성
4. **표(2.2)**: 3단표로 작성, 그룹핑과 키워드가 명확하게 보이도록 구성
5. **간글**: 2단락 1)그림과 2)표 아래에 간략한 설명 작성
6. **분량**: 1페이지로 압축하여 작성
7. **작성 스타일**: 조사 생략, 간결하고 명확한 표현

### 답안 구조 템플릿
```
1. 정의
   - [토픽명]의 특징/목적/기술을 포함한 명확한 정의

2. [토픽명] 설명
   1) [토픽명]의 구조/프로세스/아키텍처 (그림)
      [구성요소 간 관계를 보여주는 다이어그램]
      - 간글: 그림에 대한 간략한 설명

   2) [토픽명]의 분류/유형/특징 (표)
      | 구분 | 세부 항목 | 설명 |
      |------|-----------|------|

      - 간글: 표에 대한 간략한 설명

3. (선택) 추가 설명/고려사항/전망
```

## 기출문제 분석 도구 사용법

### 워크플로우
```bash
# 1단계: 문제 데이터 입력
vi scripts/exam_data_helper.py  # EXAM_XXX_DATA 추가
python scripts/exam_data_helper.py

# 2단계: 분석 실행
python scripts/analyze.py 135              # 단일 회차
python scripts/analyze.py 135 136 137      # 여러 회차

# 3단계: 리포트 생성
python scripts/report_generator.py 135 136 137
```

### 주요 스크립트
1. **exam_data_helper.py**: 기출문제 데이터 입력 (수동)
2. **analyze.py**: 출제기준 매칭 분석 (통합 버전)
3. **report_generator.py**: 마크다운 리포트 생성

### 분석 결과 확인
- **리포트**: `reports/` 폴더의 마크다운 파일
- **상세 데이터**: `data/exam_results/` 폴더의 JSON 파일
- **자세한 사용법**: [scripts/README.md](scripts/README.md) 참고

## Sub-notes 관리 방식

### AI 생성 토픽 (sub-notes/ai/)
- `topic-generator` skill로 자동 생성된 답안
- 표준 템플릿과 구조를 따르는 일관된 형식
- 빠른 토픽 커버리지 확보용
- 생성 후 검증 필요

### 개인 서브노트 (sub-notes/human/)
- AI 생성 토픽을 기반으로 개인 스타일로 재정의
- 실전 경험과 피드백을 반영한 개선된 답안
- 자주 사용하는 템플릿과 표현 방식 적용
- 최종 학습 자료로 활용

### Skills 활용 워크플로우
```bash
# 1단계: AI 토픽 생성
topic-generator skill 사용 → sub-notes/ai/ 저장

# 2단계: 답안 평가
grading skill로 평가
keyword-analyzer로 키워드 검증

# 3단계: 개인화
sub-notes/human/에 재작성
개인 스타일과 경험 반영

# 4단계: 지속적 개선
topic-comparer로 여러 버전 비교
실전 피드백 반영하여 업데이트
```

## 업데이트 정책
- AI 생성 토픽은 `sub-notes/ai/`에 보관, 원본 유지
- 개인 재정의 서브노트는 `sub-notes/human/`에서 지속적 개선
- 기출풀이와 모의고사 피드백을 `sub-notes/human/`에 우선 반영
