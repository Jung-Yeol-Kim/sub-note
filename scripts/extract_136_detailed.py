#!/usr/bin/env python3
"""
136회 기출문제 상세 추출
"""
import pdfplumber
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
EXAM_DIR = PROJECT_ROOT / "kpc" / "10. 기출풀이" / "제136회 기출문제 해설집"

periods = ["1교시", "2교시", "3교시", "4교시"]

for period in periods:
    pdf_path = EXAM_DIR / f"136회_기출풀이_정보관리 {period}.pdf"

    print(f"\n{'='*80}")
    print(f"{period}")
    print(f"{'='*80}\n")

    with pdfplumber.open(pdf_path) as pdf:
        # 첫 5페이지 전체 확인
        for page_num in range(min(5, len(pdf.pages))):
            text = pdf.pages[page_num].extract_text()

            # 문제 패턴 찾기
            # "1.", "2.", "문제" 등의 패턴 찾기
            lines = text.split('\n')
            for i, line in enumerate(lines):
                # 문제 번호나 "문 제" 키워드가 있는 라인 찾기
                if re.match(r'^\d+\.', line.strip()) or '문 제' in line or '※' in line:
                    # 앞뒤 3줄 출력
                    start = max(0, i-2)
                    end = min(len(lines), i+5)
                    for j in range(start, end):
                        print(lines[j])
                    print("---")
