import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeft,
  Eye,
  Calendar,
  User,
  Tag,
  BookOpen,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSharedSubNote, getComments } from "../actions";
import { LikeButton } from "@/components/community/like-button";
import { BookmarkButton } from "@/components/community/bookmark-button";
import { DownloadButton } from "@/components/community/download-button";
import { CommentSection } from "@/components/community/comment-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sharedSubNote = await getSharedSubNote(id);

  if (!sharedSubNote) {
    notFound();
  }

  const comments = await getComments(id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Back Button */}
      <div>
        <Button variant="ghost" asChild>
          <Link href="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            커뮤니티로 돌아가기
          </Link>
        </Button>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {sharedSubNote.category && (
              <Badge variant="secondary">{sharedSubNote.category}</Badge>
            )}
            {sharedSubNote.difficulty && (
              <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i < sharedSubNote.difficulty!
                        ? "bg-accent"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{sharedSubNote.views} 조회</span>
            </div>
          </div>

          {/* Title */}
          <CardTitle className="text-3xl mb-4">
            {sharedSubNote.title}
          </CardTitle>

          {/* Author & Date */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-accent">
                  {sharedSubNote.userName?.[0] || "?"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{sharedSubNote.userName || "익명"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(sharedSubNote.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
            </div>
            {sharedSubNote.updatedAt &&
              sharedSubNote.updatedAt.toString() !==
                sharedSubNote.createdAt.toString() && (
                <span className="text-xs">(수정됨)</span>
              )}
          </div>

          {/* Tags */}
          {sharedSubNote.tags && sharedSubNote.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {sharedSubNote.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="mt-6" />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <LikeButton
              sharedSubNoteId={id}
              initialLiked={sharedSubNote.userLiked}
              initialLikes={sharedSubNote.likes}
            />
            <BookmarkButton
              sharedSubNoteId={id}
              initialBookmarked={sharedSubNote.userBookmarked}
            />
            <DownloadButton
              sharedSubNoteId={id}
              downloads={sharedSubNote.downloads}
            />
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              공유
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {sharedSubNote.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">좋아요</span>
                <span className="font-medium">{sharedSubNote.likes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">조회수</span>
                <span className="font-medium">{sharedSubNote.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">다운로드</span>
                <span className="font-medium">{sharedSubNote.downloads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">댓글</span>
                <span className="font-medium">{comments.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              작성자 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="font-semibold text-accent">
                    {sharedSubNote.userName?.[0] || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{sharedSubNote.userName || "익명"}</p>
                  <p className="text-xs text-muted-foreground">
                    커뮤니티 기여자
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comments Section */}
      <Card>
        <CardContent className="pt-6">
          <CommentSection
            sharedSubNoteId={id}
            initialComments={comments as any}
            currentUserId={session?.user?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
