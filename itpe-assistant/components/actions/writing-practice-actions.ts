"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  writingChallenges,
  writingStreaks,
  writingAnalytics,
  examTopics,
  aiEvaluations,
} from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { startOfDay, endOfDay, subDays, differenceInDays } from "date-fns";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// Start a new writing challenge
export async function startWritingChallenge() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Get a random topic (or pick from exam topics)
  const topics = await db
    .select()
    .from(examTopics)
    .orderBy(desc(examTopics.frequency))
    .limit(20);

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  const topic = randomTopic?.title || "OAuth 2.0 인증 프로토콜";

  // Create a new challenge
  const [challenge] = await db
    .insert(writingChallenges)
    .values({
      userId,
      examTopicId: randomTopic?.id,
      challengeDate: new Date(),
      topic,
      challengeType: "daily",
      isCompleted: false,
    })
    .returning();

  return challenge;
}

// Complete a writing challenge
export async function completeWritingChallenge(
  challengeId: string,
  data: {
    content: string;
    timeSpent: number;
    isCompleted: boolean;
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  // Calculate word count
  const wordCount = data.content.trim().split(/\s+/).length;

  // Update the challenge
  const [updatedChallenge] = await db
    .update(writingChallenges)
    .set({
      content: data.content,
      wordCount,
      timeSpent: data.timeSpent,
      isCompleted: data.isCompleted,
      completedAt: data.isCompleted ? new Date() : null,
    })
    .where(
      and(
        eq(writingChallenges.id, challengeId),
        eq(writingChallenges.userId, userId)
      )
    )
    .returning();

  if (!updatedChallenge) {
    throw new Error("Challenge not found");
  }

  // If completed, update streak and evaluate with AI
  if (data.isCompleted) {
    await updateStreak(userId);

    // Generate AI evaluation (async, don't wait)
    evaluateWritingWithAI(challengeId, userId, data.content, updatedChallenge.topic);
  }

  return updatedChallenge;
}

// Update user's writing streak
async function updateStreak(userId: string) {
  let [streak] = await db
    .select()
    .from(writingStreaks)
    .where(eq(writingStreaks.userId, userId));

  if (!streak) {
    // Create initial streak
    [streak] = await db
      .insert(writingStreaks)
      .values({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        totalDaysActive: 1,
        totalChallengesCompleted: 1,
        achievements: [],
        level: 1,
        experiencePoints: 10,
        weeklyGoal: 5,
        weeklyProgress: 1,
        lastActivityDate: new Date(),
      })
      .returning();

    return streak;
  }

  const now = new Date();
  const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
  const daysSinceLastActivity = lastActivity
    ? differenceInDays(startOfDay(now), startOfDay(lastActivity))
    : 1000;

  let newStreak = streak.currentStreak;
  let newLongest = streak.longestStreak;

  if (daysSinceLastActivity === 0) {
    // Same day - no change to streak
    newStreak = streak.currentStreak;
  } else if (daysSinceLastActivity === 1) {
    // Consecutive day - increment streak
    newStreak = streak.currentStreak + 1;
  } else {
    // Streak broken - reset to 1
    newStreak = 1;
  }

  newLongest = Math.max(newLongest, newStreak);

  // Calculate XP and level
  const xpGain = 10 + (newStreak >= 7 ? 5 : 0); // Bonus for 7+ day streak
  const newXP = streak.experiencePoints + xpGain;
  const newLevel = Math.floor(newXP / 100) + 1;

  // Check for achievements
  const newAchievements = [...(streak.achievements || [])];
  const achievementChecks = [
    { id: "first_challenge", condition: streak.totalChallengesCompleted === 0 },
    { id: "3_day_streak", condition: newStreak >= 3 && !newAchievements.includes("3_day_streak") },
    { id: "7_day_streak", condition: newStreak >= 7 && !newAchievements.includes("7_day_streak") },
    { id: "30_day_streak", condition: newStreak >= 30 && !newAchievements.includes("30_day_streak") },
    { id: "10_challenges", condition: streak.totalChallengesCompleted + 1 >= 10 && !newAchievements.includes("10_challenges") },
    { id: "50_challenges", condition: streak.totalChallengesCompleted + 1 >= 50 && !newAchievements.includes("50_challenges") },
    { id: "100_challenges", condition: streak.totalChallengesCompleted + 1 >= 100 && !newAchievements.includes("100_challenges") },
  ];

  for (const check of achievementChecks) {
    if (check.condition && !newAchievements.includes(check.id)) {
      newAchievements.push(check.id);
    }
  }

  // Update streak
  const [updatedStreak] = await db
    .update(writingStreaks)
    .set({
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalChallengesCompleted: streak.totalChallengesCompleted + 1,
      totalDaysActive: daysSinceLastActivity > 0 ? streak.totalDaysActive + 1 : streak.totalDaysActive,
      lastActivityDate: now,
      experiencePoints: newXP,
      level: newLevel,
      achievements: newAchievements,
    })
    .where(eq(writingStreaks.userId, userId))
    .returning();

  return updatedStreak;
}

// Evaluate writing with AI (async background task)
async function evaluateWritingWithAI(
  challengeId: string,
  userId: string,
  content: string,
  topic: string
) {
  try {
    const { object } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20241022"),
      schema: z.object({
        overallScore: z.number().min(0).max(100),
        completenessScore: z.number().min(0).max(100),
        accuracyScore: z.number().min(0).max(100),
        structureScore: z.number().min(0).max(100),
        clarityScore: z.number().min(0).max(100),
        keywordScore: z.number().min(0).max(100),
        technicalDepthScore: z.number().min(0).max(100),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        missingKeywords: z.array(z.string()),
        suggestions: z.array(z.string()),
        detailedFeedback: z.string(),
      }),
      prompt: `당신은 정보관리기술사 시험 평가 전문가입니다. 다음 답안을 6가지 기준으로 평가해주세요.

주제: ${topic}

답안:
${content}

다음 6가지 기준으로 0-100점 척도로 평가해주세요:
1. 내용 완성도 (completenessScore): 주제를 얼마나 완전히 다루었는가
2. 정확성 (accuracyScore): 기술적 내용이 얼마나 정확한가
3. 구조 및 논리성 (structureScore): 답안 구조가 논리적인가
4. 명료성 (clarityScore): 설명이 명확하고 이해하기 쉬운가
5. 키워드 포함 (keywordScore): 핵심 키워드가 적절히 사용되었는가
6. 기술 깊이 (technicalDepthScore): 기술적 깊이가 충분한가

또한 다음을 제공해주세요:
- strengths: 잘한 점 (3-5개)
- weaknesses: 개선이 필요한 점 (3-5개)
- missingKeywords: 누락된 중요 키워드
- suggestions: 구체적인 개선 제안 (3-5개)
- detailedFeedback: 상세한 피드백 (마크다운 형식)`,
    });

    // Save evaluation to database
    const [evaluation] = await db
      .insert(aiEvaluations)
      .values({
        userId,
        model: "claude-3-5-sonnet-20241022",
        ...object,
      })
      .returning();

    // Link evaluation to challenge
    await db
      .update(writingChallenges)
      .set({
        evaluationId: evaluation.id,
      })
      .where(eq(writingChallenges.id, challengeId));

    return evaluation;
  } catch (error) {
    console.error("Failed to evaluate writing:", error);
    return null;
  }
}

// Generate writing analytics for a user
export async function generateWritingAnalytics(userId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const targetUserId = userId || session.user.id;

  // Get challenges from the last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const challenges = await db
    .select()
    .from(writingChallenges)
    .where(
      and(
        eq(writingChallenges.userId, targetUserId),
        gte(writingChallenges.challengeDate, thirtyDaysAgo),
        eq(writingChallenges.isCompleted, true)
      )
    );

  if (challenges.length < 5) {
    // Not enough data for analysis
    return null;
  }

  // Get evaluations for these challenges
  const evaluationIds = challenges
    .map((c) => c.evaluationId)
    .filter((id): id is string => id !== null);

  const evaluations = await db
    .select()
    .from(aiEvaluations)
    .where(eq(aiEvaluations.userId, targetUserId));

  // Calculate metrics
  const totalChallenges = challenges.length;
  const completedChallenges = challenges.filter((c) => c.isCompleted).length;

  const avgWordCount = Math.round(
    challenges.reduce((sum, c) => sum + (c.wordCount || 0), 0) / totalChallenges
  );

  const avgTimeSpent = Math.round(
    challenges.reduce((sum, c) => sum + (c.timeSpent || 0), 0) / totalChallenges
  );

  const avgScore = evaluations.length > 0
    ? Math.round(
        evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / evaluations.length
      )
    : 0;

  // Calculate improvement rate (compare first half vs second half)
  const midpoint = Math.floor(evaluations.length / 2);
  const firstHalfAvg = evaluations.slice(0, midpoint).reduce((sum, e) => sum + (e.overallScore || 0), 0) / midpoint || 0;
  const secondHalfAvg = evaluations.slice(midpoint).reduce((sum, e) => sum + (e.overallScore || 0), 0) / (evaluations.length - midpoint) || 0;
  const improvementRate = firstHalfAvg > 0 ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;

  // Collect strengths and weaknesses
  const allStrengths = evaluations.flatMap((e) => e.strengths || []);
  const allWeaknesses = evaluations.flatMap((e) => e.weaknesses || []);

  const strengthCounts = allStrengths.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weaknessCounts = allWeaknesses.reduce((acc, w) => {
    acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topStrengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((e) => e[0]);

  const topWeaknesses = Object.entries(weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((e) => e[0]);

  // Save analytics
  const [analytics] = await db
    .insert(writingAnalytics)
    .values({
      userId: targetUserId,
      analysisDate: new Date(),
      periodStart: thirtyDaysAgo,
      periodEnd: new Date(),
      totalChallenges,
      completedChallenges,
      averageWordCount: avgWordCount,
      averageTimeSpent: avgTimeSpent,
      averageScore: avgScore,
      improvementRate,
      consistencyScore: Math.round((completedChallenges / 30) * 100),
      strengths: topStrengths,
      weaknesses: topWeaknesses,
      recommendations: [
        "매일 꾸준히 연습하여 일관성을 유지하세요",
        "약점 영역에 집중하여 균형잡힌 실력을 키우세요",
        "AI 피드백을 적극 반영하여 개선하세요",
      ],
      vocabularyRichness: 75,
      structuralConsistency: 80,
      keywordUsageRate: 70,
      averageSentenceLength: 45,
    })
    .returning();

  return analytics;
}
