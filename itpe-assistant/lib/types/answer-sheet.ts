/**
 * Answer Sheet Format Types
 * 정보관리기술사 답안지 규격: 22줄(행) × 19칸(열)
 *
 * Character Cell Counting Rules:
 * - 한글 1자 = 1칸
 * - 영문/숫자 2자 = 1칸
 * - 특수문자 2자 = 1칸
 */

// Constants
export const ANSWER_SHEET_CONFIG = {
  MAX_LINES: 22,
  MAX_CELLS_PER_LINE: 19,
  // Allowable tolerance (실전에서는 약간의 오차 허용)
  STRICT_VALIDATION: false, // true면 엄격한 검증, false면 허용 범위 있음
  TOLERANCE_LINES: 2, // ±2줄 허용
  TOLERANCE_CELLS: 1, // 칸당 ±1칸 허용
} as const;

/**
 * Character type classification for cell counting
 */
export type CharacterType = 'hangul' | 'english' | 'number' | 'special' | 'space' | 'newline';

/**
 * Cell count calculation result for a single character
 */
export interface CharacterCellInfo {
  char: string;
  type: CharacterType;
  cellCount: number; // 0.5 for english/number, 1 for hangul, 0 for newline
}

/**
 * Single line in answer sheet (one of 22 lines)
 */
export interface AnswerSheetLine {
  lineNumber: number; // 1-22
  content: string;
  cellCount: number; // Calculated cell count
  characterBreakdown: CharacterCellInfo[];
  isValid: boolean; // true if cellCount <= MAX_CELLS_PER_LINE
  validationMessage?: string;
}

/**
 * Complete answer sheet structure
 */
export interface AnswerSheet {
  lines: AnswerSheetLine[]; // Array of 22 lines (or less)
  totalLines: number;
  totalCells: number; // Sum of all line cell counts
  averageCellsPerLine: number;

  // Validation results
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Calculate cell count for a single character
 */
export function getCharacterCellInfo(char: string): CharacterCellInfo {
  const code = char.charCodeAt(0);

  // Newline
  if (char === '\n' || char === '\r') {
    return { char, type: 'newline', cellCount: 0 };
  }

  // Hangul (한글): U+AC00 ~ U+D7A3 (가-힣)
  // + Hangul Jamo: U+1100 ~ U+11FF
  // + Hangul Compatibility Jamo: U+3130 ~ U+318F
  if (
    (code >= 0xAC00 && code <= 0xD7A3) || // 완성형 한글
    (code >= 0x1100 && code <= 0x11FF) || // 한글 자모
    (code >= 0x3130 && code <= 0x318F)    // 한글 호환 자모
  ) {
    return { char, type: 'hangul', cellCount: 1 };
  }

  // English letters (a-z, A-Z)
  if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
    return { char, type: 'english', cellCount: 0.5 };
  }

  // Numbers (0-9)
  if (code >= 48 && code <= 57) {
    return { char, type: 'number', cellCount: 0.5 };
  }

  // Space
  if (char === ' ' || char === '\t') {
    return { char, type: 'space', cellCount: 0.5 };
  }

  // Special characters (everything else)
  return { char, type: 'special', cellCount: 0.5 };
}

/**
 * Calculate total cell count for a line of text
 */
export function calculateLineCellCount(lineContent: string): {
  cellCount: number;
  breakdown: CharacterCellInfo[];
} {
  const breakdown: CharacterCellInfo[] = [];
  let totalCells = 0;

  for (const char of lineContent) {
    const info = getCharacterCellInfo(char);
    breakdown.push(info);
    totalCells += info.cellCount;
  }

  return {
    cellCount: Math.ceil(totalCells), // Round up to nearest integer
    breakdown,
  };
}

/**
 * Validate a single line against answer sheet rules
 */
export function validateLine(
  lineNumber: number,
  content: string,
  config = ANSWER_SHEET_CONFIG
): AnswerSheetLine {
  const { cellCount, breakdown } = calculateLineCellCount(content);

  const maxAllowed = config.STRICT_VALIDATION
    ? config.MAX_CELLS_PER_LINE
    : config.MAX_CELLS_PER_LINE + config.TOLERANCE_CELLS;

  const isValid = cellCount <= maxAllowed;
  const validationMessage = !isValid
    ? `Line ${lineNumber}: ${cellCount}칸 (최대 ${config.MAX_CELLS_PER_LINE}칸 초과)`
    : undefined;

  return {
    lineNumber,
    content,
    cellCount,
    characterBreakdown: breakdown,
    isValid,
    validationMessage,
  };
}

/**
 * Parse plain text content into structured AnswerSheet
 */
export function parseAnswerSheet(
  content: string,
  config = ANSWER_SHEET_CONFIG
): AnswerSheet {
  const rawLines = content.split('\n');
  const lines: AnswerSheetLine[] = [];
  const validationErrors: string[] = [];
  const validationWarnings: string[] = [];

  // Parse each line
  rawLines.forEach((lineContent, index) => {
    const lineNumber = index + 1;
    const line = validateLine(lineNumber, lineContent, config);
    lines.push(line);

    if (!line.isValid && line.validationMessage) {
      validationErrors.push(line.validationMessage);
    }
  });

  const totalLines = lines.length;
  const totalCells = lines.reduce((sum, line) => sum + line.cellCount, 0);
  const averageCellsPerLine = totalLines > 0 ? totalCells / totalLines : 0;

  // Validate total lines
  const maxAllowedLines = config.STRICT_VALIDATION
    ? config.MAX_LINES
    : config.MAX_LINES + config.TOLERANCE_LINES;

  if (totalLines > maxAllowedLines) {
    validationErrors.push(
      `총 ${totalLines}줄 (최대 ${config.MAX_LINES}줄 초과)`
    );
  }

  // Warnings for length
  if (totalLines < config.MAX_LINES * 0.5) {
    validationWarnings.push(
      `답안이 짧습니다 (${totalLines}줄). 최소 ${Math.floor(config.MAX_LINES * 0.5)}줄 이상 권장`
    );
  }

  if (averageCellsPerLine < config.MAX_CELLS_PER_LINE * 0.5) {
    validationWarnings.push(
      `평균 칸 수가 적습니다 (${averageCellsPerLine.toFixed(1)}칸). 내용을 더 채워주세요`
    );
  }

  return {
    lines,
    totalLines,
    totalCells,
    averageCellsPerLine,
    isValid: validationErrors.length === 0,
    validationErrors,
    validationWarnings,
  };
}

/**
 * Convert AnswerSheet back to plain text
 */
export function answerSheetToPlainText(sheet: AnswerSheet): string {
  return sheet.lines.map(line => line.content).join('\n');
}

/**
 * Get statistics about answer sheet
 */
export function getAnswerSheetStats(sheet: AnswerSheet) {
  const hangulCount = sheet.lines.reduce((sum, line) =>
    sum + line.characterBreakdown.filter(c => c.type === 'hangul').length, 0
  );

  const englishCount = sheet.lines.reduce((sum, line) =>
    sum + line.characterBreakdown.filter(c => c.type === 'english').length, 0
  );

  const numberCount = sheet.lines.reduce((sum, line) =>
    sum + line.characterBreakdown.filter(c => c.type === 'number').length, 0
  );

  const specialCount = sheet.lines.reduce((sum, line) =>
    sum + line.characterBreakdown.filter(c => c.type === 'special').length, 0
  );

  const spaceCount = sheet.lines.reduce((sum, line) =>
    sum + line.characterBreakdown.filter(c => c.type === 'space').length, 0
  );

  const totalCharacters = hangulCount + englishCount + numberCount + specialCount + spaceCount;

  return {
    totalCharacters,
    hangulCount,
    englishCount,
    numberCount,
    specialCount,
    spaceCount,
    totalLines: sheet.totalLines,
    totalCells: sheet.totalCells,
    averageCellsPerLine: sheet.averageCellsPerLine,
    utilizationRate: (sheet.totalCells / (ANSWER_SHEET_CONFIG.MAX_LINES * ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE)) * 100,
  };
}

/**
 * Format validation errors and warnings for display
 */
export function formatValidationMessages(sheet: AnswerSheet): {
  hasErrors: boolean;
  hasWarnings: boolean;
  errorMessage?: string;
  warningMessage?: string;
} {
  const hasErrors = sheet.validationErrors.length > 0;
  const hasWarnings = sheet.validationWarnings.length > 0;

  const errorMessage = hasErrors
    ? `❌ 규격 오류:\n${sheet.validationErrors.map(e => `  • ${e}`).join('\n')}`
    : undefined;

  const warningMessage = hasWarnings
    ? `⚠️ 주의사항:\n${sheet.validationWarnings.map(w => `  • ${w}`).join('\n')}`
    : undefined;

  return {
    hasErrors,
    hasWarnings,
    errorMessage,
    warningMessage,
  };
}

/**
 * Helper: Check if a line is close to limit (for UI warnings)
 */
export function isLineNearLimit(
  cellCount: number,
  threshold = 0.9
): boolean {
  return cellCount >= ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE * threshold;
}

/**
 * Helper: Get color indicator for line status
 */
export function getLineStatusColor(line: AnswerSheetLine): 'success' | 'warning' | 'error' {
  if (!line.isValid) return 'error';
  if (isLineNearLimit(line.cellCount)) return 'warning';
  return 'success';
}
