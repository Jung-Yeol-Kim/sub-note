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
  writingChallenges: many(writingChallenges),
  writingAnalytics: many(writingAnalytics),
  writingStreaks: many(writingStreaks),
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

// === Phase 4: Writing Practice Mode ===

// Writing challenges - Daily writing practice tracking
export const writingChallenges = pgTable("writing_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  subNoteId: uuid("sub_note_id").references(() => subNotes.id),
  examTopicId: uuid("exam_topic_id").references(() => examTopics.id),

  // Challenge details
  challengeDate: timestamp("challenge_date").notNull(), // Date of challenge
  topic: text("topic").notNull(), // Topic name
  content: text("content"), // User's written answer
  wordCount: integer("word_count").default(0),
  timeSpent: integer("time_spent"), // in seconds

  // Challenge type
  challengeType: text("challenge_type").notNull().default("daily"), // daily, random, timed
  difficulty: integer("difficulty"), // 1-5

  // Completion status
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),

  // AI evaluation reference
  evaluationId: uuid("evaluation_id").references(() => aiEvaluations.id),
  quickScore: integer("quick_score"), // Quick self-assessment 1-5

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Writing analytics - Pattern analysis and insights
export const writingAnalytics = pgTable("writing_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Analysis period
  analysisDate: timestamp("analysis_date").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),

  // Writing patterns
  totalChallenges: integer("total_challenges").default(0),
  completedChallenges: integer("completed_challenges").default(0),
  averageWordCount: integer("average_word_count").default(0),
  averageTimeSpent: integer("average_time_spent").default(0), // in seconds

  // Quality metrics
  averageScore: integer("average_score").default(0), // 0-100
  improvementRate: integer("improvement_rate").default(0), // percentage
  consistencyScore: integer("consistency_score").default(0), // 0-100

  // Common patterns
  strengths: text("strengths").array(),
  weaknesses: text("weaknesses").array(),
  frequentMistakes: text("frequent_mistakes").array(),
  improvedAreas: text("improved_areas").array(),

  // Category performance
  categoryScores: jsonb("category_scores"), // { "네트워크": 85, "보안": 78, ... }

  // Writing style metrics
  averageSentenceLength: integer("average_sentence_length"),
  vocabularyRichness: integer("vocabulary_richness"), // 0-100
  structuralConsistency: integer("structural_consistency"), // 0-100
  keywordUsageRate: integer("keyword_usage_rate"), // 0-100

  // Recommendations
  recommendations: text("recommendations").array(),
  focusAreas: text("focus_areas").array(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Writing streaks - Gamification and motivation
export const writingStreaks = pgTable("writing_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Current streak
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),

  // Milestones
  totalDaysActive: integer("total_days_active").notNull().default(0),
  totalChallengesCompleted: integer("total_challenges_completed").notNull().default(0),

  // Achievements
  achievements: text("achievements").array(), // ["7_day_streak", "30_day_streak", "100_challenges"]
  level: integer("level").notNull().default(1),
  experiencePoints: integer("experience_points").notNull().default(0),

  // Weekly goals
  weeklyGoal: integer("weekly_goal").default(5), // challenges per week
  weeklyProgress: integer("weekly_progress").default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Relations for writing practice tables
export const writingChallengesRelations = relations(writingChallenges, ({ one }) => ({
  user: one(user, {
    fields: [writingChallenges.userId],
    references: [user.id],
  }),
  subNote: one(subNotes, {
    fields: [writingChallenges.subNoteId],
    references: [subNotes.id],
  }),
  examTopic: one(examTopics, {
    fields: [writingChallenges.examTopicId],
    references: [examTopics.id],
  }),
  evaluation: one(aiEvaluations, {
    fields: [writingChallenges.evaluationId],
    references: [aiEvaluations.id],
  }),
}));

export const writingAnalyticsRelations = relations(writingAnalytics, ({ one }) => ({
  user: one(user, {
    fields: [writingAnalytics.userId],
    references: [user.id],
  }),
}));

export const writingStreaksRelations = relations(writingStreaks, ({ one }) => ({
  user: one(user, {
    fields: [writingStreaks.userId],
    references: [user.id],
  }),
}));
