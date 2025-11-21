import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// User's personal sub-notes
export const subNotes = pgTable("sub_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Will integrate with auth later
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
  userId: text("user_id").notNull(),
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
  userId: text("user_id").notNull(),
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
  userId: text("user_id").notNull(),
  subNoteId: uuid("sub_note_id").references(() => subNotes.id),
  duration: integer("duration"), // in minutes
  activityType: text("activity_type"), // "writing", "reviewing", "practicing"
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const subNotesRelations = relations(subNotes, ({ many }) => ({
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

export const sharedSubNotesRelations = relations(sharedSubNotes, ({ one }) => ({
  originalSubNote: one(subNotes, {
    fields: [sharedSubNotes.originalSubNoteId],
    references: [subNotes.id],
  }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  subNote: one(subNotes, {
    fields: [studySessions.subNoteId],
    references: [subNotes.id],
  }),
}));
