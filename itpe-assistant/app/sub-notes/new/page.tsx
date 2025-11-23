"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubNoteEditor } from "@/components/subnote/subnote-editor";
import { SyllabusBrowser } from "@/components/syllabus/syllabus-browser";
import { StandardSubNote, standardSubNoteToMarkdown } from "@/lib/types/subnote";
import { AnswerSheetEditor } from "@/components/answer-sheet/answer-sheet-editor";
import { parseAnswerSheet, type AnswerSheet } from "@/lib/types/answer-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSubNoteWithAuth } from "../actions";

type EditorMode = "structured" | "freeform";

export default function NewSubNotePage() {
  const router = useRouter();
  const [editorMode, setEditorMode] = useState<EditorMode>("structured");
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // For freeform mode
  const [freeformTitle, setFreeformTitle] = useState("");
  const [freeformContent, setFreeformContent] = useState("");
  const [freeformSheet, setFreeformSheet] = useState<AnswerSheet | null>(null);

  const handleSave = async (data: StandardSubNote) => {
    setIsSaving(true);
    try {
      // Convert to markdown for storage
      const markdown = standardSubNoteToMarkdown(data);

      const result = await createSubNoteWithAuth({
        title: data.title,
        content: markdown,
        category: data.syllabusMapping.categoryName,
        tags: data.tags,
        status: data.study?.status || "draft",
        difficulty: data.difficulty,
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

  const handleFreeformSave = async () => {
    if (!freeformSheet) return;
    if (!freeformTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createSubNoteWithAuth({
        title: freeformTitle,
        content: freeformContent,
        status: "draft",
      });

      if (result.success) {
        router.push("/sub-notes");
      } else {
        alert(`저장 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving freeform sub-note:", error);
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSyllabus(!showSyllabus)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {showSyllabus ? "출제기준 숨기기" : "출제기준 보기"}
          </Button>

          <Select
            value={editorMode}
            onValueChange={(value) => setEditorMode(value as EditorMode)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="structured">구조화 에디터</SelectItem>
              <SelectItem value="freeform">자유 형식 (22×19 규격)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className={showSyllabus ? "lg:col-span-2" : "lg:col-span-3"}>
          {editorMode === "structured" ? (
            <SubNoteEditor onSave={handleSave} />
          ) : (
            <div className="space-y-4">
              {/* Title input and save button for freeform mode */}
              <Card>
                <CardHeader>
                  <CardTitle>서브노트 정보</CardTitle>
                  <CardDescription>
                    서브노트 제목을 입력하고 자유 형식으로 작성하세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="freeform-title">제목</Label>
                    <Input
                      id="freeform-title"
                      placeholder="예: OAuth 2.0 인증 프로토콜"
                      value={freeformTitle}
                      onChange={(e) => setFreeformTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleFreeformSave}
                      disabled={!freeformSheet?.isValid || !freeformTitle.trim() || isSaving}
                      size="lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "저장 중..." : "저장"}
                      {!freeformSheet?.isValid && " (규격 오류 확인 필요)"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Sheet Editor */}
              <AnswerSheetEditor
                initialContent={freeformContent}
                onChange={(content, sheet) => {
                  setFreeformContent(content);
                  setFreeformSheet(sheet);
                }}
                showGridPreview={true}
                showStatistics={true}
              />
            </div>
          )}
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
