"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface ChallengeHistoryCardProps {
  challenges: any[];
}

export function ChallengeHistoryCard({ challenges }: ChallengeHistoryCardProps) {
  if (challenges.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">학습 기록 없음</h3>
          <p className="text-muted-foreground">
            첫 챌린지를 시작하고 기록을 쌓아보세요!
          </p>
        </div>
      </Card>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}분`;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        학습 기록
      </h3>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{challenge.topic}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(challenge.challengeDate), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>
              <div>
                {challenge.isCompleted ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    완료
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <XCircle className="h-3 w-3 mr-1" />
                    미완료
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground mb-1">작성 시간</p>
                <p className="text-sm font-semibold">
                  {formatTime(challenge.timeSpent || 0)}
                </p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground mb-1">단어 수</p>
                <p className="text-sm font-semibold">{challenge.wordCount || 0}</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground mb-1">자가 평가</p>
                <p className="text-sm font-semibold">
                  {challenge.quickScore ? `${challenge.quickScore}/5` : "미평가"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                상세 보기
              </Button>
              {challenge.evaluationId && (
                <Button variant="outline" size="sm" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  AI 평가 보기
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
