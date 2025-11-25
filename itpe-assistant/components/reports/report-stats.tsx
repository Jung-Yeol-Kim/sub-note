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
            className="group p-4 rounded-lg border border-[#3d5a4c]/10 bg-white hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#3d5a4c] to-[#2d4a3c] text-white text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-[#3d5a4c]">
                  {category.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {category.trend && (
                  <div className="flex items-center gap-1">
                    {category.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                    {category.trend === "down" && (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    {category.trend === "same" && (
                      <Minus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                )}
                <span className="text-sm font-bold text-[#3d5a4c]">
                  {category.count}문제
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-[#3d5a4c]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3d5a4c] via-[#4d6a5c] to-[#c49a6c] rounded-full transition-all duration-500 group-hover:opacity-90"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-xs text-[#3d5a4c]/60 w-12 text-right">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-[#3d5a4c]/5 to-[#c49a6c]/5 border border-[#3d5a4c]/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#3d5a4c]">총 문제 수</span>
          <span className="text-2xl font-bold text-[#3d5a4c]">
            {totalQuestions}문제
          </span>
        </div>
      </div>
    </div>
  );
}
