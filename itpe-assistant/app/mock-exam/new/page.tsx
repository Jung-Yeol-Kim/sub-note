"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewMockExamPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes per question
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock questions
  const questions = [
    {
      id: "1",
      text: "클라우드 네이티브 애플리케이션 개발에서 마이크로서비스 아키텍처의 핵심 특징과 Service Mesh의 필요성 및 주요 기능에 대하여 설명하시오.",
      category: "클라우드",
    },
    {
      id: "2",
      text: "Zero Trust 보안 모델의 개념과 구현 전략, 그리고 기존 경계 기반 보안 모델과의 차이점에 대하여 설명하시오.",
      category: "보안",
    },
  ];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeRemaining(60 * 60);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Redirect to feedback page
    router.push("/mock-exam/feedback");
  };

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Timer */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">실전 모의고사</h1>
          <p className="text-sm text-muted-foreground">
            문항 {currentQuestion + 1} / {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span
              className={`text-2xl font-mono font-bold ${
                timeRemaining < 300 ? "text-red-500" : "text-foreground"
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Low time warning */}
      {timeRemaining < 300 && timeRemaining > 0 && (
        <Card className="border-orange-500 bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">시간이 5분 미만 남았습니다!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge>{question.category}</Badge>
            <Badge variant="outline">60분</Badge>
          </div>
          <CardTitle className="text-xl leading-relaxed">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="답안을 작성하세요...

1. 정의
   - 개념 및 특징

2. 설명
   1) 구조/과정 (다이어그램)

   2) 분류/유형 (표)

3. 고려사항 및 결론"
            value={answers[currentQuestion]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[currentQuestion] = e.target.value;
              setAnswers(newAnswers);
            }}
            rows={20}
            className="font-mono text-sm"
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {answers[currentQuestion].length} 자
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          이전 문제
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                index === currentQuestion
                  ? "border-primary bg-primary text-primary-foreground"
                  : answers[index].length > 0
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-border hover:border-primary/50"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "제출 중..." : "제출하기"}
          </Button>
        ) : (
          <Button onClick={handleNext}>다음 문제</Button>
        )}
      </div>
    </div>
  );
}
