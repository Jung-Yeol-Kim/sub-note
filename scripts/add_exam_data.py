#!/usr/bin/env python3
"""
exam.txt에서 파싱한 데이터를 exam_data_helper.py 형식으로 변환하여 추가
"""
import json
import re

# 파싱된 데이터 읽기
with open('/Users/jyk/projects/sub-note/data/exam_results/parsed_exam_data.json', 'r', encoding='utf-8') as f:
    exam_data = json.load(f)

def format_question_data(exam_num, subjects_data):
    """exam_data_helper.py 형식으로 변환"""
    output = []
    output.append(f"\n# {exam_num}회 정보관리기술사 기출문제 데이터")
    output.append(f"EXAM_{exam_num}_DATA = {{")

    # 과목-교시별로 그룹화
    grouped = {}
    for subject, questions in subjects_data.items():
        for q in questions:
            period = q['교시']
            key = f"{subject}-{period}교시"
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(q)

    # 정렬된 키로 출력
    for key in sorted(grouped.keys()):
        questions = grouped[key]
        output.append(f'    "{key}": [')
        for q in questions:
            # 제목 정리 (따옴표 이스케이프)
            title = q['제목'].replace('"', '\\"').replace('\n', ' ')
            # 키워드 정리
            keywords = ', '.join(q['키워드']) if q['키워드'] else ""
            output.append(f'        {{"번호": "{q["문제번호"]}", "제목": "{title}", "키워드": "{keywords}"}},')
        output.append(f'    ],')

    output.append(f"}}")
    output.append(f"\n")

    return '\n'.join(output)

# 129-134회 데이터만 추출하여 출력
print("=" * 80)
print("아래 코드를 exam_data_helper.py의 EXAM_135_DATA 앞에 추가하세요:")
print("=" * 80)

for exam_num in range(129, 135):
    if str(exam_num) in exam_data:
        code = format_question_data(exam_num, exam_data[str(exam_num)])
        print(code)

print("\n" + "=" * 80)
print("아래 코드를 save_exam_data 호출 부분에 추가하세요:")
print("=" * 80)
for exam_num in range(129, 135):
    if str(exam_num) in exam_data:
        print(f"save_exam_data({exam_num}, EXAM_{exam_num}_DATA)")
