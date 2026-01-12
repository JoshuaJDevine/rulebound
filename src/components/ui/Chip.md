# Chip

## Purpose

The Chip component displays small, compact labels for tags, filters, or related items in the Rule Bound application. It supports multiple variants (default, interactive, selected) and can optionally include icons and remove functionality. Chips can be static labels or interactive elements, making them versatile for both displaying information and capturing user input (like tag selection or filter removal).

## Usage

```tsx
import { Chip } from '@/components/ui';

// Static label chip
<Chip label="Combat" />

// Interactive chip (clickable)
<Chip
  label="Magic"
  variant="interactive"
  onClick={() => filterByTag('Magic')}
/>

// Selected chip with remove
<Chip
  label="Spells"
  variant="selected"
  onRemove={() => removeTag('Spells')}
/>
```

## Props / Parameters

| Name      | Type                                     | Required | Description                                     |
| --------- | ---------------------------------------- | -------- | ----------------------------------------------- |
| label     | string                                   | Yes      | Chip text label                                 |
| variant   | 'default' \| 'interactive' \| 'selected' | No       | Visual style variant (default: 'default')       |
| icon      | React.ReactNode                          | No       | Optional icon displayed before label            |
| onRemove  | () => void                               | No       | Callback for remove button (shows X button)     |
| onClick   | () => void                               | No       | Click handler - makes chip interactive (button) |
| className | string                                   | No       | Additional CSS classes                          |

## Returns

A compact, styled label (span or button) with optional icon and remove functionality.

## Examples

```tsx
// Example 1: Static tag chip
<Chip label="Character Creation" variant="default" />

// Example 2: Interactive filter chip
<Chip
  label="Combat Rules"
  variant="interactive"
  onClick={() => applyFilter('combat')}
/>

// Example 3: Selected tag with icon
<Chip
  label="Bookmarked"
  variant="selected"
  icon={<BookmarkIcon />}
  onRemove={() => clearSelection()}
/>

// Example 4: Tag list
<div className="flex flex-wrap gap-2">
  {tags.map(tag => (
    <Chip
      key={tag}
      label={tag}
      variant="interactive"
      onClick={() => searchByTag(tag)}
    />
  ))}
</div>

// Example 5: Active filters with remove
<div className="flex flex-wrap gap-2">
  {activeFilters.map(filter => (
    <Chip
      key={filter}
      label={filter}
      variant="selected"
      onRemove={() => removeFilter(filter)}
    />
  ))}
</div>

// Example 6: Both onClick and onRemove (warning: creates nested buttons)
<Chip
  label="Fantasy"
  variant="selected"
  onClick={() => viewTag('Fantasy')}
  onRemove={() => removeTag('Fantasy')}
/>
```

## Accessibility

- **Semantic HTML**:
  - Renders as `<span>` when static (no onClick)
  - Renders as `<button>` when interactive (with onClick)
- **Keyboard Navigation**:
  - Interactive chips fully keyboard accessible
  - Remove button separately focusable and keyboard operable
  - Tab order: chip → remove button
- **Focus Indicators**:
  - 2px focus ring with primary color at 50% opacity
  - Visible on both chip and remove button
- **ARIA Attributes**:
  - `aria-label={label}` - Provides accessible name
  - Remove button: `aria-label="Remove {label}"` - Clear action context
  - `type="button"` explicitly set for interactive elements
- **Touch Targets**:
  - Chip height: 44px (h-11) ✅ Meets WCAG 2.5.5
  - Remove button: adequate touch area within chip
- **Event Handling**:
  - `e.stopPropagation()` on remove button prevents chip click when both present
- **Visual Feedback**: Hover states communicate interactivity

## Variants

### Default (`variant="default"`)

- Background: Light neutral gray (neutral-100)
- Border: Neutral gray (neutral-200)
- Text: Neutral dark (neutral-700)
- Use for: Static labels, non-interactive tags, read-only information

### Interactive (`variant="interactive"`)

- Background: White
- Border: Neutral medium (neutral-300), changes to primary on hover
- Text: Neutral dark (neutral-900)
- Cursor: Pointer
- Use for: Clickable tags, filters, selectable options

### Selected (`variant="selected"`)

- Background: Primary blue (primary-600)
- Border: Primary blue (primary-600)
- Text: White
- Use for: Active selections, applied filters, chosen options

## Design Patterns

### Tag Cloud

Display a collection of related tags:

```tsx
function TagCloud({ tags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          variant="interactive"
          onClick={() => navigate(`/tags/${tag}`)}
        />
      ))}
    </div>
  );
}
```

### Active Filters

Show currently applied filters with remove capability:

```tsx
function ActiveFilters({ filters, onRemove }) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm text-neutral-600">Active filters:</span>
      {filters.map((filter) => (
        <Chip
          key={filter}
          label={filter}
          variant="selected"
          onRemove={() => onRemove(filter)}
        />
      ))}
    </div>
  );
}
```

### Tag Selection

Allow users to select multiple tags:

```tsx
function TagSelector({ availableTags, selectedTags, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Chip
            key={tag}
            label={tag}
            variant={isSelected ? "selected" : "interactive"}
            onClick={() => onToggle(tag)}
            {...(isSelected && {
              onRemove: () => onToggle(tag),
            })}
          />
        );
      })}
    </div>
  );
}
```

## Known Issues

### Nested Buttons Warning

When a Chip has both `onClick` and `onRemove`, it creates nested interactive elements:

- Outer chip is a `<button>` (due to onClick)
- Remove button is also a `<button>` (for onRemove)
- This creates nested buttons, which may generate console warnings

**Workaround**: The remove button properly uses `e.stopPropagation()` so clicks on remove don't trigger the chip's onClick. This is functional but not ideal from an accessibility standpoint.

**Best Practice**: Consider whether you really need both. Often, selected chips should only need onRemove:

```tsx
// Preferred: Selected with remove only
<Chip
  label="Combat"
  variant="selected"
  onRemove={removeFilter}
/>

// Preferred: Interactive with click only
<Chip
  label="Magic"
  variant="interactive"
  onClick={selectFilter}
/>
```

## Visual Specifications

### Size & Spacing

- Height: 44px (h-11)
- Horizontal padding: 12px (px-3)
- Gap between elements: 8px (gap-2)
- Text size: 14px (text-sm)
- Border width: 1px
- Border radius: Full rounded (rounded-full)

### Remove Button

- Positioned: Margin left 4px (ml-1), margin right -4px (-mr-1)
- Padding: 4px (p-1)
- Icon size: 12×12px (h-3 w-3)
- Hover: Semi-transparent black background (bg-black/10)
- Focus ring: 2px primary color

## Related

- [RuleCard](../common/RuleCard.md) - May display tags as chips
- [SearchInput](./SearchInput.md) - Often paired with chips for search filters
- [Button](./Button.md) - Related interactive element
- [ADR-003: Styling Approach](../../../.cursor/features/active/setup-project/adr/ADR-003-styling-approach.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
