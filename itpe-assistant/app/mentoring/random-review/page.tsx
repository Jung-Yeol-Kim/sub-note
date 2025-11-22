"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shuffle,
  BookOpen,
  Clock,
  CheckCircle2,
  SkipForward,
  RotateCcw,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { ReviewCard } from "@/components/mentoring/review-card";
import { Textarea } from "@/components/ui/textarea";

// Mock data - TODO: Fetch from database
const mockTopics = [
  {
    id: "1",
    title: "OAuth 2.0 Grant Types",
    category: "보안",
    lastReviewed: new Date("2025-11-15"),
    reviewCount: 3,
    difficulty: 4,
  },
  {
    id: "2",
    title: "Kubernetes Architecture",
    category: "클라우드",
    lastReviewed: new Date("2025-11-10"),
    reviewCount: 2,
    difficulty: 3,
  },
  {
    id: "3",
    title: "Zero Trust Security",
    category: "보안",
    lastReviewed: new Date("2025-11-08"),
    reviewCount: 5,
    difficulty: 5,
  },
  {
    id: "4",
    title: "API Gateway Patterns",
    category: "아키텍처",
    lastReviewed: null,
    reviewCount: 0,
    difficulty: 3,
  },
  {
    id: "5",
    title: "Service Mesh",
    category: "아키텍처",
    lastReviewed: new Date("2025-11-18"),
    reviewCount: 1,
    difficulty: 4,
  },
];

type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export default function RandomReviewPage() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [shuffledTopics, setShuffledTopics] = useState(mockTopics);
  const [sessionStartTime] = useState(new Date());

  useEffect(() => {
    // Shuffle topics on mount
    shuffleTopics();
  }, []);

  const shuffleTopics = () => {
    const shuffled = [...mockTopics].sort(() => Math.random() - 0.5);
    setShuffledTopics(shuffled);
    setCurrentTopicIndex(0);
    setReviewedCount(0);
    setShowAnswer(false);
    setUserAnswer("");
  };

  const currentTopic = shuffledTopics[currentTopicIndex];
  const progressPercent = (reviewedCount / shuffledTopics.length) * 100;

  const handleQualityRating = async (quality: ReviewQuality) => {
    // TODO: Save review to database and update spaced repetition schedule
    console.log(`Topic ${currentTopic.id} rated with quality ${quality}`);

    // Move to next topic
    if (currentTopicIndex < shuffledTopics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      setReviewedCount(reviewedCount + 1);
      setShowAnswer(false);
      setUserAnswer("");
    } else {
      // Session complete
      setReviewedCount(reviewedCount + 1);
    }
  };

  const handleSkip = () => {
    if (currentTopicIndex < shuffledTopics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  const isSessionComplete = reviewedCount >= shuffledTopics.length;

  if (isSessionComplete) {
    const sessionDuration = Math.floor(
      (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60
    );

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">복습 세션 완료!</h1>
            <p className="text-lg text-muted-foreground">
              {reviewedCount}개 주제를 복습했습니다
            </p>
          </div>
        </div>

        <Card className="shadow-md max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>세션 통계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">복습한 주제</div>
                <div className="text-3xl font-bold font-serif">{reviewedCount}개</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">소요 시간</div>
                <div className="text-3xl font-bold font-serif">{sessionDuration}분</div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={shuffleTopics} className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" />
                다시 시작
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="/mentoring">멘토링 대시보드</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Shuffle className="h-10 w-10 text-accent" />
          랜덤 복습
        </h1>
        <p className="text-lg text-muted-foreground">
          무작위로 주제를 복습하며 집중력을 유지하세요
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">진행률</span>
          <span className="font-medium">
            {reviewedCount} / {shuffledTopics.length}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Topic Card */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{currentTopic.title}</CardTitle>
                <Badge>{currentTopic.category}</Badge>
              </div>
              <CardDescription className="flex items-center gap-4 mt-2">
                {currentTopic.lastReviewed && (
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    마지막 복습: {currentTopic.lastReviewed.toLocaleDateString("ko-KR")}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm">
                  <RotateCcw className="h-3 w-3" />
                  복습 {currentTopic.reviewCount}회
                </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="gap-2">
              <SkipForward className="h-4 w-4" />
              건너뛰기
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="font-medium">
              이 주제에 대해 A4 1페이지 분량으로 답안을 작성해보세요.
            </p>
          </div>

          {/* Answer Input */}
          {!showAnswer && (
            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium">
                답안 작성 (선택)
              </label>
              <Textarea
                id="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="먼저 생각해보고 작성한 뒤, '답안 확인' 버튼을 눌러주세요..."
                rows={10}
                className="font-mono text-sm"
              />
              <Button onClick={() => setShowAnswer(true)} className="w-full">
                답안 확인
              </Button>
            </div>
          )}

          {/* Model Answer and Rating */}
          {showAnswer && (
            <div className="space-y-6">
              {/* Model Answer */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  모범 답안
                </h3>
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm whitespace-pre-wrap">
                    {/* TODO: Fetch actual model answer from database */}
                    [모범 답안이 여기에 표시됩니다]
                    {"\n\n"}
                    1. 정의{"\n"}
                    - {currentTopic.title}의 개념과 특징{"\n\n"}
                    2. 설명{"\n"}
                    - 구조 및 프로세스{"\n"}
                    - 주요 구성 요소{"\n\n"}
                    3. 고려사항
                  </p>
                </div>
              </div>

              {/* Quality Rating */}
              <div className="space-y-3">
                <h3 className="font-medium">이 주제를 얼마나 잘 기억하고 있나요?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { quality: 5, label: "완벽", desc: "즉시 기억", color: "bg-green-500 hover:bg-green-600" },
                    { quality: 4, label: "좋음", desc: "약간 어려움", color: "bg-blue-500 hover:bg-blue-600" },
                    { quality: 3, label: "보통", desc: "시간이 걸림", color: "bg-yellow-500 hover:bg-yellow-600" },
                    { quality: 2, label: "어려움", desc: "많이 어려움", color: "bg-orange-500 hover:bg-orange-600" },
                    { quality: 1, label: "기억 안남", desc: "거의 기억 못함", color: "bg-red-500 hover:bg-red-600" },
                    { quality: 0, label: "전혀 모름", desc: "처음 보는 것 같음", color: "bg-gray-500 hover:bg-gray-600" },
                  ].map((item) => (
                    <Button
                      key={item.quality}
                      onClick={() => handleQualityRating(item.quality as ReviewQuality)}
                      className={`${item.color} text-white h-auto py-3 flex flex-col gap-1`}
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs opacity-90">{item.desc}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  평가에 따라 다음 복습 일정이 자동으로 조정됩니다
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-sm">💡 랜덤 복습 팁</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>• 순서 없이 랜덤으로 복습하면 집중력이 향상됩니다</p>
          <p>• 정직하게 평가하면 더 효과적인 복습 스케줄이 만들어집니다</p>
          <p>• 어려운 주제는 자주, 쉬운 주제는 간격을 두고 복습됩니다</p>
          <p>• 매일 10-15분씩 꾸준히 복습하는 것이 가장 효과적입니다</p>
        </CardContent>
      </Card>
    </div>
  );
}
