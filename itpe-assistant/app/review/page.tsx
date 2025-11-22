import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Clock, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ReviewPage() {
  // Mock data for spaced repetition
  const reviewData = {
    dueToday: 12,
    dueThisWeek: 45,
    totalReviews: 234,
    averageRetention: 78,
  };

  const dueTopics = [
    {
      id: "1",
      title: "OAuth 2.0 Grant Types",
      category: "보안",
      lastReviewed: new Date("2024-11-15"),
      repetitionNumber: 3,
      nextReviewDate: new Date("2024-11-22"),
      difficulty: "medium",
    },
    {
      id: "2",
      title: "Kubernetes Pod Lifecycle",
      category: "클라우드",
      lastReviewed: new Date("2024-11-10"),
      repetitionNumber: 5,
      nextReviewDate: new Date("2024-11-22"),
      difficulty: "hard",
    },
    {
      id: "3",
      title: "TCP/IP 4계층 모델",
      category: "네트워크",
      lastReviewed: new Date("2024-11-18"),
      repetitionNumber: 2,
      nextReviewDate: new Date("2024-11-22"),
      difficulty: "easy",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          스마트 복습
        </h1>
        <p className="text-lg text-muted-foreground">
          간격 반복 학습으로 효과적으로 기억하세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘 복습</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {reviewData.dueToday}
            </div>
            <p className="text-xs text-muted-foreground">개 주제</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviewData.dueThisWeek}</div>
            <p className="text-xs text-muted-foreground">개 주제</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 복습</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviewData.totalReviews}</div>
            <p className="text-xs text-muted-foreground">회</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 기억률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {reviewData.averageRetention}%
            </div>
            <p className="text-xs text-muted-foreground">최근 30일</p>
          </CardContent>
        </Card>
      </div>

      {/* Start Review Button */}
      <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <RefreshCw className="h-12 w-12 text-primary mx-auto" />
            <div>
              <h3 className="text-2xl font-bold mb-2">
                오늘 복습할 주제가 {reviewData.dueToday}개 있습니다
              </h3>
              <p className="text-muted-foreground">
                지금 복습을 시작하여 기억을 강화하세요
              </p>
            </div>
            <Link href="/review/start">
              <Button size="lg" className="text-lg px-8 py-6">
                복습 시작하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Due Topics List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>오늘 복습할 주제</CardTitle>
          <CardDescription>
            간격 반복 알고리즘에 따라 선정된 주제들
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dueTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-lg border hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{topic.category}</Badge>
                    <Badge
                      variant={
                        topic.difficulty === "easy"
                          ? "default"
                          : topic.difficulty === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {topic.difficulty === "easy"
                        ? "쉬움"
                        : topic.difficulty === "medium"
                          ? "보통"
                          : "어려움"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {topic.repetitionNumber}회차 복습
                    </span>
                  </div>
                  <p className="font-medium">{topic.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    마지막 복습: {topic.lastReviewed.toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Link href="/review/schedule">
            <Button variant="outline" className="w-full">
              전체 복습 일정 보기
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>간격 반복 학습이란?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            간격 반복 학습(Spaced Repetition)은 과학적으로 입증된 학습 방법으로,
            기억이 희미해지기 직전에 복습함으로써 장기 기억을 강화합니다.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border bg-card/50">
              <div className="font-semibold mb-2">1단계: 첫 학습</div>
              <p className="text-sm text-muted-foreground">
                새로운 주제를 학습하면 1일 후 첫 복습
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card/50">
              <div className="font-semibold mb-2">2단계: 간격 확대</div>
              <p className="text-sm text-muted-foreground">
                성공적으로 기억하면 간격이 2배씩 증가
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card/50">
              <div className="font-semibold mb-2">3단계: 장기 기억</div>
              <p className="text-sm text-muted-foreground">
                반복할수록 간격이 길어져 효율적 학습
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
