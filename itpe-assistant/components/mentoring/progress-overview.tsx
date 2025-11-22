"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export function ProgressOverview() {
  const [stats, setStats] = useState({
    completedTopics: 142,
    totalTopics: 500,
    weeklyGoal: 5,
    weeklyCompleted: 3,
    averageScore: 78,
    scoreImprovement: 5,
  });

  const overallProgress = Math.round((stats.completedTopics / stats.totalTopics) * 100);
  const weeklyProgress = Math.round((stats.weeklyCompleted / stats.weeklyGoal) * 100);

  useEffect(() => {
    // TODO: Fetch from database
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          학습 진도
        </CardTitle>
        <CardDescription>전체 목표 대비 현재 진행 상황</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">전체 진도율</span>
            </div>
            <span className="text-sm font-bold text-accent">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.completedTopics}개 완료</span>
            <span>목표: {stats.totalTopics}개</span>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">이번 주 목표</span>
            </div>
            <span className="text-sm font-bold text-green-500">{weeklyProgress}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.weeklyCompleted}개 완료</span>
            <span>목표: {stats.weeklyGoal}개</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              평균 점수
            </div>
            <div className="text-2xl font-bold font-serif">{stats.averageScore}점</div>
            <div className="text-xs text-green-500">
              지난 달 대비 +{stats.scoreImprovement}점
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">남은 주제</div>
            <div className="text-2xl font-bold font-serif">
              {stats.totalTopics - stats.completedTopics}개
            </div>
            <div className="text-xs text-muted-foreground">
              예상 {Math.ceil((stats.totalTopics - stats.completedTopics) / stats.weeklyGoal)}주 소요
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
