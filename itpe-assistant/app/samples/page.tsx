"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { AnswerSheetViewer } from "@/components/answer-sheet/answer-sheet-viewer";

// Sample answer data (in production, this would come from PDF parsing or database)
interface SampleAnswer {
  id: string;
  title: string;
  category: string;
  examPeriod: string;
  subject: string;
  content: string;
  fileName: string;
}

const sampleAnswers: SampleAnswer[] = [
  {
    id: "1",
    title: "Purdue 모델",
    category: "보안",
    examPeriod: "1교시",
    subject: "정보보안",
    fileName: "1교시_보안_Purdue모델.pdf",
    content: `1. 정의
- Purdue 모델: 산업제어시스템(ICS) 보안을 위한 계층적 네트워크 아키텍처 참조 모델
- 목적: OT(운영기술) 환경의 보안 강화 및 IT-OT 통합 시 보안 경계 설정

2. Purdue 모델 구조

1) 계층 구조 (다이어그램)
┌─────────────────────────────────┐
│ Level 5: Enterprise Network      │ ← IT 영역
├─────────────────────────────────┤
│ Level 4: Business Planning       │
├─────────────────────────────────┤
│ Level 3.5: DMZ (Demilitarized)  │ ← 보안 경계
├─────────────────────────────────┤
│ Level 3: Operations Management   │ ← OT 영역
├─────────────────────────────────┤
│ Level 2: Supervisory Control     │
├─────────────────────────────────┤
│ Level 1: Basic Control          │
├─────────────────────────────────┤
│ Level 0: Physical Process       │
└─────────────────────────────────┘

2) 계층별 특징 (표)
| 계층 | 주요 기능 | 보안 요구사항 |
|------|----------|-------------|
| Level 5 | 전사 IT 시스템 | 기밀성, 무결성 중심 |
| Level 4 | ERP, MES 등 | 통합 보안 정책 |
| Level 3.5 | DMZ, 방화벽 | 엄격한 접근통제 |
| Level 3 | HMI, SCADA | 가용성 최우선 |
| Level 2 | DCS, PLC | 실시간 제어 보안 |
| Level 1 | 센서, 액추에이터 | 물리적 보안 |
| Level 0 | 물리 프로세스 | 안전성 확보 |

3. 보안 적용 시 고려사항
- DMZ 구간의 엄격한 트래픽 검사
- OT 영역은 가용성 우선 보안 정책
- IT-OT 통합 시 Zero Trust 원칙 적용`,
  },
  {
    id: "2",
    title: "디지털 포렌식",
    category: "보안",
    examPeriod: "2교시",
    subject: "정보보안",
    fileName: "2교시_보안_디지털포렌식.pdf",
    content: `1. 정의
- 디지털 포렌식: 디지털 증거의 수집, 보존, 분석, 제출을 위한 과학적 절차 및 방법론
- 목적: 법적 증거능력 확보 및 사이버 범죄 수사 지원

2. 디지털 포렌식 프로세스

1) 절차 (다이어그램)
식별 → 수집 → 보존 → 분석 → 제출
  ↓      ↓      ↓      ↓      ↓
증거물  이미징  무결성  타임라인  법정
확인    수행   검증    재구성   증언

2) 단계별 주요 활동 (표)
| 단계 | 주요 활동 | 핵심 도구/기법 |
|------|----------|-------------|
| 식별 | 증거물 확인 및 문서화 | 현장 조사, 체크리스트 |
| 수집 | 비트 단위 복제 | dd, FTK Imager |
| 보존 | 해시값 생성 및 보관 | MD5, SHA-256 |
| 분석 | 데이터 복구 및 해석 | EnCase, Autopsy |
| 제출 | 보고서 작성 및 증언 | Chain of Custody |

3. 법적 증거능력 확보 요건
- 무결성: 해시값 검증으로 원본 훼손 방지
- 연속성: Chain of Custody 문서화
- 적법성: 압수수색 영장 등 법적 절차 준수
- 재현성: 동일한 결과 도출 가능성 보장`,
  },
  {
    id: "3",
    title: "옵티마이저",
    category: "데이터베이스",
    examPeriod: "1교시",
    subject: "데이터베이스",
    fileName: "1교시_DB_옵티마이저.pdf",
    content: `1. 정의
- 옵티마이저: SQL 쿼리의 최적 실행 계획을 생성하는 DBMS 핵심 컴포넌트
- 목적: 최소 비용으로 최대 성능을 내는 쿼리 실행 경로 선택

2. 옵티마이저 구조 및 동작

1) 옵티마이저 처리 과정 (다이어그램)
SQL 쿼리 입력
     ↓
파싱 (Parsing)
     ↓
최적화 (Optimization)
├─ 규칙기반 (RBO)
└─ 비용기반 (CBO)
     ↓
실행 계획 생성
     ↓
실행 엔진

2) 옵티마이저 유형 비교 (표)
| 구분 | 규칙기반(RBO) | 비용기반(CBO) |
|------|-------------|-------------|
| 판단 기준 | 사전 정의 규칙 | 통계정보 분석 |
| 유연성 | 낮음 (고정 규칙) | 높음 (동적 선택) |
| 정확성 | 데이터 특성 미반영 | 통계 기반 정확 |
| 대표 DBMS | 오래된 Oracle | 현대 DBMS 대부분 |
| 힌트 필요성 | 자주 필요 | 선택적 사용 |

3. 최적화 기법
- 조인 순서 최적화: Nested Loop, Hash, Merge Join
- 인덱스 활용: B-Tree, Bitmap 인덱스 선택
- 통계정보 활용: Cardinality, Selectivity 기반 비용 산정`,
  },
  {
    id: "4",
    title: "NoSQL",
    category: "데이터베이스",
    examPeriod: "2교시",
    subject: "데이터베이스",
    fileName: "2교시_DB_NoSQL.pdf",
    content: `1. 정의
- NoSQL: Not Only SQL의 약자로, 관계형 DB의 한계를 극복하기 위한 비관계형 데이터베이스
- 특징: 수평 확장성, 유연한 스키마, 대용량 분산 처리

2. NoSQL 유형 및 특징

1) 유형별 구조 (다이어그램)
Key-Value        Document         Column-Family    Graph
Redis            MongoDB          Cassandra        Neo4j
key → value      JSON 문서        Wide Column      Node-Edge
단순 빠름        유연한 구조      대용량 처리      관계 분석

2) NoSQL 유형 비교 (표)
| 유형 | 데이터 모델 | 대표 제품 | 적합 사용처 |
|------|-----------|----------|-----------|
| Key-Value | 키-값 쌍 | Redis, DynamoDB | 캐싱, 세션 저장 |
| Document | JSON/BSON | MongoDB, Couchbase | 콘텐츠 관리 |
| Column-Family | Wide Column | Cassandra, HBase | 로그, 시계열 |
| Graph | 노드-엣지 | Neo4j, ArangoDB | SNS, 추천시스템 |

3. CAP 이론과 선택
- Consistency (일관성)
- Availability (가용성)
- Partition tolerance (분할 내성)
→ 3가지 중 2가지만 보장 가능
- MongoDB: CP 지향
- Cassandra: AP 지향`,
  },
  {
    id: "5",
    title: "QoS (Quality of Service)",
    category: "네트워크",
    examPeriod: "2교시",
    subject: "네트워크",
    fileName: "2교시_네트워크_QoS.pdf",
    content: `1. 정의
- QoS: 네트워크에서 특정 트래픽에 우선순위를 부여하여 서비스 품질을 보장하는 기술
- 목적: 실시간 애플리케이션의 성능 보장 및 네트워크 효율성 향상

2. QoS 구조 및 메커니즘

1) QoS 처리 절차 (다이어그램)
패킷 수신
    ↓
분류 (Classification)
    ↓
마킹 (Marking)
    ↓
큐잉 (Queuing)
    ↓
스케줄링 (Scheduling)
    ↓
폴리싱/셰이핑
    ↓
전송

2) QoS 메커니즘 비교 (표)
| 메커니즘 | 기능 | 대표 기술 |
|---------|-----|----------|
| 분류 | 트래픽 식별 | ACL, NBAR |
| 마킹 | 우선순위 표시 | DSCP, CoS |
| 큐잉 | 대기열 관리 | FIFO, PQ, WFQ |
| 정체관리 | 혼잡 제어 | WRED, ECN |
| 트래픽제어 | 대역폭 관리 | Policing, Shaping |

3. IntServ vs DiffServ
- IntServ: RSVP 기반 자원 예약, 엄격한 QoS
- DiffServ: DSCP 기반 클래스 분류, 확장성 우수`,
  },
  {
    id: "6",
    title: "ISO 21500",
    category: "소프트웨어공학",
    examPeriod: "1교시",
    subject: "프로젝트관리",
    fileName: "1교시_SW_ISO21500.pdf",
    content: `1. 정의
- ISO 21500: 프로젝트 관리를 위한 국제 표준 가이드라인
- 목적: 프로젝트 관리의 보편적 원칙, 프로세스, 개념 제공

2. ISO 21500 프로세스 그룹 및 주제 영역

1) 5대 프로세스 그룹 (다이어그램)
착수 → 계획 → 실행
 ↓      ↓      ↓
통제 ← ← ← ← ←
 ↓
종료

2) 10대 주제 영역 (표)
| 주제 영역 | 주요 프로세스 | 핵심 활동 |
|---------|------------|----------|
| 통합 관리 | 프로젝트 헌장 승인 | 전체 조정 |
| 이해관계자 | 이해관계자 식별 | 참여 관리 |
| 범위 관리 | WBS 작성 | 요구사항 관리 |
| 자원 관리 | 팀 구성 | 인적/물적 자원 |
| 시간 관리 | 일정 개발 | 마일스톤 관리 |
| 원가 관리 | 예산 수립 | 비용 통제 |
| 리스크 관리 | 위험 식별/대응 | 불확실성 관리 |
| 품질 관리 | 품질 계획 | 품질 보증/통제 |
| 조달 관리 | 계약 관리 | 외부 조달 |
| 의사소통 | 정보 배포 | 보고 및 공유 |

3. PMBOK과의 관계
- ISO 21500: 국제 표준, 범용성 강조
- PMBOK: PMI 기반, 상세한 실무 가이드`,
  },
];

export default function SamplesPage() {
  const [selectedSample, setSelectedSample] = useState<SampleAnswer | null>(
    sampleAnswers[0]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/sub-notes">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              서브노트 목록으로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">샘플 답안</h1>
          <p className="text-muted-foreground mt-1">
            합격 답안 샘플을 답안지 형식으로 학습하세요
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Sample List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                샘플 목록
              </CardTitle>
              <CardDescription>
                {sampleAnswers.length}개의 합격 답안
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleAnswers.map((sample) => (
                <Button
                  key={sample.id}
                  variant={selectedSample?.id === sample.id ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 px-3"
                  onClick={() => setSelectedSample(sample)}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex items-center gap-2 w-full">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-semibold truncate">
                        {sample.title}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {sample.examPeriod}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {sample.category}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-sm">학습 가이드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>✓ 22줄 × 19칸 규격 준수</p>
              <p>✓ 정의 → 구조/표 → 고려사항 형식</p>
              <p>✓ 간결한 문장, 조사 생략</p>
              <p>✓ 다이어그램과 3단 표 활용</p>
              <p>✓ 핵심 키워드 강조</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Answer Sheet Viewer */}
        <div className="lg:col-span-3">
          {selectedSample ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {selectedSample.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedSample.examPeriod}</Badge>
                      <Badge variant="outline">{selectedSample.category}</Badge>
                      <Badge variant="outline">{selectedSample.subject}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      파일: {selectedSample.fileName}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AnswerSheetViewer
                  content={selectedSample.content}
                  showHeader={false}
                  showPrintButton={true}
                  title={selectedSample.title}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>왼쪽에서 샘플 답안을 선택하세요</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
