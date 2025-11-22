"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <main className={cn("flex-1", !isLoginPage && "pl-64")}>
      <div className={cn(!isLoginPage && "container mx-auto p-6 lg:p-8")}>
        {children}
      </div>
    </main>
  );
}
