"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export function StreakTracker() {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(14);

  useEffect(() => {
    // TODO: Fetch from database
  }, []);

  return (
    <Card className="shadow-sm border-orange-500/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-16 translate-x-16" />

      <CardHeader className="relative">
        <CardTitle className="text-xl flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          연속 학습
        </CardTitle>
        <CardDescription>
          매일 조금씩, 꾸준히가 답입니다
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold font-serif text-orange-500">
              {currentStreak}
            </span>
            <span className="text-2xl text-muted-foreground">일</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-sm ${
                  i < currentStreak
                    ? "bg-orange-500"
                    : "bg-muted"
                }`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">최장 기록</span>
            </div>
            <span className="font-medium">{longestStreak}일</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
