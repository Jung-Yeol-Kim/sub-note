import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/community/share-button";
import { DeleteButton } from "@/components/sub-notes/delete-button";
import { AnswerSheetViewer } from "@/components/answer-sheet";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSubNote } from "../actions";
import { redirect } from "next/navigation";
import { FloatingAiActions } from "@/components/sub-notes/floating-ai-actions";

export default async function SubNoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
  console.log(result)

  // Map database fields to component props
  const note = {
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
    updatedAt: dbNote.updatedAt.toISOString(),
    createdAt: dbNote.createdAt.toISOString(),
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/sub-notes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sub-notes
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <ShareButton
            subNoteId={note.id}
            subNoteTitle={note.title}
          />
          <Link href={`/sub-notes/${note.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              수정
            </Button>
          </Link>
          <DeleteButton
            subNoteId={note.id}
            userId={session.user.id}
            title={note.title}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{note.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{note.category}</Badge>
                    <Badge
                      variant={
                        note.status === "completed"
                          ? "default"
                          : note.status === "in_review"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {note.status}
                    </Badge>
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Answer Sheet - 22 lines format with blocks */}
              <AnswerSheetViewer
                document={note.document}
                showHeader={true}
                showPrintButton={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sticky Sidebar */}
        <div className="space-y-6 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={`difficulty-level-${level}`}
                      className={`h-2 w-2 rounded-full ${
                        level <= note.difficulty ? "bg-accent" : "bg-muted"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{note.difficulty}/5</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium">
                  {new Date(note.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm font-medium">
                  {new Date(note.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating AI Actions Button */}
      <FloatingAiActions subNoteId={note.id} />
    </div>
  );
}

