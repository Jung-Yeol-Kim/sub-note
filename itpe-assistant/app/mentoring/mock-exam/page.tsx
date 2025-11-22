import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle2, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

// Mock data - TODO: Fetch from database
const mockExams = [
  {
    id: "1",
    title: "실전 모의고사 1회",
    description: "보안 및 네트워크 중심 (4문제)",
    difficulty: "actual",
    timeLimit: 100,
    questions: 4,
    attempts: 2,
    bestScore: 85,
  },
  {
    id: "2",
    title: "클라우드 아키텍처 모의고사",
    description: "Kubernetes, MSA, API Gateway (3문제)",
    difficulty: "advanced",
    timeLimit: 75,
    questions: 3,
    attempts: 0,
    bestScore: null,
  },
  {
    id: "3",
    title: "보안 심화 모의고사",
    description: "Zero Trust, OAuth, 암호화 (4문제)",
    difficulty: "advanced",
    timeLimit: 100,
    questions: 4,
    attempts: 1,
    bestScore: 72,
  },
];

const difficultyMap = {
  beginner: { label: "기초", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
  intermediate: { label: "중급", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  advanced: { label: "고급", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  actual: { label: "실전", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

export default function MockExamList() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Clock className="h-10 w-10 text-accent" />
          모의고사
        </h1>
        <p className="text-lg text-muted-foreground">
          실전처럼 연습하고, AI 멘토의 즉각적인 피드백을 받으세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              총 응시 횟수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif">12회</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              평균 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-accent">78점</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              최고 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-green-500">92점</div>
          </CardContent>
        </Card>
      </div>

      {/* Exam List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">사용 가능한 모의고사</h2>

        <div className="grid gap-4">
          {mockExams.map((exam) => {
            const difficulty = difficultyMap[exam.difficulty as keyof typeof difficultyMap];
            return (
              <Card key={exam.id} className="shadow-sm hover:shadow-md transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        <Badge className={difficulty.color}>{difficulty.label}</Badge>
                      </div>
                      <CardDescription>{exam.description}</CardDescription>
                    </div>
                    <Link href={`/mentoring/mock-exam/${exam.id}`}>
                      <Button className="gap-2">
                        <Play className="h-4 w-4" />
                        시작하기
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{exam.timeLimit}분</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{exam.questions}문제</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>응시 {exam.attempts}회</span>
                    </div>
                    {exam.bestScore && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span className="font-medium text-accent">
                          최고 {exam.bestScore}점
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <Card className="shadow-sm border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">💡 모의고사 팁</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• 실제 시험처럼 제한 시간 내에 작성하세요 (1문제당 25분)</p>
          <p>• 답안 작성 후 즉각적인 AI 피드백을 받을 수 있습니다</p>
          <p>• 4점을 5점으로 올리는 구체적인 개선 방향을 확인하세요</p>
          <p>• 반복 응시로 쓰기 속도와 품질을 동시에 향상시키세요</p>
        </CardContent>
      </Card>
    </div>
  );
}
