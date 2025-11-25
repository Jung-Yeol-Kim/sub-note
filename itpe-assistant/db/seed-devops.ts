/**
 * Seed DevOps sub-note example to database
 */

import { db, subNotes } from "./index";
import { devopsAnswerSheet } from "@/lib/data/devops-answer-example";

async function seedDevOpsSubNote() {
  try {
    console.log("🌱 Seeding DevOps sub-note...");

    // You need to replace this with your actual user ID from the database
    const userId = process.env.SEED_USER_ID || "your-user-id-here";

    if (userId === "your-user-id-here") {
      console.error("❌ Error: Please set SEED_USER_ID environment variable");
      console.log("Run: SEED_USER_ID=your-user-id pnpm seed:devops");
      process.exit(1);
    }

    // Convert structured answer to markdown content
    const content = generateMarkdownFromAnswerSheet(devopsAnswerSheet);

    const result = await db.insert(subNotes).values({
      userId,
      title: "DevOps에 대해 설명",
      content,
      category: "최신기술",
      tags: ["DevOps", "CI/CD", "자동화", "개발방법론"],
      status: "completed",
      difficulty: 3,
      structuredAnswer: devopsAnswerSheet as any,
      lineCount: devopsAnswerSheet.totalLines,
      cellCount: calculateTotalCells(devopsAnswerSheet),
      isValidFormat: devopsAnswerSheet.metadata.isValid,
      formatWarnings: devopsAnswerSheet.metadata.validationWarnings || [],
      lastReviewedAt: new Date(),
    }).returning();

    console.log("✅ DevOps sub-note seeded successfully!");
    console.log("📝 Sub-note ID:", result[0].id);
    console.log("📊 Line count:", result[0].lineCount);
    console.log("📊 Cell count:", result[0].cellCount);

  } catch (error) {
    console.error("❌ Error seeding DevOps sub-note:", error);
    throw error;
  }
}

function generateMarkdownFromAnswerSheet(sheet: typeof devopsAnswerSheet): string {
  let markdown = "# DevOps에 대해 설명\n\n";

  markdown += "## 1. 정의\n\n";
  markdown += "지속적인 통합 및 배포, DevOps의 정의\n";
  markdown += "개발조직과 운영조직의 협업, 자동화를 통해\n";
  markdown += "신속한 CI/CD가 가능한 SW 개발방법론\n\n";

  markdown += "## 2. DevOps 구성도 및 구성요소\n\n";
  markdown += "### 1) DevOps의 구성도\n\n";
  markdown += "```\n";
  markdown += "CI 흐름:\n";
  markdown += "계획(Jira) → 개발(git) → 테스트(JUnit)\n";
  markdown += "                                ↓\n";
  markdown += "                              배포(Jenkins)\n";
  markdown += "                                ↓\n";
  markdown += "모니터링(Grafana) ← 운영(azure) ← CD 흐름\n";
  markdown += "         ↓\n";
  markdown += "      계획으로 순환\n";
  markdown += "```\n\n";
  markdown += "- CI,CD 자동화를 통한 개발/운영 효율성 극대화\n\n";

  markdown += "### 2) DevOps의 구성요소\n\n";
  markdown += "| 구분 | 구성요소 | 설명 |\n";
  markdown += "|------|----------|------|\n";
  markdown += "| CI | Jira | 이슈사항 관리도구 |\n";
  markdown += "| CI | git | 소스 관리도구 |\n";
  markdown += "| CI | JUnit | 테스트 오픈소 |\n";
  markdown += "| CD | Jenkins | 배포 자동화 도구 |\n";
  markdown += "| CD | azure | 클라우드 운영 서비스 |\n";
  markdown += "| CD | Grafana | 모니터링 서비스 |\n\n";

  markdown += "- 지속적 통합과 배포로 자동화 서비스 운영\n\n";
  markdown += "**끝**";

  return markdown;
}

function calculateTotalCells(sheet: typeof devopsAnswerSheet): number {
  let totalCells = 0;

  for (const block of sheet.blocks) {
    if (block.type === 'text') {
      for (const line of block.lines) {
        totalCells += line.length;
      }
    } else if (block.type === 'diagram') {
      // Rough estimate for diagram cells - use lineEnd - lineStart + 1
      const lineCount = block.lineEnd - block.lineStart + 1;
      totalCells += lineCount * 19; // Full width
    } else if (block.type === 'table') {
      // Calculate table cells
      const lineCount = block.lineEnd - block.lineStart + 1;
      totalCells += lineCount * 19;
    }
  }

  return totalCells || 0; // Return 0 if calculation fails
}

// Run the seed function
seedDevOpsSubNote()
  .then(() => {
    console.log("🎉 Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });
