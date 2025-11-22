import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

/**
 * 404 Not Found Page
 *
 * This page is automatically rendered when:
 * - A route doesn't exist
 * - notFound() function is called
 *
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="max-w-md w-full shadow-lg border-accent/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
              <FileQuestion className="h-10 w-10 text-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold font-serif">404</CardTitle>
            <CardDescription className="text-lg">
              페이지를 찾을 수 없습니다
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            URL을 확인하시거나 홈으로 돌아가세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전 페이지
              </Link>
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
              을 확인하세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
