import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/community/share-button";
import { AnswerSheetViewer } from "@/components/answer-sheet/answer-sheet-viewer";

// Mock data - will be replaced with actual database query
const getSubNote = (id: string) => ({
  id,
  title: "OAuth 2.0 Grant Types",
  category: "보안",
  status: "completed",
  difficulty: 4,
  tags: ["OAuth", "Authentication", "Security"],
  content: `# OAuth 2.0 Grant Types

## 1. 정의
OAuth 2.0은 인증 및 권한 부여를 위한 산업 표준 프로토콜로, 사용자가 비밀번호를 공유하지 않고도 제3자 애플리케이션에 리소스 접근 권한을 부여할 수 있는 프레임워크

### 특징
- 토큰 기반 인증 메커니즘
- 권한 위임 (Authorization Delegation)
- RESTful API 지원

## 2. Grant Types 설명

### 1) Authorization Code Grant (권장 방식)
가장 안전한 방식으로, 서버 사이드 애플리케이션에서 사용

**흐름:**
\`\`\`
User → Authorization Request → Authorization Server
Authorization Server → Authorization Code → Client
Client → Access Token Request → Authorization Server
Authorization Server → Access Token → Client
\`\`\`

### 2) Implicit Grant
브라우저 기반 애플리케이션을 위한 단순화된 방식 (보안상 권장하지 않음)

### 3) Resource Owner Password Credentials Grant
신뢰할 수 있는 애플리케이션에서 사용자의 자격 증명을 직접 수집

### 4) Client Credentials Grant
Machine-to-Machine 통신에 사용

## 3. 보안 고려사항
- HTTPS 사용 필수
- State 파라미터로 CSRF 방어
- PKCE (Proof Key for Code Exchange) 적용
- Token 만료 및 갱신 전략`,
  updatedAt: "2025-11-20T10:30:00Z",
  createdAt: "2025-11-15T14:00:00Z",
});

export default function SubNoteDetailPage({ params }: { params: { id: string } }) {
  const note = getSubNote(params.id);

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
              {/* Answer Sheet Viewer - displays content in exam format */}
              <AnswerSheetViewer
                content={note.content}
                showHeader={false}
                showPrintButton={true}
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
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i < note.difficulty ? "bg-accent" : "bg-muted"
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
