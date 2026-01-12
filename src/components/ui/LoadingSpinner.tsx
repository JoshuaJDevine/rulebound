/**
 * LoadingSpinner Component
 * Indicates loading state with accessibility support
 */

import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "page";
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  variant = "inline",
  label = "Loading",
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        variant === "page" && "min-h-screen",
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600",
          sizeStyles[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
