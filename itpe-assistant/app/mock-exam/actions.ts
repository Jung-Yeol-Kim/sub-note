"use server";

import { db } from "@/db";
import { mockExamSessions, mockExamAnswers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";

// 모의고사 세션 시작
export async function startMockExamSession(data: {
  examType: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number; // 분
  questions: any[];
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [examSession] = await db
    .insert(mockExamSessions)
    .values({
      userId: session.user.id,
      examType: data.examType,
      difficulty: data.difficulty,
      questionCount: data.questionCount,
      timeLimit: data.timeLimit,
      questions: data.questions,
      status: "in_progress",
      startedAt: new Date(),
    })
    .returning();

  return examSession;
}

// 모의고사 답안 저장
export async function saveMockExamAnswer(data: {
  sessionId: string;
  questionIndex: number;
  questionId: string;
  question: string;
  answer: string;
  timeSpent: number; // 초
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 기존 답안이 있는지 확인
  const existing = await db.query.mockExamAnswers.findFirst({
    where: and(
      eq(mockExamAnswers.sessionId, data.sessionId),
      eq(mockExamAnswers.questionIndex, data.questionIndex)
    ),
  });

  if (existing) {
    // 업데이트
    await db
      .update(mockExamAnswers)
      .set({
        answer: data.answer,
        timeSpent: data.timeSpent,
        updatedAt: new Date(),
      })
      .where(eq(mockExamAnswers.id, existing.id));

    return existing;
  }

  // 새로 저장
  const [answer] = await db
    .insert(mockExamAnswers)
    .values({
      sessionId: data.sessionId,
      userId: session.user.id,
      questionIndex: data.questionIndex,
      questionId: data.questionId,
      question: data.question,
      answer: data.answer,
      timeSpent: data.timeSpent,
    })
    .returning();

  return answer;
}

// 모의고사 제출 및 평가
export async function submitMockExam(sessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 세션 조회
  const examSession = await db.query.mockExamSessions.findFirst({
    where: and(
      eq(mockExamSessions.id, sessionId),
      eq(mockExamSessions.userId, session.user.id)
    ),
  });

  if (!examSession) {
    throw new Error("Session not found");
  }

  // 답안 조회
  const answers = await db.query.mockExamAnswers.findMany({
    where: eq(mockExamAnswers.sessionId, sessionId),
  });

  const completedAt = new Date();
  const totalTimeSpent = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);

  // 세션 상태 업데이트
  await db
    .update(mockExamSessions)
    .set({
      status: "completed",
      completedAt,
      totalTimeSpent,
      answeredCount: answers.length,
      updatedAt: new Date(),
    })
    .where(eq(mockExamSessions.id, sessionId));

  return {
    sessionId,
    answers,
    totalTimeSpent,
    answeredCount: answers.length,
    questionCount: examSession.questionCount,
  };
}

// AI 평가 결과 저장
export async function saveMockExamEvaluation(data: {
  sessionId: string;
  answerId: string;
  evaluation: {
    score: number;
    completeness: number;
    accuracy: number;
    structure: number;
    clarity: number;
    keywords: number;
    technicalDepth: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    detailedFeedback: string;
  };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 답안 업데이트
  await db
    .update(mockExamAnswers)
    .set({
      score: data.evaluation.score,
      aiEvaluation: data.evaluation,
      evaluatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(mockExamAnswers.id, data.answerId));

  // 세션의 평균 점수 업데이트
  const allAnswers = await db.query.mockExamAnswers.findMany({
    where: eq(mockExamAnswers.sessionId, data.sessionId),
  });

  const evaluatedAnswers = allAnswers.filter((a) => a.score !== null);
  if (evaluatedAnswers.length > 0) {
    const avgScore =
      evaluatedAnswers.reduce((sum, a) => sum + (a.score || 0), 0) /
      evaluatedAnswers.length;

    await db
      .update(mockExamSessions)
      .set({
        totalScore: Math.round(avgScore),
        updatedAt: new Date(),
      })
      .where(eq(mockExamSessions.id, data.sessionId));
  }

  return data.evaluation;
}

// 모의고사 세션 조회
export async function getMockExamSession(sessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const examSession = await db.query.mockExamSessions.findFirst({
    where: and(
      eq(mockExamSessions.id, sessionId),
      eq(mockExamSessions.userId, session.user.id)
    ),
  });

  return examSession;
}

// 모의고사 답안 조회
export async function getMockExamAnswers(sessionId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const answers = await db.query.mockExamAnswers.findMany({
    where: and(
      eq(mockExamAnswers.sessionId, sessionId),
      eq(mockExamAnswers.userId, session.user.id)
    ),
    orderBy: [mockExamAnswers.questionIndex],
  });

  return answers;
}

// 모의고사 이력 조회
export async function getMockExamHistory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const sessions = await db.query.mockExamSessions.findMany({
    where: eq(mockExamSessions.userId, session.user.id),
    orderBy: [desc(mockExamSessions.createdAt)],
    limit: 20,
  });

  return sessions;
}

// 모의고사 통계
export async function getMockExamStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const sessions = await db.query.mockExamSessions.findMany({
    where: and(
      eq(mockExamSessions.userId, session.user.id),
      eq(mockExamSessions.status, "completed")
    ),
  });

  if (sessions.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      totalTimeSpent: 0,
    };
  }

  const scores = sessions
    .filter((s) => s.totalScore !== null)
    .map((s) => s.totalScore || 0);

  return {
    totalAttempts: sessions.length,
    averageScore: scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0,
    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    totalTimeSpent: sessions.reduce(
      (sum, s) => sum + (s.totalTimeSpent || 0),
      0
    ),
    recentSessions: sessions.slice(0, 5),
  };
}
