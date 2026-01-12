/**
 * RuleCard Component
 * Displays a rule in list views with hierarchy visual cues
 * Per designer specs: hierarchy indicated by number size, border color, and level badges
 */

import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface RuleCardProps {
  rule: RuleSection;
  onClick?: (id: string) => void;
  variant?: "default" | "compact" | "inline";
  showLevel?: boolean;
  showChildren?: boolean;
  className?: string;
}

// Get hierarchy-based styling per designer specs
function getHierarchyStyles(level: number) {
  const styles = {
    // Level 0 (Sections): Large, bold, primary-800
    0: {
      numberSize: "text-2xl",
      numberWeight: "font-extrabold",
      numberColor: "text-primary-800 dark:text-primary-300",
      borderColor: "border-l-primary-700",
      borderWidth: "border-l-4",
    },
    // Level 1 (Rules): Medium, semibold, primary-700
    1: {
      numberSize: "text-xl",
      numberWeight: "font-bold",
      numberColor: "text-primary-700 dark:text-primary-200",
      borderColor: "border-l-primary-600",
      borderWidth: "border-l-4",
    },
    // Level 2 (Sub-rules): Small, semibold, primary-700
    2: {
      numberSize: "text-lg",
      numberWeight: "font-semibold",
      numberColor: "text-primary-700 dark:text-primary-300",
      borderColor: "border-l-primary-500",
      borderWidth: "border-l-3",
    },
    // Level 3+ (Details): Extra small, normal, neutral-800
    default: {
      numberSize: "text-lg",
      numberWeight: "font-medium",
      numberColor: "text-neutral-800 dark:text-neutral-300",
      borderColor: "border-l-primary-400",
      borderWidth: "border-l-2",
    },
  };

  return level <= 2 ? styles[level as 0 | 1 | 2] : styles.default;
}

// Get level label for badge
function getLevelLabel(level: number): string {
  if (level === 0) return "Section";
  if (level === 1) return "Rule";
  if (level === 2) return "Sub-rule";
  return "Detail";
}

export function RuleCard({
  rule,
  onClick,
  variant = "default",
  showLevel = true,
  showChildren = true,
  className,
}: RuleCardProps) {
  const hierarchyStyles = getHierarchyStyles(rule.level);

  // Variants
  const isCompact = variant === "compact";
  const isInline = variant === "inline";

  // Preview: 2 lines max for default, 1 line for compact, none for inline
  const contentPreview = isInline
    ? null
    : rule.content.length > 150
      ? rule.content.slice(0, 150) + "..."
      : rule.content;

  const handleClick = () => {
    if (onClick) {
      onClick(rule.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onClick) {
      e.preventDefault();
      onClick(rule.id);
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-primary-700 transition-all",
        hierarchyStyles.borderColor,
        hierarchyStyles.borderWidth,
        !isInline &&
          "hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600",
        "focus-within:ring-4 focus-within:ring-primary-500 dark:focus-within:ring-accent-500 focus-within:ring-offset-2",
        isInline ? "border-0 p-2" : isCompact ? "p-3" : "p-4",
        className,
      )}
    >
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="w-full text-left focus:outline-none"
        aria-label={`Rule ${rule.number} ${rule.title}, Level ${rule.level}${rule.children.length > 0 ? `, ${rule.children.length} sub-rules` : ""}`}
        type="button"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Rule number and title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className={cn(
                  "font-mono flex-shrink-0",
                  hierarchyStyles.numberSize,
                  hierarchyStyles.numberWeight,
                  hierarchyStyles.numberColor,
                )}
              >
                {rule.number}
              </span>
              <h3
                className={cn(
                  "font-semibold text-neutral-900 dark:text-neutral-100",
                  isCompact ? "text-base" : "text-lg",
                )}
              >
                {rule.title}
              </h3>
            </div>

            {/* Level badge (optional) */}
            {showLevel && !isInline && (
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                  {getLevelLabel(rule.level)}
                </span>
              </div>
            )}

            {/* Content preview */}
            {contentPreview && !isCompact && (
              <p className="text-sm text-neutral-800 dark:text-neutral-300 line-clamp-2 mb-2">
                {contentPreview}
              </p>
            )}

            {/* Metadata: children count and cross-refs */}
            {showChildren &&
              (rule.children.length > 0 || rule.crossRefs.length > 0) && (
                <div className="flex items-center gap-3 text-xs text-neutral-800 dark:text-neutral-400">
                  {rule.children.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>
                        {rule.children.length}{" "}
                        {rule.children.length === 1 ? "detail" : "details"}
                      </span>
                    </span>
                  )}
                  {rule.crossRefs.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span>
                        {rule.crossRefs.length} cross-ref
                        {rule.crossRefs.length === 1 ? "" : "s"}
                      </span>
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>
      </button>
    </div>
  );
}
