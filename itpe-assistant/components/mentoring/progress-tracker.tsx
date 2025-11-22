'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, BookOpen, Target, Edit2, Check, X, Award } from 'lucide-react';
import { useState } from 'react';
import { useMentoringData } from '@/hooks/use-mentoring-data';
import { cn } from '@/lib/utils';

export function ProgressTracker() {
  const { profile, updateProfile, streak } = useMentoringData();
  const [isEditing, setIsEditing] = useState(false);
  const [targetTopics, setTargetTopics] = useState(profile.targetTopics.toString());
  const [completedTopics, setCompletedTopics] = useState(profile.completedTopics.toString());

  const progressPercentage = (profile.completedTopics / profile.targetTopics) * 100;
  const remainingTopics = profile.targetTopics - profile.completedTopics;

  const handleSave = () => {
    updateProfile({
      targetTopics: parseInt(targetTopics) || 500,
      completedTopics: parseInt(completedTopics) || 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTargetTopics(profile.targetTopics.toString());
    setCompletedTopics(profile.completedTopics.toString());
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          학습 진도
        </CardTitle>
        <CardDescription>목표 달성까지의 여정</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            {/* 메인 프로그레스 바 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">진행률</span>
                <span className="font-bold font-serif text-primary">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{profile.completedTopics}개 완료</span>
                <span>목표 {profile.targetTopics}개</span>
              </div>
            </div>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground">남은 주제</span>
                </div>
                <p className="text-2xl font-bold font-serif text-foreground">
                  {remainingTopics}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground">연속 학습</span>
                </div>
                <p className="text-2xl font-bold font-serif text-foreground">
                  {streak.currentStreak}일
                </p>
              </div>
            </div>

            {/* 동기부여 메시지 */}
            <div
              className={cn(
                'p-3 rounded-lg border text-sm',
                progressPercentage >= 75
                  ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                  : progressPercentage >= 50
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400'
                    : progressPercentage >= 25
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                      : 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400'
              )}
            >
              {progressPercentage >= 75 ? (
                <>
                  <p className="font-medium mb-1">거의 다 왔어요!</p>
                  <p className="text-xs opacity-90">
                    마지막 스퍼트! 합격이 코앞입니다 🎉
                  </p>
                </>
              ) : progressPercentage >= 50 ? (
                <>
                  <p className="font-medium mb-1">절반을 넘었습니다!</p>
                  <p className="text-xs opacity-90">
                    꾸준한 학습이 결실을 맺고 있어요 💪
                  </p>
                </>
              ) : progressPercentage >= 25 ? (
                <>
                  <p className="font-medium mb-1">좋은 시작입니다!</p>
                  <p className="text-xs opacity-90">
                    이 속도를 유지하면 목표 달성 가능해요 ⚡
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium mb-1">여정의 시작</p>
                  <p className="text-xs opacity-90">
                    매일 조금씩, 꾸준히 나아가세요 🚀
                  </p>
                </>
              )}
            </div>

            {/* 학습 스트릭 정보 */}
            {streak.currentStreak > 0 && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">
                      {streak.currentStreak}일 연속 학습 중! 🔥
                    </p>
                    <p className="text-xs text-muted-foreground">
                      최장 기록: {streak.longestStreak}일 • 총 {streak.totalDays}일 학습
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              진도 업데이트
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="target-topics" className="text-sm font-medium">
                목표 주제 수
              </label>
              <Input
                id="target-topics"
                type="number"
                value={targetTopics}
                onChange={(e) => setTargetTopics(e.target.value)}
                placeholder="500"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="completed-topics" className="text-sm font-medium">
                완료한 주제 수
              </label>
              <Input
                id="completed-topics"
                type="number"
                value={completedTopics}
                onChange={(e) => setCompletedTopics(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                저장
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
