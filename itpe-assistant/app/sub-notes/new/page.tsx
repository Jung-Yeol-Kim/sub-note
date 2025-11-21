"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubNoteEditor } from "@/components/subnote/subnote-editor";
import { SyllabusBrowser } from "@/components/syllabus/syllabus-browser";
import { StandardSubNote, standardSubNoteToMarkdown } from "@/lib/types/subnote";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EditorMode = "structured" | "markdown";

export default function NewSubNotePage() {
  const router = useRouter();
  const [editorMode, setEditorMode] = useState<EditorMode>("structured");
  const [showSyllabus, setShowSyllabus] = useState(false);

  const handleSave = async (data: StandardSubNote) => {
    // Convert to markdown for storage
    const markdown = standardSubNoteToMarkdown(data);

    // TODO: Implement save logic with server action
    console.log("Saving sub-note:", data);
    console.log("Markdown:", markdown);

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
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="structured">구조화 에디터</SelectItem>
              <SelectItem value="markdown">마크다운 에디터</SelectItem>
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
            <Card>
              <CardHeader>
                <CardTitle>마크다운 에디터</CardTitle>
                <CardDescription>
                  마크다운 형식으로 자유롭게 작성하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  마크다운 에디터는 곧 지원될 예정입니다.
                  현재는 구조화 에디터를 사용해주세요.
                </p>
              </CardContent>
            </Card>
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
