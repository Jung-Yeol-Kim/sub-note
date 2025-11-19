#!/usr/bin/env python3
"""
정보관리기술사 기출문제 분석 리포트 생성기
여러 회차의 분석 결과를 기반으로 상세 리포트를 생성합니다.

사용법:
    python report_generator.py 137  # 137회 리포트 생성
    python report_generator.py 136 137  # 136회, 137회 통합 리포트
"""

import sys
import json
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "exam_results"
REPORTS_DIR = PROJECT_ROOT / "reports"


class ReportGenerator:
    """리포트 생성 클래스"""

    def __init__(self, exam_numbers):
        self.exam_numbers = sorted([int(n) for n in exam_numbers], reverse=True)
        self.analysis_data = {}
        self.syllabus_categories = [
            "1. 정보 전략 및 관리",
            "2. 소프트웨어 공학",
            "3. 자료처리",
            "4. 컴퓨터 시스템 및 정보통신",
            "5. 정보보안",
            "6. 최신기술, 법규 및 정책"
        ]

    def load_analysis_data(self):
        """분석 데이터 로드"""
        for exam_num in self.exam_numbers:
            data_path = DATA_DIR / f"{exam_num}회_분석결과.json"

            if not data_path.exists():
                print(f"⚠️  {exam_num}회 분석 결과를 찾을 수 없습니다: {data_path}")
                continue

            with open(data_path, "r", encoding="utf-8") as f:
                self.analysis_data[exam_num] = json.load(f)

            print(f"✓ {exam_num}회 분석 데이터 로드 완료")

    def generate_single_report(self, exam_num):
        """단일 회차 리포트 생성"""
        if exam_num not in self.analysis_data:
            print(f"⚠️  {exam_num}회 데이터가 없습니다.")
            return

        data = self.analysis_data[exam_num]
        stats = data["statistics"]

        report = f"""# {exam_num}회 정보관리기술사 출제기준 분석 리포트

**분석일자**: {datetime.now().strftime('%Y-%m-%d')}
**시험회차**: {exam_num}회
**총 문제 수**: {stats['total_questions']}개

---

## 📊 주요항목별 출제 빈도

| 주요항목 | 문제수 | 비율 | 출제율 |
|---------|--------|------|--------|
"""

        total = stats['total_questions']
        for category in self.syllabus_categories:
            count = stats['category_count'].get(category, 0)
            percentage = (count / total * 100) if total > 0 else 0
            bar = "■" * int(percentage / 5)
            report += f"| {category} | {count}문제 | {percentage:.1f}% | {bar} |\n"

        report += "\n---\n\n## 📝 카테고리별 출제 문제 상세\n\n"

        for category in self.syllabus_categories:
            count = stats['category_count'].get(category, 0)
            if count > 0:
                report += f"### {category} ({count}문제)\n\n"
                questions = stats['category_questions'].get(category, [])
                for q in questions:
                    report += f"- {q}\n"
                report += "\n"

        return report

    def generate_comparison_report(self):
        """여러 회차 비교 리포트 생성"""
        report = f"""# 정보관리기술사 기출문제 출제 경향 분석

**분석 대상**: {', '.join([f'{n}회' for n in self.exam_numbers])}
**분석일자**: {datetime.now().strftime('%Y-%m-%d')}
**분석 회차 수**: {len(self.exam_numbers)}회

---

## 📈 회차별 출제 빈도 비교

"""

        # 회차별 카테고리 통계
        report += "| 주요항목 |"
        for exam_num in self.exam_numbers:
            report += f" {exam_num}회 |"
        report += " 평균 |\n"

        report += "|" + "-" * 40 + "|"
        for _ in self.exam_numbers:
            report += "---------|"
        report += "---------|\n"

        for category in self.syllabus_categories:
            report += f"| {category} |"
            counts = []

            for exam_num in self.exam_numbers:
                if exam_num in self.analysis_data:
                    count = self.analysis_data[exam_num]["statistics"]["category_count"].get(category, 0)
                    total = self.analysis_data[exam_num]["statistics"]["total_questions"]
                    percentage = (count / total * 100) if total > 0 else 0
                    report += f" {count}({percentage:.0f}%) |"
                    counts.append(count)
                else:
                    report += " N/A |"

            avg = sum(counts) / len(counts) if counts else 0
            report += f" {avg:.1f} |\n"

        report += "\n---\n\n## 💡 출제 경향 분석\n\n"

        # 경향 분석
        report += self._analyze_trends()

        report += "\n---\n\n## 🎯 향후 대비 전략\n\n"
        report += self._generate_strategy()

        return report

    def _analyze_trends(self):
        """출제 경향 분석"""
        trends = "### 주요 발견사항\n\n"

        # 가장 많이 출제된 카테고리 찾기
        category_totals = {cat: 0 for cat in self.syllabus_categories}

        for exam_num in self.exam_numbers:
            if exam_num in self.analysis_data:
                stats = self.analysis_data[exam_num]["statistics"]
                for cat in self.syllabus_categories:
                    category_totals[cat] += stats["category_count"].get(cat, 0)

        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)

        trends += f"1. **최다 출제 영역**: {sorted_categories[0][0]} ({sorted_categories[0][1]}문제)\n"
        trends += f"2. **최소 출제 영역**: {sorted_categories[-1][0]} ({sorted_categories[-1][1]}문제)\n\n"

        # 최신 회차의 특징
        if self.exam_numbers and self.exam_numbers[0] in self.analysis_data:
            latest = self.exam_numbers[0]
            latest_stats = self.analysis_data[latest]["statistics"]

            trends += f"### {latest}회 특징\n\n"

            max_cat = max(latest_stats["category_count"].items(), key=lambda x: x[1] if x[0] != "미분류" else 0)
            trends += f"- 최다 출제 영역: {max_cat[0]} ({max_cat[1]}문제)\n"

            # AI 관련 문제 카운트
            ai_count = 0
            for period, questions in self.analysis_data[latest]["questions"].items():
                for q in questions:
                    if any(keyword in q["제목"].lower() for keyword in ["ai", "인공지능", "gnn", "transformer"]):
                        ai_count += 1

            if ai_count > 0:
                trends += f"- AI 관련 문제: {ai_count}문제\n"

        return trends

    def _generate_strategy(self):
        """대비 전략 생성"""
        strategy = ""

        # 출제 빈도가 낮은 영역 찾기
        category_totals = {cat: 0 for cat in self.syllabus_categories}

        for exam_num in self.exam_numbers:
            if exam_num in self.analysis_data:
                stats = self.analysis_data[exam_num]["statistics"]
                for cat in self.syllabus_categories:
                    category_totals[cat] += stats["category_count"].get(cat, 0)

        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1])

        strategy += "### 단기 전략\n\n"
        strategy += f"1. **과소 출제 영역 보완**: {sorted_categories[0][0]}, {sorted_categories[1][0]}\n"
        strategy += "2. **최신 기술 트렌드 학습**: AI, 클라우드, 보안 분야\n"
        strategy += "3. **실무 사례 준비**: 이론 + 실무 결합 답안 작성 연습\n\n"

        strategy += "### 중장기 전략\n\n"
        strategy += "1. **6개 주요항목 균형있게 학습**\n"
        strategy += "2. **최신 정책 및 가이드라인 지속 모니터링**\n"
        strategy += "3. **과거 기출문제 패턴 분석 및 예상 문제 도출**\n"

        return strategy

    def save_report(self, content, filename):
        """리포트 저장"""
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        output_path = REPORTS_DIR / filename

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"✓ 리포트 저장: {output_path}")
        return output_path

    def generate(self):
        """리포트 생성 메인 함수"""
        self.load_analysis_data()

        if len(self.exam_numbers) == 1:
            # 단일 회차 리포트
            exam_num = self.exam_numbers[0]
            report = self.generate_single_report(exam_num)
            if report:
                self.save_report(report, f"{exam_num}회_분석_리포트.md")
        else:
            # 비교 리포트
            report = self.generate_comparison_report()
            filename = f"{self.exam_numbers[-1]}-{self.exam_numbers[0]}회_비교_분석.md"
            self.save_report(report, filename)


def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        print("사용법: python report_generator.py <회차번호> [회차번호...]")
        print("예시: python report_generator.py 137")
        print("예시: python report_generator.py 135 136 137")
        sys.exit(1)

    exam_numbers = sys.argv[1:]
    generator = ReportGenerator(exam_numbers)
    generator.generate()


if __name__ == "__main__":
    main()
