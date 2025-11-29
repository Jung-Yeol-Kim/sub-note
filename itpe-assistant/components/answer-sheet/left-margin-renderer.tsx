"use client";

import type { LeftMarginItem } from "@/lib/types/answer-sheet-block";

interface LeftMarginRendererProps {
  items: LeftMarginItem[];
  editable?: boolean;
  onChange?: (items: LeftMarginItem[]) => void;
  startLine?: number;
  linesPerPage?: number;
}

/**
 * Renders the left margin (목차 영역) based on LeftMarginItem data
 * Configurable 22-row (per page) grid × 3 columns with 1.5:1:1 ratio
 */
export function LeftMarginRenderer({
  items,
  editable = false,
  onChange,
  startLine: startLineProp = 1,
  linesPerPage: linesPerPageProp = 22,
}: LeftMarginRendererProps) {
  const startLine = startLineProp;
  const linesPerPage = linesPerPageProp;

  // Create a map for quick lookup
  const itemMap = new Map<string, string>();
  for (const item of items) {
    const key = `${item.line}-${item.column}`;
    itemMap.set(key, item.content);
  }

  // Create rows for the given page segment
  const rows = Array.from({ length: linesPerPage }, (_, i) => startLine + i);

  const handleCellChange = (line: number, column: 1 | 2 | 3, value: string) => {
    if (!onChange) return;

    const newItems = [...items];
    const existingIndex = newItems.findIndex(
      (item) => item.line === line && item.column === column
    );

    if (existingIndex >= 0) {
      if (value.trim() === "") {
        // 빈 값이면 삭제
        newItems.splice(existingIndex, 1);
      } else {
        // 업데이트
        newItems[existingIndex] = { ...newItems[existingIndex], content: value };
      }
    } else if (value.trim() !== "") {
      // 새로 추가
      newItems.push({ line, column, content: value });
    }

    onChange(newItems);
  };

  return (
    <div className="h-full flex flex-col text-sm" style={{ fontFamily: 'D2Coding, "Nanum Gothic Coding", monospace' }}>
      {rows.map((lineNum) => {
        const col1Content = itemMap.get(`${lineNum}-1`) || "";
        const col2Content = itemMap.get(`${lineNum}-2`) || "";
        const col3Content = itemMap.get(`${lineNum}-3`) || "";

        return (
          <div
            key={`left-margin-${lineNum}`}
            className="grid"
            style={{
              height: `calc(100% / ${linesPerPage})`,
              gridTemplateColumns: '1.5fr 1fr 1fr'
            }}
          >
            <div className="flex items-center justify-center">
              {editable ? (
                <input
                  type="text"
                  value={col1Content}
                  onChange={(e) => handleCellChange(lineNum, 1, e.target.value)}
                  className="w-full h-full text-center bg-transparent border-none focus:outline-none focus:bg-accent/10 text-xs"
                  placeholder=""
                />
              ) : (
                col1Content
              )}
            </div>
            <div className="flex items-center justify-center">
              {editable ? (
                <input
                  type="text"
                  value={col2Content}
                  onChange={(e) => handleCellChange(lineNum, 2, e.target.value)}
                  className="w-full h-full text-center bg-transparent border-none focus:outline-none focus:bg-accent/10 text-xs"
                />
              ) : (
                col2Content
              )}
            </div>
            <div className="flex items-center justify-center">
              {editable ? (
                <input
                  type="text"
                  value={col3Content}
                  onChange={(e) => handleCellChange(lineNum, 3, e.target.value)}
                  className="w-full h-full text-center bg-transparent border-none focus:outline-none focus:bg-accent/10 text-xs"
                />
              ) : (
                col3Content
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
