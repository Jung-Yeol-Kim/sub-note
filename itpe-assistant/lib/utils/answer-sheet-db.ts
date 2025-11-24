/**
 * Helper functions for converting between AnswerSheetDocument and database format
 */

import {
  type AnswerSheetDocument,
  validateDocument,
} from "@/lib/types/answer-sheet-block";

/**
 * Convert AnswerSheetDocument to database JSON format
 */
export function serializeAnswerSheet(
  document: AnswerSheetDocument
): Record<string, unknown> {
  return {
    blocks: document.blocks,
    totalLines: document.totalLines,
    metadata: document.metadata,
  };
}

/**
 * Convert database JSON format to AnswerSheetDocument
 */
export function deserializeAnswerSheet(
  data: unknown
): AnswerSheetDocument | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const obj = data as Record<string, unknown>;

  if (!obj.blocks || !Array.isArray(obj.blocks)) {
    return null;
  }

  const document: AnswerSheetDocument = {
    blocks: obj.blocks as AnswerSheetDocument["blocks"],
    totalLines: (obj.totalLines as number) || 0,
    metadata: (obj.metadata as AnswerSheetDocument["metadata"]) || {
      isValid: true,
      validationErrors: [],
      validationWarnings: [],
    },
  };

  return document;
}

/**
 * Create empty answer sheet document
 */
export function createEmptyAnswerSheet(): AnswerSheetDocument {
  return {
    blocks: [],
    totalLines: 0,
    metadata: {
      isValid: true,
      validationErrors: [],
      validationWarnings: [],
    },
  };
}

/**
 * Validate and prepare document for storage
 */
export function prepareForStorage(document: AnswerSheetDocument): {
  document: AnswerSheetDocument;
  lineCount: number;
  cellCount: number;
  isValidFormat: boolean;
  formatWarnings: string[];
} {
  const validation = validateDocument(document);

  const updatedDoc: AnswerSheetDocument = {
    ...document,
    metadata: {
      isValid: validation.isValid,
      validationErrors: validation.errors,
      validationWarnings: validation.warnings,
    },
  };

  // Calculate cell count (approximate)
  let totalCells = 0;
  for (const block of document.blocks) {
    if (block.type === "text") {
      totalCells += block.lines.reduce(
        (sum, line) => sum + Math.ceil(line.length / 2),
        0
      );
    } else if (block.type === "table") {
      const cellsPerRow = block.columnWidths.reduce((a, b) => a + b, 0);
      totalCells += cellsPerRow * (1 + block.rows.length); // header + rows
    }
  }

  return {
    document: updatedDoc,
    lineCount: updatedDoc.totalLines,
    cellCount: totalCells,
    isValidFormat: validation.isValid,
    formatWarnings: validation.warnings,
  };
}
