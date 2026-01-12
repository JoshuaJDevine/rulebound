/**
 * Card Component
 * Container for grouped content with variants for different use cases
 */

import { cn } from '@/lib/utils';

export interface CardProps {
  variant?: 'default' | 'interactive' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export function Card({
  variant = 'default',
  padding = 'md',
  children,
  onClick,
  ariaLabel,
  className,
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg transition-all';
  
  const variantStyles = {
    default: 'border border-neutral-200',
    interactive: 'border border-neutral-200 hover:shadow-md hover:border-primary-300 focus:ring-4 focus:ring-primary-500/50 focus:outline-none cursor-pointer',
    elevated: 'shadow-lg',
  };
  
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        onClick && 'text-left w-full',
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(onClick && { type: 'button' })}
    >
      {children}
    </Component>
  );
}
