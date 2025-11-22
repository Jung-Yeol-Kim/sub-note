"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Smile, Meh, Frown, PartyPopper } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const moods = [
  { value: "great", label: "최고!", icon: PartyPopper, color: "text-green-500" },
  { value: "good", label: "좋음", icon: Smile, color: "text-blue-500" },
  { value: "okay", label: "괜찮음", icon: Meh, color: "text-yellow-500" },
  { value: "struggling", label: "힘듦", icon: Frown, color: "text-red-500" },
];

export function DailyCheckIn() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [studyMinutes, setStudyMinutes] = useState("");
  const [topicsCompleted, setTopicsCompleted] = useState("");
  const [notes, setNotes] = useState("");

  const handleCheckIn = async () => {
    // TODO: Save to database
    console.log({
      mood: selectedMood,
      studyMinutes: Number.parseInt(studyMinutes),
      topicsCompleted: Number.parseInt(topicsCompleted),
      notes,
    });
    setIsCheckedIn(true);
  };

  const today = format(new Date(), "yyyy년 MM월 dd일 (EEE)", { locale: ko });

  return (
    <Card className="shadow-sm border-green-500/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          오늘의 체크인
        </CardTitle>
        <CardDescription>{today}</CardDescription>
      </CardHeader>
      <CardContent>
        {isCheckedIn ? (
          <div className="space-y-4 py-4 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">오늘도 수고하셨습니다!</h3>
              <p className="text-sm text-muted-foreground">
                꾸준함이 합격으로 가는 길입니다 ✨
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCheckedIn(false)}
            >
              수정하기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mood Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">오늘 기분은 어떠세요?</label>
              <div className="grid grid-cols-4 gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.value;
                  return (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-sm"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${mood.color}`} />
                      <span className="text-xs">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Study Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="studyMinutes" className="text-sm font-medium">
                  학습 시간 (분)
                </label>
                <Input
                  id="studyMinutes"
                  type="number"
                  placeholder="120"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="topicsCompleted" className="text-sm font-medium">
                  완료한 주제
                </label>
                <Input
                  id="topicsCompleted"
                  type="number"
                  placeholder="2"
                  value={topicsCompleted}
                  onChange={(e) => setTopicsCompleted(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                오늘의 메모 (선택)
              </label>
              <Textarea
                id="notes"
                placeholder="오늘 공부하면서 느낀 점, 어려웠던 점 등을 기록해보세요..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleCheckIn}
              disabled={!selectedMood || !studyMinutes}
              className="w-full"
            >
              체크인 완료
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
