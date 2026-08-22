"use client";

import { useState, useTransition } from "react";
import { setTheme as persistTheme } from "@/lib/actions/theme";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [, startTransition] = useTransition();
  const isDark = theme === "dark";

  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      persistTheme(next);
    });
  };

  return (
    <div className="flex h-12 w-full items-center justify-between px-4">
      <span className="text-ink-900 text-sm">다크 모드</span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="다크 모드 전환"
        onClick={toggle}
        className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
          isDark ? "bg-brand-600" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
