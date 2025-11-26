"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Table2,
  PenTool,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  type AnswerSheetBlock,
  type BlockType,
  createTextBlock,
  createTableBlock,
  createDrawingBlock,
} from "@/lib/types/answer-sheet-block";
import { cn } from "@/lib/utils";

interface BlockTypePopoverProps {
  onInsertBlock: (block: AnswerSheetBlock) => void;
  currentLine: number;
  availableLines: number;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type BlockOption = {
  type: BlockType;
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultLines: number;
  minLines: number; // Minimum viable size
};

const blockOptions: BlockOption[] = [
  {
    type: "text",
    icon: <FileText className="h-4 w-4" />,
    label: "텍스트",
    description: "일반 텍스트 블록",
    defaultLines: 3,
    minLines: 1,
  },
  {
    type: "table",
    icon: <Table2 className="h-4 w-4" />,
    label: "표",
    description: "표 형식 블록",
    defaultLines: 3, // header + 2 rows
    minLines: 2, // header + 1 row
  },
  {
    type: "drawing",
    icon: <PenTool className="h-4 w-4" />,
    label: "그림",
    description: "다이어그램/흐름도",
    defaultLines: 8,
    minLines: 3, // Minimum usable drawing space
  },
];

/**
 * Block Type Popover - Quick block type selection with smart size adjustment
 */
export function BlockTypePopover({
  onInsertBlock,
  currentLine,
  availableLines,
  children,
  open,
  onOpenChange,
}: BlockTypePopoverProps) {
  const [selectedType, setSelectedType] = useState<BlockType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Text settings
  const [textLineCount, setTextLineCount] = useState(3);

  // Table settings
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Drawing settings
  const [drawingLineCount, setDrawingLineCount] = useState(8);

  /**
   * Smart block insertion with automatic size adjustment
   */
  const handleQuickInsert = (type: BlockType) => {
    const option = blockOptions.find((o) => o.type === type)!;

    // Check if we have enough space
    if (availableLines < option.minLines) {
      setErrorMessage(
        `공간이 부족합니다. ${option.label} 블록은 최소 ${option.minLines}줄이 필요합니다. (남은 줄: ${availableLines})`
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    const lineStart = currentLine + 1;
    let newBlock: AnswerSheetBlock;

    // Adjust size to fit available space
    const adjustedSize = Math.min(option.defaultLines, availableLines);

    if (type === "text") {
      const emptyLines = Array(adjustedSize).fill("");
      newBlock = createTextBlock(emptyLines, lineStart);
    } else if (type === "table") {
      const headers = ["항목", "내용", "비고"];
      // Table takes (rows + 1) lines, so we need to calculate rows
      const maxRows = adjustedSize - 1; // -1 for header
      const rows = Array(Math.max(1, Math.min(2, maxRows)))
        .fill(null)
        .map(() => ["", "", ""]);
      const columnWidths = [6, 8, 5];
      newBlock = createTableBlock(headers, rows, columnWidths, lineStart);
    } else {
      // Drawing block with adjusted size
      newBlock = createDrawingBlock(adjustedSize, lineStart);
    }

    onInsertBlock(newBlock);
    setSelectedType(null);
    setErrorMessage(null);

    // Show a subtle notification if size was adjusted
    if (adjustedSize < option.defaultLines) {
      setErrorMessage(
        `ℹ️ 남은 공간에 맞춰 ${adjustedSize}줄로 조정되었습니다`
      );
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleCustomInsert = () => {
    const lineStart = currentLine + 1;
    let newBlock: AnswerSheetBlock;

    if (selectedType === "text") {
      if (textLineCount > availableLines) {
        setErrorMessage(`최대 ${availableLines}줄까지만 추가할 수 있습니다`);
        return;
      }
      const emptyLines = Array(textLineCount).fill("");
      newBlock = createTextBlock(emptyLines, lineStart);
    } else if (selectedType === "table") {
      const totalLines = tableRows + 1; // +1 for header
      if (totalLines > availableLines) {
        setErrorMessage(`최대 ${availableLines}줄까지만 추가할 수 있습니다`);
        return;
      }
      const headers = Array(tableCols).fill("헤더");
      const rows = Array(tableRows)
        .fill(null)
        .map(() => Array(tableCols).fill(""));
      const columnWidths = Array(tableCols).fill(Math.floor(19 / tableCols));
      newBlock = createTableBlock(headers, rows, columnWidths, lineStart);
    } else {
      if (drawingLineCount > availableLines) {
        setErrorMessage(`최대 ${availableLines}줄까지만 추가할 수 있습니다`);
        return;
      }
      newBlock = createDrawingBlock(drawingLineCount, lineStart);
    }

    onInsertBlock(newBlock);
    setSelectedType(null);
    setErrorMessage(null);
  };

  /**
   * Check if a block type can be inserted
   */
  const canInsert = (option: BlockOption) => {
    return availableLines >= option.minLines;
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-2"
        align="start"
        side="right"
        sideOffset={10}
      >
        {!selectedType ? (
          // Main menu - block type selection
          <div className="space-y-1">
            <div className="px-2 py-1.5 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                블록 추가
              </p>
              <Badge variant="outline" className="text-xs">
                {availableLines}줄 남음
              </Badge>
            </div>

            {/* Error/Info message */}
            {errorMessage && (
              <div
                className={cn(
                  "mx-2 px-3 py-2 rounded-md text-xs flex items-start gap-2",
                  errorMessage.startsWith("ℹ️")
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                )}
              >
                {!errorMessage.startsWith("ℹ️") && (
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                )}
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {blockOptions.map((option) => {
              const isAvailable = canInsert(option);
              const willAdjust =
                isAvailable && availableLines < option.defaultLines;
              const adjustedSize = Math.min(option.defaultLines, availableLines);

              return (
                <div key={option.type}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-left group",
                      isAvailable
                        ? "hover:bg-accent hover:text-accent-foreground"
                        : "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => isAvailable && handleQuickInsert(option.type)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (isAvailable) {
                        setSelectedType(option.type);
                      }
                    }}
                    disabled={!isAvailable}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded border bg-background",
                        !isAvailable && "opacity-50"
                      )}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {option.label}
                        {willAdjust ? (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-[#c49a6c]/10 text-[#c49a6c] border-[#c49a6c]/30"
                          >
                            {adjustedSize}줄로 조정
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {option.defaultLines}줄
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isAvailable
                          ? option.description
                          : `최소 ${option.minLines}줄 필요`}
                      </div>
                    </div>
                    {isAvailable && (
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                </div>
              );
            })}
            <Separator className="my-2" />
            <div className="px-2 py-1.5">
              <p className="text-xs text-muted-foreground">
                💡 우클릭하여 상세 설정
              </p>
            </div>
          </div>
        ) : (
          // Settings view
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedType(null);
                  setErrorMessage(null);
                }}
                className="h-8 px-2"
              >
                ← 뒤로
              </Button>
              <div className="flex-1 font-medium text-sm">
                {blockOptions.find((o) => o.type === selectedType)?.label} 설정
              </div>
            </div>

            <Separator />

            {/* Error message in settings view */}
            {errorMessage && (
              <div className="px-2">
                <div className="px-3 py-2 rounded-md text-xs bg-red-50 text-red-700 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              </div>
            )}

            {selectedType === "text" && (
              <div className="space-y-2 px-2">
                <Label htmlFor="text-lines" className="text-sm">
                  줄 수
                </Label>
                <Input
                  id="text-lines"
                  type="number"
                  min={1}
                  max={availableLines}
                  value={textLineCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setTextLineCount(Math.min(val, availableLines));
                    setErrorMessage(null);
                  }}
                  className="h-8"
                />
                <p className="text-xs text-muted-foreground">
                  사용 가능: {availableLines}줄
                </p>
              </div>
            )}

            {selectedType === "table" && (
              <div className="space-y-3 px-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="table-rows" className="text-sm">
                      행 수
                    </Label>
                    <Input
                      id="table-rows"
                      type="number"
                      min={1}
                      max={Math.max(1, availableLines - 1)}
                      value={tableRows}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setTableRows(Math.min(val, availableLines - 1));
                        setErrorMessage(null);
                      }}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="table-cols" className="text-sm">
                      열 수
                    </Label>
                    <Input
                      id="table-cols"
                      type="number"
                      min={1}
                      max={19}
                      value={tableCols}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setTableCols(val);
                        setErrorMessage(null);
                      }}
                      className="h-8"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  표는 {tableRows + 1}줄을 차지합니다 (헤더 포함)
                </p>
              </div>
            )}

            {selectedType === "drawing" && (
              <div className="space-y-2 px-2">
                <Label htmlFor="drawing-lines" className="text-sm">
                  그림 영역 높이
                </Label>
                <Input
                  id="drawing-lines"
                  type="number"
                  min={3}
                  max={availableLines}
                  value={drawingLineCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 3;
                    setDrawingLineCount(Math.min(val, availableLines));
                    setErrorMessage(null);
                  }}
                  className="h-8"
                />
                <p className="text-xs text-muted-foreground">
                  사용 가능: {availableLines}줄 (최소 3줄)
                </p>
              </div>
            )}

            <Separator />

            <div className="px-2">
              <Button className="w-full h-9" onClick={handleCustomInsert}>
                블록 추가
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
