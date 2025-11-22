"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";

export function DDayTracker() {
  const [examDate, setExamDate] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Fetch from user settings
    // For now, using a mock date (next exam typically in April/October)
    const mockExamDate = new Date("2026-04-11");
    setExamDate(mockExamDate);

    const today = new Date();
    const days = differenceInDays(mockExamDate, today);
    setDaysRemaining(days);
  }, []);

  return (
    <Card className="shadow-sm border-accent/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-16 translate-x-16" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            D-Day
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {examDate ? format(examDate, "yyyy년 MM월 dd일 (EEE)", { locale: ko }) : "시험 일자를 설정하세요"}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {daysRemaining !== null ? (
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold font-serif text-accent">
                {daysRemaining >= 0 ? `D-${daysRemaining}` : `D+${Math.abs(daysRemaining)}`}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">경과 시간</span>
                <span className="font-medium">
                  {daysRemaining >= 0
                    ? `${Math.floor((500 - daysRemaining) / 7)}주 경과`
                    : "시험 종료"}
                </span>
              </div>
              {daysRemaining >= 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">주당 학습 필요</span>
                  <span className="font-medium text-accent">
                    {daysRemaining > 0 ? Math.ceil((500 / daysRemaining) * 7) : 0}개 주제
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              시험 일자 설정
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
