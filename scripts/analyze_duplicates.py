#!/usr/bin/env python3
"""
129~137회 중복 문제 분석 스크립트
"""

import json
import os
from collections import defaultdict
import re

def clean_question_title(title):
    """문제 제목에서 번호 등을 제거하고 핵심 키워드만 추출"""
    # 맨 앞의 번호 제거 (예: "1. ", "가. " 등)
    title = re.sub(r'^[\d가-힣]+\.\s*', '', title)
    # 따옴표 제거
    title = title.replace('"', '').replace("'", '').strip()
    return title

def extract_keywords_from_title(title):
    """제목에서 핵심 키워드 추출 (괄호 안 영문 포함)"""
    keywords = set()

    # 영문 약어 추출 (괄호 안)
    acronyms = re.findall(r'\(([A-Z][A-Za-z0-9\s,/&]+)\)', title)
    keywords.update(acronyms)

    # 한글 핵심 키워드 (3글자 이상)
    korean_words = re.findall(r'[가-힣]{3,}', title)
    keywords.update(korean_words)

    return keywords

def main():
    # 모든 회차의 문제 수집
    all_questions = []
    question_by_title = defaultdict(list)
    keyword_frequency = defaultdict(lambda: defaultdict(list))  # keyword -> {session: [questions]}

    exam_sessions = range(129, 138)

    for session in exam_sessions:
        file_path = f'/Users/jyk/projects/sub-note/data/exam_results/{session}회_분석결과.json'
        if not os.path.exists(file_path):
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 각 교시별 문제 처리
        questions_data = data.get('questions', {})
        for session_name, questions in questions_data.items():
            for q in questions:
                title = q.get('제목', '').strip()
                number = q.get('번호', '')

                if not title:
                    continue

                full_id = f"{session}회 {session_name} {number}"
                cleaned_title = clean_question_title(title)

                all_questions.append({
                    'session': session,
                    'session_name': session_name,
                    'number': number,
                    'full_id': full_id,
                    'title': title,
                    'cleaned_title': cleaned_title
                })

                # 완전 일치 중복 체크
                question_by_title[cleaned_title].append(full_id)

                # 키워드 기반 유사도 체크
                keywords = extract_keywords_from_title(title)
                for kw in keywords:
                    keyword_frequency[kw][session].append({
                        'full_id': full_id,
                        'title': title
                    })

    print('=' * 100)
    print(f'📊 129~137회 정보관리기술사 중복 문제 분석')
    print('=' * 100)
    print(f'\n총 분석 문제 수: {len(all_questions)}개 (9개 회차 × 31문제 = 279개)\n')

    # 1. 완전 중복 문제
    exact_duplicates = {title: ids for title, ids in question_by_title.items() if len(ids) > 1}
    print(f'\n🔁 1. 완전 중복 문제 (제목이 동일한 경우): {len(exact_duplicates)}개')
    print('-' * 100)

    if exact_duplicates:
        for title, ids in sorted(exact_duplicates.items(), key=lambda x: len(x[1]), reverse=True):
            print(f'\n• 출제 횟수: {len(ids)}회')
            print(f'  제목: {title[:80]}...' if len(title) > 80 else f'  제목: {title}')
            print(f'  출제 회차: {", ".join(ids)}')
    else:
        print('✅ 완전히 동일한 제목의 문제는 없습니다.')

    # 2. 키워드 기반 유사 문제 (2회 이상 출제)
    print(f'\n\n🔍 2. 키워드 기반 유사 주제 분석 (2회 이상 출제된 주제)')
    print('-' * 100)

    # 주요 키워드만 필터링 (3회 이상 출제된 것만)
    frequent_keywords = {kw: sessions for kw, sessions in keyword_frequency.items()
                        if len(sessions) >= 2 and len(kw) >= 3}

    # 출제 횟수 많은 순으로 정렬
    sorted_keywords = sorted(frequent_keywords.items(),
                            key=lambda x: sum(len(qs) for qs in x[1].values()),
                            reverse=True)

    print(f'\n총 {len(sorted_keywords)}개의 키워드가 2회 이상 출제됨\n')

    # 상위 30개만 출력
    for kw, sessions in sorted_keywords[:30]:
        total_count = sum(len(qs) for qs in sessions.values())
        session_list = sorted(sessions.keys())

        print(f'\n📌 "{kw}" - 총 {total_count}회 출제 ({len(session_list)}개 회차)')

        for sess in session_list:
            questions = sessions[sess]
            print(f'   • {sess}회 ({len(questions)}문제):')
            for q in questions[:2]:  # 각 회차당 최대 2문제만 표시
                title_short = q['title'][:70] + '...' if len(q['title']) > 70 else q['title']
                print(f'     - {q["full_id"]}: {title_short}')

    # 3. 통계 요약
    print('\n\n' + '=' * 100)
    print('📈 3. 중복 출제 패턴 요약')
    print('=' * 100)

    print(f'\n• 완전 중복 문제: {len(exact_duplicates)}개')
    print(f'• 2회 이상 출제된 키워드: {len(frequent_keywords)}개')
    print(f'• 고유 주제 (1회만 출제): 약 {len(all_questions) - len(exact_duplicates)}개')

    # 가장 자주 출제된 키워드 TOP 10
    print('\n\n🏆 가장 자주 출제된 주제 TOP 10:')
    print('-' * 100)

    top_10 = sorted_keywords[:10]
    for i, (kw, sessions) in enumerate(top_10, 1):
        total_count = sum(len(qs) for qs in sessions.values())
        session_nums = sorted(sessions.keys())
        print(f'{i:2d}. {kw:30s} - {total_count}회 출제 (회차: {", ".join(map(str, session_nums))})')

    # 4. 결론 및 학습 전략
    print('\n\n' + '=' * 100)
    print('💡 4. 결론 및 학습 전략 제언')
    print('=' * 100)

    repetition_rate = (len(exact_duplicates) / len(all_questions)) * 100

    print(f'\n• 완전 중복률: {repetition_rate:.2f}%')

    if repetition_rate < 5:
        print('\n✅ 권장 전략: "최신 트렌드 중심 학습"')
        print('   - 완전 중복 문제가 거의 없으므로, 과거 기출을 그대로 암기하는 것은 비효율적')
        print('   - 대신 키워드 중심으로 개념을 이해하고, 최신 트렌드를 반영한 학습 필요')
        print('   - 정부 가이드라인, 최신 기술 동향을 지속적으로 모니터링')
    else:
        print('\n⚠️  권장 전략: "기출 문제 중심 학습"')
        print('   - 중복 출제율이 높으므로 과거 기출 문제 숙지 필요')

    print(f'\n• 키워드 반복 출제율: 높음 ({len(frequent_keywords)}개 키워드)')
    print('   → 핵심 키워드(LLM, 제로트러스트, DevOps 등)는 다양한 각도로 반복 출제')
    print('   → 키워드별 다양한 관점(개념, 구성요소, 보안, 활용 등)을 준비해야 함')

if __name__ == '__main__':
    main()
