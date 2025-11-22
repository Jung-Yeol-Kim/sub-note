/**
 * Mentoring Dashboard Data Types
 * Phase 1: 멘토링 대시보드 - 학습 여정 추적, 주간 플랜, 매일 체크인
 */

export interface MentoringProfile {
  // 시험 정보
  examDate: string | null; // ISO 8601 date string
  targetScore: number; // 목표 점수

  // 진도 정보
  targetTopics: number; // 목표 주제 수
  completedTopics: number; // 완료한 주제 수

  // 학습 기간
  startDate: string; // ISO 8601 date string

  // 사용자 정보
  name: string;
  motivation: string; // 동기부여 메시지
}

export interface WeeklyGoal {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string; // ISO 8601 date string
}

export interface WeeklyPlan {
  id: string;
  weekStartDate: string; // ISO 8601 date string (Monday)
  goals: WeeklyGoal[];
  review?: string; // 주간 리뷰
  reviewedAt?: string; // ISO 8601 date string
}

export type MoodType = 'great' | 'good' | 'okay' | 'tired' | 'struggling';

export interface DailyCheckIn {
  id: string;
  date: string; // ISO 8601 date string
  completed: boolean;

  // 일일 학습 정보
  goals: string[]; // 오늘의 목표
  accomplishments: string[]; // 달성한 것들
  studyTime: number; // 분 단위

  // 감정 상태
  mood: MoodType;
  moodNote?: string; // 기분에 대한 메모

  // 반성 및 계획
  challenges?: string; // 어려웠던 점
  learnings?: string; // 배운 점
  tomorrowPlan?: string; // 내일 계획

  // 완료 시각
  checkedInAt: string; // ISO 8601 date string
}

export interface LearningStreak {
  currentStreak: number; // 현재 연속 일수
  longestStreak: number; // 최장 연속 일수
  totalDays: number; // 총 학습 일수
  lastCheckInDate: string | null; // 마지막 체크인 날짜
}

export interface MentoringData {
  profile: MentoringProfile;
  weeklyPlans: WeeklyPlan[];
  dailyCheckIns: DailyCheckIn[];
  streak: LearningStreak;

  // 메타데이터
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

// 기본 데이터
export const DEFAULT_MENTORING_PROFILE: MentoringProfile = {
  examDate: null,
  targetScore: 60,
  targetTopics: 500,
  completedTopics: 0,
  startDate: new Date().toISOString(),
  name: '수험생',
  motivation: '정보관리기술사 합격을 향해!',
};

export const DEFAULT_LEARNING_STREAK: LearningStreak = {
  currentStreak: 0,
  longestStreak: 0,
  totalDays: 0,
  lastCheckInDate: null,
};

export const DEFAULT_MENTORING_DATA: MentoringData = {
  profile: DEFAULT_MENTORING_PROFILE,
  weeklyPlans: [],
  dailyCheckIns: [],
  streak: DEFAULT_LEARNING_STREAK,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 유틸리티 타입
export interface DailyCheckInFormData {
  goals: string[];
  accomplishments: string[];
  studyTime: number;
  mood: MoodType;
  moodNote?: string;
  challenges?: string;
  learnings?: string;
  tomorrowPlan?: string;
}

export interface WeeklyPlanFormData {
  goals: string[];
}

export interface WeeklyReviewFormData {
  review: string;
}
