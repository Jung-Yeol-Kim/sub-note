"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/app/community/actions";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  sharedSubNoteId: string;
  initialLiked: boolean;
  initialLikes: number;
}

export function LikeButton({
  sharedSubNoteId,
  initialLiked,
  initialLikes,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleLike(sharedSubNoteId);
      setLiked(result.liked);
      setLikes((prev) => (result.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "transition-all",
        liked && "bg-red-500 hover:bg-red-600 text-white"
      )}
    >
      <Heart
        className={cn(
          "mr-2 h-4 w-4",
          liked && "fill-current"
        )}
      />
      {likes}
    </Button>
  );
}
