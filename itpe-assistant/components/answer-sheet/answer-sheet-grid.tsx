"use client";

import { type AnswerSheetBlock } from "@/lib/types/answer-sheet-block";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";

interface AnswerSheetGridProps {
  blocks: AnswerSheetBlock[];
  showLineNumbers?: boolean;
  children?: React.ReactNode;
}

/**
 * 22 rows × 19 columns answer sheet grid
 * Foundation component for rendering ITPE exam answer sheets
 */
export function AnswerSheetGrid({
  blocks,
  showLineNumbers = true,
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
    <div className="flex justify-center p-4 bg-white">
      {/* A4 aspect ratio container */}
      <div className="relative w-full max-w-[210mm] aspect-[1/1.414] border-2 border-black bg-white">
        <div className="flex h-full">
          {/* Line numbers column */}
          {showLineNumbers && (
            <div className="flex flex-col border-r-2 border-black">
              {lines.map((lineNum) => (
                <div
                  key={lineNum}
                  className="flex items-center justify-center text-xs text-gray-500 border-b border-dashed border-gray-300 last:border-b-0"
                  style={{ height: `calc(100% / ${BLOCK_CONSTANTS.MAX_LINES})` }}
                >
                  <span className="px-2">{lineNum}</span>
                </div>
              ))}
            </div>
          )}

          {/* Main content area with 19-column grid */}
          <div className="flex-1 relative">
            {/* Grid overlay - 22 rows × 19 columns */}
            <div className="absolute inset-0 grid grid-rows-22 pointer-events-none">
              {lines.map((lineNum) => {
                const block = getBlockForLine(lineNum);
                const isBlockStart = block && block.lineStart === lineNum;
                const isBlockEnd = block && block.lineEnd === lineNum;

                return (
                  <div
                    key={lineNum}
                    className="grid grid-cols-19 border-b border-dashed border-gray-300 last:border-b-0"
                  >
                    {Array.from({ length: BLOCK_CONSTANTS.MAX_CELLS_PER_LINE }).map(
                      (_, cellIndex) => (
                        <div
                          key={cellIndex}
                          className="border-r border-gray-100 last:border-r-0"
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
