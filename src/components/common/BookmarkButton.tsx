/**
 * BookmarkButton Component
 * Toggle bookmark status for a rule
 */

import { cn } from "@/lib/utils";
import { useRulesStore } from "@/store/rulesStore";

export interface BookmarkButtonProps {
  ruleId: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function BookmarkButton({
  ruleId,
  size = "md",
  showLabel = false,
  className,
}: BookmarkButtonProps) {
  const { bookmarks, addBookmark, removeBookmark } = useRulesStore();
  const isBookmarked = bookmarks.some((b) => b.ruleId === ruleId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      removeBookmark(ruleId);
    } else {
      addBookmark(ruleId);
    }
  };

  const sizeStyles = {
    sm: "h-11 w-11",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-all hover:scale-110 focus:ring-4 focus:ring-primary-500/50 focus:outline-none",
        sizeStyles[size],
        isBookmarked
          ? "text-primary-600 hover:text-primary-700"
          : "text-neutral-400 hover:text-neutral-600",
        className,
      )}
      onClick={handleToggle}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this rule"}
      aria-pressed={isBookmarked}
      type="button"
    >
      {isBookmarked ? (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ) : (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
      {showLabel && (
        <span className="ml-2 text-sm">
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </button>
  );
}
