/**
 * Answer Sheet Format Tests
 * 22줄 × 19칸 규격 검증 테스트
 */

import {
  getCharacterCellInfo,
  calculateLineCellCount,
  validateLine,
  parseAnswerSheet,
  getAnswerSheetStats,
  ANSWER_SHEET_CONFIG,
} from '../answer-sheet';

describe('Character Cell Counting', () => {
  describe('getCharacterCellInfo', () => {
    it('should count hangul as 1 cell', () => {
      expect(getCharacterCellInfo('가').cellCount).toBe(1);
      expect(getCharacterCellInfo('나').cellCount).toBe(1);
      expect(getCharacterCellInfo('다').cellCount).toBe(1);
      expect(getCharacterCellInfo('힣').cellCount).toBe(1);
    });

    it('should count english letters as 0.5 cell', () => {
      expect(getCharacterCellInfo('a').cellCount).toBe(0.5);
      expect(getCharacterCellInfo('Z').cellCount).toBe(0.5);
      expect(getCharacterCellInfo('m').cellCount).toBe(0.5);
    });

    it('should count numbers as 0.5 cell', () => {
      expect(getCharacterCellInfo('0').cellCount).toBe(0.5);
      expect(getCharacterCellInfo('5').cellCount).toBe(0.5);
      expect(getCharacterCellInfo('9').cellCount).toBe(0.5);
    });

    it('should count special characters as 0.5 cell', () => {
      expect(getCharacterCellInfo('-').cellCount).toBe(0.5);
      expect(getCharacterCellInfo('.').cellCount).toBe(0.5);
      expect(getCharacterCellInfo(',').cellCount).toBe(0.5);
      expect(getCharacterCellInfo('(').cellCount).toBe(0.5);
      expect(getCharacterCellInfo(')').cellCount).toBe(0.5);
    });

    it('should count space as 0.5 cell', () => {
      expect(getCharacterCellInfo(' ').cellCount).toBe(0.5);
    });

    it('should count newline as 0 cell', () => {
      expect(getCharacterCellInfo('\n').cellCount).toBe(0);
    });

    it('should identify character types correctly', () => {
      expect(getCharacterCellInfo('한').type).toBe('hangul');
      expect(getCharacterCellInfo('A').type).toBe('english');
      expect(getCharacterCellInfo('3').type).toBe('number');
      expect(getCharacterCellInfo('-').type).toBe('special');
      expect(getCharacterCellInfo(' ').type).toBe('space');
      expect(getCharacterCellInfo('\n').type).toBe('newline');
    });
  });

  describe('calculateLineCellCount', () => {
    it('should calculate pure hangul correctly', () => {
      const { cellCount } = calculateLineCellCount('정보관리기술사');
      expect(cellCount).toBe(7); // 7 한글 = 7칸
    });

    it('should calculate pure english correctly (rounded up)', () => {
      const { cellCount } = calculateLineCellCount('OAuth');
      expect(cellCount).toBe(3); // 5 letters = 2.5 → 3칸
    });

    it('should calculate mixed content correctly', () => {
      const { cellCount } = calculateLineCellCount('OAuth 2.0 인증');
      // O(0.5) + A(0.5) + u(0.5) + t(0.5) + h(0.5) + ' '(0.5) +
      // 2(0.5) + .(0.5) + 0(0.5) + ' '(0.5) +
      // 인(1) + 증(1)
      // = 2.5 + 2 + 2 = 6.5 → 7칸
      expect(cellCount).toBe(7);
    });

    it('should calculate technical terms correctly', () => {
      const { cellCount } = calculateLineCellCount('API Gateway 패턴');
      // A(0.5) + P(0.5) + I(0.5) + ' '(0.5) +
      // G(0.5) + a(0.5) + t(0.5) + e(0.5) + w(0.5) + a(0.5) + y(0.5) + ' '(0.5) +
      // 패(1) + 턴(1)
      // = 1.5 + 3.5 + 2 = 7 → 7칸
      expect(cellCount).toBe(7);
    });

    it('should handle empty string', () => {
      const { cellCount } = calculateLineCellCount('');
      expect(cellCount).toBe(0);
    });

    it('should provide character breakdown', () => {
      const { breakdown } = calculateLineCellCount('가a1');
      expect(breakdown).toHaveLength(3);
      expect(breakdown[0].char).toBe('가');
      expect(breakdown[0].type).toBe('hangul');
      expect(breakdown[1].char).toBe('a');
      expect(breakdown[1].type).toBe('english');
      expect(breakdown[2].char).toBe('1');
      expect(breakdown[2].type).toBe('number');
    });
  });
});

describe('Line Validation', () => {
  describe('validateLine', () => {
    it('should validate line within 19 cells as valid', () => {
      const line = validateLine(1, '정보관리기술사시험'); // 8 한글 = 8칸
      expect(line.isValid).toBe(true);
      expect(line.cellCount).toBe(8);
      expect(line.lineNumber).toBe(1);
    });

    it('should validate line at exactly 19 cells as valid', () => {
      const line = validateLine(1, '가나다라마바사아자차카타파하'); // 14 한글 = 14칸
      expect(line.isValid).toBe(true);
      expect(line.cellCount).toBe(14);
    });

    it('should validate line exceeding 19 cells as invalid (strict mode)', () => {
      const config = { ...ANSWER_SHEET_CONFIG, STRICT_VALIDATION: true };
      // Create a line with 20 hangul characters = 20 cells
      const line = validateLine(1, '가'.repeat(20), config);
      expect(line.isValid).toBe(false);
      expect(line.validationMessage).toContain('초과');
    });

    it('should allow tolerance in non-strict mode', () => {
      const config = { ...ANSWER_SHEET_CONFIG, STRICT_VALIDATION: false };
      // 19 + 1 tolerance = 20 cells allowed
      const line = validateLine(1, '가'.repeat(20), config);
      expect(line.isValid).toBe(true);
    });
  });
});

describe('Answer Sheet Parsing', () => {
  describe('parseAnswerSheet', () => {
    it('should parse simple multi-line content', () => {
      const content = `정의: OAuth 2.0
구조: 인증 서버
특징: 토큰 기반`;

      const sheet = parseAnswerSheet(content);
      expect(sheet.totalLines).toBe(3);
      expect(sheet.lines).toHaveLength(3);
      expect(sheet.isValid).toBe(true);
    });

    it('should detect line count exceeding 22 lines (strict)', () => {
      const config = { ...ANSWER_SHEET_CONFIG, STRICT_VALIDATION: true };
      const content = Array(25).fill('내용').join('\n'); // 25 lines

      const sheet = parseAnswerSheet(content, config);
      expect(sheet.totalLines).toBe(25);
      expect(sheet.isValid).toBe(false);
      expect(sheet.validationErrors.some(e => e.includes('22줄 초과'))).toBe(true);
    });

    it('should allow tolerance for line count in non-strict mode', () => {
      const config = { ...ANSWER_SHEET_CONFIG, STRICT_VALIDATION: false };
      const content = Array(23).fill('내용').join('\n'); // 23 lines (within tolerance)

      const sheet = parseAnswerSheet(content, config);
      expect(sheet.totalLines).toBe(23);
      expect(sheet.isValid).toBe(true);
    });

    it('should calculate total cells correctly', () => {
      const content = `한글칸수\nABCD`;
      // Line 1: 4 hangul = 4 cells
      // Line 2: 4 english = 2 cells
      // Total: 6 cells

      const sheet = parseAnswerSheet(content);
      expect(sheet.totalCells).toBe(6);
      expect(sheet.averageCellsPerLine).toBe(3);
    });

    it('should warn if content is too short', () => {
      const content = '짧은내용';

      const sheet = parseAnswerSheet(content);
      expect(sheet.validationWarnings.length).toBeGreaterThan(0);
      expect(sheet.validationWarnings.some(w => w.includes('짧습니다'))).toBe(true);
    });
  });
});

describe('Answer Sheet Statistics', () => {
  describe('getAnswerSheetStats', () => {
    it('should calculate statistics correctly', () => {
      const content = `정의: OAuth 2.0
구조: API Gateway
특징: 토큰 인증`;

      const sheet = parseAnswerSheet(content);
      const stats = getAnswerSheetStats(sheet);

      expect(stats.totalLines).toBe(3);
      expect(stats.hangulCount).toBeGreaterThan(0);
      expect(stats.englishCount).toBeGreaterThan(0);
      expect(stats.numberCount).toBeGreaterThan(0);
      expect(stats.totalCharacters).toBeGreaterThan(0);
    });

    it('should calculate utilization rate', () => {
      const content = Array(22).fill('가'.repeat(19)).join('\n'); // Full capacity

      const sheet = parseAnswerSheet(content);
      const stats = getAnswerSheetStats(sheet);

      expect(stats.utilizationRate).toBeCloseTo(100, 0);
    });

    it('should handle empty content', () => {
      const sheet = parseAnswerSheet('');
      const stats = getAnswerSheetStats(sheet);

      expect(stats.totalCharacters).toBe(0);
      expect(stats.totalLines).toBe(1); // Empty string creates 1 empty line
      expect(stats.utilizationRate).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Real-world Examples', () => {
  it('should handle typical exam answer format', () => {
    const content = `가. OAuth의 정의

1. OAuth 2.0의 개념
- 제3자 애플리케이션 접근 권한 위임 프레임워크
- 리소스 소유자 동의하 제한적 접근 허용
- 비밀번호 노출 없이 안전한 인증 제공

2. OAuth 2.0 구조 및 프로세스
[다이어그램]
Client → Authorization Server → Resource Server

3. OAuth 2.0 주요 특징
| 구분 | 항목 | 설명 |
| 인증 | Access Token | 시간 제한 토큰 |
| 보안 | Refresh Token | 재발급 메커니즘 |`;

    const sheet = parseAnswerSheet(content);

    expect(sheet.isValid).toBe(true);
    expect(sheet.totalLines).toBeLessThanOrEqual(22);

    // Check that no line exceeds 19 cells
    const invalidLines = sheet.lines.filter(line => !line.isValid);
    expect(invalidLines.length).toBe(0);
  });

  it('should detect overly long lines in real content', () => {
    const content = `정의: OAuth 2.0은 제3자 애플리케이션이 사용자의 비밀번호를 직접 관리하지 않고도 리소스에 접근할 수 있도록 하는 개방형 표준 프로토콜`;
    // Very long line that likely exceeds 19 cells

    const sheet = parseAnswerSheet(content);
    expect(sheet.validationErrors.length).toBeGreaterThan(0);
  });
});
