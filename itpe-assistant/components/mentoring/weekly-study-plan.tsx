"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, CheckCircle2, Circle, Edit } from "lucide-react";
import type { WeeklyGoal, Goal } from "@/lib/types/mentoring";
import { nanoid } from "nanoid";

interface WeeklyStudyPlanProps {
  currentWeekGoal?: WeeklyGoal;
  onAddGoal: (goal: Omit<WeeklyGoal, "id">) => void;
  onUpdateGoal: (id: string, updates: Partial<WeeklyGoal>) => void;
}

export function WeeklyStudyPlan({
  currentWeekGoal,
  onAddGoal,
  onUpdateGoal,
}: WeeklyStudyPlanProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [goalInputs, setGoalInputs] = useState<string[]>([""]);
  const [reviewText, setReviewText] = useState("");

  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toISOString(),
      end: sunday.toISOString(),
      startFormatted: monday.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
      endFormatted: sunday.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  const handleCreateGoal = () => {
    const weekDates = getWeekDates();
    const goals: Goal[] = goalInputs
      .filter((input) => input.trim())
      .map((input) => ({
        id: nanoid(),
        title: input.trim(),
        targetDate: weekDates.end,
        completed: false,
      }));

    if (goals.length > 0) {
      onAddGoal({
        weekStart: weekDates.start,
        weekEnd: weekDates.end,
        goals,
        completed: false,
      });
      setGoalInputs([""]);
      setIsCreating(false);
    }
  };

  const handleToggleGoal = (goalId: string) => {
    if (!currentWeekGoal) return;

    const updatedGoals = currentWeekGoal.goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            completed: !goal.completed,
            completedAt: !goal.completed ? new Date().toISOString() : undefined,
          }
        : goal
    );

    const allCompleted = updatedGoals.every((g) => g.completed);

    onUpdateGoal(currentWeekGoal.id, {
      goals: updatedGoals,
      completed: allCompleted,
    });
  };

  const handleAddReview = () => {
    if (!currentWeekGoal || !reviewText.trim()) return;

    onUpdateGoal(currentWeekGoal.id, {
      review: reviewText.trim(),
      completed: true,
    });
    setReviewText("");
    setIsReviewing(false);
  };

  const addGoalInput = () => {
    setGoalInputs([...goalInputs, ""]);
  };

  const updateGoalInput = (index: number, value: string) => {
    const updated = [...goalInputs];
    updated[index] = value;
    setGoalInputs(updated);
  };

  const weekDates = getWeekDates();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">주간 학습 플랜</CardTitle>
          </div>
          {!currentWeekGoal && (
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  목표 설정
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>이번 주 학습 목표</DialogTitle>
                  <DialogDescription>
                    {weekDates.startFormatted} ~ {weekDates.endFormatted}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {goalInputs.map((input, index) => (
                    <div key={index}>
                      <Label htmlFor={`goal-${index}`}>
                        목표 {index + 1}
                      </Label>
                      <Input
                        id={`goal-${index}`}
                        placeholder="예: OAuth 2.0 서브노트 작성"
                        value={input}
                        onChange={(e) => updateGoalInput(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addGoalInput}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    목표 추가
                  </Button>
                  <Button onClick={handleCreateGoal} className="w-full">
                    목표 설정 완료
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>
          {weekDates.startFormatted} ~ {weekDates.endFormatted}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentWeekGoal ? (
          <div className="space-y-4">
            {/* Goals List */}
            <div className="space-y-3">
              {currentWeekGoal.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card/50 transition-all hover:bg-card hover:shadow-sm cursor-pointer"
                  onClick={() => handleToggleGoal(goal.id)}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        goal.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {goal.title}
                    </p>
                    {goal.completedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        완료: {new Date(goal.completedAt).toLocaleDateString("ko-KR")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">주간 목표 달성률</span>
                <span className="text-sm font-semibold">
                  {currentWeekGoal.goals.filter((g) => g.completed).length} /{" "}
                  {currentWeekGoal.goals.length}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${
                      (currentWeekGoal.goals.filter((g) => g.completed).length /
                        currentWeekGoal.goals.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Review */}
            {currentWeekGoal.review ? (
              <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                <div className="flex items-center gap-2 mb-2">
                  <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-amber-900 dark:text-amber-100">
                    주간 회고
                  </span>
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  {currentWeekGoal.review}
                </p>
              </div>
            ) : (
              <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    주간 회고 작성
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>주간 회고</DialogTitle>
                    <DialogDescription>
                      이번 주 학습을 돌아보고 회고를 작성하세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="review">회고 내용</Label>
                      <Textarea
                        id="review"
                        placeholder="잘한 점, 개선할 점, 다음 주 계획 등을 작성하세요"
                        rows={6}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddReview} className="w-full">
                      저장
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              이번 주 학습 목표를 설정하세요
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              목표 설정하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
