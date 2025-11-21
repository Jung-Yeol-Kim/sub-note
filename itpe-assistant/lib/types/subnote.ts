/**
 * Standard Sub-note Format for IT Professional Examination
 * Based on official answer sheet format (답안지(표).pdf)
 */

// Syllabus categories from 출제기준_전체텍스트.txt
export const SYLLABUS_CATEGORIES = {
  "1": "정보 전략 및 관리",
  "2": "소프트웨어 공학",
  "3": "자료처리",
  "4": "컴퓨터 시스템 및 정보통신",
  "5": "정보보안",
  "6": "최신기술, 법규 및 정책",
} as const;

export type SyllabusCategoryId = keyof typeof SYLLABUS_CATEGORIES;

// Sub-categories for each main category
export interface SyllabusSubCategory {
  id: string;
  categoryId: SyllabusCategoryId;
  name: string;
  details?: string[];
}

// Answer sheet section types
export type SectionType =
  | "definition"          // 정의
  | "explanation"         // 설명
  | "diagram"             // 다이어그램
  | "table"               // 표
  | "process"             // 절차/프로세스
  | "classification"      // 분류
  | "comparison"          // 비교
  | "example"             // 예시
  | "additional"          // 추가 고려사항
  | "conclusion";         // 결론

// Diagram definition
export interface DiagramSection {
  type: "diagram";
  title: string;
  content: string;      // ASCII art or markdown diagram
  description?: string; // Brief explanation
}

// Table definition (3-column format recommended)
export interface TableSection {
  type: "table";
  title: string;
  headers: string[];    // Column headers
  rows: string[][];     // Table data
  description?: string; // Brief explanation
}

// Text definition
export interface TextSection {
  type: "text";
  title?: string;
  content: string;      // Markdown formatted text
  bulletPoints?: string[]; // Optional bullet points
}

// Process/Procedure definition
export interface ProcessSection {
  type: "process";
  title: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

// Union type for all section types
export type AnswerSection =
  | DiagramSection
  | TableSection
  | TextSection
  | ProcessSection;

// Standard sub-note structure
export interface StandardSubNote {
  // Metadata
  id?: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Syllabus mapping
  syllabusMapping: {
    categoryId: SyllabusCategoryId;
    categoryName: string;
    subCategoryId?: string;
    subCategoryName?: string;
  };

  // Tags and classification
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  examFrequency?: number;        // How often this topic appears in exams
  relatedTopics?: string[];      // Related topic IDs

  // Content sections (following exam answer format)
  sections: {
    // 1. Definition (Required)
    definition: {
      content: string;            // Clear, concise definition
      keywords: string[];         // Key technical terms
      context?: string;           // Background or context
    };

    // 2. Main explanation (Required)
    explanation: {
      title: string;              // e.g., "OAuth 2.0 설명"
      subsections: AnswerSection[];
    };

    // 3. Additional notes (Optional)
    additional?: {
      title: string;
      content: string;
      subsections?: AnswerSection[];
    };
  };

  // Formatting metadata
  format: {
    estimatedLines: number;       // Estimated lines on answer sheet
    pageCount: 1 | 2;             // 1 or 2 pages
    hasEmoji: boolean;            // Avoid emojis by default
    particlesOmitted: boolean;    // 조사 생략 여부
  };

  // Study tracking
  study?: {
    status: "draft" | "in_review" | "completed";
    lastReviewedAt?: Date;
    practiceCount?: number;
    confidenceLevel?: 1 | 2 | 3 | 4 | 5;
  };
}

// Template for creating new sub-notes
export const EMPTY_SUBNOTE_TEMPLATE: Partial<StandardSubNote> = {
  tags: [],
  difficulty: 3,
  sections: {
    definition: {
      content: "",
      keywords: [],
    },
    explanation: {
      title: "",
      subsections: [],
    },
  },
  format: {
    estimatedLines: 30,
    pageCount: 1,
    hasEmoji: false,
    particlesOmitted: true,
  },
  study: {
    status: "draft",
    practiceCount: 0,
    confidenceLevel: 3,
  },
};

// Helper function to calculate estimated lines
export function calculateEstimatedLines(subnote: StandardSubNote): number {
  let lines = 0;

  // Title + space
  lines += 2;

  // Definition section
  lines += Math.ceil(subnote.sections.definition.content.length / 60) + 2;

  // Explanation sections
  subnote.sections.explanation.subsections.forEach(section => {
    switch (section.type) {
      case "diagram":
        lines += section.content.split("\n").length + 2;
        break;
      case "table":
        lines += section.rows.length + 3; // headers + rows + spacing
        break;
      case "text":
        lines += Math.ceil(section.content.length / 60) + 1;
        break;
      case "process":
        lines += section.steps.length * 2 + 2;
        break;
    }
  });

  // Additional section
  if (subnote.sections.additional) {
    lines += 3 + (subnote.sections.additional.subsections?.length ?? 0) * 2;
  }

  return lines;
}

// Helper function to validate sub-note structure
export function validateSubNote(subnote: Partial<StandardSubNote>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!subnote.title || subnote.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!subnote.syllabusMapping) {
    errors.push("Syllabus mapping is required");
  }

  if (!subnote.sections?.definition?.content) {
    errors.push("Definition section is required");
  }

  if (!subnote.sections?.explanation?.subsections?.length) {
    errors.push("Explanation section must have at least one subsection");
  }

  if (subnote.sections?.definition?.keywords?.length === 0) {
    errors.push("At least one keyword is required in definition");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper to convert markdown to StandardSubNote (partial implementation)
export function markdownToStandardSubNote(markdown: string): Partial<StandardSubNote> {
  // This is a basic parser - can be enhanced
  const lines = markdown.split("\n");
  const title = lines[0]?.replace(/^#\s+/, "") || "";

  return {
    title,
    sections: {
      definition: {
        content: "",
        keywords: [],
      },
      explanation: {
        title: "",
        subsections: [],
      },
    },
  };
}

// Helper to convert StandardSubNote to markdown
export function standardSubNoteToMarkdown(subnote: StandardSubNote): string {
  let md = `# ${subnote.title}\n\n`;

  // Metadata
  md += `**출제기준**: ${subnote.syllabusMapping.categoryName}`;
  if (subnote.syllabusMapping.subCategoryName) {
    md += ` > ${subnote.syllabusMapping.subCategoryName}`;
  }
  md += "\n\n";

  if (subnote.tags.length > 0) {
    md += `**태그**: ${subnote.tags.join(", ")}\n\n`;
  }

  md += "---\n\n";

  // Definition
  md += "## 1. 정의\n\n";
  md += `${subnote.sections.definition.content}\n\n`;

  if (subnote.sections.definition.keywords.length > 0) {
    md += `**핵심 키워드**: ${subnote.sections.definition.keywords.join(", ")}\n\n`;
  }

  if (subnote.sections.definition.context) {
    md += `**배경**: ${subnote.sections.definition.context}\n\n`;
  }

  md += "---\n\n";

  // Explanation
  md += `## 2. ${subnote.sections.explanation.title}\n\n`;

  subnote.sections.explanation.subsections.forEach((section, idx) => {
    md += `### ${idx + 1}) ${section.title || "Untitled"}\n\n`;

    switch (section.type) {
      case "diagram":
        md += "```\n";
        md += section.content;
        md += "\n```\n\n";
        if (section.description) {
          md += `${section.description}\n\n`;
        }
        break;

      case "table":
        md += `| ${section.headers.join(" | ")} |\n`;
        md += `| ${section.headers.map(() => "---").join(" | ")} |\n`;
        section.rows.forEach(row => {
          md += `| ${row.join(" | ")} |\n`;
        });
        md += "\n";
        if (section.description) {
          md += `${section.description}\n\n`;
        }
        break;

      case "text":
        md += `${section.content}\n\n`;
        if (section.bulletPoints && section.bulletPoints.length > 0) {
          section.bulletPoints.forEach(point => {
            md += `- ${point}\n`;
          });
          md += "\n";
        }
        break;

      case "process":
        section.steps.forEach(step => {
          md += `**${step.number}. ${step.title}**\n`;
          md += `${step.description}\n\n`;
        });
        break;
    }
  });

  // Additional
  if (subnote.sections.additional) {
    md += "---\n\n";
    md += `## 3. ${subnote.sections.additional.title}\n\n`;
    md += `${subnote.sections.additional.content}\n\n`;

    if (subnote.sections.additional.subsections) {
      subnote.sections.additional.subsections.forEach(section => {
        if (section.type === "text") {
          md += `${section.content}\n\n`;
        }
      });
    }
  }

  return md;
}
