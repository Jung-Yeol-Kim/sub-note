"use client";

import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Activity,
} from "lucide-react";
import { InsightsSummary } from "@/lib/report-analyzer";

interface InsightsDashboardProps {
  insights: InsightsSummary;
}

export function InsightsDashboard({ insights }: InsightsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-foreground font-crimson mb-6">
          주요 지표
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">분석 회차</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {insights.totalRounds}회
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">총 문제 수</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {insights.totalQuestions}문제
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">평균 출제</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {insights.avgQuestionsPerRound.toFixed(1)}문제
            </p>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div>
        <h2 className="text-2xl font-bold text-foreground font-crimson mb-6">
          최다 출제 카테고리
        </h2>
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="space-y-4">
            {insights.topCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-foreground">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-lg font-bold text-foreground">
                    평균 {category.avgCount.toFixed(1)}문제
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rising */}
        <div>
          <h2 className="text-2xl font-bold text-foreground font-crimson mb-6">
            증가 추세
          </h2>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            {insights.risingCategories.length > 0 ? (
              <div className="space-y-4">
                {insights.risingCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <span className="font-medium text-foreground">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-success">
                      +{category.change.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                데이터 없음
              </p>
            )}
          </div>
        </div>

        {/* Declining */}
        <div>
          <h2 className="text-2xl font-bold text-foreground font-crimson mb-6">
            감소 추세
          </h2>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            {insights.decliningCategories.length > 0 ? (
              <div className="space-y-4">
                {insights.decliningCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-5 h-5 text-warning" />
                      <span className="font-medium text-foreground">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-warning">
                      {category.change.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                데이터 없음
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category Trends Mini Chart */}
      <div>
        <h2 className="text-2xl font-bold text-foreground font-crimson mb-6">
          카테고리별 출제 추이
        </h2>
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="space-y-6">
            {insights.categoryTrends.map((categoryTrend, index) => {
              const maxValue = Math.max(
                ...insights.categoryTrends.flatMap((ct) =>
                  ct.trend.map((t) => t.value)
                )
              );

              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {categoryTrend.categoryName}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>평균: {categoryTrend.average.toFixed(1)}</span>
                      <span>최근: {categoryTrend.recent.toFixed(1)}</span>
                      <span>
                        범위: {categoryTrend.min}-{categoryTrend.max}
                      </span>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div className="flex items-end gap-1 h-16">
                    {categoryTrend.trend.map((point, i) => {
                      const height = (point.value / maxValue) * 100;
                      const isRecent = i >= categoryTrend.trend.length - 3;

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex items-end justify-center h-14">
                            <div
                              className={`w-full rounded-t transition-all ${
                                isRecent
                                  ? "bg-gradient-to-t from-accent to-accent/80"
                                  : "bg-gradient-to-t from-primary/40 to-primary/60"
                              }`}
                              style={{ height: `${height}%` }}
                              title={`${point.round}회: ${point.value}문제`}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {point.round}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
