"use client";

import { useMentoringData } from "@/hooks/use-mentoring-data";
import { LearningJourneyTracker } from "@/components/mentoring/learning-journey-tracker";
import { WeeklyStudyPlan } from "@/components/mentoring/weekly-study-plan";
import { DailyCheckIn } from "@/components/mentoring/daily-check-in";
import { EncouragementCard } from "@/components/mentoring/encouragement-card";
import { StudyStreakCard } from "@/components/mentoring/study-streak-card";
import { MilestonesCard } from "@/components/mentoring/milestones-card";
import { Target, TrendingUp, Calendar } from "lucide-react";

export default function MentoringDashboard() {
  const {
    data,
    isLoaded,
    updateExamTarget,
    updateProgress,
    addWeeklyGoal,
    updateWeeklyGoal,
    addDailyCheckIn,
    getCurrentWeekGoal,
    getTodayCheckIn,
    getEncouragementMessage,
  } = useMentoringData();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  const currentWeekGoal = getCurrentWeekGoal();
  const todayCheckIn = getTodayCheckIn();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              멘토링 대시보드
            </h1>
            <p className="text-lg text-muted-foreground">
              합격을 향한 여정을 함께 관리하세요
            </p>
          </div>
        </div>
      </div>

      {/* Encouragement Message */}
      <EncouragementCard message={getEncouragementMessage()} />

      {/* Top Section: Learning Journey & Study Streak */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LearningJourneyTracker
          examTarget={data.examTarget}
          progress={data.progress}
          onUpdateTarget={updateExamTarget}
          onUpdateProgress={updateProgress}
        />
        <StudyStreakCard
          studyStreak={data.studyStreak}
          recentCheckIns={data.dailyCheckIns.slice(0, 7)}
        />
      </div>

      {/* Middle Section: Daily Check-in */}
      <DailyCheckIn
        todayCheckIn={todayCheckIn}
        onCheckIn={addDailyCheckIn}
      />

      {/* Weekly Study Plan */}
      <WeeklyStudyPlan
        currentWeekGoal={currentWeekGoal}
        onAddGoal={addWeeklyGoal}
        onUpdateGoal={updateWeeklyGoal}
      />

      {/* Milestones */}
      <MilestonesCard milestones={data.milestones.slice(0, 5)} />

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">총 학습 일수</h3>
          </div>
          <p className="text-3xl font-bold">{data.dailyCheckIns.length}</p>
          <p className="text-sm text-muted-foreground mt-1">
            지금까지 {data.dailyCheckIns.length}일 학습
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">주간 목표 달성률</h3>
          </div>
          <p className="text-3xl font-bold">
            {currentWeekGoal
              ? Math.round(
                  (currentWeekGoal.goals.filter((g) => g.completed).length /
                    currentWeekGoal.goals.length) *
                    100
                )
              : 0}
            %
          </p>
          <p className="text-sm text-muted-foreground mt-1">이번 주 진행 상황</p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">달성한 마일스톤</h3>
          </div>
          <p className="text-3xl font-bold">{data.milestones.length}</p>
          <p className="text-sm text-muted-foreground mt-1">축하합니다! 🎉</p>
        </div>
      </div>
    </div>
  );
}
