# 컨테이너 보안 (eBPF 기반)

## 1. eBPF 기반 컨테이너 보안 정의

Kubernetes 환경에서 eBPF(extended Berkeley Packet Filter)를 활용하여 커널 레벨에서 컨테이너 생명주기 전반(빌드-배포-런타임)의 보안 위협을 탐지하고 차단하는 기술. Cilium, Falco, Tetragon 등 도구로 네트워크 정책, 런타임 보안, 프로세스 모니터링 제공

## 2. eBPF 기반 컨테이너 보안 설명

### 1) 컨테이너 생명주기별 보안 위협 및 대응 (그림)

```
┌─────────────────────────────────────────────────────────┐
│                  컨테이너 생명주기                        │
└─────────────────────────────────────────────────────────┘
        ↓                ↓                  ↓
   [빌드 단계]      [배포 단계]        [런타임 단계]
        │                │                  │
   ┌────┴────┐      ┌────┴────┐       ┌────┴────┐
   │ 취약점   │      │ 정책    │       │ 실시간  │
   │ 스캐닝   │      │ 검증    │       │ 모니터링│
   └────┬────┘      └────┬────┘       └────┬────┘
        ↓                ↓                  ↓
   ┌─────────┐      ┌─────────┐       ┌─────────┐
   │ Trivy   │      │  OPA    │       │ Falco   │
   │ Snyk    │      │Kyverno  │       │Tetragon │
   └─────────┘      └─────────┘       └─────────┘
        ↓                ↓                  ↓
   Base Image       NetworkPolicy      eBPF Hook
   취약점 제거      Admission           커널 이벤트
                    Controller          실시간 탐지
```

- 간글: 빌드 시 이미지 스캔으로 CVE 제거, 배포 시 정책 기반 승인, 런타임 시 eBPF로 커널 이벤트 모니터링. 3단계 방어로 공격 표면 최소화

### 2) eBPF 런타임 보안 메커니즘 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| **eBPF 특징** | 커널 레벨 후킹 | 시스템콜, 네트워크, 파일 접근 가로채기 |
| | 안전성 | Verifier로 무한루프, 크래시 방지 |
| | 성능 | JIT 컴파일, 오버헤드 < 5% |
| **Falco** | 룰 기반 탐지 | 비정상 시스템콜 패턴 (예: /etc/shadow 읽기) |
| | 실시간 알림 | Slack, PagerDuty 연동 |
| | MITRE ATT&CK | Privilege Escalation, Persistence 탐지 |
| **Tetragon** | 프로세스 추적 | Fork, Exec 체인 전체 가시화 |
| | 파일 무결성 | /bin, /etc 변경 즉시 차단 |
| | 네트워크 필터링 | C2 서버 통신 차단 (IP/도메인 기반) |
| **Cilium** | eBPF 네트워킹 | kube-proxy 대체, L3-L7 정책 |
| | Service Mesh | Envoy 없이 mTLS, L7 라우팅 |
| | NetworkPolicy | Pod 간 제로트러스트 통신 |

- 간글: eBPF Verifier 통해 안전성 보장하며 커널 모듈 대비 배포 간편. Falco 침입탐지, Tetragon 프로세스 제어, Cilium 네트워크 보안 담당. 3개 도구 조합으로 전방위 보호

### 3) 컨테이너 보안 위협 사례 및 탐지 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| **이미지 취약점** | Log4Shell (CVE-2021-44228) | Apache Log4j 원격 코드 실행 |
| | 스캔 도구 | Trivy: 2초 이내 모든 레이어 스캔 |
| | 대응 | 취약 버전 자동 차단, Distroless 이미지 |
| **권한 상승** | Privileged Container | --privileged 플래그 악용, 호스트 탈출 |
| | Falco 룰 | `container.privileged=true` 탐지 |
| | OPA 정책 | Privileged 컨테이너 배포 차단 |
| **수평 이동** | Pod-to-Pod 공격 | 침해된 Pod에서 다른 Pod 공격 |
| | Cilium 방어 | L7 NetworkPolicy (HTTP GET /admin 차단) |
| | 마이크로세그멘테이션 | 기본 Deny-All, 최소 권한만 허용 |
| **데이터 유출** | Secret 노출 | 환경변수 로그 유출, /proc 접근 |
| | Tetragon 차단 | /var/run/secrets 읽기 차단 |
| | Sealed Secrets | 암호화된 Secret, GitOps 안전 |

- 간글: Log4Shell 같은 공급망 공격은 이미지 스캔 필수. Privileged 컨테이너 권한 상승 위협 큼. Cilium L7 정책으로 애플리케이션 레벨 공격 차단 가능

## 3. 도입 효과 및 구현 방안

### 1) 도입 효과
- **가시성**: 모든 시스템콜, 네트워크 연결 실시간 추적 (기존 로그 분석 대비 10배 빠름)
- **성능**: eBPF JIT 컴파일로 오버헤드 < 5% (Sidecar Proxy 15% 대비)
- **비용**: Cilium으로 Envoy 제거 → CPU 30% 절감

### 2) 구현 방안
- **Falco 배포**: DaemonSet으로 모든 노드 설치, MITRE 룰셋 적용
- **Cilium 전환**: kube-proxy → Cilium eBPF 단계적 전환 (Blue/Green)
- **정책 자동화**: OPA로 PodSecurityPolicy 대체, 위반 시 배포 차단

### 3) 운영 고려사항
- **커널 버전**: Linux 4.9+ 필수 (eBPF 기능), 5.10+ 권장
- **학습 곡선**: eBPF 프로그래밍 난이도 높음, Falco/Cilium 사용으로 완화
- **오탐**: Falco 룰 튜닝 필요, 정상 패턴 화이트리스트 등록
