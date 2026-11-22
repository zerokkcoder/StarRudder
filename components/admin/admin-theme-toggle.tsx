"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "star-rudder-admin-theme";

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.getElementById("admin-root")?.setAttribute("data-theme", next);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(KEY, next);
    document.getElementById("admin-root")?.setAttribute("data-theme", next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "后台切换到浅色" : "后台切换到深色"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
