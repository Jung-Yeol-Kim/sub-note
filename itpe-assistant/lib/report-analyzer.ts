import fs from "fs";
import path from "path";

export interface CategoryData {
  name: string;
  count: number;
  percentage: number;
}

export interface ReportData {
  round: number;
  date: string;
  totalQuestions: number;
  categories: CategoryData[];
}

export interface TrendData {
  round: number;
  value: number;
}

export interface CategoryTrend {
  categoryName: string;
  trend: TrendData[];
  average: number;
  max: number;
  min: number;
  recent: number; // Last 3 rounds average
}

export interface InsightsSummary {
  totalRounds: number;
  totalQuestions: number;
  avgQuestionsPerRound: number;
  categoryTrends: CategoryTrend[];
  topCategories: { name: string; avgCount: number }[];
  risingCategories: { name: string; change: number }[];
  decliningCategories: { name: string; change: number }[];
}

export function parseReportContent(content: string, round: number): ReportData {
  const lines = content.split("\n");

  // Parse metadata
  const dateMatch = content.match(/\*\*분석일자\*\*:\s*([^\n]+)/);
  const totalMatch = content.match(/\*\*총 문제 수\*\*:\s*(\d+)/);

  // Parse frequency table
  const categories: CategoryData[] = [];
  const tableRegex = /\|\s*(\d+)\.\s*([^|]+?)\s*\|\s*(\d+)문제\s*\|\s*([^|]+?)\s*\|/g;
  let match;

  while ((match = tableRegex.exec(content)) !== null) {
    const name = match[2].trim();
    const count = parseInt(match[3]);
    const percentage = parseFloat(match[4].replace("%", ""));

    categories.push({ name, count, percentage });
  }

  return {
    round,
    date: dateMatch?.[1] || "",
    totalQuestions: parseInt(totalMatch?.[1] || "0"),
    categories,
  };
}

export function getAllReports(): ReportData[] {
  const reportsDir = path.join(process.cwd(), "..", "reports");

  try {
    const files = fs.readdirSync(reportsDir);
    const reports: ReportData[] = [];

    for (const file of files) {
      if (file.endsWith(".md")) {
        const match = file.match(/(\d+)회_분석_리포트\.md/);
        if (match) {
          const round = parseInt(match[1]);
          const content = fs.readFileSync(
            path.join(reportsDir, file),
            "utf-8"
          );
          reports.push(parseReportContent(content, round));
        }
      }
    }

    return reports.sort((a, b) => a.round - b.round);
  } catch (error) {
    console.error("Error reading reports:", error);
    return [];
  }
}

export function analyzeReports(): InsightsSummary {
  const reports = getAllReports();

  if (reports.length === 0) {
    return {
      totalRounds: 0,
      totalQuestions: 0,
      avgQuestionsPerRound: 0,
      categoryTrends: [],
      topCategories: [],
      risingCategories: [],
      decliningCategories: [],
    };
  }

  // Basic stats
  const totalQuestions = reports.reduce((sum, r) => sum + r.totalQuestions, 0);
  const avgQuestionsPerRound = totalQuestions / reports.length;

  // Get all unique category names
  const categoryNames = new Set<string>();
  reports.forEach((report) => {
    report.categories.forEach((cat) => categoryNames.add(cat.name));
  });

  // Build category trends
  const categoryTrends: CategoryTrend[] = Array.from(categoryNames).map(
    (categoryName) => {
      const trend: TrendData[] = reports.map((report) => {
        const category = report.categories.find((c) => c.name === categoryName);
        return {
          round: report.round,
          value: category?.count || 0,
        };
      });

      const values = trend.map((t) => t.value);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      // Recent average (last 3 rounds)
      const recentValues = values.slice(-3);
      const recent =
        recentValues.reduce((a, b) => a + b, 0) / recentValues.length;

      return {
        categoryName,
        trend,
        average,
        max,
        min,
        recent,
      };
    }
  );

  // Top categories by average
  const topCategories = categoryTrends
    .map((ct) => ({ name: ct.categoryName, avgCount: ct.average }))
    .sort((a, b) => b.avgCount - a.avgCount)
    .slice(0, 3);

  // Rising and declining categories
  const categoriesWithChange = categoryTrends
    .map((ct) => {
      const change = ct.recent - ct.average;
      return { name: ct.categoryName, change };
    })
    .filter((c) => Math.abs(c.change) > 0.5);

  const risingCategories = categoriesWithChange
    .filter((c) => c.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 3);

  const decliningCategories = categoriesWithChange
    .filter((c) => c.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 3);

  return {
    totalRounds: reports.length,
    totalQuestions,
    avgQuestionsPerRound,
    categoryTrends,
    topCategories,
    risingCategories,
    decliningCategories,
  };
}
