/**
 * Breadcrumb Component
 * Shows current location in hierarchy and enables navigation
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumb({ items, separator = "/" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-neutral-400" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-primary-600 hover:text-primary-700 hover:underline focus:ring-2 focus:ring-primary-500/50 focus:outline-none rounded px-1"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-neutral-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
