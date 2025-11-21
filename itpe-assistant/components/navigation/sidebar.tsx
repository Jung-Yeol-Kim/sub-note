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

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "My Sub-notes",
    href: "/sub-notes",
    icon: BookOpen,
  },
  {
    title: "Exam Topics",
    href: "/topics",
    icon: FileText,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
  },
  {
    title: "AI Suggestions",
    href: "/ai-suggestions",
    icon: Sparkles,
  },
  {
    title: "Evaluations",
    href: "/evaluations",
    icon: ClipboardCheck,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-stone-200 bg-[#faf8f5] backdrop-blur supports-[backdrop-filter]:bg-[#faf8f5]/95">
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="flex h-16 items-center border-b border-stone-200 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#3d5a4c] to-[#2d4a3c]">
              <span className="text-sm font-bold text-[#f5e6d3]">IT</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-semibold leading-none text-stone-900">
                ITPE Assistant
              </span>
              <span className="text-[10px] text-stone-500">정보관리기술사</span>
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
                    ? "bg-[#3d5a4c] text-white shadow-sm"
                    : "text-stone-700 hover:bg-stone-100/60 hover:text-stone-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-stone-500 group-hover:text-stone-700"
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-stone-200 p-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition-all hover:bg-stone-100/60 hover:text-stone-900"
          >
            <Settings className="h-4 w-4 text-stone-500" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
