# 최근 시험 출제 트렌드 (2022-2024)

## 출제 경향 분석

### 전반적 특징

1. **최신 기술 비중 증가**
   - 2023-2024년 신기술 출제 비율: 약 40-50%
   - 클라우드 네이티브, AI/ML, 보안 분야 집중
   - 전통적 주제도 최신 관점으로 재해석

2. **실무 중심 문제**
   - 단순 이론보다 실제 적용 사례 중시
   - 아키텍처 설계, 문제 해결 능력 평가
   - 트레이드오프 분석 요구 증가

3. **융합형 문제**
   - 단일 기술보다 기술 조합 출제
   - 예: "MSA + Kubernetes + Service Mesh"
   - 엔드-투-엔드 시스템 이해도 평가

4. **비교/분석형 증가**
   - 정의형보다 비교형, 분석형 출제 증가
   - 장단점 분석 및 선택 기준 제시 요구
   - 비판적 사고 능력 평가

---

## 도메인별 출제 빈도

### 1. Cloud & Infrastructure (25-30%)

**고빈도 주제:**
- Kubernetes, Container Orchestration
- Multi-Cloud, Hybrid Cloud
- Infrastructure as Code (Terraform, Ansible)
- Platform Engineering
- FinOps, Cloud Cost Optimization

**최근 출제 예:**
- "Kubernetes의 아키텍처와 주요 컴포넌트를 설명하시오"
- "Multi-Cloud 전략의 장단점을 비교 분석하시오"
- "Platform Engineering과 DevOps의 차이점을 설명하시오"
- "FinOps 실천 방안을 설명하시오"

**트렌드:**
- 단순 클라우드 마이그레이션 → 클라우드 네이티브 설계
- 비용 최적화, 거버넌스 중요성 부각
- 플랫폼 엔지니어링 개념 등장

---

### 2. DevOps & CI/CD (20-25%)

**고빈도 주제:**
- CI/CD Pipeline
- GitOps
- DevSecOps
- SRE (Site Reliability Engineering)
- Observability (OpenTelemetry)

**최근 출제 예:**
- "GitOps와 전통적 DevOps의 차이점을 설명하시오"
- "SRE의 주요 원칙과 실천 방법을 설명하시오"
- "DevSecOps 파이프라인 구축 절차를 설명하시오"
- "Observability와 Monitoring의 차이를 비교하시오"

**트렌드:**
- DevOps → DevSecOps (보안 강화)
- GitOps 방식의 선언적 인프라 관리
- Observability 중요성 증대
- Platform as a Product 개념

---

### 3. Security (20-25%)

**고빈도 주제:**
- Zero Trust Security
- DevSecOps, Shift-Left Security
- Container Security
- Supply Chain Security (SLSA, SBOM)
- Identity and Access Management (IAM)

**최근 출제 예:**
- "Zero Trust Architecture의 핵심 원칙을 설명하시오"
- "Supply Chain Security를 강화하는 방안을 설명하시오"
- "Container Security의 주요 위협과 대응 방안을 설명하시오"
- "SIEM과 SOAR의 차이점을 비교하시오"

**트렌드:**
- 경계 기반 보안 → Zero Trust
- DevSecOps로 보안 통합
- 공급망 보안 중요성 급증 (Log4j 사태 등)
- AI 활용 보안 (AIOps, Anomaly Detection)

---

### 4. Software Architecture (15-20%)

**고빈도 주제:**
- Microservices Architecture (MSA)
- Event-Driven Architecture (EDA)
- CQRS, Event Sourcing
- API Gateway, BFF Pattern
- Serverless Architecture

**최근 출제 예:**
- "Event-Driven Architecture의 장단점을 분석하시오"
- "CQRS 패턴을 설명하고 적용 시나리오를 제시하시오"
- "Monolithic과 Microservices 아키텍처를 비교하시오"
- "BFF(Backend For Frontend) 패턴의 필요성을 설명하시오"

**트렌드:**
- MSA는 기본, 더 세부적인 패턴 출제
- Event-Driven 아키텍처 관심 증가
- Serverless와 Container의 융합
- Domain-Driven Design (DDD) 연계

---

### 5. Data & AI/ML (15-20%)

**고빈도 주제:**
- Data Mesh, Data Fabric
- MLOps, LLMOps
- Real-time Data Processing (Kafka, Flink)
- Vector Database
- Feature Store

**최근 출제 예:**
- "Data Mesh와 Data Lake의 차이점을 설명하시오"
- "MLOps 파이프라인 구축 절차를 설명하시오"
- "실시간 데이터 처리 아키텍처를 설명하시오"
- "Vector Database의 필요성과 활용 사례를 설명하시오"

**트렌드:**
- 빅데이터 → 실시간 데이터
- AI/ML 모델 운영화 (MLOps)
- LLM 시대, Vector DB 부상
- 데이터 거버넌스, 품질 관리 중시

---

### 6. Emerging Technologies (5-10%)

**고빈도 주제:**
- Edge Computing
- WebAssembly (Wasm)
- Service Mesh (Istio, Linkerd)
- eBPF
- Quantum Computing (개념 수준)

**최근 출제 예:**
- "Edge Computing의 필요성과 구현 방안을 설명하시오"
- "WebAssembly의 특징과 활용 분야를 설명하시오"
- "Service Mesh의 아키텍처를 설명하시오"
- "eBPF 기술의 개념과 활용 사례를 설명하시오"

**트렌드:**
- 클라우드 → 엣지로 확장
- WebAssembly 생태계 성장
- Service Mesh 표준화
- eBPF 활용 증가 (네트워킹, 보안, 관찰성)

---

## 문제 유형별 출제 비율

### 2024년 경향

| 문제 유형 | 비율 | 특징 |
|----------|------|------|
| 설명형 | 35-40% | 가장 일반적, 구조와 특징 설명 |
| 비교형 | 25-30% | 증가 추세, 2개 이상 기술 비교 |
| 분석형 | 20-25% | 문제점 분석 및 해결방안 |
| 절차형 | 10-15% | 구축/운영 절차 |
| 정의형 | 5-10% | 감소 추세, 주로 신기술 |

### 복합형 문제 증가

단일 유형이 아닌 복합 유형 출제 증가:
- "A 기술을 설명하고, B 기술과 비교하시오"
- "C 시스템의 아키텍처를 설명하고, 발생 가능한 문제점과 해결방안을 제시하시오"

---

## 난이도별 출제 경향

### 기본 (30-40%)
- 성숙한 기술 (5년 이상)
- 표준 아키텍처 패턴
- 기본 개념 이해도 평가

**예시 주제:**
- REST API
- RDBMS Transaction
- Load Balancing
- Cache 전략

### 중급 (40-50%)
- 최근 2-3년 기술
- 실무 적용 시나리오
- 트레이드오프 분석

**예시 주제:**
- Kubernetes
- MSA 패턴들
- Event-Driven Architecture
- DevSecOps

### 고급 (10-20%)
- 최신 기술 (2023-2024)
- 복합 시스템 설계
- 깊은 기술 원리 이해

**예시 주제:**
- Platform Engineering
- LLMOps
- eBPF
- Confidential Computing

---

## 시즌별 트렌드

### 1회차 (3월)
- 전년도 기술 트렌드 반영
- 안정적인 주제 중심
- 기본 + 중급 비중 높음

### 2회차 (6월)
- 상반기 트렌드 반영
- 신기술 비중 증가
- 중급 + 고급 비중 높음

### 3회차 (9월)
- 글로벌 컨퍼런스 (AWS re:Invent, Google I/O 등) 영향
- 최신 기술 트렌드
- 융합형 문제 증가

### 4회차 (12월)
- 한 해 총정리
- 연중 핫 토픽 정리
- 내년 트렌드 예고성 문제

---

## 2024-2025년 예상 트렌드

### Hot Topics

1. **AI/ML 운영화**
   - LLMOps, Model Serving
   - Prompt Engineering
   - RAG (Retrieval-Augmented Generation)

2. **Platform Engineering**
   - Internal Developer Platform (IDP)
   - Self-Service Infrastructure
   - Developer Experience (DX)

3. **FinOps & Sustainability**
   - Cloud Cost Optimization
   - Green Computing
   - Carbon-Aware Computing

4. **Security Enhancement**
   - AI-powered Security
   - Confidential Computing
   - Post-Quantum Cryptography (개념)

5. **Edge & Distributed**
   - Edge Native Applications
   - WebAssembly at Edge
   - Distributed Cloud

### 감소 예상 주제

- 전통적 데이터센터 관리
- Legacy 모놀리식 아키텍처 (비교 목적 제외)
- 기본적인 네트워킹 (새로운 관점 아니면)

---

## 실전 대비 전략

### 1. 핵심 주제 우선 학습
- Cloud Native (Kubernetes, Service Mesh)
- Security (Zero Trust, DevSecOps)
- Data/AI (MLOps, Real-time Processing)

### 2. 비교 분석 연습
- 유사 기술 간 비교 정리
- 장단점, 사용 시나리오 명확히
- 예: Kubernetes vs Docker Swarm, REST vs GraphQL

### 3. 최신 트렌드 주시
- CNCF Landscape
- ThoughtWorks Technology Radar
- Gartner Hype Cycle
- 주요 클라우드 업체 블로그

### 4. 실무 사례 준비
- 주요 기업 기술 블로그
- Conference 발표 자료
- 오픈소스 프로젝트

### 5. 융합형 대비
- 단일 기술이 아닌 시스템적 사고
- End-to-end 아키텍처 이해
- 기술 간 연계성 파악
