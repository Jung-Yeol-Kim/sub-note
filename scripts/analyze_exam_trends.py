#!/usr/bin/env python3
"""
129~137회 출제 문제의 배경 기술 트렌드 분석
목표: 각 출제 문제가 나온 "근본 원인" 파악 → 미출제 파생 기술 발굴
"""

import json
import os
from collections import defaultdict

# 출제 문제 → 배경 기술 트렌드 매핑
TREND_ANALYSIS = {
    # AI/LLM 관련
    "벡터 데이터베이스": {
        "출제회차": ["137회"],
        "출제배경": "RAG(검색증강생성) 기술의 대중화",
        "근본원인": "LLM의 한계(환각, 최신 정보 부족) → 외부 지식 검색 필요",
        "파생기술": [
            "임베딩 모델 (BGE, E5, Sentence Transformers)",
            "ANN 알고리즘 (HNSW, IVF, ScaNN)",
            "벡터 검색 최적화 (양자화, PQ)",
            "하이브리드 검색 (벡터 + 키워드)",
            "FAISS, Milvus, Qdrant 비교"
        ]
    },

    "MCP (Model Context Protocol)": {
        "출제회차": ["136회", "137회"],
        "출제배경": "AI 에이전트의 도구 통합 표준화 필요",
        "근본원인": "LLM이 외부 시스템(DB, API, 파일)과 상호작용하는 표준 부재",
        "파생기술": [
            "Function Calling 메커니즘 구현",
            "Tool Schema 정의 (JSON Schema)",
            "ReAct 패턴 (Reasoning + Acting)",
            "에이전트 오케스트레이션 (LangGraph, AutoGPT)",
            "Tool Use 최적화 (병렬 실행, 에러 핸들링)"
        ]
    },

    "LLM": {
        "출제회차": ["133회", "135회", "136회"],
        "출제배경": "LLM 도입 가속화 + 보안 위협 증가",
        "근본원인": "기업/공공기관의 LLM 활용 확대 → 프롬프트 인젝션, 데이터 유출 우려",
        "파생기술": [
            "vLLM의 PagedAttention 알고리즘",
            "KV Cache 최적화",
            "MoE 라우팅 알고리즘 (Switch Transformer, Mixtral)",
            "LLM 추론 최적화 (FlashAttention, Quantization)",
            "프롬프트 인젝션 방어 (Sandwich Defense, Guardrails)",
            "LLM Firewall (Lakera, NeMo Guardrails)"
        ]
    },

    "Transformer": {
        "출제회차": ["137회"],
        "출제배경": "LLM의 핵심 아키텍처",
        "근본원인": "Attention 메커니즘의 이해 필요",
        "파생기술": [
            "Multi-Head Attention 구현",
            "Positional Encoding (Sinusoidal, RoPE, ALiBi)",
            "Flash Attention (메모리 효율화)",
            "Sparse Attention (Longformer, BigBird)",
            "KV Cache 압축 기법"
        ]
    },

    # 보안 관련
    "동형암호": {
        "출제회차": ["133회"],
        "출제배경": "프라이버시 보존 컴퓨팅 수요 증가",
        "근본원인": "클라우드 데이터 처리 시 암호화 상태 유지 필요 (의료, 금융)",
        "파생기술": [
            "FHE 라이브러리 (SEAL, OpenFHE, Concrete)",
            "CKKS 스킴 (근사 연산)",
            "BFV 스킴 (정수 연산)",
            "동형암호 연산 최적화 (부트스트래핑)",
            "연합학습과 동형암호 결합"
        ]
    },

    "양자 암호": {
        "출제회차": ["135회"],
        "출제배경": "양자 컴퓨터의 암호 위협",
        "근본원인": "Shor 알고리즘으로 RSA 취약 → NIST PQC 표준화 진행",
        "파생기술": [
            "NIST PQC 표준 알고리즘 (Kyber, Dilithium)",
            "격자 기반 암호 (Lattice-based Cryptography)",
            "QKD (Quantum Key Distribution) 프로토콜",
            "하이브리드 암호 (기존 + PQC)",
            "양자내성암호 마이그레이션 전략"
        ]
    },

    "제로트러스트": {
        "출제회차": ["135회", "136회"],
        "출제배경": "경계 기반 보안 모델의 한계 → 클라우드, 재택근무 확산",
        "근본원인": "네트워크 경계가 사라짐 (Zero Perimeter)",
        "파생기술": [
            "SDP (Software Defined Perimeter)",
            "ZTNA (Zero Trust Network Access) 구현",
            "마이크로세그멘테이션",
            "컨티뉴어스 인증 (Continuous Authentication)",
            "Device Trust (단말 신뢰성 검증)"
        ]
    },

    "N2SF": {
        "출제회차": ["137회"],
        "출제배경": "국가 망 분리 정책 현대화",
        "근본원인": "망분리의 업무 효율성 저하 → 논리적 분리 전환",
        "파생기술": [
            "망연계 솔루션 (SBC, VDI)",
            "데이터 다이오드 (Data Diode)",
            "망분리 우회 공격 방어",
            "클라우드 환경 망분리"
        ]
    },

    # 데이터 관련
    "데이터 품질관리": {
        "출제회차": ["129회", "131회"],
        "출제배경": "AI 학습 데이터 품질의 중요성 증대",
        "근본원인": "Garbage In, Garbage Out → 데이터 품질이 AI 성능 결정",
        "파생기술": [
            "데이터 검증 자동화 (Great Expectations)",
            "데이터 프로파일링",
            "이상탐지 (Anomaly Detection)",
            "데이터 계보 추적 (Data Lineage)",
            "메타데이터 관리"
        ]
    },

    # 인프라 관련
    "쿠버네티스": {
        "출제회차": ["133회", "137회"],
        "출제배경": "컨테이너 오케스트레이션 표준화",
        "근본원인": "마이크로서비스 아키텍처 확산 → 컨테이너 관리 복잡도 증가",
        "파생기술": [
            "서비스 메시 (Istio, Linkerd)",
            "GitOps (ArgoCD, Flux)",
            "eBPF 기반 네트워킹 (Cilium)",
            "Kubernetes 보안 (Falco, OPA)",
            "멀티 클러스터 관리 (Rancher)"
        ]
    },

    "서버리스 컴퓨팅": {
        "출제회차": ["136회"],
        "출제배경": "인프라 관리 부담 제거",
        "근본원인": "개발자가 코드에만 집중 → 확장성 자동화",
        "파생기술": [
            "Cold Start 최적화",
            "Serverless Framework (SAM, Serverless Framework)",
            "FaaS 보안 (함수 격리, IAM)",
            "Edge Computing (Cloudflare Workers, Lambda@Edge)",
            "서버리스 워크플로우 (Step Functions)"
        ]
    },

    # 소프트웨어 공학
    "SBOM": {
        "출제회차": ["134회"],
        "출제배경": "소프트웨어 공급망 공격 증가 (Log4j, SolarWinds)",
        "근본원인": "오픈소스 의존성 관리 부재 → 취약점 추적 불가",
        "파생기술": [
            "SBOM 생성 도구 (Syft, CycloneDX)",
            "의존성 스캐닝 (Snyk, Dependabot)",
            "취약점 DB 연동 (NVD, OSV)",
            "SBOM 표준 (SPDX, CycloneDX)",
            "소프트웨어 서명 (Sigstore, in-toto)"
        ]
    },

    "DevOps": {
        "출제회차": ["136회"],
        "출제배경": "개발-운영 통합 문화 확산",
        "근본원인": "릴리스 주기 단축 필요 → 자동화, 협업 강화",
        "파생기술": [
            "GitOps 워크플로우",
            "IaC (Terraform, Pulumi)",
            "플랫폼 엔지니어링 (Backstage, Port)",
            "CI/CD 파이프라인 최적화",
            "FinOps (클라우드 비용 최적화)"
        ]
    }
}

def analyze_trends():
    print('=' * 100)
    print('📊 출제 문제 배경 기술 트렌드 분석 (129~137회)')
    print('=' * 100)
    print('\n🎯 목표: "왜 이 문제가 출제되었는가?" → 파생 기술 발굴\n')

    # 카테고리별 분류
    categories = {
        "AI/LLM 인프라": ["벡터 데이터베이스", "MCP (Model Context Protocol)", "LLM", "Transformer"],
        "보안 패러다임": ["동형암호", "양자 암호", "제로트러스트", "N2SF"],
        "데이터 엔지니어링": ["데이터 품질관리"],
        "클라우드 인프라": ["쿠버네티스", "서버리스 컴퓨팅"],
        "소프트웨어 공급망": ["SBOM", "DevOps"]
    }

    for category, topics in categories.items():
        print(f'\n{"=" * 100}')
        print(f'📌 {category}')
        print(f'{"=" * 100}\n')

        for topic in topics:
            if topic not in TREND_ANALYSIS:
                continue

            data = TREND_ANALYSIS[topic]

            print(f'🔍 출제 문제: **{topic}**')
            print(f'   출제회차: {", ".join(data["출제회차"])}')
            print(f'\n   📖 출제 배경:')
            print(f'      {data["출제배경"]}')
            print(f'\n   🎯 근본 원인:')
            print(f'      {data["근본원인"]}')
            print(f'\n   🆕 파생 기술 (미출제, 출제 가능성 높음):')

            for i, tech in enumerate(data["파생기술"], 1):
                print(f'      {i}. {tech}')

            print()

    # 통계 요약
    print('\n' + '=' * 100)
    print('📈 통합 분석 결과')
    print('=' * 100)

    total_derived = sum(len(v["파생기술"]) for v in TREND_ANALYSIS.values())

    print(f'\n✅ 분석 완료:')
    print(f'   - 분석한 출제 문제: {len(TREND_ANALYSIS)}개')
    print(f'   - 발굴한 파생 기술: {total_derived}개')
    print(f'\n💡 핵심 인사이트:')
    print(f'   1. 출제 문제는 "표면"이고, 파생 기술이 "실체"')
    print(f'   2. BPFdoor 같은 일회성 키워드는 무의미')
    print(f'   3. 대신 eBPF(근본 기술)를 학습해야 함')
    print(f'   4. 암호문 공격 X → NIST PQC 표준 알고리즘 O')
    print(f'   5. 벡터 DB X → HNSW/IVF 알고리즘, 임베딩 모델 O')

    print(f'\n🎯 다음 단계:')
    print(f'   - 파생 기술 {total_derived}개를 기반으로 100개 토픽 재구성')
    print(f'   - Low-level 알고리즘 중심 학습 (vLLM PagedAttention, MoE 라우팅 등)')
    print(f'   - 구현 수준의 이해 (라이브러리, 코드 레벨)')

if __name__ == '__main__':
    analyze_trends()
