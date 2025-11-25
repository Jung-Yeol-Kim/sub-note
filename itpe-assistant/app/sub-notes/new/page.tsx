"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyllabusBrowser } from "@/components/syllabus/syllabus-browser";
import { BlockEditor } from "@/components/answer-sheet/block-editor";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { serializeAnswerSheet, prepareForStorage } from "@/lib/utils/answer-sheet-db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSubNoteWithAuth } from "../actions";

export default function NewSubNotePage() {
  const router = useRouter();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState<AnswerSheetDocument | null>(null);

  const handleSave = async () => {
    if (!document) return;
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className={showSyllabus ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="space-y-4">
            {/* Title input and save button */}
            <Card>
              <CardHeader>
                <CardTitle>서브노트 정보</CardTitle>
                <CardDescription>
                  답안지 형식 (22줄 × 20칸)으로 서브노트를 작성하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    placeholder="예: OAuth 2.0 인증 프로토콜"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={!document?.metadata.isValid || !title.trim() || isSaving}
                    size="lg"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "저장 중..." : "저장"}
                    {document && !document.metadata.isValid && " (규격 오류 확인 필요)"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Block Editor */}
            <BlockEditor
              initialDocument={document || undefined}
              onChange={(doc) => setDocument(doc)}
            />
          </div>
        </div>

        {/* Syllabus Sidebar */}
        {showSyllabus && (
          <div className="lg:col-span-1">
            <SyllabusBrowser />
          </div>
        )}
      </div>
    </div>
  );
}
