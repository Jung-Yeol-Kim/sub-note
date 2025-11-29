"use client";

/**
 * Original Image Viewer Component
 * 원본 답안지 이미지를 보여주는 Dialog 컴포넌트
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OriginalImageViewerProps {
  imageUrls: string[];
  trigger?: React.ReactNode;
}

export function OriginalImageViewer({ imageUrls, trigger }: OriginalImageViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  if (imageUrls.length === 0) {
    return null;
  }

  const totalPages = imageUrls.length;
  const currentImageUrl = imageUrls[currentPage - 1];

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    setZoom(100); // Reset zoom
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    setZoom(100); // Reset zoom
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `답안지-페이지-${currentPage}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 25));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 25));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            원본 이미지 보기
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>
                원본 이미지 (페이지 {currentPage}/{totalPages})
              </DialogTitle>
              <DialogDescription>
                스캔/촬영한 답안지 원본
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2 min-w-[4rem] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Download Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Image Container */}
        <div className="flex-1 overflow-auto bg-muted/30 rounded-md p-4">
          <div className="flex justify-center items-start min-h-full">
            <img
              src={currentImageUrl}
              alt={`답안지 페이지 ${currentPage}`}
              className="max-w-full h-auto rounded-md shadow-lg transition-transform"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              이전
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </div>

            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              다음
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
