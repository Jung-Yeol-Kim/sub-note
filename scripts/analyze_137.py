#!/usr/bin/env python3
"""
137회 상세 분석 스크립트
기존 analyze_matching_v2.py를 기반으로 137회 전용 상세 분석 수행
"""

import json
import sys
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "exam_results"
REPORTS_DIR = PROJECT_ROOT / "reports"

# 출제기준 구조
SYLLABUS_STRUCTURE = {
    "1. 정보 전략 및 관리": {
        "세부항목": [
            "정보전략", "정보기술 전략", "비즈니스", "정보기술 환경분석", "아키텍처 설계",
            "투자성과", "경영정보", "경영전략", "정보시스템 개선", "AI윤리", "IT감리",
            "통계", "가설검정", "프로젝트 관리", "SLA", "재해복구", "A/B 테스팅", "대가산정"
        ],
        "키워드": ["정보전략", "경영", "감리", "프로젝트", "통계", "SLA", "재해복구", "테스팅", "대가산정"]
    },
    "2. 소프트웨어 공학": {
        "세부항목": [
            "소프트웨어 개발방법론", "SW아키텍처", "UI/UX", "시스템SW", "프로그래밍",
            "임베디드", "테스트", "리팩토링", "운영", "유지보수", "품질", "SW 안전",
            "UML", "다이어그램"
        ],
        "키워드": ["소프트웨어", "테스트", "감리", "UML", "다이어그램", "개발", "설계", "역공학", "재공학"]
    },
    "3. 자료처리": {
        "세부항목": [
            "자료구조", "데이터모델링", "데이터베이스", "DBMS", "분산파일", "데이터마이닝",
            "데이터 품질", "빅데이터", "트리", "연관 규칙", "트랜잭션", "벡터 데이터베이스"
        ],
        "키워드": ["자료구조", "데이터", "DB", "트리", "마이닝", "트랜잭션", "벡터"]
    },
    "4. 컴퓨터 시스템 및 정보통신": {
        "세부항목": [
            "운영체제", "시스템 프로그래밍", "수치해석", "알고리즘", "가상화", "인프라",
            "네트워크", "프로토콜", "통신시스템", "라우팅", "캐시", "메모리", "스케줄링"
        ],
        "키워드": ["운영체제", "네트워크", "프로토콜", "라우팅", "캐시", "메모리", "스케줄링", "알고리즘"]
    },
    "5. 정보보안": {
        "세부항목": [
            "암호화", "보안시스템", "보안엔지니어링", "관리적 보안", "포렌식",
            "개인정보보호", "보안 취약점", "악성코드", "백도어"
        ],
        "키워드": ["보안", "암호", "포렌식", "취약점", "악성코드", "백도어", "BPFdoor"]
    },
    "6. 최신기술, 법규 및 정책": {
        "세부항목": [
            "인공지능", "AI", "영상", "그래픽", "IoT", "모바일", "클라우드",
            "스마트팩토리", "전자정부법", "개인정보보호법", "소프트웨어진흥법",
            "데이터산업법", "MCP", "Transformer", "GNN", "MoE", "쿠버네티스",
            "초거대 AI", "TEXT2SQL"
        ],
        "키워드": ["AI", "인공지능", "GNN", "Transformer", "MoE", "초거대", "클라우드",
                  "쿠버네티스", "TEXT2SQL", "거버넌스", "검인증"]
    }
}


def categorize_question(question_dict):
    """개선된 문제 분류 함수"""
    question_keywords = question_dict["키워드"]
    question_title = question_dict["제목"]

    category_scores = {}

    for category, details in SYLLABUS_STRUCTURE.items():
        score = 0
        matched_keywords = []

        # 세부항목 매칭
        for item in details["세부항목"]:
            for q_keyword in question_keywords:
                if item.lower() in q_keyword.lower() or q_keyword.lower() in item.lower():
                    score += 2
                    matched_keywords.append(item)

        # 카테고리 키워드 매칭
        for cat_keyword in details["키워드"]:
            for q_keyword in question_keywords:
                if cat_keyword.lower() in q_keyword.lower() or q_keyword.lower() in cat_keyword.lower():
                    score += 3
                    matched_keywords.append(cat_keyword)

            if cat_keyword.lower() in question_title.lower():
                score += 1

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


def analyze_137():
    """137회 상세 분석"""
    # 문제 데이터 로드
    questions_path = DATA_DIR / "137회_문제목록.json"

    with open(questions_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions_137th = data["questions"]

    # 분석 실행
    print("="*100)
    print("137회 정보관리기술사 출제기준 매칭 분석 (상세 버전)")
    print("="*100)
    print()

    category_count = {cat: 0 for cat in SYLLABUS_STRUCTURE.keys()}
    category_count["미분류"] = 0
    category_questions = {cat: [] for cat in SYLLABUS_STRUCTURE.keys()}
    category_questions["미분류"] = []

    all_results = {}

    for period, questions in questions_137th.items():
        print(f"\n{'='*100}")
        print(f"{period} 분석 (총 {len(questions)}문제)")
        print(f"{'='*100}\n")

        period_results = []

        for question in questions:
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

            print(f"{question['번호']}. {question['제목']}")
            print(f"   매칭된 출제기준: {', '.join(categories)}")
            if matched_keywords:
                print(f"   매칭 키워드: {', '.join(matched_keywords[:5])}")
            print()

        all_results[period] = period_results

    # 통계 출력
    print("\n" + "="*100)
    print("주요항목별 출제 빈도 통계")
    print("="*100)
    print()

    total_questions = sum(category_count.values())
    print(f"총 문제 수: {total_questions}개\n")

    print(f"{'주요항목':<40} {'문제수':>10} {'비율':>10} {'출제율':>10}")
    print("-"*100)

    for category in SYLLABUS_STRUCTURE.keys():
        count = category_count[category]
        percentage = (count / total_questions * 100) if total_questions > 0 else 0
        bar = "■" * int(percentage / 5)
        print(f"{category:<40} {count:>10}개 {percentage:>9.1f}% {bar}")

    # 저장
    output_data = {
        "분석일자": datetime.now().strftime("%Y-%m-%d"),
        "시험회차": "137회",
        "분석결과": all_results,
        "통계": {
            "카테고리별_문제수": category_count,
            "카테고리별_문제목록": category_questions,
            "총_문제수": total_questions
        }
    }

    output_path = DATA_DIR / "137회_출제기준_매칭결과_상세.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n\n✓ 분석 결과 저장: {output_path}")


if __name__ == "__main__":
    analyze_137()
