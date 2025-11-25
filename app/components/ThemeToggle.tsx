"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const hasDark = document.documentElement.classList.contains("dark");
    setIsDark(hasDark);
  }, []);

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
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
