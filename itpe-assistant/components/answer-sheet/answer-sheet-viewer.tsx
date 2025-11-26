"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { DrawingBlockRenderer } from "./drawing-block-renderer";

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
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between print:hidden">
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
        </div>
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
              } else if (block.type === "drawing") {
                return <DrawingBlockRenderer key={block.id} block={block} />;
              }
              return null;
            })}
          </AnswerSheetGrid>
        </CardContent>
      </Card>
    </div>
  );
}
