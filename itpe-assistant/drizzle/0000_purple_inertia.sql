CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_note_id" uuid,
	"user_id" text NOT NULL,
	"model" text NOT NULL,
	"overall_score" integer,
	"completeness_score" integer,
	"accuracy_score" integer,
	"structure_score" integer,
	"clarity_score" integer,
	"keyword_score" integer,
	"technical_depth_score" integer,
	"strengths" text[],
	"weaknesses" text[],
	"missing_keywords" text[],
	"suggestions" text[],
	"detailed_feedback" text,
	"evaluation_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_topic_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"rationale" text,
	"category" text,
	"tags" text[],
	"difficulty" integer,
	"priority" integer DEFAULT 0,
	"trend_score" integer,
	"exam_probability" integer,
	"related_exam_topics" text[],
	"source_data" jsonb,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shared_sub_note_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comment_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shared_sub_note_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"user_image" text,
	"content" text NOT NULL,
	"parent_comment_id" uuid,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_check_ins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"study_minutes" integer DEFAULT 0,
	"topics_studied" text[] DEFAULT '{}',
	"mood" text,
	"energy_level" integer,
	"notes" text,
	"challenges" text[],
	"achievements" text[],
	"tomorrow_plan" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encouragement_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"context" text,
	"shown_at" timestamp DEFAULT now() NOT NULL,
	"user_reaction" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_round" integer,
	"question_number" integer,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"tags" text[],
	"difficulty" integer,
	"year" integer,
	"season" text,
	"frequency" integer DEFAULT 0,
	"related_topics" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "learning_streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_check_in_date" timestamp,
	"total_check_ins" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentor_mentee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" text NOT NULL,
	"mentee_id" text NOT NULL,
	"status" text DEFAULT 'active',
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"focus_areas" text[],
	"meeting_frequency" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentoring_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"relationship_id" uuid NOT NULL,
	"session_date" timestamp NOT NULL,
	"duration" integer,
	"topics" text[],
	"mentor_notes" text,
	"mentee_notes" text,
	"action_items" text[],
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_value" integer,
	"current_value" integer DEFAULT 0,
	"achieved" boolean DEFAULT false,
	"achieved_at" timestamp,
	"icon" text,
	"reward" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"topic_id" uuid,
	"question_text" text NOT NULL,
	"answer_content" text,
	"time_spent" integer,
	"ai_score" integer,
	"ai_feedback" jsonb,
	"strengths" text[],
	"weaknesses" text[],
	"suggestions" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mock_exam_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"exam_type" text NOT NULL,
	"selected_topics" text[],
	"questions_count" integer NOT NULL,
	"time_limit" integer,
	"status" text DEFAULT 'not_started',
	"started_at" timestamp,
	"completed_at" timestamp,
	"total_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"sub_note_id" uuid NOT NULL,
	"repetition_number" integer DEFAULT 0,
	"ease_factor" integer DEFAULT 250,
	"interval" integer DEFAULT 1,
	"next_review_date" timestamp NOT NULL,
	"last_reviewed_at" timestamp,
	"review_quality" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "shared_sub_note_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shared_sub_note_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_sub_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_sub_note_id" uuid,
	"user_id" text NOT NULL,
	"user_name" text,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text,
	"tags" text[],
	"difficulty" integer,
	"is_public" boolean DEFAULT true NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slump_detection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"severity" text,
	"indicators" jsonb,
	"suggested_actions" text[],
	"resolved" boolean DEFAULT false,
	"resolved_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"exam_date" timestamp,
	"target_score" integer,
	"daily_study_minutes" integer DEFAULT 120,
	"weekly_topics_goal" integer DEFAULT 5,
	"motivation" text,
	"current_level" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_group_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member',
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "study_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"member_count" integer DEFAULT 1,
	"max_members" integer DEFAULT 10,
	"target_exam_date" timestamp,
	"meeting_schedule" text,
	"focus_areas" text[],
	"difficulty" text,
	"is_public" boolean DEFAULT true,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"sub_note_id" uuid,
	"duration" integer,
	"activity_type" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text,
	"tags" text[],
	"status" text DEFAULT 'draft' NOT NULL,
	"difficulty" integer,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"year" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"goal_topics" text[],
	"goal_study_minutes" integer DEFAULT 840,
	"actual_study_minutes" integer DEFAULT 0,
	"completed_topics" text[] DEFAULT '{}',
	"status" text DEFAULT 'active',
	"reflection" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "writing_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"topic_id" uuid,
	"topic_title" text NOT NULL,
	"answer" text,
	"time_spent" integer,
	"word_count" integer,
	"completed" boolean DEFAULT false,
	"quality" integer,
	"feedback" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "writing_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"analyzed_at" timestamp DEFAULT now() NOT NULL,
	"total_writing_sessions" integer,
	"average_word_count" integer,
	"average_time_spent" integer,
	"common_strengths" text[],
	"common_weaknesses" text[],
	"improvement_areas" text[],
	"writing_style" text,
	"consistency_score" integer,
	"pattern_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_sub_note_id_sub_notes_id_fk" FOREIGN KEY ("sub_note_id") REFERENCES "public"."sub_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_shared_sub_note_id_shared_sub_notes_id_fk" FOREIGN KEY ("shared_sub_note_id") REFERENCES "public"."shared_sub_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_shared_sub_note_id_shared_sub_notes_id_fk" FOREIGN KEY ("shared_sub_note_id") REFERENCES "public"."shared_sub_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encouragement_messages" ADD CONSTRAINT "encouragement_messages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learning_streaks" ADD CONSTRAINT "learning_streaks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_mentee" ADD CONSTRAINT "mentor_mentee_mentor_id_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_mentee" ADD CONSTRAINT "mentor_mentee_mentee_id_user_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentoring_sessions" ADD CONSTRAINT "mentoring_sessions_relationship_id_mentor_mentee_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."mentor_mentee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_exam_answers" ADD CONSTRAINT "mock_exam_answers_session_id_mock_exam_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."mock_exam_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_exam_answers" ADD CONSTRAINT "mock_exam_answers_topic_id_exam_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."exam_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_exam_sessions" ADD CONSTRAINT "mock_exam_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_schedule" ADD CONSTRAINT "review_schedule_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_schedule" ADD CONSTRAINT "review_schedule_sub_note_id_sub_notes_id_fk" FOREIGN KEY ("sub_note_id") REFERENCES "public"."sub_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_sub_note_likes" ADD CONSTRAINT "shared_sub_note_likes_shared_sub_note_id_shared_sub_notes_id_fk" FOREIGN KEY ("shared_sub_note_id") REFERENCES "public"."shared_sub_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_sub_note_likes" ADD CONSTRAINT "shared_sub_note_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_sub_notes" ADD CONSTRAINT "shared_sub_notes_original_sub_note_id_sub_notes_id_fk" FOREIGN KEY ("original_sub_note_id") REFERENCES "public"."sub_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_sub_notes" ADD CONSTRAINT "shared_sub_notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slump_detection" ADD CONSTRAINT "slump_detection_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_goals" ADD CONSTRAINT "study_goals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_group_id_study_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."study_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_sub_note_id_sub_notes_id_fk" FOREIGN KEY ("sub_note_id") REFERENCES "public"."sub_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_notes" ADD CONSTRAINT "sub_notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_plans" ADD CONSTRAINT "weekly_plans_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_challenges" ADD CONSTRAINT "writing_challenges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_challenges" ADD CONSTRAINT "writing_challenges_topic_id_exam_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."exam_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_patterns" ADD CONSTRAINT "writing_patterns_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;