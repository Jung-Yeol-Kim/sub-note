"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface WritingChallengeProps {
  todaysTopic: string;
  category: string;
  isCompleted: boolean;
  consecutiveDays: number;
}

export function WritingChallenge({
  todaysTopic,
  category,
  isCompleted,
  consecutiveDays,
}: WritingChallengeProps) {
  return (
    <Card className={`shadow-sm ${isCompleted ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            오늘의 쓰기 챌린지
          </CardTitle>
          {isCompleted && (
            <Badge className="bg-green-500">완료</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCompleted ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-100/50 dark:bg-green-900/20">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">
                오늘의 챌린지 완료!
              </p>
              <p className="text-sm text-muted-foreground">
                {consecutiveDays}일 연속 달성 중 🔥
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{category}</Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  20분
                </Badge>
              </div>
              <p className="font-semibold text-lg">{todaysTopic}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                연속 {consecutiveDays}일째 도전 중
              </span>
              <span className="font-medium text-primary">
                {consecutiveDays} 🔥
              </span>
            </div>

            <Link href="/writing-challenge/today">
              <Button className="w-full">
                챌린지 시작하기
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
