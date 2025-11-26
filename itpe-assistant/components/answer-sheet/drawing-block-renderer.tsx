"use client";

import type { DrawingBlock } from "@/lib/types/answer-sheet-block";
import dynamic from "next/dynamic";
import { useAnswerSheetLayout } from "./answer-sheet-layout-context";

// Dynamically import Excalidraw with SSR disabled
const ExcalidrawWrapper = dynamic(
  () => import("./excalidraw-wrapper").then(mod => mod.ExcalidrawViewer),
  { ssr: false }
);

interface DrawingBlockRendererProps {
  block: DrawingBlock;
}

/**
 * Drawing Block Renderer - Excalidraw 읽기 전용 렌더러
 */
export function DrawingBlockRenderer({ block }: DrawingBlockRendererProps) {
  const { lineHeight } = useAnswerSheetLayout();

  // Calculate height based on line count
  const lineCount = block.lineEnd - block.lineStart + 1;
  const height = lineCount * lineHeight;

  return (
    <div
      className="drawing-block-renderer border border-border rounded bg-white pointer-events-none"
      style={{ height: `${height}px`, minHeight: "200px" }}
    >
      <ExcalidrawWrapper initialData={block.excalidrawData} />
    </div>
  );
}
