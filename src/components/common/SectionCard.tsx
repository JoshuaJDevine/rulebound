/**
 * SectionCard Component
 * Display top-level sections (level 0) on home page in prominent, scannable format
 * Per designer specs: Large text, centered layout, elevated shadow
 */

import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface SectionCardProps {
  section: RuleSection; // level must be 0
  onClick: (sectionId: string) => void;
  variant?: "default" | "featured";
  className?: string;
}

export function SectionCard({
  section,
  onClick,
  variant = "default",
  className,
}: SectionCardProps) {
  const childCount = section.children.length;
  const isFeatured = variant === "featured";

  // Get description (first 3 lines max, ~200 chars)
  const description =
    section.content && section.content !== section.title
      ? section.content.length > 200
        ? section.content.slice(0, 200) + "..."
        : section.content
      : null;

  const handleClick = () => {
    onClick(section.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onClick(section.id);
    }
  };

  return (
    <button
      aria-label={`Section ${section.number} ${section.title}, contains ${childCount} ${childCount === 1 ? "rule" : "rules"}`}
      className={cn(
        "group w-full rounded-xl border text-center transition-all",
        "focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-offset-2",
        isFeatured
          ? "bg-gradient-to-br from-primary-100 via-primary-50 to-white border-primary-300 p-8 md:p-10 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
          : "bg-white border-neutral-200 p-6 md:p-8 shadow-lg hover:shadow-2xl hover:scale-102 active:scale-98",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
    >
      {/* Section Number - Large and prominent */}
      <div
        className={cn(
          "font-mono font-extrabold mb-3",
          isFeatured
            ? "text-5xl md:text-6xl text-primary-700"
            : "text-4xl text-primary-600",
        )}
      >
        {section.number}
      </div>

      {/* Section Title - Bold heading */}
      <h3
        className={cn(
          "font-bold text-neutral-900 mb-3",
          isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
        )}
      >
        {section.title}
      </h3>

      {/* Description - 3 lines max */}
      {description && (
        <p
          className={cn(
            "text-neutral-600 mb-4 mx-auto line-clamp-3",
            isFeatured ? "text-base max-w-lg" : "text-sm max-w-md",
          )}
        >
          {description}
        </p>
      )}

      {/* Child count - Metadata */}
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
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
          {childCount} {childCount === 1 ? "rule" : "rules"}
        </span>
      </div>
    </button>
  );
}
