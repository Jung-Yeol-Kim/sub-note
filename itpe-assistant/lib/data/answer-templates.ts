/**
 * Answer Templates and Guidelines for IT Professional Examination
 * Based on 깍두기_19칸.pdf and standard answer format
 */

/**
 * 깍두기 (19칸 답안지 작성 가이드)
 * - 총 19줄로 구성된 답안지에 효과적으로 내용을 배치하는 전략
 */
export const KKAKDUGI_19_LINES_GUIDE = {
  description:
    "정보관리기술사 시험 답안지는 19칸(19줄)으로 구성되며, 제한된 공간에서 핵심 내용을 명확하게 전달하는 것이 중요",
  structure: [
    {
      lines: "1-2",
      section: "제목 및 정의",
      content: "주제명 + 간결한 정의 (1-2줄)",
      example: "OAuth 2.0\n인가 프레임워크로 제3자 앱이 사용자 동의 하에 리소스 접근",
    },
    {
      lines: "3-4",
      section: "공백 또는 배경",
      content: "가독성을 위한 공백 또는 간단한 배경 설명 (선택)",
      example: "- 등장 배경: 안전한 제3자 인증 필요성 증대",
    },
    {
      lines: "5-12",
      section: "핵심 설명 (다이어그램 + 표)",
      content:
        "다이어그램 (4-5줄) + 표 (4-5줄), 시각적 요소로 구조/프로세스 명확히 전달",
      example:
        "1) 인증 흐름 (다이어그램)\n[Client] → [Authorization Server] → [Resource Server]\n2) Grant Types (표)\n| 유형 | 사용 사례 | 특징 |",
    },
    {
      lines: "13-17",
      section: "추가 설명 또는 특징",
      content:
        "핵심 특징, 장단점, 비교, 고려사항 등 (3-5줄), 불릿 포인트 활용",
      example:
        "3) 보안 고려사항\n- HTTPS 필수 사용\n- State 파라미터로 CSRF 방지\n- PKCE 적용 (모바일)",
    },
    {
      lines: "18-19",
      section: "결론 또는 여백",
      content: "간단한 결론 또는 여백 (1-2줄)",
      example: "→ 현대 웹/모바일 앱 인증의 사실상 표준",
    },
  ],
  tips: [
    "제목은 굵게 또는 밑줄로 강조",
    "다이어그램은 간결하게 (3-5줄 이내)",
    "표는 3컬럼 × 3-4행 권장",
    "조사(은/는/이/가) 생략으로 간결성 확보",
    "핵심 키워드는 괄호 또는 강조 표시",
    "여백 적절히 활용하여 가독성 향상",
  ],
  commonMistakes: [
    "너무 많은 내용을 넣어 답안이 빽빽해짐",
    "다이어그램 없이 텍스트만 나열",
    "표 형식 없이 설명만 장황하게 작성",
    "키워드 미강조로 채점자가 핵심 파악 어려움",
  ],
};

/**
 * 깍두기 예시 템플릿 모음
 */
export const KKAKDUGI_EXAMPLES = [
  {
    topic: "기술 개념 설명형",
    template: `[주제명]
정의: [1-2줄로 명확한 정의, 핵심 키워드 포함]

1. [주제명] 설명
  1) 구조/아키텍처 (다이어그램)
    [간단한 블록 다이어그램 3-4줄]
    - 다이어그램 설명 1줄

  2) 분류/유형 (표)
    | 구분 | 특징 | 비고 |
    |------|------|------|
    | A    | ...  | ...  |
    | B    | ...  | ...  |
    - 표 설명 1줄

2. 고려사항
  - 고려사항 1
  - 고려사항 2
  - 고려사항 3`,
    linesUsed: 19,
  },
  {
    topic: "프로세스/절차 설명형",
    template: `[주제명]
정의: [핵심 목적과 개념]

1. [주제명] 프로세스
  1) 처리 흐름 (다이어그램)
    단계1 → 단계2 → 단계3 → 단계4
      ↓       ↓       ↓       ↓
    [세부내용]
    - 흐름도 설명

  2) 단계별 상세 (표)
    | 단계 | 활동 | 산출물 |
    |------|------|--------|
    | 1    | ...  | ...    |
    | 2    | ...  | ...    |

2. 적용 시 고려사항
  - 고려사항 1
  - 고려사항 2`,
    linesUsed: 18,
  },
  {
    topic: "비교 분석형",
    template: `[주제명]
정의: [비교 대상들의 공통 정의]

1. [A] vs [B] 비교
  1) 특징 비교 (표)
    | 구분 | A | B |
    |------|---|---|
    | 목적 | ... | ... |
    | 방식 | ... | ... |
    | 장점 | ... | ... |
    | 단점 | ... | ... |

  2) 아키텍처 차이 (다이어그램)
    [A 구조]     [B 구조]
    [간단 비교]

2. 선택 기준
  - A 적합: [상황]
  - B 적합: [상황]`,
    linesUsed: 19,
  },
  {
    topic: "보안 기술 설명형",
    template: `[주제명]
정의: [보안 기술의 목적과 개념]

1. [주제명] 설명
  1) 보안 위협 및 대응 구조 (다이어그램)
    [위협] → [탐지] → [차단] → [복구]
    - 단계별 설명

  2) 보안 메커니즘 (표)
    | 기법 | 목적 | 구현 방식 |
    |------|------|-----------|
    | ...  | ...  | ...       |

2. 보안 고려사항
  - 인증/인가 강화
  - 암호화 적용
  - 로깅 및 모니터링
  - 정기 보안 점검`,
    linesUsed: 18,
  },
];

/**
 * 답안 작성 체크리스트
 */
export const ANSWER_WRITING_CHECKLIST = {
  structure: [
    "✓ 제목이 명확하고 굵게 표시되어 있는가?",
    "✓ 정의가 1-2줄로 간결하게 작성되었는가?",
    "✓ 핵심 키워드가 정의에 포함되어 있는가?",
    "✓ 다이어그램이 포함되어 있는가? (3-5줄)",
    "✓ 표가 포함되어 있는가? (3컬럼 권장)",
    "✓ 전체 구조가 1-2-3 섹션으로 나뉘어 있는가?",
  ],
  content: [
    "✓ 조사(은/는/이/가)를 생략하여 간결하게 작성했는가?",
    "✓ 핵심 키워드를 강조 표시했는가?",
    "✓ 불필요한 설명을 제거하고 핵심만 남겼는가?",
    "✓ 전문 용어를 정확하게 사용했는가?",
    "✓ 최신 기술 동향이 반영되어 있는가?",
  ],
  format: [
    "✓ 19줄 이내로 작성되었는가?",
    "✓ 여백이 적절히 배치되어 가독성이 좋은가?",
    "✓ 다이어그램과 표가 균형있게 배치되었는가?",
    "✓ 글씨 크기가 일정하고 읽기 편한가?",
  ],
  keywords: [
    "✓ 주제의 핵심 키워드 3-5개가 포함되었는가?",
    "✓ 정의에서 키워드가 명확히 드러나는가?",
    "✓ 설명 섹션에서 키워드가 반복 강조되는가?",
  ],
};

/**
 * 점수 향상 전략
 */
export const SCORE_IMPROVEMENT_STRATEGIES = {
  from3to4: {
    title: "3점 → 4점 상승 전략",
    strategies: [
      {
        area: "구조 개선",
        actions: [
          "다이어그램을 반드시 추가 (현재 없다면)",
          "표를 3컬럼 형식으로 재구성",
          "1-2-3 섹션 구조 명확히 구분",
        ],
      },
      {
        area: "내용 보강",
        actions: [
          "핵심 키워드 2-3개 추가",
          "최신 기술 동향 1-2개 언급",
          "실제 적용 사례 또는 제품명 추가",
        ],
      },
      {
        area: "표현 개선",
        actions: [
          "조사 생략으로 간결성 확보",
          "전문 용어 정확히 사용",
          "능동형 문장으로 작성",
        ],
      },
    ],
  },
  from4to5: {
    title: "4점 → 5점 상승 전략 (만점 전략)",
    strategies: [
      {
        area: "기술 깊이",
        actions: [
          "핵심 알고리즘 또는 프로토콜 상세 설명",
          "국제 표준 (ISO, RFC 등) 명시",
          "성능 지표 (latency, throughput 등) 구체적 수치 제시",
        ],
      },
      {
        area: "실무 적용",
        actions: [
          "대표 오픈소스/상용 제품 2-3개 비교",
          "실제 아키텍처 패턴 제시",
          "트레이드오프 분석 (장단점)",
        ],
      },
      {
        area: "최신 동향",
        actions: [
          "최근 1-2년 내 기술 발전 내용",
          "업계 표준 또는 Best Practice",
          "미래 발전 방향 또는 한계점",
        ],
      },
      {
        area: "완성도",
        actions: [
          "고려사항 섹션을 구체적으로 (보안, 성능, 확장성)",
          "도입 시 체크리스트 제공",
          "관련 기술과의 연계성 명시",
        ],
      },
    ],
  },
};

/**
 * 주제별 필수 키워드 가이드
 */
export const TOPIC_KEYWORDS_GUIDE = {
  보안: [
    "인증 (Authentication)",
    "인가 (Authorization)",
    "기밀성 (Confidentiality)",
    "무결성 (Integrity)",
    "가용성 (Availability)",
    "암호화 (Encryption)",
    "접근 통제 (Access Control)",
  ],
  네트워크: [
    "프로토콜 (Protocol)",
    "계층 (Layer)",
    "대역폭 (Bandwidth)",
    "지연시간 (Latency)",
    "QoS",
    "라우팅 (Routing)",
    "스위칭 (Switching)",
  ],
  데이터베이스: [
    "ACID",
    "트랜잭션 (Transaction)",
    "정규화 (Normalization)",
    "인덱스 (Index)",
    "쿼리 최적화",
    "동시성 제어 (Concurrency Control)",
    "복제 (Replication)",
  ],
  클라우드: [
    "가상화 (Virtualization)",
    "확장성 (Scalability)",
    "탄력성 (Elasticity)",
    "IaaS/PaaS/SaaS",
    "마이크로서비스 (Microservices)",
    "컨테이너 (Container)",
    "오케스트레이션 (Orchestration)",
  ],
  소프트웨어공학: [
    "생명주기 (Lifecycle)",
    "요구사항 (Requirements)",
    "설계 패턴 (Design Pattern)",
    "테스트 (Testing)",
    "형상 관리 (Configuration Management)",
    "CI/CD",
    "애자일 (Agile)",
  ],
};

/**
 * 다이어그램 작성 가이드
 */
export const DIAGRAM_GUIDE = {
  types: [
    {
      type: "플로우차트 (Flow Chart)",
      usage: "프로세스, 알고리즘 흐름",
      example: `시작 → 입력 → 처리 → 판단 → 출력 → 종료
              ↓ (No)
            [예외 처리]`,
      tips: "화살표로 흐름 명확히, 4-5단계 이내",
    },
    {
      type: "블록 다이어그램 (Block Diagram)",
      usage: "시스템 구조, 아키텍처",
      example: `[클라이언트] ←→ [API Gateway] ←→ [백엔드 서비스]
                      ↓
                 [데이터베이스]`,
      tips: "계층 구조 명확히, 주요 컴포넌트만",
    },
    {
      type: "시퀀스 다이어그램",
      usage: "객체 간 메시지 교환",
      example: `[A]     [B]     [C]
 |       |       |
 |--요청-->|       |
 |       |--조회-->|
 |       |<--응답--|
 |<--결과--|       |`,
      tips: "시간 순서대로, 3-4개 객체 이내",
    },
  ],
  bestPractices: [
    "복잡도 최소화: 핵심 요소만 포함",
    "일관된 기호: 화살표, 박스 스타일 통일",
    "레이블 명확: 각 요소에 간결한 이름",
    "공간 효율: 3-5줄 이내로 작성",
  ],
};

/**
 * 표 작성 가이드
 */
export const TABLE_GUIDE = {
  recommended: {
    columns: 3,
    rows: "3-5",
    description: "3컬럼 × 3-5행이 가장 효과적",
  },
  columnTypes: [
    {
      pattern: "구분 - 특징 - 비고",
      usage: "분류, 유형 설명",
      example: "| 유형 | 특징 | 활용 사례 |",
    },
    {
      pattern: "단계 - 내용 - 산출물",
      usage: "프로세스, 절차",
      example: "| 단계 | 활동 | 산출물 |",
    },
    {
      pattern: "항목 - A - B",
      usage: "비교 분석",
      example: "| 구분 | RDBMS | NoSQL |",
    },
    {
      pattern: "기법 - 목적 - 방법",
      usage: "기술, 메커니즘",
      example: "| 기법 | 목적 | 구현 방식 |",
    },
  ],
  tips: [
    "헤더는 굵게 표시",
    "각 셀은 1-2줄로 간결하게",
    "수직선으로 컬럼 명확히 구분",
    "표 아래 1줄 설명 추가 권장",
  ],
};

/**
 * 시험 당일 시간 관리 전략
 */
export const TIME_MANAGEMENT_STRATEGY = {
  perQuestion: {
    totalTime: "25분",
    breakdown: [
      { phase: "문제 분석 및 구상", minutes: 3, description: "키워드 파악, 구조 스케치" },
      { phase: "답안 작성", minutes: 18, description: "정의 → 다이어그램 → 표 → 고려사항" },
      { phase: "검토 및 수정", minutes: 4, description: "오탈자, 누락 확인" },
    ],
  },
  writingOrder: [
    "1. 제목과 정의부터 작성 (확실한 내용)",
    "2. 다이어그램 스케치 (공간 확보)",
    "3. 표 작성 (구조화된 내용)",
    "4. 설명 및 고려사항 채우기",
    "5. 최종 검토 (키워드, 오탈자)",
  ],
};

export default {
  KKAKDUGI_19_LINES_GUIDE,
  KKAKDUGI_EXAMPLES,
  ANSWER_WRITING_CHECKLIST,
  SCORE_IMPROVEMENT_STRATEGIES,
  TOPIC_KEYWORDS_GUIDE,
  DIAGRAM_GUIDE,
  TABLE_GUIDE,
  TIME_MANAGEMENT_STRATEGY,
};
