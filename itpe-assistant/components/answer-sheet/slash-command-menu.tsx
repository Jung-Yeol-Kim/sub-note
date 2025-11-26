"use client";

import { useEffect, useState } from "react";
import { FileText, Table2, PenTool } from "lucide-react";
import type { BlockType } from "@/lib/types/answer-sheet-block";
import { cn } from "@/lib/utils";

interface SlashCommand {
  type: BlockType;
  trigger: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  aliases?: string[]; // Alternative triggers
}

const slashCommands: SlashCommand[] = [
  {
    type: "text",
    trigger: "/텍스트",
    label: "텍스트",
    description: "일반 텍스트 블록",
    icon: <FileText className="h-4 w-4" />,
    aliases: ["/text", "/t"],
  },
  {
    type: "table",
    trigger: "/표",
    label: "표",
    description: "표 형식 블록",
    icon: <Table2 className="h-4 w-4" />,
    aliases: ["/table", "/tb"],
  },
  {
    type: "drawing",
    trigger: "/그림",
    label: "그림",
    description: "다이어그램/흐름도",
    icon: <PenTool className="h-4 w-4" />,
    aliases: ["/drawing", "/draw", "/d"],
  },
];

interface SlashCommandMenuProps {
  query: string; // The text after "/"
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

/**
 * Slash Command Menu - Notion-style command palette
 * Shows when user types "/" in a text block
 */
export function SlashCommandMenu({
  query,
  onSelect,
  onClose,
  position,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on query
  const filteredCommands = slashCommands.filter((cmd) => {
    const searchText = query.toLowerCase();
    return (
      cmd.trigger.toLowerCase().includes(searchText) ||
      cmd.label.toLowerCase().includes(searchText) ||
      cmd.aliases?.some((alias) => alias.toLowerCase().includes(searchText))
    );
  });

  // Reset selection when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredCommands.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex].type);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, selectedIndex, onSelect, onClose]);

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed z-50 w-80 bg-popover text-popover-foreground rounded-lg border shadow-md overflow-hidden"
      style={position ? { top: `${position.top}px`, left: `${position.left}px` } : undefined}
      onMouseDown={(e) => {
        // Prevent input blur when clicking on menu
        e.preventDefault();
      }}
    >
      <div className="max-h-[300px] overflow-y-auto p-1">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          블록 추가
        </div>
        {filteredCommands.map((cmd, index) => (
          <div
            key={cmd.type}
            onClick={() => onSelect(cmd.type)}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-sm cursor-pointer select-none",
              index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
            )}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded border bg-background">
              {cmd.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{cmd.label}</div>
              <div className="text-xs text-muted-foreground">
                {cmd.description}
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {cmd.trigger}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hook to detect slash commands in text
 */
export function useSlashCommand(
  text: string,
  onCommand: (type: BlockType) => void
) {
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  useEffect(() => {
    // Check if text starts with "/"
    if (text.startsWith("/")) {
      setIsCommandMode(true);
      setCommandQuery(text.slice(1)); // Remove the "/"
    } else {
      setIsCommandMode(false);
      setCommandQuery("");
    }
  }, [text]);

  const handleSelect = (type: BlockType) => {
    onCommand(type);
    setIsCommandMode(false);
  };

  const handleClose = () => {
    setIsCommandMode(false);
  };

  return {
    isCommandMode,
    commandQuery,
    handleSelect,
    handleClose,
  };
}
