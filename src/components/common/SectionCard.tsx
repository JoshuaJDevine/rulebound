/**
 * SectionCard Component
 * Display top-level sections (level 0) with Riftbound branding
 * Dark blue gradient background, gold numbers, section icons
 */

import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface SectionCardProps {
  section: RuleSection; // level must be 0
  onClick: (sectionId: string) => void;
  icon?: React.ReactNode;
  className?: string;
}

// Section icon mapping based on section number
const getSectionIcon = (number: string): string => {
  const sectionNum = parseInt(number);
  if (sectionNum === 0) return "📖"; // Glossary
  if (sectionNum >= 100 && sectionNum < 200) return "🎮"; // The Game
  if (sectionNum >= 200 && sectionNum < 300) return "🃏"; // Cards
  if (sectionNum >= 300 && sectionNum < 400) return "🔄"; // Turns
  if (sectionNum >= 400 && sectionNum < 500) return "⏱️"; // Phases
  if (sectionNum >= 500 && sectionNum < 600) return "⚔️"; // Combat
  if (sectionNum >= 600 && sectionNum < 700) return "✨"; // Abilities
  if (sectionNum >= 700 && sectionNum < 800) return "🏷️"; // Keywords
  return "📋"; // Default
};

export function SectionCard({
  section,
  onClick,
  icon,
  className,
}: SectionCardProps) {
  const childCount = section.children.length;
  const sectionIcon = icon || getSectionIcon(section.number);

  const handleClick = () => {
    onClick(section.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(section.id);
    }
  };

  return (
    <button
      aria-label={`Section ${section.number} ${section.title}, contains ${childCount} ${childCount === 1 ? "rule" : "rules"}`}
      className={cn(
        "group w-full rounded-lg p-6 text-left transition-all duration-normal",
        "bg-gradient-primary text-white shadow-lg",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "focus:outline-none focus:ring-4 focus:ring-accent-500 dark:focus:ring-accent-400",
        "active:translate-y-0",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
    >
      {/* Icon - circular container */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4 text-2xl">
        {sectionIcon}
      </div>

      {/* Section Number - Gold, mono font */}
      <div className="font-mono text-xl font-semibold text-accent-400 mb-2">
        {section.number}
      </div>

      {/* Section Title - Cinzel display font */}
      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 uppercase tracking-wide">
        {section.title}
      </h3>

      {/* Child count - Light text */}
      <div className="font-body text-sm text-primary-200">
        {childCount} {childCount === 1 ? "rule" : "rules"}
      </div>
    </button>
  );
}
