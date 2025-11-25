"use client";

import { useEffect, useRef, useState } from "react";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import type { TextBlock } from "@/lib/types/answer-sheet-block";

interface TextBlockRendererProps {
  block: TextBlock;
  editable?: boolean;
  onChange?: (lines: string[]) => void;
}

/**
 * Renders a text block with natural, fluid layout
 * Uses 20-column grid as a guide but doesn't strictly enforce it
 * Provides a more handwritten, natural feel
 */
export function TextBlockRenderer({ block, editable = false, onChange }: TextBlockRendererProps) {
  const { lines, lineStart } = block;
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState<number>(0);

  // Measure container dimensions
  useEffect(() => {
    const updateMeasurements = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const containerHeight = parent.offsetHeight;
          const calculatedLineHeight = containerHeight / BLOCK_CONSTANTS.MAX_LINES;
          setLineHeight(calculatedLineHeight);
        }
      }
    };

    updateMeasurements();

    // Update on window resize
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  // Calculate positioning within the grid
  const topPosition = lineHeight * (lineStart - 1);

  const handleLineChange = (lineIndex: number, newContent: string) => {
    if (!onChange) return;
    const newLines = [...lines];
    newLines[lineIndex] = newContent;
    onChange(newLines);
  };

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 px-1"
      style={{
        top: `${topPosition}px`,
      }}
    >
      {lines.map((lineContent, lineIndex) => (
        <div
          key={`text-line-${lineStart + lineIndex}`}
          className="flex items-center"
          style={{
            height: `${lineHeight}px`,
            fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
            fontSize: `${lineHeight * 0.55}px`,
            letterSpacing: '0.02em',
            lineHeight: `${lineHeight * 0.85}px`,
          }}
        >
          {editable ? (
            <input
              type="text"
              value={lineContent}
              onChange={(e) => handleLineChange(lineIndex, e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none focus:bg-accent/5"
              style={{
                fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
                fontSize: `${lineHeight * 0.55}px`,
                letterSpacing: '0.02em',
                lineHeight: `${lineHeight * 0.85}px`,
              }}
            />
          ) : (
            lineContent
          )}
        </div>
      ))}
    </div>
  );
}
