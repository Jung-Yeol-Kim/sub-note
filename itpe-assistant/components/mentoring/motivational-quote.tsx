"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const quotes = [
  {
    text: "합격자들의 공통점: 매일 2개씩, 꾸준히 2개월 이상 쓰기 연습",
    author: "실제 합격자 후기",
  },
  {
    text: "4점을 5점으로 올리는 것이 3점을 4점으로 올리는 것보다 쉽습니다",
    author: "멘토의 조언",
  },
  {
    text: "혼자서는 어렵습니다. 멘토링과 피드백이 합격의 핵심입니다",
    author: "합격자 인터뷰",
  },
  {
    text: "랜덤 복습으로 집중력을 유지하고 전체 주제의 균형을 맞추세요",
    author: "학습 전략",
  },
  {
    text: "장기전입니다. 심리적 지원과 격려가 포기하지 않는 힘이 됩니다",
    author: "멘토링 가이드",
  },
  {
    text: "매일 쓰는 습관이 합격의 원동력입니다. 오늘도 한 걸음 나아가세요",
    author: "학습 멘토",
  },
];

export function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Show a different quote each day
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24
    );
    const quoteIndex = dayOfYear % quotes.length;
    setQuote(quotes[quoteIndex]);
  }, []);

  return (
    <Card className="shadow-sm border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "{quote.text}"
            </p>
            <p className="text-sm text-muted-foreground">- {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
