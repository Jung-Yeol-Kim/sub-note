"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { ExamTimer } from "@/components/mentoring/exam-timer";
import { ExamResults } from "@/components/mentoring/exam-results";

// Mock exam data
const mockExamData = {
  id: "1",
  title: "실전 모의고사 1회",
  timeLimit: 100, // minutes
  questions: [
    {
      id: "q1",
      number: 1,
      title: "OAuth 2.0의 Grant Types에 대해 설명하시오",
      category: "보안",
      timeLimit: 25,
    },
    {
      id: "q2",
      number: 2,
      title: "Kubernetes의 보안 모범 사례에 대해 설명하시오",
      category: "클라우드",
      timeLimit: 25,
    },
    {
      id: "q3",
      number: 3,
      title: "Zero Trust 아키텍처의 핵심 원칙과 구현 방법을 설명하시오",
      category: "보안",
      timeLimit: 25,
    },
    {
      id: "q4",
      number: 4,
      title: "API Gateway 패턴의 장단점과 적용 사례를 설명하시오",
      category: "아키텍처",
      timeLimit: 25,
    },
  ],
};

export default function MockExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(mockExamData.timeLimit * 60); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);

  const question = mockExamData.questions[currentQuestion];
  const totalQuestions = mockExamData.questions.length;
  const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const goToNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // TODO: Submit to API for evaluation
    console.log("Submitting answers:", answers);

    // Mock AI evaluation
    const mockResults = {
      overallScore: 82,
      questionScores: [
        { questionId: "q1", score: 85, feedback: "잘 작성되었습니다. Grant Types의 특징을 명확히 설명했습니다." },
        { questionId: "q2", score: 78, feedback: "보안 컨텍스트 설정에 대한 내용을 추가하면 더 좋습니다." },
        { questionId: "q3", score: 88, feedback: "핵심 원칙을 체계적으로 정리했습니다." },
        { questionId: "q4", score: 77, feedback: "실제 적용 사례를 더 구체적으로 작성하면 좋겠습니다." },
      ],
      strengths: ["구조적 작성", "핵심 개념 정확", "다이어그램 활용"],
      improvements: ["실제 사례 추가", "보안 세부사항 보완", "구현 전략 구체화"],
    };

    setResults(mockResults);
    setIsSubmitted(true);
  };

  if (isSubmitted && results) {
    return <ExamResults exam={mockExamData} answers={answers} results={results} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{mockExamData.title}</h1>
          <p className="text-muted-foreground">
            문제 {currentQuestion + 1} / {totalQuestions}
          </p>
        </div>
        <ExamTimer
          totalSeconds={mockExamData.timeLimit * 60}
          onTimeUp={() => handleSubmit()}
        />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">전체 진행률</span>
          <span className="font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      {/* Question Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {mockExamData.questions.map((q, idx) => {
          const isAnswered = answers[q.id]?.trim().length > 0;
          const isCurrent = idx === currentQuestion;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentQuestion(idx)}
              className={`flex-shrink-0 h-10 w-10 rounded-lg border font-medium transition-all ${
                isCurrent
                  ? "border-accent bg-accent text-accent-foreground"
                  : isAnswered
                    ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                    : "border-border hover:border-accent/50"
              }`}
            >
              {q.number}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">문제 {question.number}</CardTitle>
                <Badge>{question.category}</Badge>
              </div>
              <CardDescription className="text-base mt-2">
                {question.title}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>권장 {question.timeLimit}분</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Input */}
          <div className="space-y-2">
            <label htmlFor="answer" className="text-sm font-medium">
              답안 작성
            </label>
            <Textarea
              id="answer"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="여기에 답안을 작성하세요...&#10;&#10;1. 정의&#10;   - 개념 및 특징&#10;&#10;2. [주제명] 설명&#10;   1) 구조/프로세스 (다이어그램)&#10;   2) 분류/유형 (표)&#10;&#10;3. 고려사항"
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {answers[question.id]?.length || 0} 자
              </span>
              <span>
                권장: 800-1000자 (A4 1페이지 분량)
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              이전 문제
            </Button>

            {currentQuestion === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                className="gap-2 bg-accent hover:bg-accent/90"
              >
                <Send className="h-4 w-4" />
                제출하고 평가받기
              </Button>
            ) : (
              <Button onClick={goToNext} className="gap-2">
                다음 문제
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            작성 팁
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>• 정의는 간결하고 명확하게 (핵심 키워드 포함)</p>
          <p>• 다이어그램과 3열 표를 활용하여 시각화</p>
          <p>• 조사(은/는/이/가) 생략으로 간결하게 작성</p>
          <p>• A4 1페이지 분량 (800-1000자) 목표</p>
        </CardContent>
      </Card>
    </div>
  );
}
