/**
 * Sample Answers from data/샘플_답안/
 * These are high-quality example answers for the IT Professional Examination
 */

import { StandardSubNote } from "../types/subnote";

export const SAMPLE_ANSWERS: Partial<StandardSubNote>[] = [
  // 1. DB 옵티마이저 (1교시)
  {
    title: "DB 옵티마이저 (Database Optimizer)",
    syllabusMapping: {
      categoryId: "3",
      categoryName: "자료처리",
      subCategoryName: "데이터베이스",
    },
    tags: ["데이터베이스", "옵티마이저", "쿼리 최적화", "실행 계획", "성능"],
    difficulty: 4,
    examFrequency: 5,
    sections: {
      definition: {
        content:
          "DB 옵티마이저는 SQL 쿼리를 가장 효율적으로 실행하기 위한 최적의 실행 계획을 생성하는 DBMS의 핵심 컴포넌트로, 통계 정보와 비용 기반 모델을 활용하여 쿼리 실행 경로를 결정",
        keywords: [
          "옵티마이저",
          "실행 계획",
          "비용 기반",
          "규칙 기반",
          "통계 정보",
          "쿼리 변환",
        ],
        context:
          "대용량 데이터 처리 환경에서 쿼리 성능 최적화를 위한 필수 기술",
      },
      explanation: {
        title: "DB 옵티마이저 설명",
        subsections: [
          {
            type: "diagram",
            title: "옵티마이저 처리 과정",
            content: `SQL 쿼리
    ↓
[구문 분석 (Parser)]
    ↓
[쿼리 변환 (Query Transformer)]
    ↓
[비용 계산 (Cost Estimator)] ← 통계 정보
    ↓
[실행 계획 생성 (Plan Generator)]
    ↓
[실행 엔진 (Execution Engine)]
    ↓
결과 반환`,
            description:
              "옵티마이저는 SQL 쿼리를 파싱 후 다양한 실행 계획의 비용을 계산하여 최적 경로 선택",
          },
          {
            type: "table",
            title: "옵티마이저 유형별 특징",
            headers: ["구분", "특징", "장단점"],
            rows: [
              [
                "규칙 기반 (RBO)",
                "미리 정의된 규칙에 따라 실행 계획 생성",
                "단순하나 데이터 분포 미반영, 예측 가능",
              ],
              [
                "비용 기반 (CBO)",
                "통계 정보 기반 비용 계산 후 최적 계획 선택",
                "정확하나 통계 정보 관리 필요, 성능 우수",
              ],
              [
                "적응형 (Adaptive)",
                "실행 중 통계 수집 및 계획 동적 조정",
                "유연하나 복잡도 증가, 최신 DBMS 적용",
              ],
            ],
            description:
              "현대 DBMS는 주로 CBO 채택, Oracle 19c부터 Adaptive 기능 강화",
          },
          {
            type: "process",
            title: "옵티마이저 튜닝 절차",
            steps: [
              {
                number: 1,
                title: "실행 계획 분석",
                description:
                  "EXPLAIN PLAN 또는 AUTOTRACE로 현재 실행 계획 확인, Full Table Scan 및 비효율적 조인 식별",
              },
              {
                number: 2,
                title: "통계 정보 갱신",
                description:
                  "ANALYZE TABLE 또는 DBMS_STATS로 테이블/인덱스 통계 수집, 정확한 카디널리티 확보",
              },
              {
                number: 3,
                title: "힌트 적용",
                description:
                  "/*+ INDEX(table_name index_name) */ 등 힌트로 실행 계획 제어, 옵티마이저 동작 조정",
              },
              {
                number: 4,
                title: "인덱스 최적화",
                description:
                  "적절한 인덱스 추가/삭제, 복합 인덱스 컬럼 순서 조정, 커버링 인덱스 활용",
              },
              {
                number: 5,
                title: "쿼리 재작성",
                description:
                  "서브쿼리를 조인으로 변환, EXISTS 대신 IN 사용 검토, 불필요한 DISTINCT 제거",
              },
            ],
          },
        ],
      },
      additional: {
        title: "고려사항 및 활용 전략",
        content:
          "통계 정보는 주기적 갱신 필요 (데이터 변경 10% 이상 시), SQL 프로파일 및 베이스라인으로 안정적 실행 계획 유지, AWR 리포트로 성능 모니터링 및 개선점 도출, Adaptive Query Optimization으로 실행 중 계획 조정 활용",
      },
    },
    format: {
      estimatedLines: 28,
      pageCount: 1,
      hasEmoji: false,
      particlesOmitted: true,
    },
  },

  // 2. ISO 21500 (1교시)
  {
    title: "ISO 21500 (프로젝트 관리 가이던스)",
    syllabusMapping: {
      categoryId: "2",
      categoryName: "소프트웨어 공학",
      subCategoryName: "프로젝트 관리",
    },
    tags: ["프로젝트 관리", "ISO 표준", "PM", "거버넌스", "프로세스"],
    difficulty: 3,
    examFrequency: 3,
    sections: {
      definition: {
        content:
          "ISO 21500은 프로젝트 관리에 대한 국제 표준으로, 프로젝트 관리 프로세스와 개념을 정의하고 모든 유형의 프로젝트에 적용 가능한 가이던스를 제공하는 범용 프로젝트 관리 프레임워크",
        keywords: [
          "ISO 21500",
          "프로젝트 관리",
          "프로세스 그룹",
          "주제 그룹",
          "거버넌스",
          "이해관계자",
        ],
        context:
          "PMBOK과 유사하나 더 간결하고 범용적인 국제 표준, 2012년 제정",
      },
      explanation: {
        title: "ISO 21500 설명",
        subsections: [
          {
            type: "table",
            title: "5가지 프로세스 그룹",
            headers: ["프로세스 그룹", "목적", "주요 활동"],
            rows: [
              [
                "착수 (Initiating)",
                "프로젝트 시작 승인",
                "프로젝트 헌장 작성, 이해관계자 식별",
              ],
              [
                "기획 (Planning)",
                "수행 계획 수립",
                "범위/일정/비용 계획, 리스크 관리 계획",
              ],
              [
                "실행 (Implementing)",
                "계획된 작업 수행",
                "팀 관리, 품질 보증, 의사소통 수행",
              ],
              [
                "통제 (Controlling)",
                "진행 상황 모니터링",
                "변경 통제, 성과 측정, 리스크 대응",
              ],
              [
                "종료 (Closing)",
                "프로젝트 완료 및 종료",
                "인수인계, 교훈 문서화, 계약 종료",
              ],
            ],
            description: "프로젝트 생명주기 전반을 체계적으로 관리하기 위한 프로세스 분류",
          },
          {
            type: "table",
            title: "10가지 주제 그룹",
            headers: ["주제 그룹", "관리 영역", "핵심 요소"],
            rows: [
              ["통합", "프로젝트 전체 조정", "프로젝트 헌장, 변경 관리"],
              ["이해관계자", "이해관계자 관리", "식별, 참여, 커뮤니케이션"],
              ["범위", "요구사항 및 산출물", "WBS, 범위 검증"],
              ["자원", "인적/물적 자원", "팀 구성, 자원 할당"],
              ["시간", "일정 관리", "활동 정의, 일정 개발"],
              ["원가", "예산 및 비용", "비용 산정, 원가 통제"],
              ["리스크", "불확실성 관리", "리스크 식별, 대응 계획"],
              ["품질", "품질 보증 및 통제", "품질 계획, 품질 검사"],
              ["조달", "외부 구매 관리", "계약 관리, 공급업체 선정"],
              ["의사소통", "정보 전달", "보고, 회의, 문서 관리"],
            ],
            description: "프로젝트 관리의 10가지 핵심 지식 영역",
          },
        ],
      },
      additional: {
        title: "적용 시 고려사항",
        content:
          "조직 특성에 맞게 프로세스 조정 (Tailoring) 필요, PMBOK/PRINCE2 등 타 방법론과 병행 가능, 애자일 환경에서도 기본 원칙 적용 가능, 프로젝트 거버넌스 체계와 연계 운영",
      },
    },
    format: {
      estimatedLines: 26,
      pageCount: 1,
      hasEmoji: false,
      particlesOmitted: true,
    },
  },

  // 3. Purdue 모델 (1교시)
  {
    title: "Purdue 모델 (Purdue Reference Model)",
    syllabusMapping: {
      categoryId: "5",
      categoryName: "정보보안",
      subCategoryName: "산업 제어 시스템 보안",
    },
    tags: ["ICS", "산업 제어", "보안", "네트워크 분리", "OT"],
    difficulty: 4,
    examFrequency: 3,
    sections: {
      definition: {
        content:
          "Purdue 모델은 산업 제어 시스템(ICS)의 네트워크 아키텍처를 계층별로 분리하여 보안을 강화하는 참조 모델로, IT와 OT 영역을 명확히 구분하고 각 계층 간 접근 제어를 통해 사이버 위협으로부터 산업 시설을 보호",
        keywords: [
          "Purdue 모델",
          "ICS",
          "OT",
          "계층 분리",
          "DMZ",
          "제어 시스템",
          "네트워크 세그먼테이션",
        ],
        context:
          "Industry 4.0 시대 스마트 팩토리 보안의 핵심 프레임워크, ISA-95 기반",
      },
      explanation: {
        title: "Purdue 모델 설명",
        subsections: [
          {
            type: "diagram",
            title: "Purdue 모델 계층 구조",
            content: `[Level 5] 기업 네트워크 (Enterprise Network)
           ↕ DMZ
[Level 4] 비즈니스 계획 및 물류 (Business Planning)
           ↕ DMZ
[Level 3] 제조 운영 관리 (Manufacturing Operations)
           ↕ DMZ
───────────────────────────────────────
[Level 2] 감독 제어 (Supervisory Control) - SCADA
           ↕
[Level 1] 기본 제어 (Basic Control) - PLC, DCS
           ↕
[Level 0] 물리 프로세스 (Physical Process) - 센서, 액추에이터`,
            description:
              "Level 0-2는 OT(운영 기술), Level 3-5는 IT(정보 기술), DMZ로 계층 간 분리",
          },
          {
            type: "table",
            title: "계층별 특징 및 보안 요구사항",
            headers: ["계층", "기능", "보안 요구사항"],
            rows: [
              [
                "Level 5",
                "ERP, 본사 네트워크",
                "방화벽, IDS/IPS, 접근 통제",
              ],
              [
                "Level 4",
                "MES, 생산 계획",
                "DMZ 구성, 데이터 다이오드",
              ],
              [
                "Level 3",
                "SCADA, HMI",
                "네트워크 분리, 화이트리스트",
              ],
              [
                "Level 2",
                "PLC, DCS 제어",
                "물리적 격리, 인증 강화",
              ],
              [
                "Level 1",
                "센서, 액추에이터",
                "펌웨어 검증, 변조 방지",
              ],
              [
                "Level 0",
                "물리 장비",
                "물리 보안, 유지보수 통제",
              ],
            ],
            description: "각 계층마다 차별화된 보안 통제 적용 필요",
          },
        ],
      },
      additional: {
        title: "적용 시 고려사항",
        content:
          "레거시 시스템 통합 시 점진적 적용, Zero Trust 개념과 결합하여 강화, 무선 통신 구간은 암호화 필수, ICS-CERT 권고사항 지속 모니터링, 정기적 보안 진단 및 침투 테스트 수행",
      },
    },
    format: {
      estimatedLines: 27,
      pageCount: 1,
      hasEmoji: false,
      particlesOmitted: true,
    },
  },

  // 4. NoSQL (2교시)
  {
    title: "NoSQL (Not Only SQL)",
    syllabusMapping: {
      categoryId: "3",
      categoryName: "자료처리",
      subCategoryName: "데이터베이스",
    },
    tags: [
      "NoSQL",
      "빅데이터",
      "분산 데이터베이스",
      "확장성",
      "비정형 데이터",
    ],
    difficulty: 4,
    examFrequency: 6,
    sections: {
      definition: {
        content:
          "NoSQL은 관계형 데이터베이스의 ACID 속성과 정규화 대신 수평적 확장성, 유연한 스키마, 고가용성을 우선시하는 비관계형 데이터베이스로, 빅데이터와 실시간 웹 애플리케이션에 최적화된 데이터 저장 및 처리 솔루션",
        keywords: [
          "NoSQL",
          "수평 확장",
          "CAP 정리",
          "BASE",
          "스키마리스",
          "분산 시스템",
        ],
        context:
          "2000년대 후반 웹 2.0과 빅데이터 시대에 등장, MongoDB, Cassandra, Redis 등 다양한 구현체",
      },
      explanation: {
        title: "NoSQL 설명",
        subsections: [
          {
            type: "table",
            title: "NoSQL 유형별 특징",
            headers: ["유형", "데이터 모델", "대표 제품 및 활용"],
            rows: [
              [
                "Key-Value",
                "키-값 쌍 저장",
                "Redis, DynamoDB / 세션, 캐시",
              ],
              [
                "Document",
                "JSON/BSON 문서",
                "MongoDB, CouchDB / CMS, 카탈로그",
              ],
              [
                "Column-Family",
                "컬럼 기반 저장",
                "Cassandra, HBase / 시계열, 로그",
              ],
              [
                "Graph",
                "노드-엣지 그래프",
                "Neo4j, ArangoDB / SNS, 추천",
              ],
            ],
            description: "데이터 특성과 사용 패턴에 따라 적합한 유형 선택",
          },
          {
            type: "table",
            title: "RDBMS vs NoSQL 비교",
            headers: ["구분", "RDBMS", "NoSQL"],
            rows: [
              ["데이터 모델", "정규화된 테이블", "유연한 스키마"],
              ["확장성", "수직 확장 (Scale-Up)", "수평 확장 (Scale-Out)"],
              ["트랜잭션", "ACID 보장", "BASE (최종 일관성)"],
              ["조인", "복잡한 조인 지원", "조인 제한적, 비정규화"],
              ["사용 사례", "금융, ERP", "빅데이터, 실시간 서비스"],
            ],
            description: "각 시스템은 트레이드오프 관계, 요구사항에 따라 선택",
          },
          {
            type: "diagram",
            title: "CAP 정리",
            content: `     [일관성 (Consistency)]
           /                \\
          /                  \\
[가용성]  ────────────  [파티션 내성]
(Availability)        (Partition Tolerance)

• CA: RDBMS (파티션 발생 시 불가)
• CP: MongoDB, HBase (일관성 우선)
• AP: Cassandra, DynamoDB (가용성 우선)`,
            description:
              "분산 시스템에서 세 가지 속성 중 최대 두 가지만 동시 만족 가능",
          },
        ],
      },
      additional: {
        title: "도입 시 고려사항",
        content:
          "트랜잭션 요구사항 검토 (금융 등은 RDBMS 유지), 데이터 일관성 vs 성능 트레이드오프 분석, 샤딩 및 복제 전략 수립, 폴리글랏 퍼시스턴스로 혼용 가능, 백업 및 마이그레이션 계획 수립",
      },
    },
    format: {
      estimatedLines: 29,
      pageCount: 1,
      hasEmoji: false,
      particlesOmitted: true,
    },
  },

  // 5. QoS (2교시)
  {
    title: "QoS (Quality of Service)",
    syllabusMapping: {
      categoryId: "4",
      categoryName: "컴퓨터 시스템 및 정보통신",
      subCategoryName: "네트워크",
    },
    tags: ["QoS", "네트워크", "트래픽 관리", "대역폭", "우선순위"],
    difficulty: 4,
    examFrequency: 5,
    sections: {
      definition: {
        content:
          "QoS는 네트워크에서 특정 트래픽에 차별화된 서비스 수준을 제공하여 대역폭, 지연시간, 지터, 패킷 손실률 등 성능 지표를 보장하는 기술로, 실시간 멀티미디어 및 중요 업무 트래픽의 안정적 전송을 보장",
        keywords: [
          "QoS",
          "트래픽 분류",
          "대역폭 관리",
          "우선순위",
          "지연시간",
          "Diffserv",
          "IntServ",
        ],
        context:
          "VoIP, 화상회의, 스트리밍 등 실시간 서비스 증가로 중요성 확대",
      },
      explanation: {
        title: "QoS 설명",
        subsections: [
          {
            type: "diagram",
            title: "QoS 처리 흐름",
            content: `패킷 도착
    ↓
[분류 (Classification)] - DSCP, ACL
    ↓
[마킹 (Marking)] - CoS, ToS 설정
    ↓
[폴리싱/쉐이핑 (Policing/Shaping)]
    ↓
[큐잉 (Queuing)] - PQ, WFQ, CBWFQ
    ↓
[혼잡 회피 (Congestion Avoidance)] - WRED
    ↓
전송`,
            description:
              "패킷을 분류하고 우선순위에 따라 차별화된 처리 후 전송",
          },
          {
            type: "table",
            title: "QoS 모델 비교",
            headers: ["모델", "특징", "장단점 및 적용"],
            rows: [
              [
                "Best Effort",
                "QoS 미적용, 공평 처리",
                "단순하나 품질 보장 없음, 일반 인터넷",
              ],
              [
                "IntServ (RSVP)",
                "플로우별 자원 예약",
                "품질 보장 우수하나 확장성 제한, 소규모",
              ],
              [
                "DiffServ",
                "클래스 기반 차등 서비스",
                "확장성 우수하나 세밀도 낮음, 대규모 네트워크",
              ],
            ],
            description: "현대 네트워크는 주로 DiffServ 채택",
          },
          {
            type: "table",
            title: "QoS 메커니즘",
            headers: ["기법", "목적", "동작 방식"],
            rows: [
              [
                "트래픽 쉐이핑",
                "버스트 트래픽 평활화",
                "토큰 버킷으로 전송률 제어",
              ],
              [
                "트래픽 폴리싱",
                "대역폭 초과 패킷 드롭",
                "임계치 초과 시 패킷 폐기",
              ],
              [
                "우선순위 큐잉",
                "중요 트래픽 우선 전송",
                "여러 큐 운영, 우선순위 기반 스케줄링",
              ],
              [
                "WRED",
                "혼잡 사전 방지",
                "큐 점유율에 따라 선제적 패킷 드롭",
              ],
            ],
            description: "다양한 기법 조합으로 QoS 구현",
          },
        ],
      },
      additional: {
        title: "구현 시 고려사항",
        content:
          "엔드-투-엔드 QoS 정책 일관성 유지, 과도한 분류는 오버헤드 증가, VoIP는 지연 150ms 이하 목표, 모니터링으로 정책 효과 검증, SDN 환경에서는 중앙집중식 QoS 관리 활용",
      },
    },
    format: {
      estimatedLines: 30,
      pageCount: 1,
      hasEmoji: false,
      particlesOmitted: true,
    },
  },

  // 6. 디지털 포렌식 (2교시)
  {
    title: "디지털 포렌식 (Digital Forensics)",
    syllabusMapping: {
      categoryId: "5",
      categoryName: "정보보안",
      subCategoryName: "보안 관리",
    },
    tags: [
      "디지털 포렌식",
      "증거 수집",
      "사이버 범죄",
      "법적 증거",
      "보안 사고",
    ],
    difficulty: 4,
    examFrequency: 4,
    sections: {
      definition: {
        content:
          "디지털 포렌식은 컴퓨터, 네트워크, 모바일 등 디지털 기기에서 법적 증거능력을 갖춘 데이터를 과학적이고 체계적으로 수집, 보존, 분석, 제출하는 일련의 과정으로, 사이버 범죄 수사 및 보안 사고 대응에 활용",
        keywords: [
          "디지털 포렌식",
          "증거 수집",
          "무결성",
          "연결 고리 (Chain of Custody)",
          "휘발성 데이터",
          "이미징",
        ],
        context:
          "사이버 범죄 증가와 GDPR 등 규제 강화로 중요성 확대, 법정 증거 확보 핵심 기술",
      },
      explanation: {
        title: "디지털 포렌식 설명",
        subsections: [
          {
            type: "process",
            title: "디지털 포렌식 수행 절차",
            steps: [
              {
                number: 1,
                title: "식별 (Identification)",
                description:
                  "사고 인지 및 증거 대상 식별, 관련 시스템/기기/네트워크 파악, 법적 권한 확보 (영장 등)",
              },
              {
                number: 2,
                title: "수집 (Collection)",
                description:
                  "휘발성 데이터 우선 수집 (메모리, 네트워크), 디스크 이미징 (dd, FTK Imager), 해시값 생성 (MD5, SHA-256)",
              },
              {
                number: 3,
                title: "보존 (Preservation)",
                description:
                  "원본 데이터 write-block 장치로 보호, 연결 고리 (Chain of Custody) 문서화, 증거 물품 봉인 및 보관",
              },
              {
                number: 4,
                title: "분석 (Analysis)",
                description:
                  "타임라인 분석, 삭제 파일 복구, 로그 분석, 암호화 데이터 해독, 숨김 데이터 탐지 (스테가노그래피)",
              },
              {
                number: 5,
                title: "보고 (Reporting)",
                description:
                  "분석 결과를 법적 형식에 맞게 작성, 증거 자료 정리, 법정 증언 준비, 전문가 의견서 작성",
              },
            ],
          },
          {
            type: "table",
            title: "포렌식 유형별 특징",
            headers: ["유형", "대상", "주요 기법 및 도구"],
            rows: [
              [
                "컴퓨터 포렌식",
                "PC, 서버, 저장장치",
                "디스크 이미징, 파일 복구, EnCase",
              ],
              [
                "네트워크 포렌식",
                "트래픽, 로그",
                "패킷 캡처, Wireshark, IDS 로그",
              ],
              [
                "모바일 포렌식",
                "스마트폰, 태블릿",
                "물리/논리 추출, Cellebrite, UFED",
              ],
              [
                "클라우드 포렌식",
                "SaaS, IaaS 데이터",
                "API 로그 분석, 다중 관할권 고려",
              ],
              [
                "메모리 포렌식",
                "RAM, 휘발성 데이터",
                "메모리 덤프, Volatility, 악성코드 분석",
              ],
            ],
            description: "환경 특성에 따라 전문화된 기법 적용 필요",
          },
        ],
      },
      additional: {
        title: "법적 고려사항 및 윤리",
        content:
          "무결성 입증 위한 해시값 검증 필수, 개인정보보호법 준수 (최소 수집 원칙), 증거의 적법성 확보 (위법 수집 증거 배제), 전문가 자격 (EnCE, CCE 등) 보유, 라이선스 정책 준수 (도구 사용 시)",
      },
    },
    format: {
      estimatedLines: 32,
      pageCount: 1,
      hasEmoji: false,
      particlesOmitted: true,
    },
  },
];

// Helper to get sample answer by title
export function getSampleAnswerByTitle(
  title: string
): Partial<StandardSubNote> | undefined {
  return SAMPLE_ANSWERS.find((answer) => answer.title === title);
}

// Helper to get all sample answer titles
export function getSampleAnswerTitles(): string[] {
  return SAMPLE_ANSWERS.map((answer) => answer.title || "");
}

// Helper to get sample answers by category
export function getSampleAnswersByCategory(
  categoryId: string
): Partial<StandardSubNote>[] {
  return SAMPLE_ANSWERS.filter(
    (answer) => answer.syllabusMapping?.categoryId === categoryId
  );
}

// Helper to get sample answers by difficulty
export function getSampleAnswersByDifficulty(
  difficulty: number
): Partial<StandardSubNote>[] {
  return SAMPLE_ANSWERS.filter((answer) => answer.difficulty === difficulty);
}
