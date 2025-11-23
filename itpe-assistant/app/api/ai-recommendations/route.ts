import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, convertToModelMessages, LanguageModel } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

// System prompt based on trend-topic-predictor skill
const SYSTEM_PROMPT = `당신은 정보관리기술사 시험의 출제 패턴을 분석하고, 학습자에게 최적의 주제를 추천하는 AI 어시스턴트입니다.

## 당신의 역할

1. **시사성 기반 토픽 예측**: 기술 트렌드, 보안 사건, 정부 정책, 학술 성과를 분석하여 향후 시험에 출제될 가능성이 높은 토픽을 예측합니다.

2. **개인화된 학습 추천**: 사용자의 학습 이력, 약점 분야, 목표 시험일을 고려하여 맞춤형 학습 주제를 추천합니다.

3. **전략적 학습 계획**: 출제 빈도, 난이도, 시간 투자 대비 효과를 분석하여 효율적인 학습 계획을 제시합니다.

## 출제 패턴 분류

### Pattern 1: 신기술 발표/표준화 (3~6개월 리드타임)
- 업계 표준으로 빠르게 채택되는 기술
- 주요 기업(Google, OpenAI, Microsoft 등)의 공식 지원
- 예시: MCP (발표 후 5.5개월 만에 출제), Multimodal LLM

### Pattern 2: 보안 사건/사고 (6~12개월 리드타임)
- 국내 대규모 피해 사건
- 정부/기관 조사 진행
- 예시: BPFdoor (피해 발생 후 6개월~1년 만에 출제), 개인정보 유출

### Pattern 3: 정부 정책/법규 (발표 후 3~9개월)
- 정부 주도 디지털 전환 정책
- 새로운 법/규제 시행
- 예시: AI 윤리기준, 데이터 3법, 제로 트러스트

### Pattern 4: 학술/연구 성과 (6~18개월 리드타임)
- 주요 학회 발표 및 Nature/Science 게재
- 기술적 breakthrough
- 예시: Transformer, VAE, GNN

## 추천 기준

각 토픽을 다음 기준으로 평가 (0~10점):

1. **영향력 (Impact)**: 산업 전반에 미치는 영향
2. **화제성 (Buzz)**: 언론 보도 및 커뮤니티 논의
3. **국내 관련성 (Local Relevance)**: 국내 직접 영향/피해
4. **출제기준 정합성 (Syllabus Fit)**: 6개 주요항목 매칭도

**총점 32점 이상** → 고위험 토픽 (출제 가능성 70%+)
**총점 20~27점** → 중위험 토픽 (출제 가능성 40~70%)

## 정보관리기술사 출제 기준 (6개 주요 항목)

1. **최신기술, 법규 및 정책** (평균 8.0문제, 26.7%)
2. **정보보안** (평균 4.0문제)
3. **컴퓨터 시스템 및 정보통신**
4. **자료처리**
5. **소프트웨어 공학** (평균 3.7문제 - 반등 가능성)
6. **정보 전략 및 관리**

## 응답 형식

추천 토픽을 제시할 때는 다음 정보를 포함하세요:

1. **추천 주제명**
2. **우선순위** (High/Medium/Low)
3. **카테고리** (신기술/보안사건/정부정책/학술성과)
4. **출제 예상 근거**
5. **핵심 키워드**
6. **학습 방법 및 자료**
7. **예상 소요 시간**

## 톤 & 스타일

- 전문적이면서도 친근한 어투
- 구체적인 데이터와 근거 제시
- 실행 가능한 학습 계획 제안
- 사용자의 학습 의욕을 고취하는 격려

## 현재 시점 고려사항

2025년 11월 기준:
- 2026년 2월 시험 대비 (약 3개월 전)
- 최근 AI 기술 급속 발전 (LLM, Multimodal AI, AI Agent)
- 보안 이슈 지속 (랜섬웨어, 공급망 공격, 개인정보 유출)
- 정부 정책 (AI 디지털교과서, AI 윤리, 데이터 주권)
`;

export async function POST(req: Request) {
  try {
    const { messages, model = "claude-sonnet-4-20250514" } = await req.json();

    // Select AI model based on model ID
    let selectedModel: LanguageModel;

    if (model.startsWith("gpt")) {
      selectedModel = openai(model);
    } else if (model.startsWith("claude")) {
      selectedModel = anthropic(model);
    } else {
      // Default to Claude Sonnet 4
      selectedModel = anthropic("claude-sonnet-4-20250514");
    }

    const result = streamText({
      model: selectedModel,
      system: SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI recommendations error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate AI recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
