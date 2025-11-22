"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Clock, Smile, Meh, Frown, ThumbsUp, AlertCircle, Plus, X } from "lucide-react";
import type { DailyCheckIn as DailyCheckInType, DailyGoal } from "@/lib/types/mentoring";
import { nanoid } from "nanoid";

interface DailyCheckInProps {
  todayCheckIn?: DailyCheckInType;
  onCheckIn: (checkIn: Omit<DailyCheckInType, "id">) => void;
}

const moodOptions = [
  { value: "excellent", label: "아주 좋음", icon: ThumbsUp, color: "text-green-500" },
  { value: "good", label: "좋음", icon: Smile, color: "text-blue-500" },
  { value: "okay", label: "괜찮음", icon: Meh, color: "text-yellow-500" },
  { value: "struggling", label: "힘듦", icon: Frown, color: "text-orange-500" },
  { value: "difficult", label: "매우 힘듦", icon: AlertCircle, color: "text-red-500" },
] as const;

export function DailyCheckIn({ todayCheckIn, onCheckIn }: DailyCheckInProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [mood, setMood] = useState<DailyCheckInType["mood"]>("good");
  const [studyTime, setStudyTime] = useState(0);
  const [topicsStudied, setTopicsStudied] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);
  const [challengeInput, setChallengeInput] = useState("");
  const [notes, setNotes] = useState("");
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [goalInput, setGoalInput] = useState("");

  const handleCheckIn = () => {
    const today = new Date().toISOString().split("T")[0];
    onCheckIn({
      date: today,
      mood,
      studyTime,
      topicsStudied,
      achievements,
      challenges,
      notes,
      goals: dailyGoals,
    });
    resetForm();
    setIsChecking(false);
  };

  const resetForm = () => {
    setMood("good");
    setStudyTime(0);
    setTopicsStudied([]);
    setAchievements([]);
    setChallenges([]);
    setNotes("");
    setDailyGoals([]);
    setTopicInput("");
    setAchievementInput("");
    setChallengeInput("");
    setGoalInput("");
  };

  const addTopic = () => {
    if (topicInput.trim()) {
      setTopicsStudied([...topicsStudied, topicInput.trim()]);
      setTopicInput("");
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput("");
    }
  };

  const addChallenge = () => {
    if (challengeInput.trim()) {
      setChallenges([...challenges, challengeInput.trim()]);
      setChallengeInput("");
    }
  };

  const addGoal = () => {
    if (goalInput.trim()) {
      setDailyGoals([
        ...dailyGoals,
        { id: nanoid(), title: goalInput.trim(), completed: false },
      ]);
      setGoalInput("");
    }
  };

  const removeTopic = (index: number) => {
    setTopicsStudied(topicsStudied.filter((_, i) => i !== index));
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const removeChallenge = (index: number) => {
    setChallenges(challenges.filter((_, i) => i !== index));
  };

  const removeGoal = (id: string) => {
    setDailyGoals(dailyGoals.filter((g) => g.id !== id));
  };

  const getMoodIcon = (moodValue: DailyCheckInType["mood"]) => {
    const option = moodOptions.find((o) => o.value === moodValue);
    if (!option) return null;
    const Icon = option.icon;
    return <Icon className={`h-5 w-5 ${option.color}`} />;
  };

  return (
    <Card className="shadow-sm border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">오늘의 체크인</CardTitle>
          </div>
          {!todayCheckIn && (
            <Dialog open={isChecking} onOpenChange={setIsChecking}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  체크인하기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>오늘의 학습 체크인</DialogTitle>
                  <DialogDescription>
                    오늘 하루 학습을 기록하고 돌아보세요
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Mood */}
                  <div>
                    <Label>오늘의 기분</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {moodOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setMood(option.value)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              mood === option.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${option.color}`} />
                            <p className="text-xs font-medium">{option.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Study Time */}
                  <div>
                    <Label htmlFor="studyTime">학습 시간 (분)</Label>
                    <Input
                      id="studyTime"
                      type="number"
                      min="0"
                      value={studyTime}
                      onChange={(e) => setStudyTime(Number.parseInt(e.target.value))}
                      placeholder="예: 120"
                    />
                  </div>

                  {/* Topics Studied */}
                  <div>
                    <Label>학습한 주제</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTopic()}
                        placeholder="주제 입력"
                      />
                      <Button type="button" onClick={addTopic} variant="outline">
                        추가
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {topicsStudied.map((topic, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {topic}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTopic(i)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Daily Goals */}
                  <div>
                    <Label>오늘의 목표</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addGoal()}
                        placeholder="목표 입력"
                      />
                      <Button type="button" onClick={addGoal} variant="outline">
                        추가
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {dailyGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between p-2 rounded border"
                        >
                          <span className="text-sm">{goal.title}</span>
                          <X
                            className="h-4 w-4 cursor-pointer text-muted-foreground"
                            onClick={() => removeGoal(goal.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <Label>오늘의 성취</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={achievementInput}
                        onChange={(e) => setAchievementInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                        placeholder="성취한 것"
                      />
                      <Button type="button" onClick={addAchievement} variant="outline">
                        추가
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {achievements.map((achievement, i) => (
                        <Badge key={i} variant="default" className="gap-1">
                          {achievement}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeAchievement(i)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div>
                    <Label>오늘의 어려움</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={challengeInput}
                        onChange={(e) => setChallengeInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addChallenge()}
                        placeholder="어려웠던 것"
                      />
                      <Button type="button" onClick={addChallenge} variant="outline">
                        추가
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {challenges.map((challenge, i) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          {challenge}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeChallenge(i)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes">추가 메모</Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="오늘의 느낀 점, 내일 계획 등"
                    />
                  </div>

                  <Button onClick={handleCheckIn} className="w-full">
                    체크인 완료
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>매일 학습을 기록하고 성장을 확인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        {todayCheckIn ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                {getMoodIcon(todayCheckIn.mood)}
                <div>
                  <p className="font-semibold">체크인 완료!</p>
                  <p className="text-sm text-muted-foreground">
                    {moodOptions.find((o) => o.value === todayCheckIn.mood)?.label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{todayCheckIn.studyTime}분</span>
              </div>
            </div>

            {todayCheckIn.topicsStudied.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">학습한 주제</h4>
                <div className="flex flex-wrap gap-2">
                  {todayCheckIn.topicsStudied.map((topic, i) => (
                    <Badge key={i} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {todayCheckIn.achievements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">오늘의 성취</h4>
                <ul className="space-y-1">
                  {todayCheckIn.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {todayCheckIn.challenges.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">어려웠던 점</h4>
                <ul className="space-y-1">
                  {todayCheckIn.challenges.map((challenge, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {todayCheckIn.notes && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm">{todayCheckIn.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              오늘의 학습을 체크인하세요
            </p>
            <Button onClick={() => setIsChecking(true)}>
              <Plus className="h-4 w-4 mr-2" />
              체크인하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
