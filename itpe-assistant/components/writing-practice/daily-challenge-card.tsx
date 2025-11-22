"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Target,
  Clock,
  Zap,
  Send,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { startWritingChallenge, completeWritingChallenge } from "../actions/writing-practice-actions";
import { useRouter } from "next/navigation";

interface DailyChallengeCardProps {
  streak: any;
}

export function DailyChallengeCard({ streak }: DailyChallengeCardProps) {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [content, setContent] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleStartChallenge = async () => {
    try {
      const challenge = await startWritingChallenge();
      setChallengeId(challenge.id);
      setIsStarted(true);
      setStartTime(Date.now());

      // Start timer
      const interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Failed to start challenge:", error);
    }
  };

  const handleSaveDraft = async () => {
    if (!challengeId) return;

    try {
      await completeWritingChallenge(challengeId, {
        content,
        timeSpent,
        isCompleted: false,
      });

      alert("임시 저장되었습니다!");
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const handleSubmit = async () => {
    if (!challengeId || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await completeWritingChallenge(challengeId, {
        content,
        timeSpent,
        isCompleted: true,
      });

      // Refresh the page to update streak
      router.refresh();

      // Reset state
      setIsStarted(false);
      setContent("");
      setTimeSpent(0);
      setStartTime(null);
      setChallengeId(null);
    } catch (error) {
      console.error("Failed to submit challenge:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isStarted) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">오늘의 쓰기 챌린지</h2>
          <p className="text-muted-foreground mb-6">
            매일 한 주제씩 작성하며 실력을 키워보세요!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-muted/50 rounded-lg p-4">
              <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">랜덤 주제</p>
              <p className="text-xs text-muted-foreground">
                AI가 선정한 오늘의 주제
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">시간 측정</p>
              <p className="text-xs text-muted-foreground">
                작성 시간을 자동 기록
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">즉각 피드백</p>
              <p className="text-xs text-muted-foreground">
                AI가 바로 평가
              </p>
            </div>
          </div>

          <Button size="lg" onClick={handleStartChallenge}>
            <Target className="mr-2 h-5 w-5" />
            오늘의 챌린지 시작하기
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">오늘의 챌린지</h2>
          <Badge variant="outline" className="mt-2">
            <Zap className="mr-1 h-3 w-3" />
            랜덤 주제
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">작성 시간</p>
            <p className="text-2xl font-mono font-bold">{formatTime(timeSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">단어 수</p>
            <p className="text-2xl font-mono font-bold">{wordCount}</p>
          </div>
        </div>
      </div>

      {/* Writing Area */}
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-lg font-semibold mb-2">
            주제: <span className="text-primary">OAuth 2.0 인증 프로토콜</span>
          </p>
          <p className="text-sm text-muted-foreground">
            정의, 구조, 종류를 포함하여 1페이지 분량으로 작성하세요.
          </p>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기에 답안을 작성하세요..."
          className="min-h-[400px] font-mono text-sm"
        />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              임시 저장
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("정말 초기화하시겠습니까?")) {
                  setContent("");
                }
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
          </div>

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            <Send className="mr-2 h-5 w-5" />
            {isSubmitting ? "제출 중..." : "제출하고 평가받기"}
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">💡 작성 팁</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 정의 → 설명 → 분류 순서로 작성하세요</li>
            <li>• 다이어그램과 표를 적극 활용하세요</li>
            <li>• 핵심 키워드를 명확히 표시하세요</li>
            <li>• 조사를 생략하여 간결하게 작성하세요</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
