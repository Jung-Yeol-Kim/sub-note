'use client';

import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type {
  MentoringData,
  MentoringProfile,
  WeeklyPlan,
  WeeklyGoal,
  DailyCheckIn,
  DailyCheckInFormData,
  WeeklyPlanFormData,
  WeeklyReviewFormData,
  LearningStreak,
  DEFAULT_MENTORING_DATA,
} from '@/lib/types/mentoring';

const STORAGE_KEY = 'itpe-mentoring-data';

/**
 * 로컬 스토리지에서 멘토링 데이터를 관리하는 훅
 */
export function useMentoringData() {
  const [data, setData] = useState<MentoringData>(DEFAULT_MENTORING_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as MentoringData;
          setData(parsed);
        }
      } catch (error) {
        console.error('Failed to load mentoring data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 로컬 스토리지에 데이터 저장
  const saveData = useCallback((newData: MentoringData) => {
    try {
      const updated = {
        ...newData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setData(updated);
    } catch (error) {
      console.error('Failed to save mentoring data:', error);
    }
  }, []);

  // 프로필 업데이트
  const updateProfile = useCallback(
    (updates: Partial<MentoringProfile>) => {
      saveData({
        ...data,
        profile: {
          ...data.profile,
          ...updates,
        },
      });
    },
    [data, saveData]
  );

  // 주간 플랜 생성
  const createWeeklyPlan = useCallback(
    (formData: WeeklyPlanFormData) => {
      const now = new Date();
      const weekStart = getMonday(now);

      const newPlan: WeeklyPlan = {
        id: nanoid(),
        weekStartDate: weekStart.toISOString(),
        goals: formData.goals.map((text) => ({
          id: nanoid(),
          text,
          completed: false,
        })),
      };

      saveData({
        ...data,
        weeklyPlans: [newPlan, ...data.weeklyPlans],
      });

      return newPlan;
    },
    [data, saveData]
  );

  // 주간 목표 완료/취소
  const toggleWeeklyGoal = useCallback(
    (planId: string, goalId: string) => {
      const updatedPlans = data.weeklyPlans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            goals: plan.goals.map((goal) => {
              if (goal.id === goalId) {
                return {
                  ...goal,
                  completed: !goal.completed,
                  completedAt: !goal.completed ? new Date().toISOString() : undefined,
                };
              }
              return goal;
            }),
          };
        }
        return plan;
      });

      saveData({
        ...data,
        weeklyPlans: updatedPlans,
      });
    },
    [data, saveData]
  );

  // 주간 리뷰 작성
  const addWeeklyReview = useCallback(
    (planId: string, formData: WeeklyReviewFormData) => {
      const updatedPlans = data.weeklyPlans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            review: formData.review,
            reviewedAt: new Date().toISOString(),
          };
        }
        return plan;
      });

      saveData({
        ...data,
        weeklyPlans: updatedPlans,
      });
    },
    [data, saveData]
  );

  // 일일 체크인 생성
  const createDailyCheckIn = useCallback(
    (formData: DailyCheckInFormData) => {
      const now = new Date();
      const today = getTodayString(now);

      // 오늘 이미 체크인했는지 확인
      const existingCheckIn = data.dailyCheckIns.find((c) => c.date === today);
      if (existingCheckIn) {
        throw new Error('오늘은 이미 체크인을 완료했습니다.');
      }

      const newCheckIn: DailyCheckIn = {
        id: nanoid(),
        date: today,
        completed: true,
        ...formData,
        checkedInAt: now.toISOString(),
      };

      // 연속 학습 일수 업데이트
      const updatedStreak = calculateStreak(data.streak, today);

      saveData({
        ...data,
        dailyCheckIns: [newCheckIn, ...data.dailyCheckIns],
        streak: updatedStreak,
      });

      return newCheckIn;
    },
    [data, saveData]
  );

  // 일일 체크인 수정
  const updateDailyCheckIn = useCallback(
    (checkInId: string, updates: Partial<DailyCheckInFormData>) => {
      const updatedCheckIns = data.dailyCheckIns.map((checkIn) => {
        if (checkIn.id === checkInId) {
          return {
            ...checkIn,
            ...updates,
          };
        }
        return checkIn;
      });

      saveData({
        ...data,
        dailyCheckIns: updatedCheckIns,
      });
    },
    [data, saveData]
  );

  // 완료한 주제 수 업데이트
  const updateCompletedTopics = useCallback(
    (count: number) => {
      updateProfile({ completedTopics: count });
    },
    [updateProfile]
  );

  // 현재 주의 플랜 가져오기
  const getCurrentWeekPlan = useCallback(() => {
    const weekStart = getMonday(new Date());
    const weekStartString = weekStart.toISOString().split('T')[0];

    return data.weeklyPlans.find((plan) => {
      const planDate = new Date(plan.weekStartDate).toISOString().split('T')[0];
      return planDate === weekStartString;
    });
  }, [data.weeklyPlans]);

  // 오늘의 체크인 가져오기
  const getTodayCheckIn = useCallback(() => {
    const today = getTodayString(new Date());
    return data.dailyCheckIns.find((c) => c.date === today);
  }, [data.dailyCheckIns]);

  // D-Day 계산
  const getDDay = useCallback(() => {
    if (!data.profile.examDate) return null;
    const exam = new Date(data.profile.examDate);
    const today = new Date();
    const diff = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [data.profile.examDate]);

  return {
    data,
    isLoading,
    profile: data.profile,
    weeklyPlans: data.weeklyPlans,
    dailyCheckIns: data.dailyCheckIns,
    streak: data.streak,

    // Actions
    updateProfile,
    createWeeklyPlan,
    toggleWeeklyGoal,
    addWeeklyReview,
    createDailyCheckIn,
    updateDailyCheckIn,
    updateCompletedTopics,

    // Helpers
    getCurrentWeekPlan,
    getTodayCheckIn,
    getDDay,
  };
}

// 유틸리티 함수들

/**
 * 주어진 날짜의 월요일을 반환
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * YYYY-MM-DD 형식의 오늘 날짜 문자열 반환
 */
function getTodayString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 연속 학습 일수 계산
 */
function calculateStreak(currentStreak: LearningStreak, todayString: string): LearningStreak {
  const today = new Date(todayString);
  const lastCheckIn = currentStreak.lastCheckInDate
    ? new Date(currentStreak.lastCheckInDate)
    : null;

  if (!lastCheckIn) {
    // 첫 체크인
    return {
      currentStreak: 1,
      longestStreak: 1,
      totalDays: 1,
      lastCheckInDate: todayString,
    };
  }

  const daysDiff = Math.floor(
    (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 1) {
    // 연속 학습
    const newStreak = currentStreak.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentStreak.longestStreak),
      totalDays: currentStreak.totalDays + 1,
      lastCheckInDate: todayString,
    };
  } else if (daysDiff > 1) {
    // 연속 끊김
    return {
      currentStreak: 1,
      longestStreak: currentStreak.longestStreak,
      totalDays: currentStreak.totalDays + 1,
      lastCheckInDate: todayString,
    };
  } else {
    // 같은 날 (이미 체크되어야 하지만 방어 코드)
    return currentStreak;
  }
}
