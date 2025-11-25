"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnswerSheetEditor } from "@/components/answer-sheet";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { updateSubNoteWithAuth } from "@/app/sub-notes/actions";
import { Loader2 } from "lucide-react";

interface SubNoteEditFormProps {
  initialData: {
    id: string;
    title: string;
    category: string;
    status: string;
    difficulty: number;
    tags: string[];
    document: AnswerSheetDocument;
  };
}

export function SubNoteEditForm({ initialData }: SubNoteEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title);
  const [document, setDocument] = useState<AnswerSheetDocument>(initialData.document);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await updateSubNoteWithAuth(initialData.id, {
        title: title.trim(),
        structuredAnswer: document,
        lineCount: document.totalLines,
        isValidFormat: document.metadata.isValid,
        formatWarnings: document.metadata.validationWarnings,
      });

      if (result.success) {
        router.push(`/sub-notes/${initialData.id}`);
      } else {
        setError(result.error || "저장에 실패했습니다");
      }
    } catch (err) {
      setError("저장 중 오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      confirm("변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?")
    ) {
      router.push(`/sub-notes/${initialData.id}`);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Title Input */}
        <Card>
          <CardContent className="p-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
              placeholder="서브노트 제목"
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Answer Sheet Editor */}
        <AnswerSheetEditor
          initialDocument={document}
          onChange={setDocument}
        />
      </div>

      {/* Fixed Bottom Bar with Save/Cancel */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-background/95 backdrop-blur-sm border-t z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {document.metadata.isValid ? (
              <span className="text-green-600">✓ 규격 준수</span>
            ) : (
              <span className="text-destructive">⚠ 규격 초과 ({document.totalLines}/22줄)</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
