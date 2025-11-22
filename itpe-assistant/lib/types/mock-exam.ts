/**
 * Mock Exam Types for IT Professional Examination Practice
 * Phase 2: 실전 모의고사 시스템
 */

import type { SyllabusCategoryId } from "./subnote";

// Exam mode types
export type ExamMode =
  | "category" // 주제별 모의고사
  | "random" // 랜덤 모의고사
  | "weakness" // 취약 주제 모의고사
  | "realistic"; // 실전 모의고사 (4문제, 400분)

// Exam difficulty level
export type ExamDifficulty = "easy" | "medium" | "hard" | "mixed";

// Exam question structure
export interface ExamQuestion {
  id: string;
  title: string;
  description?: string;
  categoryId: SyllabusCategoryId;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  keywords: string[];
  timeLimit: number; // in minutes (default: 100)
  referenceAnswerPath?: string; // Path to reference answer if exists
}

// Exam configuration
export interface ExamConfig {
  mode: ExamMode;
  questionCount: 1 | 2 | 3 | 4;
  timeLimit: number; // Total time in minutes
  categoryId?: SyllabusCategoryId; // For category mode
  difficulty?: ExamDifficulty;
  includeTimer: boolean;
  autoSubmit: boolean; // Auto-submit when time expires
  showWarnings: boolean; // Show time warnings
  warningThresholds: number[]; // In minutes [20, 10, 5]
}

// Default exam configurations
export const DEFAULT_EXAM_CONFIGS: Record<ExamMode, Partial<ExamConfig>> = {
  category: {
    mode: "category",
    questionCount: 2,
    timeLimit: 200,
    includeTimer: true,
    autoSubmit: false,
    showWarnings: true,
    warningThresholds: [30, 15, 5],
  },
  random: {
    mode: "random",
    questionCount: 2,
    timeLimit: 200,
    includeTimer: true,
    autoSubmit: false,
    showWarnings: true,
    warningThresholds: [30, 15, 5],
  },
  weakness: {
    mode: "weakness",
    questionCount: 3,
    timeLimit: 300,
    includeTimer: true,
    autoSubmit: false,
    showWarnings: true,
    warningThresholds: [45, 20, 10],
  },
  realistic: {
    mode: "realistic",
    questionCount: 4,
    timeLimit: 400,
    includeTimer: true,
    autoSubmit: true,
    showWarnings: true,
    warningThresholds: [60, 30, 10],
  },
};

// User's answer for a question
export interface ExamAnswer {
  questionId: string;
  content: string;
  startedAt: Date;
  submittedAt?: Date;
  timeSpent: number; // in seconds
  characterCount: number;
  wordCount: number;
  autoSaved: boolean;
  lastSavedAt: Date;
}

// Exam session
export interface ExamSession {
  id: string;
  userId?: string;
  config: ExamConfig;
  questions: ExamQuestion[];
  answers: Record<string, ExamAnswer>; // questionId -> answer
  status: "not_started" | "in_progress" | "paused" | "completed" | "submitted";
  startedAt?: Date;
  completedAt?: Date;
  submittedAt?: Date;
  totalTimeSpent: number; // in seconds
  currentQuestionIndex: number;
  score?: ExamScore;
}

// AI Mentor Feedback (6 evaluation criteria from grading skill)
export interface FeedbackCriterion {
  name: string;
  score: number; // 0-5
  maxScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const EVALUATION_CRITERIA = [
  {
    id: "definition_clarity",
    name: "정의 명확성",
    description: "개념 정의가 명확하고 정확한가?",
    maxScore: 5,
  },
  {
    id: "keyword_coverage",
    name: "키워드 포함도",
    description: "핵심 키워드를 충분히 포함하고 있는가?",
    maxScore: 5,
  },
  {
    id: "structure_organization",
    name: "구조 체계성",
    description: "논리적 흐름과 구조가 체계적인가?",
    maxScore: 5,
  },
  {
    id: "technical_depth",
    name: "기술적 깊이",
    description: "기술적 이해도와 설명의 깊이가 충분한가?",
    maxScore: 5,
  },
  {
    id: "diagram_table_quality",
    name: "도표 품질",
    description: "다이어그램과 표가 효과적으로 활용되었는가?",
    maxScore: 5,
  },
  {
    id: "exam_format_compliance",
    name: "시험 형식 준수",
    description: "표준 답안 형식을 준수하였는가?",
    maxScore: 5,
  },
] as const;

// AI Mentor feedback for an answer
export interface AIFeedback {
  questionId: string;
  criteria: FeedbackCriterion[];
  totalScore: number;
  maxTotalScore: number;
  percentageScore: number;
  overallFeedback: string;
  missingKeywords: string[];
  suggestedKeywords: string[];
  structuralIssues: string[];
  improvementPlan: {
    priority: "high" | "medium" | "low";
    area: string;
    suggestion: string;
    example?: string;
  }[];
  comparisonWithReference?: {
    similarityScore: number; // 0-100
    keyDifferences: string[];
    strengthsOverReference: string[];
    weaknessesVsReference: string[];
  };
  estimatedExamScore: number; // Estimated score in real exam (0-100)
  mentoringMessage: string; // Encouraging message from AI mentor
}

// Complete exam result
export interface ExamScore {
  sessionId: string;
  submittedAt: Date;
  questionResults: {
    question: ExamQuestion;
    answer: ExamAnswer;
    feedback: AIFeedback;
  }[];
  overallScore: number; // Average of all questions
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  strengths: string[];
  weaknesses: string[];
  studyRecommendations: {
    topicId: string;
    topicName: string;
    reason: string;
    priority: "high" | "medium" | "low";
  }[];
  nextSteps: string[];
  progressComparison?: {
    previousScore?: number;
    improvement: number;
    trend: "improving" | "stable" | "declining";
  };
}

// Exam history for tracking progress
export interface ExamHistory {
  userId: string;
  sessions: ExamSession[];
  statistics: {
    totalExams: number;
    totalQuestions: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    totalTimeSpent: number; // in hours
    categoryPerformance: Record<
      SyllabusCategoryId,
      {
        count: number;
        averageScore: number;
        trend: "improving" | "stable" | "declining";
      }
    >;
    weakTopics: {
      categoryId: SyllabusCategoryId;
      categoryName: string;
      averageScore: number;
      attemptCount: number;
    }[];
    strongTopics: {
      categoryId: SyllabusCategoryId;
      categoryName: string;
      averageScore: number;
      attemptCount: number;
    }[];
    recentTrend: {
      date: Date;
      score: number;
    }[];
  };
}

// Helper functions
export function calculateTimeRemaining(
  startTime: Date,
  timeLimit: number
): number {
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  const remaining = timeLimit * 60 - elapsed;
  return Math.max(0, remaining);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function shouldShowWarning(
  remainingSeconds: number,
  thresholds: number[]
): { show: boolean; message: string } {
  const remainingMinutes = Math.floor(remainingSeconds / 60);

  for (const threshold of thresholds) {
    if (
      remainingMinutes === threshold &&
      remainingSeconds % 60 >= 0 &&
      remainingSeconds % 60 < 5
    ) {
      return {
        show: true,
        message: `⏰ 남은 시간: ${threshold}분`,
      };
    }
  }

  if (remainingSeconds <= 0) {
    return {
      show: true,
      message: "⏰ 시간이 종료되었습니다!",
    };
  }

  return { show: false, message: "" };
}

export function calculateExamScore(
  questionResults: ExamScore["questionResults"]
): number {
  if (questionResults.length === 0) return 0;

  const totalScore = questionResults.reduce(
    (sum, result) => sum + result.feedback.percentageScore,
    0
  );

  return Math.round(totalScore / questionResults.length);
}

export function identifyWeakTopics(
  history: ExamHistory,
  threshold = 60
): ExamHistory["statistics"]["weakTopics"] {
  const categoryScores: Record<
    string,
    { scores: number[]; categoryName: string }
  > = {};

  history.sessions.forEach((session) => {
    if (session.score) {
      session.score.questionResults.forEach((result) => {
        const catId = result.question.categoryId;
        if (!categoryScores[catId]) {
          categoryScores[catId] = {
            scores: [],
            categoryName: result.question.categoryName,
          };
        }
        categoryScores[catId].scores.push(result.feedback.percentageScore);
      });
    }
  });

  return Object.entries(categoryScores)
    .map(([categoryId, data]) => ({
      categoryId: categoryId as SyllabusCategoryId,
      categoryName: data.categoryName,
      averageScore:
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      attemptCount: data.scores.length,
    }))
    .filter((topic) => topic.averageScore < threshold)
    .sort((a, b) => a.averageScore - b.averageScore);
}

export function generateStudyRecommendations(
  score: ExamScore
): ExamScore["studyRecommendations"] {
  const recommendations: ExamScore["studyRecommendations"] = [];

  score.questionResults.forEach((result) => {
    const avgScore = result.feedback.percentageScore;

    if (avgScore < 50) {
      recommendations.push({
        topicId: result.question.id,
        topicName: result.question.title,
        reason: `낮은 점수 (${avgScore}점) - 기본 개념 재학습 필요`,
        priority: "high",
      });
    } else if (avgScore < 70) {
      recommendations.push({
        topicId: result.question.id,
        topicName: result.question.title,
        reason: `보통 점수 (${avgScore}점) - 심화 학습 및 연습 필요`,
        priority: "medium",
      });
    }
  });

  return recommendations;
}

export function countWords(text: string): number {
  // Korean text doesn't use spaces consistently, so count characters instead
  return text.replace(/\s/g, "").length;
}

export function generateMentoringMessage(score: number): string {
  if (score >= 90) {
    return "🎉 훌륭합니다! 이 수준이라면 합격이 눈앞에 있습니다. 꾸준히 연습하세요!";
  }
  if (score >= 80) {
    return "👏 잘하고 계십니다! 조금만 더 다듬으면 완벽한 답안이 될 것입니다.";
  }
  if (score >= 70) {
    return "💪 좋은 시작입니다! 피드백을 참고하여 약한 부분을 보완하세요.";
  }
  if (score >= 60) {
    return "📚 기본은 잡으셨습니다. 구조화와 키워드 활용을 더 연습해보세요.";
  }
  if (score >= 50) {
    return "🔥 포기하지 마세요! 기본 개념을 다시 정리하고 반복 연습이 필요합니다.";
  }
  return "💡 시작이 반입니다! 모범 답안을 참고하여 구조를 익히는 것부터 시작하세요.";
}
