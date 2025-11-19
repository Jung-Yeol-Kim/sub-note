#!/usr/bin/env python3
"""
정보관리기술사 기출문제 분석 도구 (범용 버전)
여러 회차의 기출문제를 분석하고 출제 경향을 파악합니다.

사용법:
    python exam_analyzer.py 137  # 137회 분석
    python exam_analyzer.py 136 137  # 136회, 137회 비교 분석
"""

import sys
import os
import json
import pdfplumber
import re
from pathlib import Path
from datetime import datetime

# 프로젝트 루트 디렉토리
PROJECT_ROOT = Path(__file__).parent.parent
KPC_DIR = PROJECT_ROOT / "kpc" / "10. 기출풀이"
DATA_DIR = PROJECT_ROOT / "data"
REPORTS_DIR = PROJECT_ROOT / "reports"

# 출제기준 구조 정의
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


class ExamAnalyzer:
    """기출문제 분석 클래스"""

    def __init__(self, exam_number):
        self.exam_number = exam_number
        self.exam_dir = KPC_DIR / f"{exam_number}회 기출문제풀이"
        self.questions = {}
        self.analysis_result = {}

    def extract_questions_from_pdf(self):
        """PDF에서 문제 목록 추출"""
        print(f"\n{self.exam_number}회 기출문제 PDF 분석 중...")

        periods = ["1교시", "2교시", "3교시", "4교시"]

        for period in periods:
            pdf_path = self.exam_dir / f"{self.exam_number}회_기출풀이_정보관리 {period}.pdf"

            if not pdf_path.exists():
                print(f"  ⚠️  {period} PDF 파일을 찾을 수 없습니다: {pdf_path}")
                continue

            try:
                with pdfplumber.open(pdf_path) as pdf:
                    # 첫 몇 페이지에서 문제 목록 추출
                    text = ""
                    for page_num in range(min(3, len(pdf.pages))):
                        text += pdf.pages[page_num].extract_text()

                    questions = self._parse_questions(text, period)
                    self.questions[period] = questions
                    print(f"  ✓ {period}: {len(questions)}문제 추출")

            except Exception as e:
                print(f"  ✗ {period} PDF 처리 오류: {e}")

    def _parse_questions(self, text, period):
        """텍스트에서 문제 목록 파싱 (수동 입력 필요시 여기서 처리)"""
        # 기본 패턴으로 문제 추출 시도
        questions = []

        # 문제 번호 패턴: "1.", "2.", "문1.", "문2." 등
        lines = text.split('\n')
        current_question = None

        for line in lines:
            # 문제 번호 패턴 감지
            match = re.match(r'^(?:문제?\s*)?(\d+)\s*[.)\]](.+)', line.strip())
            if match:
                num = match.group(1)
                title = match.group(2).strip()

                if current_question:
                    questions.append(current_question)

                current_question = {
                    "번호": num,
                    "제목": title,
                    "키워드": []
                }
            elif current_question and line.strip():
                # 문제 제목이 여러 줄인 경우
                current_question["제목"] += " " + line.strip()

        if current_question:
            questions.append(current_question)

        # 키워드 자동 추출
        for q in questions:
            q["키워드"] = self._extract_keywords(q["제목"])

        return questions

    def _extract_keywords(self, title):
        """제목에서 키워드 자동 추출"""
        keywords = []

        # 주요 키워드 패턴
        keyword_patterns = [
            r'AI|인공지능|머신러닝|딥러닝|GNN|Transformer|MoE',
            r'네트워크|프로토콜|라우팅|IGP|EGP|MODBUS',
            r'보안|암호|포렌식|악성코드|백도어',
            r'데이터베이스|DB|DBMS|트랜잭션|벡터',
            r'알고리즘|자료구조|트리',
            r'캐시|메모리|스케줄링|운영체제',
            r'테스트|UML|다이어그램|설계',
            r'클라우드|쿠버네티스|컨테이너'
        ]

        for pattern in keyword_patterns:
            matches = re.findall(pattern, title, re.IGNORECASE)
            keywords.extend(matches)

        return list(set(keywords)) if keywords else ["기타"]

    def categorize_question(self, question_dict):
        """문제를 출제기준 카테고리에 매칭"""
        question_keywords = question_dict.get("키워드", [])
        question_title = question_dict.get("제목", "")

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

    def analyze(self):
        """전체 분석 수행"""
        self.extract_questions_from_pdf()

        category_count = {cat: 0 for cat in SYLLABUS_STRUCTURE.keys()}
        category_count["미분류"] = 0
        category_questions = {cat: [] for cat in SYLLABUS_STRUCTURE.keys()}
        category_questions["미분류"] = []

        for period, questions in self.questions.items():
            for question in questions:
                categories, matched_keywords = self.categorize_question(question)

                question["categories"] = categories
                question["matched_keywords"] = matched_keywords

                for cat in categories:
                    category_count[cat] += 1
                    category_questions[cat].append(f"{period} {question['번호']}. {question['제목']}")

        total_questions = sum(category_count.values())

        self.analysis_result = {
            "exam_number": self.exam_number,
            "analyzed_at": datetime.now().isoformat(),
            "questions": self.questions,
            "statistics": {
                "category_count": category_count,
                "category_questions": category_questions,
                "total_questions": total_questions
            }
        }

        return self.analysis_result

    def save_results(self):
        """분석 결과 저장"""
        # JSON 저장
        output_path = DATA_DIR / "exam_results" / f"{self.exam_number}회_분석결과.json"
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(self.analysis_result, f, ensure_ascii=False, indent=2)

        print(f"\n✓ 분석 결과 저장: {output_path}")

    def print_summary(self):
        """분석 결과 요약 출력"""
        stats = self.analysis_result["statistics"]
        total = stats["total_questions"]

        print(f"\n{'='*80}")
        print(f"{self.exam_number}회 분석 결과 요약")
        print(f"{'='*80}")
        print(f"총 문제 수: {total}개\n")

        for category in SYLLABUS_STRUCTURE.keys():
            count = stats["category_count"][category]
            percentage = (count / total * 100) if total > 0 else 0
            bar = "■" * int(percentage / 5)
            print(f"{category:<40} {count:>3}개 {percentage:>6.1f}% {bar}")

        if stats["category_count"]["미분류"] > 0:
            count = stats["category_count"]["미분류"]
            percentage = (count / total * 100)
            bar = "□" * int(percentage / 5)
            print(f"{'미분류':<40} {count:>3}개 {percentage:>6.1f}% {bar}")


def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        print("사용법: python exam_analyzer.py <회차번호> [회차번호...]")
        print("예시: python exam_analyzer.py 137")
        print("예시: python exam_analyzer.py 136 137")
        sys.exit(1)

    exam_numbers = sys.argv[1:]

    for exam_num in exam_numbers:
        analyzer = ExamAnalyzer(exam_num)
        analyzer.analyze()
        analyzer.print_summary()
        analyzer.save_results()


if __name__ == "__main__":
    main()
