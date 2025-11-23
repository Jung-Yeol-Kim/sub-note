/**
 * Simple test runner for answer-sheet validation
 * Run with: npx tsx lib/types/test-answer-sheet.ts
 */

import {
  getCharacterCellInfo,
  calculateLineCellCount,
  validateLine,
  parseAnswerSheet,
  getAnswerSheetStats,
  formatValidationMessages,
  ANSWER_SHEET_CONFIG,
} from './answer-sheet';

console.log('===== Answer Sheet Validation Tests =====\n');

// Test 1: Character counting
console.log('Test 1: Character Cell Counting');
console.log('--------------------------------');
const testChars = ['가', 'A', '1', '-', ' ', '\n'];
testChars.forEach(char => {
  const info = getCharacterCellInfo(char);
  console.log(`'${char === '\n' ? '\\n' : char}' → Type: ${info.type}, Cells: ${info.cellCount}`);
});
console.log();

// Test 2: Line cell counting
console.log('Test 2: Line Cell Counting');
console.log('--------------------------');
const testLines = [
  '정보관리기술사',
  'OAuth 2.0',
  'API Gateway 패턴',
  '가'.repeat(19), // Exactly 19 cells
  '가'.repeat(20), // Exceeds limit
];

testLines.forEach(line => {
  const { cellCount } = calculateLineCellCount(line);
  const status = cellCount <= ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE ? '✓' : '✗';
  console.log(`${status} "${line.substring(0, 30)}${line.length > 30 ? '...' : ''}" → ${cellCount}칸`);
});
console.log();

// Test 3: Real exam answer example
console.log('Test 3: Real Exam Answer Format');
console.log('--------------------------------');
const examAnswer = `가. OAuth의 정의

1. OAuth 2.0의 개념
- 제3자 애플리케이션 접근 권한 위임
- 리소스 소유자 동의하 접근 허용
- 비밀번호 노출 없이 인증 제공

2. OAuth 2.0 구조 및 프로세스

[다이어그램]
Client -> Auth Server -> Resource

3. OAuth 2.0 주요 특징
| 구분 | 항목 | 설명 |
| 인증 | Token | 시간 제한 |
| 보안 | Refresh | 재발급 |`;

const sheet = parseAnswerSheet(examAnswer);
console.log(`Total Lines: ${sheet.totalLines}/${ANSWER_SHEET_CONFIG.MAX_LINES}`);
console.log(`Total Cells: ${sheet.totalCells}`);
console.log(`Avg Cells/Line: ${sheet.averageCellsPerLine.toFixed(1)}`);
console.log(`Valid: ${sheet.isValid ? '✓ YES' : '✗ NO'}`);
console.log();

if (sheet.validationErrors.length > 0) {
  console.log('Validation Errors:');
  sheet.validationErrors.forEach(error => console.log(`  ❌ ${error}`));
  console.log();
}

if (sheet.validationWarnings.length > 0) {
  console.log('Validation Warnings:');
  sheet.validationWarnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
  console.log();
}

// Test 4: Statistics
console.log('Test 4: Answer Sheet Statistics');
console.log('--------------------------------');
const stats = getAnswerSheetStats(sheet);
console.log(`Total Characters: ${stats.totalCharacters}`);
console.log(`  - Hangul: ${stats.hangulCount}`);
console.log(`  - English: ${stats.englishCount}`);
console.log(`  - Numbers: ${stats.numberCount}`);
console.log(`  - Special: ${stats.specialCount}`);
console.log(`  - Spaces: ${stats.spaceCount}`);
console.log(`Utilization Rate: ${stats.utilizationRate.toFixed(1)}%`);
console.log();

// Test 5: Line-by-line analysis
console.log('Test 5: Line-by-Line Analysis');
console.log('------------------------------');
sheet.lines.slice(0, 10).forEach(line => {
  const status = line.isValid ? '✓' : '✗';
  const display = line.content.substring(0, 40);
  console.log(`${status} Line ${String(line.lineNumber).padStart(2)}: ${String(line.cellCount).padStart(2)}칸 | ${display}${line.content.length > 40 ? '...' : ''}`);
});
if (sheet.lines.length > 10) {
  console.log(`... (${sheet.lines.length - 10} more lines)`);
}
console.log();

// Test 6: Overly long line detection
console.log('Test 6: Overly Long Line Detection');
console.log('-----------------------------------');
const longLine = '정의: OAuth 2.0은 제3자 애플리케이션이 사용자의 비밀번호를 직접 관리하지 않고도 리소스에 접근할 수 있도록 하는 개방형 표준 프로토콜입니다';
const longSheet = parseAnswerSheet(longLine);
const { hasErrors, errorMessage } = formatValidationMessages(longSheet);
console.log(`Long line test: ${hasErrors ? '✗ FAILED (as expected)' : '✓ PASSED'}`);
if (errorMessage) {
  console.log(errorMessage);
}
console.log();

console.log('===== All Tests Complete =====');
