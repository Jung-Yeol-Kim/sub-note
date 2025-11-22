import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PenTool, Flame, TrendingUp, Award, Calendar } from "lucide-react";
import Link from "next/link";

export default function WritingChallengePage() {
  // Mock data
  const stats = {
    currentStreak: 7,
    longestStreak: 14,
    totalChallenges: 45,
    averageQuality: 75,
    thisMonthCount: 22,
  };

  const recentChallenges = [
    {
      date: new Date("2024-11-22"),
      topic: "컨테이너 오케스트레이션의 필요성과 Kubernetes 핵심 구성요소",
      category: "클라우드",
      completed: true,
      quality: 78,
      wordCount: 850,
      timeSpent: 18,
    },
    {
      date: new Date("2024-11-21"),
      topic: "OAuth 2.0 인증 프로토콜의 Grant Types",
      category: "보안",
      completed: true,
      quality: 82,
      wordCount: 920,
      timeSpent: 22,
    },
    {
      date: new Date("2024-11-20"),
      topic: "Zero Trust 보안 모델과 구현 전략",
      category: "보안",
      completed: true,
      quality: 75,
      wordCount: 780,
      timeSpent: 20,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          매일 쓰기 챌린지
        </h1>
        <p className="text-lg text-muted-foreground">
          매일 한 주제씩 작성하며 실력을 키워보세요
        </p>
      </div>

      {/* Streak Card */}
      <Card className="shadow-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Flame className="h-16 w-16 text-orange-500" />
              <div>
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {stats.currentStreak}일
                </div>
                <p className="text-sm text-muted-foreground">연속 챌린지 달성 중</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-muted-foreground mb-1">
                최장 {stats.longestStreak}일
              </div>
              <p className="text-sm text-muted-foreground">기록 갱신까지 {stats.longestStreak - stats.currentStreak + 1}일</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 챌린지</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChallenges}</div>
            <p className="text-xs text-muted-foreground">이번 달 +{stats.thisMonthCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 품질</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageQuality}</div>
            <p className="text-xs text-muted-foreground">AI 평가 점수</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonthCount}</div>
            <p className="text-xs text-muted-foreground">/ 30일 목표</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">개선도</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+8%</div>
            <p className="text-xs text-muted-foreground">지난 달 대비</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenge */}
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">오늘의 챌린지</CardTitle>
          <CardDescription>
            매일 새로운 주제로 20분간 작성하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <Badge>클라우드</Badge>
              <Badge variant="secondary" className="gap-1">
                <PenTool className="h-3 w-3" />
                20분
              </Badge>
            </div>
            <p className="text-lg font-semibold mb-4">
              서비스 메시(Service Mesh)의 개념과 주요 기능, 그리고 마이크로서비스 아키텍처에서의 필요성
            </p>
            <div className="flex gap-3">
              <Link href="/writing-challenge/today" className="flex-1">
                <Button size="lg" className="w-full">
                  챌린지 시작하기
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                다른 주제로 변경
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Challenges */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>최근 챌린지</CardTitle>
          <CardDescription>지난 챌린지 기록</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentChallenges.map((challenge, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-green-50/50 dark:bg-green-950/20 border-green-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{challenge.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {challenge.date.toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="font-medium mb-2">{challenge.topic}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{challenge.wordCount}자</span>
                    <span>{challenge.timeSpent}분</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      품질: {challenge.quality}점
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link href="/writing-challenge/history">
            <Button variant="outline" className="w-full">
              전체 기록 보기
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Progress This Month */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>이번 달 진행률</CardTitle>
          <CardDescription>
            30일 연속 목표까지 {30 - stats.thisMonthCount}일 남음
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(stats.thisMonthCount / 30) * 100} className="h-3" />
          <div className="text-center text-sm text-muted-foreground">
            {stats.thisMonthCount} / 30일 완료 ({Math.round((stats.thisMonthCount / 30) * 100)}%)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
