"use client";

import * as React from "react";
import { themeColors, type ThemeColor } from "@/lib/theme-colors";

const THEME_COLOR_KEY = "theme-color";

type ThemeColorProviderProps = {
  children: React.ReactNode;
  defaultThemeColor?: ThemeColor;
};

type ThemeColorProviderState = {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
};

const ThemeColorContext = React.createContext<
  ThemeColorProviderState | undefined
>(undefined);

export function ThemeColorProvider({
  children,
  defaultThemeColor = "scholars-spectrum",
}: ThemeColorProviderProps) {
  const [themeColor, setThemeColorState] = React.useState<ThemeColor>(
    () =>
      (typeof window !== "undefined"
        ? (localStorage.getItem(THEME_COLOR_KEY) as ThemeColor)
        : defaultThemeColor) || defaultThemeColor
  );

  const setThemeColor = React.useCallback((color: ThemeColor) => {
    setThemeColorState(color);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_COLOR_KEY, color);
    }
  }, []);

  // Apply theme color CSS variables
  React.useEffect(() => {
    const root = document.documentElement;

    // Remove all theme color classes
    themeColors.forEach((color) => {
      root.classList.remove(`theme-${color.name}`);
    });

    // Add current theme color class
    root.classList.add(`theme-${themeColor}`);
  }, [themeColor]);

  const value = React.useMemo(
    () => ({
      themeColor,
      setThemeColor,
    }),
    [themeColor, setThemeColor]
  );

  return (
    <ThemeColorContext.Provider value={value}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = React.useContext(ThemeColorContext);

  if (context === undefined) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider");
  }

  return context;
}
