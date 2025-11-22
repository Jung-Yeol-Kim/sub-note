"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Error Boundary Component
 *
 * This component catches errors that occur during rendering, in event handlers,
 * and in lifecycle methods throughout the app.
 *
 * Must be a Client Component with 'use client' directive.
 *
 * Props:
 * - error: Error object containing message and digest
 * - reset: Function to attempt recovery by re-rendering the segment
 *
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="max-w-md w-full shadow-lg border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold font-serif">
              오류가 발생했습니다
            </CardTitle>
            <CardDescription className="text-base">
              예기치 않은 문제가 발생했습니다
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <p className="text-sm text-muted-foreground font-mono break-words">
              {error.message || "알 수 없는 오류가 발생했습니다"}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                오류 ID: {error.digest}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            일시적인 문제일 수 있습니다. 다시 시도하거나 홈으로 돌아가세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => reset()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              asChild
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              문제가 계속되면{" "}
              <Link href="/help" className="text-accent hover:underline">
                도움말
              </Link>
              을 확인하거나 관리자에게 문의하세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
