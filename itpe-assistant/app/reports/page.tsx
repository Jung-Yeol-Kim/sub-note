import { FileText, Calendar, BarChart3, Lightbulb } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ReportsTab } from "@/components/reports/reports-tab";
import { analyzeReports } from "@/lib/report-analyzer";

interface ReportMetadata {
  round: number;
  fileName: string;
  date?: string;
}

async function getReports(): Promise<ReportMetadata[]> {
  const reportsDir = path.join(process.cwd(), "..", "reports");

  try {
    const files = fs.readdirSync(reportsDir);
    const reportFiles = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const match = file.match(/(\d+)회_분석_리포트\.md/);
        return {
          round: match ? parseInt(match[1]) : 0,
          fileName: file,
        };
      })
      .filter((report) => report.round > 0)
      .sort((a, b) => b.round - a.round);

    return reportFiles;
  } catch (error) {
    console.error("Error reading reports directory:", error);
    return [];
  }
}

export default async function ReportsPage() {
  const reports = await getReports();
  const insights = analyzeReports();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcfaf7] via-[#f8f5f0] to-[#f5f1eb]">
      {/* Hero Header */}
      <div className="border-b border-[#3d5a4c]/10 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#3d5a4c] to-[#2d4a3c] rounded-lg shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#3d5a4c] font-crimson">
                Exam Analysis Reports
              </h1>
              <p className="text-sm text-[#3d5a4c]/60">
                정보관리기술사 시험 분석 리포트
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <ReportsTab reports={reports} insights={insights} />
      </div>
    </div>
  );
}
