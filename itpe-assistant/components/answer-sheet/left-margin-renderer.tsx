"use client";

import type { LeftMarginItem } from "@/lib/types/answer-sheet-block";

interface LeftMarginRendererProps {
  items: LeftMarginItem[];
}

/**
 * Renders the left margin (목차 영역) based on LeftMarginItem data
 * 22 rows × 3 columns with 1.5:1:1 ratio
 */
export function LeftMarginRenderer({ items }: LeftMarginRendererProps) {
  // Create a map for quick lookup
  const itemMap = new Map<string, string>();
  for (const item of items) {
    const key = `${item.line}-${item.column}`;
    itemMap.set(key, item.content);
  }

  // Create 22 rows
  const rows = Array.from({ length: 22 }, (_, i) => i + 1);

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
              height: 'calc(100% / 22)',
              gridTemplateColumns: '1.5fr 1fr 1fr'
            }}
          >
            <div className="flex items-center justify-center">
              {col1Content}
            </div>
            <div className="flex items-center justify-center">
              {col2Content}
            </div>
            <div className="flex items-center justify-center">
              {col3Content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
