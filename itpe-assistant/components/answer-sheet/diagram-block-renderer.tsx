"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  ReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BLOCK_CONSTANTS, type DiagramBlock } from "@/lib/types/answer-sheet-block";

interface DiagramBlockRendererProps {
  block: DiagramBlock;
}

/**
 * Custom node component for diagram boxes
 */
function DiagramNode({ data }: { data: { label: string } }) {
  return (
    <div className="border-2 border-foreground rounded flex items-center justify-center bg-card px-2 py-1 h-full">
      <span className="font-semibold text-xs">{data.label}</span>
    </div>
  );
}

/**
 * Custom node types for React Flow
 */
const nodeTypes: NodeTypes = {
  diagramNode: DiagramNode,
};

/**
 * Renders a diagram block (flowchart) within the 19-column grid system
 * Uses @xyflow/react for rendering nodes and connections
 */
export function DiagramBlockRenderer({ block }: DiagramBlockRendererProps) {
  const { nodes: diagramNodes, connections, labels, lineStart, lineEnd } = block;
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

          // Calculate based on full 22-line grid (same as TextBlockRenderer)
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

  // Convert DiagramBlock nodes to React Flow nodes
  const flowNodes: Node[] = useMemo(() => {
    if (cellWidth === 0 || lineHeight === 0) return [];

    return diagramNodes.map((node) => ({
      id: node.id,
      type: "diagramNode",
      position: {
        x: node.x * cellWidth,
        y: node.y * lineHeight,
      },
      data: {
        label: node.label,
      },
      style: {
        width: node.width * cellWidth,
        height: node.height * lineHeight,
      },
      draggable: false,
      selectable: false,
      focusable: false,
    }));
  }, [diagramNodes, cellWidth, lineHeight]);

  // Convert DiagramBlock connections to React Flow edges
  const flowEdges: Edge[] = useMemo(() => {
    return connections.map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      type: "smoothstep",
      animated: false,
      style: {
        stroke: "currentColor",
        strokeWidth: 2,
      },
      labelStyle: {
        fontSize: "10px",
        fontFamily: 'D2Coding, "Nanum Gothic Coding", "Courier New", monospace',
      },
    }));
  }, [connections]);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0"
      style={{
        top: `${topPosition}px`,
        height: `${height}px`,
      }}
    >
      {cellWidth > 0 && lineHeight > 0 && (
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={true}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background gap={cellWidth} size={1} />
        </ReactFlow>
      )}

      {/* Draw additional labels */}
      {cellWidth > 0 && lineHeight > 0 && labels?.map((label) => (
        <div
          key={`label-${label.x}-${label.y}-${label.text}`}
          className="absolute whitespace-nowrap pointer-events-none"
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
