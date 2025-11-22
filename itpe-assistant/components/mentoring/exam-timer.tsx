"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";

interface ExamTimerProps {
  totalSeconds: number;
  onTimeUp?: () => void;
}

export function ExamTimer({ totalSeconds, onTimeUp }: ExamTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  useEffect(() => {
    // Warning when less than 10 minutes remaining
    setIsWarning(secondsRemaining <= 600 && secondsRemaining > 0);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = (secondsRemaining / totalSeconds) * 100;

  return (
    <Card
      className={`shadow-md transition-all ${
        isWarning ? "border-red-500 bg-red-500/5" : "border-accent/20"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {isWarning ? (
            <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
          ) : (
            <Clock className="h-5 w-5 text-accent" />
          )}
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">남은 시간</div>
            <div
              className={`text-2xl font-bold font-mono ${
                isWarning ? "text-red-500" : "text-foreground"
              }`}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
