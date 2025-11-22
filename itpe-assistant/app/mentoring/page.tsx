import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Flame,
  BookOpen,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { DDayTracker } from "@/components/mentoring/d-day-tracker";
import { DailyCheckIn } from "@/components/mentoring/daily-check-in";
import { WeeklyPlan } from "@/components/mentoring/weekly-plan";
import { ProgressOverview } from "@/components/mentoring/progress-overview";
import { StreakTracker } from "@/components/mentoring/streak-tracker";
import { MotivationalQuote } from "@/components/mentoring/motivational-quote";

export default function MentoringDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Award className="h-10 w-10 text-accent" />
          멘토링 대시보드
        </h1>
        <p className="text-lg text-muted-foreground">
          합격까지의 여정, 함께 걸어가요 💪
        </p>
      </div>

      {/* Motivational Quote */}
      <MotivationalQuote />

      {/* Top Stats Row - D-Day and Streak */}
      <div className="grid gap-4 md:grid-cols-2">
        <DDayTracker />
        <StreakTracker />
      </div>

      {/* Progress Overview */}
      <ProgressOverview />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Check-in */}
        <DailyCheckIn />

        {/* Weekly Plan */}
        <WeeklyPlan />
      </div>

      {/* Quick Actions for Practice */}
      <Card className="shadow-sm border-accent/30">
        <CardHeader>
          <CardTitle className="text-xl">실전 연습</CardTitle>
          <CardDescription>매일 쓰기 연습으로 실력을 향상시키세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/mentoring/mock-exam">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">모의고사 응시</span>
                <span className="text-xs text-muted-foreground">실전 타이머 모드</span>
              </Button>
            </Link>
            <Link href="/mentoring/random-review">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">랜덤 복습</span>
                <span className="text-xs text-muted-foreground">무작위 주제 연습</span>
              </Button>
            </Link>
            <Link href="/mentoring/analytics">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">학습 분석</span>
                <span className="text-xs text-muted-foreground">상세 통계 보기</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            최근 성과
          </CardTitle>
          <CardDescription>당신의 노력이 결실을 맺고 있습니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: "7일 연속 학습",
              description: "꾸준함이 힘입니다!",
              icon: Flame,
              color: "text-orange-500",
            },
            {
              title: "이번 주 목표 달성",
              description: "5개 주제 완료",
              icon: CheckCircle2,
              color: "text-green-500",
            },
            {
              title: "평균 점수 향상",
              description: "지난 주 대비 +8점",
              icon: TrendingUp,
              color: "text-blue-500",
            },
          ].map((achievement, i) => {
            const Icon = achievement.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50 transition-smooth hover:bg-card hover:shadow-sm"
              >
                <div className={`h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${achievement.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  새로움
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
