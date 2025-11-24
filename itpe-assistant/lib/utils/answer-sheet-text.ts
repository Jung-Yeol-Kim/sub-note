/**
 * Utilities for rendering text in answer sheet grid format
 * Handles character width calculation and grid alignment
 */

/**
 * Calculate character width in grid cells
 * Korean/Full-width characters = 1 cell
 * English/Half-width characters = 0.5 cell
 */
export function calculateCharacterWidth(char: string): number {
  // Empty or whitespace
  if (!char || char === ' ') {
    return 0.5;
  }

  // Korean characters (Hangul syllables, Jamo)
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char);

  // Full-width characters (CJK, symbols, etc.)
  const isFullWidth = /[^\x00-\x7F]/.test(char);

  return isKorean || isFullWidth ? 1 : 0.5;
}

/**
 * Check if character is full-width (takes 1 cell)
 */
export function isFullWidthChar(char: string): boolean {
  return calculateCharacterWidth(char) === 1;
}

/**
 * Split text into characters with width information
 */
export interface CharacterInfo {
  char: string;
  width: number; // in cells (0.5 or 1)
  isFullWidth: boolean;
}

export function splitTextToCharacters(text: string): CharacterInfo[] {
  return Array.from(text).map((char) => {
    const width = calculateCharacterWidth(char);
    return {
      char,
      width,
      isFullWidth: width === 1,
    };
  });
}

/**
 * Calculate total cell width of text
 */
export function calculateTextWidth(text: string): number {
  return Array.from(text).reduce(
    (total, char) => total + calculateCharacterWidth(char),
    0
  );
}

/**
 * Split text into lines that fit within maxCells
 * Returns array of { text, cellWidth }
 */
export function splitTextToLines(
  text: string,
  maxCells: number = 19
): Array<{ text: string; cellWidth: number }> {
  const lines: Array<{ text: string; cellWidth: number }> = [];
  const characters = Array.from(text);

  let currentLine = '';
  let currentWidth = 0;

  for (const char of characters) {
    const charWidth = calculateCharacterWidth(char);

    // Check if adding this character exceeds max cells
    if (currentWidth + charWidth > maxCells) {
      // Save current line and start new one
      if (currentLine) {
        lines.push({ text: currentLine, cellWidth: currentWidth });
      }
      currentLine = char;
      currentWidth = charWidth;
    } else {
      currentLine += char;
      currentWidth += charWidth;
    }
  }

  // Add remaining line
  if (currentLine) {
    lines.push({ text: currentLine, cellWidth: currentWidth });
  }

  return lines;
}
