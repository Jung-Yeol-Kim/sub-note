import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSubNote } from "../../actions";
import { redirect } from "next/navigation";
import { SubNoteEditForm } from "@/components/sub-notes/sub-note-edit-form";

export default async function SubNoteEditPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const result = await getSubNote(id, session.user.id);

  if (!result.success || !result.data) {
    redirect("/sub-notes");
  }

  const dbNote = result.data;

  const initialData = {
    id: dbNote.id,
    title: dbNote.title,
    category: dbNote.category || "기타",
    status: dbNote.status,
    difficulty: dbNote.difficulty || 0,
    tags: dbNote.tags || [],
    document: (dbNote.structuredAnswer || {
      blocks: [],
      leftMargin: [],
      totalLines: 0,
      metadata: {
        isValid: true,
        validationErrors: [],
        validationWarnings: [],
      },
    }) as AnswerSheetDocument,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/sub-notes/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            취소
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">서브노트 수정</h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Same layout as viewer */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div>
          <SubNoteEditForm initialData={initialData} />
        </div>

        {/* Sticky Sidebar */}
        <div className="space-y-6 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">편집 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">카테고리</p>
                <p className="text-sm font-medium">{initialData.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">상태</p>
                <p className="text-sm font-medium">
                  {initialData.status === "completed"
                    ? "완료"
                    : initialData.status === "in_review"
                      ? "검토 중"
                      : "작성 중"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">난이도</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={`difficulty-${level}`}
                      className={`h-2 w-2 rounded-full ${
                        level <= initialData.difficulty ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-sm">💡 편집 팁</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• 답안지는 최대 22줄까지 작성 가능합니다</p>
              <p>• 왼쪽 목차 영역을 클릭하여 편집할 수 있습니다</p>
              <p>• 변경사항은 자동 저장되지 않으니 저장 버튼을 클릭하세요</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
