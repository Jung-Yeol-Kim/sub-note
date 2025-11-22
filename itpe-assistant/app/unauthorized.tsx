import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Home, LogIn } from "lucide-react";

/**
 * Unauthorized Page (401)
 *
 * This page is automatically rendered when the unauthorized() function is called.
 * Next.js will return a 401 status code.
 *
 * Usage in Server Components:
 * ```tsx
 * import { unauthorized } from 'next/navigation'
 *
 * export default async function DashboardPage() {
 *   const session = await verifySession()
 *   if (!session) {
 *     unauthorized()  // Triggers this page
 *   }
 *   return <div>Dashboard</div>
 * }
 * ```
 *
 * Note: This is an experimental feature (v15.1.0+)
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized
 */
export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full shadow-lg border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold font-serif">401</CardTitle>
            <CardDescription className="text-lg">
              인증이 필요합니다
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            이 페이지에 접근하려면 로그인이 필요합니다.
            계정이 없다면 회원가입을 진행해주세요.
          </p>

          <div className="p-4 rounded-lg bg-muted border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">가능한 원인:</strong>
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>로그인하지 않았습니다</li>
              <li>세션이 만료되었습니다</li>
              <li>인증 토큰이 유효하지 않습니다</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              asChild
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
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
              계정이 없으신가요?{" "}
              <Link href="/signup" className="text-accent hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
