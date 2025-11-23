"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
} from "lucide-react";
import {
  parseAnswerSheet,
  getAnswerSheetStats,
  formatValidationMessages,
  getLineStatusColor,
  ANSWER_SHEET_CONFIG,
  type AnswerSheet,
  type AnswerSheetLine,
} from "@/lib/types/answer-sheet";

interface AnswerSheetEditorProps {
  initialContent?: string;
  onChange?: (content: string, sheet: AnswerSheet) => void;
  readOnly?: boolean;
  showGridPreview?: boolean;
  showStatistics?: boolean;
}

export function AnswerSheetEditor({
  initialContent = "",
  onChange,
  readOnly = false,
  showGridPreview = true,
  showStatistics = true,
}: AnswerSheetEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [sheet, setSheet] = useState<AnswerSheet>(() =>
    parseAnswerSheet(initialContent)
  );

  // Update sheet when content changes
  useEffect(() => {
    const newSheet = parseAnswerSheet(content);
    setSheet(newSheet);
    onChange?.(content, newSheet);
  }, [content, onChange]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const stats = getAnswerSheetStats(sheet);
  const { hasErrors, hasWarnings, errorMessage, warningMessage } =
    formatValidationMessages(sheet);

  return (
    <div className="space-y-4">
      {/* Validation Status */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && !hasErrors && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {warningMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Answer Sheet Grid Info */}
      <Card className="border-accent/30">
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
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Progress bars */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  줄 수: {sheet.totalLines} / {ANSWER_SHEET_CONFIG.MAX_LINES}
                </span>
                <span
                  className={
                    sheet.totalLines > ANSWER_SHEET_CONFIG.MAX_LINES
                      ? "text-red-500 font-semibold"
                      : "text-green-600"
                  }
                >
                  {((sheet.totalLines / ANSWER_SHEET_CONFIG.MAX_LINES) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={(sheet.totalLines / ANSWER_SHEET_CONFIG.MAX_LINES) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  평균 칸 수: {sheet.averageCellsPerLine.toFixed(1)} /{" "}
                  {ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE}
                </span>
                <span
                  className={
                    sheet.averageCellsPerLine > ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE
                      ? "text-red-500 font-semibold"
                      : "text-green-600"
                  }
                >
                  {((sheet.averageCellsPerLine / ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={(sheet.averageCellsPerLine / ANSWER_SHEET_CONFIG.MAX_CELLS_PER_LINE) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  활용률
                </span>
                <span className="text-accent font-semibold">
                  {stats.utilizationRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.utilizationRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">답안 작성</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="답안을 작성하세요. 22줄 × 19칸 규격을 준수해야 합니다.&#10;&#10;⚠️ 중요: 각 줄은 19칸을 초과할 수 없습니다.&#10;   - 한글 1자 = 1칸&#10;   - 영문/숫자 2자 = 1칸&#10;&#10;1. 정의&#10;- 개념 정의 및 특징&#10;&#10;2. 설명&#10;1) 구조/프로세스 (다이어그램)&#10;2) 분류/유형/특징 (표)&#10;&#10;3. 추가 고려사항"
            className="min-h-[400px] font-mono text-sm resize-y"
            disabled={readOnly}
          />

          {/* Character count info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-4">
              <span>한글: {stats.hangulCount}자</span>
              <span>영문: {stats.englishCount}자</span>
              <span>숫자: {stats.numberCount}자</span>
            </div>
            <div>
              총 {stats.totalCharacters}자 (칸: {sheet.totalCells})
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line-by-line grid preview */}
      {showGridPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              줄별 규격 검사
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {sheet.lines.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  답안을 작성하면 줄별 규격이 표시됩니다
                </p>
              ) : (
                sheet.lines.map((line) => (
                  <LinePreview key={line.lineNumber} line={line} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {showStatistics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <StatCard label="총 줄 수" value={`${sheet.totalLines}줄`} />
              <StatCard
                label="총 칸 수"
                value={`${sheet.totalCells}칸`}
              />
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
    </div>
  );
}

// Line preview component
function LinePreview({ line }: { line: AnswerSheetLine }) {
  const statusColor = getLineStatusColor(line);
  const colorClasses = {
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    error: "bg-red-50 border-red-200 text-red-900",
  };

  const iconColorClasses = {
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  return (
    <div
      className={`flex items-start gap-2 p-2 rounded border text-xs ${colorClasses[statusColor]}`}
    >
      <span className="font-mono font-semibold min-w-[2rem] text-right">
        {line.lineNumber}
      </span>
      <span
        className={`min-w-[3rem] text-right font-semibold ${iconColorClasses[statusColor]}`}
      >
        {line.cellCount}칸
      </span>
      <span className="flex-1 font-mono truncate">{line.content || "(빈 줄)"}</span>
      {!line.isValid && (
        <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
      )}
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
