/**
 * Answer Sheet Plain Text Parser
 * Plain text를 구조화된 블록으로 변환
 */

import {
  type AnswerSheetDocument,
  type AnswerSheetBlock,
  type TextBlock,
  type TableBlock,
  createTextBlock,
  createTableBlock,
  validateDocument,
  BLOCK_CONSTANTS,
} from '../types/answer-sheet-block';

/**
 * Parse plain text to structured blocks
 */
export function parseToBlocks(plainText: string): AnswerSheetDocument {
  const lines = plainText.split('\n');
  const blocks: AnswerSheetBlock[] = [];
  let currentLineNumber = 1;
  let i = 0;

  while (i < lines.length && currentLineNumber <= BLOCK_CONSTANTS.MAX_LINES) {
    const line = lines[i];

    // Check if this is a table start
    if (isTableLine(line)) {
      const tableResult = parseTableBlock(lines, i, currentLineNumber);
      if (tableResult) {
        blocks.push(tableResult.block);
        i = tableResult.nextIndex;
        currentLineNumber = tableResult.block.lineEnd + 1;
        continue;
      }
    }

    // Otherwise, collect text lines until next table or end
    const textLines: string[] = [];
    const textStartLine = currentLineNumber;

    while (
      i < lines.length &&
      !isTableLine(lines[i]) &&
      currentLineNumber <= BLOCK_CONSTANTS.MAX_LINES
    ) {
      textLines.push(lines[i]);
      i++;
      currentLineNumber++;
    }

    if (textLines.length > 0) {
      blocks.push(createTextBlock(textLines, textStartLine));
    }
  }

  const totalLines = blocks.length > 0
    ? Math.max(...blocks.map((b) => b.lineEnd))
    : 0;

  const doc: AnswerSheetDocument = {
    blocks,
    totalLines,
    metadata: {
      isValid: false,
      validationErrors: [],
      validationWarnings: [],
    },
  };

  // Validate document
  const validation = validateDocument(doc);
  doc.metadata = {
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };

  return doc;
}

/**
 * Check if a line is part of a table
 */
function isTableLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|');
}

/**
 * Parse a table block starting from the given index
 */
function parseTableBlock(
  lines: string[],
  startIndex: number,
  lineStart: number
): { block: TableBlock; nextIndex: number } | null {
  // Collect all consecutive table lines
  const tableLines: string[] = [];
  let i = startIndex;

  while (i < lines.length && isTableLine(lines[i])) {
    tableLines.push(lines[i]);
    i++;
  }

  if (tableLines.length < 2) {
    // Need at least header + separator or header + data
    return null;
  }

  // Parse header (first line)
  const headerCells = parseTableRow(tableLines[0]);

  // Check if second line is a separator (|---|---|)
  let dataStartIndex = 1;
  if (isTableSeparator(tableLines[1])) {
    dataStartIndex = 2;
  }

  // Parse data rows
  const rows: string[][] = [];
  for (let j = dataStartIndex; j < tableLines.length; j++) {
    const row = parseTableRow(tableLines[j]);
    if (row.length === headerCells.length) {
      rows.push(row);
    }
  }

  // Calculate column widths (equal distribution)
  const columnCount = headerCells.length;
  const totalAvailableWidth = BLOCK_CONSTANTS.MAX_CELLS_PER_LINE;
  const baseWidth = Math.floor(totalAvailableWidth / columnCount);
  const remainder = totalAvailableWidth % columnCount;

  const columnWidths = headerCells.map((_, index) =>
    index < remainder ? baseWidth + 1 : baseWidth
  );

  const block = createTableBlock(
    headerCells,
    rows,
    columnWidths,
    lineStart
  );

  return {
    block,
    nextIndex: i,
  };
}

/**
 * Parse a single table row
 */
function parseTableRow(line: string): string[] {
  const trimmed = line.trim();
  // Remove leading and trailing |
  const content = trimmed.substring(1, trimmed.length - 1);
  // Split by | and trim each cell
  return content.split('|').map((cell) => cell.trim());
}

/**
 * Check if a line is a table separator (|---|---|)
 */
function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return false;
  }

  const content = trimmed.substring(1, trimmed.length - 1);
  const cells = content.split('|');

  // Each cell should be only dashes and optional colons
  return cells.every((cell) => /^:?-+:?$/.test(cell.trim()));
}

/**
 * Convert blocks back to plain text
 */
export function blocksToPlainText(doc: AnswerSheetDocument): string {
  const result: string[] = [];

  for (const block of doc.blocks) {
    if (block.type === 'text') {
      result.push(...block.lines);
    } else if (block.type === 'table') {
      // Header
      result.push(
        '| ' + block.headers.join(' | ') + ' |'
      );

      // Separator
      result.push(
        '| ' + block.headers.map(() => '---').join(' | ') + ' |'
      );

      // Rows
      for (const row of block.rows) {
        result.push('| ' + row.join(' | ') + ' |');
      }
    }
  }

  return result.join('\n');
}

/**
 * Get conversion preview with metadata
 */
export interface ConversionPreview {
  original: string;
  parsed: AnswerSheetDocument;
  plainTextRepresentation: string;
  warnings: string[];
  statistics: {
    totalBlocks: number;
    textBlocks: number;
    tableBlocks: number;
    totalLines: number;
  };
}

export function getConversionPreview(plainText: string): ConversionPreview {
  const parsed = parseToBlocks(plainText);
  const plainTextRep = blocksToPlainText(parsed);

  const statistics = {
    totalBlocks: parsed.blocks.length,
    textBlocks: parsed.blocks.filter((b) => b.type === 'text').length,
    tableBlocks: parsed.blocks.filter((b) => b.type === 'table').length,
    totalLines: parsed.totalLines,
  };

  return {
    original: plainText,
    parsed,
    plainTextRepresentation: plainTextRep,
    warnings: parsed.metadata.validationWarnings,
    statistics,
  };
}
