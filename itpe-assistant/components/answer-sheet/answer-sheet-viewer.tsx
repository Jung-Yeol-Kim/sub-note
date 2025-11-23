"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Printer,
} from "lucide-react";
import {
  parseAnswerSheet,
  getAnswerSheetStats,
  ANSWER_SHEET_CONFIG,
} from "@/lib/types/answer-sheet";

interface AnswerSheetViewerProps {
  content: string;
  showHeader?: boolean;
  showPrintButton?: boolean;
  title?: string;
}

export function AnswerSheetViewer({
  content,
  showHeader = true,
  showPrintButton = true,
  title,
}: AnswerSheetViewerProps) {
  const sheet = useMemo(() => parseAnswerSheet(content), [content]);
  const stats = useMemo(() => getAnswerSheetStats(sheet), [sheet]);

  const handlePrint = () => {
    window.print();
  };

  // Split content into lines for grid display
  const lines = content.split("\n").slice(0, ANSWER_SHEET_CONFIG.MAX_LINES);
  while (lines.length < ANSWER_SHEET_CONFIG.MAX_LINES) {
    lines.push("");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <Card className="border-accent/30 print:hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {title || "답안지 (22줄 × 19칸)"}
              </span>
              <div className="flex items-center gap-2">
                {sheet.isValid ? (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    규격 준수
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    규격 초과
                  </Badge>
                )}
                {showPrintButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    인쇄
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <StatCard label="총 줄 수" value={`${sheet.totalLines}줄`} />
              <StatCard label="총 칸 수" value={`${sheet.totalCells}칸`} />
              <StatCard
                label="평균 칸/줄"
                value={`${sheet.averageCellsPerLine.toFixed(1)}칸`}
              />
              <StatCard
                label="활용률"
                value={`${stats.utilizationRate.toFixed(0)}%`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Sheet Viewer */}
      <Card className="max-w-full overflow-x-auto">
        <CardContent className="p-0">
          <div className="flex justify-center p-4 bg-white">
            {/* Answer Sheet Grid - A4 aspect ratio, 22 rows × 19 columns */}
            <div
              className="relative w-full max-w-[210mm] aspect-[1/1.414] border-2 border-black bg-white p-4"
              style={{ fontFamily: "'D2Coding', 'Nanum Gothic Coding', 'Courier New', monospace" }}
            >
              {/* Grid container - 22 rows */}
              <div className="h-full flex flex-col">
                {lines.map((lineContent, lineIndex) => {
                  const lineData = sheet.lines.find(
                    (l) => l.lineNumber === lineIndex + 1
                  );
                  const isOverLimit =
                    lineData &&
                    lineData.cellCount > ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE;

                  return (
                    <div
                      key={lineIndex}
                      className={`flex-1 flex border-b border-dashed border-gray-300 relative last:border-b-0 ${
                        isOverLimit ? "bg-red-50/50" : ""
                      }`}
                    >
                      {/* Content area with 19 cells */}
                      <div className="w-full relative flex items-center">
                        <div
                          className="relative z-10 text-black whitespace-pre overflow-visible"
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.2',
                            letterSpacing: '0.05em',
                            wordSpacing: '0',
                          }}
                        >
                          {lineContent || "\u00A0"}
                        </div>

                        {/* Cell markers - 19 columns */}
                        <div className="absolute inset-0 grid z-0 pointer-events-none"
                          style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}
                        >
                          {[...Array(ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE)].map(
                            (_, cellIndex) => {
                              const shouldHighlight =
                                lineData &&
                                cellIndex < Math.ceil(lineData.cellCount);
                              const isOverflow =
                                lineData &&
                                cellIndex >=
                                  ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE - 1 &&
                                lineData.cellCount >
                                  ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE;

                              return (
                                <div
                                  key={cellIndex}
                                  className={`border-r border-gray-100 last:border-r-0 ${
                                    shouldHighlight ? "bg-green-500/[0.03]" : ""
                                  } ${
                                    isOverflow
                                      ? "bg-red-500/10 border border-red-500/30"
                                      : ""
                                  }`}
                                />
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stat card component
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
