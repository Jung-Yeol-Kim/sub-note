"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
  trend?: "up" | "down" | "same";
}

interface ReportStatsProps {
  categories: CategoryStat[];
  totalQuestions: number;
}

export function ReportStats({ categories, totalQuestions }: ReportStatsProps) {
  const maxCount = Math.max(...categories.map((c) => c.count));

  return (
    <div className="space-y-4">
      {categories.map((category, index) => {
        const barWidth = (category.count / maxCount) * 100;

        return (
          <div
            key={index}
            className="group p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {category.trend && (
                  <div className="flex items-center gap-1">
                    {category.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-success" />
                    )}
                    {category.trend === "down" && (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    {category.trend === "same" && (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                )}
                <span className="text-sm font-bold text-foreground">
                  {category.count}문제
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 group-hover:opacity-90"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">총 문제 수</span>
          <span className="text-2xl font-bold text-foreground">
            {totalQuestions}문제
          </span>
        </div>
      </div>
    </div>
  );
}
