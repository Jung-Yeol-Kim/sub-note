"use client";

import { useEffect, useRef, useState } from "react";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import type { TableBlock } from "@/lib/types/answer-sheet-block";

interface TableBlockRendererProps {
  block: TableBlock;
  editable?: boolean;
  onChange?: (headers: string[], rows: string[][]) => void;
}

/**
 * Renders a table block with natural, fluid layout
 * Column widths are proportional but not strictly enforced
 */
export function TableBlockRenderer({ block, editable = false, onChange }: TableBlockRendererProps) {
  const { headers, rows, columnWidths, lineStart, lineEnd } = block;
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
  const height = lineHeight * (lineEnd - lineStart + 1);

  // Create grid template columns based on columnWidths
  const gridTemplateColumns = columnWidths
    .map((width) => `${width}fr`)
    .join(" ");

  const handleHeaderChange = (index: number, value: string) => {
    if (!onChange) return;
    const newHeaders = [...headers];
    newHeaders[index] = value;
    onChange(newHeaders, rows);
  };

  const handleCellChange = (rowIndex: number, cellIndex: number, value: string) => {
    if (!onChange) return;
    const newRows = [...rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][cellIndex] = value;
    onChange(headers, newRows);
  };

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 px-1"
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
        fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header row */}
        <div
          className="grid border-b-2 border-border bg-muted/30"
          style={{ gridTemplateColumns }}
        >
          {headers.map((header, headerIndex) => (
            <div
              key={`header-${headerIndex}`}
              className="border-r border-border last:border-r-0 px-2 py-1 font-semibold flex items-center justify-center"
              style={{
                fontSize: `${lineHeight * 0.45}px`,
                lineHeight: `${lineHeight * 0.7}px`,
              }}
            >
              {editable ? (
                <input
                  type="text"
                  value={header}
                  onChange={(e) => handleHeaderChange(headerIndex, e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-center font-semibold"
                  style={{
                    fontSize: `${lineHeight * 0.45}px`,
                    lineHeight: `${lineHeight * 0.7}px`,
                  }}
                />
              ) : (
                header
              )}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid border-b border-border/50 last:border-b-2 last:border-border flex-1"
            style={{ gridTemplateColumns }}
          >
            {row.map((cell, cellIndex) => (
              <div
                key={`cell-${rowIndex}-${cellIndex}`}
                className="border-r border-border/50 last:border-r-0 px-2 py-1 flex items-center"
                style={{
                  fontSize: `${lineHeight * 0.42}px`,
                  lineHeight: `${lineHeight * 0.65}px`,
                }}
              >
                {editable ? (
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none"
                    style={{
                      fontSize: `${lineHeight * 0.42}px`,
                      lineHeight: `${lineHeight * 0.65}px`,
                    }}
                  />
                ) : (
                  cell
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
