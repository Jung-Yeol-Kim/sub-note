"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  MentoringDashboard,
  ExamTarget,
  WeeklyGoal,
  DailyCheckIn,
  Milestone,
} from "@/lib/types/mentoring";
import { nanoid } from "nanoid";

const STORAGE_KEY = "itpe-mentoring-dashboard";

// Default data with encouraging messages
const getDefaultData = (): MentoringDashboard => ({
  examTarget: {
    examDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    examRound: "155회",
    daysUntilExam: 90,
  },
  progress: {
    totalTopics: 500,
    completedTopics: 0,
    inProgressTopics: 0,
    percentComplete: 0,
  },
  weeklyGoals: [],
  dailyCheckIns: [],
  studyStreak: {
    currentStreak: 0,
    longestStreak: 0,
  },
  weakAreas: [],
  milestones: [],
  encouragementMessages: [
    "매일 조금씩, 꾸준히 하는 것이 합격의 비결입니다! 💪",
    "오늘도 한 걸음 더 나아갔습니다. 화이팅! 🚀",
    "완벽하지 않아도 괜찮습니다. 계속 전진하세요! 🌟",
    "어제보다 나은 오늘을 만들어가고 있습니다! 📈",
    "포기하지 마세요. 당신은 할 수 있습니다! 🎯",
  ],
});

export function useMentoringData() {
  const [data, setData] = useState<MentoringDashboard>(getDefaultData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Calculate days until exam
        const examDate = new Date(parsed.examTarget.examDate);
        const today = new Date();
        const daysUntil = Math.ceil(
          (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        parsed.examTarget.daysUntilExam = daysUntil;

        setData(parsed);
      }
    } catch (error) {
      console.error("Failed to load mentoring data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback((newData: MentoringDashboard) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Failed to save mentoring data:", error);
    }
  }, []);

  // Update exam target
  const updateExamTarget = useCallback(
    (target: Partial<ExamTarget>) => {
      const newTarget = { ...data.examTarget, ...target };
      if (target.examDate) {
        const examDate = new Date(target.examDate);
        const today = new Date();
        newTarget.daysUntilExam = Math.ceil(
          (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
      }
      saveData({ ...data, examTarget: newTarget });
    },
    [data, saveData]
  );

  // Update progress
  const updateProgress = useCallback(
    (completed: number, inProgress: number) => {
      const percentComplete = Math.round(
        (completed / data.progress.totalTopics) * 100
      );
      saveData({
        ...data,
        progress: {
          ...data.progress,
          completedTopics: completed,
          inProgressTopics: inProgress,
          percentComplete,
        },
      });
    },
    [data, saveData]
  );

  // Add weekly goal
  const addWeeklyGoal = useCallback(
    (goal: Omit<WeeklyGoal, "id">) => {
      const newGoal: WeeklyGoal = {
        ...goal,
        id: nanoid(),
        goals: goal.goals.map((g) => ({ ...g, id: g.id || nanoid() })),
      };
      saveData({
        ...data,
        weeklyGoals: [newGoal, ...data.weeklyGoals],
      });
    },
    [data, saveData]
  );

  // Update weekly goal
  const updateWeeklyGoal = useCallback(
    (id: string, updates: Partial<WeeklyGoal>) => {
      const updated = data.weeklyGoals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      );
      saveData({ ...data, weeklyGoals: updated });
    },
    [data, saveData]
  );

  // Add daily check-in
  const addDailyCheckIn = useCallback(
    (checkIn: Omit<DailyCheckIn, "id">) => {
      const newCheckIn: DailyCheckIn = {
        ...checkIn,
        id: nanoid(),
        goals: checkIn.goals.map((g) => ({ ...g, id: g.id || nanoid() })),
      };

      // Update study streak
      const lastCheckIn = data.dailyCheckIns[0];
      const today = new Date(checkIn.date);
      let newStreak = data.studyStreak;

      if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn.date);
        const daysDiff = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day
          newStreak = {
            currentStreak: data.studyStreak.currentStreak + 1,
            longestStreak: Math.max(
              data.studyStreak.longestStreak,
              data.studyStreak.currentStreak + 1
            ),
            lastStudyDate: checkIn.date,
          };
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = {
            currentStreak: 1,
            longestStreak: data.studyStreak.longestStreak,
            lastStudyDate: checkIn.date,
          };
        }
      } else {
        newStreak = {
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: checkIn.date,
        };
      }

      // Check for streak milestone
      const milestones = [...data.milestones];
      if (newStreak.currentStreak % 7 === 0 && newStreak.currentStreak > 0) {
        milestones.push({
          id: nanoid(),
          title: `${newStreak.currentStreak}일 연속 학습!`,
          description: `${newStreak.currentStreak}일 동안 매일 학습하셨습니다! 🎉`,
          achievedAt: checkIn.date,
          type: "streak",
        });
      }

      saveData({
        ...data,
        dailyCheckIns: [newCheckIn, ...data.dailyCheckIns].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        studyStreak: newStreak,
        milestones,
      });
    },
    [data, saveData]
  );

  // Add milestone
  const addMilestone = useCallback(
    (milestone: Omit<Milestone, "id">) => {
      const newMilestone: Milestone = {
        ...milestone,
        id: nanoid(),
      };
      saveData({
        ...data,
        milestones: [newMilestone, ...data.milestones],
      });
    },
    [data, saveData]
  );

  // Get current week's goal
  const getCurrentWeekGoal = useCallback(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);

    return data.weeklyGoals.find((goal) => {
      const goalStart = new Date(goal.weekStart);
      return goalStart.getTime() === monday.getTime();
    });
  }, [data.weeklyGoals]);

  // Get today's check-in
  const getTodayCheckIn = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return data.dailyCheckIns.find((checkIn) => checkIn.date === today);
  }, [data.dailyCheckIns]);

  // Get random encouragement message
  const getEncouragementMessage = useCallback(() => {
    const messages = data.encouragementMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }, [data.encouragementMessages]);

  return {
    data,
    isLoaded,
    updateExamTarget,
    updateProgress,
    addWeeklyGoal,
    updateWeeklyGoal,
    addDailyCheckIn,
    addMilestone,
    getCurrentWeekGoal,
    getTodayCheckIn,
    getEncouragementMessage,
  };
}
