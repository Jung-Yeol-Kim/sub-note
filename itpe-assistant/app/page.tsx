import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Sparkles, TrendingUp, Clock, Target, Trophy } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          환영합니다
        </h1>
        <p className="text-lg text-muted-foreground">
          정보관리기술사 합격을 위한 여정을 계속하세요
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">내 서브노트</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">24</div>
            <p className="text-xs text-muted-foreground">이번 주 +3</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">학습 시간</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">32.5</div>
            <p className="text-xs text-muted-foreground">이번 달</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">78</div>
            <p className="text-xs text-muted-foreground">지난 달 대비 +5</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm transition-smooth hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">학습한 주제</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">142</div>
            <p className="text-xs text-muted-foreground">총 500개 이상 중</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">최근 서브노트</CardTitle>
            <CardDescription>최근 학습 자료</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "OAuth 2.0 Grant Types", category: "보안", status: "completed" },
              { title: "Kubernetes Architecture", category: "클라우드", status: "in_review" },
              { title: "Zero Trust Security", category: "보안", status: "draft" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 transition-smooth hover:bg-card hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "completed"
                      ? "default"
                      : item.status === "in_review"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {item.status === "completed" ? "완료" : item.status === "in_review" ? "검토 중" : "작성 중"}
                </Badge>
              </div>
            ))}
            <Link href="/sub-notes">
              <Button variant="outline" className="w-full mt-2">
                모든 서브노트 보기
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="shadow-sm border-accent/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI 추천
            </CardTitle>
            <CardDescription>다음에 학습할 추천 주제</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "API Gateway Patterns",
                rationale: "최근 시험에서 출제 증가",
                priority: "high",
              },
              {
                title: "Service Mesh Architecture",
                rationale: "취약 분야 관련",
                priority: "medium",
              },
              {
                title: "Container Security Best Practices",
                rationale: "최근 학습 내용과 관련",
                priority: "medium",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-accent/20 bg-accent/5 transition-smooth hover:bg-accent/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-sm">{item.title}</p>
                  <Badge
                    variant={item.priority === "high" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {item.priority === "high" ? "높음" : "보통"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.rationale}</p>
              </div>
            ))}
            <Link href="/ai-suggestions">
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90">
                모든 추천 보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">빠른 작업</CardTitle>
          <CardDescription>효율적인 학습을 위한 주요 작업</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/sub-notes/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                <span>서브노트 작성</span>
              </Button>
            </Link>
            <Link href="/mock-exam/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 border-accent/50 hover:bg-accent/10">
                <Trophy className="h-5 w-5 text-accent" />
                <span>실전 모의고사</span>
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span>주제 탐색</span>
              </Button>
            </Link>
            <Link href="/evaluations/new">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span>평가 요청</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
