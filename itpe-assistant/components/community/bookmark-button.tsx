"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/app/community/actions";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  sharedSubNoteId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({
  sharedSubNoteId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleBookmark(sharedSubNoteId);
      setBookmarked(result.bookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={bookmarked ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "transition-all",
        bookmarked && "bg-yellow-500 hover:bg-yellow-600 text-white"
      )}
    >
      <Bookmark
        className={cn(
          "mr-2 h-4 w-4",
          bookmarked && "fill-current"
        )}
      />
      {bookmarked ? "북마크됨" : "북마크"}
    </Button>
  );
}
