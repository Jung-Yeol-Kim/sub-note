"use client";

import { useEffect, useRef, useState } from "react";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import type { AnswerSheetBlock, LeftMarginItem } from "@/lib/types/answer-sheet-block";
import { LeftMarginRenderer } from "./left-margin-renderer";
import { AnswerSheetLayoutProvider } from "./answer-sheet-layout-context";

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
 * Multi-page answer sheet grid (up to 3 pages, 66 lines total)
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
  // Create array of all lines (66 lines for 3 pages)
  const lines = Array.from({ length: BLOCK_CONSTANTS.MAX_LINES }, (_, i) => i + 1);

  // Helper: Check if this line is the last line of a page
  const isPageEnd = (lineNum: number): boolean => {
    return lineNum % BLOCK_CONSTANTS.LINES_PER_PAGE === 0 && lineNum < BLOCK_CONSTANTS.MAX_LINES;
  };

  // Helper: Get page number for a line
  const getPageNumber = (lineNum: number): number => {
    return Math.ceil(lineNum / BLOCK_CONSTANTS.LINES_PER_PAGE);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutMetrics, setLayoutMetrics] = useState({ lineHeight: 0, totalHeight: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      // Use clientHeight to exclude borders, as the inner content area is what matters
      const height = containerRef.current.clientHeight;

      setLayoutMetrics({
        totalHeight: height,
        lineHeight: height / BLOCK_CONSTANTS.MAX_LINES
      });
    };

    updateMetrics();

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Find which block occupies each line
  const getBlockForLine = (lineNumber: number): AnswerSheetBlock | null => {
    return blocks.find(
      (block) => block.lineStart <= lineNumber && block.lineEnd >= lineNumber
    ) || null;
  };

  return (
    <AnswerSheetLayoutProvider value={layoutMetrics}>
      <div className="flex justify-center p-4 bg-background">
        {/* Multi-page container (3 pages = 3x A4 height) */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[210mm] border-2 border-border bg-card"
          style={{
            minHeight: 'calc(297mm * 3)', // 3 A4 pages vertically
          }}
        >
          <div className="flex h-full">
            {/* Line numbers column (optional) */}
            {showLineNumbers && (
              <div className="flex flex-col border-r-2 border-border" style={{ width: '40px' }}>
                {lines.map((lineNum) => {
                  const isLastLineOfPage = isPageEnd(lineNum);
                  return (
                    <div key={lineNum} style={{ flex: '1 1 0%' }}>
                      <div
                        className="h-full flex items-center justify-center text-xs text-muted-foreground border-b border-dashed border-border/50 last:border-b-0"
                      >
                        <span className="px-1">{lineNum}</span>
                      </div>
                      {/* Add spacing for page divider */}
                      {isLastLineOfPage && <div className="h-0" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Left margin column (문1), 답1), etc.) */}
            {showLeftMargin && (
              <div className="relative border-r-2 border-border" style={{ width: '90px' }}>
                {/* Grid overlay for left margin - 66 rows × 3 columns (1.5:1:1 ratio) */}
                <div className="h-full flex flex-col">
                  {lines.map((lineNum) => {
                    const isLastLineOfPage = isPageEnd(lineNum);
                    return (
                      <div key={lineNum} style={{ flex: '1 1 0%' }}>
                        <div
                          className="h-full grid border-b border-border/20 last:border-b-0"
                          style={{ gridTemplateColumns: '1.5fr 1fr 1fr' }}
                        >
                          <div className="border-r border-border/10" />
                          <div className="border-r border-border/10" />
                          <div />
                        </div>
                        {/* Add spacing for page divider */}
                        {isLastLineOfPage && <div className="h-0" />}
                      </div>
                    );
                  })}
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
              {/* Grid overlay - 66 rows × 20 columns */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full flex flex-col">
                  {lines.map((lineNum) => {
                    const block = getBlockForLine(lineNum);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const isBlockStart = block && block.lineStart === lineNum;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const isBlockEnd = block && block.lineEnd === lineNum;
                    const isLastLineOfPage = isPageEnd(lineNum);

                    return (
                      <div key={lineNum} style={{ flex: '1 1 0%' }}>
                        {/* Regular row */}
                        <div
                          className="h-full grid grid-cols-20 border-b border-border/15 last:border-b-0"
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

                        {/* Page divider after every 22 lines */}
                        {isLastLineOfPage && (
                          <div className="relative h-0 pointer-events-auto z-20">
                            {/* Divider line */}
                            <div className="absolute left-0 right-0 top-0 flex items-center">
                              <div className="flex-1 border-t-2 border-dashed border-[#3d5a4c]/40" />
                              <div className="px-3 py-1 bg-[#3d5a4c]/5 border border-[#3d5a4c]/30 rounded-full mx-2">
                                <span className="text-[10px] font-semibold text-[#3d5a4c] tracking-wider">
                                  {getPageNumber(lineNum)}페이지 끝 / {getPageNumber(lineNum + 1)}페이지 시작
                                </span>
                              </div>
                              <div className="flex-1 border-t-2 border-dashed border-[#3d5a4c]/40" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Content layer - blocks will be rendered here */}
              <div className="absolute inset-0 z-10">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnswerSheetLayoutProvider>
  );
}
