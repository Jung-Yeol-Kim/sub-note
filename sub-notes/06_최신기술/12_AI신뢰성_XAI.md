# AI 신뢰성 확보 기술 (XAI)

## 1. AI 신뢰성 기술 정의

AI 기본법 시행에 따라 고위험 AI 시스템의 설명 가능성(Explainability), 공정성(Fairness), 강건성(Robustness)을 보장하여 AI 결정에 대한 투명성과 책임성을 확보하는 기술. SHAP, LIME 등 XAI 기법, Fairness 메트릭, Adversarial Training으로 신뢰할 수 있는 AI 구현

## 2. AI 신뢰성 기술 설명

### 1) AI 신뢰성 3대 축 (그림)

```
                  ┌─────────────────┐
                  │   AI 신뢰성     │
                  │  (Trustworthy)  │
                  └────────┬────────┘
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │설명가능성  │  │  공정성   │  │  강건성   │
    │(XAI)      │  │(Fairness) │  │(Robustness│
    └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
          │              │              │
    ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
    │ SHAP      │  │Demographic│  │Adversarial│
    │ LIME      │  │Parity     │  │Training   │
    │ Attention │  │Equal Opp. │  │Certified  │
    │ Weights   │  │Calibration│  │Defense    │
    └───────────┘  └───────────┘  └───────────┘
         ↓              ↓              ↓
    "왜 승인?"      "편향 없나?"    "공격 방어"
```

- 간글: 설명가능성은 의사결정 근거 제시, 공정성은 차별 방지, 강건성은 악의적 입력 방어. 3축 모두 충족해야 고위험 AI(의료, 금융, 채용) 배포 가능

### 2) XAI (설명 가능 AI) 기법 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| **SHAP** | 개념 | Shapley Value 기반 특성 중요도 |
| | 수식 | φᵢ = Σ (v(S∪{i}) - v(S)) / (피처 조합 수) |
| | 장점 | 이론적 보장, 일관성, 지역/전역 설명 |
| | 단점 | 계산 비용 높음 (2ⁿ 조합) |
| **LIME** | 개념 | Local 선형 근사 모델 |
| | 동작 | 입력 주변 샘플링 → 선형 회귀 학습 |
| | 장점 | 모델 무관(Model-agnostic), 빠름 |
| | 단점 | 불안정성, 샘플링에 따라 결과 변동 |
| **Attention** | 개념 | Transformer 어텐션 가중치 시각화 |
| | 활용 | LLM 토큰 중요도, 이미지 히트맵 |
| | 장점 | 직관적, 실시간 |
| | 한계 | Attention ≠ 중요도 (연구 논쟁) |
| **CAM/Grad-CAM** | 개념 | CNN 활성화 맵 시각화 |
| | 활용 | 의료 영상 진단 근거 제시 |
| | 장점 | 클래스별 히트맵, 해상도 유지 |

- 간글: SHAP은 금융권 대출 심사 설명에 활용(특성별 기여도). LIME은 빠른 프로토타입. Attention은 LLM 답변 근거 제시. CAM은 X-ray 이상 부위 표시

### 3) Fairness (공정성) 메트릭 및 완화 기법 (표)

| 구분 | 세부 항목 | 설명 |
|------|-----------|------|
| **편향 유형** | 샘플링 편향 | 훈련 데이터에 특정 그룹 과다/과소 표현 |
| | 레이블 편향 | 과거 차별이 레이블에 반영 (채용 이력) |
| | 알고리즘 편향 | 최적화 과정에서 특정 그룹 성능 저하 |
| **Fairness 지표** | Demographic Parity | P(Ŷ=1|A=0) = P(Ŷ=1|A=1) |
| | Equal Opportunity | P(Ŷ=1|Y=1,A=0) = P(Ŷ=1|Y=1,A=1) |
| | Calibration | P(Y=1|Ŷ=p,A=a) = p (모든 그룹) |
| **완화 기법** | Pre-processing | 데이터 리샘플링, Reweighing |
| | In-processing | Fairness Constraint 추가 |
| | Post-processing | 임계값 조정, 재보정 |
| **도구** | Fairlearn | Microsoft, Fairness 메트릭 + 완화 |
| | AI Fairness 360 | IBM, 70+ 메트릭, 10+ 알고리즘 |
| | What-If Tool | Google, 시각적 분석 |

- 간글: Demographic Parity는 그룹 간 승인율 동일, Equal Opportunity는 자격자 중 승인율 동일. 금융권은 Equal Opportunity 선호(자격 없는 사람도 승인하면 리스크). Fairlearn으로 자동 완화

## 3. 실무 적용 및 고려사항

### 1) 적용 사례
- **금융권 신용평가**: SHAP으로 대출 거절 사유 설명 의무 (EU GDPR)
- **채용 AI**: Fairlearn으로 성별 편향 제거 (여성 합격률 +15%p)
- **의료 진단**: Grad-CAM으로 폐암 의심 부위 표시 (의사 신뢰도 90%)

### 2) AI 기본법 대응
- **고위험 AI 정의**: 의료, 금융, 채용, 법 집행
- **의무사항**: XAI 보고서, Fairness 평가, 정기 감사
- **벌칙**: 미준수 시 최대 매출 2% 과징금

### 3) 운영 과제
- **Trade-off**: 정확도 vs 공정성 (공정성 높이면 정확도 -2~5%)
- **계산 비용**: SHAP 실시간 어려움, 배치 처리 필요
- **법적 책임**: AI 오류 시 책임 소재 (개발사 vs 사용자)
