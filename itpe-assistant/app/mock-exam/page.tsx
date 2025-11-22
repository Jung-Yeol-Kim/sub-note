import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

export default function MockExamPage() {
  // Mock data for recent exam sessions
  const recentSessions = [
    {
      id: "1",
      title: "클라우드 보안 모의고사",
      questionsCount: 4,
      completedAt: new Date("2024-11-20"),
      totalScore: 78,
    },
    {
      id: "2",
      title: "네트워크 아키텍처 모의고사",
      questionsCount: 5,
      completedAt: new Date("2024-11-18"),
      totalScore: 82,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          실전 모의고사
        </h1>
        <p className="text-lg text-muted-foreground">
          실제 시험과 동일한 환경에서 연습하세요
        </p>
      </div>

      {/* Start New Exam Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/mock-exam/new?type=full" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-all cursor-pointer border-primary/30 hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                전체 모의고사
              </CardTitle>
              <CardDescription>
                4시간 제한, 4개 문항
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                실제 시험과 동일한 조건으로 전체 모의고사를 진행합니다.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/mock-exam/new?type=partial" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                부분 모의고사
              </CardTitle>
              <CardDescription>
                주제 선택, 1-2개 문항
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                특정 주제나 분야를 선택하여 연습합니다.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/mock-exam/new?type=random" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                랜덤 모의고사
              </CardTitle>
              <CardDescription>
                무작위 선택, 1-3개 문항
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI가 추천하는 랜덤 주제로 연습합니다.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 모의고사</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">이번 달 +3</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75점</div>
            <p className="text-xs text-muted-foreground">지난 달 대비 +8</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 작성 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52분</div>
            <p className="text-xs text-muted-foreground">문항 당</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">개선도</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+12%</div>
            <p className="text-xs text-muted-foreground">최근 30일</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>최근 모의고사</CardTitle>
          <CardDescription>지난 모의고사 결과</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentSessions.map((session) => (
            <Link
              key={session.id}
              href={`/mock-exam/${session.id}`}
              className="block"
            >
              <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/10 transition-colors">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.questionsCount}개 문항 · {session.completedAt.toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={session.totalScore >= 80 ? "default" : "secondary"}>
                    {session.totalScore}점
                  </Badge>
                </div>
              </div>
            </Link>
          ))}

          <Link href="/mock-exam/history">
            <Button variant="outline" className="w-full">
              전체 기록 보기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
