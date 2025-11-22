"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";

interface WeeklyGoal {
  id: string;
  title: string;
  completed: boolean;
}

export function WeeklyPlan() {
  const [goals, setGoals] = useState<WeeklyGoal[]>([
    { id: "1", title: "OAuth 2.0 서브노트 작성", completed: true },
    { id: "2", title: "Kubernetes 보안 주제 학습", completed: true },
    { id: "3", title: "Zero Trust 아키텍처 정리", completed: false },
    { id: "4", title: "API Gateway 패턴 복습", completed: false },
    { id: "5", title: "모의고사 1회 응시", completed: false },
  ]);

  const completedCount = goals.filter((g) => g.completed).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, "M/d", { locale: ko })} - ${format(weekEnd, "M/d", { locale: ko })}`;

  const toggleGoal = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  return (
    <Card className="shadow-sm border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              주간 학습 플랜
            </CardTitle>
            <CardDescription>{weekRange}</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            목표 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">주간 진도</span>
            <span className="text-blue-500 font-bold">
              {completedCount} / {goals.length}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {goals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50 transition-all hover:bg-card hover:shadow-sm text-left"
            >
              {goal.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={`flex-1 text-sm ${
                  goal.completed ? "line-through text-muted-foreground" : "font-medium"
                }`}
              >
                {goal.title}
              </span>
            </button>
          ))}
        </div>

        {/* Week Summary */}
        {progressPercent === 100 && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              이번 주 목표를 모두 달성했습니다! 🎉
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
