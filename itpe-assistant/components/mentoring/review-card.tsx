"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw, TrendingUp } from "lucide-react";

interface ReviewCardProps {
  topic: {
    id: string;
    title: string;
    category: string;
    lastReviewed: Date | null;
    reviewCount: number;
    difficulty: number;
  };
  onReview: (topicId: string) => void;
}

export function ReviewCard({ topic, onReview }: ReviewCardProps) {
  const difficultyLabel = ["매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"][
    topic.difficulty - 1
  ];

  const daysSinceReview = topic.lastReviewed
    ? Math.floor((new Date().getTime() - topic.lastReviewed.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className="shadow-sm hover:shadow-md transition-smooth">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <Badge>{topic.category}</Badge>
            </div>
            <CardDescription className="flex items-center gap-3 mt-2">
              {topic.lastReviewed && (
                <span className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {daysSinceReview}일 전
                </span>
              )}
              <span className="flex items-center gap-1 text-xs">
                <RotateCcw className="h-3 w-3" />
                {topic.reviewCount}회 복습
              </span>
              <span className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3" />
                {difficultyLabel}
              </span>
            </CardDescription>
          </div>
          <Button onClick={() => onReview(topic.id)} size="sm">
            복습하기
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
