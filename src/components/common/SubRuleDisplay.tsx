/**
 * SubRuleDisplay Component
 * Display nested sub-rules (level 3+) inline within parent content
 * Gray continuation line, small text
 */

import { cn } from "@/lib/utils";
import type { RuleSection } from "@/types";

export interface SubRuleDisplayProps {
  rule: RuleSection;
  depth?: number;
  className?: string;
}

export function SubRuleDisplay({
  rule,
  depth = 1,
  className,
}: SubRuleDisplayProps) {
  return (
    <div
      className={cn(
        "flex gap-2 py-2 border-l border-neutral-300 dark:border-primary-700 ml-4",
        className,
      )}
      style={{ paddingLeft: `calc(1.5rem * ${depth})` }}
    >
      {/* Sub-rule number */}
      <div className="font-mono text-sm font-medium text-neutral-700 dark:text-neutral-400 flex-shrink-0">
        {rule.number}
      </div>

      {/* Sub-rule content */}
      <div className="font-body text-sm text-neutral-900 dark:text-neutral-200 flex-1">
        {rule.content || rule.title}
      </div>
    </div>
  );
}
