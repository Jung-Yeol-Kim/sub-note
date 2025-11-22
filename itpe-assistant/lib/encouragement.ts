import { db } from "@/db";
import { encouragementMessages, dailyCheckIns, learningStreaks } from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export type EncouragementContext = {
  userId: string;
  streak?: number;
  checkInsThisWeek?: number;
  recentMood?: string;
  energyLevel?: number;
  lastScore?: number;
  milestone?: string;
  slumpDetected?: boolean;
};

// 컨텍스트 기반 격려 메시지 타입 결정
export function determineMessageType(context: EncouragementContext): string {
  if (context.milestone) {
    return "celebration";
  }

  if (context.slumpDetected) {
    return "support";
  }

  if (context.streak && context.streak >= 7) {
    return "motivation";
  }

  if (context.recentMood === "struggling" || context.energyLevel && context.energyLevel < 2) {
    return "support";
  }

  if (context.lastScore && context.lastScore >= 80) {
    return "celebration";
  }

  return "motivation";
}

// 정적 격려 메시지 풀
const staticMessages = {
  motivation: [
    "매일 조금씩이라도 꾸준히 하는 것이 합격의 비결입니다. 오늘도 화이팅!",
    "정보관리기술사는 긴 여정입니다. 서두르지 말고 꾸준히 나아가세요.",
    "어제보다 조금 더 나은 오늘을 만들어가고 있습니다!",
    "실패는 성공의 어머니입니다. 틀린 문제에서 더 많이 배우세요.",
    "합격자들도 모두 이 과정을 거쳤습니다. 당신도 할 수 있습니다!",
  ],
  celebration: [
    "🎉 축하합니다! 멋진 성과를 이루셨네요!",
    "정말 대단합니다! 이 조자로 계속 나아가세요!",
    "훌륭합니다! 당신의 노력이 결실을 맺고 있습니다.",
    "와우! 이런 성과를 내다니 정말 자랑스럽습니다!",
    "브라보! 이 페이스 유지하면 합격은 시간 문제입니다!",
  ],
  support: [
    "힘든 시기겠지만, 이 또한 지나갑니다. 조금만 쉬어가세요.",
    "완벽하지 않아도 괜찮습니다. 진전이 있다면 그것으로 충분합니다.",
    "슬럼프는 누구에게나 찾아옵니다. 너무 자책하지 마세요.",
    "오늘은 충분히 휴식하고, 내일 다시 시작해도 괜찮습니다.",
    "혼자가 아닙니다. 많은 수험생들이 함께 노력하고 있습니다.",
  ],
  reminder: [
    "오늘도 체크인 잊지 마세요! 작은 습관이 큰 변화를 만듭니다.",
    "복습할 주제가 있습니다. 잠깐 시간 내서 확인해보세요.",
    "오늘의 학습 목표를 달성하셨나요? 조금만 더 힘내세요!",
    "주간 플랜 진행 상황을 확인해보세요.",
    "쓰기 연습 며칠째 하지 않으셨네요. 오늘 한 주제 작성해보시겠어요?",
  ],
};

// AI 기반 맞춤 격려 메시지 생성
export async function generateEncouragementMessage(
  context: EncouragementContext
): Promise<string> {
  const messageType = determineMessageType(context);

  try {
    const prompt = `당신은 정보관리기술사 시험 준비생을 격려하는 AI 멘토입니다.

**수험생 상황**:
- 연속 학습: ${context.streak || 0}일
- 이번 주 체크인: ${context.checkInsThisWeek || 0}회
- 최근 기분: ${context.recentMood || "보통"}
- 에너지 레벨: ${context.energyLevel || 3}/5
- 최근 점수: ${context.lastScore || "없음"}
${context.milestone ? `- 달성 마일스톤: ${context.milestone}` : ""}
${context.slumpDetected ? "- 슬럼프 감지됨" : ""}

**메시지 타입**: ${messageType}

위 상황에 맞는 따뜻하고 진심 어린 격려 메시지를 1-2문장으로 작성해주세요.
- 너무 형식적이지 않고 친근하게
- 구체적인 조언이나 다음 행동 제안 포함
- 이모지 1-2개 사용 가능
- 50자 이내로 간결하게`;

    const { text } = await generateText({
      model: anthropic("claude-3-5-haiku-20241022"), // 빠른 모델 사용
      prompt,
      temperature: 0.8,
      maxTokens: 150,
    });

    return text.trim();
  } catch (error) {
    console.error("Failed to generate AI message:", error);
    // AI 실패 시 정적 메시지 사용
    const messages = staticMessages[messageType as keyof typeof staticMessages] || staticMessages.motivation;
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// 격려 메시지 저장
export async function saveEncouragementMessage(
  userId: string,
  message: string,
  type: string,
  context?: string
) {
  await db.insert(encouragementMessages).values({
    userId,
    message,
    type,
    context,
    shownAt: new Date(),
  });
}

// 사용자 컨텍스트 조회
export async function getUserContext(userId: string): Promise<EncouragementContext> {
  // 연속 학습
  const streak = await db.query.learningStreaks.findFirst({
    where: eq(learningStreaks.userId, userId),
  });

  // 이번 주 체크인
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentCheckIns = await db.query.dailyCheckIns.findMany({
    where: and(
      eq(dailyCheckIns.userId, userId),
      gte(dailyCheckIns.date, weekAgo)
    ),
    orderBy: [desc(dailyCheckIns.date)],
  });

  const lastCheckIn = recentCheckIns[0];

  return {
    userId,
    streak: streak?.currentStreak || 0,
    checkInsThisWeek: recentCheckIns.length,
    recentMood: lastCheckIn?.mood || undefined,
    energyLevel: lastCheckIn?.energyLevel || undefined,
  };
}

// 슬럼프 감지
export async function detectSlump(userId: string): Promise<boolean> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentCheckIns = await db.query.dailyCheckIns.findMany({
    where: and(
      eq(dailyCheckIns.userId, userId),
      gte(dailyCheckIns.date, weekAgo)
    ),
  });

  // 지표: 체크인 < 3회 또는 에너지 평균 < 2
  if (recentCheckIns.length < 3) {
    return true;
  }

  const avgEnergy =
    recentCheckIns.reduce((sum, c) => sum + (c.energyLevel || 3), 0) /
    recentCheckIns.length;

  if (avgEnergy < 2) {
    return true;
  }

  // 연속 학습 끊김
  const streak = await db.query.learningStreaks.findFirst({
    where: eq(learningStreaks.userId, userId),
  });

  if (streak && streak.currentStreak === 0 && (streak.longestStreak || 0) > 7) {
    return true;
  }

  return false;
}

// 마일스톤 체크
export async function checkMilestone(userId: string): Promise<string | null> {
  const streak = await db.query.learningStreaks.findFirst({
    where: eq(learningStreaks.userId, userId),
  });

  if (!streak) return null;

  const current = streak.currentStreak || 0;

  // 특별한 날짜 체크
  if (current === 7) return "연속 학습 7일 달성!";
  if (current === 14) return "연속 학습 2주 달성!";
  if (current === 30) return "연속 학습 30일 달성!";
  if (current === 50) return "연속 학습 50일 달성!";
  if (current === 100) return "연속 학습 100일 달성!";

  const totalCheckIns = streak.totalCheckIns || 0;
  if (totalCheckIns === 50) return "총 50회 체크인 달성!";
  if (totalCheckIns === 100) return "총 100회 체크인 달성!";
  if (totalCheckIns === 200) return "총 200회 체크인 달성!";

  return null;
}

// 오늘의 격려 메시지 생성
export async function getTodayEncouragement(
  userId: string,
  forceAI: boolean = false
): Promise<string> {
  const context = await getUserContext(userId);
  const slump = await detectSlump(userId);
  const milestone = await checkMilestone(userId);

  const fullContext: EncouragementContext = {
    ...context,
    slumpDetected: slump,
    milestone: milestone || undefined,
  };

  // AI 또는 정적 메시지
  let message: string;

  if (forceAI || milestone || slump) {
    message = await generateEncouragementMessage(fullContext);
  } else {
    const type = determineMessageType(fullContext);
    const messages = staticMessages[type as keyof typeof staticMessages] || staticMessages.motivation;
    message = messages[Math.floor(Math.random() * messages.length)];
  }

  // 메시지 저장
  await saveEncouragementMessage(
    userId,
    message,
    determineMessageType(fullContext),
    JSON.stringify(fullContext)
  );

  return message;
}
