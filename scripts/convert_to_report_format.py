#!/usr/bin/env python3
"""
분석 결과를 리포트 생성기가 읽을 수 있는 형식으로 변환
"""

import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "exam_results"


def convert_analysis_result(exam_num):
    """분석 결과를 리포트 형식으로 변환"""
    input_path = DATA_DIR / f"{exam_num}회_출제기준_매칭결과_상세.json"
    output_path = DATA_DIR / f"{exam_num}회_분석결과.json"

    if not input_path.exists():
        print(f"⚠️  {input_path} 파일을 찾을 수 없습니다.")
        return False

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 문제 목록 재구성
    questions_dict = {}
    for period, questions in data["분석결과"].items():
        questions_dict[period] = [
            {
                "번호": q["번호"],
                "제목": q["제목"],
                "키워드": []  # 원본에 키워드가 없으므로 빈 리스트
            }
            for q in questions
        ]

    # 새로운 형식으로 변환
    output_data = {
        "exam_number": exam_num,
        "analysis_date": data["분석일자"],
        "questions": questions_dict,
        "statistics": {
            "total_questions": data["통계"]["총_문제수"],
            "category_count": data["통계"]["카테고리별_문제수"],
            "category_questions": data["통계"]["카테고리별_문제목록"]
        }
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✓ {exam_num}회 분석 결과 변환 완료: {output_path}")
    return True


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        for exam_num in sys.argv[1:]:
            convert_analysis_result(exam_num)
    else:
        # 기본적으로 136, 137회 변환
        convert_analysis_result("136")
        convert_analysis_result("137")
