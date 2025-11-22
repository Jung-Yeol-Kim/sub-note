"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Smile, Meh, Frown } from "lucide-react";

const moods = [
  { value: "motivated", label: "의욕적", icon: Smile, color: "text-green-500" },
  { value: "neutral", label: "보통", icon: Meh, color: "text-yellow-500" },
  { value: "tired", label: "피곤", icon: Frown, color: "text-orange-500" },
];

interface DailyCheckInProps {
  hasCheckedInToday: boolean;
  onCheckIn: (data: {
    mood: string;
    energyLevel: number;
    notes: string;
  }) => Promise<void>;
}

export function DailyCheckIn({ hasCheckedInToday, onCheckIn }: DailyCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      await onCheckIn({
        mood: selectedMood,
        energyLevel,
        notes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasCheckedInToday) {
    return (
      <Card className="shadow-sm border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">
                오늘의 체크인 완료!
              </p>
              <p className="text-sm text-muted-foreground">
                내일 또 만나요 👋
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Circle className="h-5 w-5 text-primary" />
          오늘의 체크인
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">오늘 기분은 어떤가요?</label>
          <div className="flex gap-2">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.value;
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-1 ${mood.color}`} />
                  <p className="text-xs font-medium">{mood.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            에너지 레벨: {energyLevel}/5
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEnergyLevel(level)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  level <= energyLevel
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">오늘의 메모 (선택)</label>
          <Textarea
            placeholder="오늘 학습한 내용이나 느낀 점을 적어보세요..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedMood || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "저장 중..." : "체크인 완료"}
        </Button>
      </CardContent>
    </Card>
  );
}
