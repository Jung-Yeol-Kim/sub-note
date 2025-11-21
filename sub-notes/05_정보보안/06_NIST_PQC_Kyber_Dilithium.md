# NIST PQC 표준 알고리즘 (Kyber, Dilithium)

## 1. 정의 및 배경

### 1.1 정의
**NIST PQC(Post-Quantum Cryptography)**는 양자 컴퓨터의 공격에도 안전한 차세대 암호 표준이다. 2024년 NIST가 최종 표준화한 **Kyber(KEM)**, **Dilithium(디지털 서명)**, **Sphincs+(해시 기반 서명)**가 핵심 알고리즘이다.

### 1.2 출제 배경
- **정책**: 과기정통부 양자 기술 국가 전략 + NIST PQC 표준 발표 (2024.08)
- **문제**: 135회 양자 암호 출제 ← Shor 알고리즘의 RSA 위협
  - Shor's Algorithm: O(log³n) 시간에 소인수분해 → RSA 무력화
  - Grover's Algorithm: 대칭키 보안 강도 절반 감소 (AES-128 → 64bit)
- **근본 원인**:
  - 2030년대 범용 양자컴퓨터 상용화 예상
  - 현재 암호화된 데이터를 저장 후 미래에 복호화하는 "Harvest Now, Decrypt Later" 공격

### 1.3 필요성
1. **암호 체계 전환**: 전 세계 RSA/ECC 기반 시스템 → PQC 마이그레이션
2. **장기 보안**: 30년 후에도 안전해야 하는 데이터 (의료, 국방)
3. **표준 준수**: NIST PQC 미적용 시 미국 정부 거래 불가 (2035년부터)
4. **하이브리드 전환기**: 기존 암호 + PQC 병행 운영 (안전성 확보)

---

## 2. 양자 컴퓨터의 암호 위협

### 2.1 Shor's Algorithm (소인수분해)

```
[RSA 암호의 원리와 Shor 알고리즘 공격]

RSA 암호:
- 공개키: (n, e)
  n = p × q  (p, q는 큰 소수)
  예: n = 15 = 3 × 5

- 비밀키: (n, d)
  d는 e의 모듈러 역원

암호화: C = M^e mod n
복호화: M = C^d mod n

보안 근거: n을 p, q로 소인수분해하는 것이 어렵다
           (고전 컴퓨터: O(exp(√(log n))) - 지수 시간)

Shor 알고리즘:
- 양자 컴퓨터로 소인수분해: O((log n)³) - 다항 시간
- RSA-2048: 고전 컴퓨터 10억 년 → 양자 컴퓨터 8시간

┌─────────────────────────────────────────────────────────┐
│ Shor 알고리즘 동작 (개념적)                              │
├─────────────────────────────────────────────────────────┤
│ 1. 정수 n 소인수분해 목표                                │
│ 2. 임의의 a < n 선택                                     │
│ 3. 주기 찾기 (Quantum Fourier Transform 사용)           │
│    f(x) = a^x mod n의 주기 r 찾기                        │
│ 4. r이 짝수이고 a^(r/2) ≠ -1 (mod n)이면:               │
│    p = gcd(a^(r/2) - 1, n)                               │
│    q = gcd(a^(r/2) + 1, n)                               │
│ 5. n = p × q 성공                                        │
└─────────────────────────────────────────────────────────┘

예시: n = 15 소인수분해
- a = 7 선택
- 7^x mod 15의 주기 r = 4
  (7^1=7, 7^2=4, 7^3=13, 7^4=1 mod 15)
- gcd(7^2 - 1, 15) = gcd(48, 15) = 3
- gcd(7^2 + 1, 15) = gcd(50, 15) = 5
→ 15 = 3 × 5 성공!
```

### 2.2 고전 암호 vs 양자 위협

| 암호 알고리즘 | 보안 근거 | 양자 공격 | 안전성 |
|--------------|-----------|-----------|--------|
| **RSA-2048** | 소인수분해 | Shor (다항시간) | ✗ 취약 |
| **ECC-256** | 이산로그 | Shor (다항시간) | ✗ 취약 |
| **AES-128** | 대칭키 (Brute Force) | Grover (√N) | △ 약화 (64bit 수준) |
| **AES-256** | 대칭키 | Grover (√N) | ✓ 안전 (128bit 수준) |
| **SHA-256** | 해시 충돌 | Grover | ✓ 안전 |

**결론**:
- 공개키 암호(RSA, ECC) → PQC로 전환 필수
- 대칭키(AES) → 키 길이 2배 (128 → 256)

---

## 3. NIST PQC 표준 알고리즘

### 3.1 선정 과정 (2016~2024)

```
[NIST PQC 표준화 타임라인]

2016: 표준화 공모 시작
      ↓
2017: 82개 후보 제출
      ↓
2019: Round 2 - 26개 선정
      ↓
2020: Round 3 - 7개 최종 후보
      ↓
2022: 최초 4개 표준 선정
      - Kyber (KEM)
      - Dilithium (서명)
      - Sphincs+ (서명)
      - Falcon (서명)
      ↓
2024.08: 최종 표준 발표 (FIPS 203, 204, 205)
      - FIPS 203: ML-KEM (Kyber)
      - FIPS 204: ML-DSA (Dilithium)
      - FIPS 205: SLH-DSA (Sphincs+)
```

### 3.2 표준 알고리즘 개요

| 표준 | 원래 이름 | 용도 | 기반 수학 | 보안 강도 |
|------|----------|------|-----------|-----------|
| **FIPS 203** | Kyber | 키 교환 (KEM) | Module-LWE | 128~256 bit |
| **FIPS 204** | Dilithium | 디지털 서명 | Module-LWE | 128~256 bit |
| **FIPS 205** | Sphincs+ | 디지털 서명 | 해시 함수 | 128~256 bit |

---

## 4. Kyber (ML-KEM) 상세

### 4.1 정의 및 원리

**Kyber**는 격자 기반 암호(Lattice-based Cryptography)로, **Module Learning With Errors (Module-LWE)** 문제의 어려움에 기반한 KEM(Key Encapsulation Mechanism)이다.

#### Module-LWE 문제

```
[LWE (Learning With Errors) 문제]

목표: 다음 방정식에서 비밀 s를 찾기
A × s + e = b (mod q)

여기서:
- A: m×n 행렬 (공개)
- s: n차원 비밀 벡터 (찾아야 함)
- e: 작은 오류(noise) 벡터 (무작위)
- b: m차원 결과 벡터 (공개)
- q: 모듈러 (소수)

예시 (간소화):
A = [3, 1]      s = [2]      e = [1]
    [2, 4]          [3]          [-1]

b = A × s + e mod 7
  = [3×2 + 1×3, 2×2 + 4×3] + [1, -1] mod 7
  = [9, 16] + [1, -1] mod 7
  = [10, 15] mod 7
  = [3, 1]

공격자는 A=[3,1; 2,4], b=[3,1]만 알고 s=[2,3]을 찾아야 함
→ 노이즈 e 때문에 양자 컴퓨터로도 어려움 (지수시간)

Module-LWE:
- LWE의 구조화된 버전 (다항식 환 사용)
- 효율성 향상 (키 크기 감소)
```

### 4.2 Kyber 알고리즘 동작

```python
class KyberKEM:
    """Kyber-512 구현 (보안 강도 128bit)"""

    def __init__(self, params='kyber512'):
        self.params = self.get_params(params)
        # Kyber-512 파라미터
        self.n = 256        # 다항식 차수
        self.q = 3329       # 모듈러
        self.k = 2          # 모듈 차원
        self.eta = 3        # 노이즈 분포 파라미터

    def keygen(self):
        """키 생성 (Key Generation)"""
        # 1. 무작위 시드 생성
        seed = os.urandom(32)

        # 2. 행렬 A 생성 (공개 파라미터)
        A = self.gen_matrix_A(seed, self.k)

        # 3. 비밀 벡터 s, e 생성 (작은 계수)
        s = self.sample_noise_vector(self.eta, self.k)
        e = self.sample_noise_vector(self.eta, self.k)

        # 4. 공개키 계산: t = A × s + e (mod q)
        t = self.matrix_vector_mul(A, s)
        t = self.vector_add(t, e)
        t = self.mod_q(t)

        # 5. 키 반환
        public_key = (seed, t)  # A는 seed로부터 재생성 가능
        secret_key = s

        return public_key, secret_key

    def encapsulate(self, public_key):
        """캡슐화 (Encapsulation) - 공유 비밀 생성"""
        seed, t = public_key

        # 1. 무작위 메시지 m 생성 (공유 비밀의 씨앗)
        m = os.urandom(32)

        # 2. A 재생성
        A = self.gen_matrix_A(seed, self.k)

        # 3. 노이즈 벡터 r, e1, e2 생성
        r = self.sample_noise_vector(self.eta, self.k)
        e1 = self.sample_noise_vector(self.eta, self.k)
        e2 = self.sample_noise_poly(self.eta)

        # 4. 암호문 u, v 계산
        # u = A^T × r + e1
        A_transpose = self.transpose(A)
        u = self.matrix_vector_mul(A_transpose, r)
        u = self.vector_add(u, e1)
        u = self.mod_q(u)

        # v = t^T × r + e2 + Encode(m)
        v = self.vector_dot(t, r)
        v = v + e2
        v = v + self.encode_message(m)
        v = self.mod_q(v)

        # 5. 공유 비밀 계산 (KDF)
        shared_secret = self.kdf(m)

        ciphertext = (u, v)
        return ciphertext, shared_secret

    def decapsulate(self, secret_key, ciphertext):
        """복호화 (Decapsulation) - 공유 비밀 복구"""
        s = secret_key
        u, v = ciphertext

        # 1. 메시지 복원
        # m' = v - s^T × u
        m_prime = v - self.vector_dot(s, u)
        m_prime = self.mod_q(m_prime)

        # 2. 메시지 디코딩
        m = self.decode_message(m_prime)

        # 3. 공유 비밀 재계산
        shared_secret = self.kdf(m)

        return shared_secret

    def sample_noise_vector(self, eta, length):
        """작은 노이즈 벡터 샘플링 (중심 이항 분포)"""
        vector = []
        for _ in range(length):
            poly = self.sample_noise_poly(eta)
            vector.append(poly)
        return vector

    def sample_noise_poly(self, eta):
        """작은 노이즈 다항식 샘플링"""
        # 중심 이항 분포 (Centered Binomial Distribution)
        # CBD_eta: sum(a_i - b_i), a_i, b_i ~ Bernoulli(0.5)
        coeffs = []
        for _ in range(self.n):
            a = sum(random.randint(0, 1) for _ in range(eta))
            b = sum(random.randint(0, 1) for _ in range(eta))
            coeff = a - b
            coeffs.append(coeff)
        return Polynomial(coeffs, self.q)

    def encode_message(self, m):
        """메시지 인코딩 (0/1 → ±q/2)"""
        # 메시지 비트를 큰 계수로 확대
        encoded = Polynomial([0] * self.n, self.q)
        for i, bit in enumerate(self.to_bits(m)[:self.n]):
            encoded.coeffs[i] = bit * (self.q // 2)
        return encoded

    def decode_message(self, poly):
        """메시지 디코딩 (±q/2 → 0/1)"""
        bits = []
        for coeff in poly.coeffs:
            # 가장 가까운 0 또는 q/2로 반올림
            if abs(coeff) < self.q // 4:
                bit = 0
            else:
                bit = 1
            bits.append(bit)
        return self.from_bits(bits)
```

### 4.3 Kyber 보안 파라미터

```
[Kyber 3가지 버전]

┌────────────┬──────────┬──────────┬──────────┐
│   파라미터  │ Kyber-512│ Kyber-768│Kyber-1024│
├────────────┼──────────┼──────────┼──────────┤
│ 보안 강도   │ 128 bit  │ 192 bit  │ 256 bit  │
│ k (차원)    │    2     │    3     │    4     │
│ 공개키 크기 │  800 B   │ 1184 B   │ 1568 B   │
│ 비밀키 크기 │ 1632 B   │ 2400 B   │ 3168 B   │
│ 암호문 크기 │  768 B   │ 1088 B   │ 1568 B   │
│ 속도 (keygen)│ 50 μs   │  75 μs   │ 100 μs   │
│ 속도 (encap) │ 70 μs   │ 105 μs   │ 140 μs   │
│ 속도 (decap) │ 80 μs   │ 120 μs   │ 160 μs   │
└────────────┴──────────┴──────────┴──────────┘

vs RSA-2048:
- 공개키: 800B (Kyber-512) vs 256B (RSA-2048)
- 암호문: 768B vs 256B
- 속도: 70μs vs 2ms (28배 빠름!)
```

---

## 5. Dilithium (ML-DSA) 상세

### 5.1 정의 및 원리

**Dilithium**은 격자 기반 디지털 서명 알고리즘으로, Module-LWE와 **Fiat-Shamir 변환**을 결합하여 구현한다.

### 5.2 Dilithium 알고리즘 동작

```python
class DilithiumSignature:
    """Dilithium-2 구현 (보안 강도 128bit)"""

    def __init__(self):
        self.q = 8380417    # 모듈러 (23비트 소수)
        self.d = 13         # Dropped bits
        self.tau = 39       # 서명의 노이즈
        self.gamma1 = 131072
        self.gamma2 = 95232
        self.k = 4          # 공개키 차원
        self.l = 4          # 비밀키 차원

    def keygen(self):
        """키 생성"""
        # 1. 무작위 시드
        seed = os.urandom(32)

        # 2. 행렬 A 생성 (k × l)
        A = self.expand_A(seed)

        # 3. 비밀 벡터 s1, s2 생성 (작은 계수)
        s1 = self.sample_secret_vector(self.l)
        s2 = self.sample_secret_vector(self.k)

        # 4. 공개키 계산: t = A × s1 + s2
        t = self.matrix_vector_mul(A, s1)
        t = self.vector_add(t, s2)

        # 5. t를 높은 비트만 저장 (공개키 크기 감소)
        t1 = self.high_bits(t, 2 * self.gamma2)

        public_key = (seed, t1)
        secret_key = (seed, s1, s2, t)

        return public_key, secret_key

    def sign(self, secret_key, message):
        """서명 생성"""
        seed, s1, s2, t = secret_key
        A = self.expand_A(seed)

        # 서명 시도 (거부 샘플링)
        while True:
            # 1. 무작위 마스킹 벡터 y 생성
            y = self.sample_mask_vector(self.l, self.gamma1)

            # 2. w = A × y 계산
            w = self.matrix_vector_mul(A, y)

            # 3. w의 높은 비트 w1 추출
            w1 = self.high_bits(w, 2 * self.gamma2)

            # 4. 챌린지 c 생성 (Fiat-Shamir)
            c = self.hash_to_challenge(w1, message)

            # 5. 응답 z 계산
            # z = y + c × s1
            z = self.vector_add(
                y,
                self.scalar_vector_mul(c, s1)
            )

            # 6. 거부 샘플링 (Rejection Sampling)
            # z가 너무 크면 정보 누출 → 재시도
            if self.norm(z) >= self.gamma1 - self.tau:
                continue  # 재시도 (확률 ~4.5%)

            # 7. 힌트 h 계산 (검증 최적화)
            r0 = self.low_bits(
                self.vector_sub(w, self.scalar_vector_mul(c, s2)),
                2 * self.gamma2
            )

            if self.norm(r0) >= self.gamma2 - self.tau:
                continue  # 재시도

            # 서명 성공
            signature = (z, h, c)
            return signature

    def verify(self, public_key, message, signature):
        """서명 검증"""
        seed, t1 = public_key
        z, h, c = signature

        # 1. A 재생성
        A = self.expand_A(seed)

        # 2. 검증 방정식 확인
        # w' = A × z - c × t
        Az = self.matrix_vector_mul(A, z)
        ct = self.scalar_vector_mul(c, self.decompress_t1(t1))
        w_prime = self.vector_sub(Az, ct)

        # 3. 챌린지 재계산
        w1_prime = self.use_hint(h, w_prime, 2 * self.gamma2)
        c_prime = self.hash_to_challenge(w1_prime, message)

        # 4. 검증
        return c == c_prime and self.norm(z) < self.gamma1 - self.tau

    def hash_to_challenge(self, w1, message):
        """Fiat-Shamir 변환 (해시를 챌린지로 사용)"""
        # SHA3-256(w1 || message)를 작은 다항식으로 변환
        hash_input = self.serialize(w1) + message
        hash_output = hashlib.sha3_256(hash_input).digest()

        # 해시를 tau개의 ±1 계수를 가진 다항식으로 변환
        c = Polynomial([0] * 256, self.q)
        indices = self.hash_to_indices(hash_output, self.tau)
        for idx in indices[:self.tau // 2]:
            c.coeffs[idx] = 1
        for idx in indices[self.tau // 2:]:
            c.coeffs[idx] = -1

        return c
```

### 5.3 Dilithium 보안 파라미터

```
[Dilithium 3가지 버전]

┌────────────┬──────────────┬──────────────┬──────────────┐
│   파라미터  │ Dilithium-2  │ Dilithium-3  │ Dilithium-5  │
├────────────┼──────────────┼──────────────┼──────────────┤
│ 보안 강도   │  128 bit     │  192 bit     │  256 bit     │
│ (k, l)      │   (4, 4)     │   (6, 5)     │   (8, 7)     │
│ 공개키 크기 │  1312 B      │  1952 B      │  2592 B      │
│ 비밀키 크기 │  2528 B      │  4000 B      │  4864 B      │
│ 서명 크기   │  2420 B      │  3293 B      │  4595 B      │
│ 서명 속도   │  200 μs      │  350 μs      │  550 μs      │
│ 검증 속도   │  100 μs      │  180 μs      │  280 μs      │
└────────────┴──────────────┴──────────────┴──────────────┘

vs RSA-2048:
- 공개키: 1312B (Dilithium-2) vs 256B (RSA-2048)
- 서명: 2420B vs 256B
- 서명 속도: 200μs vs 5ms (25배 빠름!)
- 검증 속도: 100μs vs 0.5ms (5배 빠름!)
```

---

## 6. PQC 마이그레이션 전략

### 6.1 하이브리드 암호 (PQC + 기존 암호)

```
[하이브리드 TLS 핸드셰이크]

Client                                Server
  │                                      │
  │  ClientHello                         │
  │  - Supported Groups:                 │
  │    * X25519 (ECDH)                   │
  │    * Kyber-768                       │
  ├─────────────────────────────────────→│
  │                                      │
  │                   ServerHello        │
  │                   - Selected:        │
  │                     * X25519         │
  │                     * Kyber-768      │
  │←─────────────────────────────────────┤
  │                                      │
  │  KeyShare (Hybrid)                   │
  │  - ECDH: 32 bytes                    │
  │  - Kyber: 1088 bytes                 │
  ├─────────────────────────────────────→│
  │                                      │
  │                                      │
  │  Derive Master Secret:               │
  │  KDF(ECDH_secret || Kyber_secret)    │
  │                                      │
  └──────────────────────────────────────┘

장점:
✓ 기존 암호가 안전하면 → 하이브리드도 안전
✓ PQC에 취약점 발견되어도 → ECDH로 보호
✓ 양자 컴퓨터 등장해도 → Kyber로 보호
```

### 6.2 마이그레이션 4단계 전략

```python
class PQCMigrationManager:
    """PQC 마이그레이션 관리 시스템"""

    def __init__(self):
        self.current_phase = self.detect_migration_phase()

    def detect_migration_phase(self):
        """현재 마이그레이션 단계 판별"""
        # Phase 1: 기존 암호만 (RSA/ECDH)
        # Phase 2: 하이브리드 지원 추가 (RSA+Kyber)
        # Phase 3: PQC 우선 (Kyber+RSA fallback)
        # Phase 4: PQC 전용 (Kyber only)
        pass

    def phase1_inventory(self):
        """1단계: 암호 자산 목록 작성"""
        crypto_inventory = {
            'tls_connections': self.scan_tls_usage(),
            'code_signing': self.scan_code_signing(),
            'vpn': self.scan_vpn_crypto(),
            'databases': self.scan_db_encryption(),
            'certificates': self.scan_x509_certs()
        }

        # 위험도 평가
        risk_assessment = {}
        for asset_type, assets in crypto_inventory.items():
            for asset in assets:
                risk = self.assess_quantum_risk(asset)
                risk_assessment[asset['id']] = risk

        # 우선순위 설정
        high_priority = [
            asset for asset, risk in risk_assessment.items()
            if risk['priority'] == 'high'
        ]

        return {
            'inventory': crypto_inventory,
            'risk_assessment': risk_assessment,
            'high_priority_assets': high_priority
        }

    def assess_quantum_risk(self, asset):
        """양자 위협 위험도 평가"""
        risk_score = 0

        # 1. 데이터 수명 (Harvest Now, Decrypt Later 공격)
        if asset['data_lifetime'] > 10:  # 10년 이상 보관
            risk_score += 50

        # 2. 현재 암호 강도
        if asset['algorithm'] in ['RSA-1024', 'ECC-160']:
            risk_score += 40
        elif asset['algorithm'] in ['RSA-2048', 'ECC-256']:
            risk_score += 20

        # 3. 데이터 민감도
        if asset['classification'] in ['국가기밀', '의료정보']:
            risk_score += 30

        # 위험도 등급
        if risk_score >= 80:
            priority = 'critical'
        elif risk_score >= 50:
            priority = 'high'
        elif risk_score >= 30:
            priority = 'medium'
        else:
            priority = 'low'

        return {
            'score': risk_score,
            'priority': priority,
            'recommendation': self.get_migration_recommendation(priority)
        }

    def phase2_hybrid_deployment(self):
        """2단계: 하이브리드 암호 배포"""
        # TLS 서버 설정 업데이트
        tls_config = {
            'supported_groups': [
                'kyber768',      # PQC
                'x25519',        # 기존 ECDH
                'secp256r1'      # fallback
            ],
            'signature_algorithms': [
                'dilithium3',    # PQC
                'rsa_pss_rsae_sha256',  # 기존
                'ecdsa_secp256r1_sha256'
            ]
        }

        # 하이브리드 KEM 구현
        def hybrid_kem(server_pubkey):
            # 1. ECDH 키 교환
            ecdh_secret = self.ecdh_exchange(server_pubkey['ecdh'])

            # 2. Kyber KEM
            kyber_ciphertext, kyber_secret = self.kyber.encapsulate(
                server_pubkey['kyber']
            )

            # 3. 비밀 결합
            combined_secret = self.kdf_hybrid(ecdh_secret, kyber_secret)

            return combined_secret, kyber_ciphertext

        return hybrid_kem

    def phase3_pqc_priority(self):
        """3단계: PQC 우선 전환"""
        # PQC 전용 서비스 시작
        pqc_only_services = [
            '신규 인증서 발급',
            '고위험 데이터 암호화',
            '국가기밀 시스템'
        ]

        # 레거시는 fallback으로만 유지
        legacy_support = {
            'enabled': True,
            'timeout': datetime(2030, 12, 31),  # 레거시 지원 종료일
            'warning_message': 'This connection uses deprecated cryptography'
        }

        return pqc_only_services, legacy_support

    def phase4_pqc_only(self):
        """4단계: PQC 전용 전환"""
        # 모든 레거시 암호 제거
        deprecated_algorithms = [
            'RSA',
            'ECDH',
            'ECDSA'
        ]

        for algo in deprecated_algorithms:
            self.disable_algorithm(algo)

        # PQC 전용 인증서 발급
        pqc_cert = self.issue_pqc_certificate(
            algorithm='Dilithium-3',
            subject='CN=example.com',
            validity=365 * 10  # 10년
        )

        return pqc_cert
```

### 6.3 실제 마이그레이션 사례

#### Google Chrome - 하이브리드 Kyber 배포 (2024)

```
[Chrome 124+ PQC 지원]

1. TLS 1.3 핸드셰이크에 Kyber-768 추가
2. 하이브리드 키 교환: X25519Kyber768Draft00
   - X25519 (32 bytes) + Kyber-768 (1088 bytes)
   - 총 1120 bytes 키 교환 데이터

3. 배포 전략:
   - 2024.04: Chrome 124 베타 (10% 사용자)
   - 2024.06: Chrome 126 안정화 (100% 사용자)
   - 2025: Kyber만 사용 (X25519 제거 검토)

4. 성능 영향:
   - 핸드셰이크 시간: +5% (50ms → 52.5ms)
   - 대역폭: +1KB per connection
   - CPU: +3% (Kyber 연산)

5. 호환성:
   - Kyber 미지원 서버 → X25519 fallback
   - 점진적 전환 (Breaking change 없음)
```

---

## 7. 성능 및 보안 분석

### 7.1 성능 벤치마크 (Intel i7-12700K)

```python
benchmark_results = {
    "키 생성 (Key Generation)": {
        "RSA-2048": 45000,  # μs
        "ECDH P-256": 180,
        "Kyber-512": 50,
        "Kyber-768": 75,
        "Dilithium-2": 120
    },
    "암호화/서명 (Encryption/Signing)": {
        "RSA-2048": 450,
        "ECDSA P-256": 230,
        "Kyber-512 Encap": 70,
        "Dilithium-2 Sign": 200
    },
    "복호화/검증 (Decryption/Verification)": {
        "RSA-2048": 5000,
        "ECDSA P-256": 350,
        "Kyber-512 Decap": 80,
        "Dilithium-2 Verify": 100
    }
}

# 결론: Kyber/Dilithium이 RSA보다 10~100배 빠름!
```

### 7.2 키/암호문 크기 비교

```
┌──────────────┬──────────┬──────────┬──────────┐
│   알고리즘    │ 공개키   │ 암호문   │ 대역폭   │
├──────────────┼──────────┼──────────┼──────────┤
│ RSA-2048     │  256 B   │  256 B   │  512 B   │
│ ECDH P-256   │   64 B   │   64 B   │  128 B   │
│ Kyber-512    │  800 B   │  768 B   │ 1568 B   │
│ Kyber-768    │ 1184 B   │ 1088 B   │ 2272 B   │
│ Dilithium-2  │ 1312 B   │ 2420 B   │ 3732 B   │
└──────────────┴──────────┴──────────┴──────────┘

네트워크 영향:
- HTTP/3 (QUIC): 1-RTT 핸드셰이크에 +2KB
- IoT 환경: 제약 (NIST 경량 PQC 표준화 진행 중)
```

### 7.3 보안 강도 비교

```
[NIST 보안 레벨]

Level 1: AES-128 상당 (2^128 연산)
  - Kyber-512
  - Dilithium-2

Level 3: AES-192 상당 (2^192 연산)
  - Kyber-768
  - Dilithium-3

Level 5: AES-256 상당 (2^256 연산)
  - Kyber-1024
  - Dilithium-5

vs 양자 공격:
- RSA-2048 → 0 bit (Shor 알고리즘으로 즉시 해독)
- Kyber-512 → 128 bit (양자 컴퓨터로도 2^128 연산 필요)
```

---

## 8. 한계 및 개선 방향

### 8.1 현재 한계

1. **키/서명 크기**: RSA 대비 5~10배 큼 → 네트워크 오버헤드
2. **표준화 미완**: 일부 PQC 알고리즘 아직 Round 4 진행 중
3. **하드웨어 가속**: AES-NI 같은 전용 명령어 부재 → 최적화 필요
4. **취약점 가능성**: 신규 알고리즘 → 장기 검증 부족

### 8.2 개선 방향

1. **경량 PQC**: IoT 환경을 위한 작은 키 크기 알고리즘 (NIST 추가 표준화)
2. **하드웨어 가속**: Intel, ARM이 PQC 전용 명령어 개발 중
3. **Stateless Hash 서명**: Sphincs+ 성능 개선 (현재 Dilithium 대비 100배 느림)
4. **코드 기반 암호**: Classic McEliece (키 크기 문제 해결)

---

## 9. 시사점

### 9.1 기술적 시사점
- **격자 암호의 우위**: NIST 표준 3개 중 2개가 Module-LWE 기반
- **하이브리드 필수**: 안전한 전환을 위해 5~10년간 병행 운영
- **표준 준수**: FIPS 203/204 준수 시 정부 사업 우대

### 9.2 정책적 시사점
1. **과기정통부**: 양자 기술 로드맵에 PQC 전환 예산 반영
2. **KISA**: PQC 적용 가이드라인 발표 (2024년 하반기)
3. **금융위**: 2030년까지 금융권 PQC 전환 권고

### 9.3 출제 예상 각도
- **135회 양자 암호 출제** → 138회 **NIST PQC 표준** 출제 가능성 높음
- "Kyber와 Dilithium의 동작 원리"
- "PQC 마이그레이션 전략 (하이브리드 암호)"
- "격자 기반 암호의 보안 근거 (LWE 문제)"
- "기존 PKI에서 PQC로 전환 시 고려사항"

---

## 참고문헌
- NIST, "FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard" (2024)
- NIST, "FIPS 204: Module-Lattice-Based Digital Signature Standard" (2024)
- Kyber 논문: "CRYSTALS-Kyber Algorithm Specifications" (2020)
- Dilithium 논문: "CRYSTALS-Dilithium Algorithm Specifications" (2020)
- 과기정통부, "양자 기술 국가 전략" (2024)
