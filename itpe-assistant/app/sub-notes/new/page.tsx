"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyllabusBrowser } from "@/components/syllabus/syllabus-browser";
import { UnifiedAnswerSheetEditor } from "@/components/answer-sheet/unified-answer-sheet-editor";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { serializeAnswerSheet, prepareForStorage } from "@/lib/utils/answer-sheet-db";
import { createSubNoteWithAuth } from "../actions";

export default function NewSubNotePage() {
  const router = useRouter();
  const [showSyllabus, setShowSyllabus] = useState(false);

  const handleSave = async (
    document: AnswerSheetDocument,
    imageUrls: string[],
    ocrText: string
  ) => {
    // Extract title from first text block
    const title = document.blocks.find(b => b.type === "text")?.lines[0] || "제목 없음";

    if (!document || document.blocks.length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }

    // Enhanced validation error messaging
    if (!document.metadata.isValid) {
      const errors = document.metadata.validationErrors;
      const warnings = document.metadata.validationWarnings;

      console.error("Validation errors:", errors);
      console.warn("Validation warnings:", warnings);

      let errorMessage = "답안지 규격을 확인해주세요.\n\n";

      if (errors.length > 0) {
        errorMessage += "❌ 오류:\n";
        errors.forEach((error, idx) => {
          errorMessage += `  ${idx + 1}. ${error}\n`;
        });
      }

      if (warnings.length > 0) {
        errorMessage += "\n⚠️  경고:\n";
        warnings.forEach((warning, idx) => {
          errorMessage += `  ${idx + 1}. ${warning}\n`;
        });
      }

      errorMessage += "\n💡 힌트:\n";
      errorMessage += "  • 최대 3페이지(66줄)까지 작성할 수 있습니다\n";
      errorMessage += "  • 1페이지 = 22줄입니다\n";
      errorMessage += "  • 그림 블록은 기본 8줄을 차지합니다\n";
      errorMessage += "  • 불필요한 블록을 삭제하거나 크기를 조정해보세요";

      alert(errorMessage);
      return;
    }

    try {
      const prepared = prepareForStorage(document);

      const result = await createSubNoteWithAuth({
        title,
        content: JSON.stringify(serializeAnswerSheet(prepared.document)),
        status: "draft",
        structuredAnswer: serializeAnswerSheet(prepared.document),
        lineCount: prepared.lineCount,
        cellCount: prepared.cellCount,
        isValidFormat: prepared.isValidFormat,
        formatWarnings: prepared.formatWarnings,
        originalImages: imageUrls.length > 0 ? imageUrls : undefined,
      });

      if (result.success) {
        router.push("/sub-notes");
      } else {
        alert(`저장 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving sub-note:", error);
      alert("서브노트 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-screen flex flex-col animate-in fade-in duration-500">
      {/* Simplified Header - Only back button */}
      <div className="flex-none px-6 py-3 border-b border-[#3d5a4c]/20 bg-white flex items-center justify-between">
        <Link href="/sub-notes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Button>
        </Link>

        {showSyllabus && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSyllabus(false)}
          >
            출제기준 숨기기
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Unified Editor - Takes full width or shares with syllabus */}
        <div className={showSyllabus ? "flex-1" : "w-full"}>
          <UnifiedAnswerSheetEditor onSave={handleSave} />
        </div>

        {/* Syllabus Sidebar - Optional */}
        {showSyllabus && (
          <div className="w-96 shrink-0 border-l border-[#3d5a4c]/20 overflow-y-auto">
            <SyllabusBrowser />
          </div>
        )}
      </div>
    </div>
  );
}
