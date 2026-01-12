/**
 * Chip Component
 * Small, tappable label for tags, filters, or related items
 */

import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  variant?: "default" | "interactive" | "selected" | "accent" | "primary";
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function Chip({
  label,
  variant = "default",
  icon,
  onRemove,
  onClick,
  className,
}: ChipProps) {
  const baseStyles =
    "inline-flex items-center gap-2 px-3 h-11 rounded-full text-sm border transition-all focus:ring-2 focus:ring-primary-500/50 focus:outline-none";

  const variantStyles = {
    default:
      "bg-neutral-200 border-neutral-300 text-neutral-900 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100",
    interactive:
      "bg-white border-neutral-300 text-neutral-900 hover:border-primary-500 cursor-pointer dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100",
    selected:
      "bg-primary-600 border-primary-600 text-white dark:bg-primary-500 dark:border-primary-500",
    accent:
      "bg-accent-100 border-accent-200 text-accent-800 dark:bg-accent-900/30 dark:border-accent-700 dark:text-accent-300",
    primary:
      "bg-primary-100 border-primary-200 text-primary-800 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300",
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      aria-label={label}
      {...(onClick && { type: "button" })}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          className="ml-1 -mr-1 hover:bg-black/10 rounded-full p-1 focus:ring-2 focus:ring-primary-500/50"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
          type="button"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </Component>
  );
}
