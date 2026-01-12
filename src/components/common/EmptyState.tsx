/**
 * EmptyState Component
 * Communicates when no content is available
 */

import { Button } from "@/components/ui";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4" aria-hidden="true">
        {icon}
      </div>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h2>

      <p className="text-neutral-700 dark:text-neutral-300 mb-6 max-w-sm">
        {description}
      </p>

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
