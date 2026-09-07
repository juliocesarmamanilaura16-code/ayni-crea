"use use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("ayni-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ayni-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-xl border border-border bg-white/60 backdrop-blur",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "relative w-9 h-9 rounded-xl border border-border bg-white/60 backdrop-blur grid place-items-center text-secondary hover:shadow-card hover:bg-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none dark:bg-neutral-900/60 dark:text-white dark:hover:bg-neutral-800",
        className
      )}
    >
      <Sun className={cn("w-[18px] h-[18px] absolute transition-all duration-300", theme === "dark" ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0")} />
      <Moon className={cn("w-[18px] h-[18px] absolute transition-all duration-300", theme === "dark" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90")} />
    </button>
  );
}
