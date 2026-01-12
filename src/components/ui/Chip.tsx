/**
 * Chip Component
 * Small, tappable label for tags, filters, or related items
 */

import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  variant?: "default" | "interactive" | "selected";
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
    default: "bg-neutral-100 border-neutral-200 text-neutral-700",
    interactive:
      "bg-white border-neutral-300 text-neutral-900 hover:border-primary-500 cursor-pointer",
    selected: "bg-primary-600 border-primary-600 text-white",
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
