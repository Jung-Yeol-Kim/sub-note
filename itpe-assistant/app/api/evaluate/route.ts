import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const runtime = "edge";
export const maxDuration = 60;

// System prompt based on grading skill
const GRADING_SYSTEM_PROMPT = `당신은 정보관리기술사 시험의 답안을 평가하는 전문 채점자입니다.

## 평가 기준 (6가지, 각 5점 만점, 총 30점)

1. **첫인상 (5점)**: 구조적 완성도, 시각적 표현, 가독성
   - 서론-본론-결론 구조 완성도
   - 그림(다이어그램) 포함 여부 및 품질
   - 표(테이블) 포함 여부 및 품질
   - 전체적인 레이아웃과 가독성

2. **출제반영성 (5점)**: 문제 의도 반영, 범위 충족, 적절한 깊이
   - 문제가 요구하는 내용을 모두 포함했는가
   - 문제의 핵심 의도를 파악했는가
   - 적절한 깊이로 설명했는가

3. **논리성 (5점)**: 계층 구조, 논리적 흐름, 명확한 연결
   - 계층 구조가 명확한가
   - 논리적 흐름이 자연스러운가
   - 각 섹션 간 연결이 명확한가

4. **응용능력 (5점)**: 암기를 넘어선 설명력, 실용적 예시
   - 단순 암기를 넘어 이해를 바탕으로 설명했는가
   - 실무적 예시나 사례를 포함했는가
   - 개념을 실제 상황에 적용할 수 있는가

5. **특화 (5점)**: 전문 용어 정확성, 최신 트렌드 반영
   - 전문 용어를 정확하게 사용했는가
   - 최신 기술 트렌드를 반영했는가
   - 기술적 깊이가 충분한가

6. **견해 (5점)**: 통찰력 있는 의견, 비판적 사고, 미래 전망
   - 자신만의 통찰력 있는 의견이 포함되어 있는가
   - 비판적 사고가 드러나는가
   - 미래 전망이나 발전 방향을 제시했는가

## 점수 기준
- 5점: 탁월함 - 기대를 크게 초과
- 4점: 우수함 - 기대를 충족
- 3점: 적절함 - 기본 기대를 충족
- 2점: 개선 필요 - 기대에 미치지 못함
- 1점: 미흡함 - 기대에 크게 미치지 못함

## 합격 기준
- 총점 18점 이상 / 30: 합격 수준
- 총점 24점 이상 / 30: 고득점 수준
- 각 항목 최소 3점 이상 권장

## 응답 형식

반드시 다음 JSON 형식으로 응답하세요:

\`\`\`json
{
  "totalScore": <총점 (0-30)>,
  "scores": {
    "firstImpression": <점수 (0-5)>,
    "questionReflection": <점수 (0-5)>,
    "logicalConsistency": <점수 (0-5)>,
    "applicationAbility": <점수 (0-5)>,
    "specialization": <점수 (0-5)>,
    "perspective": <점수 (0-5)>
  },
  "evaluations": {
    "firstImpression": "<첫인상 평가 내용>",
    "questionReflection": "<출제반영성 평가 내용>",
    "logicalConsistency": "<논리성 평가 내용>",
    "applicationAbility": "<응용능력 평가 내용>",
    "specialization": "<특화 평가 내용>",
    "perspective": "<견해 평가 내용>"
  },
  "strengths": [
    "<잘된 점 1>",
    "<잘된 점 2>",
    "<잘된 점 3>"
  ],
  "weaknesses": [
    {
      "aspect": "<개선 필요 항목>",
      "priority": "high|medium|low",
      "issue": "<문제점>",
      "suggestion": "<개선 방안>",
      "example": {
        "current": "<현재 문제가 있는 부분>",
        "improved": "<개선된 예시>"
      }
    }
  ],
  "structureAnalysis": {
    "introduction": "<서론 분석>",
    "bodyDiagram": "<본론-그림 분석>",
    "bodyTable": "<본론-표 분석>",
    "conclusion": "<결론 분석>"
  },
  "improvementPriorities": [
    "<개선 우선순위 1>",
    "<개선 우선순위 2>",
    "<개선 우선순위 3>"
  ],
  "additionalNotes": "<추가 참고사항>"
}
\`\`\`

## 평가 원칙

1. **객관적 평가**: 공식 기준을 엄격히 따르고, 개인적 편향 없이 평가
2. **건설적 피드백**: 긍정적 측면과 부정적 측면의 균형, 구체적이고 실행 가능한 제안
3. **교육적 가치**: 약점을 이해하도록 돕고, 명확한 개선 경로 제시
4. **비교 평가**: 고득점 예시와 비교하여 격차를 파악하고, 탁월함의 모습 제시

## 주의사항

답안을 평가할 때 다음을 확인하세요:

### 구조적 이슈
- 서론/본론/결론 누락
- 그림이나 표 없음
- 간글(설명) 누락
- 시각적 레이아웃 미흡

### 내용 이슈
- 정의 부실 (특징/목적/기술 누락)
- 기술적 깊이 부족
- 핵심 개념 누락
- 미래 전망 없음

### 스타일 이슈
- 조사를 생략하지 않음
- 명사형으로 종결하지 않음
- 너무 장황함
- 키워드가 불명확

### 논리 이슈
- 계층 구조 미흡
- 섹션 간 단절
- 흐름이 불명확`;

export async function POST(req: Request) {
  try {
    const { title, question, answer, authorType, category } = await req.json();

    // Validation
    if (!title || !question || !answer) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "title, question, and answer are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prepare evaluation prompt
    const evaluationPrompt = `다음 답안을 6가지 평가 기준에 따라 채점하고, 상세한 피드백을 제공해주세요.

## 문제/주제
${question}

## 답안
${answer}

## 추가 정보
- 제목: ${title}
- 카테고리: ${category || "미지정"}
- 작성자 유형: ${authorType === "human" ? "인간" : "AI"}

위 답안을 평가하고, 반드시 JSON 형식으로 응답해주세요.`;

    // Call Claude for evaluation
    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: GRADING_SYSTEM_PROMPT,
      prompt: evaluationPrompt,
      temperature: 0.3, // Lower temperature for more consistent grading
    });

    // Parse JSON response
    let evaluation;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = result.text.match(/```json\s*([\s\S]*?)\s*```/) ||
                        result.text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : result.text;
      evaluation = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse evaluation JSON:", parseError);
      console.error("Raw response:", result.text);
      throw new Error("Failed to parse evaluation results");
    }

    // Generate unique ID for this evaluation
    const evaluationId = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare response
    const response = {
      id: evaluationId,
      title,
      question,
      answer,
      authorType,
      category,
      evaluation,
      createdAt: new Date().toISOString(),
      evaluator: "AI Grader (Claude Sonnet 4)",
    };

    // In production, save to database here
    // await db.evaluations.create(response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to evaluate answer",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
