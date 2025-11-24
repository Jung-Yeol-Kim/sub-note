/**
 * Convert sample answer plain text to AnswerSheetDocument
 * This is a helper for migrating existing sample data
 */

import {
  type AnswerSheetDocument,
  createTextBlock,
  createTableBlock,
  validateDocument,
} from "@/lib/types/answer-sheet-block";

export function convertPurdueSample(): AnswerSheetDocument {
  const document: AnswerSheetDocument = {
    blocks: [
      createTextBlock(["1. 정의", "- Purdue 모델: 산업제어시스템(ICS) 보안을 위한 계층적 네트워크 아키텍처 참조 모델", "- 목적: OT(운영기술) 환경의 보안 강화 및 IT-OT 통합 시 보안 경계 설정", ""], 1),
      createTextBlock(["2. Purdue 모델 구조", "", "1) 계층 구조 (다이어그램)"], 5),
      createTableBlock(
        ["계층", "영역", "설명"],
        [
          ["Level 5", "Enterprise Network", "IT 영역 - 전사 시스템"],
          ["Level 4", "Business Planning", "ERP, MES 등"],
          ["Level 3.5", "DMZ", "보안 경계 - 방화벽"],
          ["Level 3", "Operations Management", "OT 영역 - HMI, SCADA"],
          ["Level 2", "Supervisory Control", "DCS, PLC"],
          ["Level 1", "Basic Control", "센서, 액추에이터"],
          ["Level 0", "Physical Process", "물리 프로세스"],
        ],
        [3, 8, 8],
        8
      ),
      createTextBlock(["", "2) 계층별 특징"], 16),
      createTableBlock(
        ["계층", "주요 기능", "보안 요구사항"],
        [
          ["Level 5", "전사 IT 시스템", "기밀성, 무결성 중심"],
          ["Level 3.5", "DMZ, 방화벽", "엄격한 접근통제"],
          ["Level 3", "HMI, SCADA", "가용성 최우선"],
          ["Level 0", "물리 프로세스", "안전성 확보"],
        ],
        [3, 8, 8],
        18
      ),
    ],
    totalLines: 22,
    metadata: {
      isValid: true,
      validationErrors: [],
      validationWarnings: [],
    },
  };

  const validation = validateDocument(document);
  document.metadata = {
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
  document.totalLines = Math.max(...document.blocks.map(b => b.lineEnd));

  return document;
}

export function convertForensicsSample(): AnswerSheetDocument {
  const document: AnswerSheetDocument = {
    blocks: [
      createTextBlock(["1. 정의", "- 디지털 포렌식: 디지털 증거의 수집, 보존, 분석, 제출을 위한 과학적 절차 및 방법론", "- 목적: 법적 증거능력 확보 및 사이버 범죄 수사 지원", ""], 1),
      createTextBlock(["2. 디지털 포렌식 프로세스", "", "1) 절차", "식별 → 수집 → 보존 → 분석 → 제출", "", "2) 단계별 주요 활동"], 5),
      createTableBlock(
        ["단계", "주요 활동", "핵심 도구/기법"],
        [
          ["식별", "증거물 확인 및 문서화", "현장 조사"],
          ["수집", "비트 단위 복제", "dd, FTK Imager"],
          ["보존", "해시값 생성 및 보관", "MD5, SHA-256"],
          ["분석", "데이터 복구 및 해석", "EnCase, Autopsy"],
          ["제출", "보고서 작성 및 증언", "Chain of Custody"],
        ],
        [3, 8, 8],
        11
      ),
      createTextBlock(["", "3. 법적 증거능력 확보 요건", "- 무결성: 해시값 검증으로 원본 훼손 방지", "- 연속성: Chain of Custody 문서화", "- 적법성: 압수수색 영장 등 법적 절차 준수"], 17),
    ],
    totalLines: 21,
    metadata: {
      isValid: true,
      validationErrors: [],
      validationWarnings: [],
    },
  };

  const validation = validateDocument(document);
  document.metadata = {
    isValid: validation.isValid,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
  document.totalLines = Math.max(...document.blocks.map(b => b.lineEnd));

  return document;
}

// Add more converters for other samples as needed...
