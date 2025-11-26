"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  type TextBlock,
  type TableBlock,
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
      blocks: [createTextBlock(Array(5).fill(""), 1)], // Start with a small text block
      leftMargin: [],
      totalLines: 5,
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
  /**
   * Delete a block and recalculate line numbers
   * Merges adjacent text blocks if possible
   */
  const handleDeleteBlock = (blockId: string) => {
    const blockIndex = document.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const blockToDelete = document.blocks[blockIndex];
    // const linesFreed = blockToDelete.lineEnd - blockToDelete.lineStart + 1; // Not strictly needed if we recalc everything

    // Remove the block
    const newBlocks = [...document.blocks];
    newBlocks.splice(blockIndex, 1);

    // If no blocks left, add an empty text block
    if (newBlocks.length === 0) {
      updateDocument({ blocks: [createTextBlock(Array(22).fill(""), 1)] });
      return;
    }

    // Check for adjacent text blocks to merge
    // We check the gap between blockIndex-1 and blockIndex (which was blockIndex+1 before splice)
    // Actually, after splice, newBlocks[blockIndex-1] and newBlocks[blockIndex] are now neighbors.

    if (blockIndex > 0 && blockIndex < newBlocks.length) {
      const prevBlock = newBlocks[blockIndex - 1];
      const nextBlock = newBlocks[blockIndex];

      if (prevBlock.type === "text" && nextBlock.type === "text") {
        // Merge them
        const mergedLines = [...(prevBlock as TextBlock).lines, ...(nextBlock as TextBlock).lines];
        const mergedBlock: TextBlock = {
          ...prevBlock as TextBlock,
          lines: mergedLines,
          lineEnd: prevBlock.lineStart + mergedLines.length - 1,
        };

        // Replace the two blocks with the merged one
        newBlocks.splice(blockIndex - 1, 2, mergedBlock);
      }
    }

    // Recalculate positions for ALL blocks to ensure consistency
    // We start from the first block (or the one after the merge point)
    // But to be safe and fix any "line mismatch", let's recalc from the beginning or the affected area.

    // If we merged, the affected index starts at blockIndex - 1.
    // If we didn't merge, it starts at blockIndex.
    // Let's just recalc everything from index 0 to be super safe, or at least from the first affected block.

    let currentLine = 1;
    for (let i = 0; i < newBlocks.length; i++) {
      const block = newBlocks[i];
      const height = block.lineEnd - block.lineStart + 1; // Keep existing height logic
      // Note: For text blocks, height is lines.length. For others, it's fixed or calculated.
      // We should trust the block's internal height logic, but we need to update lineStart.

      let newHeight = height;
      if (block.type === "text") {
        newHeight = (block as TextBlock).lines.length;
      } else if (block.type === "table") {
        // Table height depends on rows.
        // If we just deleted a block, table height shouldn't change, but its position should.
        newHeight = (block as TableBlock).rows.length + 1; // rows + header
      }

      newBlocks[i] = {
        ...block,
        lineStart: currentLine,
        lineEnd: currentLine + newHeight - 1,
      };

      currentLine += newHeight;
    }

    updateDocument({ blocks: newBlocks });
  };

  const handleTableStructureChange = (blockId: string, headers: string[], rows: string[][], columnWidths: number[]) => {
    const blockIndex = document.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const newBlocks = [...document.blocks];
    const oldBlock = newBlocks[blockIndex] as TableBlock;

    // Update the table block
    const newHeight = rows.length + 1; // rows + header
    newBlocks[blockIndex] = {
      ...oldBlock,
      headers,
      rows,
      columnWidths,
      lineEnd: oldBlock.lineStart + newHeight - 1,
    };

    // Recalculate positions for subsequent blocks
    let currentLine = newBlocks[blockIndex].lineEnd + 1;
    for (let i = blockIndex + 1; i < newBlocks.length; i++) {
      const block = newBlocks[i];
      const height = block.lineEnd - block.lineStart + 1;

      newBlocks[i] = {
        ...block,
        lineStart: currentLine,
        lineEnd: currentLine + height - 1,
      };
      currentLine += height;
    }

    updateDocument({ blocks: newBlocks });
  };

  const handleDrawingBlockHeightChange = (blockId: string, newLineCount: number) => {
    const blockIndex = document.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const newBlocks = [...document.blocks];
    const oldBlock = newBlocks[blockIndex];

    // Update the drawing block
    const newHeight = newLineCount; // Height in lines
    newBlocks[blockIndex] = {
      ...oldBlock,
      lineEnd: oldBlock.lineStart + newHeight - 1,
    };

    // Recalculate positions for subsequent blocks
    let currentLine = newBlocks[blockIndex].lineEnd + 1;
    for (let i = blockIndex + 1; i < newBlocks.length; i++) {
      const block = newBlocks[i];
      const height = block.lineEnd - block.lineStart + 1;

      newBlocks[i] = {
        ...block,
        lineStart: currentLine,
        lineEnd: currentLine + height - 1,
      };
      currentLine += height;
    }

    updateDocument({ blocks: newBlocks });
  };

  /**
   * Convert a text block to a different block type (triggered by slash commands)
   * If triggered on a line other than the first, it splits the text block.
   */
  const handleConvertBlock = (blockId: string, newBlockType: BlockType, lineIndex: number) => {
    const blockIndex = document.blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const oldBlock = document.blocks[blockIndex] as unknown as TextBlock; // We know it's a text block
    if (oldBlock.type !== "text") return;

    // 1. Prepare the new block (Table or Drawing)
    let newBlock: AnswerSheetBlock;
    // The new block will start at: oldBlock.lineStart + lineIndex
    const newBlockStartLine = oldBlock.lineStart + lineIndex;

    if (newBlockType === "table") {
      const headers = ["항목", "내용", "비고"];
      const rows = Array(2).fill(null).map(() => ["", "", ""]);
      const columnWidths = [6, 8, 5];
      newBlock = createTableBlock(headers, rows, columnWidths, newBlockStartLine);
    } else if (newBlockType === "drawing") {
      newBlock = createDrawingBlock(8, newBlockStartLine);
    } else {
      return;
    }

    const newBlockHeight = newBlock.lineEnd - newBlock.lineStart;

    // 2. Prepare blocks to insert
    const blocksToInsert: AnswerSheetBlock[] = [];

    // Part A: Text before the insertion point (if any)
    if (lineIndex > 0) {
      const textBefore = oldBlock.lines.slice(0, lineIndex);
      blocksToInsert.push({
        ...oldBlock,
        id: crypto.randomUUID(), // New ID for the split part
        lines: textBefore,
        lineStart: oldBlock.lineStart, // Explicitly set lineStart
        lineEnd: oldBlock.lineStart + lineIndex - 1,
      });
    }

    // Part B: The new block
    blocksToInsert.push(newBlock);

    // Part C: Text after the insertion point (if any)
    // The slash command line itself is replaced by the new block, so we skip it?
    // Usually slash command consumes the line.
    // So we take lines from lineIndex + 1 onwards.
    if (lineIndex + 1 < oldBlock.lines.length) {
      const textAfter = oldBlock.lines.slice(lineIndex + 1);
      // If textAfter is empty, do we need a block? Maybe not.
      // But if user splits in middle, they want text after.
      if (textAfter.length > 0) {
        const startLine = newBlock.lineEnd + 1;
        blocksToInsert.push({
          ...oldBlock,
          id: crypto.randomUUID(),
          lines: textAfter,
          lineStart: startLine, // Explicitly set lineStart
          lineEnd: startLine + textAfter.length - 1,
        });
      }
    }

    // 3. Construct new blocks array
    const newBlocks = [...document.blocks];
    // Remove the old block and insert the new ones
    newBlocks.splice(blockIndex, 1, ...blocksToInsert);

    // 4. Recalculate positions for all subsequent blocks
    // Start recalculating from the block AFTER the last inserted block
    const lastInsertedIndex = blockIndex + blocksToInsert.length - 1;

    for (let i = lastInsertedIndex + 1; i < newBlocks.length; i++) {
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
              <div key={block.id} className="absolute inset-0 pointer-events-none">
                {/* Block content */}
                {block.type === "text" && (
                  <TextBlockRenderer
                    block={block}
                    editable={true}
                    onChange={(lines) => handleTextBlockChange(block.id, lines)}
                    onConvertToBlock={(blockType, lineIndex) => handleConvertBlock(block.id, blockType, lineIndex)}
                  />
                )}
                {block.type === "table" && (
                  <TableBlockRenderer
                    block={block}
                    editable={true}
                    onChange={(headers, rows) => handleTableBlockChange(block.id, headers, rows)}
                    onStructureChange={(headers, rows, columnWidths) => handleTableStructureChange(block.id, headers, rows, columnWidths)}
                    onDelete={() => handleDeleteBlock(block.id)}
                  />
                )}
                {block.type === "drawing" && (
                  <DrawingBlockEditor
                    block={block}
                    onChange={(data) => handleDrawingBlockChange(block.id, data)}
                    onHeightChange={(lines) => handleDrawingBlockHeightChange(block.id, lines)}
                    onDelete={() => handleDeleteBlock(block.id)}
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
