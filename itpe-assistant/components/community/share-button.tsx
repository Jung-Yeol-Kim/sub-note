"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareSubNote } from "@/app/community/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareButtonProps {
  subNoteId: string;
  subNoteTitle: string;
  isShared?: boolean;
}

export function ShareButton({
  subNoteId,
  subNoteTitle,
  isShared = false,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shared, setShared] = useState(isShared);

  const handleShare = async () => {
    setIsLoading(true);
    try {
      await shareSubNote(subNoteId);
      setShared(true);
      setOpen(false);
    } catch (error) {
      console.error("Failed to share sub-note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (shared) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Check className="mr-2 h-4 w-4" />
        공유됨
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          커뮤니티에 공유
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>커뮤니티에 공유하기</DialogTitle>
          <DialogDescription>
            "{subNoteTitle}" 서브노트를 커뮤니티에 공유하시겠습니까? 다른
            학습자들이 여러분의 노트를 볼 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="text-sm font-medium">공유 시 주의사항</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>공유된 노트는 누구나 볼 수 있습니다</li>
              <li>다른 사용자가 복사하여 사용할 수 있습니다</li>
              <li>개인정보나 민감한 정보는 제외해주세요</li>
              <li>이미 공유된 노트는 수정하면 자동으로 업데이트됩니다</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button onClick={handleShare} disabled={isLoading}>
            {isLoading ? "공유 중..." : "공유하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
