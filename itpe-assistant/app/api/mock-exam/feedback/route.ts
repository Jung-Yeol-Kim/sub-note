import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { AIFeedback, ExamQuestion } from "@/lib/types/mock-exam";

export const runtime = "edge";
export const maxDuration = 60;

// AI Mentor feedback system prompt
const MENTOR_FEEDBACK_PROMPT = `당신은 정보관리기술사 시험을 준비하는 수험생을 돕는 친절하고 전문적인 AI 멘토입니다.

## 평가 기준 (6가지, 각 5점 만점, 총 30점)

1. **정의 명확성 (5점)**: 개념 정의가 명확하고 정확한가?
   - 정의가 명확하고 간결한가
   - 핵심 특징을 포함하고 있는가
   - 배경과 목적이 설명되어 있는가

2. **키워드 포함도 (5점)**: 핵심 키워드를 충분히 포함하고 있는가?
   - 필수 키워드가 모두 포함되어 있는가
   - 키워드가 적절한 맥락에서 사용되었는가
   - 관련 개념과의 연결이 명확한가

3. **구조 체계성 (5점)**: 논리적 흐름과 구조가 체계적인가?
   - 서론-본론-결론 구조가 명확한가
   - 다이어그램과 표가 효과적으로 사용되었는가
   - 가독성이 좋은가

4. **기술적 깊이 (5점)**: 기술적 이해도와 설명의 깊이가 충분한가?
   - 기술적 원리를 정확히 설명했는가
   - 충분한 깊이로 다루었는가
   - 실무적 적용 예시가 있는가

5. **도표 품질 (5점)**: 다이어그램과 표가 효과적으로 활용되었는가?
   - 다이어그램이 명확하고 이해하기 쉬운가
   - 표가 체계적으로 구성되어 있는가
   - 시각적 요소가 내용을 효과적으로 보완하는가

6. **시험 형식 준수 (5점)**: 표준 답안 형식을 준수하였는가?
   - 조사를 생략하여 간결하게 작성했는가
   - 1-2페이지 분량을 준수했는가
   - 표준 형식(정의-설명-추가)을 따랐는가

## 응답 형식

반드시 다음 JSON 형식으로 응답하세요:

\`\`\`json
{
  "criteria": [
    {
      "name": "정의 명확성",
      "score": <0-5>,
      "maxScore": 5,
      "feedback": "<평가 내용>",
      "strengths": ["<잘된 점 1>", "<잘된 점 2>"],
      "improvements": ["<개선점 1>", "<개선점 2>"]
    },
    // ... 나머지 5개 기준
  ],
  "totalScore": <0-30>,
  "maxTotalScore": 30,
  "percentageScore": <0-100>,
  "overallFeedback": "<전체 평가>",
  "missingKeywords": ["<누락된 키워드 1>", "<누락된 키워드 2>"],
  "suggestedKeywords": ["<추가하면 좋을 키워드 1>", "<추가하면 좋을 키워드 2>"],
  "structuralIssues": ["<구조적 문제 1>", "<구조적 문제 2>"],
  "improvementPlan": [
    {
      "priority": "high|medium|low",
      "area": "<개선 영역>",
      "suggestion": "<구체적 제안>",
      "example": "<예시 (선택)>"
    }
  ],
  "estimatedExamScore": <0-100>,
  "mentoringMessage": "<격려 메시지>"
}
\`\`\`

## 피드백 원칙

1. **구체성**: 모호한 피드백이 아닌 구체적이고 실행 가능한 조언
2. **긍정과 개선의 균형**: 잘한 점을 먼저 언급하고, 개선점은 건설적으로
3. **격려와 동기부여**: 학습자가 포기하지 않도록 격려
4. **단계별 개선**: 모든 것을 한번에 고치려 하지 말고 우선순위 제시
5. **실전 대비**: 실제 시험에서 어떻게 평가될지 예측

## 키워드 분석

- 주어진 핵심 키워드 목록과 답안을 비교
- 누락된 필수 키워드 지적
- 추가하면 좋을 관련 키워드 제안
- 키워드가 적절한 맥락에서 사용되었는지 평가

## 구조 분석

- 정의 섹션의 충실도
- 설명 섹션의 다이어그램과 표 활용도
- 추가 고려사항의 유무와 질
- 전체적인 논리 흐름

## 점수 산정

- 각 기준당 0-5점 (총 30점 만점)
- 백분율 점수로 환산 (0-100점)
- 실제 시험 예상 점수 제시 (0-100점)

점수 기준:
- 5점: 탁월함 - 매우 우수하여 더 이상 개선할 여지가 거의 없음
- 4점: 우수함 - 전반적으로 좋으나 약간의 개선 여지 있음
- 3점: 적절함 - 기본적인 요구사항은 충족하나 개선 필요
- 2점: 미흡함 - 중요한 부분에서 부족함이 있음
- 1점: 매우 미흡함 - 대부분의 기준을 충족하지 못함
- 0점: 없음 - 해당 요소가 전혀 없음

## 격려 메시지

점수에 따라 적절한 격려 메시지를 제공하세요:
- 90점 이상: 매우 잘하고 있음을 강조, 합격 가능성 높음
- 80-89점: 좋은 수준, 조금만 더 노력하면 완벽
- 70-79점: 기본은 잘 되어있음, 특정 영역 집중 개선
- 60-69점: 개념은 이해했으나 표현력 향상 필요
- 50-59점: 기본 개념 재학습 필요, 반복 연습 강조
- 50점 미만: 포기하지 말고 기본부터 차근차근, 모범 답안 참고

항상 학습자가 발전할 수 있다는 믿음을 전달하고, 다음 단계를 명확히 제시하세요.`;

export async function POST(req: Request) {
  try {
    const {
      question,
      answer,
      sessionId,
    }: {
      question: ExamQuestion;
      answer: { content: string; timeSpent: number };
      sessionId: string;
    } = await req.json();

    // Validation
    if (!question || !answer || !answer.content) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "question and answer content are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prepare feedback prompt
    const feedbackPrompt = `다음 모의고사 답안을 평가하고 상세한 피드백을 제공해주세요.

## 문제
**제목**: ${question.title}
**설명**: ${question.description || "없음"}
**카테고리**: ${question.categoryName}${question.subCategoryName ? ` > ${question.subCategoryName}` : ""}
**난이도**: ${question.difficulty}/5
**제한 시간**: ${question.timeLimit}분

## 핵심 키워드 (필수 포함)
${question.keywords.map((k) => `- ${k}`).join("\n")}

## 작성 시간
${Math.floor(answer.timeSpent / 60)}분 ${answer.timeSpent % 60}초

## 답안
${answer.content}

---

위 답안을 6가지 평가 기준에 따라 채점하고, 학습자가 실력을 향상시킬 수 있도록 구체적이고 실행 가능한 피드백을 제공해주세요.
특히 다음 사항에 중점을 두어 평가해주세요:

1. 핵심 키워드가 모두 포함되었는가?
2. 정의-설명-추가 구조를 따랐는가?
3. 다이어그램과 표가 효과적으로 사용되었는가?
4. 조사를 생략하여 간결하게 작성했는가?
5. 실제 시험에서 몇 점을 받을 수 있을 것으로 예상되는가?

반드시 JSON 형식으로 응답해주세요.`;

    // Call Claude for AI mentor feedback
    const result = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: MENTOR_FEEDBACK_PROMPT,
      prompt: feedbackPrompt,
      temperature: 0.4,
      maxTokens: 4096,
    });

    // Parse JSON response
    let feedback: Omit<AIFeedback, "questionId">;
    try {
      const jsonMatch =
        result.text.match(/```json\s*([\s\S]*?)\s*```/) ||
        result.text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : result.text;
      feedback = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse feedback JSON:", parseError);
      console.error("Raw response:", result.text);
      throw new Error("Failed to parse feedback results");
    }

    // Add questionId to feedback
    const completeFeedback: AIFeedback = {
      questionId: question.id,
      ...feedback,
    };

    // Prepare response
    const response = {
      feedback: completeFeedback,
      sessionId,
      questionId: question.id,
      evaluatedAt: new Date().toISOString(),
      evaluator: "AI Mentor (Claude Sonnet 4)",
    };

    // In production, save to database here
    // await db.examFeedback.create(response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
