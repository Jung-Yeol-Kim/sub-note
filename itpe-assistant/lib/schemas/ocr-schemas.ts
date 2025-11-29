/**
 * Zod Schemas for OCR and Answer Sheet Validation
 * OCR 및 답안지 검증을 위한 Zod 스키마
 */

import { z } from "zod";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";

// ====== Upstage OCR API Response Schemas ======

/**
 * Upstage OCR Word Schema
 */
export const UpstageOCRWordSchema = z.object({
  boundingBox: z.object({
    vertices: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
      })
    ),
  }),
  confidence: z.number(),
  id: z.number(),
  text: z.string(),
});

/**
 * Upstage OCR Page Schema
 */
export const UpstageOCRPageSchema = z.object({
  confidence: z.number(),
  height: z.number(),
  id: z.number(),
  text: z.string(),
  width: z.number(),
  words: z.array(UpstageOCRWordSchema),
});

/**
 * Upstage OCR Metadata Schema
 */
export const UpstageOCRMetadataSchema = z.object({
  pages: z.array(
    z.object({
      height: z.number(),
      page: z.number(),
      width: z.number(),
    })
  ),
});

/**
 * Upstage OCR Response Schema
 */
export const UpstageOCRResponseSchema = z.object({
  apiVersion: z.string(),
  confidence: z.number(),
  metadata: UpstageOCRMetadataSchema,
  mimeType: z.string(),
  modelVersion: z.string(),
  numBilledPages: z.number(),
  pages: z.array(UpstageOCRPageSchema),
  stored: z.boolean(),
  text: z.string(),
});

export type UpstageOCRResponse = z.infer<typeof UpstageOCRResponseSchema>;

// ====== Answer Sheet Block Schemas ======

/**
 * Base Block Schema
 */
const BaseBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "table", "drawing"]),
  lineStart: z
    .number()
    .int()
    .min(1)
    .max(BLOCK_CONSTANTS.MAX_LINES),
  lineEnd: z
    .number()
    .int()
    .min(1)
    .max(BLOCK_CONSTANTS.MAX_LINES),
});

/**
 * Text Block Schema
 */
export const TextBlockSchema = BaseBlockSchema.extend({
  type: z.literal("text"),
  lines: z.array(z.string()).min(1).describe("Array of text lines in this block"),
}).refine(
  (data) => data.lineEnd === data.lineStart + data.lines.length - 1,
  {
    message: "lineEnd must equal lineStart + lines.length - 1",
  }
).describe("A text block containing consecutive lines of plain text");

/**
 * Table Block Schema
 */
export const TableBlockSchema = BaseBlockSchema.extend({
  type: z.literal("table"),
  headers: z.array(z.string()).min(1).describe("Table header column names (e.g., '구분', '항목', '설명')"),
  rows: z.array(z.array(z.string())).min(1).describe("Table data rows, each row must have same length as headers"),
  columnWidths: z.array(z.number().int().min(1)).min(1).describe("Column widths in cells, must sum to 19 or less"),
}).refine(
  (data) => {
    // Validate columnWidths sum
    const sum = data.columnWidths.reduce((a, b) => a + b, 0);
    return sum <= BLOCK_CONSTANTS.MAX_CELLS_PER_LINE;
  },
  {
    message: `Column widths sum must not exceed ${BLOCK_CONSTANTS.MAX_CELLS_PER_LINE}`,
  }
).refine(
  (data) => data.columnWidths.length === data.headers.length,
  {
    message: "columnWidths length must match headers length",
  }
).refine(
  (data) => data.rows.every((row) => row.length === data.headers.length),
  {
    message: "All rows must have same length as headers",
  }
).describe("A table block with headers and rows, typically 3 columns");

/**
 * Excalidraw Data Schema (simplified)
 * Full validation of Excalidraw data is complex, so we use a passthrough
 */
export const ExcalidrawDataSchema = z.object({
  elements: z.array(z.any()), // ExcalidrawElement types are complex
  appState: z.any().optional(),
  files: z.any().optional(),
});

/**
 * Drawing Block Schema
 */
export const DrawingBlockSchema = BaseBlockSchema.extend({
  type: z.literal("drawing"),
  excalidrawData: ExcalidrawDataSchema.describe("Excalidraw diagram data - use empty elements array for placeholder"),
  thumbnail: z.string().optional().describe("Base64 encoded thumbnail image (optional)"),
}).describe("A drawing block for diagrams, flowcharts, and visual elements detected in the image");

/**
 * Answer Sheet Block Schema (Discriminated Union)
 */
export const AnswerSheetBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  TableBlockSchema,
  DrawingBlockSchema,
]);

export type AnswerSheetBlock = z.infer<typeof AnswerSheetBlockSchema>;

/**
 * Left Margin Item Schema
 */
export const LeftMarginItemSchema = z.object({
  line: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES),
  column: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  content: z.string(),
});

/**
 * Answer Sheet Document Schema
 */
export const AnswerSheetDocumentSchema = z.object({
  blocks: z.array(AnswerSheetBlockSchema).describe("Array of blocks (text, table, or drawing) that make up the answer sheet"),
  leftMargin: z.array(LeftMarginItemSchema).optional().describe("Optional left margin table of contents (if present in the answer sheet)"),
  totalLines: z.number().int().min(1).max(BLOCK_CONSTANTS.MAX_LINES).describe("Total number of lines used across all blocks"),
  metadata: z.object({
    isValid: z.boolean().describe("Whether the document passes all validation checks"),
    validationErrors: z.array(z.string()).describe("Critical validation errors (can be empty array)"),
    validationWarnings: z.array(z.string()).describe("Non-critical validation warnings (can be empty array)"),
  }).describe("Document validation metadata"),
}).describe("Complete structured answer sheet document");

export type AnswerSheetDocument = z.infer<typeof AnswerSheetDocumentSchema>;

// ====== OCR-to-Blocks API Response Schema ======

/**
 * API Response Schema for OCR-to-Blocks endpoint
 */
export const OcrToBlocksResponseSchema = z.object({
  success: z.boolean(),
  document: AnswerSheetDocumentSchema.optional(),
  imageUrls: z.array(z.string().url()),
  ocrText: z.string(),
  error: z.string().optional(),
  warnings: z.array(z.string()).optional(),
});

export type OcrToBlocksResponse = z.infer<typeof OcrToBlocksResponseSchema>;

// ====== Validation Helpers ======

/**
 * Validate blocks don't overlap
 */
export function validateBlocksNoOverlap(
  blocks: AnswerSheetBlock[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lineUsage = new Map<number, string>(); // line -> blockId

  for (const block of blocks) {
    for (let line = block.lineStart; line <= block.lineEnd; line++) {
      const existingBlockId = lineUsage.get(line);
      if (existingBlockId && existingBlockId !== block.id) {
        errors.push(
          `Line ${line} is used by both block ${existingBlockId} and ${block.id}`
        );
      }
      lineUsage.set(line, block.id);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate total lines don't exceed maximum
 */
export function validateTotalLines(
  totalLines: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (totalLines > BLOCK_CONSTANTS.MAX_LINES) {
    errors.push(
      `Total lines (${totalLines}) exceeds maximum (${BLOCK_CONSTANTS.MAX_LINES})`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create a fallback AnswerSheetDocument from OCR text
 * Used when LLM structuring fails
 */
export function createFallbackDocument(
  ocrText: string
): AnswerSheetDocument {
  const lines = ocrText.split("\n").filter((line) => line.trim().length > 0);
  const truncatedLines = lines.slice(0, BLOCK_CONSTANTS.MAX_LINES);

  const block: AnswerSheetBlock = {
    id: `fallback-text-${Date.now()}`,
    type: "text",
    lines: truncatedLines,
    lineStart: 1,
    lineEnd: truncatedLines.length,
  };

  return {
    blocks: [block],
    totalLines: truncatedLines.length,
    metadata: {
      isValid: true,
      validationErrors: [],
      validationWarnings: [
        "구조화 실패. OCR 텍스트를 단일 텍스트 블록으로 변환했습니다.",
        "표와 그림 영역을 수동으로 추가해주세요.",
      ],
    },
  };
}
