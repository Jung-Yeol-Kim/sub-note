"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  Sparkles,
  Users,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ColorPicker } from "@/components/color-picker";

const navigationItems = [
  {
    title: "대시보드",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "내 서브노트",
    href: "/sub-notes",
    icon: BookOpen,
  },
  {
    title: "시험 주제",
    href: "/topics",
    icon: FileText,
  },
  {
    title: "커뮤니티",
    href: "/community",
    icon: Users,
  },
  {
    title: "AI 추천",
    href: "/ai-suggestions",
    icon: Sparkles,
  },
  {
    title: "평가",
    href: "/evaluations",
    icon: ClipboardCheck,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/95">
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#3d5a4c] to-[#2d4a3c]">
              <span className="text-sm font-bold text-[#f5e6d3]">IT</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-semibold leading-none text-sidebar-foreground">
                ITPE Assistant
              </span>
              <span className="text-[10px] text-sidebar-foreground/60">정보관리기술사</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-sidebar-foreground/60">계정</span>
            <AuthButton />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/settings"
              className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Settings className="h-4 w-4 text-sidebar-foreground/60" />
              <span>설정</span>
            </Link>
            <ColorPicker />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}
