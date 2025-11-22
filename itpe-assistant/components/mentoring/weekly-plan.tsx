'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Plus, Check, Circle, Trash2, FileEdit } from 'lucide-react';
import { useState } from 'react';
import { useMentoringData } from '@/hooks/use-mentoring-data';
import { cn } from '@/lib/utils';
import type { WeeklyPlan as WeeklyPlanType } from '@/lib/types/mentoring';

export function WeeklyPlan() {
  const { getCurrentWeekPlan, createWeeklyPlan, toggleWeeklyGoal, addWeeklyReview } =
    useMentoringData();
  const currentPlan = getCurrentWeekPlan();

  const [isCreating, setIsCreating] = useState(false);
  const [newGoals, setNewGoals] = useState<string[]>(['']);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewText, setReviewText] = useState('');

  const handleAddGoal = () => {
    setNewGoals([...newGoals, '']);
  };

  const handleRemoveGoal = (index: number) => {
    setNewGoals(newGoals.filter((_, i) => i !== index));
  };

  const handleGoalChange = (index: number, value: string) => {
    const updated = [...newGoals];
    updated[index] = value;
    setNewGoals(updated);
  };

  const handleCreatePlan = () => {
    const validGoals = newGoals.filter((g) => g.trim() !== '');
    if (validGoals.length > 0) {
      createWeeklyPlan({ goals: validGoals });
      setNewGoals(['']);
      setIsCreating(false);
    }
  };

  const handleSaveReview = () => {
    if (currentPlan && reviewText.trim()) {
      addWeeklyReview(currentPlan.id, { review: reviewText });
      setReviewText('');
      setIsReviewing(false);
    }
  };

  const getWeekDateRange = (plan: WeeklyPlanType) => {
    const start = new Date(plan.weekStartDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`;
  };

  const completedGoalsCount = currentPlan
    ? currentPlan.goals.filter((g) => g.completed).length
    : 0;
  const totalGoalsCount = currentPlan ? currentPlan.goals.length : 0;
  const completionRate =
    totalGoalsCount > 0 ? (completedGoalsCount / totalGoalsCount) * 100 : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          이번 주 학습 플랜
        </CardTitle>
        <CardDescription>
          {currentPlan ? getWeekDateRange(currentPlan) : '주간 목표를 설정하세요'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPlan ? (
          <>
            {/* 진행률 표시 */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">주간 목표 달성률</span>
                <span className="text-sm font-bold text-primary">
                  {completionRate.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {completedGoalsCount}/{totalGoalsCount} 완료
                </span>
              </div>
            </div>

            {/* 목표 리스트 */}
            <div className="space-y-2">
              {currentPlan.goals.map((goal) => (
                <div
                  key={goal.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm',
                    goal.completed
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-card border-border hover:border-primary/30'
                  )}
                  onClick={() => toggleWeeklyGoal(currentPlan.id, goal.id)}
                >
                  <div className="mt-0.5">
                    {goal.completed ? (
                      <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                        <Check className="h-3 w-3 text-accent-foreground" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm',
                        goal.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      )}
                    >
                      {goal.text}
                    </p>
                    {goal.completed && goal.completedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        완료:{' '}
                        {new Date(goal.completedAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 주간 리뷰 */}
            {!isReviewing ? (
              currentPlan.review ? (
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-start gap-2 mb-2">
                    <FileEdit className="h-4 w-4 text-accent mt-0.5" />
                    <span className="text-sm font-medium">주간 리뷰</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {currentPlan.review}
                  </p>
                  {currentPlan.reviewedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      작성:{' '}
                      {new Date(currentPlan.reviewedAt).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsReviewing(true)}
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  주간 리뷰 작성
                </Button>
              )
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="이번 주를 돌아보며... (잘한 점, 개선할 점, 다음 주 계획 등)"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveReview} className="flex-1">
                    리뷰 저장
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReviewText('');
                      setIsReviewing(false);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : isCreating ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">이번 주 학습 목표를 입력하세요</p>
            {newGoals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                  placeholder={`목표 ${index + 1}`}
                  className="flex-1"
                />
                {newGoals.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGoal(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={handleAddGoal} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              목표 추가
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleCreatePlan} className="flex-1">
                플랜 생성
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewGoals(['']);
                  setIsCreating(false);
                }}
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="font-medium mb-1">이번 주 플랜이 없습니다</p>
              <p className="text-sm text-muted-foreground">
                주간 학습 목표를 설정하고 체계적으로 학습하세요
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              주간 플랜 만들기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
