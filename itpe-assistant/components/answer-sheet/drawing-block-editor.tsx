"use client";

import { useState, useCallback } from "react";
import type { DrawingBlock, ExcalidrawData } from "@/lib/types/answer-sheet-block";
import dynamic from "next/dynamic";
import { useAnswerSheetLayout } from "./answer-sheet-layout-context";

// Dynamically import Excalidraw with SSR disabled
const ExcalidrawWrapper = dynamic(
  () => import("./excalidraw-wrapper").then(mod => mod.ExcalidrawEditor),
  { ssr: false }
);

interface DrawingBlockEditorProps {
  block: DrawingBlock;
  editable?: boolean;
  onChange?: (data: ExcalidrawData) => void;
}

/**
 * Drawing Block Editor - Excalidraw 기반 편집 가능한 그림 블록
 */
export function DrawingBlockEditor({
  block,
  editable = false,
  onChange,
}: DrawingBlockEditorProps) {
  const { lineHeight } = useAnswerSheetLayout();
  const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData>(
    block.excalidrawData
  );

  const handleChange = useCallback((data: ExcalidrawData) => {
    setExcalidrawData(data);
    onChange?.(data);
  }, [onChange]);

  // Calculate height based on line count
  const lineCount = block.lineEnd - block.lineStart + 1;
  const height = lineCount * lineHeight;

  return (
    <div
      className="drawing-block-editor border border-border rounded"
      style={{ height: `${height}px`, minHeight: "200px" }}
    >
      <ExcalidrawWrapper
        initialData={excalidrawData}
        onChange={handleChange}
        viewModeEnabled={!editable}
      />
    </div>
  );
}
