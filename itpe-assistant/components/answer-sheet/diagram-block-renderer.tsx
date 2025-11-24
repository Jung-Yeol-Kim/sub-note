"use client";

import { useEffect, useRef, useState } from "react";
import { type DiagramBlock } from "@/lib/types/answer-sheet-block";
import { BLOCK_CONSTANTS } from "@/lib/types/answer-sheet-block";

interface DiagramBlockRendererProps {
  block: DiagramBlock;
}

/**
 * Renders a diagram block (flowchart) within the 19-column grid system
 * Shows boxes (nodes) connected with arrows
 */
export function DiagramBlockRenderer({ block }: DiagramBlockRendererProps) {
  const { nodes, connections, labels, lineStart, lineEnd } = block;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(0);

  // Measure container dimensions and calculate cell width & line height
  useEffect(() => {
    const updateMeasurements = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const containerWidth = parent.offsetWidth;
          const containerHeight = parent.offsetHeight;
          const calculatedCellWidth = containerWidth / BLOCK_CONSTANTS.MAX_CELLS_PER_LINE;
          const calculatedLineHeight = containerHeight / BLOCK_CONSTANTS.MAX_LINES;
          setCellWidth(calculatedCellWidth);
          setLineHeight(calculatedLineHeight);
        }
      }
    };

    updateMeasurements();

    // Update on window resize
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  // Calculate positioning within the grid
  const topPosition = lineHeight * (lineStart - 1);
  const height = lineHeight * (lineEnd - lineStart + 1);

  // Helper to get node position
  const getNodePosition = (nodeId: string) => {
    return nodes.find(n => n.id === nodeId);
  };

  // Helper to calculate center of a node
  const getNodeCenter = (node: { x: number; y: number; width: number; height: number }) => {
    return {
      x: (node.x + node.width / 2) * cellWidth,
      y: (node.y + node.height / 2) * lineHeight,
    };
  };

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0"
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
      }}
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Draw connections (arrows) */}
        {cellWidth > 0 && lineHeight > 0 && connections.map((conn, index) => {
          const fromNode = getNodePosition(conn.from);
          const toNode = getNodePosition(conn.to);

          if (!fromNode || !toNode) return null;

          const from = getNodeCenter(fromNode);
          const to = getNodeCenter(toNode);

          // Calculate arrow path
          const isHorizontal = Math.abs(to.x - from.x) > Math.abs(to.y - from.y);

          return (
            <g key={index}>
              {/* Arrow line */}
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="currentColor"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />

              {/* Connection label */}
              {conn.label && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  textAnchor="middle"
                  fontSize={cellWidth * 0.6}
                  fill="currentColor"
                  style={{
                    fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
                  }}
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
          </marker>
        </defs>
      </svg>

      {/* Draw nodes (boxes) */}
      {cellWidth > 0 && lineHeight > 0 && nodes.map((node) => (
        <div
          key={node.id}
          className="absolute border-2 border-foreground rounded flex items-center justify-center bg-card"
          style={{
            left: `${node.x * cellWidth}px`,
            top: `${node.y * lineHeight}px`,
            width: `${node.width * cellWidth}px`,
            height: `${node.height * lineHeight}px`,
            fontSize: `${Math.min(cellWidth * 0.75, lineHeight * 0.7)}px`,
            fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
          }}
        >
          <span className="font-semibold">{node.label}</span>
        </div>
      ))}

      {/* Draw additional labels */}
      {cellWidth > 0 && lineHeight > 0 && labels?.map((label, index) => (
        <div
          key={index}
          className="absolute whitespace-nowrap"
          style={{
            left: `${label.x * cellWidth}px`,
            top: `${label.y * lineHeight}px`,
            fontSize: `${Math.min(cellWidth * 0.6, lineHeight * 0.6)}px`,
            fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
          }}
        >
          {label.text}
        </div>
      ))}
    </div>
  );
}
