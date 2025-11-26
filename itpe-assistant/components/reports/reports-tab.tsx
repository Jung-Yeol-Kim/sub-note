"use client";

import { useState } from "react";
import { FileText, Calendar, Lightbulb } from "lucide-react";
import Link from "next/link";
import { InsightsDashboard } from "./insights-dashboard";
import { InsightsSummary } from "@/lib/report-analyzer";

interface ReportMetadata {
  round: number;
  fileName: string;
  date?: string;
}

interface ReportsTabProps {
  reports: ReportMetadata[];
  insights: InsightsSummary;
}

export function ReportsTab({ reports, insights }: ReportsTabProps) {
  const [activeTab, setActiveTab] = useState<"reports" | "insights">("reports");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
            activeTab === "reports"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>리포트 목록</span>
          {activeTab === "reports" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("insights")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
            activeTab === "insights"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>인사이트 & 트렌드</span>
          {activeTab === "insights" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link
              key={report.round}
              href={`/reports/${report.round}`}
              className="group"
            >
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="px-3 py-1 bg-muted rounded-full">
                    <span className="text-xs font-medium text-foreground">
                      Round {report.round}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 font-crimson group-hover:text-secondary transition-colors">
                  {report.round}회 분석 리포트
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  출제기준별 문제 분석 및 통계
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Analysis Report</span>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-secondary font-medium group-hover:underline">
                    View Report →
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {reports.length === 0 && (
            <div className="col-span-full text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No reports available</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "insights" && <InsightsDashboard insights={insights} />}
    </div>
  );
}
