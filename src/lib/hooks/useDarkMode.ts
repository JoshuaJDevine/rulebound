/**
 * Dark mode hook with system preference detection and localStorage persistence
 */

import { useEffect, useMemo, useState } from "react";

type DarkMode = "light" | "dark" | "system";

export function useDarkMode() {
  const [mode, setMode] = useState<DarkMode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("darkMode") as DarkMode | null;
    return stored || "system";
  });

  // Compute resolved mode without setState
  const resolvedMode = useMemo((): "light" | "dark" => {
    if (mode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return mode;
  }, [mode]);

  // Apply to document
  useEffect(() => {
    if (resolvedMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save preference
    localStorage.setItem("darkMode", mode);
  }, [mode, resolvedMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // When in system mode, update DOM directly based on system preference
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  return {
    mode,
    resolvedMode,
    setMode,
    toggleDarkMode: () => {
      setMode((current) => {
        if (current === "system") {
          return resolvedMode === "dark" ? "light" : "dark";
        }
        return current === "dark" ? "light" : "dark";
      });
    },
  };
}
