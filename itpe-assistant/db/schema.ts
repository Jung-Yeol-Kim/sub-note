import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Better Auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User's personal sub-notes
export const subNotes = pgTable("sub_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown content
  category: text("category"), // e.g., "네트워크", "보안", "데이터베이스"
  tags: text("tags").array(), // Array of tags
  status: text("status").notNull().default("draft"), // draft, in_review, completed
  difficulty: integer("difficulty"), // 1-5 scale
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Official exam topics/questions
export const examTopics = pgTable("exam_topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  examRound: integer("exam_round"), // e.g., 135, 136
  questionNumber: integer("question_number"),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  tags: text("tags").array(),
  difficulty: integer("difficulty"),
  year: integer("year"),
  season: text("season"), // "spring", "fall"
  frequency: integer("frequency").default(0), // How often this topic appears
  relatedTopics: text("related_topics").array(), // Related topic IDs
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Community shared sub-notes
export const sharedSubNotes = pgTable("shared_sub_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalSubNoteId: uuid("original_sub_note_id").references(() => subNotes.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  userName: text("user_name"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  difficulty: integer("difficulty"),
  isPublic: boolean("is_public").notNull().default(true),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// AI-generated topic suggestions
export const aiTopicSuggestions = pgTable("ai_topic_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  rationale: text("rationale"), // Why AI suggests this topic
  category: text("category"),
  tags: text("tags").array(),
  difficulty: integer("difficulty"),
  priority: integer("priority").default(0), // Higher = more important
  trendScore: integer("trend_score"), // Based on recent tech trends
  examProbability: integer("exam_probability"), // Likelihood of appearing
  relatedExamTopics: text("related_exam_topics").array(),
  sourceData: jsonb("source_data"), // Context used for generation
  status: text("status").default("pending"), // pending, accepted, dismissed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// AI evaluations of user answers
export const aiEvaluations = pgTable("ai_evaluations", {
  id: uuid("id").primaryKey().defaultRandom(),
  subNoteId: uuid("sub_note_id").references(() => subNotes.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  model: text("model").notNull(), // e.g., "claude-3-5-sonnet"

  // Scores based on 6 evaluation criteria
  overallScore: integer("overall_score"), // 0-100
  completenessScore: integer("completeness_score"), // 내용 완성도
  accuracyScore: integer("accuracy_score"), // 정확성
  structureScore: integer("structure_score"), // 구조 및 논리성
  clarityScore: integer("clarity_score"), // 명료성
  keywordScore: integer("keyword_score"), // 키워드 포함
  technicalDepthScore: integer("technical_depth_score"), // 기술 깊이

  // Detailed feedback
  strengths: text("strengths").array(),
  weaknesses: text("weaknesses").array(),
  missingKeywords: text("missing_keywords").array(),
  suggestions: text("suggestions").array(),
  detailedFeedback: text("detailed_feedback"), // Markdown format

  // Metadata
  evaluationData: jsonb("evaluation_data"), // Full AI response
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Study sessions tracking
export const studySessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subNoteId: uuid("sub_note_id").references(() => subNotes.id),
  duration: integer("duration"), // in minutes
  activityType: text("activity_type"), // "writing", "reviewing", "practicing"
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  subNotes: many(subNotes),
  sessions: many(session),
  accounts: many(account),
  sharedSubNotes: many(sharedSubNotes),
  aiEvaluations: many(aiEvaluations),
  studySessions: many(studySessions),
  comments: many(comments),
  sharedSubNoteLikes: many(sharedSubNoteLikes),
  bookmarks: many(bookmarks),
  commentLikes: many(commentLikes),
}));

export const subNotesRelations = relations(subNotes, ({ many, one }) => ({
  user: one(user, {
    fields: [subNotes.userId],
    references: [user.id],
  }),
  evaluations: many(aiEvaluations),
  studySessions: many(studySessions),
  sharedVersions: many(sharedSubNotes),
}));

export const aiEvaluationsRelations = relations(aiEvaluations, ({ one }) => ({
  subNote: one(subNotes, {
    fields: [aiEvaluations.subNoteId],
    references: [subNotes.id],
  }),
}));

export const sharedSubNotesRelations = relations(sharedSubNotes, ({ one, many }) => ({
  originalSubNote: one(subNotes, {
    fields: [sharedSubNotes.originalSubNoteId],
    references: [subNotes.id],
  }),
  user: one(user, {
    fields: [sharedSubNotes.userId],
    references: [user.id],
  }),
  comments: many(comments),
  likes: many(sharedSubNoteLikes),
  bookmarks: many(bookmarks),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  subNote: one(subNotes, {
    fields: [studySessions.subNoteId],
    references: [subNotes.id],
  }),
}));

// Community comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  sharedSubNoteId: uuid("shared_sub_note_id")
    .notNull()
    .references(() => sharedSubNotes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  userName: text("user_name"),
  userImage: text("user_image"),
  content: text("content").notNull(),
  parentCommentId: uuid("parent_comment_id"), // For nested replies
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// User likes on shared sub-notes
export const sharedSubNoteLikes = pgTable("shared_sub_note_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  sharedSubNoteId: uuid("shared_sub_note_id")
    .notNull()
    .references(() => sharedSubNotes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User bookmarks
export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  sharedSubNoteId: uuid("shared_sub_note_id")
    .notNull()
    .references(() => sharedSubNotes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Comment likes
export const commentLikes = pgTable("comment_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => comments.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations for new tables
export const commentsRelations = relations(comments, ({ one, many }) => ({
  sharedSubNote: one(sharedSubNotes, {
    fields: [comments.sharedSubNoteId],
    references: [sharedSubNotes.id],
  }),
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "replies",
  }),
  replies: many(comments, {
    relationName: "replies",
  }),
  likes: many(commentLikes),
}));

export const sharedSubNoteLikesRelations = relations(sharedSubNoteLikes, ({ one }) => ({
  sharedSubNote: one(sharedSubNotes, {
    fields: [sharedSubNoteLikes.sharedSubNoteId],
    references: [sharedSubNotes.id],
  }),
  user: one(user, {
    fields: [sharedSubNoteLikes.userId],
    references: [user.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  sharedSubNote: one(sharedSubNotes, {
    fields: [bookmarks.sharedSubNoteId],
    references: [sharedSubNotes.id],
  }),
  user: one(user, {
    fields: [bookmarks.userId],
    references: [user.id],
  }),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(user, {
    fields: [commentLikes.userId],
    references: [user.id],
  }),
}));

// ====== Phase 1: Mentoring Dashboard ======

// Study goals - 학습 목표 설정
export const studyGoals = pgTable("study_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  examDate: timestamp("exam_date"), // 목표 시험 날짜
  targetScore: integer("target_score"), // 목표 점수
  dailyStudyMinutes: integer("daily_study_minutes").default(120), // 일일 학습 시간 목표 (분)
  weeklyTopicsGoal: integer("weekly_topics_goal").default(5), // 주간 주제 목표 수
  motivation: text("motivation"), // 학습 동기
  currentLevel: text("current_level"), // 현재 수준 (beginner, intermediate, advanced)
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Weekly plans - 주간 학습 플랜
export const weeklyPlans = pgTable("weekly_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  weekNumber: integer("week_number").notNull(), // 주차 (1, 2, 3...)
  year: integer("year").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  goalTopics: text("goal_topics").array(), // 목표 주제 목록
  goalStudyMinutes: integer("goal_study_minutes").default(840), // 주간 목표 학습 시간
  actualStudyMinutes: integer("actual_study_minutes").default(0),
  completedTopics: text("completed_topics").array().default([]),
  status: text("status").default("active"), // active, completed, abandoned
  reflection: text("reflection"), // 주간 회고
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Daily check-ins - 매일 체크인
export const dailyCheckIns = pgTable("daily_check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  studyMinutes: integer("study_minutes").default(0), // 실제 학습 시간
  topicsStudied: text("topics_studied").array().default([]), // 학습한 주제
  mood: text("mood"), // happy, neutral, tired, stressed, motivated
  energyLevel: integer("energy_level"), // 1-5
  notes: text("notes"), // 오늘의 메모
  challenges: text("challenges").array(), // 오늘의 어려움
  achievements: text("achievements").array(), // 오늘의 성취
  tomorrowPlan: text("tomorrow_plan"), // 내일 계획
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Learning streaks - 연속 학습 기록
export const learningStreaks = pgTable("learning_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0), // 현재 연속 일수
  longestStreak: integer("longest_streak").default(0), // 최장 연속 일수
  lastCheckInDate: timestamp("last_check_in_date"),
  totalCheckIns: integer("total_check_ins").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ====== Phase 2: Mock Exam System ======

// Mock exam sessions - 모의고사 세션
export const mockExamSessions = pgTable("mock_exam_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  examType: text("exam_type").notNull(), // full (전체), partial (부분), random (랜덤)
  selectedTopics: text("selected_topics").array(), // 선택된 주제 ID들
  questionsCount: integer("questions_count").notNull(),
  timeLimit: integer("time_limit"), // 제한 시간 (분)
  status: text("status").default("not_started"), // not_started, in_progress, completed, abandoned
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  totalScore: integer("total_score"), // 총점
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Mock exam answers - 모의고사 답안
export const mockExamAnswers = pgTable("mock_exam_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => mockExamSessions.id, { onDelete: "cascade" }),
  topicId: uuid("topic_id").references(() => examTopics.id),
  questionText: text("question_text").notNull(),
  answerContent: text("answer_content"), // 작성한 답안
  timeSpent: integer("time_spent"), // 소요 시간 (초)
  aiScore: integer("ai_score"), // AI 평가 점수
  aiFeedback: jsonb("ai_feedback"), // AI 피드백 상세
  strengths: text("strengths").array(),
  weaknesses: text("weaknesses").array(),
  suggestions: text("suggestions").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ====== Phase 3: Spaced Repetition System ======

// Review schedule - 복습 스케줄 (간격 반복)
export const reviewSchedule = pgTable("review_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subNoteId: uuid("sub_note_id")
    .notNull()
    .references(() => subNotes.id, { onDelete: "cascade" }),
  repetitionNumber: integer("repetition_number").default(0), // 반복 횟수
  easeFactor: integer("ease_factor").default(250), // 난이도 계수 (250 = 2.5)
  interval: integer("interval").default(1), // 다음 복습까지 일수
  nextReviewDate: timestamp("next_review_date").notNull(),
  lastReviewedAt: timestamp("last_reviewed_at"),
  reviewQuality: integer("review_quality"), // 마지막 복습 품질 (0-5)
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ====== Phase 4: Writing Practice ======

// Writing challenges - 매일 쓰기 챌린지
export const writingChallenges = pgTable("writing_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  topicId: uuid("topic_id").references(() => examTopics.id),
  topicTitle: text("topic_title").notNull(),
  answer: text("answer"),
  timeSpent: integer("time_spent"), // 소요 시간 (분)
  wordCount: integer("word_count"),
  completed: boolean("completed").default(false),
  quality: integer("quality"), // AI 평가 품질 (0-100)
  feedback: jsonb("feedback"), // AI 피드백
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Writing patterns analysis - 쓰기 패턴 분석
export const writingPatterns = pgTable("writing_patterns", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
  totalWritingSessions: integer("total_writing_sessions"),
  averageWordCount: integer("average_word_count"),
  averageTimeSpent: integer("average_time_spent"),
  commonStrengths: text("common_strengths").array(),
  commonWeaknesses: text("common_weaknesses").array(),
  improvementAreas: text("improvement_areas").array(),
  writingStyle: text("writing_style"), // concise, detailed, structured, etc.
  consistencyScore: integer("consistency_score"), // 0-100
  patternData: jsonb("pattern_data"), // 상세 패턴 데이터
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ====== Phase 5: Community Mentoring ======

// Study groups - 스터디 그룹
export const studyGroups = pgTable("study_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  memberCount: integer("member_count").default(1),
  maxMembers: integer("max_members").default(10),
  targetExamDate: timestamp("target_exam_date"),
  meetingSchedule: text("meeting_schedule"), // 정기 모임 일정
  focusAreas: text("focus_areas").array(), // 집중 분야
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  isPublic: boolean("is_public").default(true),
  status: text("status").default("active"), // active, inactive, completed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Study group members - 스터디 그룹 멤버
export const studyGroupMembers = pgTable("study_group_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => studyGroups.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member"), // owner, mentor, member
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  status: text("status").default("active"), // active, inactive, left
});

// Mentor-mentee relationships - 멘토-멘티 관계
export const mentorMentee = pgTable("mentor_mentee", {
  id: uuid("id").primaryKey().defaultRandom(),
  mentorId: text("mentor_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  menteeId: text("mentee_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status").default("active"), // active, pending, completed, cancelled
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  focusAreas: text("focus_areas").array(),
  meetingFrequency: text("meeting_frequency"), // weekly, biweekly, monthly
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Mentoring sessions - 멘토링 세션
export const mentoringSessions = pgTable("mentoring_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  relationshipId: uuid("relationship_id")
    .notNull()
    .references(() => mentorMentee.id, { onDelete: "cascade" }),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration"), // 분
  topics: text("topics").array(),
  mentorNotes: text("mentor_notes"),
  menteeNotes: text("mentee_notes"),
  actionItems: text("action_items").array(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ====== Phase 6: Psychological Support ======

// Milestones - 학습 마일스톤
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // study_streak, topics_completed, exam_score, total_hours
  title: text("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value"),
  currentValue: integer("current_value").default(0),
  achieved: boolean("achieved").default(false),
  achievedAt: timestamp("achieved_at"),
  icon: text("icon"), // 아이콘 이름
  reward: text("reward"), // 달성 시 보상 메시지
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Encouragement messages - 격려 메시지 로그
export const encouragementMessages = pgTable("encouragement_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  type: text("type").notNull(), // motivation, celebration, support, reminder
  context: text("context"), // 메시지 생성 컨텍스트
  shownAt: timestamp("shown_at").notNull().defaultNow(),
  userReaction: text("user_reaction"), // helpful, not_helpful, ignored
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Slump detection - 슬럼프 감지
export const slumpDetection = pgTable("slump_detection", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
  severity: text("severity"), // mild, moderate, severe
  indicators: jsonb("indicators"), // 슬럼프 지표들
  suggestedActions: text("suggested_actions").array(),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
