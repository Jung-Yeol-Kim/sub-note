'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Target, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useMentoringData } from '@/hooks/use-mentoring-data';
import { cn } from '@/lib/utils';

export function DDayCard() {
  const { profile, getDDay, updateProfile } = useMentoringData();
  const [isEditing, setIsEditing] = useState(false);
  const [examDate, setExamDate] = useState(profile.examDate || '');

  const dDay = getDDay();

  const handleSave = () => {
    if (examDate) {
      updateProfile({ examDate });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setExamDate(profile.examDate || '');
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          시험 D-Day
        </CardTitle>
        <CardDescription>목표를 향한 여정</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            {profile.examDate ? (
              <div className="space-y-3">
                <div className="text-center p-6 rounded-lg bg-card/50 border border-border">
                  <div
                    className={cn(
                      'text-5xl font-bold font-serif mb-2',
                      dDay !== null && dDay > 0
                        ? 'text-primary'
                        : dDay === 0
                          ? 'text-accent'
                          : 'text-muted-foreground'
                    )}
                  >
                    {dDay !== null ? (
                      dDay > 0 ? (
                        <>D-{dDay}</>
                      ) : dDay === 0 ? (
                        <>D-Day!</>
                      ) : (
                        <>시험 종료</>
                      )
                    ) : (
                      'N/A'
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile.examDate
                      ? new Date(profile.examDate).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '시험 날짜 미설정'}
                  </p>
                </div>

                {dDay !== null && dDay > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-card/50 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-accent" />
                        <span className="text-xs text-muted-foreground">남은 주</span>
                      </div>
                      <p className="text-2xl font-bold font-serif">{Math.ceil(dDay / 7)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-card/50 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span className="text-xs text-muted-foreground">남은 개월</span>
                      </div>
                      <p className="text-2xl font-bold font-serif">
                        {Math.ceil(dDay / 30)}
                      </p>
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
                  시험 날짜 변경
                </Button>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium mb-1">시험 날짜를 설정하세요</p>
                  <p className="text-sm text-muted-foreground">
                    목표 시험일을 설정하고 계획을 세워보세요
                  </p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="mt-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  시험 날짜 설정
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="exam-date" className="text-sm font-medium">
                시험 날짜
              </label>
              <Input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full"
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
