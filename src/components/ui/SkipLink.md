# SkipLink

## Purpose

The SkipLink component implements WCAG 2.4.1 (Bypass Blocks) by providing keyboard users a way to skip repetitive navigation and jump directly to the main content. This component is essential for accessibility, allowing users who navigate via keyboard or screen readers to bypass the header and navigation to reach the page content quickly. The link is visually hidden until focused, appearing only when a keyboard user tabs to it.

## Usage

```tsx
import { SkipLink } from "@/components/ui";

function AppLayout({ children }) {
  return (
    <div>
      <SkipLink targetId="main-content" />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
```

## Props / Parameters

| Name     | Type   | Required | Description                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| targetId | string | Yes      | ID of the target element to skip to         |
| label    | string | No       | Link text (default: 'Skip to main content') |

## Returns

An accessible skip link that is hidden until focused, positioned at the top of the page when visible.

## Examples

```tsx
// Example 1: Default skip link
<SkipLink targetId="main-content" />

// Example 2: Custom label
<SkipLink
  targetId="main-content"
  label="Jump to content"
/>

// Example 3: Skip to search (multiple skip links)
<>
  <SkipLink targetId="main-content" />
  <SkipLink
    targetId="search-input"
    label="Skip to search"
  />
</>

// Example 4: Complete layout implementation
function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink targetId="main-content" />

      <Header />

      <main
        id="main-content"
        className="flex-1"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}

// Example 5: Multiple content sections
function ComplexLayout() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <SkipLink targetId="sidebar" label="Skip to sidebar" />

      <Header />

      <div className="flex">
        <aside id="sidebar" tabIndex={-1}>
          {/* Sidebar content */}
        </aside>

        <main id="main-content" tabIndex={-1}>
          {/* Main content */}
        </main>
      </div>
    </>
  );
}
```

## Accessibility

This component is specifically designed for accessibility:

- **WCAG 2.4.1 Compliance**: "Bypass Blocks" (Level A requirement)
  - Provides mechanism to bypass repeated blocks of content
  - Essential for keyboard and screen reader users

- **Visual Treatment**:
  - Hidden by default: `sr-only` class (visually hidden but available to screen readers)
  - Visible on focus: Appears at top-left when tabbed to
  - High contrast: White text on primary blue background
  - Clear positioning: Fixed position, high z-index (z-50)

- **Keyboard Navigation**:
  - First focusable element on page (best practice)
  - Tab key reveals the link
  - Enter/Space activates the link
  - Focus moves to target element

- **Target Element Requirements**:
  - Target must have `id` matching `targetId`
  - Target should have `tabIndex={-1}` to receive focus programmatically
  - Target should have semantic role (e.g., `role="main"`)

- **Screen Reader Support**:
  - Link is always available to screen readers
  - Announces as interactive link element
  - Clear, descriptive label

## Visual Design (When Focused)

### Positioning

- Position: Absolute
- Top: 16px (top-4)
- Left: 16px (left-4)
- Z-index: 50 (above all content)

### Styling

- Background: Primary blue (bg-primary-600)
- Text color: White (text-white)
- Padding: 8px horizontal, 16px vertical (px-4 py-2)
- Border radius: 6px (rounded-md)
- Shadow: Large shadow (shadow-lg)
- Focus ring: 4px ring with primary color at 50% opacity

### Hidden State

- Class: `sr-only` - Screen reader only
- Positioned off-screen
- Clipped to 1px × 1px
- No overflow
- Hidden from visual users but accessible to assistive technologies

## Implementation Requirements

### Target Element Setup

The skip link requires proper target element configuration:

```tsx
<main
  id="main-content" // Matches SkipLink targetId
  role="main" // Semantic landmark
  tabIndex={-1} // Allows programmatic focus
>
  {children}
</main>
```

### Multiple Skip Links

When providing multiple skip links, ensure logical tab order:

```tsx
// Order matters - users will tab through these in order
<SkipLink targetId="main-content" />           {/* 1st tab */}
<SkipLink targetId="search" label="Skip to search" />  {/* 2nd tab */}
<Header />                                     {/* 3rd tab */}
```

## Best Practices

### Placement

- ✅ First element in DOM (before header)
- ✅ Place in root layout component
- ❌ Don't place inside header
- ❌ Don't place after other interactive elements

### Target Selection

- ✅ Skip to main content area
- ✅ Can include skip to search
- ✅ Can include skip to navigation (on content-heavy sites)
- ❌ Don't create skip links for every section

### Label Writing

- ✅ Clear and concise: "Skip to main content"
- ✅ Action-oriented: "Skip to search", "Jump to content"
- ❌ Avoid vague labels: "Skip", "Click here"

### Testing

Test skip link functionality:

1. Load page
2. Press Tab (should be first focusable element)
3. Verify link appears visually
4. Press Enter
5. Verify focus moves to target
6. Verify target receives visual focus indicator

## Common Patterns

### Single Page Application

```tsx
function App() {
  return (
    <Router>
      <SkipLink targetId="main-content" />
      <AppLayout>
        <Routes>{/* routes */}</Routes>
      </AppLayout>
    </Router>
  );
}
```

### With Navigation Landmark

```tsx
<>
  <SkipLink targetId="main-content" />
  <SkipLink targetId="main-nav" label="Skip to navigation" />

  <Header>
    <nav id="main-nav" role="navigation" tabIndex={-1}>
      {/* navigation */}
    </nav>
  </Header>

  <main id="main-content" role="main" tabIndex={-1}>
    {children}
  </main>
</>
```

## Browser Support

The skip link uses standard HTML anchor navigation (`href="#target"`), which is universally supported. The visual treatment uses modern CSS, but the core functionality works in all browsers.

## Related

- [AppLayout](../layout/AppLayout.md) - Implements SkipLink in root layout
- [Header](../layout/Header.md) - Navigation that skip link bypasses
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
- [WCAG 2.4.1: Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html)
