/**
 * Button Component
 * Primary interactive element with Riftbound branding
 * Gold primary, updated variants
 */

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "ghost-dark" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  children,
  ariaLabel,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md font-body font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    // Primary - Gold accent
    primary:
      "bg-accent-500 text-primary-900 hover:bg-accent-400 focus:ring-accent-500 dark:bg-accent-500 dark:text-primary-900",
    // Secondary - Outlined
    secondary:
      "bg-transparent border border-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-400 focus:ring-neutral-500 dark:border-primary-600 dark:text-neutral-200 dark:hover:bg-primary-800",
    // Ghost - Minimal (light backgrounds)
    ghost:
      "bg-transparent text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-500 dark:text-neutral-300 dark:hover:bg-primary-800",
    // Ghost Dark - For dark backgrounds (header, nav)
    "ghost-dark":
      "bg-transparent text-primary-100 hover:bg-primary-800 hover:text-white focus:ring-accent-500",
    // Danger - Error actions
    danger: "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        <>
          {icon && <span aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
