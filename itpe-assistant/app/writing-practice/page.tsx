import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { writingStreaks, writingChallenges, writingAnalytics } from "@/db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { WritingPracticeHub } from "@/components/writing-practice/writing-practice-hub";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export default async function WritingPracticePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch or create writing streak
  let [streak] = await db
    .select()
    .from(writingStreaks)
    .where(eq(writingStreaks.userId, userId));

  if (!streak) {
    // Create initial streak record
    [streak] = await db
      .insert(writingStreaks)
      .values({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalDaysActive: 0,
        totalChallengesCompleted: 0,
        achievements: [],
        level: 1,
        experiencePoints: 0,
        weeklyGoal: 5,
        weeklyProgress: 0,
      })
      .returning();
  }

  // Get this week's challenges
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const weeklyChallenges = await db
    .select()
    .from(writingChallenges)
    .where(
      and(
        eq(writingChallenges.userId, userId),
        gte(writingChallenges.challengeDate, weekStart),
        lte(writingChallenges.challengeDate, weekEnd)
      )
    )
    .orderBy(desc(writingChallenges.challengeDate));

  // Get recent challenges (last 10)
  const recentChallenges = await db
    .select()
    .from(writingChallenges)
    .where(eq(writingChallenges.userId, userId))
    .orderBy(desc(writingChallenges.challengeDate))
    .limit(10);

  // Get latest analytics
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const [latestAnalytics] = await db
    .select()
    .from(writingAnalytics)
    .where(
      and(
        eq(writingAnalytics.userId, userId),
        gte(writingAnalytics.periodStart, monthStart),
        lte(writingAnalytics.periodEnd, monthEnd)
      )
    )
    .orderBy(desc(writingAnalytics.analysisDate))
    .limit(1);

  return (
    <WritingPracticeHub
      streak={streak}
      weeklyChallenges={weeklyChallenges}
      recentChallenges={recentChallenges}
      analytics={latestAnalytics}
    />
  );
}
