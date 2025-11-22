"use server";

import { db } from "@/db";
import { reviewSchedule, subNotes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, lte, desc, isNull } from "drizzle-orm";
import {
  calculateNextReview,
  type ReviewQuality,
} from "@/lib/spaced-repetition";

// 복습 스케줄 생성 (서브노트 첫 학습 시)
export async function createReviewSchedule(subNoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 이미 스케줄이 있는지 확인
  const existing = await db.query.reviewSchedule.findFirst({
    where: and(
      eq(reviewSchedule.userId, session.user.id),
      eq(reviewSchedule.subNoteId, subNoteId)
    ),
  });

  if (existing) {
    return existing;
  }

  // 내일부터 복습 시작 (첫 간격 = 1일)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [schedule] = await db
    .insert(reviewSchedule)
    .values({
      userId: session.user.id,
      subNoteId,
      nextReviewDate: tomorrow,
      interval: 1, // 1일
      easeFactor: 2.5, // SM-2 기본값
      repetitions: 0,
      lastReviewQuality: null,
    })
    .returning();

  return schedule;
}

// 복습 완료 및 다음 스케줄 계산
export async function completeReview(data: {
  subNoteId: string;
  quality: ReviewQuality; // 0-5
  timeSpent?: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const schedule = await db.query.reviewSchedule.findFirst({
    where: and(
      eq(reviewSchedule.userId, session.user.id),
      eq(reviewSchedule.subNoteId, data.subNoteId)
    ),
  });

  if (!schedule) {
    throw new Error("Review schedule not found");
  }

  // SM-2 알고리즘으로 다음 복습 계산
  const nextReview = calculateNextReview({
    quality: data.quality,
    repetitions: schedule.repetitions || 0,
    easeFactor: schedule.easeFactor || 2.5,
    interval: schedule.interval || 1,
  });

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextReview.interval);
  nextReviewDate.setHours(0, 0, 0, 0);

  // 복습 스케줄 업데이트
  await db
    .update(reviewSchedule)
    .set({
      nextReviewDate,
      interval: nextReview.interval,
      easeFactor: nextReview.easeFactor,
      repetitions: nextReview.repetitions,
      lastReviewDate: new Date(),
      lastReviewQuality: data.quality,
      totalReviews: (schedule.totalReviews || 0) + 1,
      updatedAt: new Date(),
    })
    .where(eq(reviewSchedule.id, schedule.id));

  return {
    nextReviewDate,
    interval: nextReview.interval,
    quality: data.quality,
  };
}

// 오늘 복습할 항목 조회
export async function getTodayReviews() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const schedules = await db.query.reviewSchedule.findMany({
    where: and(
      eq(reviewSchedule.userId, session.user.id),
      lte(reviewSchedule.nextReviewDate, today)
    ),
    orderBy: [reviewSchedule.nextReviewDate],
    limit: 20,
  });

  // 서브노트 정보와 함께 반환
  const reviews = await Promise.all(
    schedules.map(async (schedule) => {
      const subNote = await db.query.subNotes.findFirst({
        where: eq(subNotes.id, schedule.subNoteId),
      });

      return {
        ...schedule,
        subNote,
      };
    })
  );

  return reviews.filter((r) => r.subNote !== null);
}

// 이번 주 복습 예정 조회
export async function getWeeklyReviews() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);

  const schedules = await db.query.reviewSchedule.findMany({
    where: and(
      eq(reviewSchedule.userId, session.user.id),
      lte(reviewSchedule.nextReviewDate, weekLater)
    ),
    orderBy: [reviewSchedule.nextReviewDate],
  });

  return schedules;
}

// 복습 통계
export async function getReviewStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const allSchedules = await db.query.reviewSchedule.findMany({
    where: eq(reviewSchedule.userId, session.user.id),
  });

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const dueToday = allSchedules.filter(
    (s) => s.nextReviewDate && new Date(s.nextReviewDate) <= today
  );

  const totalReviews = allSchedules.reduce(
    (sum, s) => sum + (s.totalReviews || 0),
    0
  );

  // 평균 기억률 (quality 3 이상을 성공으로 간주)
  const withQuality = allSchedules.filter((s) => s.lastReviewQuality !== null);
  const successfulReviews = withQuality.filter(
    (s) => (s.lastReviewQuality || 0) >= 3
  );

  const retentionRate =
    withQuality.length > 0
      ? Math.round((successfulReviews.length / withQuality.length) * 100)
      : 0;

  return {
    totalItems: allSchedules.length,
    dueToday: dueToday.length,
    totalReviews,
    retentionRate,
    averageRepetitions:
      allSchedules.length > 0
        ? Math.round(
            allSchedules.reduce((sum, s) => sum + (s.repetitions || 0), 0) /
              allSchedules.length
          )
        : 0,
  };
}

// 랜덤 복습 항목 가져오기
export async function getRandomReviews(count: number = 5) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // 사용자의 모든 서브노트
  const userSubNotes = await db.query.subNotes.findMany({
    where: eq(subNotes.userId, session.user.id),
    limit: 100,
  });

  // 랜덤 셔플
  const shuffled = userSubNotes.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // 복습 스케줄과 함께 반환
  const reviews = await Promise.all(
    selected.map(async (subNote) => {
      const schedule = await db.query.reviewSchedule.findFirst({
        where: and(
          eq(reviewSchedule.userId, session.user.id),
          eq(reviewSchedule.subNoteId, subNote.id)
        ),
      });

      return {
        subNote,
        schedule,
      };
    })
  );

  return reviews;
}

// 복습 필요도 기반 추천 (간격이 긴 것, 마지막 품질이 낮은 것 우선)
export async function getRecommendedReviews(limit: number = 10) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const schedules = await db.query.reviewSchedule.findMany({
    where: eq(reviewSchedule.userId, session.user.id),
    orderBy: [desc(reviewSchedule.interval)],
    limit: limit * 2,
  });

  // 우선순위 계산: 긴 간격 + 낮은 품질
  const scored = schedules.map((s) => ({
    ...s,
    priority:
      (s.interval || 1) * 10 -
      (s.lastReviewQuality || 3) * 5 +
      (s.totalReviews || 0),
  }));

  scored.sort((a, b) => b.priority - a.priority);

  const selected = scored.slice(0, limit);

  // 서브노트 정보와 함께
  const reviews = await Promise.all(
    selected.map(async (schedule) => {
      const subNote = await db.query.subNotes.findFirst({
        where: eq(subNotes.id, schedule.subNoteId),
      });

      return {
        ...schedule,
        subNote,
      };
    })
  );

  return reviews.filter((r) => r.subNote !== null);
}
