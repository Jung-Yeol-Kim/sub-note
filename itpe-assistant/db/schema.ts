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

// ===== MENTORING SYSTEM TABLES =====

// User settings for mentoring dashboard
export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  examDate: timestamp("exam_date"), // D-Day target
  dailyGoalMinutes: integer("daily_goal_minutes").default(120), // 2 hours default
  weeklyTopicsGoal: integer("weekly_topics_goal").default(5),
  studyStartDate: timestamp("study_start_date").defaultNow(),
  totalTopicsTarget: integer("total_topics_target").default(500),
  preferences: jsonb("preferences"), // Notification settings, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Daily check-ins and progress tracking
export const dailyCheckIns = pgTable("daily_check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  checkInDate: timestamp("check_in_date").notNull().defaultNow(),
  studyMinutes: integer("study_minutes").default(0),
  topicsCompleted: integer("topics_completed").default(0),
  mood: text("mood"), // "great", "good", "okay", "struggling"
  notes: text("notes"),
  achievements: text("achievements").array(), // Daily achievements
  challenges: text("challenges"), // What was difficult today
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Weekly study plans
export const weeklyPlans = pgTable("weekly_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  weekStartDate: timestamp("week_start_date").notNull(),
  weekEndDate: timestamp("week_end_date").notNull(),
  goals: text("goals").array(), // Weekly goals
  plannedTopics: text("planned_topics").array(), // Topic IDs to cover
  status: text("status").default("active"), // active, completed, abandoned
  completionRate: integer("completion_rate").default(0), // 0-100
  review: text("review"), // Weekly retrospective
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Mock exam questions
export const mockExams = pgTable("mock_exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").notNull(), // Array of questions
  timeLimit: integer("time_limit").notNull(), // in minutes
  difficulty: text("difficulty"), // "beginner", "intermediate", "advanced", "actual"
  category: text("category"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(false),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Mock exam attempts
export const mockExamAttempts = pgTable("mock_exam_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  mockExamId: uuid("mock_exam_id")
    .notNull()
    .references(() => mockExams.id, { onDelete: "cascade" }),
  answers: jsonb("answers").notNull(), // User's answers
  timeSpent: integer("time_spent"), // in seconds
  score: integer("score"), // 0-100
  aiEvaluationId: uuid("ai_evaluation_id").references(() => aiEvaluations.id),
  feedback: text("feedback"), // Overall feedback
  detailedResults: jsonb("detailed_results"), // Per-question analysis
  status: text("status").default("in_progress"), // in_progress, completed, abandoned
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Spaced repetition review schedule
export const reviewSchedule = pgTable("review_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subNoteId: uuid("sub_note_id")
    .notNull()
    .references(() => subNotes.id, { onDelete: "cascade" }),
  nextReviewDate: timestamp("next_review_date").notNull(),
  interval: integer("interval").notNull().default(1), // Days until next review
  easeFactor: integer("ease_factor").default(250), // 250 = 2.5 (SM-2 algorithm)
  repetitions: integer("repetitions").default(0),
  lastReviewDate: timestamp("last_review_date"),
  lastReviewQuality: integer("last_review_quality"), // 0-5 scale
  status: text("status").default("scheduled"), // scheduled, reviewed, skipped
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Study streaks and milestones
export const studyStreaks = pgTable("study_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastStudyDate: timestamp("last_study_date"),
  totalStudyDays: integer("total_study_days").default(0),
  milestones: jsonb("milestones"), // Achievement data
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Mentoring system relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}));

export const dailyCheckInsRelations = relations(dailyCheckIns, ({ one }) => ({
  user: one(user, {
    fields: [dailyCheckIns.userId],
    references: [user.id],
  }),
}));

export const weeklyPlansRelations = relations(weeklyPlans, ({ one }) => ({
  user: one(user, {
    fields: [weeklyPlans.userId],
    references: [user.id],
  }),
}));

export const mockExamsRelations = relations(mockExams, ({ one, many }) => ({
  creator: one(user, {
    fields: [mockExams.createdBy],
    references: [user.id],
  }),
  attempts: many(mockExamAttempts),
}));

export const mockExamAttemptsRelations = relations(mockExamAttempts, ({ one }) => ({
  user: one(user, {
    fields: [mockExamAttempts.userId],
    references: [user.id],
  }),
  mockExam: one(mockExams, {
    fields: [mockExamAttempts.mockExamId],
    references: [mockExams.id],
  }),
  aiEvaluation: one(aiEvaluations, {
    fields: [mockExamAttempts.aiEvaluationId],
    references: [aiEvaluations.id],
  }),
}));

export const reviewScheduleRelations = relations(reviewSchedule, ({ one }) => ({
  user: one(user, {
    fields: [reviewSchedule.userId],
    references: [user.id],
  }),
  subNote: one(subNotes, {
    fields: [reviewSchedule.subNoteId],
    references: [subNotes.id],
  }),
}));

export const studyStreaksRelations = relations(studyStreaks, ({ one }) => ({
  user: one(user, {
    fields: [studyStreaks.userId],
    references: [user.id],
  }),
}));
