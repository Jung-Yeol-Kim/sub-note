#!/usr/bin/env python3
"""
exam.txt 파일을 파싱하여 회차별 문제 데이터를 추출하는 스크립트
정보관리기술사 (관리) 종목만 추출
"""
import json
from collections import defaultdict
import re
from pathlib import Path

def parse_exam_txt(file_path):
    """exam.txt 파일을 파싱하여 회차별 데이터를 추출 (관리 종목만)"""
    exam_data = defaultdict(lambda: defaultdict(list))

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # TSV 형식: 회차 \t 종목 \t 교시 \t 문제
            parts = line.split('\t')
            if len(parts) < 4:
                continue

            exam_num_str = parts[0].strip()
            subject = parts[1].strip()
            period_num = parts[2].strip()
            question = parts[3].strip()

            # 숫자로만 구성된 회차만 처리
            if not exam_num_str.isdigit():
                continue

            # 관리 종목만 처리 (정보관리기술사)
            if subject != "관리":
                continue

            exam_num = exam_num_str
            period = f"{period_num}교시"

            # 문제 번호와 내용 분리
            match = re.match(r'^(\d+)\.?\s*(.+)$', question, re.DOTALL)
            if match:
                q_num = match.group(1)
                q_content = match.group(2).strip()
            else:
                # 문제 번호가 없는 경우
                q_num = str(len(exam_data[exam_num][period]) + 1)
                q_content = question

            # 키워드 추출
            keywords = extract_keywords(q_content)

            exam_data[exam_num][period].append({
                "번호": q_num,
                "제목": q_content,
                "키워드": keywords
            })

    return dict(exam_data)


def extract_keywords(question_text):
    """문제 텍스트에서 키워드를 추출"""
    keywords = []

    # 영문 약어 추출 (대문자 2자 이상)
    # 예: AOP, PMO, DBSCAN, IoT 등
    abbreviations = re.findall(r'\b[A-Z]{2,}[A-Z0-9]*\b', question_text)
    keywords.extend(abbreviations)

    # 괄호 안의 영문 표현 추출
    # 예: (Aspect Oriented Programming), (Access Control)
    parentheses = re.findall(r'\(([A-Z][A-Za-z\s]+(?:[A-Z][A-Za-z\s]*)*)\)', question_text)
    for p in parentheses:
        # 너무 긴 것은 제외
        if len(p) < 50:
            keywords.append(p.strip())

    # 중복 제거하되 순서 유지
    seen = set()
    unique_keywords = []
    for k in keywords:
        if k not in seen and len(k) > 1:
            seen.add(k)
            unique_keywords.append(k)

    return unique_keywords


def save_exam_data(exam_num, exam_dict):
    """특정 회차의 데이터를 JSON 파일로 저장"""
    project_root = Path(__file__).parent.parent
    data_dir = project_root / "data" / "exam_results"
    data_dir.mkdir(parents=True, exist_ok=True)

    output = {
        "exam_number": exam_num,
        "questions": exam_dict,
        "metadata": {
            "total_questions": sum(len(qs) for qs in exam_dict.values()),
            "periods": list(exam_dict.keys())
        }
    }

    output_path = data_dir / f"{exam_num}회_문제목록.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✓ {exam_num}회 데이터 저장: {output_path}")
    print(f"  - 총 {output['metadata']['total_questions']}문제")
    for period, questions in sorted(exam_dict.items()):
        print(f"  - {period}: {len(questions)}문제")


def main():
    """메인 함수"""
    project_root = Path(__file__).parent.parent
    exam_txt_path = project_root / "data" / "exam.txt"

    if not exam_txt_path.exists():
        print(f"⚠️  exam.txt 파일을 찾을 수 없습니다: {exam_txt_path}")
        return

    print(f"exam.txt 파싱 중: {exam_txt_path}")
    print()

    # 파싱
    exam_data = parse_exam_txt(exam_txt_path)

    print(f"발견된 회차: {sorted(exam_data.keys())}\n")

    # 각 회차별 저장
    for exam_num in sorted(exam_data.keys()):
        save_exam_data(exam_num, exam_data[exam_num])
        print()


if __name__ == "__main__":
    main()
