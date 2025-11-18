import { pgTable, uuid, text, timestamp, integer, jsonb, pgEnum, real, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const questionTypeEnum = pgEnum('question_type', ['정의형', '설명형', '비교형', '절차형', '분석형'])
export const levelEnum = pgEnum('level', ['basic', 'advanced'])
export const criteriaEnum = pgEnum('criteria', ['첫인상', '출제반영성', '논리성', '응용능력', '특화', '견해'])
export const difficultyEnum = pgEnum('difficulty', ['basic', 'intermediate', 'advanced'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Answers table
export const answers = pgTable('answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  topic: text('topic').notNull(),
  questionType: questionTypeEnum('question_type').notNull(),
  level: levelEnum('level').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('answers_user_id_idx').on(table.userId),
  topicIdx: index('answers_topic_idx').on(table.topic),
  createdAtIdx: index('answers_created_at_idx').on(table.createdAt),
}))

// Evaluations table
export const evaluations = pgTable('evaluations', {
  id: uuid('id').defaultRandom().primaryKey(),
  answerId: uuid('answer_id').references(() => answers.id, { onDelete: 'cascade' }).notNull(),
  criteria: criteriaEnum('criteria').notNull(),
  score: integer('score').notNull(),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  answerIdIdx: index('evaluations_answer_id_idx').on(table.answerId),
}))

// Keywords table
export const keywords = pgTable('keywords', {
  id: uuid('id').defaultRandom().primaryKey(),
  domain: text('domain').notNull(),
  keyword: text('keyword').notNull(),
  definition: text('definition'),
  relatedConcepts: jsonb('related_concepts').$type<string[]>().default([]),
  difficulty: difficultyEnum('difficulty'),
  frequency: integer('frequency').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  domainIdx: index('keywords_domain_idx').on(table.domain),
  domainKeywordUnique: unique('keywords_domain_keyword_unique').on(table.domain, table.keyword),
}))

// Learning progress table
export const learningProgress = pgTable('learning_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  domain: text('domain').notNull(),
  completedTopics: text('completed_topics').array().default([]),
  totalAnswers: integer('total_answers').default(0).notNull(),
  averageScore: real('average_score').default(0).notNull(),
  lastActivity: timestamp('last_activity', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('learning_progress_user_id_idx').on(table.userId),
  userDomainUnique: unique('learning_progress_user_domain_unique').on(table.userId, table.domain),
}))

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  answers: many(answers),
  learningProgress: many(learningProgress),
}))

export const answersRelations = relations(answers, ({ one, many }) => ({
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
  }),
  evaluations: many(evaluations),
}))

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  answer: one(answers, {
    fields: [evaluations.answerId],
    references: [answers.id],
  }),
}))

export const learningProgressRelations = relations(learningProgress, ({ one }) => ({
  user: one(users, {
    fields: [learningProgress.userId],
    references: [users.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Answer = typeof answers.$inferSelect
export type NewAnswer = typeof answers.$inferInsert

export type Evaluation = typeof evaluations.$inferSelect
export type NewEvaluation = typeof evaluations.$inferInsert

export type Keyword = typeof keywords.$inferSelect
export type NewKeyword = typeof keywords.$inferInsert

export type LearningProgress = typeof learningProgress.$inferSelect
export type NewLearningProgress = typeof learningProgress.$inferInsert
