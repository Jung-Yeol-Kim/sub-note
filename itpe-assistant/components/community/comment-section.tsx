"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Heart, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { addComment, deleteComment, toggleCommentLike } from "@/app/community/actions";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  sharedSubNoteId: string;
  userId: string;
  userName: string | null;
  userImage: string | null;
  content: string;
  parentCommentId: string | null;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CommentSectionProps {
  sharedSubNoteId: string;
  initialComments: Comment[];
  currentUserId?: string;
}

export function CommentSection({
  sharedSubNoteId,
  initialComments,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment = await addComment(
        sharedSubNoteId,
        newComment,
        replyTo || undefined
      );
      setComments((prev) => [comment as Comment, ...prev]);
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const result = await toggleCommentLike(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: result.liked ? c.likes + 1 : c.likes - 1 }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
    }
  };

  // Separate parent comments and replies
  const parentComments = comments.filter((c) => !c.parentCommentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentCommentId === parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">댓글 {comments.length}</h3>
      </div>

      {/* New Comment Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {replyTo && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>답글 작성 중</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                  className="h-6 px-2"
                >
                  취소
                </Button>
              </div>
            )}
            <Textarea
              placeholder={
                currentUserId
                  ? "댓글을 작성하세요..."
                  : "댓글을 작성하려면 로그인이 필요합니다."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!currentUserId || isSubmitting}
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!currentUserId || !newComment.trim() || isSubmitting}
              >
                {isSubmitting ? "작성 중..." : "댓글 작성"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {parentComments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {comment.userImage ? (
                          <img
                            src={comment.userImage}
                            alt={comment.userName || "User"}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-accent/20 text-accent">
                            <span className="text-sm font-semibold">
                              {comment.userName?.[0] || "?"}
                            </span>
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {comment.userName || "익명"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </p>
                      </div>
                    </div>
                    {currentUserId === comment.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Comment Content */}
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment.id)}
                      disabled={!currentUserId}
                      className="h-8"
                    >
                      <Heart className="mr-1 h-3 w-3" />
                      {comment.likes > 0 && comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(comment.id)}
                      disabled={!currentUserId}
                      className="h-8"
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      답글
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies */}
            {getReplies(comment.id).map((reply) => (
              <Card key={reply.id} className="ml-12">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          {reply.userImage ? (
                            <img
                              src={reply.userImage}
                              alt={reply.userName || "User"}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-accent/20 text-accent">
                              <span className="text-xs font-semibold">
                                {reply.userName?.[0] || "?"}
                              </span>
                            </div>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {reply.userName || "익명"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </p>
                        </div>
                      </div>
                      {currentUserId === reply.userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(reply.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-sm whitespace-pre-wrap">{reply.content}</p>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(reply.id)}
                        disabled={!currentUserId}
                        className="h-8"
                      >
                        <Heart className="mr-1 h-3 w-3" />
                        {reply.likes > 0 && reply.likes}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {comments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-1">첫 댓글을 작성해보세요</h3>
            <p className="text-sm text-muted-foreground">
              이 서브노트에 대한 의견을 공유해주세요.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
