#!/usr/bin/env python3
"""
129-134회 데이터를 exam_data_helper.py에 추가
"""
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "exam_results"

# 파싱된 데이터 로드
with open(DATA_DIR / 'parsed_exam_data.json', 'r', encoding='utf-8') as f:
    exam_data = json.load(f)

def convert_to_helper_format(exam_num):
    """exam_data_helper.py 형식으로 변환"""
    if str(exam_num) not in exam_data:
        print(f"⚠️  {exam_num}회 데이터를 찾을 수 없습니다.")
        return None

    data = exam_data[str(exam_num)]
    result = {}

    # 과목-교시별로 그룹화
    for subject, questions in data.items():
        for q in questions:
            period = q['교시'].replace('교시', '')  # "1" 형태로 변환
            key = period + "교시"

            if key not in result:
                result[key] = []

            # 키워드를 리스트로 변환
            keywords = []
            if q['키워드']:
                if isinstance(q['키워드'], list):
                    keywords = q['키워드']
                else:
                    keywords = [k.strip() for k in q['키워드'].split(',') if k.strip()]

            result[key].append({
                "번호": q['문제번호'],
                "제목": q['제목'],
                "키워드": keywords
            })

    return result

# exam_data_helper.py에 추가할 함수
def save_exam_data(exam_number, exam_data):
    """기출문제 데이터를 JSON으로 저장"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    output = {
        "exam_number": str(exam_number),
        "questions": exam_data,
        "metadata": {
            "total_questions": sum(len(questions) for questions in exam_data.values()),
            "periods": list(exam_data.keys())
        }
    }

    output_path = DATA_DIR / f"{exam_number}회_문제목록.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✓ {exam_number}회 문제 데이터 저장: {output_path}")
    print(f"  총 {output['metadata']['total_questions']}문제")

# 129-134회 데이터 저장
print("129-134회 문제 데이터 저장 중...\n")

for exam_num in range(129, 135):
    converted_data = convert_to_helper_format(exam_num)
    if converted_data:
        save_exam_data(exam_num, converted_data)
        print()

print("✅ 모든 데이터 저장 완료!")
