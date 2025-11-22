'use client';

import { DDayCard } from '@/components/mentoring/d-day-card';
import { ProgressTracker } from '@/components/mentoring/progress-tracker';
import { WeeklyPlan } from '@/components/mentoring/weekly-plan';
import { DailyCheckIn } from '@/components/mentoring/daily-checkin';
import { useMentoringData } from '@/hooks/use-mentoring-data';
import { Sparkles, Target } from 'lucide-react';

export default function MentoringPage() {
  const { profile, isLoading } = useMentoringData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Sparkles className="h-10 w-10 text-primary" />
          멘토링 대시보드
        </h1>
        <p className="text-lg text-muted-foreground">
          {profile.name}님, {profile.motivation}
        </p>
      </div>

      {/* 동기부여 메시지 */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <Target className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-lg mb-1">매일 조금씩, 꾸준히 나아가세요</p>
            <p className="text-sm text-muted-foreground">
              합격자들은 말합니다: "멘토링 없이 혼자 합격하기는 매우 어렵다." 하지만 AI
              멘토가 당신과 함께합니다. 매일 쓰기 연습을 하고, 구체적인 피드백을 받으며,
              장기전을 위한 심리적 지원을 받으세요.
            </p>
          </div>
        </div>
      </div>

      {/* Top Row: D-Day & Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DDayCard />
        <ProgressTracker />
      </div>

      {/* Middle Row: Daily Check-in */}
      <DailyCheckIn />

      {/* Bottom Row: Weekly Plan */}
      <WeeklyPlan />

      {/* Tips Section */}
      <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          합격자들의 조언
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="font-medium text-sm mb-1">📝 매일 쓰기 연습</p>
            <p className="text-xs text-muted-foreground">
              2개월 이상 매일 작성이 합격의 원동력입니다. 하루도 빠짐없이!
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="font-medium text-sm mb-1">🔄 랜덤 복습</p>
            <p className="text-xs text-muted-foreground">
              집중력 저하를 방지하고 전체 주제의 균형을 유지하세요.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="font-medium text-sm mb-1">🎯 구체적 피드백</p>
            <p className="text-xs text-muted-foreground">
              "4점을 5점으로" 올리는 전략이 중요합니다. 세밀한 개선을!
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="font-medium text-sm mb-1">💪 장기전 마인드</p>
            <p className="text-xs text-muted-foreground">
              심리적 지원과 격려가 중요합니다. 슬럼프를 극복하세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
