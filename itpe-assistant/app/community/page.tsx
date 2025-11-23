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
import {
  Search,
  Users,
  Heart,
  Eye,
  Download,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getSharedSubNotes } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const categories = [
  "전체",
  "정보 전략 및 관리",
  "소프트웨어공학",
  "업무 프로세스",
  "정보시스템구축관리",
  "정보보안",
  "데이터베이스",
  "네트워크",
  "최신기술",
];

const difficulties = [
  { value: "all", label: "전체" },
  { value: "1", label: "⭐ 매우 쉬움" },
  { value: "2", label: "⭐⭐ 쉬움" },
  { value: "3", label: "⭐⭐⭐ 보통" },
  { value: "4", label: "⭐⭐⭐⭐ 어려움" },
  { value: "5", label: "⭐⭐⭐⭐⭐ 매우 어려움" },
];

const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "views", label: "조회순" },
];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sortBy = (typeof params.sortBy === "string" ? params.sortBy : "latest") as "latest" | "popular" | "views";

  // Fetch shared sub-notes
  const sharedSubNotes = await getSharedSubNotes({
    category: category && category !== "전체" ? category : undefined,
    search,
    sortBy,
    limit: 50,
  });

  // Calculate statistics
  const totalLikes = sharedSubNotes.reduce((sum, note) => sum + note.likes, 0);
  const totalViews = sharedSubNotes.reduce((sum, note) => sum + note.views, 0);
  const totalDownloads = sharedSubNotes.reduce((sum, note) => sum + note.downloads, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">커뮤니티</h1>
          <p className="text-muted-foreground">
            학습자들이 공유한 서브노트를 탐색하고 배우세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <Sparkles className="mr-2 h-4 w-4" />
            추천 노트
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">공유 노트</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedSubNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              총 서브노트
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">좋아요</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              커뮤니티 반응
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">조회수</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              총 조회수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">다운로드</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              복사된 노트
            </p>
          </CardContent>
        </Card>
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
                  name="search"
                  defaultValue={search}
                />
              </div>
            </div>
            <Select defaultValue={category || "전체"} name="category">
              <SelectTrigger className="w-full md:w-[200px]">
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
            <Select defaultValue="all" name="difficulty">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="난이도" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue={sortBy} name="sortBy">
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shared Sub-Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sharedSubNotes.map((note) => (
          <Link key={note.id} href={`/community/${note.id}`}>
            <Card className="h-full transition-smooth hover:shadow-md hover:border-accent/40 cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {note.category || "미분류"}
                  </Badge>
                  {typeof note.difficulty === "number" && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const filled = i < (note.difficulty as number);
                        return (
                          <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              filled ? "bg-accent" : "bg-muted"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                  {note.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {note.content.slice(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Author and Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-accent">
                          {note.userName?.[0] || "?"}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {note.userName || "익명"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{note.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{note.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>{note.downloads}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(note.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sharedSubNotes.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">공유된 노트가 없습니다</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              아직 공유된 서브노트가 없습니다. 첫 번째로 여러분의 노트를 공유해보세요!
            </p>
            <Button asChild>
              <Link href="/sub-notes">
                내 서브노트 보기
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
