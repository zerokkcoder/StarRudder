"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // SSR 默认浅色；仅当用户明确保存过深色时才切换（避免刷新闪黑）
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("star-rudder-theme");
    const next = saved === "dark";
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("star-rudder-theme", next ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
