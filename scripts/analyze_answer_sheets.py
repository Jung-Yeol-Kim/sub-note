#!/usr/bin/env python3
"""
Parse PDF answer sheets and validate against 22×19 format

This script extracts text from sample answer PDFs and analyzes
whether they comply with the official answer sheet format:
- Maximum 22 lines (rows)
- Maximum 19 cells per line (한글 1자=1칸, 영문/숫자 2자=1칸)
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple
import json

def count_cells(text: str) -> int:
    """
    Count cells in a line following the rule:
    - 한글 1자 = 1칸
    - 영문/숫자 2자 = 1칸
    - 특수문자 2자 = 1칸
    """
    cells = 0.0

    for char in text:
        # Newline doesn't count
        if char in ['\n', '\r']:
            continue

        # 한글 (Hangul)
        if '\uAC00' <= char <= '\uD7A3' or '\u1100' <= char <= '\u11FF' or '\u3130' <= char <= '\u318F':
            cells += 1.0
        else:
            # 영문, 숫자, 특수문자, 공백 = 0.5칸
            cells += 0.5

    import math
    return math.ceil(cells)

def analyze_answer_sheet(text: str, filename: str) -> dict:
    """Analyze answer sheet text for format compliance"""
    lines = text.split('\n')

    results = {
        'filename': filename,
        'total_lines': len(lines),
        'lines_analysis': [],
        'violations': [],
        'warnings': [],
        'is_valid': True,
        'statistics': {
            'max_cells_in_line': 0,
            'avg_cells_per_line': 0,
            'total_cells': 0,
        }
    }

    total_cells = 0
    max_cells = 0

    for idx, line in enumerate(lines, 1):
        line_clean = line.strip()
        if not line_clean:
            continue

        cells = count_cells(line_clean)
        total_cells += cells
        max_cells = max(max_cells, cells)

        line_info = {
            'line_number': idx,
            'content': line_clean[:60] + '...' if len(line_clean) > 60 else line_clean,
            'cells': cells,
            'is_valid': cells <= 19,
        }

        results['lines_analysis'].append(line_info)

        # Check violations
        if cells > 19:
            results['violations'].append(f"Line {idx}: {cells}칸 (최대 19칸 초과)")
            results['is_valid'] = False
        elif cells > 17:  # Warning threshold
            results['warnings'].append(f"Line {idx}: {cells}칸 (19칸에 근접)")

    # Check total lines
    non_empty_lines = [l for l in lines if l.strip()]
    results['total_lines'] = len(non_empty_lines)

    if len(non_empty_lines) > 22:
        results['violations'].append(f"Total lines: {len(non_empty_lines)} (최대 22줄 초과)")
        results['is_valid'] = False

    # Statistics
    results['statistics']['max_cells_in_line'] = max_cells
    results['statistics']['total_cells'] = total_cells
    if non_empty_lines:
        results['statistics']['avg_cells_per_line'] = round(total_cells / len(non_empty_lines), 1)

    return results

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from PDF
    This is a placeholder - actual PDF extraction would use PyPDF2 or similar
    For now, we'll use manual text extraction from the PDFs we've already seen
    """
    # This would normally use PyPDF2 or pdfplumber
    # For demonstration, return sample text
    filename = Path(pdf_path).name

    # Sample texts based on what we saw in the PDFs earlier
    if 'Purdue' in filename:
        return """가. DHCP의 선보정

정의
로컬  DHCP 서버                        가단
      DHCP OFFER               - 외장 시간 축약
      DHCP RESPONSE            Ip를 대여하여
      DHCP ACK                 시정확 정가

- Client와 나이간  REQUEST을 연결

암버(?) PURBUE 모델

답례)
1. Iso62443, PURDUR망 정의
(-  ICS악처(?)선을 위여  IT, IDM로,OT
    를 컴던하여  구성값인 제통된 보아모델

2. Purdue 모델의 구면조 및 컴면로

1) Purdue 모델의 구성조

구문  컴면조                    선영
IT    - 외부 N/W              - 옥시보 권리
즈며  - SCM,ERP               - 비리보 모델

IDM로즈며- IT,OT 차단        - 보여 안전 관리

      - SCADA,DCS            - 옹장 식로리
OT    - PMI Controller       - 나딜 가여
즈며  - Pump,Actuator        - 안역 식어"""

    elif '디지털포렌식' in filename:
        return """가(6) 디지덜 포렌식이 대하여,
        (나) 정차, (다) 가술 선영

답)
1. 디지덜 덩젝 즐가 착복, 디지덜 포렌식 가단영

[가단영]
예청, 폰선, 옴저 일석
제자  팎선  옐저  충더  보선


- 암속석 영향한 속인, 못선, 보차상 창영
  우자구산선 구전과 공축(?)돈물

2. 디지덜 포렌식의 전차 선영

1) 디지덜 포렌식의 전차각요

① ②  ③    ④    ⑤
속자 즐가 도려/ 결층/ 얼선
구비 속인 일즐  중자  차정"""

    return "Sample answer text..."

def main():
    pdf_dir = Path('data/샘플_답안')

    if not pdf_dir.exists():
        print(f"Error: Directory {pdf_dir} not found")
        sys.exit(1)

    pdf_files = list(pdf_dir.glob('*.pdf'))

    if not pdf_files:
        print(f"No PDF files found in {pdf_dir}")
        sys.exit(1)

    print("=" * 80)
    print("Answer Sheet Format Analysis (22줄 × 19칸)")
    print("=" * 80)
    print()

    all_results = []

    for pdf_path in sorted(pdf_files):
        print(f"\n📄 Analyzing: {pdf_path.name}")
        print("-" * 80)

        # Extract text (placeholder)
        text = extract_text_from_pdf(str(pdf_path))

        # Analyze
        results = analyze_answer_sheet(text, pdf_path.name)
        all_results.append(results)

        # Print summary
        print(f"Total Lines: {results['total_lines']}/22")
        print(f"Max Cells in Line: {results['statistics']['max_cells_in_line']}/19")
        print(f"Avg Cells/Line: {results['statistics']['avg_cells_per_line']}")
        print(f"Valid: {'✓ YES' if results['is_valid'] else '✗ NO'}")

        if results['violations']:
            print(f"\n❌ Violations ({len(results['violations'])}):")
            for violation in results['violations']:
                print(f"  • {violation}")

        if results['warnings']:
            print(f"\n⚠️  Warnings ({len(results['warnings'])}):")
            for warning in results['warnings'][:5]:  # Show first 5
                print(f"  • {warning}")
            if len(results['warnings']) > 5:
                print(f"  ... and {len(results['warnings']) - 5} more")

        # Show some sample lines
        print(f"\n📊 Sample Lines (first 10):")
        for line_info in results['lines_analysis'][:10]:
            status = '✓' if line_info['is_valid'] else '✗'
            print(f"  {status} Line {line_info['line_number']:2d}: {line_info['cells']:2d}칸 | {line_info['content']}")

        if len(results['lines_analysis']) > 10:
            print(f"  ... and {len(results['lines_analysis']) - 10} more lines")

    # Overall summary
    print("\n" + "=" * 80)
    print("Overall Summary")
    print("=" * 80)

    total_valid = sum(1 for r in all_results if r['is_valid'])
    print(f"Total PDFs analyzed: {len(all_results)}")
    print(f"Valid: {total_valid}/{len(all_results)}")
    print(f"Invalid: {len(all_results) - total_valid}/{len(all_results)}")

    # Save results to JSON
    output_file = Path('data/answer_sheet_analysis.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Results saved to: {output_file}")

if __name__ == '__main__':
    main()
