"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyllabusBrowser } from "@/components/syllabus/syllabus-browser";
import { AnswerSheetEditor } from "@/components/answer-sheet/answer-sheet-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { serializeAnswerSheet, prepareForStorage } from "@/lib/utils/answer-sheet-db";
import { createSubNoteWithAuth } from "../actions";

export default function NewSubNotePage() {
  const router = useRouter();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState<AnswerSheetDocument | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!document || document.blocks.length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (!document.metadata.isValid) {
      alert("답안지 규격을 확인해주세요.");
      return;
    }

    setIsSaving(true);
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
      });

      if (result.success) {
        router.push("/sub-notes");
      } else {
        alert(`저장 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving sub-note:", error);
      alert("서브노트 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/sub-notes">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              서브노트 목록으로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">새 서브노트 작성</h1>
          <p className="text-muted-foreground mt-1">
            정보관리기술사 시험 답안지 형식에 맞춰 서브노트를 작성하세요
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSyllabus(!showSyllabus)}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          {showSyllabus ? "출제기준 숨기기" : "출제기준 보기"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Editor */}
        <div className={showSyllabus ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="space-y-4">
            {/* Title input and save button */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      id="title"
                      placeholder="서브노트 제목을 입력하세요 (예: OAuth 2.0 인증 프로토콜)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Button
                      onClick={handleSave}
                      disabled={!title.trim() || !document || isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer Sheet Editor */}
            <AnswerSheetEditor
              initialDocument={document || undefined}
              onChange={(doc) => setDocument(doc)}
            />
          </div>
        </div>

        {/* Syllabus Sidebar */}
        {showSyllabus && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SyllabusBrowser />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
