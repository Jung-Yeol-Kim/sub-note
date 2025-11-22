"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp } from "lucide-react";

interface LearningJourneyProps {
  examDate?: Date;
  daysUntilExam: number;
  totalTopics: number;
  completedTopics: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyHours: number;
}

export function LearningJourney({
  examDate,
  daysUntilExam,
  totalTopics,
  completedTopics,
  currentStreak,
  longestStreak,
  totalStudyHours,
}: LearningJourneyProps) {
  const progressPercentage = Math.round((completedTopics / totalTopics) * 100);

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          학습 여정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* D-Day Counter */}
        <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">시험까지</p>
          </div>
          <div className="text-5xl font-bold text-primary mb-1">
            D-{daysUntilExam}
          </div>
          {examDate && (
            <p className="text-sm text-muted-foreground">
              {examDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">학습 진도</span>
            <span className="text-sm font-bold text-primary">
              {completedTopics} / {totalTopics}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-right">
            {progressPercentage}% 완료
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-accent">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">연속 일수</p>
          </div>
          <div className="text-center border-x">
            <div className="text-2xl font-bold text-primary">{longestStreak}</div>
            <p className="text-xs text-muted-foreground">최장 기록</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {totalStudyHours}h
            </div>
            <p className="text-xs text-muted-foreground">총 학습 시간</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
