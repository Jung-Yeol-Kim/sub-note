"use client";

import { useState } from "react";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";
import type { TextBlock, BlockType } from "@/lib/types/answer-sheet-block";
import { SlashCommandMenu, useSlashCommand } from "./slash-command-menu";
import { useAnswerSheetLayout } from "./answer-sheet-layout-context";

interface TextBlockRendererProps {
  block: TextBlock;
  editable?: boolean;
  onChange?: (lines: string[]) => void;
  onConvertToBlock?: (blockType: BlockType) => void;
}

/**
 * Renders a text block with natural, fluid layout
 * Uses 20-column grid as a guide but doesn't strictly enforce it
 * Provides a more handwritten, natural feel
 */
export function TextBlockRenderer({ block, editable = false, onChange, onConvertToBlock }: TextBlockRendererProps) {
  const { lines, lineStart } = block;
  const { lineHeight } = useAnswerSheetLayout();
  const [focusedLineIndex, setFocusedLineIndex] = useState<number | null>(null);
  const [commandMenuPosition, setCommandMenuPosition] = useState<{ top: number; left: number } | undefined>();

  // Get the current focused line's text for slash command detection
  const focusedLineText = focusedLineIndex !== null ? lines[focusedLineIndex] : "";

  // Slash command hook
  const { isCommandMode, commandQuery, handleSelect, handleClose } = useSlashCommand(
    focusedLineText,
    (blockType) => {
      // Convert this text block to the selected block type
      if (onConvertToBlock) {
        onConvertToBlock(blockType);
      }
      // Clear the slash command text
      if (focusedLineIndex !== null) {
        handleLineChange(focusedLineIndex, "");
      }
    }
  );

  // Calculate positioning within the grid
  const topPosition = lineHeight * (lineStart - 1);

  const handleLineChange = (lineIndex: number, newContent: string) => {
    if (!onChange) return;
    const newLines = [...lines];
    newLines[lineIndex] = newContent;
    onChange(newLines);
  };

  const handleInputFocus = (lineIndex: number, event: React.FocusEvent<HTMLInputElement>) => {
    setFocusedLineIndex(lineIndex);

    // Calculate menu position relative to the input
    const rect = event.target.getBoundingClientRect();
    setCommandMenuPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
  };

  const handleInputBlur = () => {
    // Delay to allow menu click to register
    setTimeout(() => {
      setFocusedLineIndex(null);
      setCommandMenuPosition(undefined);
    }, 200);
  };

  return (
    <div
      className="absolute left-0 right-0 px-1"
      style={{
        top: `${topPosition}px`,
      }}
    >
      {lines.map((lineContent, lineIndex) => (
        <div
          key={`text-line-${lineStart + lineIndex}`}
          className="flex items-center relative"
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
              onFocus={(e) => handleInputFocus(lineIndex, e)}
              onBlur={handleInputBlur}
              className="w-full bg-transparent border-none focus:outline-none focus:bg-accent/5"
              style={{
                fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
                fontSize: `${lineHeight * 0.55}px`,
                letterSpacing: '0.02em',
                lineHeight: `${lineHeight * 0.85}px`,
              }}
              placeholder="텍스트 입력 또는 '/' 로 명령어"
            />
          ) : (
            lineContent
          )}
        </div>
      ))}

      {/* Slash Command Menu */}
      {isCommandMode && focusedLineIndex !== null && onConvertToBlock && (
        <SlashCommandMenu
          query={commandQuery}
          onSelect={handleSelect}
          onClose={handleClose}
          position={commandMenuPosition}
        />
      )}
    </div>
  );
}
