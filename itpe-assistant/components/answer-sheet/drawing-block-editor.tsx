"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { DrawingBlock, ExcalidrawData } from "@/lib/types/answer-sheet-block";
import dynamic from "next/dynamic";
import { useAnswerSheetLayout } from "./answer-sheet-layout-context";

// Dynamically import Excalidraw with SSR disabled
const ExcalidrawWrapper = dynamic(
  () => import("./excalidraw-wrapper").then(mod => mod.ExcalidrawEditor),
  { ssr: false }
);

import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawingBlockEditorProps {
  block: DrawingBlock;
  onChange?: (data: ExcalidrawData) => void;
  onHeightChange?: (lines: number) => void;
  onDelete?: () => void;
}

/**
 * Drawing Block Editor - Excalidraw 기반 편집 가능한 그림 블록
 */
export function DrawingBlockEditor({
  block,
  onChange,
  onHeightChange,
  onDelete,
}: DrawingBlockEditorProps) {
  const { lineHeight } = useAnswerSheetLayout();
  const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData>(
    block.excalidrawData
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((data: ExcalidrawData) => {
    setExcalidrawData(data);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange?.(data);
    }, 500);
  }, [onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate positioning within the grid
  const topPosition = lineHeight * (block.lineStart - 1);
  const lineCount = block.lineEnd - block.lineStart + 1;
  const height = lineCount * lineHeight;

  return (
    <div
      className="absolute left-0 right-0 px-1 group/block pointer-events-auto"
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
        minHeight: "200px"
      }}
    >
      {/* Delete Button */}
      {/* Controls */}
      {/* Controls */}
      <div className="absolute -right-10 top-0 flex flex-col gap-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-50">
        {onHeightChange && (
          <div className="flex flex-col items-center bg-white border rounded-md shadow-sm overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-8 rounded-none border-b hover:bg-muted"
              onClick={() => onHeightChange(Math.min(30, lineCount + 1))}
              disabled={lineCount >= 30}
              title="높이 증가"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <div className="text-xs font-medium py-1 px-2 select-none bg-muted/20 w-full text-center h-6 flex items-center justify-center">
              {lineCount}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-8 rounded-none border-t hover:bg-muted"
              onClick={() => onHeightChange(Math.max(4, lineCount - 1))}
              disabled={lineCount <= 4}
              title="높이 감소"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        )}

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white border shadow-sm text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
            onClick={onDelete}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ExcalidrawWrapper
        initialData={excalidrawData}
        onChange={handleChange}
        viewModeEnabled={false}
      />
    </div>
  );
}
