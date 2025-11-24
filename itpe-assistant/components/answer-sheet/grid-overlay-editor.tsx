"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type AnswerSheetDocument,
  BLOCK_CONSTANTS,
} from "@/lib/types/answer-sheet-block";
import { BlockEditor } from "./block-editor";

interface GridOverlayEditorProps {
  initialDocument?: AnswerSheetDocument;
  onChange?: (document: AnswerSheetDocument) => void;
  readOnly?: boolean;
  showPrintButton?: boolean;
}

/**
 * Grid overlay editor - wrapper around BlockEditor
 * Provides backward compatibility with old interface
 */
export function GridOverlayEditor({
  initialDocument,
  onChange,
  readOnly = false,
  showPrintButton = false,
}: GridOverlayEditorProps) {
  const [document, setDocument] = useState<AnswerSheetDocument>(
    initialDocument || {
      blocks: [],
      totalLines: 0,
      metadata: {
        isValid: true,
        validationErrors: [],
        validationWarnings: [],
      },
    }
  );

  useEffect(() => {
    if (initialDocument) {
      setDocument(initialDocument);
    }
  }, [initialDocument]);

  const handleDocumentChange = (newDoc: AnswerSheetDocument) => {
    setDocument(newDoc);
    onChange?.(newDoc);
  };

  const handlePrint = () => {
    window.print();
  };

  const { hasErrors, hasWarnings, errorMessage, warningMessage } =
    formatValidationMessages(document);

  return (
    <div className="space-y-4">
      {/* Validation Status */}
      {hasErrors && (
        <Alert variant="destructive" className="print:hidden">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && !hasErrors && (
        <Alert className="print:hidden">
          <Info className="h-4 w-4" />
          <AlertDescription className="whitespace-pre-line">
            {warningMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Answer Sheet Grid Info */}
      <Card className="border-accent/30 print:hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              답안지 규격 (22줄 × 19칸)
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <StatCard label="총 블록 수" value={`${document.blocks.length}개`} />
            <StatCard
              label="총 줄 수"
              value={`${document.totalLines} / ${BLOCK_CONSTANTS.MAX_LINES}`}
            />
            <StatCard
              label="텍스트 블록"
              value={`${document.blocks.filter((b) => b.type === "text").length}개`}
            />
            <StatCard
              label="표 블록"
              value={`${document.blocks.filter((b) => b.type === "table").length}개`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Block Editor */}
      {!readOnly && (
        <BlockEditor
          initialDocument={document}
          onChange={handleDocumentChange}
        />
      )}

      {/* Read-only view */}
      {readOnly && (
        <Card>
          <CardContent className="p-4">
            <div className="text-gray-500 text-center py-8">
              읽기 전용 모드입니다.
            </div>
          </CardContent>
        </Card>
      )}
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

// Validation message formatter
function formatValidationMessages(document: AnswerSheetDocument) {
  const hasErrors = document.metadata.validationErrors.length > 0;
  const hasWarnings = document.metadata.validationWarnings.length > 0;

  const errorMessage = hasErrors
    ? document.metadata.validationErrors.join("\n")
    : "";

  const warningMessage = hasWarnings
    ? document.metadata.validationWarnings.join("\n")
    : "";

  return {
    hasErrors,
    hasWarnings,
    errorMessage,
    warningMessage,
  };
}
