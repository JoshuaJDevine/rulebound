/**
 * RuleLink Component
 * Inline cross-reference link with preview tooltip
 * Gold link color, popover on hover
 */

import { cn } from "@/lib/utils";
import { useState } from "react";

export interface RuleLinkProps {
  ruleId: string;
  displayText?: string;
  showPreview?: boolean;
  previewTitle?: string;
  previewContent?: string;
  onNavigate?: (ruleId: string) => void;
  className?: string;
}

export function RuleLink({
  ruleId,
  displayText,
  showPreview = true,
  previewTitle,
  previewContent,
  onNavigate,
  className,
}: RuleLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(ruleId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(ruleId);
      }
    }
  };

  return (
    <span className="relative inline-block">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          "font-body text-accent-600 dark:text-accent-400",
          "underline decoration-dotted underline-offset-2",
          "hover:text-accent-500 hover:decoration-solid",
          "focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-sm",
          "transition-colors cursor-pointer",
          className,
        )}
        type="button"
      >
        {displayText || `rule ${ruleId}`}
      </button>

      {/* Preview Tooltip */}
      {showPreview && showTooltip && (previewTitle || previewContent) && (
        <div
          className={cn(
            "absolute z-50 w-80 p-4 mt-2 left-0",
            "bg-white dark:bg-neutral-800",
            "border border-neutral-200 dark:border-primary-700",
            "rounded-md shadow-lg",
            "pointer-events-none",
          )}
          role="tooltip"
        >
          {previewTitle && (
            <div className="font-display text-base font-semibold text-primary-900 dark:text-neutral-100 mb-2">
              {previewTitle}
            </div>
          )}
          {previewContent && (
            <div className="font-body text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
              {previewContent}
            </div>
          )}
          <div className="mt-2 text-xs text-accent-600 dark:text-accent-400 font-medium">
            Click to view full rule →
          </div>
        </div>
      )}
    </span>
  );
}
