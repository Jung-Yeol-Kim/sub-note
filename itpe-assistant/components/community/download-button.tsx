"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadSubNote } from "@/app/community/actions";
import { useRouter } from "next/navigation";

interface DownloadButtonProps {
  sharedSubNoteId: string;
  downloads: number;
}

export function DownloadButton({
  sharedSubNoteId,
  downloads,
}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await downloadSubNote(sharedSubNoteId);
      router.push("/sub-notes");
    } catch (error) {
      console.error("Failed to download sub-note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
    >
      <Download className="mr-2 h-4 w-4" />
      복사 ({downloads})
    </Button>
  );
}
