"use server";

import { db } from "@/db";
import {
  dailyCheckIns,
  learningStreaks,
  weeklyPlans,
  studyGoals,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, gte, lte, desc } from "drizzle-orm";

// Check-in 생성
export async function createCheckIn(data: {
  studyMinutes: number;
  topicsStudied: string[];
  mood: string;
  energyLevel: number;
  notes?: string;
  challenges?: string[];
  achievements?: string[];
  tomorrowPlan?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 이미 체크인 했는지 확인
  const existingCheckIn = await db.query.dailyCheckIns.findFirst({
    where: and(
      eq(dailyCheckIns.userId, session.user.id),
      gte(dailyCheckIns.date, today)
    ),
  });

  if (existingCheckIn) {
    // 업데이트
    await db
      .update(dailyCheckIns)
      .set({
        studyMinutes: data.studyMinutes,
        topicsStudied: data.topicsStudied,
        mood: data.mood,
        energyLevel: data.energyLevel,
        notes: data.notes,
        challenges: data.challenges,
        achievements: data.achievements,
        tomorrowPlan: data.tomorrowPlan,
        updatedAt: new Date(),
      })
      .where(eq(dailyCheckIns.id, existingCheckIn.id));

    // 연속 학습 업데이트
    await updateStreak(session.user.id);

    return existingCheckIn;
  }

  // 새로 생성
  const [checkIn] = await db
    .insert(dailyCheckIns)
    .values({
      userId: session.user.id,
      date: today,
      studyMinutes: data.studyMinutes,
      topicsStudied: data.topicsStudied,
      mood: data.mood,
      energyLevel: data.energyLevel,
      notes: data.notes,
      challenges: data.challenges,
      achievements: data.achievements,
      tomorrowPlan: data.tomorrowPlan,
    })
    .returning();

  // 연속 학습 업데이트
  await updateStreak(session.user.id);

  return checkIn;
}

// 연속 학습 업데이트
async function updateStreak(userId: string) {
  const streak = await db.query.learningStreaks.findFirst({
    where: eq(learningStreaks.userId, userId),
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!streak) {
    // 첫 연속 기록 생성
    await db.insert(learningStreaks).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastCheckInDate: today,
      totalCheckIns: 1,
    });
    return;
  }

  const lastCheckIn = streak.lastCheckInDate
    ? new Date(streak.lastCheckInDate)
    : null;

  if (!lastCheckIn) {
    await db
      .update(learningStreaks)
      .set({
        currentStreak: 1,
        longestStreak: Math.max(1, streak.longestStreak || 0),
        lastCheckInDate: today,
        totalCheckIns: (streak.totalCheckIns || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(learningStreaks.userId, userId));
    return;
  }

  lastCheckIn.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    // 오늘 이미 체크인함
    return;
  }

  if (diffDays === 1) {
    // 연속 학습 유지
    const newStreak = (streak.currentStreak || 0) + 1;
    await db
      .update(learningStreaks)
      .set({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak || 0),
        lastCheckInDate: today,
        totalCheckIns: (streak.totalCheckIns || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(learningStreaks.userId, userId));
  } else {
    // 연속 끊김
    await db
      .update(learningStreaks)
      .set({
        currentStreak: 1,
        lastCheckInDate: today,
        totalCheckIns: (streak.totalCheckIns || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(learningStreaks.userId, userId));
  }
}

// 오늘의 체크인 조회
export async function getTodayCheckIn() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkIn = await db.query.dailyCheckIns.findFirst({
    where: and(
      eq(dailyCheckIns.userId, session.user.id),
      gte(dailyCheckIns.date, today)
    ),
  });

  return checkIn;
}

// 연속 학습 조회
export async function getStreak() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const streak = await db.query.learningStreaks.findFirst({
    where: eq(learningStreaks.userId, session.user.id),
  });

  return streak;
}

// 주간 체크인 통계
export async function getWeeklyStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const checkIns = await db.query.dailyCheckIns.findMany({
    where: and(
      eq(dailyCheckIns.userId, session.user.id),
      gte(dailyCheckIns.date, weekAgo)
    ),
    orderBy: [desc(dailyCheckIns.date)],
  });

  const totalMinutes = checkIns.reduce(
    (sum, c) => sum + (c.studyMinutes || 0),
    0
  );
  const totalTopics = new Set(
    checkIns.flatMap((c) => c.topicsStudied || [])
  ).size;

  return {
    checkIns,
    totalMinutes,
    totalTopics,
    daysActive: checkIns.length,
  };
}

// 주간 플랜 생성/업데이트
export async function createWeeklyPlan(data: {
  goalTopics: string[];
  goalStudyMinutes: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weekNumber = Math.ceil(
    (today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7
  );

  // 이번 주 플랜 있는지 확인
  const existingPlan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.userId, session.user.id),
      gte(weeklyPlans.startDate, startOfWeek),
      lte(weeklyPlans.startDate, endOfWeek)
    ),
  });

  if (existingPlan) {
    // 업데이트
    await db
      .update(weeklyPlans)
      .set({
        goalTopics: data.goalTopics,
        goalStudyMinutes: data.goalStudyMinutes,
        updatedAt: new Date(),
      })
      .where(eq(weeklyPlans.id, existingPlan.id));

    return existingPlan;
  }

  // 새로 생성
  const [plan] = await db
    .insert(weeklyPlans)
    .values({
      userId: session.user.id,
      weekNumber,
      year: today.getFullYear(),
      startDate: startOfWeek,
      endDate: endOfWeek,
      goalTopics: data.goalTopics,
      goalStudyMinutes: data.goalStudyMinutes,
      actualStudyMinutes: 0,
      completedTopics: [],
      status: "active",
    })
    .returning();

  return plan;
}

// 현재 주간 플랜 조회
export async function getCurrentWeeklyPlan() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const plan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.userId, session.user.id),
      gte(weeklyPlans.startDate, startOfWeek),
      lte(weeklyPlans.startDate, endOfWeek)
    ),
  });

  return plan;
}

// 학습 목표 설정
export async function setStudyGoal(data: {
  examDate?: Date;
  targetScore?: number;
  dailyStudyMinutes?: number;
  weeklyTopicsGoal?: number;
  motivation?: string;
  currentLevel?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingGoal = await db.query.studyGoals.findFirst({
    where: and(
      eq(studyGoals.userId, session.user.id),
      eq(studyGoals.isActive, true)
    ),
  });

  if (existingGoal) {
    await db
      .update(studyGoals)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(studyGoals.id, existingGoal.id));

    return existingGoal;
  }

  const [goal] = await db.insert(studyGoals).values({
    userId: session.user.id,
    ...data,
    isActive: true,
  }).returning();

  return goal;
}

// 학습 목표 조회
export async function getStudyGoal() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const goal = await db.query.studyGoals.findFirst({
    where: and(
      eq(studyGoals.userId, session.user.id),
      eq(studyGoals.isActive, true)
    ),
  });

  return goal;
}
