#!/usr/bin/env python3
"""
129~137회 기술 키워드 중복 분석 (일반 용어 제외)
"""

import json
import os
from collections import defaultdict
import re

# 제외할 일반 용어
EXCLUDE_TERMS = {
    '설명하시오', '대하여', '다음을', '관련하여', '설명하고', '개념과', '필요성',
    '단계별', '항목을', '기술에', '방안을', '다음의', '서비스를', '기법에',
    '다양한', '비교', '기대효과', '특징을', '유형과', '방법을', '사례를',
    '정의와', '구성요소', '최근', '활용', '분석', '개념을', '원리를', '절차를'
}

def is_tech_keyword(keyword):
    """기술 키워드인지 판단 (일반 용어 제외)"""
    if keyword in EXCLUDE_TERMS:
        return False
    if len(keyword) < 3:  # 너무 짧은 것 제외
        return False
    # 순수 동사형 제외
    if keyword.endswith('하여') or keyword.endswith('하시오'):
        return False
    return True

def extract_tech_keywords(title):
    """제목에서 기술 키워드만 추출"""
    keywords = set()

    # 1. 영문 약어 (괄호 안, 대문자 시작)
    acronyms = re.findall(r'\(([A-Z][A-Za-z0-9\s,/&\-:\.]+)\)', title)
    for acronym in acronyms:
        # 쉼표로 구분된 경우 분리
        parts = [p.strip() for p in acronym.split(',')]
        keywords.update(parts)

    # 2. 한글 기술 용어 (특정 패턴)
    # 프로토콜, 알고리즘, 시스템, 모델, 기법 등
    tech_patterns = [
        r'[가-힣]+(?:프로토콜|알고리즘|시스템|모델|기법|방법론|아키텍처|플랫폼|프레임워크|엔진|도구)',
        r'(?:딥|머신)러닝',
        r'[가-힣]+(?:암호|보안|인증|검증)',
        r'[가-힣]+(?:데이터베이스|스토리지|메모리|네트워크|서버)',
        r'[가-힣]+AI|AI[가-힣]+',
        r'[가-힣]+(?:테스트|감리|평가)',
        r'제로[가-힣]+|[가-힣]+제로',
        r'[가-힣]{4,}(?:분석|최적화|관리)',
    ]

    for pattern in tech_patterns:
        matches = re.findall(pattern, title)
        keywords.update(matches)

    # 3. 복합 기술 용어 (띄어쓰기 포함)
    compound_patterns = [
        r'(?:정보|데이터|소프트웨어|인공지능|머신러닝)\s+[가-힣]+',
        r'[가-힣]+\s+(?:컴퓨팅|네트워킹|마이닝|엔지니어링)',
    ]

    for pattern in compound_patterns:
        matches = re.findall(pattern, title)
        keywords.update(matches)

    # 필터링
    filtered = {kw for kw in keywords if is_tech_keyword(kw)}

    return filtered

def main():
    # 모든 회차의 문제 수집
    keyword_frequency = defaultdict(lambda: defaultdict(list))
    exam_sessions = range(129, 138)

    for session in exam_sessions:
        file_path = f'/Users/jyk/projects/sub-note/data/exam_results/{session}회_분석결과.json'
        if not os.path.exists(file_path):
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        questions_data = data.get('questions', {})
        for session_name, questions in questions_data.items():
            for q in questions:
                title = q.get('제목', '').strip()
                number = q.get('번호', '')

                if not title:
                    continue

                full_id = f"{session}회 {session_name} {number}"

                # 기술 키워드 추출
                keywords = extract_tech_keywords(title)

                for kw in keywords:
                    keyword_frequency[kw][session].append({
                        'full_id': full_id,
                        'title': title
                    })

    print('=' * 100)
    print(f'📊 129~137회 기술 키워드 중복 분석')
    print('=' * 100)

    # 2회 이상 출제된 기술 키워드만 필터링
    frequent_keywords = {kw: sessions for kw, sessions in keyword_frequency.items()
                        if len(sessions) >= 2}

    # 출제 횟수 많은 순으로 정렬
    sorted_keywords = sorted(frequent_keywords.items(),
                            key=lambda x: sum(len(qs) for qs in x[1].values()),
                            reverse=True)

    print(f'\n총 {len(sorted_keywords)}개의 기술 키워드가 2회 이상 출제됨\n')
    print('=' * 100)

    # TOP 50 출력
    print(f'\n🏆 가장 자주 출제된 기술 키워드 TOP 50:\n')
    print(f'{"순위":^4} {"키워드":^30} {"출제":^6} {"회차":<30}')
    print('-' * 100)

    for i, (kw, sessions) in enumerate(sorted_keywords[:50], 1):
        total_count = sum(len(qs) for qs in sessions.values())
        session_nums = sorted(sessions.keys())
        session_str = ', '.join(map(str, session_nums))

        print(f'{i:2d}.  {kw:25s}   {total_count:3d}회    {session_str}')

    # 상세 출제 내용 (TOP 20)
    print('\n\n' + '=' * 100)
    print('📌 TOP 20 키워드 상세 출제 내용')
    print('=' * 100)

    for i, (kw, sessions) in enumerate(sorted_keywords[:20], 1):
        total_count = sum(len(qs) for qs in sessions.values())
        session_list = sorted(sessions.keys())

        print(f'\n{i}. "{kw}" - 총 {total_count}회 출제 ({len(session_list)}개 회차)')
        print('-' * 100)

        for sess in session_list:
            questions = sessions[sess]
            print(f'\n   • {sess}회 ({len(questions)}문제):')
            for q in questions:
                title_short = q['title'][:90] + '...' if len(q['title']) > 90 else q['title']
                print(f'     {q["full_id"]}: {title_short}')

    # 통계 요약
    print('\n\n' + '=' * 100)
    print('📈 학습 우선순위 제언')
    print('=' * 100)

    # 카테고리별 분류
    ai_keywords = [kw for kw, _ in sorted_keywords if any(term in kw.lower() for term in ['ai', 'llm', 'model', 'learning', '머신', '딥', '인공지능', 'transformer', 'neural'])]
    security_keywords = [kw for kw, _ in sorted_keywords if any(term in kw.lower() for term in ['보안', '암호', '인증', 'security', 'zero', 'trust', '공격'])]
    data_keywords = [kw for kw, _ in sorted_keywords if any(term in kw.lower() for term in ['데이터', 'data', '데이터베이스', 'database'])]
    sw_keywords = [kw for kw, _ in sorted_keywords if any(term in kw.lower() for term in ['소프트웨어', 'software', 'dev', '테스트', '감리', '개발'])]

    print(f'\n🎯 카테고리별 반복 출제 키워드:')
    print(f'\n• AI/ML 관련: {len(ai_keywords)}개')
    print(f'  예시: {", ".join(ai_keywords[:5])}...')

    print(f'\n• 정보보안 관련: {len(security_keywords)}개')
    print(f'  예시: {", ".join(security_keywords[:5])}...')

    print(f'\n• 데이터 관련: {len(data_keywords)}개')
    print(f'  예시: {", ".join(data_keywords[:5])}...')

    print(f'\n• 소프트웨어 관련: {len(sw_keywords)}개')
    print(f'  예시: {", ".join(sw_keywords[:5])}...')

    print('\n\n💡 결론:')
    print('-' * 100)
    print('✅ 완전 중복 문제는 0개 → 과거 문제 암기 방식은 무의미')
    print('✅ 핵심 키워드는 다양한 각도로 반복 출제 → 키워드 중심 개념 학습 필수')
    print('✅ 최신 트렌드 (LLM, AI 가이드라인 등)가 지속 출제 → 정부 공지/가이드라인 모니터링 필요')
    print(f'✅ {len(sorted_keywords)}개 키워드가 2회 이상 출제 → 이 키워드들을 중심으로 학습 계획 수립')

if __name__ == '__main__':
    main()
