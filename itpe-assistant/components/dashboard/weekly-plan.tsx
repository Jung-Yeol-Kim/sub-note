"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

interface WeeklyPlanProps {
  weekNumber: number;
  goalTopics: string[];
  completedTopics: string[];
  goalStudyMinutes: number;
  actualStudyMinutes: number;
}

export function WeeklyPlan({
  weekNumber,
  goalTopics,
  completedTopics,
  goalStudyMinutes,
  actualStudyMinutes,
}: WeeklyPlanProps) {
  const topicsProgress = (completedTopics.length / goalTopics.length) * 100;
  const timeProgress = (actualStudyMinutes / goalStudyMinutes) * 100;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            이번 주 학습 플랜
          </CardTitle>
          <Badge variant="outline">{weekNumber}주차</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Study Time Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">학습 시간</span>
            <span className="text-muted-foreground">
              {Math.floor(actualStudyMinutes / 60)}h {actualStudyMinutes % 60}m / {Math.floor(goalStudyMinutes / 60)}h
            </span>
          </div>
          <Progress value={Math.min(timeProgress, 100)} className="h-2" />
        </div>

        {/* Topics Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">주제 완료</span>
            <span className="text-muted-foreground">
              {completedTopics.length} / {goalTopics.length}
            </span>
          </div>
          <Progress value={Math.min(topicsProgress, 100)} className="h-2" />
        </div>

        {/* Topic List */}
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium">이번 주 목표 주제</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {goalTopics.slice(0, 5).map((topic, index) => {
              const isCompleted = completedTopics.includes(topic);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/10 transition-colors"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      isCompleted
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {topic}
                  </span>
                </div>
              );
            })}
            {goalTopics.length > 5 && (
              <p className="text-xs text-muted-foreground pl-6">
                +{goalTopics.length - 5}개 더보기
              </p>
            )}
          </div>
        </div>

        <Link href="/mentoring/weekly-plan">
          <Button variant="outline" className="w-full mt-2">
            주간 플랜 관리
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
