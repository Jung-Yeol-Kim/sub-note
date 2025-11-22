"use client";

import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { formatTime, shouldShowWarning } from "@/lib/types/mock-exam";

interface ExamTimerProps {
  startTime: Date;
  timeLimit: number; // in minutes
  warningThresholds?: number[]; // in minutes
  showWarnings?: boolean;
  autoSubmit?: boolean;
  onTimeExpired?: () => void;
  onWarning?: (message: string) => void;
}

export function ExamTimer({
  startTime,
  timeLimit,
  warningThresholds = [20, 10, 5],
  showWarnings = true,
  autoSubmit = false,
  onTimeExpired,
  onWarning,
}: ExamTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [hasExpired, setHasExpired] = useState(false);
  const [lastWarning, setLastWarning] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = timeLimit * 60 - elapsed;

      if (remaining <= 0) {
        setRemainingSeconds(0);
        if (!hasExpired) {
          setHasExpired(true);
          onTimeExpired?.();
        }
      } else {
        setRemainingSeconds(remaining);

        // Check for warnings
        if (showWarnings) {
          const warning = shouldShowWarning(remaining, warningThresholds);
          if (warning.show && warning.message !== lastWarning) {
            setLastWarning(warning.message);
            onWarning?.(warning.message);
          }
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [
    startTime,
    timeLimit,
    warningThresholds,
    showWarnings,
    hasExpired,
    lastWarning,
    onTimeExpired,
    onWarning,
  ]);

  const totalSeconds = timeLimit * 60;
  const progressPercentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  const isWarningTime = remainingSeconds <= 600; // Last 10 minutes
  const isCriticalTime = remainingSeconds <= 300; // Last 5 minutes

  return (
    <div className="space-y-3">
      <Card
        className={`p-4 transition-smooth ${
          isCriticalTime
            ? "border-destructive bg-destructive/5"
            : isWarningTime
              ? "border-warning bg-warning/5"
              : "border-accent/20"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock
              className={`h-5 w-5 ${
                isCriticalTime
                  ? "text-destructive animate-pulse"
                  : isWarningTime
                    ? "text-warning"
                    : "text-accent"
              }`}
            />
            <span className="text-sm font-medium text-muted-foreground">
              남은 시간
            </span>
          </div>
          <div
            className={`text-2xl font-bold font-mono ${
              isCriticalTime
                ? "text-destructive"
                : isWarningTime
                  ? "text-warning"
                  : "text-foreground"
            }`}
          >
            {formatTime(remainingSeconds)}
          </div>
        </div>

        <Progress
          value={progressPercentage}
          className="h-2"
          indicatorClassName={
            isCriticalTime
              ? "bg-destructive"
              : isWarningTime
                ? "bg-warning"
                : "bg-accent"
          }
        />

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>시작: {startTime.toLocaleTimeString("ko-KR")}</span>
          <span>
            총 시간: {timeLimit}분
          </span>
        </div>
      </Card>

      {hasExpired && (
        <Alert variant="destructive" className="animate-in fade-in">
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <h4 className="font-semibold">시간이 종료되었습니다!</h4>
            <p className="text-sm mt-1">
              {autoSubmit
                ? "답안이 자동으로 제출됩니다."
                : "답안을 제출해주세요."}
            </p>
          </div>
        </Alert>
      )}

      {showWarnings && isWarningTime && !hasExpired && (
        <Alert
          variant={isCriticalTime ? "destructive" : "default"}
          className="animate-in fade-in"
        >
          <AlertCircle className="h-4 w-4" />
          <div className="ml-2">
            <p className="text-sm font-medium">
              {isCriticalTime
                ? `⚠️ 5분 이내 남았습니다!`
                : isWarningTime
                  ? `⏰ 10분 이내 남았습니다.`
                  : ""}
            </p>
          </div>
        </Alert>
      )}
    </div>
  );
}
