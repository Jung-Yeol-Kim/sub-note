'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Heart,
  Lightbulb,
  Target,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { useMentoringData } from '@/hooks/use-mentoring-data';
import type { MoodType, DailyCheckInFormData } from '@/lib/types/mentoring';
import { cn } from '@/lib/utils';

const moodOptions: { value: MoodType; label: string; emoji: string; color: string }[] = [
  { value: 'great', label: '최고!', emoji: '😄', color: 'bg-green-500' },
  { value: 'good', label: '좋음', emoji: '😊', color: 'bg-blue-500' },
  { value: 'okay', label: '괜찮음', emoji: '😐', color: 'bg-yellow-500' },
  { value: 'tired', label: '피곤함', emoji: '😫', color: 'bg-orange-500' },
  { value: 'struggling', label: '힘듦', emoji: '😰', color: 'bg-red-500' },
];

export function DailyCheckIn() {
  const { getTodayCheckIn, createDailyCheckIn, streak } = useMentoringData();
  const todayCheckIn = getTodayCheckIn();

  const [isChecking, setIsChecking] = useState(false);
  const [formData, setFormData] = useState<DailyCheckInFormData>({
    goals: [''],
    accomplishments: [''],
    studyTime: 0,
    mood: 'good',
    moodNote: '',
    challenges: '',
    learnings: '',
    tomorrowPlan: '',
  });

  const handleAddGoal = () => {
    setFormData({ ...formData, goals: [...formData.goals, ''] });
  };

  const handleRemoveGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index),
    });
  };

  const handleGoalChange = (index: number, value: string) => {
    const updated = [...formData.goals];
    updated[index] = value;
    setFormData({ ...formData, goals: updated });
  };

  const handleAddAccomplishment = () => {
    setFormData({ ...formData, accomplishments: [...formData.accomplishments, ''] });
  };

  const handleRemoveAccomplishment = (index: number) => {
    setFormData({
      ...formData,
      accomplishments: formData.accomplishments.filter((_, i) => i !== index),
    });
  };

  const handleAccomplishmentChange = (index: number, value: string) => {
    const updated = [...formData.accomplishments];
    updated[index] = value;
    setFormData({ ...formData, accomplishments: updated });
  };

  const handleSubmit = () => {
    try {
      const validGoals = formData.goals.filter((g) => g.trim() !== '');
      const validAccomplishments = formData.accomplishments.filter((a) => a.trim() !== '');

      if (validGoals.length === 0 || validAccomplishments.length === 0) {
        alert('최소 1개 이상의 목표와 달성 내용을 입력해주세요.');
        return;
      }

      if (formData.studyTime <= 0) {
        alert('학습 시간을 입력해주세요.');
        return;
      }

      createDailyCheckIn({
        ...formData,
        goals: validGoals,
        accomplishments: validAccomplishments,
      });

      // 폼 리셋
      setFormData({
        goals: [''],
        accomplishments: [''],
        studyTime: 0,
        mood: 'good',
        moodNote: '',
        challenges: '',
        learnings: '',
        tomorrowPlan: '',
      });
      setIsChecking(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '체크인에 실패했습니다.');
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          오늘의 체크인
        </CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayCheckIn ? (
          <>
            {/* 완료 메시지 */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-lg mb-1">오늘도 수고하셨어요! 🎉</p>
                  <p className="text-sm text-muted-foreground">
                    {streak.currentStreak > 1
                      ? `${streak.currentStreak}일 연속 학습 중입니다. 대단해요!`
                      : '내일도 화이팅!'}
                  </p>
                </div>
              </div>
            </div>

            {/* 체크인 내용 */}
            <div className="space-y-4">
              {/* 기분 */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {moodOptions.find((m) => m.value === todayCheckIn.mood)?.emoji}{' '}
                  {moodOptions.find((m) => m.value === todayCheckIn.mood)?.label}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {todayCheckIn.studyTime}분
                </Badge>
              </div>

              {/* 오늘의 목표 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">오늘의 목표</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {todayCheckIn.goals.map((goal, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 달성한 것들 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">달성한 것들</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {todayCheckIn.accomplishments.map((acc, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">
                      {acc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 배운 점 */}
              {todayCheckIn.learnings && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">배운 점</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6 whitespace-pre-wrap">
                    {todayCheckIn.learnings}
                  </p>
                </div>
              )}

              {/* 내일 계획 */}
              {todayCheckIn.tomorrowPlan && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">내일 계획</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6 whitespace-pre-wrap">
                    {todayCheckIn.tomorrowPlan}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : isChecking ? (
          <div className="space-y-4">
            {/* 기분 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                오늘 기분은 어떤가요?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-center',
                      formData.mood === mood.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 학습 시간 */}
            <div className="space-y-2">
              <label htmlFor="study-time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                오늘 학습 시간 (분)
              </label>
              <Input
                id="study-time"
                type="number"
                value={formData.studyTime || ''}
                onChange={(e) =>
                  setFormData({ ...formData, studyTime: parseInt(e.target.value) || 0 })
                }
                placeholder="120"
                min="1"
              />
            </div>

            {/* 오늘의 목표 */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                오늘의 목표
              </label>
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    placeholder={`목표 ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.goals.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveGoal(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddGoal} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                목표 추가
              </Button>
            </div>

            {/* 달성한 것들 */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                달성한 것들
              </label>
              {formData.accomplishments.map((acc, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={acc}
                    onChange={(e) => handleAccomplishmentChange(index, e.target.value)}
                    placeholder={`달성 ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.accomplishments.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAccomplishment(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddAccomplishment}
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                달성 추가
              </Button>
            </div>

            {/* 배운 점 (선택) */}
            <div className="space-y-2">
              <label htmlFor="learnings" className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                오늘 배운 점 (선택)
              </label>
              <Textarea
                id="learnings"
                value={formData.learnings}
                onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                placeholder="오늘 학습하면서 새롭게 알게 된 내용..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* 내일 계획 (선택) */}
            <div className="space-y-2">
              <label
                htmlFor="tomorrow-plan"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                내일 계획 (선택)
              </label>
              <Textarea
                id="tomorrow-plan"
                value={formData.tomorrowPlan}
                onChange={(e) => setFormData({ ...formData, tomorrowPlan: e.target.value })}
                placeholder="내일은 무엇을 할까요?"
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubmit} className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                체크인 완료
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({
                    goals: [''],
                    accomplishments: [''],
                    studyTime: 0,
                    mood: 'good',
                    moodNote: '',
                    challenges: '',
                    learnings: '',
                    tomorrowPlan: '',
                  });
                  setIsChecking(false);
                }}
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="font-medium mb-1">아직 오늘 체크인을 하지 않았어요</p>
              <p className="text-sm text-muted-foreground">
                오늘의 학습을 기록하고 동기부여를 받으세요
              </p>
            </div>
            <Button onClick={() => setIsChecking(true)} size="lg">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              오늘 체크인하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
