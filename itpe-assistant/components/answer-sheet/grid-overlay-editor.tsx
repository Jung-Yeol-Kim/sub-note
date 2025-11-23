"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  parseAnswerSheet,
  getAnswerSheetStats,
  formatValidationMessages,
  ANSWER_SHEET_CONFIG,
  type AnswerSheet,
} from "@/lib/types/answer-sheet";

interface GridOverlayEditorProps {
  initialContent?: string;
  onChange?: (content: string, sheet: AnswerSheet) => void;
  readOnly?: boolean;
  showPrintButton?: boolean;
}

export function GridOverlayEditor({
  initialContent = "",
  onChange,
  readOnly = false,
  showPrintButton = false,
}: GridOverlayEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [sheet, setSheet] = useState<AnswerSheet>(() =>
    parseAnswerSheet(initialContent)
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update sheet when content changes
  useEffect(() => {
    const newSheet = parseAnswerSheet(content);
    setSheet(newSheet);
    onChange?.(content, newSheet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handlePrint = () => {
    window.print();
  };

  const stats = getAnswerSheetStats(sheet);
  const { hasErrors, hasWarnings, errorMessage, warningMessage } =
    formatValidationMessages(sheet);

  // Split content into lines for grid overlay
  const lines = content.split("\n").slice(0, ANSWER_SHEET_CONFIG.MAX_LINES);
  while (lines.length < ANSWER_SHEET_CONFIG.MAX_LINES) {
    lines.push("");
  }

  return (
    <div className="space-y-4">
      {/* Validation Status */}
      {hasErrors && (
        <Alert variant="destructive" className="print:hidden">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && !hasErrors && (
        <Alert className="print:hidden">
          <Info className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {warningMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Answer Sheet Grid Info */}
      <Card className="border-accent/30 print:hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              답안지 규격 (22줄 × 19칸)
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

      {/* Grid Overlay Editor */}
      <Card className="relative">
        <CardHeader className="print:hidden">
          <CardTitle className="text-lg">답안 작성 (그리드 가이드)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-x-auto flex justify-center">
            {/* Answer Sheet Grid Background - A4 aspect ratio, 22 rows × 19 columns */}
            <div
              className="relative w-full max-w-[210mm] aspect-[1/1.414] bg-white border-2 border-[#333] p-4"
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
                      {/* 19 cells per line - each cell sized for 1 Korean char */}
                      <div
                        className="w-full grid h-full"
                        style={{
                          gridTemplateColumns: 'repeat(19, minmax(0, 1fr))',
                        }}
                      >
                        {[...Array(ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE)].map(
                          (_, cellIndex) => {
                            const shouldHighlight =
                              lineData && cellIndex < Math.ceil(lineData.cellCount);
                            const isOverflow =
                              lineData &&
                              cellIndex >= ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE - 1 &&
                              lineData.cellCount >
                                ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE;

                            return (
                              <div
                                key={cellIndex}
                                className={`border-r border-gray-200 transition-colors last:border-r-0 ${
                                  shouldHighlight ? "bg-green-500/5" : ""
                                } ${isOverflow ? "bg-red-500/15 border border-red-500/30" : ""}`}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Textarea overlay - 19 characters per line max */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="답안을 작성하세요. 배경의 그리드를 참고하여 22줄 × 19칸 규격을 준수해주세요."
              style={{
                fontFamily: "'D2Coding', 'Nanum Gothic Coding', 'Courier New', monospace",
                fontSize: '16px',
                lineHeight: 'calc((100% - 2rem) / 22)',
                letterSpacing: '0.05em',
                wordSpacing: '0',
              }}
              className="absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none resize-none px-4 py-4 text-gray-900 overflow-hidden placeholder:text-gray-400 placeholder:text-[11px] disabled:bg-transparent disabled:text-gray-900"
              disabled={readOnly}
              rows={22}
            />
          </div>

          {/* Character count info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground p-4 print:hidden">
            <div className="flex gap-4">
              <span>한글: {stats.hangulCount}자</span>
              <span>영문: {stats.englishCount}자</span>
              <span>숫자: {stats.numberCount}자</span>
            </div>
            <div>총 {stats.totalCharacters}자 (칸: {sheet.totalCells})</div>
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
