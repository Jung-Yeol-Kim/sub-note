import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, BarChart3, TrendingUp } from "lucide-react";
import { ReportViewer } from "@/components/reports/report-viewer";

interface PageProps {
  params: Promise<{ round: string }>;
}

interface ReportData {
  round: number;
  date: string;
  totalQuestions: number;
  content: string;
  categories: CategoryData[];
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  questions: string[];
}

async function getReport(round: string): Promise<ReportData | null> {
  const reportsDir = path.join(process.cwd(), "..", "reports");
  const fileName = `${round}회_분석_리포트.md`;
  const filePath = path.join(reportsDir, fileName);

  try {
    const content = fs.readFileSync(filePath, "utf-8");

    // Parse metadata
    const dateMatch = content.match(/\*\*분석일자\*\*:\s*([^\n]+)/);
    const totalMatch = content.match(/\*\*총 문제 수\*\*:\s*(\d+)/);

    // Parse categories
    const categoryRegex = /###\s*(\d+)\.\s*([^(]+)\s*\((\d+)문제\)/g;
    const categories: CategoryData[] = [];
    let match;

    while ((match = categoryRegex.exec(content)) !== null) {
      const categoryName = match[2].trim();
      const count = parseInt(match[3]);

      // Find questions for this category
      const categoryStart = match.index;
      const nextCategoryMatch = content.indexOf("###", categoryStart + 1);
      const categoryEnd =
        nextCategoryMatch === -1 ? content.length : nextCategoryMatch;
      const categoryContent = content.slice(categoryStart, categoryEnd);

      const questionRegex = /^-\s+(.+)$/gm;
      const questions: string[] = [];
      let questionMatch;

      while ((questionMatch = questionRegex.exec(categoryContent)) !== null) {
        questions.push(questionMatch[1]);
      }

      categories.push({
        name: categoryName,
        count,
        percentage: 0, // Will be calculated
        questions,
      });
    }

    // Calculate percentages
    const totalQuestions = parseInt(totalMatch?.[1] || "0");
    categories.forEach((cat) => {
      cat.percentage = (cat.count / totalQuestions) * 100;
    });

    return {
      round: parseInt(round),
      date: dateMatch?.[1] || "",
      totalQuestions,
      content,
      categories,
    };
  } catch (error) {
    console.error("Error reading report:", error);
    return null;
  }
}

export default async function ReportPage({ params }: PageProps) {
  const { round } = await params;
  const report = await getReport(round);

  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/reports"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground font-crimson">
                    {report.round}회 분석 리포트
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{report.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-card rounded-lg border border-border">
                <p className="text-xs text-muted-foreground">총 문제 수</p>
                <p className="text-xl font-bold text-foreground">
                  {report.totalQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ReportViewer content={report.content} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Category Overview */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground font-crimson">
                  카테고리 분포
                </h2>
              </div>

              <div className="space-y-4">
                {report.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {category.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {category.count}문제
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-secondary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">최다 출제</p>
                    <p className="text-sm font-bold text-foreground">
                      {report.categories[0]?.count || 0}문제
                    </p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-5 h-5 text-secondary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">평균</p>
                    <p className="text-sm font-bold text-foreground">
                      {(
                        report.totalQuestions / report.categories.length
                      ).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
