"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  PenLine,
  Clock,
  BarChart3,
  Trophy,
  Star,
  CheckCircle2,
} from "lucide-react";
import { StreakCard } from "./streak-card";
import { DailyChallengeCard } from "./daily-challenge-card";
import { WritingAnalyticsCard } from "./writing-analytics-card";
import { ChallengeHistoryCard } from "./challenge-history-card";
import { AchievementsCard } from "./achievements-card";

interface WritingPracticeHubProps {
  streak: any;
  weeklyChallenges: any[];
  recentChallenges: any[];
  analytics: any;
}

export function WritingPracticeHub({
  streak,
  weeklyChallenges,
  recentChallenges,
  analytics,
}: WritingPracticeHubProps) {
  const [activeTab, setActiveTab] = useState<"practice" | "analytics" | "history">("practice");

  const completedThisWeek = weeklyChallenges.filter((c) => c.isCompleted).length;
  const weeklyGoalProgress = (completedThisWeek / streak.weeklyGoal) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <PenLine className="h-10 w-10 text-primary" />
          쓰기 연습 모드
        </h1>
        <p className="text-muted-foreground text-lg">
          매일 쓰기로 합격에 한 걸음 더 가까이! 실전 감각을 키우고 패턴을 분석하세요.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "practice" ? "default" : "ghost"}
          onClick={() => setActiveTab("practice")}
          className="rounded-b-none"
        >
          <Target className="mr-2 h-4 w-4" />
          오늘의 연습
        </Button>
        <Button
          variant={activeTab === "analytics" ? "default" : "ghost"}
          onClick={() => setActiveTab("analytics")}
          className="rounded-b-none"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          패턴 분석
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
          className="rounded-b-none"
        >
          <Calendar className="mr-2 h-4 w-4" />
          학습 기록
        </Button>
      </div>

      {/* Streak Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-3xl font-bold text-orange-500">
              {streak.currentStreak}
            </span>
          </div>
          <p className="text-sm font-medium">연속 학습</p>
          <p className="text-xs text-muted-foreground">
            최장: {streak.longestStreak}일
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="h-8 w-8 text-blue-500" />
            <span className="text-3xl font-bold text-blue-500">
              {streak.level}
            </span>
          </div>
          <p className="text-sm font-medium">레벨</p>
          <p className="text-xs text-muted-foreground">
            {streak.experiencePoints} XP
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <span className="text-3xl font-bold text-green-500">
              {completedThisWeek}
            </span>
          </div>
          <p className="text-sm font-medium">이번 주</p>
          <div className="mt-2">
            <Progress value={weeklyGoalProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              목표: {streak.weeklyGoal}회
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-8 w-8 text-purple-500" />
            <span className="text-3xl font-bold text-purple-500">
              {streak.achievements?.length || 0}
            </span>
          </div>
          <p className="text-sm font-medium">업적</p>
          <p className="text-xs text-muted-foreground">
            달성한 목표
          </p>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "practice" && (
            <>
              <DailyChallengeCard streak={streak} />
              <AchievementsCard achievements={streak.achievements || []} level={streak.level} />
            </>
          )}

          {activeTab === "analytics" && (
            <WritingAnalyticsCard analytics={analytics} />
          )}

          {activeTab === "history" && (
            <ChallengeHistoryCard challenges={recentChallenges} />
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <StreakCard
            currentStreak={streak.currentStreak}
            longestStreak={streak.longestStreak}
            lastActivityDate={streak.lastActivityDate}
          />

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              주간 목표
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>완료: {completedThisWeek}/{streak.weeklyGoal}</span>
                  <span className="text-muted-foreground">
                    {Math.round(weeklyGoalProgress)}%
                  </span>
                </div>
                <Progress value={weeklyGoalProgress} className="h-3" />
              </div>
              {completedThisWeek >= streak.weeklyGoal ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-500">
                    주간 목표 달성! 🎉
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  앞으로 {streak.weeklyGoal - completedThisWeek}회만 더 연습하면 이번 주 목표를 달성할 수 있어요!
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              💡 학습 팁
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="text-primary">•</span>
                <p>매일 같은 시간에 연습하면 습관이 됩니다</p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">•</span>
                <p>처음엔 완벽보다 꾸준함이 중요합니다</p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">•</span>
                <p>AI 피드백을 적극 활용하세요</p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary">•</span>
                <p>약점을 파악하고 집중 공략하세요</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
