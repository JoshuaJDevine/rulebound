/**
 * SearchInput Component
 * Text input for searching rules with clear functionality
 */

import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search rules...',
  autoFocus = false,
  disabled = false,
  ariaLabel = 'Search rules',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="search"
        className="w-full h-12 pl-12 pr-12 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/50 focus:outline-none transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        {...(autoFocus && { autoFocus: true })}
        disabled={disabled}
      />

      {value && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-neutral-100 focus:ring-2 focus:ring-primary-500/50 focus:outline-none flex items-center justify-center"
          onClick={onClear}
          aria-label="Clear search"
          type="button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
