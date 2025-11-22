import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Clock,
  TrendingUp,
  Play,
  BookOpen,
  Shuffle,
  AlertCircle,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { ExamMode } from "@/lib/types/mock-exam";

interface ExamModeCard {
  mode: ExamMode;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number;
  icon: React.ReactNode;
  difficulty: string;
  features: string[];
  color: string;
}

const EXAM_MODES: ExamModeCard[] = [
  {
    mode: "realistic",
    title: "실전 모의고사",
    description: "실제 시험과 동일한 환경에서 4문제를 풀어보세요",
    questionCount: 4,
    timeLimit: 400,
    icon: <Trophy className="h-6 w-6" />,
    difficulty: "실전",
    features: [
      "4문제, 400분 제한",
      "실제 시험 환경 재현",
      "자동 제출",
      "종합 피드백",
    ],
    color: "border-red-500/30 bg-red-500/5",
  },
  {
    mode: "category",
    title: "주제별 모의고사",
    description: "특정 카테고리의 문제로 집중 연습하세요",
    questionCount: 2,
    timeLimit: 200,
    icon: <BookOpen className="h-6 w-6" />,
    difficulty: "중급",
    features: [
      "카테고리 선택 가능",
      "2문제, 200분 제한",
      "체계적 학습",
      "즉각 피드백",
    ],
    color: "border-blue-500/30 bg-blue-500/5",
  },
  {
    mode: "random",
    title: "랜덤 모의고사",
    description: "다양한 주제를 골고루 연습하세요",
    questionCount: 2,
    timeLimit: 200,
    icon: <Shuffle className="h-6 w-6" />,
    difficulty: "중급",
    features: [
      "랜덤 주제 선택",
      "2문제, 200분 제한",
      "폭넓은 학습",
      "즉각 피드백",
    ],
    color: "border-green-500/30 bg-green-500/5",
  },
  {
    mode: "weakness",
    title: "취약 주제 모의고사",
    description: "낮은 점수를 받았던 주제로 집중 훈련하세요",
    questionCount: 3,
    timeLimit: 300,
    icon: <AlertCircle className="h-6 w-6" />,
    difficulty: "고급",
    features: [
      "취약 주제 자동 선택",
      "3문제, 300분 제한",
      "맞춤형 학습",
      "상세 피드백",
    ],
    color: "border-yellow-500/30 bg-yellow-500/5",
  },
];

export default function MockExamPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          실전 모의고사
        </h1>
        <p className="text-lg text-muted-foreground">
          타이머 기반 실전 연습으로 실력을 향상시키세요
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 응시 횟수</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">12</div>
            <p className="text-xs text-muted-foreground">이번 달 +5</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">74.5</div>
            <p className="text-xs text-muted-foreground">지난 주 대비 +3.2</p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 학습 시간</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">24.5</div>
            <p className="text-xs text-muted-foreground">시간</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam Modes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">모의고사 유형 선택</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {EXAM_MODES.map((examMode) => (
            <Card key={examMode.mode} className={`overflow-hidden ${examMode.color}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/80">
                      {examMode.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{examMode.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {examMode.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{examMode.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {examMode.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-accent">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/mock-exam/new?mode=${examMode.mode}`}>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">최근 응시 기록</CardTitle>
            <Link href="/mock-exam/history">
              <Button variant="outline" size="sm">
                전체 기록 보기
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: "session-1",
                mode: "realistic",
                date: "2024-01-15",
                score: 78,
                questions: 4,
              },
              {
                id: "session-2",
                mode: "category",
                date: "2024-01-14",
                score: 82,
                questions: 2,
              },
              {
                id: "session-3",
                mode: "random",
                date: "2024-01-13",
                score: 71,
                questions: 2,
              },
            ].map((session) => (
              <Link key={session.id} href={`/mock-exam/${session.id}/results`}>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {
                          EXAM_MODES.find((m) => m.mode === session.mode)
                            ?.title
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("ko-KR")} •{" "}
                        {session.questions}문제
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        session.score >= 80
                          ? "text-green-600"
                          : session.score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {session.score}점
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
