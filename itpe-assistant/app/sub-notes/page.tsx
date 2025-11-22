import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, FileText, Clock } from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with actual database queries
const subNotes = [
  {
    id: "1",
    title: "OAuth 2.0 Grant Types",
    category: "보안",
    status: "completed",
    difficulty: 4,
    updatedAt: "2025-11-20",
  },
  {
    id: "2",
    title: "Kubernetes Architecture",
    category: "클라우드",
    status: "in_review",
    difficulty: 5,
    updatedAt: "2025-11-19",
  },
  {
    id: "3",
    title: "Zero Trust Security Model",
    category: "보안",
    status: "draft",
    difficulty: 4,
    updatedAt: "2025-11-18",
  },
  {
    id: "4",
    title: "API Gateway Patterns",
    category: "아키텍처",
    status: "completed",
    difficulty: 3,
    updatedAt: "2025-11-17",
  },
  {
    id: "5",
    title: "Database Sharding Strategies",
    category: "데이터베이스",
    status: "in_review",
    difficulty: 5,
    updatedAt: "2025-11-16",
  },
];

const categories = ["전체", "보안", "클라우드", "데이터베이스", "네트워크", "아키텍처"];
const statuses = [
  { value: "all", label: "전체" },
  { value: "draft", label: "작성 중" },
  { value: "in_review", label: "검토 중" },
  { value: "completed", label: "완료" },
];

export default function SubNotesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">내 서브노트</h1>
          <p className="text-muted-foreground">
            학습 자료 관리 및 진행 상황 추적
          </p>
        </div>
        <Link href="/sub-notes/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            서브노트 작성
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="서브노트 검색..."
                  className="pl-9"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sub-notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subNotes.map((note) => (
          <Link key={note.id} href={`/sub-notes/${note.id}`}>
            <Card className="h-full transition-smooth hover:shadow-md hover:border-accent/40 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {note.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      <Badge
                        variant={
                          note.status === "completed"
                            ? "default"
                            : note.status === "in_review"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {note.status === "completed" ? "완료" : note.status === "in_review" ? "검토 중" : "작성 중"}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{note.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${
                          i < note.difficulty
                            ? "bg-accent"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State - uncomment when needed */}
      {/* {subNotes.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No sub-notes yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Start creating your first sub-note to organize your study materials.
            </p>
            <Link href="/sub-notes/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Sub-note
              </Button>
            </Link>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
