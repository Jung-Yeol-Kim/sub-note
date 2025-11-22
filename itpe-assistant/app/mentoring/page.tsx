import { LearningJourney } from "@/components/dashboard/learning-journey";
import { DailyCheckIn } from "@/components/dashboard/daily-checkin";
import { WeeklyPlan } from "@/components/dashboard/weekly-plan";
import { EncouragementMessage } from "@/components/dashboard/encouragement-message";
import { WritingChallenge } from "@/components/dashboard/writing-challenge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";

// This will be replaced with actual data fetching
async function getDashboardData() {
  // Mock data for demonstration
  return {
    studyGoal: {
      examDate: new Date("2025-05-15"),
      daysUntilExam: 174,
      totalTopics: 500,
      completedTopics: 142,
    },
    streak: {
      currentStreak: 7,
      longestStreak: 14,
      totalStudyHours: 85,
    },
    weeklyPlan: {
      weekNumber: 12,
      goalTopics: [
        "OAuth 2.0 인증 프로토콜",
        "Kubernetes 아키텍처",
        "Zero Trust 보안 모델",
        "API Gateway 패턴",
        "Service Mesh 개념",
      ],
      completedTopics: ["OAuth 2.0 인증 프로토콜", "Kubernetes 아키텍처"],
      goalStudyMinutes: 840, // 14시간
      actualStudyMinutes: 520, // 8.7시간
    },
    dailyCheckIn: {
      hasCheckedInToday: false,
    },
    encouragement: {
      message: "7일 연속 학습 달성! 꾸준함이 합격의 열쇠입니다. 오늘도 화이팅!",
      type: "celebration" as const,
    },
    writingChallenge: {
      todaysTopic: "컨테이너 오케스트레이션의 필요성과 Kubernetes의 핵심 구성요소",
      category: "클라우드",
      isCompleted: false,
      consecutiveDays: 7,
    },
    milestones: [
      {
        title: "연속 학습 7일 달성",
        achieved: true,
        achievedAt: new Date(),
      },
      {
        title: "100개 주제 완료",
        progress: 142,
        target: 100,
        achieved: true,
      },
      {
        title: "150개 주제 완료",
        progress: 142,
        target: 150,
        achieved: false,
      },
    ],
  };
}

async function handleDailyCheckIn(data: {
  mood: string;
  energyLevel: number;
  notes: string;
}) {
  "use server";
  // This will be implemented with actual DB operations
  console.log("Check-in data:", data);
}

export default async function MentoringDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          멘토링 대시보드
        </h1>
        <p className="text-lg text-muted-foreground">
          당신의 합격 여정을 함께 응원합니다
        </p>
      </div>

      {/* Top Section: Learning Journey */}
      <LearningJourney
        examDate={data.studyGoal.examDate}
        daysUntilExam={data.studyGoal.daysUntilExam}
        totalTopics={data.studyGoal.totalTopics}
        completedTopics={data.studyGoal.completedTopics}
        currentStreak={data.streak.currentStreak}
        longestStreak={data.streak.longestStreak}
        totalStudyHours={data.streak.totalStudyHours}
      />

      {/* Encouragement Message */}
      <EncouragementMessage
        message={data.encouragement.message}
        type={data.encouragement.type}
      />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <DailyCheckIn
            hasCheckedInToday={data.dailyCheckIn.hasCheckedInToday}
            onCheckIn={handleDailyCheckIn}
          />

          <WritingChallenge
            todaysTopic={data.writingChallenge.todaysTopic}
            category={data.writingChallenge.category}
            isCompleted={data.writingChallenge.isCompleted}
            consecutiveDays={data.writingChallenge.consecutiveDays}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <WeeklyPlan
            weekNumber={data.weeklyPlan.weekNumber}
            goalTopics={data.weeklyPlan.goalTopics}
            completedTopics={data.weeklyPlan.completedTopics}
            goalStudyMinutes={data.weeklyPlan.goalStudyMinutes}
            actualStudyMinutes={data.weeklyPlan.actualStudyMinutes}
          />

          {/* Milestones */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                최근 달성 마일스톤
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    milestone.achieved
                      ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                      : "border-border bg-card/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{milestone.title}</p>
                    {milestone.achieved ? (
                      <Badge className="bg-green-500">달성</Badge>
                    ) : (
                      <Badge variant="outline">
                        {milestone.progress} / {milestone.target}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Stats */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            이번 주 활동 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg border bg-card/50">
              <p className="text-sm text-muted-foreground mb-1">학습 시간</p>
              <p className="text-2xl font-bold">
                {Math.floor(data.weeklyPlan.actualStudyMinutes / 60)}h
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card/50">
              <p className="text-sm text-muted-foreground mb-1">완료한 주제</p>
              <p className="text-2xl font-bold">
                {data.weeklyPlan.completedTopics.length}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card/50">
              <p className="text-sm text-muted-foreground mb-1">연속 학습</p>
              <p className="text-2xl font-bold">{data.streak.currentStreak}일</p>
            </div>
            <div className="p-4 rounded-lg border bg-card/50">
              <p className="text-sm text-muted-foreground mb-1">총 진도율</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  (data.studyGoal.completedTopics / data.studyGoal.totalTopics) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
