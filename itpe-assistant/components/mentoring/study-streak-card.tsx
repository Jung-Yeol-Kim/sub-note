"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Calendar } from "lucide-react";
import type { StudyStreak, DailyCheckIn } from "@/lib/types/mentoring";

interface StudyStreakCardProps {
  studyStreak: StudyStreak;
  recentCheckIns: DailyCheckIn[];
}

export function StudyStreakCard({ studyStreak, recentCheckIns }: StudyStreakCardProps) {
  const today = new Date();
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const checkInDates = new Set(recentCheckIns.map((c) => c.date));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl">학습 연속 기록</CardTitle>
        </div>
        <CardDescription>꾸준함이 합격의 비결입니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">현재 연속 기록</h3>
            {studyStreak.currentStreak >= 7 && (
              <Badge className="bg-orange-500">
                🔥 {Math.floor(studyStreak.currentStreak / 7)}주
              </Badge>
            )}
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {studyStreak.currentStreak}일
            </div>
            <p className="text-sm text-muted-foreground">연속 학습 중</p>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">최장 기록</p>
              <p className="font-semibold">{studyStreak.longestStreak}일</p>
            </div>
          </div>
          {studyStreak.currentStreak === studyStreak.longestStreak &&
            studyStreak.currentStreak > 0 && (
              <Badge variant="default">신기록! 🎉</Badge>
            )}
        </div>

        {/* Last 7 Days Visualization */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">최근 7일</h4>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((date) => {
              const hasCheckIn = checkInDates.has(date);
              const dateObj = new Date(date);
              const dayName = dateObj.toLocaleDateString("ko-KR", {
                weekday: "short",
              });

              return (
                <div
                  key={date}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-full aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all ${
                      hasCheckIn
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {dateObj.getDate()}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation Message */}
        {studyStreak.currentStreak === 0 ? (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 오늘 체크인하고 연속 기록을 시작하세요!
            </p>
          </div>
        ) : studyStreak.currentStreak >= 7 ? (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
            <p className="text-sm text-green-900 dark:text-green-100">
              🎉 훌륭합니다! {studyStreak.currentStreak}일 연속 학습 중입니다. 계속 이어가세요!
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              🚀 좋은 시작입니다! 7일 연속을 목표로 해보세요!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
