"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target, FileText, Loader2, AlertCircle, Sparkles, User } from "lucide-react";

const categories = [
  "정보 전략 및 관리",
  "소프트웨어공학",
  "업무 프로세스",
  "정보시스템구축관리",
  "정보보안",
  "최신기술",
];

const evaluationCriteria = [
  { name: "첫인상", description: "구조적 완성도, 시각적 표현, 가독성" },
  { name: "출제반영성", description: "문제 의도 반영, 범위 충족, 적절한 깊이" },
  { name: "논리성", description: "계층 구조, 논리적 흐름, 명확한 연결" },
  { name: "응용능력", description: "암기를 넘어선 설명력, 실용적 예시" },
  { name: "특화", description: "전문 용어 정확성, 최신 트렌드 반영" },
  { name: "견해", description: "통찰력 있는 의견, 비판적 사고, 미래 전망" },
];

export default function NewEvaluationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    question: "",
    answer: "",
    authorType: "human",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!formData.question.trim()) {
      setError("문제/주제를 입력해주세요.");
      return;
    }
    if (!formData.answer.trim()) {
      setError("답안을 입력해주세요.");
      return;
    }
    if (!formData.category) {
      setError("카테고리를 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("평가 요청에 실패했습니다.");
      }

      const result = await response.json();

      // Redirect to evaluation result page
      router.push(`/evaluations/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/70">
            <Target className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              새 평가 요청
            </h1>
            <p className="text-sm text-muted-foreground">
              답안을 제출하여 6가지 평가 기준으로 채점받으세요
            </p>
          </div>
        </div>
      </div>

      {/* Evaluation Criteria Info */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            평가 기준 (총 30점)
          </CardTitle>
          <CardDescription>
            각 항목당 5점 만점으로 평가됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {evaluationCriteria.map((criterion, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border bg-card/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <span className="font-medium text-sm">{criterion.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              답안 정보
            </CardTitle>
            <CardDescription>
              평가할 답안의 기본 정보를 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="예: OAuth 2.0 Grant Types"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoading}
              />
            </div>

            {/* Author Type */}
            <div className="space-y-2">
              <Label htmlFor="authorType">작성자 유형 *</Label>
              <Select
                value={formData.authorType}
                onValueChange={(value) => setFormData({ ...formData, authorType: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>인간 작성</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ai">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>AI 생성</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.authorType === "human"
                  ? "직접 작성한 답안을 평가합니다"
                  : "AI가 생성한 답안을 평가합니다"}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">문제 / 주제 *</Label>
              <Textarea
                id="question"
                placeholder="예: OAuth 2.0의 주요 Grant Types를 설명하고, 각각의 특징과 사용 사례를 비교하시오."
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="min-h-[100px]"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                출제 문제 또는 답안 주제를 입력하세요
              </p>
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label htmlFor="answer">답안 *</Label>
              <Textarea
                id="answer"
                placeholder="답안을 입력하세요...&#10;&#10;1. 정의&#10;   - OAuth 2.0은 인증과 권한 부여를 위한 개방형 표준 프로토콜...&#10;&#10;2. Grant Types&#10;   1) Authorization Code&#10;   2) Implicit&#10;   3) Resource Owner Password Credentials&#10;   4) Client Credentials"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="min-h-[400px] font-mono text-sm"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>평가할 답안 전체를 입력하세요</span>
                <span>{formData.answer.length} 글자</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                평가 중...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                평가 요청
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Tips */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">💡 평가 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 답안은 서론-본론-결론 구조로 작성되어 있어야 합니다</li>
            <li>• 본론에 그림(다이어그램)과 표가 포함되어 있으면 좋습니다</li>
            <li>• 조사를 생략하고 명사형으로 종결하는 것이 좋습니다</li>
            <li>• 1페이지 분량을 권장합니다 (약 800-1200자)</li>
            <li>• 전문 용어와 키워드를 명확히 표현하세요</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
