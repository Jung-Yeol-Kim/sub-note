/**
 * Mentoring Dashboard Types
 * For IT Professional Examination (정보관리기술사) Study Tracking
 */

export interface ExamTarget {
  examDate: string; // ISO date string
  examRound: string; // e.g., "155회"
  daysUntilExam: number;
}

export interface LearningProgress {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  percentComplete: number;
}

export interface WeeklyGoal {
  id: string;
  weekStart: string; // ISO date string (Monday)
  weekEnd: string; // ISO date string (Sunday)
  goals: Goal[];
  review?: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: string; // ISO date string
  completed: boolean;
  completedAt?: string; // ISO date string
}

export interface DailyCheckIn {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  mood: "excellent" | "good" | "okay" | "struggling" | "difficult";
  studyTime: number; // in minutes
  topicsStudied: string[];
  achievements: string[];
  challenges: string[];
  notes?: string;
  goals: DailyGoal[];
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
}

export interface StudyStreak {
  currentStreak: number; // consecutive days
  longestStreak: number;
  lastStudyDate?: string; // ISO date string
}

export interface WeakArea {
  category: string;
  topics: string[];
  priority: "high" | "medium" | "low";
  suggestedAction: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedAt: string; // ISO date string
  type: "streak" | "topic" | "score" | "custom";
}

export interface MentoringDashboard {
  examTarget: ExamTarget;
  progress: LearningProgress;
  weeklyGoals: WeeklyGoal[];
  dailyCheckIns: DailyCheckIn[];
  studyStreak: StudyStreak;
  weakAreas: WeakArea[];
  milestones: Milestone[];
  encouragementMessages: string[];
}

// Helper function types
export type MoodEmoji = {
  [key in DailyCheckIn["mood"]]: string;
};

export type PriorityColor = {
  [key in WeakArea["priority"]]: string;
};
