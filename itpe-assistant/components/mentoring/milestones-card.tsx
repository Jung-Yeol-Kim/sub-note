"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, BookOpen, Target, Star } from "lucide-react";
import type { Milestone } from "@/lib/types/mentoring";

interface MilestonesCardProps {
  milestones: Milestone[];
}

const milestoneIcons = {
  streak: Flame,
  topic: BookOpen,
  score: Target,
  custom: Star,
};

const milestoneColors = {
  streak: "text-orange-500",
  topic: "text-blue-500",
  score: "text-green-500",
  custom: "text-purple-500",
};

export function MilestonesCard({ milestones }: MilestonesCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-xl">마일스톤</CardTitle>
        </div>
        <CardDescription>달성한 주요 성과들</CardDescription>
      </CardHeader>
      <CardContent>
        {milestones.length > 0 ? (
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const Icon = milestoneIcons[milestone.type];
              const colorClass = milestoneColors[milestone.type];

              return (
                <div
                  key={milestone.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 transition-all hover:bg-card hover:shadow-sm"
                >
                  <div className={`mt-1 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(milestone.achievedAt).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              아직 마일스톤이 없습니다
            </p>
            <p className="text-sm text-muted-foreground">
              학습을 계속하면 자동으로 마일스톤이 기록됩니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
