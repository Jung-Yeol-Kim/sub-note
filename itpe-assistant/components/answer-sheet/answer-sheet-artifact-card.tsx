"use client";

import {
  Artifact,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { Layers, RefreshCw } from "lucide-react";

interface AnswerSheetArtifactCardProps {
  document: AnswerSheetDocument;
  onApply?: (document: AnswerSheetDocument) => void;
  title?: string;
  description?: string;
}

export function AnswerSheetArtifactCard({
  document,
  onApply,
  title = "AI가 제안한 답안지 구조",
  description = "구조화된 블록을 편집기에 반영할 수 있습니다.",
}: AnswerSheetArtifactCardProps) {
  const blockCounts = document.blocks.reduce(
    (acc, block) => {
      acc[block.type] += 1;
      return acc;
    },
    { text: 0, table: 0, drawing: 0 }
  );

  return (
    <Artifact className="bg-white">
      <ArtifactHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#3d5a4c]" />
          <div className="flex flex-col">
            <ArtifactTitle>{title}</ArtifactTitle>
            <ArtifactDescription>{description}</ArtifactDescription>
          </div>
        </div>

        <ArtifactActions>
          {onApply && (
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              onClick={() => onApply(document)}
            >
              <RefreshCw className="h-4 w-4" />
              편집기에 적용
            </Button>
          )}
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent className="space-y-2">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="border-[#3d5a4c] text-[#3d5a4c]">
            총 {document.blocks.length}개 블록
          </Badge>
          <Badge variant="outline" className="border-[#3d5a4c]/70 text-[#3d5a4c]">
            사용 줄 수: {document.totalLines}줄
          </Badge>
          <Badge variant="outline">텍스트 {blockCounts.text}개</Badge>
          <Badge variant="outline">표 {blockCounts.table}개</Badge>
          <Badge variant="outline">그림 {blockCounts.drawing}개</Badge>
        </div>

        {document.metadata.validationWarnings.length > 0 && (
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">경고</p>
            <ul className="list-disc pl-4 space-y-1">
              {document.metadata.validationWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {document.metadata.validationErrors.length > 0 && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-900">
            <p className="font-semibold">유효성 오류</p>
            <ul className="list-disc pl-4 space-y-1">
              {document.metadata.validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </ArtifactContent>
    </Artifact>
  );
}
