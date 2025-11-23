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

type EditorMode = "structured" | "freeform";

export default function NewSubNotePage() {
  const router = useRouter();
  const [editorMode, setEditorMode] = useState<EditorMode>("structured");
  const [showSyllabus, setShowSyllabus] = useState(false);

  // For freeform mode
  const [freeformContent, setFreeformContent] = useState("");
  const [freeformSheet, setFreeformSheet] = useState<AnswerSheet | null>(null);

  const handleSave = async (data: StandardSubNote) => {
    // Convert to markdown for storage
    const markdown = standardSubNoteToMarkdown(data);

    // TODO: Implement save logic with server action
    console.log("Saving structured sub-note:", data);
    console.log("Markdown:", markdown);

    // router.push("/sub-notes");
  };

  const handleFreeformSave = async () => {
    if (!freeformSheet) return;

    // TODO: Implement save logic with server action
    console.log("Saving freeform sub-note:");
    console.log("Content:", freeformContent);
    console.log("Answer sheet:", freeformSheet);
    console.log("Format valid:", freeformSheet.isValid);
    console.log("Lines:", freeformSheet.totalLines);
    console.log("Cells:", freeformSheet.totalCells);

    // Data to save:
    // {
    //   title: "...",  // Get from user input
    //   content: freeformContent,
    //   structuredAnswer: freeformSheet,
    //   lineCount: freeformSheet.totalLines,
    //   cellCount: freeformSheet.totalCells,
    //   isValidFormat: freeformSheet.isValid,
    //   formatWarnings: freeformSheet.validationWarnings,
    // }

    // router.push("/sub-notes");
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
              {/* Save button for freeform mode */}
              <div className="flex justify-end">
                <Button
                  onClick={handleFreeformSave}
                  disabled={!freeformSheet?.isValid}
                  size="lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  저장
                  {!freeformSheet?.isValid && " (규격 오류 확인 필요)"}
                </Button>
              </div>

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
