/**
 * Simplified Answer Sheet Schema for generateObject
 * 복잡한 refinement 제거, 기본 검증만 수행
 */

import { z } from "zod";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";

/**
 * Simplified Text Block Schema (no refinement)
 */
const SimpleTextBlockSchema = z.object({
  id: z.string(),
  type: z.literal("text"),
  lineStart: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  lineEnd: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  lines: z.array(z.string()).min(1),
});

/**
 * Simplified Table Block Schema (minimal validation)
 */
const SimpleTableBlockSchema = z.object({
  id: z.string(),
  type: z.literal("table"),
  lineStart: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  lineEnd: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  headers: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())).min(1),
  columnWidths: z.array(z.number().int().min(1)).min(1),
});

/**
 * Simplified Drawing Block Schema
 */
const SimpleDrawingBlockSchema = z.object({
  id: z.string(),
  type: z.literal("drawing"),
  lineStart: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  lineEnd: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  excalidrawData: z.object({
    elements: z.array(z.any()),
    appState: z.any().optional(),
    files: z.any().optional(),
  }),
  thumbnail: z.string().optional(),
});

/**
 * Simplified Answer Sheet Document Schema
 * - No discriminated union (uses array of objects)
 * - No complex refinements
 * - Optional fields are truly optional
 */
export const SimpleAnswerSheetDocumentSchema = z.object({
  blocks: z.array(
    z.union([
      SimpleTextBlockSchema,
      SimpleTableBlockSchema,
      SimpleDrawingBlockSchema,
    ])
  ),
  leftMargin: z.array(
    z.object({
      line: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
      column: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      content: z.string(),
    })
  ).optional(),
  totalLines: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  metadata: z.object({
    isValid: z.boolean(),
    validationErrors: z.array(z.string()),
    validationWarnings: z.array(z.string()),
  }),
});

export type SimpleAnswerSheetDocument = z.infer<typeof SimpleAnswerSheetDocumentSchema>;
