import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MockExamFeedbackPage() {
  // Mock feedback data
  const feedback = {
    overallScore: 75,
    questions: [
      {
        id: "1",
        question: "클라우드 네이티브 애플리케이션 개발에서 마이크로서비스 아키텍처의 핵심 특징과 Service Mesh의 필요성 및 주요 기능에 대하여 설명하시오.",
        score: 78,
        strengths: [
          "마이크로서비스 아키텍처의 핵심 개념을 정확히 이해하고 있음",
          "Service Mesh의 주요 기능을 구체적으로 설명함",
          "다이어그램을 활용한 시각적 설명이 우수함",
        ],
        weaknesses: [
          "실제 구현 사례가 부족함",
          "성능 오버헤드에 대한 언급이 없음",
        ],
        suggestions: [
          "Istio, Linkerd 등 구체적인 Service Mesh 솔루션 사례를 추가하세요",
          "서비스 간 통신 지연 및 리소스 사용량 증가 등 성능 측면을 고려하세요",
        ],
      },
      {
        id: "2",
        question: "Zero Trust 보안 모델의 개념과 구현 전략, 그리고 기존 경계 기반 보안 모델과의 차이점에 대하여 설명하시오.",
        score: 72,
        strengths: [
          "Zero Trust의 핵심 원칙을 명확하게 제시함",
          "기존 모델과의 비교가 체계적임",
        ],
        weaknesses: [
          "구현 전략이 추상적이고 구체성이 부족함",
          "Identity 기반 인증에 대한 설명이 미흡함",
        ],
        suggestions: [
          "NIST Zero Trust Architecture 프레임워크를 참고하여 구현 단계를 구체화하세요",
          "MFA, IAM, 최소 권한 원칙 등 구체적인 기술을 언급하세요",
        ],
      },
    ],
    categories: [
      { name: "내용 완성도", score: 80 },
      { name: "정확성", score: 75 },
      { name: "구조 및 논리성", score: 78 },
      { name: "명료성", score: 72 },
      { name: "키워드 포함", score: 68 },
      { name: "기술 깊이", score: 70 },
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          모의고사 결과
        </h1>
        <p className="text-lg text-muted-foreground">
          AI가 분석한 상세 피드백을 확인하세요
        </p>
      </div>

      {/* Overall Score */}
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">종합 점수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">
              {feedback.overallScore}점
            </div>
            <Progress value={feedback.overallScore} className="h-3 mb-4" />
            <p className="text-muted-foreground">
              평균 대비 +5점 향상되었습니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>세부 평가</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span className="text-muted-foreground">{category.score}점</span>
              </div>
              <Progress value={category.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Question-by-Question Feedback */}
      {feedback.questions.map((q, index) => (
        <Card key={q.id} className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge>문항 {index + 1}</Badge>
              <Badge variant={q.score >= 80 ? "default" : "secondary"}>
                {q.score}점
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed">
              {q.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strengths */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>잘한 점</span>
              </div>
              <ul className="space-y-2 ml-7">
                {q.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-orange-600 dark:text-orange-400">
                <XCircle className="h-5 w-5" />
                <span>개선이 필요한 점</span>
              </div>
              <ul className="space-y-2 ml-7">
                {q.weaknesses.map((weakness, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {weakness}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-5 w-5" />
                <span>개선 방향</span>
              </div>
              <ul className="space-y-2 ml-7">
                {q.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm font-medium">
                    <ArrowRight className="h-4 w-4 inline mr-2" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/mock-exam/new" className="flex-1">
          <Button className="w-full">새 모의고사 시작</Button>
        </Link>
        <Link href="/sub-notes/new" className="flex-1">
          <Button variant="outline" className="w-full">
            부족한 주제 학습하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
