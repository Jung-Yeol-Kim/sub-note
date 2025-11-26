"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AnswerSheetBlock,
  type BlockType,
  createTextBlock,
  createTableBlock,
  createDrawingBlock,
} from "@/lib/types/answer-sheet-block";
import { FileText, Table2, PenTool, Plus } from "lucide-react";

interface BlockInserterDialogProps {
  onInsertBlock: (block: AnswerSheetBlock) => void;
  currentLineEnd: number; // Last occupied line (blocks will be inserted after this)
  children?: React.ReactNode;
}

/**
 * Block Inserter Dialog
 * 답안지에 새로운 블록을 추가하기 위한 다이얼로그
 */
export function BlockInserterDialog({
  onInsertBlock,
  currentLineEnd,
  children,
}: BlockInserterDialogProps) {
  const [open, setOpen] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("text");

  // Text block settings
  const [textLineCount, setTextLineCount] = useState(5);

  // Table block settings
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Drawing block settings
  const [drawingLineCount, setDrawingLineCount] = useState(8);

  const handleInsert = () => {
    const lineStart = currentLineEnd + 1;
    let newBlock: AnswerSheetBlock;

    if (blockType === "text") {
      const emptyLines = Array(textLineCount).fill("");
      newBlock = createTextBlock(emptyLines, lineStart);
    } else if (blockType === "table") {
      const headers = Array(tableCols).fill("헤더");
      const rows = Array(tableRows).fill(null).map(() => Array(tableCols).fill(""));
      const columnWidths = Array(tableCols).fill(Math.floor(19 / tableCols));
      newBlock = createTableBlock(headers, rows, columnWidths, lineStart);
    } else {
      // drawing
      newBlock = createDrawingBlock(drawingLineCount, lineStart);
    }

    onInsertBlock(newBlock);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            블록 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>블록 추가</DialogTitle>
          <DialogDescription>
            답안지에 추가할 블록 유형을 선택하고 설정하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Block Type Selection */}
          <div className="space-y-2">
            <Label>블록 유형</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={blockType === "text" ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setBlockType("text")}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">텍스트</span>
              </Button>
              <Button
                type="button"
                variant={blockType === "table" ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setBlockType("table")}
              >
                <Table2 className="h-6 w-6" />
                <span className="text-sm">표</span>
              </Button>
              <Button
                type="button"
                variant={blockType === "drawing" ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setBlockType("drawing")}
              >
                <PenTool className="h-6 w-6" />
                <span className="text-sm">그림</span>
              </Button>
            </div>
          </div>

          {/* Type-specific Settings */}
          {blockType === "text" && (
            <div className="space-y-2">
              <Label htmlFor="text-lines">줄 수</Label>
              <Input
                id="text-lines"
                type="number"
                min={1}
                max={22 - currentLineEnd}
                value={textLineCount}
                onChange={(e) => setTextLineCount(parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">
                텍스트 블록의 줄 수를 지정하세요 (최대: {22 - currentLineEnd}줄)
              </p>
            </div>
          )}

          {blockType === "table" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="table-rows">행 수</Label>
                  <Input
                    id="table-rows"
                    type="number"
                    min={1}
                    max={20}
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="table-cols">열 수</Label>
                  <Input
                    id="table-cols"
                    type="number"
                    min={1}
                    max={19}
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                표의 행과 열 수를 지정하세요. 나중에 편집할 수 있습니다.
              </p>
            </div>
          )}

          {blockType === "drawing" && (
            <div className="space-y-2">
              <Label htmlFor="drawing-lines">그림 영역 줄 수</Label>
              <Input
                id="drawing-lines"
                type="number"
                min={3}
                max={22 - currentLineEnd}
                value={drawingLineCount}
                onChange={(e) => setDrawingLineCount(parseInt(e.target.value) || 3)}
              />
              <p className="text-xs text-muted-foreground">
                그림을 그릴 영역의 높이를 줄 수로 지정하세요 (최대: {22 - currentLineEnd}줄)
              </p>
            </div>
          )}

          {/* Preview Info */}
          <div className="rounded-md bg-muted p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">시작 줄:</span>
              <span className="font-medium">{currentLineEnd + 1}줄</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">종료 줄:</span>
              <span className="font-medium">
                {blockType === "text"
                  ? currentLineEnd + textLineCount
                  : blockType === "table"
                  ? currentLineEnd + tableRows + 1
                  : currentLineEnd + drawingLineCount}
                줄
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleInsert}>블록 추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
