"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, AlertTriangle, FileText, Layers, FileStack } from "lucide-react";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { BLOCK_CONSTANTS, getPageForLine } from "@/lib/types/answer-sheet-block";

interface AnswerSheetMetadataPanelProps {
  document: AnswerSheetDocument | null;
  title: string;
}

/**
 * Metadata panel showing real-time document validation status
 * Study Atelier aesthetic: warm cream, forest green, bronze accents
 */
export function AnswerSheetMetadataPanel({
  document,
  title,
}: AnswerSheetMetadataPanelProps) {
  const totalLines = document?.totalLines || 0;
  const maxLines = BLOCK_CONSTANTS.MAX_LINES;
  const lineProgress = (totalLines / maxLines) * 100;

  const isValid = document?.metadata.isValid ?? true;
  const errors = document?.metadata.validationErrors || [];
  const warnings = document?.metadata.validationWarnings || [];

  const blockCount = document?.blocks.length || 0;
  const textBlocks = document?.blocks.filter(b => b.type === "text").length || 0;
  const tableBlocks = document?.blocks.filter(b => b.type === "table").length || 0;
  const drawingBlocks = document?.blocks.filter(b => b.type === "drawing").length || 0;

  // Calculate per-page statistics
  const getPageStats = () => {
    const pages = [
      { page: 1, start: 1, end: 22, used: 0 },
      { page: 2, start: 23, end: 44, used: 0 },
      { page: 3, start: 45, end: 66, used: 0 },
    ];

    if (!document) return pages;

    // Count lines used in each page
    for (const block of document.blocks) {
      for (let line = block.lineStart; line <= block.lineEnd; line++) {
        const pageNum = getPageForLine(line);
        if (pageNum >= 1 && pageNum <= 3) {
          pages[pageNum - 1].used += 1;
        }
      }
    }

    return pages;
  };

  const pageStats = getPageStats();
  const pagesInUse = pageStats.filter(p => p.used > 0).length;

  // Calculate approximate cell count
  let totalCells = 0;
  if (document) {
    for (const block of document.blocks) {
      if (block.type === "text") {
        totalCells += block.lines.reduce(
          (sum, line) => sum + Math.ceil(line.length / 2),
          0
        );
      } else if (block.type === "table") {
        const cellsPerRow = block.columnWidths.reduce((a, b) => a + b, 0);
        totalCells += cellsPerRow * (1 + block.rows.length);
      }
    }
  }

  return (
    <div className="space-y-4 sticky top-6">
      {/* Document Title Preview */}
      <Card className="border-[#3d5a4c]/20 bg-[#fcfaf7] dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#3d5a4c] dark:text-emerald-400 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            문서 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">제목</p>
            <p className="text-sm font-medium text-foreground/90 line-clamp-2">
              {title || <span className="text-muted-foreground italic">제목 없음</span>}
            </p>
          </div>

          <div className="pt-2 border-t border-[#3d5a4c]/10">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">블록 수</span>
              <span className="font-medium text-foreground/80">{blockCount}개</span>
            </div>
            {blockCount > 0 && (
              <div className="flex gap-1 mt-2">
                {textBlocks > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-0 border-[#3d5a4c]/30">
                    텍스트 {textBlocks}
                  </Badge>
                )}
                {tableBlocks > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-0 border-[#c49a6c]/40 text-[#c49a6c]">
                    표 {tableBlocks}
                  </Badge>
                )}
                {drawingBlocks > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-0 border-blue-500/30 text-blue-600">
                    그림 {drawingBlocks}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Page Usage */}
      <Card className="border-[#3d5a4c]/20 bg-[#fcfaf7] dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#3d5a4c] dark:text-emerald-400 flex items-center gap-2">
            <FileStack className="h-4 w-4" />
            페이지 사용 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">사용 중인 페이지</span>
            <Badge variant="outline" className="text-xs">
              {pagesInUse} / 3 페이지
            </Badge>
          </div>

          {/* Per-page breakdown */}
          <div className="space-y-2">
            {pageStats.map((page) => {
              const linesLeft = BLOCK_CONSTANTS.LINES_PER_PAGE - page.used;
              const isUsed = page.used > 0;
              const isFull = page.used >= BLOCK_CONSTANTS.LINES_PER_PAGE;
              const isAlmostFull = page.used >= BLOCK_CONSTANTS.LINES_PER_PAGE * 0.9;

              return (
                <div key={page.page} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={isUsed ? "font-medium text-foreground/90" : "text-muted-foreground"}>
                      📄 {page.page}페이지
                    </span>
                    <span className={`text-xs font-medium ${isFull ? "text-red-600" : isAlmostFull ? "text-[#c49a6c]" : "text-[#3d5a4c]"
                      }`}>
                      {page.used} / {BLOCK_CONSTANTS.LINES_PER_PAGE}줄
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#3d5a4c]/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isFull
                          ? "bg-red-500"
                          : isAlmostFull
                            ? "bg-[#c49a6c]"
                            : "bg-[#3d5a4c]"
                        }`}
                      style={{ width: `${(page.used / BLOCK_CONSTANTS.LINES_PER_PAGE) * 100}%` }}
                    />
                  </div>
                  {isUsed && linesLeft > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      {linesLeft}줄 남음
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Total Line Count */}
      <Card className="border-[#3d5a4c]/20 bg-[#fcfaf7] dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#3d5a4c] dark:text-emerald-400 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            전체 규격
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Line Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">총 줄 사용량</span>
              <span className={`text-sm font-bold transition-colors ${totalLines > maxLines
                  ? "text-red-600"
                  : totalLines > maxLines * 0.9
                    ? "text-[#c49a6c]"
                    : "text-[#3d5a4c]"
                }`}>
                {totalLines} / {maxLines}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-[#3d5a4c]/10 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${totalLines > maxLines
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : totalLines > maxLines * 0.9
                      ? "bg-gradient-to-r from-[#c49a6c] to-[#b8864f]"
                      : "bg-gradient-to-r from-[#3d5a4c] to-[#2d4a3c]"
                  }`}
                style={{ width: `${Math.min(lineProgress, 100)}%` }}
              />
              {totalLines > maxLines && (
                <div
                  className="absolute top-0 left-0 h-full bg-red-600/20 animate-pulse"
                  style={{ width: "100%" }}
                />
              )}
            </div>

            {totalLines > maxLines && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                ⚠ 최대 줄 수를 초과했습니다 (3페이지 = 66줄)
              </p>
            )}
            {totalLines > maxLines * 0.9 && totalLines <= maxLines && (
              <p className="text-xs text-[#c49a6c] mt-2">
                거의 다 찼습니다 ({maxLines - totalLines}줄 남음)
              </p>
            )}
          </div>

          {/* Cell Count (approximate) */}
          <div className="pt-3 border-t border-[#3d5a4c]/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">예상 칸 수</span>
              <span className="text-sm font-medium text-foreground/80">
                약 {totalCells.toLocaleString()}칸
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Status */}
      <Card className={`border-2 transition-all duration-300 shadow-sm ${!document
          ? "border-[#3d5a4c]/10 bg-[#fcfaf7] dark:bg-zinc-900 dark:border-zinc-800"
          : isValid
            ? "border-[#3d5a4c]/30 bg-gradient-to-br from-[#3d5a4c]/5 to-[#3d5a4c]/10 dark:from-[#3d5a4c]/20 dark:to-[#3d5a4c]/10 dark:border-[#3d5a4c]/50"
            : "border-red-500/30 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 dark:border-red-500/50"
        }`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-[#3d5a4c]" />
                <span className="text-[#3d5a4c]">검증 통과</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600">검증 실패</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                오류 ({errors.length})
              </p>
              <ul className="space-y-1.5">
                {errors.map((error, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1.5 leading-relaxed"
                  >
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#c49a6c] flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                경고 ({warnings.length})
              </p>
              <ul className="space-y-1.5">
                {warnings.map((warning, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#a67c50] bg-[#c49a6c]/10 border border-[#c49a6c]/30 rounded px-2 py-1.5 leading-relaxed"
                  >
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success State */}
          {isValid && errors.length === 0 && (
            <div className="text-center py-3">
              <CheckCircle2 className="h-8 w-8 text-[#3d5a4c] mx-auto mb-2 animate-in zoom-in duration-300" />
              <p className="text-xs text-[#3d5a4c] font-medium">
                답안지 규격에 맞습니다
              </p>
              {warnings.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  저장 가능합니다
                </p>
              )}
            </div>
          )}

          {/* Empty State */}
          {!document && (
            <div className="text-center py-3">
              <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                내용을 작성해주세요
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-[#c49a6c]/20 bg-gradient-to-br from-[#c49a6c]/5 to-[#c49a6c]/10 dark:from-[#c49a6c]/20 dark:to-[#c49a6c]/10 dark:border-[#c49a6c]/30">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs font-semibold text-[#c49a6c] dark:text-amber-400 mb-2">📝 작성 팁</p>
          <ul className="text-xs text-foreground/70 space-y-1.5 leading-relaxed">
            <li>• <code className="text-[10px] bg-[#3d5a4c]/10 px-1 py-0.5 rounded">/table</code> - 표 삽입</li>
            <li>• <code className="text-[10px] bg-[#3d5a4c]/10 px-1 py-0.5 rounded">/draw</code> - 그림 삽입</li>
            <li>• 최대 3페이지(66줄)까지 작성 가능</li>
            <li>• 그림 블록은 기본 8줄 차지</li>
            <li>• 페이지 경계 넘는 블록은 경고 표시</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
