import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Target, Calendar, Award, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with actual database queries
const mockEvaluations = [
  {
    id: "1",
    title: "OAuth 2.0 Grant Types",
    authorType: "human",
    createdAt: "2024-11-20",
    totalScore: 26,
    maxScore: 30,
    status: "completed",
    category: "정보보안",
    evaluator: "AI Grader",
  },
  {
    id: "2",
    title: "Kubernetes Service Mesh",
    authorType: "ai",
    createdAt: "2024-11-19",
    totalScore: 24,
    maxScore: 30,
    status: "completed",
    category: "정보시스템구축관리",
    evaluator: "AI Grader",
  },
  {
    id: "3",
    title: "Zero Trust Architecture",
    authorType: "human",
    createdAt: "2024-11-18",
    totalScore: 22,
    maxScore: 30,
    status: "completed",
    category: "정보보안",
    evaluator: "AI Grader",
  },
  {
    id: "4",
    title: "LLMOps 파이프라인",
    authorType: "ai",
    createdAt: "2024-11-17",
    totalScore: 28,
    maxScore: 30,
    status: "completed",
    category: "최신기술",
    evaluator: "AI Grader",
  },
];

const categories = [
  "전체",
  "정보 전략 및 관리",
  "소프트웨어공학",
  "업무 프로세스",
  "정보시스템구축관리",
  "정보보안",
  "최신기술",
];

export default function EvaluationsPage() {
  // Calculate statistics
  const totalEvaluations = mockEvaluations.length;
  const avgScore = mockEvaluations.reduce((sum, e) => sum + e.totalScore, 0) / totalEvaluations;
  const highScoreCount = mockEvaluations.filter(e => e.totalScore >= 24).length;
  const humanCount = mockEvaluations.filter(e => e.authorType === "human").length;
  const aiCount = mockEvaluations.filter(e => e.authorType === "ai").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">답안 평가</h1>
          <p className="text-muted-foreground">
            AI와 인간이 작성한 답안을 6가지 평가 기준으로 채점
          </p>
        </div>
        <Link href="/evaluations/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 평가 요청
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 평가</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">
              인간: {humanCount}개 / AI: {aiCount}개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore.toFixed(1)}/30</div>
            <p className="text-xs text-muted-foreground">
              {((avgScore / 30) * 100).toFixed(1)}% 달성
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고득점 답안</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highScoreCount}</div>
            <p className="text-xs text-muted-foreground">
              24점 이상 ({((highScoreCount / totalEvaluations) * 100).toFixed(0)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              지난 주 대비 +2
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="답안 제목 검색..."
                  className="pl-9"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="작성자" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="human">인간</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="score_desc">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">점수 높은순</SelectItem>
                <SelectItem value="score_asc">점수 낮은순</SelectItem>
                <SelectItem value="date_desc">최신순</SelectItem>
                <SelectItem value="date_asc">오래된순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockEvaluations.map((evaluation) => (
          <Link key={evaluation.id} href={`/evaluations/${evaluation.id}`}>
            <Card className="h-full transition-smooth hover:shadow-md hover:border-accent/40 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge
                    variant={evaluation.authorType === "human" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {evaluation.authorType === "human" ? "인간" : "AI"}
                  </Badge>
                  <Badge
                    variant={evaluation.totalScore >= 24 ? "default" : "outline"}
                    className="text-xs"
                  >
                    {evaluation.totalScore}/30
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 mb-2">
                  {evaluation.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {evaluation.category} • {evaluation.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Score Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>총점</span>
                      <span>{((evaluation.totalScore / evaluation.maxScore) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          evaluation.totalScore >= 24
                            ? "bg-green-500"
                            : evaluation.totalScore >= 18
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${(evaluation.totalScore / evaluation.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Score Level */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">평가 등급</span>
                    <Badge variant="outline">
                      {evaluation.totalScore >= 24
                        ? "우수"
                        : evaluation.totalScore >= 18
                          ? "양호"
                          : "보통"}
                    </Badge>
                  </div>

                  {/* Evaluator */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">평가자</span>
                    <span className="text-xs">{evaluation.evaluator}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {mockEvaluations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">평가 기록이 없습니다</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              첫 번째 답안을 평가하여 학습 진도를 추적하세요.
            </p>
            <Link href="/evaluations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                새 평가 요청
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
