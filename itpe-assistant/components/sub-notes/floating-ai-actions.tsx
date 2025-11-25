"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  FileSearch,
  KeyRound,
  Lightbulb,
  GitCompare,
} from "lucide-react";
import Link from "next/link";

interface FloatingAiActionsProps {
  subNoteId: string;
}

export function FloatingAiActions({ subNoteId }: FloatingAiActionsProps) {
  return (
    <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            size="icon"
          >
            <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            <span className="sr-only">AI 도움받기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI 도움받기
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/evaluations/new?subNoteId=${subNoteId}`} className="cursor-pointer">
              <FileSearch className="h-4 w-4" />
              <span>평가 요청</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/keywords/analyze?subNoteId=${subNoteId}`} className="cursor-pointer">
              <KeyRound className="h-4 w-4" />
              <span>키워드 분석</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/suggestions?subNoteId=${subNoteId}`} className="cursor-pointer">
              <Lightbulb className="h-4 w-4" />
              <span>개선 제안</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/sub-notes/${subNoteId}/compare`} className="cursor-pointer">
              <GitCompare className="h-4 w-4" />
              <span>버전 비교</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
