"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawData } from "@/lib/types/answer-sheet-block";
import { useRef } from "react";
import { useTheme } from "next-themes";

import "@excalidraw/excalidraw/index.css";

interface ExcalidrawEditorProps {
  initialData?: ExcalidrawData;
  onChange?: (data: ExcalidrawData) => void;
  viewModeEnabled?: boolean;
}

/**
 * Excalidraw Editor Wrapper Component
 */
export function ExcalidrawEditor({
  initialData,
  onChange,
  viewModeEnabled = false,
}: ExcalidrawEditorProps) {
  const excalidrawRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const { resolvedTheme } = useTheme();

  // Handle changes
  const handleChange = (elements: readonly any[], appState: any, files: any) => {
    if (!onChange) return;

    const data: ExcalidrawData = {
      elements: elements as any[],
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        gridSize: appState.gridSize,
        zoom: appState.zoom,
        scrollX: appState.scrollX,
        scrollY: appState.scrollY,
      },
      files: files || {},
    };

    onChange(data);
  };

  return (
    <div style={{ height: "100%", width: "100%" }} className="excalidraw-editor-wrapper">
      <Excalidraw
        ref={excalidrawRef}
        initialData={initialData}
        onChange={handleChange}
        viewModeEnabled={viewModeEnabled}
        zenModeEnabled={false}
        gridModeEnabled={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        name="answer-sheet-drawing"
      />
    </div>
  );
}

/**
 * Excalidraw Viewer (Read-only)
 */
export function ExcalidrawViewer({ initialData }: { initialData: ExcalidrawData }) {
  const { resolvedTheme } = useTheme();

  return (
    <div style={{ height: "100%", width: "100%" }} className="excalidraw-viewer-wrapper">
      <Excalidraw
        initialData={initialData}
        viewModeEnabled={true}
        zenModeEnabled={true}
        gridModeEnabled={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: false,
            export: false,
            saveAsImage: false,
            changeViewBackgroundColor: false,
            clearCanvas: false,
            toggleTheme: false,
          }
        }}
      />
    </div>
  );
}
