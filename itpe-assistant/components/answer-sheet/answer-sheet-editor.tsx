"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  type AnswerSheetDocument,
  type LeftMarginItem,
  createTextBlock,
  validateDocument,
} from "@/lib/types/answer-sheet-block";
import { AnswerSheetGrid } from "./answer-sheet-grid";
import { TextBlockRenderer } from "./text-block-renderer";
import { TableBlockRenderer } from "./table-block-renderer";
import { DiagramBlockRenderer } from "./diagram-block-renderer";

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

  const handleLeftMarginChange = (items: LeftMarginItem[]) => {
    updateDocument({ leftMargin: items });
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
          {document.blocks.map((block) => {
            if (block.type === "text") {
              return (
                <TextBlockRenderer
                  key={block.id}
                  block={block}
                  editable={true}
                  onChange={(lines) => handleTextBlockChange(block.id, lines)}
                />
              );
            } else if (block.type === "table") {
              return (
                <TableBlockRenderer
                  key={block.id}
                  block={block}
                  editable={true}
                  onChange={(headers, rows) => handleTableBlockChange(block.id, headers, rows)}
                />
              );
            } else if (block.type === "diagram") {
              return (
                <DiagramBlockRenderer
                  key={block.id}
                  block={block}
                />
              );
            }
            return null;
          })}
        </AnswerSheetGrid>
      </Card>
    </div>
  );
}
