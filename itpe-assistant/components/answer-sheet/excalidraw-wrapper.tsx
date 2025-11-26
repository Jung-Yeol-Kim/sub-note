"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawData } from "@/lib/types/answer-sheet-block";
import { useRef, useEffect } from "react";

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

  // Handle changes
  const handleChange = (elements: readonly any[], appState: any, files: any) => {
    if (!onChange) return;

    const data: ExcalidrawData = {
      elements: elements as any[],
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        gridSize: appState.gridSize,
        zoom: appState.zoom,
      },
      files: files || {},
    };

    onChange(data);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Excalidraw
        ref={excalidrawRef}
        initialData={initialData}
        onChange={handleChange}
        viewModeEnabled={viewModeEnabled}
        zenModeEnabled={false}
        gridModeEnabled={true}
        theme="light"
        name="answer-sheet-drawing"
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
            saveAsImage: true,
            export: true,
          },
        }}
      />
    </div>
  );
}

/**
 * Excalidraw Viewer (Read-only)
 */
export function ExcalidrawViewer({ initialData }: { initialData: ExcalidrawData }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Excalidraw
        initialData={initialData}
        viewModeEnabled={true}
        zenModeEnabled={true}
        gridModeEnabled={false}
      />
    </div>
  );
}
