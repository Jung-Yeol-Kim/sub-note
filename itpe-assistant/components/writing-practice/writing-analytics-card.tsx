"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle2,
  Brain,
  Lightbulb,
} from "lucide-react";

interface WritingAnalyticsCardProps {
  analytics: any;
}

export function WritingAnalyticsCard({ analytics }: WritingAnalyticsCardProps) {
  if (!analytics) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">분석 데이터 없음</h3>
          <p className="text-muted-foreground">
            최소 5개의 챌린지를 완료하면 패턴 분석이 시작됩니다.
          </p>
        </div>
      </Card>
    );
  }

  const categoryEntries = analytics.categoryScores
    ? Object.entries(analytics.categoryScores as Record<string, number>)
    : [];

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          전체 성과 분석
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-primary mb-1">
              {analytics.averageScore}
            </p>
            <p className="text-sm text-muted-foreground">평균 점수</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-green-500 mb-1">
              +{analytics.improvementRate}%
            </p>
            <p className="text-sm text-muted-foreground">향상률</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-blue-500 mb-1">
              {analytics.completedChallenges}
            </p>
            <p className="text-sm text-muted-foreground">완료한 챌린지</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-purple-500 mb-1">
              {analytics.consistencyScore}%
            </p>
            <p className="text-sm text-muted-foreground">일관성</p>
          </div>
        </div>

        {/* Category Performance */}
        {categoryEntries.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">카테고리별 점수</h4>
            <div className="space-y-3">
              {categoryEntries.map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category}</span>
                    <span className="font-semibold">{score}점</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Writing Style Metrics */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          작성 스타일 분석
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>어휘 풍부도</span>
              <span className="font-semibold">
                {analytics.vocabularyRichness}%
              </span>
            </div>
            <Progress value={analytics.vocabularyRichness} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>구조적 일관성</span>
              <span className="font-semibold">
                {analytics.structuralConsistency}%
              </span>
            </div>
            <Progress value={analytics.structuralConsistency} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>키워드 활용률</span>
              <span className="font-semibold">
                {analytics.keywordUsageRate}%
              </span>
            </div>
            <Progress value={analytics.keywordUsageRate} className="h-2" />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm">평균 문장 길이</span>
            <span className="text-lg font-bold">
              {analytics.averageSentenceLength}자
            </span>
          </div>
        </div>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            강점
          </h4>
          <div className="space-y-2">
            {analytics.strengths?.map((strength: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm bg-green-500/10 p-3 rounded-lg"
              >
                <span className="text-green-500">✓</span>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            개선 필요 영역
          </h4>
          <div className="space-y-2">
            {analytics.weaknesses?.map((weakness: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm bg-orange-500/10 p-3 rounded-lg"
              >
                <span className="text-orange-500">!</span>
                <span>{weakness}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI 추천 학습 전략
        </h4>
        <div className="space-y-3">
          {analytics.recommendations?.map(
            (recommendation: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm bg-white/50 dark:bg-black/20 p-4 rounded-lg"
              >
                <span className="text-primary font-bold">{index + 1}.</span>
                <span>{recommendation}</span>
              </div>
            )
          )}
        </div>

        {analytics.focusAreas && analytics.focusAreas.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">집중 학습 영역:</p>
            <div className="flex flex-wrap gap-2">
              {analytics.focusAreas.map((area: string, index: number) => (
                <Badge key={index} variant="outline">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
