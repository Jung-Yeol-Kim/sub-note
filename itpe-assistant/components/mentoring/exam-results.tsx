"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Home,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface ExamResultsProps {
  exam: any;
  answers: Record<string, string>;
  results: {
    overallScore: number;
    questionScores: Array<{
      questionId: string;
      score: number;
      feedback: string;
    }>;
    strengths: string[];
    improvements: string[];
  };
}

export function ExamResults({ exam, answers, results }: ExamResultsProps) {
  const { overallScore, questionScores, strengths, improvements } = results;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    return "text-yellow-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "우수", color: "bg-green-500/10 text-green-700 dark:text-green-400" };
    if (score >= 60) return { label: "양호", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" };
    return { label: "보통", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" };
  };

  const scoreBadge = getScoreBadge(overallScore);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="h-20 w-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
          <Trophy className={`h-10 w-10 ${getScoreColor(overallScore)}`} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">평가 완료!</h1>
          <p className="text-lg text-muted-foreground">{exam.title}</p>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="shadow-md border-accent/30">
        <CardHeader>
          <CardTitle className="text-center text-xl">종합 점수</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-6xl font-bold font-serif ${getScoreColor(overallScore)}`}>
              {overallScore}점
            </div>
            <Badge className={`mt-3 ${scoreBadge.color}`}>
              {scoreBadge.label}
            </Badge>
          </div>
          <Progress value={overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Question-by-Question Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">문항별 상세 평가</h2>
        {questionScores.map((result, idx) => {
          const question = exam.questions[idx];
          return (
            <Card key={result.questionId} className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      문제 {question.number}: {question.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {result.feedback}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}점
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-accent hover:underline">
                    내 답안 보기
                  </summary>
                  <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {answers[result.questionId] || "답안 없음"}
                    </pre>
                  </div>
                </details>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Strengths and Improvements */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Strengths */}
        <Card className="shadow-sm border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              잘한 점
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card className="shadow-sm border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              개선 방향
            </CardTitle>
            <CardDescription>
              4점을 5점으로 만드는 구체적인 방법
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/mentoring/mock-exam">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                모의고사 목록
              </Button>
            </Link>
            <Link href={`/mentoring/mock-exam/${exam.id}`}>
              <Button className="gap-2 w-full sm:w-auto">
                <RotateCcw className="h-4 w-4" />
                다시 응시하기
              </Button>
            </Link>
            <Link href="/mentoring">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                멘토링 대시보드
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
