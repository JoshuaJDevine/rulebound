/**
 * ViewModeToggle Component
 * Toggle between navigation (list) and reading modes
 * Segmented control with gold active state
 */

import { cn } from "@/lib/utils";

export interface ViewModeToggleProps {
  mode: "navigation" | "reading";
  onChange: (mode: "navigation" | "reading") => void;
  disabled?: boolean;
  className?: string;
}

export function ViewModeToggle({
  mode,
  onChange,
  disabled = false,
  className,
}: ViewModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex bg-neutral-100 dark:bg-primary-800 rounded-full p-0.5",
        className,
      )}
      role="group"
      aria-label="View mode"
    >
      <button
        onClick={() => onChange("navigation")}
        disabled={disabled}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-normal",
          "focus:outline-none focus:ring-2 focus:ring-accent-500",
          mode === "navigation"
            ? "bg-accent-500 text-primary-900 shadow-sm"
            : "text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-pressed={mode === "navigation"}
      >
        <span className="inline-flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          List
        </span>
      </button>
      <button
        onClick={() => onChange("reading")}
        disabled={disabled}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-normal",
          "focus:outline-none focus:ring-2 focus:ring-accent-500",
          mode === "reading"
            ? "bg-accent-500 text-primary-900 shadow-sm"
            : "text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-pressed={mode === "reading"}
      >
        <span className="inline-flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Read
        </span>
      </button>
    </div>
  );
}
