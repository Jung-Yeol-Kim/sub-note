"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import type React from "react";
import { FloatingPaths } from "@/components/floating-paths";
import { authClient } from "@/lib/auth-client";

export function AuthPage() {
	const handleGoogleLogin = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/",
		});
	};

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
				<Logo className="mr-auto h-5" />

				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl">
							&ldquo;Claude AI가 함께하는 체계적인 학습 여정&rdquo;
						</p>
						<footer className="font-mono font-semibold text-sm">
							~ ITPE Assistant
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>
			<div className="relative flex min-h-screen flex-col justify-center p-4">
				<div
					aria-hidden
					className="-z-10 absolute inset-0 isolate opacity-60 contain-strict"
				>
					<div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
					<div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
					<div className="-translate-y-87.5 absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
				</div>
				<Button asChild className="absolute top-7 left-5" variant="ghost">
					<a href="/">
						<ChevronLeftIcon />
						홈으로
					</a>
				</Button>
				<div className="mx-auto space-y-4 sm:w-sm">
					<Logo className="h-5 lg:hidden" />
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							ITPE Assistant에 오신 것을 환영합니다
						</h1>
						<p className="text-base text-muted-foreground">
							정보관리기술사 학습을 위한 AI 어시스턴트
						</p>
					</div>
					<div className="space-y-2">
						<Button
							className="w-full"
							size="lg"
							type="button"
							onClick={handleGoogleLogin}
						>
							<GoogleIcon />
							Google로 로그인
						</Button>
					</div>
					<p className="mt-8 text-muted-foreground text-sm">
						로그인하면{" "}
						<a
							className="underline underline-offset-4 hover:text-primary"
							href="#"
						>
							서비스 이용약관
						</a>{" "}
						및{" "}
						<a
							className="underline underline-offset-4 hover:text-primary"
							href="#"
						>
							개인정보 처리방침
						</a>
						에 동의하는 것으로 간주됩니다.
					</p>
				</div>
			</div>
		</main>
	);
}

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
	<svg
		fill="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g>
			<path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
		</g>
	</svg>
);
