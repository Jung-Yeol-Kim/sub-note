#!/usr/bin/env python3
"""
136회 전체 문제 추출
"""
import pdfplumber
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
EXAM_DIR = PROJECT_ROOT / "kpc" / "10. 기출풀이" / "제136회 기출문제 해설집"

def extract_question_title(text_block):
    """문제 제목 추출"""
    lines = text_block.split('\n')
    for line in lines:
        if '문 제' in line:
            # 다음 줄에서 문제 제목 찾기
            idx = lines.index(line)
            if idx + 1 < len(lines):
                title_line = lines[idx + 1].strip()
                # 번호 패턴 제거
                title = re.sub(r'^\d+\.\s*', '', title_line)
                return title
    return None

periods = {
    "1교시": [],
    "2교시": [],
    "3교시": [],
    "4교시": []
}

for period in periods.keys():
    pdf_path = EXAM_DIR / f"136회_기출풀이_정보관리 {period}.pdf"

    with pdfplumber.open(pdf_path) as pdf:
        question_num = 0

        # 모든 페이지 확인
        for page_num in range(len(pdf.pages)):
            text = pdf.pages[page_num].extract_text()

            # "문 제" 패턴 찾기
            if '문 제' in text:
                # 문제 제목 추출
                lines = text.split('\n')
                for i, line in enumerate(lines):
                    if '문 제' in line:
                        # 다음 2-3줄 확인
                        question_title = ""
                        for j in range(1, 5):
                            if i + j < len(lines):
                                next_line = lines[i + j].strip()
                                # 문제 제목 패턴 확인
                                if next_line and not next_line.startswith('출') and not next_line.startswith('가.') and not next_line.startswith('나.'):
                                    if re.match(r'^\d+\.', next_line) or (len(next_line) > 10 and not next_line.startswith('Copyright')):
                                        question_title = next_line
                                        break

                        if question_title:
                            question_num += 1
                            # 번호 제거
                            title = re.sub(r'^\d+\.\s*', '', question_title)
                            if title and len(title) > 5:  # 최소 길이 체크
                                periods[period].append({
                                    "번호": str(question_num),
                                    "제목": title
                                })

print("="*80)
print("136회 기출문제 목록")
print("="*80)

for period, questions in periods.items():
    print(f"\n{period} ({len(questions)}문제):")
    for q in questions:
        print(f"  {q['번호']}. {q['제목']}")
