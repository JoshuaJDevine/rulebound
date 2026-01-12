/**
 * Utility for merging Tailwind CSS classes
 * Handles conditional classes and removes duplicates
 */

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
