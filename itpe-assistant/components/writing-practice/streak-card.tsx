"use client";

import { Card } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  lastActivityDate,
}: StreakCardProps) {
  const getStreakMessage = () => {
    if (currentStreak === 0) {
      return "오늘 첫 도전을 시작해보세요!";
    }
    if (currentStreak < 3) {
      return "좋은 시작이에요! 계속 가봅시다 💪";
    }
    if (currentStreak < 7) {
      return "멋진 페이스네요! 일주일이 코앞이에요 🔥";
    }
    if (currentStreak < 30) {
      return "대단해요! 습관이 형성되고 있어요 🌟";
    }
    return "놀라워요! 당신은 진정한 챔피언입니다 🏆";
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "text-gray-500";
    if (currentStreak < 7) return "text-orange-500";
    if (currentStreak < 30) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Flame className={`h-5 w-5 ${getStreakColor()}`} />
          연속 학습 기록
        </h3>
      </div>

      <div className="space-y-4">
        {/* Current Streak */}
        <div className="text-center py-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg">
          <Flame className={`h-12 w-12 mx-auto mb-2 ${getStreakColor()}`} />
          <p className="text-4xl font-bold mb-1">{currentStreak}일</p>
          <p className="text-sm text-muted-foreground">현재 연속 기록</p>
        </div>

        {/* Motivation Message */}
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm font-medium">{getStreakMessage()}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">최장 기록</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary">
              {currentStreak === longestStreak && currentStreak > 0 ? "🔥" : "💪"}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentStreak === longestStreak && currentStreak > 0
                ? "신기록!"
                : "도전중"}
            </p>
          </div>
        </div>

        {/* Last Activity */}
        {lastActivityDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              마지막 활동:{" "}
              {formatDistanceToNow(new Date(lastActivityDate), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
