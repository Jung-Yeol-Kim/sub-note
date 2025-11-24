"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Printer,
} from "lucide-react";
import {
  type AnswerSheetDocument,
  BLOCK_CONSTANTS,
} from "@/lib/types/answer-sheet-block";
import { AnswerSheetGrid } from "./answer-sheet-grid";
import { TextBlockRenderer } from "./text-block-renderer";
import { TableBlockRenderer } from "./table-block-renderer";
import { DiagramBlockRenderer } from "./diagram-block-renderer";

interface AnswerSheetViewerProps {
  document: AnswerSheetDocument;
  showHeader?: boolean;
  showPrintButton?: boolean;
  title?: string;
}

export function AnswerSheetViewer({
  document,
  showHeader = true,
  showPrintButton = true,
  title,
}: AnswerSheetViewerProps) {
  const stats = useMemo(() => {
    const textBlocks = document.blocks.filter((b) => b.type === "text").length;
    const tableBlocks = document.blocks.filter((b) => b.type === "table").length;
    const diagramBlocks = document.blocks.filter((b) => b.type === "diagram").length;

    return {
      totalBlocks: document.blocks.length,
      textBlocks,
      tableBlocks,
      diagramBlocks,
      utilizationRate: (document.totalLines / BLOCK_CONSTANTS.MAX_LINES) * 100,
    };
  }, [document]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <Card className="border-accent/30 print:hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {title || "답안지 (22줄 × 19칸)"}
              </span>
              <div className="flex items-center gap-2">
                {document.metadata.isValid ? (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    규격 준수
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    규격 초과
                  </Badge>
                )}
                {showPrintButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    인쇄
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <StatCard label="총 블록 수" value={`${stats.totalBlocks}개`} />
              <StatCard label="텍스트 블록" value={`${stats.textBlocks}개`} />
              <StatCard label="표 블록" value={`${stats.tableBlocks}개`} />
              <StatCard label="다이어그램" value={`${stats.diagramBlocks}개`} />
              <StatCard
                label="줄 사용률"
                value={`${stats.utilizationRate.toFixed(0)}%`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Sheet Grid */}
      <Card className="max-w-full overflow-x-auto">
        <CardContent className="p-0">
          <AnswerSheetGrid
            blocks={document.blocks}
            showLineNumbers={false}
            leftMargin={document.leftMargin}
          >
            {document.blocks.map((block) => {
              if (block.type === "text") {
                return <TextBlockRenderer key={block.id} block={block} />;
              } else if (block.type === "table") {
                return <TableBlockRenderer key={block.id} block={block} />;
              } else if (block.type === "diagram") {
                return <DiagramBlockRenderer key={block.id} block={block} />;
              }
              return null;
            })}
          </AnswerSheetGrid>
        </CardContent>
      </Card>
    </div>
  );
}

// Stat card component
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
