import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer, topic, difficulty } = await request.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    // AI 평가 프롬프트
    const evaluationPrompt = `당신은 정보관리기술사 시험 채점 전문가입니다.
다음 답안을 6가지 기준으로 평가해주세요.

**문제**: ${question}
**주제**: ${topic || "일반"}
**난이도**: ${difficulty || "중급"}

**수험자 답안**:
${answer}

**평가 기준 (각 0-100점)**:
1. **완성도 (Completeness)**: 답안이 문제를 완전히 다루었는가?
2. **정확성 (Accuracy)**: 기술적 내용이 정확한가?
3. **구조 (Structure)**: 답안 구조가 체계적인가?
4. **명료성 (Clarity)**: 설명이 명확하고 이해하기 쉬운가?
5. **키워드 (Keywords)**: 핵심 키워드를 적절히 사용했는가?
6. **기술 깊이 (Technical Depth)**: 기술적 깊이가 충분한가?

**평가 결과를 다음 JSON 형식으로 반환하세요**:
{
  "score": 전체 평균 점수 (0-100),
  "completeness": 완성도 점수,
  "accuracy": 정확성 점수,
  "structure": 구조 점수,
  "clarity": 명료성 점수,
  "keywords": 키워드 점수,
  "technicalDepth": 기술 깊이 점수,
  "strengths": ["잘한 점 1", "잘한 점 2", "잘한 점 3"],
  "improvements": ["개선할 점 1", "개선할 점 2", "개선할 점 3"],
  "suggestions": ["구체적 제안 1", "구체적 제안 2", "구체적 제안 3"],
  "detailedFeedback": "전체적인 종합 피드백 (3-5문장)"
}

**주의사항**:
- 각 점수는 0-100 사이의 정수
- strengths, improvements, suggestions는 각각 최소 3개 이상
- detailedFeedback은 구체적이고 실행 가능한 조언 포함
- 4점을 5점으로 올리는 구체적 전략 제시`;

    const { text } = await generateText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: evaluationPrompt,
      temperature: 0.3,
    });

    // JSON 파싱
    let evaluation;
    try {
      // JSON 블록 추출 (마크다운 코드 블록 제거)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        evaluation = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("AI response:", text);

      // 기본 평가 반환
      evaluation = {
        score: 70,
        completeness: 70,
        accuracy: 70,
        structure: 70,
        clarity: 70,
        keywords: 70,
        technicalDepth: 70,
        strengths: [
          "답안을 작성하려고 노력했습니다",
          "주제에 대한 이해가 있습니다",
          "구조화된 답안을 시도했습니다",
        ],
        improvements: [
          "더 구체적인 기술적 설명이 필요합니다",
          "핵심 키워드를 추가로 포함시키세요",
          "답안의 구조를 더 명확히 하세요",
        ],
        suggestions: [
          "정의 → 구조/과정 → 특징/장단점 순서로 작성하세요",
          "다이어그램이나 표를 활용하세요",
          "핵심 키워드를 강조하세요",
        ],
        detailedFeedback:
          "전체적으로 양호한 답안입니다. 기술적 깊이를 더하고 구체적인 예시를 추가하면 더 좋은 점수를 받을 수 있습니다.",
      };
    }

    // 점수 범위 검증
    const validateScore = (score: number) =>
      Math.max(0, Math.min(100, Math.round(score)));

    evaluation.score = validateScore(evaluation.score);
    evaluation.completeness = validateScore(evaluation.completeness);
    evaluation.accuracy = validateScore(evaluation.accuracy);
    evaluation.structure = validateScore(evaluation.structure);
    evaluation.clarity = validateScore(evaluation.clarity);
    evaluation.keywords = validateScore(evaluation.keywords);
    evaluation.technicalDepth = validateScore(evaluation.technicalDepth);

    // 배열 검증
    evaluation.strengths = Array.isArray(evaluation.strengths)
      ? evaluation.strengths.slice(0, 5)
      : [];
    evaluation.improvements = Array.isArray(evaluation.improvements)
      ? evaluation.improvements.slice(0, 5)
      : [];
    evaluation.suggestions = Array.isArray(evaluation.suggestions)
      ? evaluation.suggestions.slice(0, 5)
      : [];

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
