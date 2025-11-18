# DevOps

## 1. DevOps 정의
DevOps, Development와 Operations 통합하여 소프트웨어 개발-운영 전 과정 자동화 및 협업 강화하는 문화적 철학이자 방법론. 지속적 통합(CI)과 지속적 배포(CD) 통해 빠른 서비스 제공과 안정적 운영 동시 실현하는 소프트웨어 개발 패러다임.

## 2. DevOps 설명

### 1) DevOps CI/CD 파이프라인 (그림)

```
[개발 단계]          [통합 단계]          [배포 단계]          [운영 단계]

Code → Build → Test → Package → Deploy → Monitor
 ↓       ↓      ↓       ↓         ↓        ↓
Git   Maven  JUnit  Docker  Kubernetes  Prometheus
     Jenkins        Harbor   ArgoCD     Grafana

← Continuous Integration →  ← Continuous Delivery/Deployment →
            ← Continuous Feedback ←
```

- 간글: CI/CD 파이프라인, 코드 커밋부터 프로덕션 배포까지 자동화. 각 단계 전용 도구 활용하여 빌드-테스트-배포 신속하게 수행. 지속적 피드백 통해 품질 개선과 장애 조기 발견 가능.

### 2) DevOps 핵심 요소 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| 문화적 요소 | 협업(Collaboration) | 개발-운영 팀 간 벽 제거, 공동 목표 설정 |
| | 책임 공유(Shared Responsibility) | 전체 라이프사이클에 대한 공동 책임 |
| 자동화 요소 | CI/CD 파이프라인 | 빌드, 테스트, 배포 자동화로 수작업 최소화 |
| | IaC(Infrastructure as Code) | Terraform, Ansible로 인프라 코드화 |
| 기술적 요소 | 컨테이너화 | Docker 기반 애플리케이션 패키징 및 이식성 확보 |
| | 오케스트레이션 | Kubernetes로 컨테이너 배포, 스케일링 자동화 |
| 측정/모니터링 | 성능 모니터링 | Prometheus, Grafana 실시간 메트릭 수집 |
| | 로그 관리 | ELK Stack(Elasticsearch, Logstash, Kibana) 중앙 집중식 로그 분석 |

- 간글: DevOps, CALMS(Culture, Automation, Lean, Measurement, Sharing) 원칙 기반 구성. 문화적 변화와 기술적 자동화 유기적 결합으로 개발 속도와 운영 안정성 동시 확보. 측정 및 피드백 통해 지속적 개선 실현.

## 3. DevOps 발전 방향

- 현재 한계: 도구 중심 접근으로 문화적 변화 부족, 레거시 시스템 통합 어려움. 해결 방안: 조직 문화 개선 우선, 단계적 전환 전략 수립.
- GitOps, Platform Engineering 등 선진 DevOps 실천 방법론으로 진화. 서버리스 아키텍처, AI/ML 기반 자동화(AIOps)와 융합하여 차세대 소프트웨어 개발 운영 체계로 발전 전망.
