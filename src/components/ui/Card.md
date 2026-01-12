# Card

## Purpose

The Card component is a flexible container for grouping related content in the Rule Bound application. It provides a consistent visual wrapper with multiple variants (default, interactive, elevated) and padding options. Cards can be static containers or interactive elements, making them suitable for both displaying information and serving as clickable navigation elements.

## Usage

```tsx
import { Card } from '@/components/ui';

// Basic static card
<Card variant="default" padding="md">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Interactive card (becomes a button)
<Card variant="interactive" onClick={() => navigate('/details')}>
  <h3>Click to view details</h3>
</Card>
```

## Props / Parameters

| Name      | Type                                     | Required | Description                                     |
| --------- | ---------------------------------------- | -------- | ----------------------------------------------- |
| variant   | 'default' \| 'interactive' \| 'elevated' | No       | Visual style variant (default: 'default')       |
| padding   | 'sm' \| 'md' \| 'lg'                     | No       | Internal padding size (default: 'md')           |
| children  | React.ReactNode                          | Yes      | Card content                                    |
| onClick   | () => void                               | No       | Click handler - makes card interactive (button) |
| ariaLabel | string                                   | No       | Accessible label when card is interactive       |
| className | string                                   | No       | Additional CSS classes                          |

## Returns

A styled container (div or button) with the specified variant, padding, and interactive behavior.

## Examples

```tsx
// Example 1: Basic content card
<Card variant="default" padding="lg">
  <h2>Rule Details</h2>
  <p>This card displays rule information.</p>
</Card>

// Example 2: Interactive navigation card
<Card
  variant="interactive"
  onClick={() => navigate('/rule/123')}
  ariaLabel="View rule details"
>
  <h3>Combat Rules</h3>
  <p>Click to explore combat mechanics</p>
</Card>

// Example 3: Elevated card for emphasis
<Card variant="elevated" padding="md">
  <div className="text-center">
    <h3>Featured Rule</h3>
    <p>This rule has been highlighted</p>
  </div>
</Card>

// Example 4: Small padding for compact layouts
<Card variant="default" padding="sm">
  <span className="text-xs">Compact card content</span>
</Card>

// Example 5: Custom styled card
<Card
  variant="default"
  className="border-primary-500 bg-primary-50"
>
  <p>Custom colored card</p>
</Card>
```

## Accessibility

- **Semantic HTML**: Renders as `<div>` for static content, `<button>` when interactive
- **Keyboard Navigation**: Interactive cards are fully keyboard accessible
- **Focus Indicators**: 4px focus ring on interactive cards
- **ARIA Attributes**:
  - `aria-label` provides context for interactive cards
  - `type="button"` explicitly set for interactive cards
- **Text Alignment**: Interactive cards use `text-left` for proper alignment
- **Full Width**: Interactive cards span full width for better touch targets
- **Visual Feedback**: Hover effects on interactive variant make affordance clear

## Variants

### Default (`variant="default"`)

- Border: 1px neutral gray
- Use for: Static content containers, information display
- Behavior: Non-interactive div element

### Interactive (`variant="interactive"`)

- Border: 1px neutral gray with hover effects
- Shadow: Elevation on hover
- Border color: Changes to primary blue on hover
- Use for: Clickable cards, navigation elements, list items
- Behavior: Becomes a `<button>` element

### Elevated (`variant="elevated"`)

- Shadow: Always shows elevated shadow
- Use for: Featured content, highlighted sections, modals
- Behavior: Non-interactive div with visual emphasis

## Padding Options

- **Small (`sm`)**: 12px padding - use for compact lists or dense layouts
- **Medium (`md`)**: 16px padding - default, balanced spacing
- **Large (`lg`)**: 24px padding - use for prominent cards or spacious layouts

## Design Patterns

### As a List Item

When using cards in lists, prefer the `interactive` variant for clickable items:

```tsx
{
  rules.map((rule) => (
    <Card
      key={rule.id}
      variant="interactive"
      onClick={() => viewRule(rule.id)}
      ariaLabel={`View ${rule.title}`}
    >
      <RulePreview rule={rule} />
    </Card>
  ));
}
```

### As a Section Container

Use the `default` variant for grouping related content:

```tsx
<Card variant="default" padding="lg">
  <h2>Section Title</h2>
  <div>Section content...</div>
</Card>
```

## Related

- [RuleCard](../common/RuleCard.md) - Specialized card for rules
- [SectionCard](../common/SectionCard.md) - Specialized card for sections
- [Button](./Button.md) - For explicit action buttons within cards
- [ADR-003: Styling Approach](../../../.cursor/features/active/setup-project/adr/ADR-003-styling-approach.md)
