# SBOM 기반 소프트웨어 공급망 보안

## 1. SBOM 기반 공급망 보안 정의

Log4Shell, SolarWinds 등 공급망 공격 급증에 따라, SBOM(Software Bill of Materials)을 통해 소프트웨어 구성요소 및 의존성을 투명하게 관리하고, 취약점을 신속히 식별·대응하여 공급망 위험을 최소화하는 보안 체계. KISA 가이드 및 미국 행정명령(EO 14028) 준수

## 2. SBOM 기반 공급망 보안 설명

### 1) SBOM 생성 및 관리 파이프라인 (그림)

```
┌─────────────────────────────────────────────────────────┐
│              소프트웨어 개발 파이프라인                   │
└─────────────────────────────────────────────────────────┘
    │                    │                    │
   [빌드]            [배포]              [운영]
    ↓                    ↓                    ↓
┌─────────┐        ┌─────────┐        ┌─────────┐
│  Syft   │        │  Cosign │        │  Grype  │
│CycloneDX│ ────→  │ 서명    │ ────→  │ 스캔    │
└─────────┘        └─────────┘        └─────────┘
    │                    │                    │
    ↓                    ↓                    ↓
app.jar              SBOM.json           CVE 탐지
 └─ spring-boot 2.7.0  (서명)           Log4j 2.14
    ├─ log4j 2.14.1                     ↓
    └─ jackson 2.13.0               [경고]
         └─ (의존성 트리)            Critical
                                     CVE-2021-44228
```

- 간글: Syft로 컨테이너 이미지, JAR 파일에서 자동 SBOM 생성. Cosign으로 서명하여 무결성 보장. 운영 중 Grype가 CVE DB 연동하여 신규 취약점 즉시 탐지

### 2) SBOM 표준 및 도구 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| **SBOM 표준** | SPDX 2.3 | Linux Foundation, ISO/IEC 5962 |
| | CycloneDX 1.5 | OWASP, 보안 중심, VEX 지원 |
| | SWID Tags | ISO/IEC 19770-2, 자산 관리 |
| **생성 도구** | Syft | Anchore, 컨테이너/바이너리 스캔 |
| | CycloneDX CLI | Maven, NPM, Gradle 플러그인 |
| | SPDX Tools | 공식 라이브러리, 포맷 변환 |
| **취약점 스캔** | Grype | CVE, GHSA 매칭, 오프라인 가능 |
| | Dependency-Track | OWASP, 지속적 모니터링 |
| | Snyk | 상용, 자동 Fix PR 생성 |
| **서명/검증** | Sigstore Cosign | Keyless 서명, OCI 레지스트리 |
| | in-toto | 공급망 메타데이터 검증 |
| | Notary v2 | CNCF, OCI Artifact 서명 |

- 간글: SPDX는 자산 관리, CycloneDX는 보안 중심. Syft 2초 내 컨테이너 전체 레이어 스캔. Cosign Keyless 서명으로 인증서 관리 부담 제거

### 3) 공급망 공격 사례 및 SBOM 대응 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| **Log4Shell** | 공격 | Apache Log4j 2.14.1 원격 코드 실행 |
| | 영향 | 수백만 서버, Minecraft부터 AWS까지 |
| | SBOM 대응 | Grype 스캔으로 24시간 내 영향 범위 파악 |
| | 패치 | SBOM 기반 자동 업데이트 (2.14.1 → 2.17.1) |
| **SolarWinds** | 공격 | Orion 빌드 시스템 침투, 백도어 삽입 |
| | 영향 | 미국 정부기관 18,000개 조직 |
| | SBOM 대응 | 서명 검증으로 변조 탐지 가능 |
| | 방어 | in-toto Provenance로 빌드 무결성 |
| **NPM Typosquatting** | 공격 | react-dev-tools → react-dev-toolss 악성 |
| | 영향 | 개발자 PC 크립토마이닝 |
| | SBOM 대응 | 의존성 트리 검토로 오타 패키지 탐지 |
| | 정책 | 허용 목록(Allowlist) 기반 관리 |

- 간글: Log4Shell은 SBOM으로 24시간 내 영향 분석(수동 3주). SolarWinds는 서명 검증 필수성 입증. NPM 공격은 의존성 트리 가시화로 예방 가능

## 3. 도입 효과 및 구현 방안

### 1) 도입 효과
- **취약점 대응 시간**: 3주 → 24시간 (92% 단축)
- **컴플라이언스**: 미국 정부 계약 SBOM 필수 (EO 14028)
- **투명성**: 공급망 전체 가시화, 라이선스 위반 방지

### 2) 구현 방안 (4단계)
- **1단계**: CI/CD에 Syft 통합, 빌드마다 SBOM 자동 생성
- **2단계**: Cosign으로 SBOM 서명, OCI 레지스트리 저장
- **3단계**: Grype 일 1회 스캔, Critical CVE 즉시 알림
- **4단계**: Dependency-Track 대시보드, 전사 SBOM 중앙 관리

### 3) 운영 고려사항
- **저장소**: Harbor, JFrog Artifactory에 SBOM 메타데이터 저장
- **자동화**: Renovate Bot으로 의존성 자동 업데이트 PR
- **정책**: OPA로 High/Critical CVE 배포 차단
