/**
 * DevOps Answer Sheet Example Data
 * 이미지와 동일한 DevOps 답안지 예시 데이터
 */

import {
  createTextBlock,
  createDiagramBlock,
  createTableBlock,
  type AnswerSheetDocument,
  type DiagramNode,
  type DiagramConnection,
  type DiagramLabel,
} from "@/lib/types/answer-sheet-block";

export const devopsAnswerSheet: AnswerSheetDocument = {
  leftMargin: [
    { line: 1, column: 1, content: "문1)" },
    { line: 2, column: 1, content: "답)" },
    { line: 3, column: 2, content: "1." },
    { line: 6, column: 2, content: "2." },
    { line: 7, column: 3, content: "1)" },
    { line: 14, column: 3, content: "2)" },
  ],
  blocks: [
    // 1. 제목 (줄 1)
    createTextBlock(
      ["DevOps에 대해 설명"],
      1
    ),

    // 2. 정의 (줄 3-5)
    createTextBlock(
      [
        "지속적인 통합 및 배포, DevOps의 정의",
        "개발조직과 운영조직의 협업, 자동화를 통해",
        "신속한 CI/CD가 가능한 SW 개발방법론"
      ],
      3
    ),

    // 3. 구조 섹션 헤더 (줄 6-7)
    createTextBlock(
      [
        "DevOps 구성도 및 구성요소",
        "DevOps의 구성도"
      ],
      6
    ),

    // 4. CI/CD 다이어그램 (줄 8-12)
    createDiagramBlock(
      // Nodes
      [
        // CI 라인 (위)
        { id: "plan", label: "계획", x: 1.5, y: 1.1, width: 2.5, height: 0.7 } as DiagramNode,
        { id: "dev", label: "개발", x: 7, y: 1.1, width: 2.5, height: 0.7 } as DiagramNode,
        { id: "test", label: "테스트", x: 12.5, y: 1.1, width: 2.8, height: 0.7 } as DiagramNode,

        // CD 라인 (아래)
        { id: "monitor", label: "모니터링", x: 1.5, y: 2.9, width: 2.8, height: 0.7 } as DiagramNode,
        { id: "operate", label: "운영", x: 7, y: 2.9, width: 2.5, height: 0.7 } as DiagramNode,
        { id: "deploy", label: "배포", x: 12.5, y: 2.9, width: 2.5, height: 0.7 } as DiagramNode,
      ],
      // Connections
      [
        // CI 흐름 (위 →)
        { from: "plan", to: "dev" } as DiagramConnection,
        { from: "dev", to: "test" } as DiagramConnection,

        // CD 흐름 (아래 ←)
        { from: "deploy", to: "operate" } as DiagramConnection,
        { from: "operate", to: "monitor" } as DiagramConnection,

        // CI와 CD 연결
        { from: "test", to: "deploy" } as DiagramConnection,
        { from: "monitor", to: "plan" } as DiagramConnection,
      ],
      5, // lineCount
      8, // lineStart
      // Labels
      [
        // CI 도구 레이블 (위)
        { text: "-Jira", x: 1.8, y: 0.3 } as DiagramLabel,
        { text: "-git", x: 7.3, y: 0.3 } as DiagramLabel,
        { text: "-JUnit", x: 12.8, y: 0.3 } as DiagramLabel,

        // CD 도구 레이블 (아래)
        { text: "-Grafana", x: 1.5, y: 4.1 } as DiagramLabel,
        { text: "-azure", x: 7.2, y: 4.1 } as DiagramLabel,
        { text: "-Jenkins", x: 12.5, y: 4.1 } as DiagramLabel,

        // CI/CD 레이블
        { text: "CI", x: 0, y: 1.3 } as DiagramLabel,
        { text: "CD", x: 0, y: 3.1 } as DiagramLabel,
      ]
    ),

    // 5. 다이어그램 설명 (줄 13)
    createTextBlock(
      ["- CI,CD 자동화를 통한 개발/운영 효율성 극대화"],
      13
    ),

    // 6. 표 섹션 헤더 (줄 14)
    createTextBlock(
      ["DevOps의 구성요소"],
      14
    ),

    // 7. 구성요소 표 (줄 15-21)
    createTableBlock(
      // Headers
      ["구분", "구성요소", "설명"],
      // Rows
      [
        [
          "",
          "-Jira",
          "-이슈사항 관리도구"
        ],
        [
          "CI",
          "-git",
          "-소스 관리도구"
        ],
        [
          "",
          "-JUnit",
          "-테스트 오픈소"
        ],
        [
          "",
          "-Jenkins",
          "-배포 자동화 도구"
        ],
        [
          "CD",
          "-azure",
          "-클라우드 운영 서비스"
        ],
        [
          "",
          "-Grafana",
          "-모니터링 서비스"
        ],
      ],
      // Column widths (total = 20)
      [2, 5, 13],
      15 // lineStart
    ),

    // 8. 마무리 (줄 22)
    createTextBlock(
      ['- 지속적 통합과 배포로 자동화 서비스 운영     "끝"'],
      22
    ),
  ],
  totalLines: 22,
  metadata: {
    isValid: true,
    validationErrors: [],
    validationWarnings: [],
  },
};
