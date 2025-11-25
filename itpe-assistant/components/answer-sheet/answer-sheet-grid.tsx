"use client";

import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import type { AnswerSheetBlock, LeftMarginItem } from "@/lib/types/answer-sheet-block";
import { LeftMarginRenderer } from "./left-margin-renderer";

interface AnswerSheetGridProps {
  blocks: AnswerSheetBlock[];
  showLineNumbers?: boolean;
  showLeftMargin?: boolean; // 왼쪽 목차 칸 표시 여부
  leftMargin?: LeftMarginItem[]; // 왼쪽 목차 데이터
  leftMarginEditable?: boolean; // 왼쪽 목차 편집 가능 여부
  onLeftMarginChange?: (items: LeftMarginItem[]) => void; // 왼쪽 목차 변경 콜백
  children?: React.ReactNode;
}

/**
 * 22 rows × 19 columns answer sheet grid
 * Foundation component for rendering ITPE exam answer sheets
 */
export function AnswerSheetGrid({
  blocks,
  showLineNumbers = false,
  showLeftMargin = true,
  leftMargin = [],
  leftMarginEditable = false,
  onLeftMarginChange,
  children,
}: AnswerSheetGridProps) {
  // Create array of 22 lines
  const lines = Array.from({ length: BLOCK_CONSTANTS.MAX_LINES }, (_, i) => i + 1);

  // Find which block occupies each line
  const getBlockForLine = (lineNumber: number): AnswerSheetBlock | null => {
    return blocks.find(
      (block) => block.lineStart <= lineNumber && block.lineEnd >= lineNumber
    ) || null;
  };

  return (
    <div className="flex justify-center p-4 bg-background">
      {/* A4 aspect ratio container */}
      <div className="relative w-full max-w-[210mm] aspect-[1/1.414] border-2 border-border bg-card">
        <div className="flex h-full">
          {/* Line numbers column (optional) */}
          {showLineNumbers && (
            <div className="flex flex-col border-r-2 border-border" style={{ width: '40px' }}>
              {lines.map((lineNum) => (
                <div
                  key={lineNum}
                  className="flex items-center justify-center text-xs text-muted-foreground border-b border-dashed border-border/50 last:border-b-0"
                  style={{ height: `calc(100% / ${BLOCK_CONSTANTS.MAX_LINES})` }}
                >
                  <span className="px-1">{lineNum}</span>
                </div>
              ))}
            </div>
          )}

          {/* Left margin column (문1), 답1), etc.) */}
          {showLeftMargin && (
            <div className="relative border-r-2 border-border" style={{ width: '90px' }}>
              {/* Grid overlay for left margin - 22 rows × 3 columns (1.5:1:1 ratio) */}
              <div className="h-full grid grid-rows-22">
                {lines.map((lineNum) => (
                  <div
                    key={lineNum}
                    className="grid border-b border-border/20 last:border-b-0"
                    style={{ gridTemplateColumns: '1.5fr 1fr 1fr' }}
                  >
                    <div className="border-r border-border/10" />
                    <div className="border-r border-border/10" />
                    <div />
                  </div>
                ))}
              </div>
              {/* Left margin content overlay */}
              <div className="absolute inset-0 z-10">
                <LeftMarginRenderer
                  items={leftMargin}
                  editable={leftMarginEditable}
                  onChange={onLeftMarginChange}
                />
              </div>
            </div>
          )}

          {/* Main content area with 20-column grid */}
          <div className="flex-1 relative">
            {/* Grid overlay - 22 rows × 20 columns */}
            <div className="absolute inset-0 grid grid-rows-22 pointer-events-none">
              {lines.map((lineNum) => {
                const block = getBlockForLine(lineNum);
                const isBlockStart = block && block.lineStart === lineNum;
                const isBlockEnd = block && block.lineEnd === lineNum;

                return (
                  <div
                    key={lineNum}
                    className="grid grid-cols-20 border-b border-border/15 last:border-b-0"
                  >
                    {Array.from({ length: BLOCK_CONSTANTS.MAX_CELLS_PER_LINE }).map(
                      (_, cellIndex) => (
                        <div
                          key={cellIndex}
                          className="border-r border-border/10 last:border-r-0"
                        />
                      )
                    )}
                  </div>
                );
              })}
            </div>

            {/* Content layer - blocks will be rendered here */}
            <div className="absolute inset-0 z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
