/**
 * SectionCard Component
 * Navigational card to browse rules by section
 */

import { cn } from "@/lib/utils";
import type { Section } from "@/types";

export interface SectionCardProps {
  section: Section;
  onClick: (sectionId: string) => void;
  className?: string;
}

export function SectionCard({ section, onClick, className }: SectionCardProps) {
  return (
    <button
      className={cn(
        "w-full bg-gradient-to-br from-primary-50 to-white rounded-xl border border-neutral-200 p-6 text-center hover:shadow-lg hover:border-primary-300 focus:ring-4 focus:ring-primary-500/50 focus:outline-none transition-all min-h-[120px] flex flex-col items-center justify-center",
        className,
      )}
      onClick={() => onClick(section.id)}
      aria-label={`Browse ${section.title} (${section.rules.length} rules)`}
      type="button"
    >
      {section.icon && (
        <div className="text-4xl mb-3" aria-hidden="true">
          {section.icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
        {section.title}
      </h3>

      <p className="text-sm text-neutral-600">
        {section.rules.length} {section.rules.length === 1 ? "rule" : "rules"}
      </p>
    </button>
  );
}
