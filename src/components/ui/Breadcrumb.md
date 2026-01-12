# Breadcrumb

## Purpose

The Breadcrumb component shows the user's current location within the Rule Bound application's hierarchy and enables quick navigation to parent pages. It displays a horizontal list of navigation links separated by a customizable separator, following accessibility best practices for breadcrumb navigation patterns. The component helps users understand where they are and provides an efficient way to navigate up the hierarchy.

## Usage

```tsx
import { Breadcrumb } from "@/components/ui";

function RuleDetailPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Rules", href: "/rules" },
    { label: "Combat", href: "/rules/combat" },
    { label: "Attack Rolls" }, // Current page, no href
  ];

  return <Breadcrumb items={breadcrumbs} />;
}
```

## Props / Parameters

| Name      | Type             | Required | Description                     |
| --------- | ---------------- | -------- | ------------------------------- |
| items     | BreadcrumbItem[] | Yes      | Array of breadcrumb items       |
| separator | React.ReactNode  | No       | Custom separator (default: '/') |

### BreadcrumbItem Interface

| Name  | Type   | Required | Description                      |
| ----- | ------ | -------- | -------------------------------- |
| label | string | Yes      | Display text for breadcrumb item |
| href  | string | No       | Link URL (omit for current page) |

## Returns

An accessible breadcrumb navigation component with proper ARIA attributes and semantic HTML.

## Examples

```tsx
// Example 1: Basic breadcrumb
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Rules', href: '/rules' },
    { label: 'Current Rule' }
  ]}
/>

// Example 2: Custom separator
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Characters', href: '/characters' },
    { label: 'Fighter' }
  ]}
  separator="›"
/>

// Example 3: Deep navigation
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Rules', href: '/rules' },
    { label: 'Combat', href: '/rules/combat' },
    { label: 'Actions', href: '/rules/combat/actions' },
    { label: 'Attack' }
  ]}
/>

// Example 4: Icon separator
<Breadcrumb
  items={breadcrumbs}
  separator={<ChevronRightIcon />}
/>

// Example 5: Dynamic breadcrumbs from route
function useBreadcrumbs() {
  const location = useLocation();
  const { rule, section } = useParams();

  const items = [
    { label: 'Home', href: '/' },
  ];

  if (section) {
    items.push({ label: 'Rules', href: '/rules' });
    items.push({ label: section, href: `/rules/${section}` });
  }

  if (rule) {
    items.push({ label: rule }); // Current page
  }

  return items;
}

function PageWithBreadcrumbs() {
  const breadcrumbs = useBreadcrumbs();
  return <Breadcrumb items={breadcrumbs} />;
}
```

## Accessibility

- **Semantic HTML**:
  - `<nav>` with `aria-label="Breadcrumb"` identifies navigation landmark
  - `<ol>` (ordered list) for breadcrumb items
  - `<li>` for each breadcrumb item
- **Links vs Text**:
  - Interactive items (with href) render as `<a>` elements
  - Current page (no href) renders as `<span>` with bold text
- **Visual Separators**:
  - Separators marked with `aria-hidden="true"` (decorative)
  - Screen readers navigate list without separator confusion
- **Keyboard Navigation**:
  - All links are keyboard accessible (Tab navigation)
  - Focus indicators visible (2px ring with primary color)
- **Screen Reader Experience**:
  - Announced as "Breadcrumb navigation"
  - Links announced with context: "Link, Home", "Link, Rules"
  - Current page announced without link: "Current Rule"
- **Responsive Design**:
  - Flex wrap allows breadcrumbs to wrap on narrow screens
  - Text size: 14px (text-sm) for compact display

## Visual Design

### Typography & Spacing

- Font size: 14px (text-sm)
- Display: Flexbox with 8px gaps (gap-2)
- Flex wrap: Enabled for responsive behavior
- Vertical alignment: Centered (items-center)

### Link Styling

- Color: Primary blue (text-primary-600)
- Hover: Darker primary (text-primary-700) with underline
- Focus: 2px ring with primary color at 50% opacity
- Padding: 4px horizontal (px-1) for larger hit area

### Current Page Styling

- Color: Neutral dark (text-neutral-900)
- Font weight: Medium (font-medium)
- No link styling

### Separator

- Color: Neutral medium (text-neutral-400)
- Default: Forward slash '/'
- Hidden from screen readers

## Design Patterns

### Page Layout Integration

```tsx
function RulePage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbs} />
        <div className="mt-4">{/* Page content */}</div>
      </div>
    </AppLayout>
  );
}
```

### Dynamic Breadcrumbs Hook

```tsx
function useDynamicBreadcrumbs() {
  const { sectionId, ruleId } = useParams();
  const { sections, rules } = useRulesStore();

  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  if (sectionId) {
    const section = sections.find((s) => s.id === sectionId);
    items.push({
      label: "Rules",
      href: "/rules",
    });
    if (section) {
      items.push({
        label: section.title,
        href: `/rules/${sectionId}`,
      });
    }
  }

  if (ruleId) {
    const rule = rules.find((r) => r.id === ruleId);
    if (rule) {
      items.push({ label: rule.title });
    }
  }

  return items;
}
```

### Truncated Breadcrumbs

For very deep hierarchies, consider truncating middle items:

```tsx
function TruncatedBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const displayItems =
    items.length > 4
      ? [
          items[0], // Home
          { label: "...", href: items[items.length - 3].href },
          ...items.slice(-2), // Last 2 items
        ]
      : items;

  return <Breadcrumb items={displayItems} />;
}
```

## Best Practices

### Navigation Structure

1. **Always include Home**: Start with home/root page
2. **Current page last**: Final item should be current page (no href)
3. **Logical hierarchy**: Follow actual site structure
4. **Avoid long labels**: Keep item labels concise

### When to Use

- ✅ Multi-level content hierarchies
- ✅ Drill-down navigation (sections → rules → details)
- ✅ When users need to backtrack
- ❌ Single-level pages (use back button instead)
- ❌ Mobile navigation (consider alternative patterns)

### Responsive Considerations

On mobile, breadcrumbs can take significant space. Consider:

- Hiding on small screens (use back button)
- Showing only parent and current page
- Using icons instead of text for middle items

```tsx
<div className="hidden md:block">
  <Breadcrumb items={breadcrumbs} />
</div>
```

## Related

- [Header](../layout/Header.md) - Primary navigation component
- [BottomNav](../layout/BottomNav.md) - Mobile navigation
- [AppLayout](../layout/AppLayout.md) - Page layout structure
- [RuleDetailPage](../../pages/RuleDetailPage/RuleDetailPage.md) - Likely uses breadcrumbs
- [ADR-002: Routing Solution](../../../.cursor/features/active/setup-project/adr/ADR-002-routing-solution.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
