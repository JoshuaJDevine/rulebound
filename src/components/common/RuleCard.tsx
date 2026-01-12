/**
 * RuleCard Component
 * Displays a rule in list views with preview
 */

import { cn } from '@/lib/utils';
import { formatTimestamp } from '@/lib/utils';
import type { Rule } from '@/types';
import { BookmarkButton } from './BookmarkButton';

export interface RuleCardProps {
  rule: Rule;
  showPreview?: boolean;
  showSection?: boolean;
  showTimestamp?: boolean;
  timestamp?: number;
  onClick?: () => void;
  className?: string;
}

export function RuleCard({
  rule,
  showPreview = true,
  showSection = true,
  showTimestamp = false,
  timestamp,
  onClick,
  className,
}: RuleCardProps) {
  return (
    <button
      className={cn(
        'w-full bg-white rounded-lg border border-neutral-200 p-4 text-left hover:shadow-md hover:border-primary-300 focus:ring-4 focus:ring-primary-500/50 focus:outline-none transition-all',
        className
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-lg font-semibold text-neutral-900">
          {rule.title}
        </h3>
        <BookmarkButton ruleId={rule.id} size="sm" />
      </div>

      {showPreview && (
        <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
          {rule.content}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        {showSection && <span>{rule.section}</span>}
        {showTimestamp && timestamp && (
          <>
            <span>•</span>
            <time dateTime={new Date(timestamp).toISOString()}>
              {formatTimestamp(timestamp)}
            </time>
          </>
        )}
      </div>
    </button>
  );
}
