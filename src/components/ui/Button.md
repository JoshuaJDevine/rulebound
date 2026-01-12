# Button

## Purpose

The Button component is the primary interactive element for user actions in the Rule Bound application. It provides a consistent, accessible button interface with multiple visual variants (primary, secondary, ghost, danger) and sizes (small, medium, large). The component handles loading states and supports icons, making it versatile for various use cases from simple actions to complex forms.

## Usage

```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button variant="primary" size="md">
  Click Me
</Button>

// With loading state
<Button variant="primary" loading>
  Processing...
</Button>

// With icon
<Button variant="secondary" icon={<SearchIcon />}>
  Search
</Button>
```

## Props / Parameters

| Name      | Type                                            | Required | Description                                                |
| --------- | ----------------------------------------------- | -------- | ---------------------------------------------------------- |
| variant   | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | No       | Visual style variant (default: 'primary')                  |
| size      | 'sm' \| 'md' \| 'lg'                            | No       | Button size (default: 'md')                                |
| fullWidth | boolean                                         | No       | Whether button should take full width (default: false)     |
| loading   | boolean                                         | No       | Shows loading spinner and disables button (default: false) |
| disabled  | boolean                                         | No       | Disables the button (default: false)                       |
| icon      | React.ReactNode                                 | No       | Icon to display before the button text                     |
| children  | React.ReactNode                                 | Yes      | Button label/content                                       |
| ariaLabel | string                                          | No       | Accessible label for screen readers                        |
| className | string                                          | No       | Additional CSS classes                                     |
| ...props  | React.ButtonHTMLAttributes                      | No       | All standard HTML button attributes                        |

## Returns

A styled, accessible button element with the specified variant, size, and state.

## Examples

```tsx
// Example 1: Primary action button
<Button variant="primary" size="lg">
  Save Changes
</Button>

// Example 2: Secondary button with icon
<Button
  variant="secondary"
  icon={<PlusIcon />}
  onClick={() => console.log('Add clicked')}
>
  Add Rule
</Button>

// Example 3: Danger button with confirmation
<Button
  variant="danger"
  onClick={handleDelete}
  ariaLabel="Delete rule permanently"
>
  Delete
</Button>

// Example 4: Loading state
<Button
  variant="primary"
  loading
  disabled
>
  Submitting...
</Button>

// Example 5: Ghost button for tertiary actions
<Button variant="ghost" size="sm">
  Cancel
</Button>

// Example 6: Full width mobile button
<Button variant="primary" fullWidth>
  Continue
</Button>
```

## Accessibility

- **Keyboard Navigation**: Fully keyboard accessible with native button semantics
- **Focus Indicators**: 4px focus ring with 2px offset, visible in all states
- **ARIA Attributes**:
  - `aria-label` for custom accessible labels
  - `aria-disabled` reflects disabled/loading state
  - `sr-only` text for loading spinner ("Loading")
- **Touch Targets**: Meets WCAG 2.5.5 minimum size (44px):
  - Small: 36px (h-9)
  - Medium: 44px (h-11) ✅
  - Large: 48px (h-12) ✅
- **Color Contrast**: All variants meet WCAG AA standards (4.5:1)
- **Disabled State**: Visual (opacity: 0.5) and functional disabled state with cursor change
- **Loading State**: Communicates state change to screen readers via aria-live region

## Variants

### Primary (`variant="primary"`)

- Background: Primary blue (#2563EB)
- Use for: Main call-to-action buttons
- Example: "Save", "Submit", "Continue"

### Secondary (`variant="secondary"`)

- Background: Neutral gray (#E5E5E5)
- Use for: Secondary actions that complement the primary action
- Example: "Cancel", "Skip", "Back"

### Ghost (`variant="ghost"`)

- Background: Transparent with hover state
- Use for: Tertiary actions, less prominent interactions
- Example: "Learn More", "View Details", inline actions

### Danger (`variant="danger"`)

- Background: Error red (#DC2626)
- Use for: Destructive actions that require user attention
- Example: "Delete", "Remove", "Revoke Access"

## Size Guidelines

- **Small (`sm`)**: Use for compact interfaces, table actions, or secondary controls
- **Medium (`md`)**: Default size, use for most standard buttons
- **Large (`lg`)**: Use for prominent calls-to-action, landing pages, or mobile-first designs

## Related

- [Card](./Card.md) - Often used together for interactive cards
- [ErrorMessage](./ErrorMessage.md) - Uses Button for retry actions
- [EmptyState](../common/EmptyState.md) - Uses Button for call-to-action
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
