#!/usr/bin/env python3
"""
정보관리기술사 기출문제 분석 스크립트 (범용)

exam_data_helper.py로 입력한 데이터를 기반으로 출제기준 매칭 분석을 수행합니다.

사용법:
    python analyze.py 137              # 137회 분석
    python analyze.py 136 137          # 136회, 137회 분석
    python analyze.py 136 137 --quiet  # 간략 출력
"""

import json
import sys
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "exam_results"

# 출제기준 구조
SYLLABUS_STRUCTURE = {
    "1. 정보 전략 및 관리": {
        "세부항목": [
            "정보전략", "정보기술 전략", "비즈니스", "정보기술 환경분석", "아키텍처 설계",
            "투자성과", "경영정보", "경영전략", "정보시스템 개선", "AI윤리", "IT감리",
            "통계", "가설검정", "프로젝트 관리", "SLA", "재해복구", "A/B 테스팅", "대가산정",
            "SCM", "공급망", "PMO", "갈등관리", "팀", "디지털전환", "AX", "ISP", "ISMP",
            "WBS", "ESG", "투자분석", "차세대 시스템", "AHP", "의사결정", "분포", "베르누이",
            "기하 분포", "ISO 21500", "DSML", "요구사항 관리", "디지털 트랜스포메이션",
            "Digital Transformation", "BPR", "t-검정", "독립표본", "대응 표본",
            "전략적 기업경영", "Strategic Enterprise Management", "SWOT", "경영환경 분석",
            "ITSM", "서비스 관리", "기술수용모델", "TAM", "Technology Acceptance Model",
            "BCP", "Business Continuity Planning", "DRS", "Disaster Recovery System"
        ],
        "키워드": ["정보전략", "경영", "감리", "프로젝트", "통계", "SLA", "재해복구", "테스팅",
                  "대가산정", "SCM", "공급망", "PMO", "갈등", "AX", "디지털전환", "ISP", "ISMP",
                  "WBS", "ESG", "투자분석", "투자성과", "차세대", "개선", "AHP", "의사결정",
                  "분포", "Bernoulli", "Geometric", "ISO", "DSML", "요구사항",
                  "Digital Transformation", "트랜스포메이션", "BPR", "t-검정", "검정", "SWOT",
                  "경영환경", "ITSM", "서비스 관리", "TAM", "Technology Acceptance", "기술수용",
                  "BCP", "Business Continuity", "DRS", "Disaster Recovery"]
    },
    "2. 소프트웨어 공학": {
        "세부항목": [
            "소프트웨어 개발방법론", "SW아키텍처", "UI/UX", "시스템SW", "프로그래밍",
            "임베디드", "테스트", "리팩토링", "운영", "유지보수", "품질", "SW 안전",
            "UML", "다이어그램", "인스펙션", "검토", "제품계열", "DevOps", "DevSecOps",
            "라이프사이클", "자동화", "AOP", "결합도", "Coupling", "캡슐화", "Encapsulation",
            "화이트박스", "블랙박스", "디자인패턴", "Design Pattern", "Agile", "EDA",
            "Event Driven Architecture", "아키텍처 토폴로지", "노코드", "no-code",
            "요구사항명세서", "DataOps", "데이터옵스", "빅데이터 감리", "폭포수",
            "애자일", "아키텍처 스타일", "통합 테스트", "Integration Test",
            "소프트웨어 안전성", "SBOM", "Software Bill of Material", "규모산정",
            "정보은닉", "Information Hiding", "REST API", "RESTful", "API 설계",
            "뮤테이션 테스트", "Mutation Test", "요구공학", "Requirement Engineering"
        ],
        "키워드": ["소프트웨어", "테스트", "감리", "UML", "다이어그램", "개발", "설계",
                  "역공학", "재공학", "인스펙션", "검토", "제품계열", "DevOps", "DevSecOps",
                  "라이프사이클", "자동화", "품질", "AOP", "결합도", "Coupling", "캡슐화",
                  "Encapsulation", "화이트박스", "블랙박스", "White Box", "Black Box",
                  "리팩토링", "Refactoring", "디자인패턴", "Design Pattern", "Agile", "EDA",
                  "Event Driven", "아키텍처", "노코드", "no-code", "요구사항명세서",
                  "DataOps", "데이터옵스", "빅데이터", "폭포수", "애자일", "통합 테스트",
                  "Integration", "안전성", "SBOM", "규모산정", "정보은닉", "REST", "API",
                  "RESTful", "뮤테이션", "Mutation", "요구공학", "Requirement Engineering"]
    },
    "3. 자료처리": {
        "세부항목": [
            "자료구조", "데이터모델링", "데이터베이스", "DBMS", "분산파일", "데이터마이닝",
            "데이터 품질", "빅데이터", "트리", "연관 규칙", "트랜잭션", "벡터 데이터베이스",
            "정규형", "정규화", "다치종속", "BCNF", "아웃라이어", "이상치", "F1-score",
            "Clustering", "DBSCAN", "트리정렬", "Tree Sort", "Data Mining", "이상현상",
            "Anomaly", "Relation", "릴레이션", "품질관리", "병행 제어", "거버넌스",
            "블록체인", "Decision Tree", "의사결정나무", "음성데이터", "차원 축소",
            "Dimensionality Reduction", "데이터 표준화", "Data Visualization",
            "데이터 시각화", "Data Structure", "학습용 데이터", "정렬 알고리즘",
            "점추정", "구간추정", "통계 추정", "다중공선성", "Multicollinearity",
            "스택", "큐", "리스트", "선형 자료구조", "TF-IDF", "형태소 분석",
            "Term Frequency", "Inverse Document Frequency", "텍스트 마이닝",
            "NoSQL", "CRUD", "매트릭스", "RDBMS", "관계형 데이터베이스",
            "다자간 계산", "MPC", "Multi-Party Computation"
        ],
        "키워드": ["자료구조", "데이터", "DB", "트리", "마이닝", "트랜잭션", "벡터",
                  "정규형", "정규화", "아웃라이어", "이상치", "F1", "Clustering",
                  "DBSCAN", "Tree Sort", "Data Mining", "Transaction", "Anomaly",
                  "Relation", "릴레이션", "이상현상", "품질관리", "품질", "병행 제어",
                  "거버넌스", "블록체인", "Decision Tree", "음성", "차원 축소",
                  "Dimensionality", "표준화", "시각화", "Visualization", "Data Structure",
                  "학습용", "정렬", "점추정", "구간추정", "추정", "다중공선성", "Multicollinearity",
                  "스택", "큐", "리스트", "선형 자료", "TF-IDF", "형태소", "Term Frequency",
                  "텍스트 마이닝", "NoSQL", "CRUD", "매트릭스", "RDBMS", "관계형",
                  "MPC", "Multi-Party", "다자간"]
    },
    "4. 컴퓨터 시스템 및 정보통신": {
        "세부항목": [
            "운영체제", "시스템 프로그래밍", "수치해석", "가상화", "인프라",
            "네트워크", "프로토콜", "통신시스템", "라우팅", "캐시", "메모리", "스케줄링",
            "클라우드", "서버리스", "FaaS", "BaaS", "CXL", "PCIe", "인터커넥트",
            "세그먼테이션", "동기화", "병렬처리", "메모리 누수", "Virtualization",
            "인프라 아키텍처", "코드형 인프라", "IaC", "VXLAN", "LAN", "서브네팅",
            "subnetting", "TCP", "Transmission Control Protocol", "NFC",
            "Near Field Communication", "Service Model", "Deployment Model",
            "오토 스케일링", "Auto Scaling", "페이징", "소켓 통신", "Socket",
            "ELK", "Elasticsearch", "Logstash", "Kibana", "로그 분석",
            "SCTP", "Stream Control Transmission Protocol", "전송 프로토콜",
            "VPN", "Virtual Private Network", "5G", "특화망", "handshake"
        ],
        "키워드": ["운영체제", "네트워크", "프로토콜", "라우팅", "캐시", "메모리", "스케줄링",
                  "클라우드", "서버리스", "CXL", "세그먼테이션", "동기화", "누수",
                  "가상화", "Virtualization", "인프라", "IaC", "VXLAN", "LAN", "서브네팅",
                  "subnetting", "TCP", "Congestion", "NFC", "Near Field", "Service Model",
                  "Deployment", "오토 스케일링", "Auto Scaling", "페이징", "소켓", "Socket",
                  "ELK", "Elasticsearch", "Logstash", "Kibana", "로그", "SCTP",
                  "Stream Control", "전송", "VPN", "Virtual Private", "5G", "특화망", "handshake"]
    },
    "5. 정보보안": {
        "세부항목": [
            "암호화", "보안시스템", "보안엔지니어링", "관리적 보안", "포렌식",
            "개인정보보호", "보안 취약점", "악성코드", "백도어", "CC", "인증", "평가",
            "타원곡선", "ECC", "E2E", "제로트러스트", "공급망 보안", "NOMA",
            "접근제어", "Access Control", "LDAP", "인포스틸러", "Infostealer",
            "리스크 관리", "CSP 보안", "드론 보안", "블록 암호화", "디지털 포렌식",
            "클라우드 보안", "보안 위협", "보안 문제", "보안 요소", "크리덴셜 스터핑",
            "Credential Stuffing", "Zero Trust Security", "제로 트러스트 보안",
            "ISMS", "Information Security Management System", "안전성 확보조치",
            "ISA/IEC 62443", "산업 보안", "ICS 보안", "큐싱", "Qshing", "피싱",
            "TPM", "Trusted Platform Module", "하드웨어 보안", "신뢰 플랫폼",
            "FIPS", "Federal Information Processing Standard", "암호 표준",
            "CBPR", "Cross Border Privacy Rules", "국제 개인정보", "마이데이터",
            "동형암호", "Homomorphic Encryption", "안티포렌식", "Anti-Forensic",
            "전자봉투", "PbD", "Privacy by Design"
        ],
        "키워드": ["보안", "암호", "포렌식", "취약점", "악성코드", "백도어", "BPFdoor",
                  "CC", "인증", "ECC", "타원곡선", "E2E", "제로트러스트", "개인정보", "안심구역",
                  "NOMA", "접근제어", "Access Control", "LDAP", "인포스틸러", "Infostealer",
                  "리스크", "CSP", "드론", "블록 암호", "디지털 포렌식", "클라우드 보안", "위협",
                  "보안 문제", "보안 요소", "크리덴셜", "Credential", "Stuffing", "Zero Trust",
                  "ISMS", "확보조치", "ISA", "IEC", "62443", "산업 보안", "ICS", "큐싱", "Qshing",
                  "TPM", "Trusted Platform", "하드웨어 보안", "신뢰", "FIPS", "Federal Information",
                  "암호 표준", "CBPR", "Cross Border", "Privacy Rules", "마이데이터",
                  "동형암호", "Homomorphic", "안티포렌식", "Anti-Forensic", "전자봉투",
                  "PbD", "Privacy by Design"]
    },
    "6. 최신기술, 법규 및 정책": {
        "세부항목": [
            "인공지능", "AI", "영상", "그래픽", "IoT", "모바일", "클라우드",
            "스마트팩토리", "전자정부법", "개인정보보호법", "소프트웨어진흥법",
            "데이터산업법", "MCP", "Transformer", "GNN", "MoE", "쿠버네티스",
            "초거대 AI", "TEXT2SQL", "범용 AI", "GPAI", "에이전틱", "Agentic",
            "LLM", "생성형AI", "윤리", "화이트레이블", "마케팅", "프록시",
            "디지털 플랫폼", "딥뷰", "DeepView", "반도체", "정보보호 제품", "신속 확인",
            "6G", "이동통신", "메타버스", "디지털 역기능", "Machine Learning",
            "머신러닝", "웹3.0", "최적화 알고리즘", "딥러닝", "Deep Learning",
            "파운데이션 모델", "Foundation", "LangChain", "프레임워크",
            "예지정비", "Predictive Maintenance", "설비 정비", "딥페이크", "Deepfake",
            "슈퍼앱", "인공신경망", "PLM", "Pre-trained Language Model", "신뢰성"
        ],
        "키워드": ["AI", "인공지능", "GNN", "Transformer", "MoE", "초거대", "클라우드",
                  "쿠버네티스", "TEXT2SQL", "거버넌스", "검인증", "GPAI", "범용", "Agentic",
                  "에이전틱", "LLM", "MCP", "생성형", "윤리", "화이트레이블", "프록시",
                  "디지털 플랫폼", "정부", "딥뷰", "DeepView", "반도체", "정보보호 제품", "법규", "정책",
                  "6G", "이동통신", "메타버스", "디지털 역기능", "Machine Learning", "머신러닝",
                  "웹3.0", "Optimization", "딥러닝", "Deep Learning", "파운데이션", "Foundation",
                  "LangChain", "프레임워크", "예지정비", "Predictive Maintenance", "설비",
                  "딥페이크", "Deepfake", "슈퍼앱", "신경망", "PLM", "Pre-trained", "신뢰성"]
    }
}


def is_keyword_match(keyword, text):
    """키워드가 텍스트에 매칭되는지 확인 (짧은 키워드는 완전 일치만 허용)"""
    keyword_lower = keyword.lower()
    text_lower = text.lower()

    # 3글자 이하 영문 키워드는 단어 경계 검사
    if len(keyword) <= 3 and keyword.isascii():
        import re
        # 단어 경계로 정확히 매칭 (대소문자 무시)
        pattern = r'\b' + re.escape(keyword_lower) + r'\b'
        return bool(re.search(pattern, text_lower))

    # 일반 포함 검사
    return keyword_lower in text_lower


def categorize_question(question_dict):
    """문제를 출제기준 카테고리에 매칭"""
    question_keywords = question_dict["키워드"]
    question_title = question_dict["제목"]

    category_scores = {}

    for category, details in SYLLABUS_STRUCTURE.items():
        score = 0
        matched_keywords = []

        # 세부항목 매칭
        for item in details["세부항목"]:
            for q_keyword in question_keywords:
                # 양방향 매칭 (짧은 키워드 처리)
                if is_keyword_match(item, q_keyword) or is_keyword_match(q_keyword, item):
                    score += 3
                    matched_keywords.append(item)

            # 제목에서도 세부항목 매칭
            if is_keyword_match(item, question_title):
                score += 3
                matched_keywords.append(item)

        # 카테고리 키워드 매칭
        for cat_keyword in details["키워드"]:
            for q_keyword in question_keywords:
                # 양방향 매칭 (짧은 키워드 처리)
                if is_keyword_match(cat_keyword, q_keyword) or is_keyword_match(q_keyword, cat_keyword):
                    score += 3
                    matched_keywords.append(cat_keyword)

            # 제목에서도 키워드 매칭 (점수 향상)
            if is_keyword_match(cat_keyword, question_title):
                score += 3

        if score > 0:
            category_scores[category] = {
                "score": score,
                "matched_keywords": list(set(matched_keywords))
            }

    if category_scores:
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1]["score"], reverse=True)
        best_match = sorted_categories[0]

        if best_match[1]["score"] >= 2:
            return [best_match[0]], best_match[1]["matched_keywords"]

    return ["미분류"], []


def analyze_exam(exam_num, verbose=True):
    """특정 회차 분석"""
    # 문제 데이터 로드
    questions_path = DATA_DIR / f"{exam_num}회_문제목록.json"

    if not questions_path.exists():
        print(f"⚠️  {exam_num}회 문제 데이터를 찾을 수 없습니다: {questions_path}")
        print(f"   exam_data_helper.py에 {exam_num}회 데이터를 추가하고 실행하세요.")
        return None

    with open(questions_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data["questions"]

    # 분석 실행
    if verbose:
        print("="*100)
        print(f"{exam_num}회 정보관리기술사 출제기준 매칭 분석")
        print("="*100)
        print()

    category_count = {cat: 0 for cat in SYLLABUS_STRUCTURE.keys()}
    category_count["미분류"] = 0
    category_questions = {cat: [] for cat in SYLLABUS_STRUCTURE.keys()}
    category_questions["미분류"] = []

    all_results = {}

    for period, period_questions in questions.items():
        if verbose:
            print(f"\n{'='*100}")
            print(f"{period} 분석 (총 {len(period_questions)}문제)")
            print(f"{'='*100}\n")

        period_results = []

        for question in period_questions:
            categories, matched_keywords = categorize_question(question)
            period_results.append({
                "번호": question["번호"],
                "제목": question["제목"],
                "categories": categories,
                "matched_keywords": matched_keywords
            })

            for cat in categories:
                if cat in category_count:
                    category_count[cat] += 1
                    category_questions[cat].append(f"{period} {question['번호']}. {question['제목']}")
                else:
                    category_count["미분류"] += 1
                    category_questions["미분류"].append(f"{period} {question['번호']}. {question['제목']}")

            if verbose:
                print(f"{question['번호']}. {question['제목']}")
                print(f"   매칭된 출제기준: {', '.join(categories)}")
                if matched_keywords:
                    print(f"   매칭 키워드: {', '.join(matched_keywords[:5])}")
                print()

        all_results[period] = period_results

    # 통계 출력
    total_questions = sum(category_count.values())

    if verbose:
        print("\n" + "="*100)
        print("주요항목별 출제 빈도 통계")
        print("="*100)
        print()
        print(f"총 문제 수: {total_questions}개\n")
        print(f"{'주요항목':<40} {'문제수':>10} {'비율':>10} {'출제율':>10}")
        print("-"*100)

        for category in SYLLABUS_STRUCTURE.keys():
            count = category_count[category]
            percentage = (count / total_questions * 100) if total_questions > 0 else 0
            bar = "■" * int(percentage / 5)
            print(f"{category:<40} {count:>10}개 {percentage:>9.1f}% {bar}")
    else:
        print(f"✓ {exam_num}회 분석 완료 (총 {total_questions}문제)")

    # 분석 결과 저장 (2가지 형식)
    # 1. 상세 분석 결과
    detailed_output = {
        "분석일자": datetime.now().strftime("%Y-%m-%d"),
        "시험회차": f"{exam_num}회",
        "분석결과": all_results,
        "통계": {
            "카테고리별_문제수": category_count,
            "카테고리별_문제목록": category_questions,
            "총_문제수": total_questions
        }
    }

    detailed_path = DATA_DIR / f"{exam_num}회_출제기준_매칭결과_상세.json"
    with open(detailed_path, "w", encoding="utf-8") as f:
        json.dump(detailed_output, f, ensure_ascii=False, indent=2)

    # 2. 리포트 생성용 형식
    report_output = {
        "exam_number": exam_num,
        "analysis_date": datetime.now().strftime("%Y-%m-%d"),
        "questions": questions,
        "statistics": {
            "total_questions": total_questions,
            "category_count": category_count,
            "category_questions": category_questions
        }
    }

    report_path = DATA_DIR / f"{exam_num}회_분석결과.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_output, f, ensure_ascii=False, indent=2)

    if verbose:
        print(f"\n\n✓ 분석 결과 저장:")
        print(f"  - 상세: {detailed_path}")
        print(f"  - 리포트용: {report_path}")

    return report_output


def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        print("사용법: python analyze.py <회차번호> [회차번호...] [--quiet]")
        print("예시:")
        print("  python analyze.py 137")
        print("  python analyze.py 136 137")
        print("  python analyze.py 136 137 --quiet")
        sys.exit(1)

    # 인자 파싱
    args = sys.argv[1:]
    verbose = "--quiet" not in args
    exam_numbers = [arg for arg in args if arg != "--quiet"]

    # 각 회차 분석
    for exam_num in exam_numbers:
        try:
            analyze_exam(exam_num, verbose=verbose)
            if len(exam_numbers) > 1 and verbose:
                print("\n")
        except Exception as e:
            print(f"✗ {exam_num}회 분석 중 오류 발생: {e}")


if __name__ == "__main__":
    main()
