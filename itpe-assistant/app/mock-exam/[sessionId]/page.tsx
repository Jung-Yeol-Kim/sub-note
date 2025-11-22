"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Send,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { ExamTimer } from "@/components/mock-exam/exam-timer";
import { ExamAnswerEditor } from "@/components/mock-exam/exam-answer-editor";
import type { ExamSession, ExamAnswer } from "@/lib/types/mock-exam";

// Mock data - In production, fetch from API
function getMockExamSession(sessionId: string): ExamSession {
  return {
    id: sessionId,
    config: {
      mode: "random",
      questionCount: 2,
      timeLimit: 200,
      includeTimer: true,
      autoSubmit: false,
      showWarnings: true,
      warningThresholds: [30, 15, 5],
    },
    questions: [
      {
        id: "q1",
        title: "Zero Trust Architecture",
        description:
          "제로 트러스트 아키텍처의 개념과 구현 전략에 대해 설명하시오.",
        categoryId: "5",
        categoryName: "정보보안",
        subCategoryName: "보안 아키텍처",
        difficulty: 4,
        keywords: [
          "Zero Trust",
          "Never Trust Always Verify",
          "마이크로 세그먼테이션",
          "ID 기반 인증",
        ],
        timeLimit: 100,
      },
      {
        id: "q2",
        title: "API Gateway Pattern",
        description:
          "API Gateway 패턴의 개념, 구성요소, 장단점에 대해 설명하시오.",
        categoryId: "2",
        categoryName: "소프트웨어 공학",
        subCategoryName: "아키텍처 패턴",
        difficulty: 3,
        keywords: [
          "API Gateway",
          "라우팅",
          "인증/인가",
          "프로토콜 변환",
          "부하 분산",
        ],
        timeLimit: 100,
      },
    ],
    answers: {},
    status: "in_progress",
    startedAt: new Date(),
    totalTimeSpent: 0,
    currentQuestionIndex: 0,
  };
}

export default function MockExamSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    // In production, fetch from API
    const mockSession = getMockExamSession(sessionId);
    setSession(mockSession);
  }, [sessionId]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const currentAnswer = session.answers[currentQuestion.id] || null;
  const answeredCount = Object.keys(session.answers).length;
  const totalQuestions = session.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswerChange = (content: string) => {
    const updatedAnswer: ExamAnswer = {
      questionId: currentQuestion.id,
      content,
      startedAt: currentAnswer?.startedAt || new Date(),
      timeSpent: currentAnswer?.timeSpent || 0,
      characterCount: content.length,
      wordCount: content.replace(/\s/g, "").length,
      autoSaved: false,
      lastSavedAt: new Date(),
    };

    setSession({
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: updatedAnswer,
      },
    });
  };

  const handleAutoSave = (answer: ExamAnswer) => {
    setSession({
      ...session,
      answers: {
        ...session.answers,
        [answer.questionId]: answer,
      },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = session.questions.filter(
      (q) => !session.answers[q.id] || !session.answers[q.id].content.trim()
    );

    if (unansweredQuestions.length > 0 && !showSubmitConfirm) {
      setShowSubmitConfirm(true);
      return;
    }

    // In production, submit to API and get feedback
    const updatedSession: ExamSession = {
      ...session,
      status: "submitted",
      submittedAt: new Date(),
      completedAt: new Date(),
    };

    // Navigate to results page
    router.push(`/mock-exam/${sessionId}/results`);
  };

  const handleTimeExpired = () => {
    if (session.config.autoSubmit) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">실전 모의고사</h1>
          <p className="text-muted-foreground mt-1">
            {session.config.mode === "realistic" && "실전 환경 시험"}
            {session.config.mode === "category" && "주제별 모의고사"}
            {session.config.mode === "random" && "랜덤 모의고사"}
            {session.config.mode === "weakness" && "취약 주제 모의고사"}
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          세션 ID: {sessionId.slice(0, 8)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">진행률</span>
                  <span className="text-muted-foreground">
                    {answeredCount} / {totalQuestions} 문제 작성 완료
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex gap-2">
                  {session.questions.map((q, idx) => (
                    <button
                      type="button"
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`flex-1 h-10 rounded-md text-sm font-medium transition-smooth ${
                        idx === currentQuestionIndex
                          ? "bg-primary text-primary-foreground"
                          : session.answers[q.id]?.content.trim()
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      문제 {idx + 1}
                      {session.answers[q.id]?.content.trim() && (
                        <CheckCircle className="inline-block ml-1 h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question and Answer Editor */}
          <ExamAnswerEditor
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
            onAutoSave={handleAutoSave}
          />

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  이전 문제
                </Button>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    답안 제출
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleNextQuestion}>
                    다음 문제
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Confirmation */}
          {showSubmitConfirm && (
            <Alert variant="destructive" className="animate-in fade-in">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">
                <h4 className="font-semibold">
                  작성하지 않은 문제가 있습니다
                </h4>
                <p className="text-sm mt-1">
                  {session.questions
                    .filter(
                      (q) =>
                        !session.answers[q.id] ||
                        !session.answers[q.id].content.trim()
                    )
                    .map((q, idx) => `문제 ${session.questions.indexOf(q) + 1}`)
                    .join(", ")}
                  를 작성하지 않았습니다. 그래도 제출하시겠습니까?
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={handleSubmit}>
                    제출하기
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSubmitConfirm(false)}
                  >
                    계속 작성
                  </Button>
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Timer */}
          {session.config.includeTimer && session.startedAt && (
            <ExamTimer
              startTime={session.startedAt}
              timeLimit={session.config.timeLimit}
              warningThresholds={session.config.warningThresholds}
              showWarnings={session.config.showWarnings}
              autoSubmit={session.config.autoSubmit}
              onTimeExpired={handleTimeExpired}
            />
          )}

          {/* Quick Tips */}
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                작성 가이드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>정의는 명확하고 간결하게</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>핵심 키워드 반드시 포함</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>다이어그램과 표 활용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>조사 생략으로 간결하게</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>1,500-2,000자 권장</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">세션 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 문제 수</span>
                <span className="font-medium">{totalQuestions}문제</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">제한 시간</span>
                <span className="font-medium">{session.config.timeLimit}분</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">시작 시간</span>
                <span className="font-medium">
                  {session.startedAt?.toLocaleTimeString("ko-KR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">자동 제출</span>
                <span className="font-medium">
                  {session.config.autoSubmit ? "활성" : "비활성"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
