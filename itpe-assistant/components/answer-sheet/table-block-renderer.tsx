"use client";

import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import type { TableBlock } from "@/lib/types/answer-sheet-block";
import { useAnswerSheetLayout } from "./answer-sheet-layout-context";

import { Trash2, Plus, Minus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableBlockRendererProps {
  block: TableBlock;
  editable?: boolean;
  onChange?: (headers: string[], rows: string[][]) => void;
  onStructureChange?: (headers: string[], rows: string[][], columnWidths: number[]) => void;
  onDelete?: () => void;
}

/**
 * Renders a table block with natural, fluid layout
 * Column widths are proportional but not strictly enforced
 */
export function TableBlockRenderer({ block, editable = false, onChange, onStructureChange, onDelete }: TableBlockRendererProps) {
  const { headers, rows, columnWidths, lineStart, lineEnd } = block;
  const { lineHeight } = useAnswerSheetLayout();

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

  // --- Structure Management ---

  const handleAddRow = () => {
    if (!onStructureChange) return;
    const newRows = [...rows, Array(headers.length).fill("")];
    onStructureChange(headers, newRows, columnWidths);
  };

  const handleRemoveRow = () => {
    if (!onStructureChange || rows.length <= 1) return;
    const newRows = [...rows];
    newRows.pop();
    onStructureChange(headers, newRows, columnWidths);
  };

  const handleAddColumn = () => {
    if (!onStructureChange) return;
    const newHeaders = [...headers, "새 항목"];
    const newRows = rows.map(row => [...row, ""]);

    // Adjust column widths - simple logic: reduce last column and add new one
    // Or just append a default width and let grid handle it (but we need total 20 cols approx?)
    // Current logic uses 'fr' units based on columnWidths array.
    // Let's just add a default width of 4.
    const newColumnWidths = [...columnWidths, 4];

    onStructureChange(newHeaders, newRows, newColumnWidths);
  };

  const handleRemoveColumn = () => {
    if (!onStructureChange || headers.length <= 1) return;
    const newHeaders = [...headers];
    newHeaders.pop();
    const newRows = rows.map(row => {
      const newRow = [...row];
      newRow.pop();
      return newRow;
    });
    const newColumnWidths = [...columnWidths];
    newColumnWidths.pop();

    onStructureChange(newHeaders, newRows, newColumnWidths);
  };

  return (
    <div
      className="absolute left-0 right-0 px-1 group/block pointer-events-auto"
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
        fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
      }}
    >
      <div className="h-full flex flex-col relative">
        {/* Controls Toolbar (Visible on Hover) */}
        {editable && (
          <div className="absolute -right-8 top-0 flex flex-col gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-20">
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onDelete}
                title="표 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {onStructureChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    title="표 설정"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddRow}>
                    <Plus className="mr-2 h-4 w-4" /> 행 추가
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRemoveRow} disabled={rows.length <= 1}>
                    <Minus className="mr-2 h-4 w-4" /> 행 삭제
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddColumn}>
                    <Plus className="mr-2 h-4 w-4" /> 열 추가
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRemoveColumn} disabled={headers.length <= 1}>
                    <Minus className="mr-2 h-4 w-4" /> 열 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

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
