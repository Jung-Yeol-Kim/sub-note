import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/community/share-button";
import { AnswerSheetViewer } from "@/components/answer-sheet";
import { devopsAnswerSheet } from "@/lib/data/devops-answer-example";
import type { AnswerSheetDocument } from "@/lib/types/answer-sheet-block";

// Mock data - will be replaced with actual database query
const getSubNote = (id: string) => {
  // ID가 "1"이면 DevOps 답안지 반환
  if (id === "1") {
    return {
      id,
      title: "DevOps",
      category: "소프트웨어공학",
      status: "completed",
      difficulty: 3,
      tags: ["DevOps", "CI/CD", "자동화"],
      document: devopsAnswerSheet,
      updatedAt: "2025-11-24T10:30:00Z",
      createdAt: "2025-11-24T09:00:00Z",
    };
  }

  // 다른 ID는 기본 빈 문서 반환
  return {
    id,
    title: "Sample Sub-note",
    category: "기타",
    status: "draft",
    difficulty: 2,
    tags: [],
    document: {
      blocks: [],
      totalLines: 0,
      metadata: {
        isValid: true,
        validationErrors: [],
        validationWarnings: [],
      },
    } as AnswerSheetDocument,
    updatedAt: "2025-11-24T10:30:00Z",
    createdAt: "2025-11-24T09:00:00Z",
  };
};

export default async function SubNoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = getSubNote(id);

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
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                showHeader={false}
                showPrintButton={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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

          {/* Actions */}
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Request Evaluation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Analyze Keywords
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Get Suggestions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

