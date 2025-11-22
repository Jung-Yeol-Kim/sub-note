"use client";

import * as React from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useThemeColor } from "@/hooks/use-theme-color";
import { themeColors } from "@/lib/theme-colors";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ColorPicker() {
  const { theme: currentTheme } = useTheme();
  const { themeColor, setThemeColor } = useThemeColor();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Get current color based on theme mode (light/dark)
  const getCurrentColor = (colorName: string) => {
    const color = themeColors.find((c) => c.name === colorName);
    if (!color) return "hsl(180, 80%, 27%)";

    const isDark = currentTheme === "dark";
    return isDark ? color.activeColor.dark : color.activeColor.light;
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  const currentColor = getCurrentColor(themeColor);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <div
            className="h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
          <span className="sr-only">색상 테마 선택</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>색상 테마</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeColors.map((color) => {
          const isActive = themeColor === color.name;
          const colorValue = getCurrentColor(color.name);

          return (
            <DropdownMenuItem
              key={color.name}
              onClick={() => setThemeColor(color.name)}
              className="flex items-center gap-3"
            >
              <div
                className="h-5 w-5 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0"
                style={{ backgroundColor: colorValue }}
              />
              <span className="flex-1">{color.label}</span>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
