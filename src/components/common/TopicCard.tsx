/**
 * TopicCard Component
 * Display topic headers (level 1) with expand/navigate options
 * Gold left border, Cinzel title, expandable
 */

import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface TopicCardProps {
  rule: RuleSection;
  expanded?: boolean;
  onToggle?: () => void;
  onNavigate?: (ruleId: string) => void;
  onEnterReadingMode?: () => void;
  className?: string;
}

export function TopicCard({
  rule,
  expanded = false,
  onToggle,
  onNavigate,
  onEnterReadingMode,
  className,
}: TopicCardProps) {
  const childCount = rule.children.length;
  const hasChildren = childCount > 0;

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(rule.id);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) {
      onToggle();
    }
  };

  const handleReadingMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnterReadingMode) {
      onEnterReadingMode();
    }
  };

  return (
    <div
      className={cn(
        "rounded-md border border-neutral-200 bg-white transition-all duration-normal",
        "border-l-4 border-l-accent-500 hover:border-l-accent-400",
        "hover:shadow-md dark:bg-neutral-800 dark:border-primary-700 dark:border-l-accent-500",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Number and Title */}
          <button
            onClick={handleNavigate}
            className="flex-1 text-left focus:outline-none focus:ring-2 focus:ring-accent-500 rounded"
          >
            <div className="font-mono text-base font-semibold text-accent-600 mb-1 dark:text-accent-400">
              {rule.number}
            </div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-primary-900 dark:text-neutral-100">
              {rule.title}
            </h3>
          </button>

          {/* Right: Child count and badge */}
          <div className="flex flex-col items-end gap-2">
            {hasChildren && (
              <div className="text-sm text-neutral-700 dark:text-neutral-300 font-body">
                {childCount} {childCount === 1 ? "rule" : "rules"}
              </div>
            )}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300">
              Topic
            </span>
          </div>
        </div>

        {/* Action buttons */}
        {hasChildren && (
          <div className="mt-4 flex items-center gap-2">
            {onToggle && (
              <button
                onClick={handleToggle}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium",
                  "border border-neutral-300 bg-transparent text-neutral-700",
                  "hover:bg-neutral-100 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-accent-500",
                  "dark:border-primary-600 dark:text-neutral-200 dark:hover:bg-primary-800",
                )}
              >
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expanded && "rotate-180",
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {expanded ? "Collapse" : "Expand"}
              </button>
            )}
            {onEnterReadingMode && (
              <button
                onClick={handleReadingMode}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium",
                  "bg-accent-500 text-primary-900 hover:bg-accent-400",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500",
                )}
              >
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
