"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Play, ArrowLeft, Settings, Clock, Target } from "lucide-react";
import Link from "next/link";
import type { ExamMode, ExamConfig, ExamDifficulty } from "@/lib/types/mock-exam";
import { DEFAULT_EXAM_CONFIGS } from "@/lib/types/mock-exam";
import { SYLLABUS_CATEGORIES } from "@/lib/types/subnote";

export default function NewMockExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as ExamMode) || "random";

  const [config, setConfig] = useState<ExamConfig>({
    mode: initialMode,
    questionCount: 2,
    timeLimit: 200,
    includeTimer: true,
    autoSubmit: false,
    showWarnings: true,
    warningThresholds: [30, 15, 5],
    ...DEFAULT_EXAM_CONFIGS[initialMode],
  });

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      ...DEFAULT_EXAM_CONFIGS[initialMode],
      mode: initialMode,
    }));
  }, [initialMode]);

  const handleStartExam = async () => {
    // In production, create exam session via API
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Navigate to exam session page
    router.push(`/mock-exam/${sessionId}`);
  };

  const getModeInfo = () => {
    switch (config.mode) {
      case "realistic":
        return {
          title: "실전 모의고사",
          description: "실제 시험과 동일한 환경에서 4문제를 풀어보세요",
          icon: "🏆",
        };
      case "category":
        return {
          title: "주제별 모의고사",
          description: "특정 카테고리의 문제로 집중 연습하세요",
          icon: "📚",
        };
      case "random":
        return {
          title: "랜덤 모의고사",
          description: "다양한 주제를 골고루 연습하세요",
          icon: "🎲",
        };
      case "weakness":
        return {
          title: "취약 주제 모의고사",
          description: "낮은 점수를 받았던 주제로 집중 훈련하세요",
          icon: "⚠️",
        };
      default:
        return {
          title: "모의고사",
          description: "",
          icon: "📝",
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/mock-exam">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{modeInfo.title}</h1>
          <p className="text-muted-foreground mt-1">{modeInfo.description}</p>
        </div>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            모의고사 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode */}
          <div className="space-y-2">
            <Label>모의고사 유형</Label>
            <Select
              value={config.mode}
              onValueChange={(value) =>
                setConfig({ ...config, mode: value as ExamMode })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realistic">🏆 실전 모의고사 (4문제, 400분)</SelectItem>
                <SelectItem value="category">📚 주제별 모의고사 (2문제, 200분)</SelectItem>
                <SelectItem value="random">🎲 랜덤 모의고사 (2문제, 200분)</SelectItem>
                <SelectItem value="weakness">⚠️ 취약 주제 모의고사 (3문제, 300분)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection (for category mode) */}
          {config.mode === "category" && (
            <div className="space-y-2">
              <Label>카테고리 선택</Label>
              <Select
                value={config.categoryId}
                onValueChange={(value) =>
                  setConfig({ ...config, categoryId: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SYLLABUS_CATEGORIES).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Question Count */}
          <div className="space-y-2">
            <Label>문제 수</Label>
            <Select
              value={config.questionCount.toString()}
              onValueChange={(value) =>
                setConfig({
                  ...config,
                  questionCount: Number.parseInt(value) as 1 | 2 | 3 | 4,
                })
              }
              disabled={config.mode === "realistic"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1문제</SelectItem>
                <SelectItem value="2">2문제</SelectItem>
                <SelectItem value="3">3문제</SelectItem>
                <SelectItem value="4">4문제 (실전)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <Label>제한 시간 (분)</Label>
            <Select
              value={config.timeLimit.toString()}
              onValueChange={(value) =>
                setConfig({ ...config, timeLimit: Number.parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60분 (1시간)</SelectItem>
                <SelectItem value="100">100분 (1문제당 표준)</SelectItem>
                <SelectItem value="200">200분 (2문제 표준)</SelectItem>
                <SelectItem value="300">300분 (3문제 표준)</SelectItem>
                <SelectItem value="400">400분 (4문제 실전)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">시험 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <Target className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">문제 수</p>
                <p className="font-semibold">{config.questionCount}문제</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">제한 시간</p>
                <p className="font-semibold">{config.timeLimit}분</p>
              </div>
            </div>
          </div>

          <Alert className="bg-background/50">
            <div className="text-sm space-y-2">
              <p className="font-semibold">📝 안내사항</p>
              <ul className="text-xs space-y-1 ml-4 list-disc text-muted-foreground">
                <li>답안은 자동으로 저장됩니다</li>
                <li>타이머가 작동하며 남은 시간을 표시합니다</li>
                <li>시간 종료 {config.autoSubmit ? "시 자동으로 제출됩니다" : "전에 반드시 제출하세요"}</li>
                <li>제출 후 즉시 AI 멘토의 피드백을 받을 수 있습니다</li>
                <li>표준 답안 형식(정의-설명-추가)을 따르면 더 좋은 점수를 받을 수 있습니다</li>
              </ul>
            </div>
          </Alert>

          <div className="flex gap-3 pt-2">
            <Link href="/mock-exam" className="flex-1">
              <Button variant="outline" className="w-full">
                취소
              </Button>
            </Link>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleStartExam}
              disabled={config.mode === "category" && !config.categoryId}
            >
              <Play className="mr-2 h-4 w-4" />
              시험 시작
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 시험 준비 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>정의부터 시작:</strong> 명확하고 간결한 정의로 시작하세요
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>키워드 활용:</strong> 핵심 키워드를 빠짐없이 포함하세요
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>시각화:</strong> 다이어그램과 표를 활용하여 시각적으로 표현하세요
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>간결한 문체:</strong> 조사를 생략하고 명사형으로 종결하세요
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>
                <strong>적절한 분량:</strong> A4 1-2페이지 (1,500-2,000자) 분량을 유지하세요
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
