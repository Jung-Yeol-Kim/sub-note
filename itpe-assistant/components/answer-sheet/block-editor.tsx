"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  FileText,
  Table,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  type AnswerSheetDocument,
  type AnswerSheetBlock,
  type TextBlock,
  type TableBlock,
  createTextBlock,
  createTableBlock,
  validateDocument,
  BLOCK_CONSTANTS,
} from "@/lib/types/answer-sheet-block";
import { AnswerSheetGrid } from "./answer-sheet-grid";
import { TextBlockRenderer } from "./text-block-renderer";
import { TableBlockRenderer } from "./table-block-renderer";

interface BlockEditorProps {
  initialDocument?: AnswerSheetDocument;
  onChange?: (document: AnswerSheetDocument) => void;
}

/**
 * Block-based answer sheet editor
 * Allows adding, editing, deleting, and reordering blocks
 */
export function BlockEditor({ initialDocument, onChange }: BlockEditorProps) {
  const [document, setDocument] = useState<AnswerSheetDocument>(
    initialDocument || {
      blocks: [],
      totalLines: 0,
      metadata: {
        isValid: true,
        validationErrors: [],
        validationWarnings: [],
      },
    }
  );

  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const updateDocument = (newBlocks: AnswerSheetBlock[]) => {
    // Recalculate line positions
    let currentLine = 1;
    const updatedBlocks = newBlocks.map((block) => {
      const blockLineCount =
        block.type === "text"
          ? block.lines.length
          : 1 + block.rows.length; // header + rows

      const updatedBlock = {
        ...block,
        lineStart: currentLine,
        lineEnd: currentLine + blockLineCount - 1,
      };

      currentLine = updatedBlock.lineEnd + 1;
      return updatedBlock;
    });

    const totalLines =
      updatedBlocks.length > 0
        ? Math.max(...updatedBlocks.map((b) => b.lineEnd))
        : 0;

    const validation = validateDocument({
      blocks: updatedBlocks,
      totalLines,
      metadata: {
        isValid: false,
        validationErrors: [],
        validationWarnings: [],
      },
    });

    const newDoc: AnswerSheetDocument = {
      blocks: updatedBlocks,
      totalLines,
      metadata: {
        isValid: validation.isValid,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings,
      },
    };

    setDocument(newDoc);
    onChange?.(newDoc);
  };

  const addTextBlock = () => {
    const newBlock = createTextBlock(["새 텍스트 줄"], 1);
    updateDocument([...document.blocks, newBlock]);
    setEditingBlockId(newBlock.id);
  };

  const addTableBlock = () => {
    const newBlock = createTableBlock(
      ["구분", "항목", "설명"],
      [
        ["항목1", "내용1", "설명1"],
        ["항목2", "내용2", "설명2"],
      ],
      [6, 6, 7], // Column widths (total = 19)
      1
    );
    updateDocument([...document.blocks, newBlock]);
    setEditingBlockId(newBlock.id);
  };

  const deleteBlock = (blockId: string) => {
    updateDocument(document.blocks.filter((b) => b.id !== blockId));
    setEditingBlockId(null);
  };

  const moveBlockUp = (blockId: string) => {
    const index = document.blocks.findIndex((b) => b.id === blockId);
    if (index > 0) {
      const newBlocks = [...document.blocks];
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
      updateDocument(newBlocks);
    }
  };

  const moveBlockDown = (blockId: string) => {
    const index = document.blocks.findIndex((b) => b.id === blockId);
    if (index < document.blocks.length - 1) {
      const newBlocks = [...document.blocks];
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
      updateDocument(newBlocks);
    }
  };

  const updateTextBlock = (blockId: string, lines: string[]) => {
    const newBlocks = document.blocks.map((b) =>
      b.id === blockId && b.type === "text"
        ? { ...b, lines }
        : b
    );
    updateDocument(newBlocks);
  };

  const updateTableBlock = (
    blockId: string,
    headers: string[],
    rows: string[][],
    columnWidths: number[]
  ) => {
    const newBlocks = document.blocks.map((b) =>
      b.id === blockId && b.type === "table"
        ? { ...b, headers, rows, columnWidths }
        : b
    );
    updateDocument(newBlocks);
  };

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      {document.metadata.validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">검증 오류:</div>
            <ul className="list-disc list-inside space-y-1">
              {document.metadata.validationErrors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              답안지 편집
            </span>
            <Badge
              variant={document.metadata.isValid ? "outline" : "destructive"}
              className={document.metadata.isValid ? "text-green-600" : ""}
            >
              {document.metadata.isValid ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  규격 준수
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  규격 초과
                </>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm">
            <span>총 블록: {document.blocks.length}개</span>
            <span>
              총 줄 수: {document.totalLines} / {BLOCK_CONSTANTS.MAX_LINES}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add Block Buttons */}
      <div className="flex gap-2">
        <Button onClick={addTextBlock} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          텍스트 블록 추가
        </Button>
        <Button onClick={addTableBlock} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          표 블록 추가
        </Button>
      </div>

      {/* Block List */}
      <div className="space-y-4">
        {document.blocks.map((block, index) => (
          <Card key={block.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {block.type === "text" ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <Table className="h-4 w-4" />
                  )}
                  <Badge variant="outline">
                    {block.type === "text" ? "텍스트" : "표"}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    줄 {block.lineStart}~{block.lineEnd}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveBlockUp(block.id)}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveBlockDown(block.id)}
                    disabled={index === document.blocks.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteBlock(block.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingBlockId === block.id ? (
                <BlockEditForm
                  block={block}
                  onSave={(updatedBlock) => {
                    if (updatedBlock.type === "text") {
                      updateTextBlock(updatedBlock.id, updatedBlock.lines);
                    } else {
                      updateTableBlock(
                        updatedBlock.id,
                        updatedBlock.headers,
                        updatedBlock.rows,
                        updatedBlock.columnWidths
                      );
                    }
                    setEditingBlockId(null);
                  }}
                  onCancel={() => setEditingBlockId(null)}
                />
              ) : (
                <div
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => setEditingBlockId(block.id)}
                >
                  <BlockPreview block={block} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Preview */}
      {document.blocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <AnswerSheetGrid blocks={document.blocks} showLineNumbers={true}>
              {document.blocks.map((block) =>
                block.type === "text" ? (
                  <TextBlockRenderer key={block.id} block={block} />
                ) : (
                  <TableBlockRenderer key={block.id} block={block} />
                )
              )}
            </AnswerSheetGrid>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Block Preview Component
function BlockPreview({ block }: { block: AnswerSheetBlock }) {
  if (block.type === "text") {
    return (
      <div className="font-mono text-sm whitespace-pre-wrap">
        {block.lines.join("\n")}
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="font-semibold mb-2">
        {block.headers.join(" | ")}
      </div>
      {block.rows.slice(0, 3).map((row, i) => (
        <div key={i} className="text-gray-600">
          {row.join(" | ")}
        </div>
      ))}
      {block.rows.length > 3 && (
        <div className="text-gray-400 text-xs mt-1">
          ... 외 {block.rows.length - 3}개 행
        </div>
      )}
    </div>
  );
}

// Block Edit Form Component
function BlockEditForm({
  block,
  onSave,
  onCancel,
}: {
  block: AnswerSheetBlock;
  onSave: (block: AnswerSheetBlock) => void;
  onCancel: () => void;
}) {
  const [editedBlock, setEditedBlock] = useState(block);

  if (editedBlock.type === "text") {
    return (
      <div className="space-y-2">
        <Textarea
          value={editedBlock.lines.join("\n")}
          onChange={(e) =>
            setEditedBlock({
              ...editedBlock,
              lines: e.target.value.split("\n"),
            })
          }
          className="font-mono"
          rows={5}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onSave(editedBlock)}>
            저장
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">헤더 (쉼표로 구분)</label>
        <Input
          value={editedBlock.headers.join(", ")}
          onChange={(e) =>
            setEditedBlock({
              ...editedBlock,
              headers: e.target.value.split(",").map((h) => h.trim()),
            })
          }
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          데이터 (각 행은 새 줄, 셀은 쉼표로 구분)
        </label>
        <Textarea
          value={editedBlock.rows.map((row) => row.join(", ")).join("\n")}
          onChange={(e) =>
            setEditedBlock({
              ...editedBlock,
              rows: e.target.value
                .split("\n")
                .map((line) => line.split(",").map((c) => c.trim())),
            })
          }
          rows={5}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          열 너비 (쉼표로 구분, 합계 ≤ 19)
        </label>
        <Input
          value={editedBlock.columnWidths.join(", ")}
          onChange={(e) =>
            setEditedBlock({
              ...editedBlock,
              columnWidths: e.target.value
                .split(",")
                .map((w) => parseInt(w.trim()) || 1),
            })
          }
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(editedBlock)}>
          저장
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}
