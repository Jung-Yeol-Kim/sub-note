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
import {
  FileText,
  Table2,
  PenTool,
  ChevronRight,
} from "lucide-react";
import {
  type AnswerSheetBlock,
  type BlockType,
  createTextBlock,
  createTableBlock,
  createDrawingBlock,
} from "@/lib/types/answer-sheet-block";

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
  defaultLines?: number;
};

const blockOptions: BlockOption[] = [
  {
    type: "text",
    icon: <FileText className="h-4 w-4" />,
    label: "텍스트",
    description: "일반 텍스트 블록",
    defaultLines: 3,
  },
  {
    type: "table",
    icon: <Table2 className="h-4 w-4" />,
    label: "표",
    description: "표 형식 블록",
  },
  {
    type: "drawing",
    icon: <PenTool className="h-4 w-4" />,
    label: "그림",
    description: "다이어그램/흐름도",
    defaultLines: 8,
  },
];

/**
 * Block Type Popover - Quick block type selection
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

  // Text settings
  const [textLineCount, setTextLineCount] = useState(3);

  // Table settings
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Drawing settings
  const [drawingLineCount, setDrawingLineCount] = useState(8);

  const handleQuickInsert = (type: BlockType) => {
    const lineStart = currentLine + 1;
    let newBlock: AnswerSheetBlock;

    if (type === "text") {
      const emptyLines = Array(3).fill("");
      newBlock = createTextBlock(emptyLines, lineStart);
    } else if (type === "table") {
      const headers = ["항목", "내용", "비고"];
      const rows = Array(2).fill(null).map(() => ["", "", ""]);
      const columnWidths = [6, 8, 5];
      newBlock = createTableBlock(headers, rows, columnWidths, lineStart);
    } else {
      newBlock = createDrawingBlock(8, lineStart);
    }

    onInsertBlock(newBlock);
    setSelectedType(null);
  };

  const handleCustomInsert = () => {
    const lineStart = currentLine + 1;
    let newBlock: AnswerSheetBlock;

    if (selectedType === "text") {
      const emptyLines = Array(textLineCount).fill("");
      newBlock = createTextBlock(emptyLines, lineStart);
    } else if (selectedType === "table") {
      const headers = Array(tableCols).fill("헤더");
      const rows = Array(tableRows).fill(null).map(() => Array(tableCols).fill(""));
      const columnWidths = Array(tableCols).fill(Math.floor(19 / tableCols));
      newBlock = createTableBlock(headers, rows, columnWidths, lineStart);
    } else {
      newBlock = createDrawingBlock(drawingLineCount, lineStart);
    }

    onInsertBlock(newBlock);
    setSelectedType(null);
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
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                블록 추가
              </p>
            </div>
            {blockOptions.map((option) => (
              <div key={option.type}>
                <button
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left group"
                  onClick={() => handleQuickInsert(option.type)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedType(option.type);
                  }}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded border bg-background">
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            ))}
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
                onClick={() => setSelectedType(null)}
                className="h-8 px-2"
              >
                ← 뒤로
              </Button>
              <div className="flex-1 font-medium text-sm">
                {blockOptions.find((o) => o.type === selectedType)?.label} 설정
              </div>
            </div>

            <Separator />

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
                  onChange={(e) => setTextLineCount(parseInt(e.target.value) || 1)}
                  className="h-8"
                />
                <p className="text-xs text-muted-foreground">
                  최대: {availableLines}줄
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
                      max={20}
                      value={tableRows}
                      onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
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
                      onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                      className="h-8"
                    />
                  </div>
                </div>
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
                  onChange={(e) => setDrawingLineCount(parseInt(e.target.value) || 3)}
                  className="h-8"
                />
                <p className="text-xs text-muted-foreground">
                  최대: {availableLines}줄
                </p>
              </div>
            )}

            <Separator />

            <div className="px-2">
              <Button
                className="w-full h-9"
                onClick={handleCustomInsert}
              >
                블록 추가
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
