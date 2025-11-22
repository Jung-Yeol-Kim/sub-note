"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Home,
  RefreshCcw,
  BookOpen,
  Target,
  Clock,
  FileText,
} from "lucide-react";
import type { ExamScore, AIFeedback } from "@/lib/types/mock-exam";
import { formatTime } from "@/lib/types/mock-exam";

// Mock data - In production, fetch from API
function getMockExamResults(sessionId: string): ExamScore {
  return {
    sessionId,
    submittedAt: new Date(),
    questionResults: [
      {
        question: {
          id: "q1",
          title: "Zero Trust Architecture",
          description: "제로 트러스트 아키텍처의 개념과 구현 전략에 대해 설명하시오.",
          categoryId: "5",
          categoryName: "정보보안",
          subCategoryName: "보안 아키텍처",
          difficulty: 4,
          keywords: ["Zero Trust", "Never Trust Always Verify", "마이크로 세그먼테이션"],
          timeLimit: 100,
        },
        answer: {
          questionId: "q1",
          content: "...",
          startedAt: new Date(),
          timeSpent: 3600,
          characterCount: 1500,
          wordCount: 1500,
          autoSaved: true,
          lastSavedAt: new Date(),
        },
        feedback: {
          questionId: "q1",
          criteria: [
            {
              name: "정의 명확성",
              score: 4,
              maxScore: 5,
              feedback: "정의가 명확하고 핵심 특징을 잘 포함하고 있습니다.",
              strengths: ["명확한 정의", "핵심 특징 포함"],
              improvements: ["배경 설명 추가"],
            },
            {
              name: "키워드 포함도",
              score: 5,
              maxScore: 5,
              feedback: "모든 핵심 키워드를 적절하게 사용했습니다.",
              strengths: ["필수 키워드 모두 포함", "적절한 맥락"],
              improvements: [],
            },
            {
              name: "구조 체계성",
              score: 3,
              maxScore: 5,
              feedback: "기본 구조는 있으나 다이어그램이 부족합니다.",
              strengths: ["논리적 흐름"],
              improvements: ["다이어그램 추가", "표 활용"],
            },
            {
              name: "기술적 깊이",
              score: 4,
              maxScore: 5,
              feedback: "기술적 이해도가 높습니다.",
              strengths: ["깊이 있는 설명", "실무 예시"],
              improvements: ["추가 사례"],
            },
            {
              name: "도표 품질",
              score: 2,
              maxScore: 5,
              feedback: "다이어그램과 표가 부족합니다.",
              strengths: [],
              improvements: ["다이어그램 추가", "표 구성"],
            },
            {
              name: "시험 형식 준수",
              score: 4,
              maxScore: 5,
              feedback: "표준 형식을 잘 따랐습니다.",
              strengths: ["간결한 문체", "조사 생략"],
              improvements: ["분량 조정"],
            },
          ],
          totalScore: 22,
          maxTotalScore: 30,
          percentageScore: 73,
          overallFeedback:
            "전반적으로 좋은 답안입니다. 특히 핵심 개념 이해도가 높고 키워드를 잘 활용했습니다. 다만 시각적 요소(다이어그램, 표)를 보강하면 더 높은 점수를 받을 수 있습니다.",
          missingKeywords: [],
          suggestedKeywords: ["SDP", "ZTNA", "정책 엔진"],
          structuralIssues: ["다이어그램 부재", "표 활용 미흡"],
          improvementPlan: [
            {
              priority: "high",
              area: "시각적 요소",
              suggestion: "Zero Trust 아키텍처 구성도를 다이어그램으로 표현하세요.",
              example: "[제어 평면] → [정책 엔진] → [데이터 평면] 형태의 다이어그램",
            },
            {
              priority: "medium",
              area: "구조화",
              suggestion: "구성요소를 표로 정리하여 가독성을 높이세요.",
            },
          ],
          estimatedExamScore: 75,
          mentoringMessage:
            "💪 좋은 시작입니다! 기본은 잘 되어있으니 다이어그램과 표를 추가하면 80점 이상도 가능합니다.",
        },
      },
    ],
    overallScore: 73,
    totalTimeSpent: 3600,
    averageTimePerQuestion: 3600,
    strengths: [
      "핵심 개념 이해도가 높음",
      "키워드 활용이 우수함",
      "논리적 흐름이 명확함",
    ],
    weaknesses: ["시각적 요소 부족", "표 활용 미흡"],
    studyRecommendations: [
      {
        topicId: "zero-trust",
        topicName: "Zero Trust Architecture",
        reason: "보통 점수 (73점) - 시각화 연습 필요",
        priority: "medium",
      },
    ],
    nextSteps: [
      "다이어그램 그리기 연습",
      "표 구성 연습",
      "유사 주제로 반복 연습",
    ],
  };
}

export default function MockExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [results, setResults] = useState<ExamScore | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // In production, fetch from API
    const mockResults = getMockExamResults(sessionId);
    setResults(mockResults);
    // Auto-expand first question
    setExpandedQuestions(new Set([mockResults.questionResults[0]?.question.id]));
  }, [sessionId]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">결과를 불러오는 중...</p>
      </div>
    );
  }

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-accent" />
            모의고사 결과
          </h1>
          <p className="text-muted-foreground mt-1">
            제출일시: {results.submittedAt.toLocaleString("ko-KR")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/mock-exam")}>
            <Home className="mr-2 h-4 w-4" />
            목록으로
          </Button>
          <Button onClick={() => router.push("/mock-exam/new")}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            다시 도전
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="border-accent/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">종합 점수</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}점
            </div>
            <p className="text-muted-foreground">
              예상 합격 가능성:{" "}
              {results.overallScore >= 80 ? "높음" : results.overallScore >= 60 ? "보통" : "낮음"}
            </p>
          </div>

          <Progress value={results.overallScore} className="h-3" />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">소요 시간</p>
              <p className="text-lg font-semibold">
                {formatTime(results.totalTimeSpent)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <FileText className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">답변 문제</p>
              <p className="text-lg font-semibold">
                {results.questionResults.length}문제
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Target className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">평균 소요 시간</p>
              <p className="text-lg font-semibold">
                {formatTime(results.averageTimePerQuestion)}
              </p>
            </div>
          </div>

          {/* AI Mentor Message */}
          <Alert className="bg-accent/10 border-accent/30">
            <div className="text-sm">
              <p className="font-semibold mb-2">🎯 AI 멘토 메시지</p>
              <p>{results.questionResults[0]?.feedback.mentoringMessage}</p>
            </div>
          </Alert>
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              강점
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              개선 필요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Question Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">문제별 상세 피드백</h2>
        {results.questionResults.map((result, idx) => (
          <Card key={result.question.id} className="overflow-hidden">
            <Collapsible
              open={expandedQuestions.has(result.question.id)}
              onOpenChange={() => toggleQuestion(result.question.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">문제 {idx + 1}</Badge>
                        <CardTitle className="text-lg">
                          {result.question.title}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.question.categoryName}
                        {result.question.subCategoryName &&
                          ` > ${result.question.subCategoryName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(result.feedback.percentageScore)}`}
                        >
                          {result.feedback.percentageScore}점
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {result.feedback.totalScore}/{result.feedback.maxTotalScore}
                        </p>
                      </div>
                      {expandedQuestions.has(result.question.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="space-y-6 pt-6 border-t">
                  {/* Overall Feedback */}
                  <Alert>
                    <p className="text-sm">{result.feedback.overallFeedback}</p>
                  </Alert>

                  {/* Criteria Scores */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">평가 기준별 점수</h4>
                    {result.feedback.criteria.map((criterion) => (
                      <div
                        key={criterion.name}
                        className="p-3 rounded-lg bg-muted/30 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {criterion.name}
                          </span>
                          <Badge variant={getScoreBadgeVariant((criterion.score / criterion.maxScore) * 100)}>
                            {criterion.score}/{criterion.maxScore}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {criterion.feedback}
                        </p>
                        {criterion.strengths.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {criterion.strengths.map((strength, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-green-500/10"
                              >
                                ✓ {strength}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {criterion.improvements.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {criterion.improvements.map((improvement, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-yellow-500/10"
                              >
                                → {improvement}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Keywords Analysis */}
                  {(result.feedback.missingKeywords.length > 0 ||
                    result.feedback.suggestedKeywords.length > 0) && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">키워드 분석</h4>
                      {result.feedback.missingKeywords.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            누락된 필수 키워드:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {result.feedback.missingKeywords.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="destructive"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.feedback.suggestedKeywords.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            추가하면 좋은 키워드:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {result.feedback.suggestedKeywords.map(
                              (keyword, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {keyword}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Improvement Plan */}
                  {result.feedback.improvementPlan.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">개선 계획</h4>
                      {result.feedback.improvementPlan.map((plan, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-border space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                plan.priority === "high"
                                  ? "destructive"
                                  : plan.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {plan.priority === "high"
                                ? "높음"
                                : plan.priority === "medium"
                                  ? "보통"
                                  : "낮음"}
                            </Badge>
                            <span className="font-medium text-sm">{plan.area}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {plan.suggestion}
                          </p>
                          {plan.example && (
                            <p className="text-xs text-accent mt-1">
                              예시: {plan.example}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Study Recommendations */}
      {results.studyRecommendations.length > 0 && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              학습 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.studyRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{rec.topicName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                </div>
                <Badge
                  variant={
                    rec.priority === "high"
                      ? "destructive"
                      : rec.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {rec.priority === "high"
                    ? "높음"
                    : rec.priority === "medium"
                      ? "보통"
                      : "낮음"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            다음 단계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-accent font-bold">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" size="lg" onClick={() => router.push("/mock-exam")}>
          <Home className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>
        <Button size="lg" onClick={() => router.push("/mock-exam/new")}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          새 모의고사 시작
        </Button>
      </div>
    </div>
  );
}
