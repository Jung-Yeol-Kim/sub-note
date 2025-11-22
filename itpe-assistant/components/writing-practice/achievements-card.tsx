"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Lock } from "lucide-react";

interface AchievementsCardProps {
  achievements: string[];
  level: number;
}

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first_challenge",
    name: "첫 걸음",
    description: "첫 챌린지 완료",
    icon: "🎯",
    requirement: 1,
  },
  {
    id: "3_day_streak",
    name: "꾸준한 시작",
    description: "3일 연속 학습",
    icon: "🔥",
    requirement: 3,
  },
  {
    id: "7_day_streak",
    name: "일주일 챌린저",
    description: "7일 연속 학습",
    icon: "⭐",
    requirement: 7,
  },
  {
    id: "30_day_streak",
    name: "한 달의 기적",
    description: "30일 연속 학습",
    icon: "💎",
    requirement: 30,
  },
  {
    id: "10_challenges",
    name: "연습생",
    description: "챌린지 10회 완료",
    icon: "📝",
    requirement: 10,
  },
  {
    id: "50_challenges",
    name: "전문가",
    description: "챌린지 50회 완료",
    icon: "🎓",
    requirement: 50,
  },
  {
    id: "100_challenges",
    name: "마스터",
    description: "챌린지 100회 완료",
    icon: "👑",
    requirement: 100,
  },
  {
    id: "perfect_week",
    name: "완벽한 한 주",
    description: "일주일 내내 매일 학습",
    icon: "✨",
    requirement: 1,
  },
  {
    id: "high_scorer",
    name: "고득점자",
    description: "평균 점수 90점 이상",
    icon: "🏆",
    requirement: 90,
  },
  {
    id: "level_5",
    name: "레벨 마스터",
    description: "레벨 5 달성",
    icon: "🚀",
    requirement: 5,
  },
];

export function AchievementsCard({ achievements, level }: AchievementsCardProps) {
  const earnedAchievements = ACHIEVEMENT_DEFINITIONS.filter((achievement) =>
    achievements.includes(achievement.id)
  );

  const lockedAchievements = ACHIEVEMENT_DEFINITIONS.filter(
    (achievement) => !achievements.includes(achievement.id)
  );

  const nextLevelXP = level * 100;
  const currentXP = 0; // This should come from props in real implementation

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">레벨 {level}</h3>
            <p className="text-sm text-muted-foreground">
              다음 레벨까지 {nextLevelXP - currentXP} XP
            </p>
          </div>
          <Trophy className="h-12 w-12 text-purple-500" />
        </div>
        <Progress value={(currentXP / nextLevelXP) * 100} className="h-3" />
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          업적
          <Badge variant="outline" className="ml-auto">
            {earnedAchievements.length}/{ACHIEVEMENT_DEFINITIONS.length}
          </Badge>
        </h3>

        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">
              달성한 업적
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-semibold text-sm mb-1">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">
              잠긴 업적
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {lockedAchievements.slice(0, 6).map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-muted/50 border border-muted rounded-lg p-4 text-center opacity-60"
                >
                  <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-semibold text-sm mb-1">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
