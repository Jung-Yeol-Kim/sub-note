"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Target, TrendingUp, Settings } from "lucide-react";
import type { ExamTarget, LearningProgress } from "@/lib/types/mentoring";

interface LearningJourneyTrackerProps {
  examTarget: ExamTarget;
  progress: LearningProgress;
  onUpdateTarget: (target: Partial<ExamTarget>) => void;
  onUpdateProgress: (completed: number, inProgress: number) => void;
}

export function LearningJourneyTracker({
  examTarget,
  progress,
  onUpdateTarget,
  onUpdateProgress,
}: LearningJourneyTrackerProps) {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [targetForm, setTargetForm] = useState({
    examDate: examTarget.examDate.split("T")[0],
    examRound: examTarget.examRound,
  });
  const [progressForm, setProgressForm] = useState({
    completed: progress.completedTopics,
    inProgress: progress.inProgressTopics,
  });

  const handleUpdateTarget = () => {
    onUpdateTarget({
      examDate: new Date(targetForm.examDate).toISOString(),
      examRound: targetForm.examRound,
    });
    setIsEditingTarget(false);
  };

  const handleUpdateProgress = () => {
    onUpdateProgress(progressForm.completed, progressForm.inProgress);
    setIsEditingProgress(false);
  };

  const getDDayColor = (days: number) => {
    if (days < 30) return "text-red-500";
    if (days < 60) return "text-orange-500";
    return "text-primary";
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">학습 여정</CardTitle>
          </div>
          <Dialog open={isEditingTarget} onOpenChange={setIsEditingTarget}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>시험 목표 설정</DialogTitle>
                <DialogDescription>
                  응시할 시험 정보를 입력하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="examDate">시험 날짜</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={targetForm.examDate}
                    onChange={(e) =>
                      setTargetForm({ ...targetForm, examDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="examRound">시험 회차</Label>
                  <Input
                    id="examRound"
                    placeholder="예: 155회"
                    value={targetForm.examRound}
                    onChange={(e) =>
                      setTargetForm({ ...targetForm, examRound: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleUpdateTarget} className="w-full">
                  저장
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>목표를 향한 진행 상황</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* D-Day Counter */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">시험까지</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {examTarget.examRound}
            </span>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getDDayColor(examTarget.daysUntilExam)}`}>
              D-{examTarget.daysUntilExam}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(examTarget.examDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">학습 진도</h3>
            </div>
            <Dialog open={isEditingProgress} onOpenChange={setIsEditingProgress}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>진도 업데이트</DialogTitle>
                  <DialogDescription>
                    학습한 주제 수를 업데이트하세요
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="completed">완료한 주제</Label>
                    <Input
                      id="completed"
                      type="number"
                      min="0"
                      max={progress.totalTopics}
                      value={progressForm.completed}
                      onChange={(e) =>
                        setProgressForm({
                          ...progressForm,
                          completed: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="inProgress">진행 중인 주제</Label>
                    <Input
                      id="inProgress"
                      type="number"
                      min="0"
                      value={progressForm.inProgress}
                      onChange={(e) =>
                        setProgressForm({
                          ...progressForm,
                          inProgress: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <Button onClick={handleUpdateProgress} className="w-full">
                    저장
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">전체 진행률</span>
              <span className="font-semibold">{progress.percentComplete}%</span>
            </div>
            <Progress value={progress.percentComplete} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {progress.completedTopics}
              </div>
              <div className="text-xs text-muted-foreground mt-1">완료</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {progress.inProgressTopics}
              </div>
              <div className="text-xs text-muted-foreground mt-1">진행 중</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {progress.totalTopics - progress.completedTopics - progress.inProgressTopics}
              </div>
              <div className="text-xs text-muted-foreground mt-1">남은 주제</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
