/**
 * RuleListItem Component
 * Compact, scannable rule items (level 2) for inside sections
 * Blue-gray left border, minimal padding
 */

import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface RuleListItemProps {
  rule: RuleSection;
  onClick?: (ruleId: string) => void;
  showPreview?: boolean;
  className?: string;
}

export function RuleListItem({
  rule,
  onClick,
  showPreview = true,
  className,
}: RuleListItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(rule.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) {
        onClick(rule.id);
      }
    }
  };

  // Get preview content
  const previewContent =
    showPreview && rule.content
      ? rule.content.length > 120
        ? rule.content.slice(0, 120) + "..."
        : rule.content
      : rule.title;

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full rounded text-left transition-colors duration-fast",
        "bg-neutral-50 hover:bg-neutral-100 border-l-2 border-l-primary-300",
        "px-4 py-3 flex items-center gap-3",
        "focus:outline-none focus:ring-2 focus:ring-accent-500",
        "dark:bg-neutral-800 dark:hover:bg-primary-800 dark:border-l-primary-500",
        className,
      )}
      type="button"
    >
      {/* Rule Number */}
      <div className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400 flex-shrink-0 min-w-[60px]">
        {rule.number}
      </div>

      {/* Content Preview */}
      <div className="flex-1 min-w-0">
        <div className="font-body text-base text-neutral-900 dark:text-neutral-200 truncate">
          {previewContent}
        </div>
      </div>

      {/* Arrow indicator */}
      <svg
        className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0"
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
  );
}
