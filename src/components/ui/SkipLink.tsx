/**
 * SkipLink Component
 * Allow keyboard users to skip to main content (WCAG 2.4.1)
 */

export interface SkipLinkProps {
  targetId: string;
  label?: string;
}

export function SkipLink({
  targetId,
  label = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg focus:ring-4 focus:ring-primary-500/50"
    >
      {label}
    </a>
  );
}
