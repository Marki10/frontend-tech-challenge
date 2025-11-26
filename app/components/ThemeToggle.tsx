"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    if (nextIsDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setIsDark(nextIsDark);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      data-testid="theme-toggle"
    >
      {isDark ? (
        <Sun className="h-4 w-4" data-testid="sun-icon" />
      ) : (
        <Moon className="h-4 w-4" data-testid="moon-icon" />
      )}
    </Button>
  );
}
