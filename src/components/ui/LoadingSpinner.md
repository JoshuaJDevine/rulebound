# LoadingSpinner

## Purpose

The LoadingSpinner component provides a visual loading indicator with built-in accessibility support for the Rule Bound application. It communicates asynchronous operations to users through an animated spinner, available in multiple sizes and variants (inline or full-page). The component ensures screen reader users are informed of loading states through proper ARIA attributes.

## Usage

```tsx
import { LoadingSpinner } from '@/components/ui';

// Basic inline usage
<LoadingSpinner />

// Full page loading
<LoadingSpinner variant="page" size="lg" label="Loading rules..." />

// Small spinner for buttons or inline elements
<LoadingSpinner size="sm" />
```

## Props / Parameters

| Name    | Type                 | Required | Description                                              |
| ------- | -------------------- | -------- | -------------------------------------------------------- |
| size    | 'sm' \| 'md' \| 'lg' | No       | Spinner size (default: 'md')                             |
| variant | 'inline' \| 'page'   | No       | Display context (default: 'inline')                      |
| label   | string               | No       | Accessible label for screen readers (default: 'Loading') |

## Returns

An accessible loading spinner with the specified size and variant, properly announced to assistive technologies.

## Examples

```tsx
// Example 1: Default inline spinner
<LoadingSpinner />

// Example 2: Page-level loading state
<LoadingSpinner
  variant="page"
  size="lg"
  label="Loading rule book data..."
/>

// Example 3: Small spinner for compact spaces
<LoadingSpinner
  size="sm"
  label="Loading preview..."
/>

// Example 4: Medium spinner with custom label
<LoadingSpinner
  size="md"
  label="Searching rules..."
/>

// Example 5: In a button (using size context)
<Button disabled loading>
  <LoadingSpinner size="sm" label="Saving..." />
  Saving
</Button>

// Example 6: In a card while loading content
<Card>
  {isLoading ? (
    <LoadingSpinner size="md" label="Loading rule details..." />
  ) : (
    <RuleContent rule={rule} />
  )}
</Card>
```

## Accessibility

- **ARIA Attributes**:
  - `role="status"` - Identifies as a status indicator
  - `aria-live="polite"` - Announces changes to screen readers without interrupting
  - `aria-label` - Provides context about what is loading
- **Screen Reader Support**:
  - Visible spinner hidden from screen readers (decorative)
  - `sr-only` text provides meaningful context: "Loading" (or custom label)
- **Visual Feedback**: Animated spinner provides clear visual indication of loading state
- **Color Contrast**: Border uses neutral and primary colors meeting WCAG AA standards
- **Animation**: Uses `animate-spin` for smooth rotation
- **Reduced Motion**: Consider using `prefers-reduced-motion` for accessibility (future enhancement)

## Size Options

### Small (`size="sm"`)

- Dimensions: 24px × 24px (h-6 w-6)
- Use for: Buttons, inline text, compact UI elements
- Context: Minimal space available

### Medium (`size="md"`)

- Dimensions: 40px × 40px (h-10 w-10)
- Use for: Cards, sections, standard loading states
- Context: Default size, balanced visibility

### Large (`size="lg"`)

- Dimensions: 64px × 64px (h-16 w-16)
- Use for: Full-page loading, prominent loading states
- Context: Primary loading indicator

## Variants

### Inline (`variant="inline"`)

- Display: Flex centered in container
- Use for: Component-level loading states
- Example: Loading a card, section, or modal content

### Page (`variant="page"`)

- Display: Flex centered with full viewport height (min-h-screen)
- Use for: Full-page loading states
- Example: Initial app load, route transitions

## Design Patterns

### Full Page Loading

```tsx
function RuleDetailPage() {
  const { isLoading, rule } = useRuleData();

  if (isLoading) {
    return <LoadingSpinner variant="page" size="lg" label="Loading rule..." />;
  }

  return <RuleDetail rule={rule} />;
}
```

### Inline Content Loading

```tsx
function RuleCard({ ruleId }) {
  const { isLoading, rule } = useRule(ruleId);

  return (
    <Card>
      {isLoading ? (
        <LoadingSpinner size="md" label="Loading rule details..." />
      ) : (
        <RuleContent rule={rule} />
      )}
    </Card>
  );
}
```

### List Loading State

```tsx
function RulesList() {
  const { isLoading, rules } = useRules();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSpinner size="md" label="Loading rules list..." />
      </div>
    );
  }

  return <div>{/* render rules */}</div>;
}
```

## Related

- [ErrorMessage](./ErrorMessage.md) - Complementary component for error states
- [Button](./Button.md) - Uses inline spinner for loading buttons
- [EmptyState](../common/EmptyState.md) - Alternative component for empty states
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
