# 기출문제 분석 도구

정보관리기술사 기출문제를 분석하고 출제 경향을 파악하는 도구 모음입니다.

## 📋 스크립트 목록

### 1. exam_data_helper.py
기출문제 데이터를 JSON 형식으로 입력하는 헬퍼 스크립트

**사용법**:
```bash
python exam_data_helper.py
```

**기능**:
- 기출문제 목록을 구조화된 JSON 형식으로 저장
- 문제 번호, 제목, 키워드 자동 정리
- 새로운 회차 추가 시 스크립트를 편집하여 사용

**데이터 추가 방법**:
1. 스크립트 내 `EXAM_XXX_DATA` 딕셔너리 추가
2. 각 교시별 문제 번호, 제목, 키워드 입력
3. `save_exam_data(XXX, EXAM_XXX_DATA)` 호출 추가
4. 스크립트 실행

### 2. analyze.py
범용 기출문제 분석 스크립트 (통합 버전)

**사용법**:
```bash
# 단일 회차 상세 분석
python analyze.py 137

# 여러 회차 분석
python analyze.py 136 137

# 간략 출력 모드
python analyze.py 136 137 --quiet
```

**기능**:
- exam_data_helper.py로 입력한 데이터 기반 분석
- 출제기준 6개 주요항목과 자동 매칭
- 키워드 기반 정확한 카테고리 분류
- 출제 빈도 통계 생성
- 2가지 형식으로 결과 저장:
  - `{회차}회_출제기준_매칭결과_상세.json`: 상세 분석 결과
  - `{회차}회_분석결과.json`: 리포트 생성용 데이터

### 3. report_generator.py
분석 결과를 기반으로 마크다운 리포트 생성

**사용법**:
```bash
# 단일 회차 리포트
python report_generator.py 137

# 여러 회차 비교 리포트
python report_generator.py 136 137
```

**기능**:
- 회차별 출제 빈도 비교표 생성
- 출제 경향 분석 및 인사이트 제공
- 향후 대비 전략 제안
- 리포트를 `reports/` 폴더에 저장

## 🔄 워크플로우

### 새로운 회차 분석하기

1. **문제 데이터 입력**
   ```bash
   # exam_data_helper.py를 편집하여 새 회차 데이터 추가
   vi exam_data_helper.py  # EXAM_XXX_DATA 추가
   python exam_data_helper.py
   ```

2. **분석 실행**
   ```bash
   # 새로운 회차 분석
   python analyze.py 135

   # 또는 여러 회차 동시 분석
   python analyze.py 135 136 137
   ```

3. **리포트 생성**
   ```bash
   # 단일 회차 리포트
   python report_generator.py 135

   # 비교 리포트
   python report_generator.py 135 136 137
   ```

## 📊 출력 파일

### data/exam_results/
- `{회차}회_문제목록.json`: 원본 문제 데이터
- `{회차}회_출제기준_매칭결과_상세.json`: 상세 분석 결과
- `{회차}회_분석결과.json`: 리포트 생성용 데이터

### reports/
- `{회차}회_분석_리포트.md`: 단일 회차 리포트
- `{시작회차}-{종료회차}회_비교_분석.md`: 여러 회차 비교 리포트

## 🎯 출제기준 카테고리

1. 정보 전략 및 관리
2. 소프트웨어 공학
3. 자료처리
4. 컴퓨터 시스템 및 정보통신
5. 정보보안
6. 최신기술, 법규 및 정책

각 문제는 키워드 매칭을 통해 위 6개 카테고리 중 하나로 분류됩니다.

## 💡 팁

- **정확도 향상**: `exam_data_helper.py`에서 키워드를 상세하게 입력할수록 매칭 정확도가 높아집니다
- **비교 분석**: 최소 3개 이상의 회차를 비교하면 출제 경향을 명확히 파악할 수 있습니다
- **리포트 활용**: 생성된 리포트의 "미출제 주요 세부항목" 섹션을 중점적으로 학습하세요
- **간략 모드**: 여러 회차를 일괄 처리할 때는 `--quiet` 옵션 사용

## 📝 예시

```bash
# 1단계: 135회 데이터 추가
vi exam_data_helper.py  # EXAM_135_DATA 추가
python exam_data_helper.py

# 2단계: 분석 실행
python analyze.py 135

# 3단계: 리포트 생성
python report_generator.py 135 136 137

# 결과: reports/135-137회_비교_분석.md 생성
```
