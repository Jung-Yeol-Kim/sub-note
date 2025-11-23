/**
 * Block-based Answer Sheet Types
 * 정보관리기술사 답안지 블록 기반 구조
 */

export type BlockType = 'text' | 'table';

/**
 * Base block interface
 */
export interface BaseBlock {
  id: string;
  type: BlockType;
  lineStart: number; // 시작 줄 (1-22)
  lineEnd: number;   // 종료 줄 (lineStart 포함)
}

/**
 * Text block - 일반 텍스트
 */
export interface TextBlock extends BaseBlock {
  type: 'text';
  lines: string[]; // 각 줄의 텍스트 내용
}

/**
 * Table block - 표
 */
export interface TableBlock extends BaseBlock {
  type: 'table';
  headers: string[]; // 헤더 행
  rows: string[][]; // 데이터 행들
  columnWidths: number[]; // 각 열이 차지하는 칸 수 (합계 <= 19)
}

/**
 * Union type for all blocks
 */
export type AnswerSheetBlock = TextBlock | TableBlock;

/**
 * Answer sheet document structure
 */
export interface AnswerSheetDocument {
  blocks: AnswerSheetBlock[];
  totalLines: number; // 1-22
  metadata: {
    isValid: boolean;
    validationErrors: string[];
    validationWarnings: string[];
  };
}

/**
 * Validation result
 */
export interface BlockValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Constants
 */
export const BLOCK_CONSTANTS = {
  MAX_LINES: 22,
  MAX_CELLS_PER_LINE: 19,
  MIN_COLUMN_WIDTH: 1,
} as const;

/**
 * Helper: Create new text block
 */
export function createTextBlock(
  lines: string[],
  lineStart: number,
  id?: string
): TextBlock {
  return {
    id: id || `text-${Date.now()}-${Math.random()}`,
    type: 'text',
    lines,
    lineStart,
    lineEnd: lineStart + lines.length - 1,
  };
}

/**
 * Helper: Create new table block
 */
export function createTableBlock(
  headers: string[],
  rows: string[][],
  columnWidths: number[],
  lineStart: number,
  id?: string
): TableBlock {
  return {
    id: id || `table-${Date.now()}-${Math.random()}`,
    type: 'table',
    headers,
    rows,
    columnWidths,
    lineStart,
    lineEnd: lineStart + rows.length, // header + rows
  };
}

/**
 * Helper: Validate block
 */
export function validateBlock(block: AnswerSheetBlock): BlockValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check line range
  if (block.lineStart < 1) {
    errors.push(`Block starts before line 1: ${block.lineStart}`);
  }
  if (block.lineEnd > BLOCK_CONSTANTS.MAX_LINES) {
    errors.push(
      `Block ends after line ${BLOCK_CONSTANTS.MAX_LINES}: ${block.lineEnd}`
    );
  }
  if (block.lineStart > block.lineEnd) {
    errors.push('Block start line is after end line');
  }

  // Type-specific validation
  if (block.type === 'table') {
    const totalWidth = block.columnWidths.reduce((sum, w) => sum + w, 0);
    if (totalWidth > BLOCK_CONSTANTS.MAX_CELLS_PER_LINE) {
      errors.push(
        `Table width (${totalWidth}) exceeds ${BLOCK_CONSTANTS.MAX_CELLS_PER_LINE} cells`
      );
    }

    if (block.columnWidths.some((w) => w < BLOCK_CONSTANTS.MIN_COLUMN_WIDTH)) {
      errors.push('Column width must be at least 1');
    }

    if (block.columnWidths.length !== block.headers.length) {
      errors.push('Column widths count must match headers count');
    }

    if (
      block.rows.some((row) => row.length !== block.headers.length)
    ) {
      errors.push('All rows must have same number of columns as headers');
    }

    // Warning for narrow total width
    if (totalWidth < BLOCK_CONSTANTS.MAX_CELLS_PER_LINE / 2) {
      warnings.push(
        `Table only uses ${totalWidth} out of ${BLOCK_CONSTANTS.MAX_CELLS_PER_LINE} available cells`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Helper: Validate entire document
 */
export function validateDocument(
  doc: AnswerSheetDocument
): BlockValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate total lines
  if (doc.totalLines > BLOCK_CONSTANTS.MAX_LINES) {
    errors.push(
      `Document exceeds ${BLOCK_CONSTANTS.MAX_LINES} lines: ${doc.totalLines}`
    );
  }

  // Check for overlapping blocks
  const occupiedLines = new Set<number>();
  for (const block of doc.blocks) {
    for (let line = block.lineStart; line <= block.lineEnd; line++) {
      if (occupiedLines.has(line)) {
        errors.push(`Line ${line} is used by multiple blocks`);
      }
      occupiedLines.add(line);
    }
  }

  // Validate each block
  for (const block of doc.blocks) {
    const blockValidation = validateBlock(block);
    errors.push(...blockValidation.errors);
    warnings.push(...blockValidation.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
