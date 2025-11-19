#!/usr/bin/env python3
"""
136회 기출문제 목록 추출
"""
import pdfplumber
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
EXAM_DIR = PROJECT_ROOT / "kpc" / "10. 기출풀이" / "제136회 기출문제 해설집"

periods = ["1교시", "2교시", "3교시", "4교시"]

for period in periods:
    pdf_path = EXAM_DIR / f"136회_기출풀이_정보관리 {period}.pdf"

    print(f"\n{'='*80}")
    print(f"{period}")
    print(f"{'='*80}")

    with pdfplumber.open(pdf_path) as pdf:
        # 첫 3페이지에서 문제 목록 추출
        text = ""
        for page_num in range(min(3, len(pdf.pages))):
            text += pdf.pages[page_num].extract_text()

        print(text[:2000])  # 처음 2000자만 출력
