DROP TABLE "mock_exam_answers" CASCADE;--> statement-breakpoint
DROP TABLE "mock_exam_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "review_schedule" CASCADE;--> statement-breakpoint
DROP TABLE "writing_challenges" CASCADE;--> statement-breakpoint
DROP TABLE "writing_patterns" CASCADE;--> statement-breakpoint
ALTER TABLE "sub_notes" ADD COLUMN "structured_answer" jsonb;--> statement-breakpoint
ALTER TABLE "sub_notes" ADD COLUMN "line_count" integer;--> statement-breakpoint
ALTER TABLE "sub_notes" ADD COLUMN "cell_count" integer;--> statement-breakpoint
ALTER TABLE "sub_notes" ADD COLUMN "is_valid_format" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "sub_notes" ADD COLUMN "format_warnings" text[];--> statement-breakpoint
ALTER TABLE "sub_notes" ADD COLUMN "original_images" text[];