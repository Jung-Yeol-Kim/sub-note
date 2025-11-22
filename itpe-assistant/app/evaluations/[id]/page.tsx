"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  User,
  FileText,
  Loader2,
} from "lucide-react";

// Mock data - will be replaced with actual data fetching
const mockEvaluation = {
  id: "1",
  title: "OAuth 2.0 Grant Types",
  question: "OAuth 2.0의 주요 Grant Types를 설명하고, 각각의 특징과 사용 사례를 비교하시오.",
  answer: `1. 정의
   - OAuth 2.0은 인증과 권한 부여를 위한 개방형 표준 프로토콜로, 제3자 애플리케이션이 사용자 자원에 안전하게 접근할 수 있도록 함

2. Grant Types 설명
   1) Authorization Code
      - 가장 안전한 방식
      - 서버 사이드 애플리케이션에 적합

   2) Implicit
      - 브라우저 기반 앱용
      - Access Token을 직접 반환

   3) Resource Owner Password Credentials
      - 사용자 ID/PW 직접 사용
      - 신뢰할 수 있는 앱에서만 사용

   4) Client Credentials
      - 서버 간 통신용
      - 사용자 컨텍스트 없음

3. 비교 및 고려사항
   - 보안 수준: Authorization Code > Implicit > ROPC
   - 사용 환경에 따라 적절한 방식 선택 필요`,
  authorType: "human",
  category: "정보보안",
  createdAt: "2024-11-20",
  evaluator: "AI Grader (Claude Sonnet 4)",
  evaluation: {
    totalScore: 22,
    scores: {
      firstImpression: 4,
      questionReflection: 4,
      logicalConsistency: 4,
      applicationAbility: 3,
      specialization: 4,
      perspective: 3,
    },
    evaluations: {
      firstImpression: "서론-본론-결론 구조가 명확하고, 각 Grant Type을 잘 구분하여 설명함. 그러나 그림(다이어그램)이 없어 시각적 설명이 부족함.",
      questionReflection: "문제에서 요구한 Grant Types를 모두 다루었고, 비교도 포함함. 다만 사용 사례에 대한 구체적 예시가 부족함.",
      logicalConsistency: "정의 → 설명 → 비교의 흐름이 자연스럽고, 각 Grant Type이 명확히 구분됨.",
      applicationAbility: "각 Grant Type의 특징은 잘 설명했으나, 실제 사용 사례나 실무 예시가 부족함.",
      specialization: "OAuth 2.0의 핵심 개념을 정확히 이해하고 있으나, PKCE 같은 최신 보안 강화 방안은 언급되지 않음.",
      perspective: "보안 수준 비교는 좋으나, 각 방식의 한계나 미래 발전 방향에 대한 통찰이 부족함.",
    },
    strengths: [
      "서론-본론-결론 구조가 명확하여 가독성이 우수함",
      "4가지 Grant Type을 모두 다루어 출제 범위를 충족함",
      "각 Grant Type의 핵심 특징을 간결하게 정리함",
    ],
    weaknesses: [
      {
        aspect: "시각적 요소 부족",
        priority: "high",
        issue: "그림(다이어그램)이나 표가 없어 첫인상 점수가 낮음",
        suggestion: "OAuth 2.0 흐름도나 Grant Type 비교 표를 추가하면 좋음",
        example: {
          current: "텍스트로만 설명",
          improved: "각 Grant Type의 인증 흐름을 다이어그램으로 표현하고, 특징을 3열 표로 정리",
        },
      },
      {
        aspect: "실무 예시 부족",
        priority: "medium",
        issue: "각 Grant Type의 실제 사용 사례가 구체적이지 않음",
        suggestion: "실제 서비스 예시를 추가 (예: Authorization Code - Google 로그인, Implicit - SPA 앱)",
        example: {
          current: "서버 사이드 애플리케이션에 적합",
          improved: "Authorization Code는 Netflix, Facebook 같은 웹 애플리케이션에서 사용. 사용자는 OAuth Provider 화면으로 리다이렉트되어 안전하게 인증",
        },
      },
      {
        aspect: "최신 트렌드 반영 부족",
        priority: "medium",
        issue: "PKCE, OAuth 2.1 같은 최신 보안 강화 방안이 언급되지 않음",
        suggestion: "Implicit Flow의 보안 이슈와 PKCE를 통한 개선 사항 추가",
        example: {
          current: "Implicit - 브라우저 기반 앱용",
          improved: "Implicit Flow는 보안 취약점으로 OAuth 2.1에서 deprecated. 현재는 Authorization Code + PKCE 사용 권장",
        },
      },
    ],
    structureAnalysis: {
      introduction: "OAuth 2.0의 정의를 특징과 함께 명확히 제시함. 간결하고 핵심을 잘 담음.",
      bodyDiagram: "다이어그램이 없음. OAuth 흐름도를 추가하면 이해도가 크게 향상될 것.",
      bodyTable: "표가 없음. 4가지 Grant Type의 특징을 비교하는 3열 표를 추가하면 좋음.",
      conclusion: "비교 및 고려사항을 간략히 제시했으나, 미래 전망이나 선택 기준이 더 구체적이면 좋음.",
    },
    improvementPriorities: [
      "OAuth 2.0 인증 흐름 다이어그램 추가 (각 Grant Type별)",
      "Grant Type 비교 표 작성 (보안 수준, 사용 환경, 장단점)",
      "실제 서비스 사용 예시 추가 (Google, Facebook, Netflix 등)",
      "최신 트렌드 반영 (PKCE, OAuth 2.1, deprecated된 Implicit Flow)",
      "미래 전망 및 선택 가이드라인 추가",
    ],
    additionalNotes: "전반적으로 OAuth 2.0의 핵심 개념을 잘 이해하고 있으며, 구조도 명확합니다. 시각적 요소와 실무 예시를 추가하면 고득점(24점 이상)을 받을 수 있을 것입니다.",
  },
};

const criteriaLabels = {
  firstImpression: "첫인상",
  questionReflection: "출제반영성",
  logicalConsistency: "논리성",
  applicationAbility: "응용능력",
  specialization: "특화",
  perspective: "견해",
};

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const;

const priorityLabels = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<typeof mockEvaluation | null>(null);

  useEffect(() => {
    // In production, fetch evaluation data from API
    // const fetchEvaluation = async () => {
    //   const response = await fetch(`/api/evaluations/${params.id}`);
    //   const data = await response.json();
    //   setEvaluation(data);
    //   setIsLoading(false);
    // };
    // fetchEvaluation();

    // Mock delay
    setTimeout(() => {
      setEvaluation(mockEvaluation);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">평가 결과를 찾을 수 없습니다.</p>
        <Button onClick={() => router.push("/evaluations")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const passLevel = evaluation.evaluation.totalScore >= 18;
  const highScore = evaluation.evaluation.totalScore >= 24;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/evaluations")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        평가 목록으로
      </Button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70">
            <Target className="h-6 w-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={evaluation.authorType === "human" ? "default" : "secondary"}>
                {evaluation.authorType === "human" ? (
                  <>
                    <User className="mr-1 h-3 w-3" />
                    인간
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI
                  </>
                )}
              </Badge>
              <Badge variant="outline">{evaluation.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {evaluation.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {evaluation.createdAt} • {evaluation.evaluator}
            </p>
          </div>
        </div>
      </div>

      {/* Total Score Card */}
      <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              총점
            </span>
            <Badge
              variant={highScore ? "default" : passLevel ? "secondary" : "outline"}
              className="text-lg px-4 py-1"
            >
              {evaluation.evaluation.totalScore}/30
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">달성률</span>
              <span className="font-medium">
                {((evaluation.evaluation.totalScore / 30) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress
              value={(evaluation.evaluation.totalScore / 30) * 100}
              className="h-3"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            {highScore ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-400">
                  우수 (고득점 수준)
                </span>
              </>
            ) : passLevel ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-400">
                  양호 (합격 수준)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-700 dark:text-orange-400">
                  보통 (개선 필요)
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle>세부 평가 점수</CardTitle>
          <CardDescription>각 평가 항목별 점수와 피드백</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(evaluation.evaluation.scores).map(([key, score]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {criteriaLabels[key as keyof typeof criteriaLabels]}
                </span>
                <Badge variant="outline">{score}/5</Badge>
              </div>
              <Progress value={(score / 5) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {evaluation.evaluation.evaluations[key as keyof typeof evaluation.evaluation.evaluations]}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            잘된 점
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {evaluation.evaluation.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Weaknesses */}
      <Card className="border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
            <TrendingDown className="h-5 w-5" />
            개선 필요한 점
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {evaluation.evaluation.weaknesses.map((weakness, index) => (
            <div key={index} className="space-y-3 p-4 rounded-lg border border-orange-200 dark:border-orange-900 bg-card">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{weakness.aspect}</h4>
                <Badge variant={priorityColors[weakness.priority]}>
                  우선순위: {priorityLabels[weakness.priority]}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">문제점:</span>
                  <p className="mt-1">{weakness.issue}</p>
                </div>

                <div>
                  <span className="font-medium text-muted-foreground">개선 방안:</span>
                  <p className="mt-1">{weakness.suggestion}</p>
                </div>

                {weakness.example && (
                  <div className="mt-3 space-y-2">
                    <span className="font-medium text-muted-foreground">예시:</span>
                    <div className="grid gap-2">
                      <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                        <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                          현재
                        </p>
                        <p className="text-sm">{weakness.example.current}</p>
                      </div>
                      <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                        <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                          개선
                        </p>
                        <p className="text-sm">{weakness.example.improved}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Structure Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            구조 분석
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(evaluation.evaluation.structureAnalysis).map(([key, value]) => {
            const labels = {
              introduction: "서론",
              bodyDiagram: "본론 - 그림",
              bodyTable: "본론 - 표",
              conclusion: "결론",
            };
            return (
              <div key={key} className="p-3 rounded-lg border border-border bg-card/50">
                <p className="font-medium text-sm mb-1">
                  {labels[key as keyof typeof labels]}
                </p>
                <p className="text-sm text-muted-foreground">{value}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Improvement Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>개선 우선순위</CardTitle>
          <CardDescription>다음 순서로 개선하면 점수 향상에 도움이 됩니다</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {evaluation.evaluation.improvementPriorities.map((priority, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <Badge variant="outline" className="shrink-0 mt-0.5">
                  {index + 1}
                </Badge>
                <span>{priority}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      {evaluation.evaluation.additionalNotes && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">💡 추가 참고사항</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {evaluation.evaluation.additionalNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Original Question and Answer */}
      <Card>
        <CardHeader>
          <CardTitle>문제 및 답안</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-medium">문제/주제</Label>
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <p className="text-sm whitespace-pre-wrap">{evaluation.question}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="font-medium">답안</Label>
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <pre className="text-sm whitespace-pre-wrap font-sans">{evaluation.answer}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => router.push("/evaluations")}>
          평가 목록
        </Button>
        <Button className="flex-1" onClick={() => router.push("/evaluations/new")}>
          새 평가 요청
        </Button>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className || ""}`}>{children}</label>;
}
