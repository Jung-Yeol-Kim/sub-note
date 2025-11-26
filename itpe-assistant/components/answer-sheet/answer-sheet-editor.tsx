"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  type AnswerSheetDocument,
  type AnswerSheetBlock,
  type LeftMarginItem,
  type BlockType,
  createTextBlock,
  createTableBlock,
  createDrawingBlock,
  validateDocument,
  BLOCK_CONSTANTS,
} from "@/lib/types/answer-sheet-block";
import { AnswerSheetGrid } from "./answer-sheet-grid";
import { TextBlockRenderer } from "./text-block-renderer";
import { TableBlockRenderer } from "./table-block-renderer";
import { DrawingBlockEditor } from "./drawing-block-editor";
import { BlockInsertButton } from "./block-insert-button";

interface AnswerSheetEditorProps {
  initialDocument?: AnswerSheetDocument;
  onChange?: (document: AnswerSheetDocument) => void;
}

/**
 * AnswerSheetGrid + editable renderers를 사용하는 에디터
 */
export function AnswerSheetEditor({
  initialDocument,
  onChange,
}: AnswerSheetEditorProps) {
  // 초기 document 설정: 없으면 빈 TextBlock 하나로 시작
  const getInitialDocument = (): AnswerSheetDocument => {
    if (initialDocument) return initialDocument;

    return {
      blocks: [createTextBlock(Array(22).fill(""), 1)],
      leftMargin: [],
      totalLines: 22,
      metadata: {
        isValid: true,
        validationErrors: [],
        validationWarnings: [],
      },
    };
  };

  const [document, setDocument] = useState<AnswerSheetDocument>(getInitialDocument());

  const updateDocument = (updates: Partial<AnswerSheetDocument>) => {
    const newDoc = { ...document, ...updates };

    // Recalculate totalLines
    const totalLines = newDoc.blocks.length > 0
      ? Math.max(...newDoc.blocks.map((b) => b.lineEnd))
      : 0;
    newDoc.totalLines = totalLines;

    // Validate
    const validation = validateDocument(newDoc);
    newDoc.metadata = {
      isValid: validation.isValid,
      validationErrors: validation.errors,
      validationWarnings: validation.warnings,
    };

    setDocument(newDoc);
    onChange?.(newDoc);
  };

  const handleTextBlockChange = (blockId: string, lines: string[]) => {
    const newBlocks = document.blocks.map((block) => {
      if (block.id === blockId && block.type === "text") {
        return {
          ...block,
          lines,
          lineEnd: block.lineStart + lines.length - 1,
        };
      }
      return block;
    });
    updateDocument({ blocks: newBlocks });
  };

  const handleTableBlockChange = (blockId: string, headers: string[], rows: string[][]) => {
    const newBlocks = document.blocks.map((block) => {
      if (block.id === blockId && block.type === "table") {
        return {
          ...block,
          headers,
          rows,
          lineEnd: block.lineStart + rows.length,
        };
      }
      return block;
    });
    updateDocument({ blocks: newBlocks });
  };

  const handleDrawingBlockChange = (blockId: string, excalidrawData: any) => {
    const newBlocks = document.blocks.map((block) => {
      if (block.id === blockId && block.type === "drawing") {
        return {
          ...block,
          excalidrawData,
        };
      }
      return block;
    });
    updateDocument({ blocks: newBlocks });
  };

  const handleLeftMarginChange = (items: LeftMarginItem[]) => {
    updateDocument({ leftMargin: items });
  };

  /**
   * Insert a new block at a specific position and recalculate line numbers
   */
  const handleInsertBlockAt = (insertAfterLine: number, newBlock: AnswerSheetBlock) => {
    const insertIndex = document.blocks.findIndex(
      (block) => block.lineEnd >= insertAfterLine
    );

    // If no block found, append to the end
    if (insertIndex === -1) {
      const lineStart = document.totalLines + 1;
      const adjustedBlock = {
        ...newBlock,
        lineStart,
        lineEnd: lineStart + (newBlock.lineEnd - newBlock.lineStart),
      };
      updateDocument({ blocks: [...document.blocks, adjustedBlock] });
      return;
    }

    // Insert after the found block
    const newBlocks = [...document.blocks];
    const insertAfterBlock = newBlocks[insertIndex];

    // Set new block's line position right after the insert point
    const lineStart = insertAfterBlock.lineEnd + 1;
    const blockHeight = newBlock.lineEnd - newBlock.lineStart;
    const adjustedNewBlock = {
      ...newBlock,
      lineStart,
      lineEnd: lineStart + blockHeight,
    };

    // Insert the new block
    newBlocks.splice(insertIndex + 1, 0, adjustedNewBlock);

    // Recalculate line positions for all blocks after the inserted one
    for (let i = insertIndex + 2; i < newBlocks.length; i++) {
      const prevBlock = newBlocks[i - 1];
      const currentBlock = newBlocks[i];
      const currentHeight = currentBlock.lineEnd - currentBlock.lineStart;

      newBlocks[i] = {
        ...currentBlock,
        lineStart: prevBlock.lineEnd + 1,
        lineEnd: prevBlock.lineEnd + 1 + currentHeight,
      };
    }

    updateDocument({ blocks: newBlocks });
  };

  const getAvailableLines = () => {
    return BLOCK_CONSTANTS.MAX_LINES - document.totalLines;
  };

  /**
   * Convert a text block to a different block type (triggered by slash commands)
   */
  const handleConvertBlock = (blockId: string, newBlockType: BlockType) => {
    const blockIndex = document.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const oldBlock = document.blocks[blockIndex];
    let newBlock: AnswerSheetBlock;

    // Create new block based on type
    if (newBlockType === "text") {
      // Already a text block, do nothing
      return;
    } else if (newBlockType === "table") {
      // Create a 3x3 table as default
      const headers = ["항목", "내용", "비고"];
      const rows = Array(2).fill(null).map(() => ["", "", ""]);
      const columnWidths = [6, 8, 5];
      newBlock = createTableBlock(headers, rows, columnWidths, oldBlock.lineStart);
    } else {
      // drawing
      newBlock = createDrawingBlock(8, oldBlock.lineStart);
    }

    // Replace the block
    const newBlocks = [...document.blocks];
    newBlocks[blockIndex] = newBlock;

    // Recalculate positions for blocks after this one
    for (let i = blockIndex + 1; i < newBlocks.length; i++) {
      const prevBlock = newBlocks[i - 1];
      const currentBlock = newBlocks[i];
      const currentHeight = currentBlock.lineEnd - currentBlock.lineStart;

      newBlocks[i] = {
        ...currentBlock,
        lineStart: prevBlock.lineEnd + 1,
        lineEnd: prevBlock.lineEnd + 1 + currentHeight,
      };
    }

    updateDocument({ blocks: newBlocks });
  };

  return (
    <div className="space-y-4">
      {/* Answer Sheet with Editable Renderers */}
      <Card className="max-w-full overflow-x-auto">
        <AnswerSheetGrid
          blocks={document.blocks}
          showLineNumbers={false}
          leftMargin={document.leftMargin}
          leftMarginEditable={true}
          onLeftMarginChange={handleLeftMarginChange}
        >
          {/* Insert button at the very top */}
          {document.blocks.length === 0 && (
            <div className="py-8">
              <BlockInsertButton
                onInsertBlock={(block) => handleInsertBlockAt(0, block)}
                position="above"
                currentLine={0}
                availableLines={BLOCK_CONSTANTS.MAX_LINES}
              />
            </div>
          )}

          {document.blocks.map((block, index) => {
            const isLastBlock = index === document.blocks.length - 1;
            const hasSpaceForMoreBlocks = document.totalLines < BLOCK_CONSTANTS.MAX_LINES;

            return (
              <div key={block.id} className="relative">
                {/* Block content */}
                {block.type === "text" && (
                  <TextBlockRenderer
                    block={block}
                    editable={true}
                    onChange={(lines) => handleTextBlockChange(block.id, lines)}
                    onConvertToBlock={(blockType) => handleConvertBlock(block.id, blockType)}
                  />
                )}
                {block.type === "table" && (
                  <TableBlockRenderer
                    block={block}
                    editable={true}
                    onChange={(headers, rows) => handleTableBlockChange(block.id, headers, rows)}
                  />
                )}
                {block.type === "drawing" && (
                  <DrawingBlockEditor
                    block={block}
                    editable={true}
                    onChange={(data) => handleDrawingBlockChange(block.id, data)}
                  />
                )}

                {/* Insert button below this block */}
                {isLastBlock && hasSpaceForMoreBlocks && (
                  <BlockInsertButton
                    onInsertBlock={(newBlock) => handleInsertBlockAt(block.lineEnd, newBlock)}
                    position="below"
                    currentLine={block.lineEnd}
                    availableLines={getAvailableLines()}
                  />
                )}
              </div>
            );
          })}
        </AnswerSheetGrid>
      </Card>
    </div>
  );
}
