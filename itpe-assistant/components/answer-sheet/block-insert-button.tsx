"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BlockTypePopover } from "./block-type-popover";
import type { AnswerSheetBlock } from "@/lib/types/answer-sheet-block";

interface BlockInsertButtonProps {
  onInsertBlock: (block: AnswerSheetBlock) => void;
  position: "above" | "below";
  currentLine: number; // Which line this button is at
  availableLines: number; // How many lines are available
  className?: string;
}

/**
 * Block Insert Button - Notion-style "+" button
 * Shows on hover and allows inserting blocks at specific positions
 */
export function BlockInsertButton({
  onInsertBlock,
  position,
  currentLine,
  availableLines,
  className,
}: BlockInsertButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleInsert = (block: AnswerSheetBlock) => {
    onInsertBlock(block);
    setPopoverOpen(false);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center transition-opacity",
        "h-6 -my-3", // Negative margin to overlap with block spacing
        isHovered || popoverOpen ? "opacity-100" : "opacity-0 hover:opacity-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Horizontal line that spans full width */}
      <div
        className={cn(
          "absolute inset-x-0 h-[2px] bg-primary/20 transition-opacity",
          isHovered || popoverOpen ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Plus button in the center */}
      <BlockTypePopover
        onInsertBlock={handleInsert}
        currentLine={currentLine}
        availableLines={availableLines}
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-6 w-6 rounded-full bg-background border border-border shadow-sm",
            "hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "transition-all duration-200",
            isHovered || popoverOpen ? "scale-100" : "scale-0"
          )}
          onClick={() => setPopoverOpen(true)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </BlockTypePopover>
    </div>
  );
}
