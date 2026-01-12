# BookmarkButton

## Purpose

The BookmarkButton component provides a toggle button for bookmarking rules in the Rule Bound application. It connects directly to the global Zustand store to manage bookmark state, displaying filled or outlined bookmark icons based on the current bookmark status. The component includes accessibility features, visual feedback, and size variants, making it suitable for various contexts from compact list items to detailed rule pages.

## Usage

```tsx
import { BookmarkButton } from '@/components/common';

// Basic usage
<BookmarkButton ruleId="rule-123" />

// Small variant for compact layouts
<BookmarkButton ruleId="rule-456" size="sm" />

// With visible label
<BookmarkButton
  ruleId="rule-789"
  size="lg"
  showLabel
/>
```

## Props / Parameters

| Name      | Type                 | Required | Description                                              |
| --------- | -------------------- | -------- | -------------------------------------------------------- |
| ruleId    | string               | Yes      | ID of the rule to bookmark                               |
| size      | 'sm' \| 'md' \| 'lg' | No       | Button size (default: 'md')                              |
| showLabel | boolean              | No       | Show "Bookmark"/"Bookmarked" text label (default: false) |
| className | string               | No       | Additional CSS classes                                   |

## Returns

An accessible toggle button that adds/removes the specified rule from the user's bookmarks, with visual feedback for the current state.

## Examples

```tsx
// Example 1: Basic bookmark button
<BookmarkButton ruleId="combat-attack-action" />

// Example 2: Small size for rule cards
<RuleCard rule={rule}>
  <BookmarkButton ruleId={rule.id} size="sm" />
</RuleCard>

// Example 3: Large with label for detail pages
<BookmarkButton
  ruleId={currentRule.id}
  size="lg"
  showLabel
/>

// Example 4: Custom styled
<BookmarkButton
  ruleId={rule.id}
  className="absolute top-4 right-4"
/>

// Example 5: In a list of rules
{rules.map(rule => (
  <div key={rule.id} className="flex items-center justify-between">
    <h3>{rule.title}</h3>
    <BookmarkButton ruleId={rule.id} size="sm" />
  </div>
))}

// Example 6: Checking bookmark status
function RuleActions({ ruleId }) {
  const { bookmarks } = useRulesStore();
  const isBookmarked = bookmarks.some(b => b.ruleId === ruleId);

  return (
    <div>
      {isBookmarked && <span>⭐ Bookmarked</span>}
      <BookmarkButton ruleId={ruleId} />
    </div>
  );
}
```

## Accessibility

- **Semantic HTML**: Proper `<button>` element with `type="button"`
- **ARIA Attributes**:
  - `aria-label` provides clear action context:
    - Not bookmarked: "Bookmark this rule"
    - Bookmarked: "Remove bookmark"
  - `aria-pressed={isBookmarked}` indicates toggle state
- **Keyboard Navigation**:
  - Fully keyboard accessible
  - Tab to focus, Enter/Space to toggle
- **Focus Indicators**:
  - 4px focus ring with primary color at 50% opacity
  - Ring offset for clear visibility
- **Touch Targets**: Meets WCAG 2.5.5 (44px minimum):
  - Small: 44px (h-11 w-11) ✅
  - Medium: 48px (h-12 w-12) ✅
  - Large: 56px (h-14 w-14) ✅
- **Visual Feedback**:
  - State change (filled/outlined icon)
  - Color change (blue when bookmarked, gray when not)
  - Scale animation on hover (110%)
  - Immediate visual response to toggle
- **Screen Reader Announcements**: Toggle state announced via aria-pressed
- **Event Handling**: `e.stopPropagation()` prevents parent click events (important when used in clickable cards)

## Visual Design

### Icon States

#### Not Bookmarked

- Icon: Outlined bookmark
- Color: Neutral gray (text-neutral-400)
- Hover: Darker gray (text-neutral-600)
- Stroke: 2px width

#### Bookmarked

- Icon: Filled bookmark
- Color: Primary blue (text-primary-600)
- Hover: Darker primary (text-primary-700)
- Fill: Solid color

### Sizes

- **Small (`sm`)**: 44×44px (h-11 w-11) with 24×24px icon (h-6 w-6)
- **Medium (`md`)**: 48×48px (h-12 w-12) with 24×24px icon (h-6 w-6)
- **Large (`lg`)**: 56×56px (h-14 w-14) with 24×24px icon (h-6 w-6)

### Styling

- Border radius: 6px (rounded-md)
- Hover: Scale 110% (hover:scale-110)
- Transition: All properties with smooth animation
- Display: Inline-flex with center alignment

### With Label

When `showLabel={true}`:

- Label text: 14px (text-sm)
- Margin: 8px left of icon (ml-2)
- Text: "Bookmark" or "Bookmarked" based on state

## State Management

The component connects to the global Zustand store:

```tsx
const { bookmarks, addBookmark, removeBookmark } = useRulesStore();
```

### Bookmark State

```typescript
interface Bookmark {
  ruleId: string;
  timestamp: number;
  notes?: string;
}
```

### Actions

- **addBookmark(ruleId, notes?)**: Adds rule to bookmarks
- **removeBookmark(ruleId)**: Removes rule from bookmarks
- **Duplicate Prevention**: Store prevents duplicate bookmarks

## Behavior

### Toggle Logic

```tsx
const handleToggle = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent parent clicks
  if (isBookmarked) {
    removeBookmark(ruleId);
  } else {
    addBookmark(ruleId);
  }
};
```

### Event Propagation

The button uses `e.stopPropagation()` to prevent triggering parent click handlers. This is crucial when used inside clickable cards:

```tsx
<Card onClick={() => navigate(`/rule/${rule.id}`)}>
  {/* Clicking bookmark won't navigate to rule detail */}
  <BookmarkButton ruleId={rule.id} />
</Card>
```

### Persistence

Bookmarks are automatically persisted to localStorage via Zustand's persist middleware:

- Survives page refreshes
- Synced across tabs (via storage events)
- Stored under key: `rulebound-storage`

## Design Patterns

### In Rule Cards

```tsx
function RuleCard({ rule }) {
  return (
    <Card onClick={() => viewRule(rule.id)}>
      <div className="flex items-start justify-between">
        <h3>{rule.title}</h3>
        <BookmarkButton ruleId={rule.id} size="sm" />
      </div>
      <p>{rule.preview}</p>
    </Card>
  );
}
```

### In Rule Detail Header

```tsx
function RuleDetailHeader({ rule }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1>{rule.title}</h1>
      <BookmarkButton ruleId={rule.id} size="lg" showLabel />
    </div>
  );
}
```

### Bookmark Status Indicator

```tsx
function BookmarkIndicator({ ruleId }) {
  const { bookmarks } = useRulesStore();
  const bookmark = bookmarks.find((b) => b.ruleId === ruleId);

  if (!bookmark) return null;

  return (
    <div className="text-xs text-neutral-500">
      Bookmarked {formatTimestamp(bookmark.timestamp)}
    </div>
  );
}
```

## Known Issues

### Nested Interactive Elements Warning

**Issue**: When BookmarkButton is used inside a clickable card (button or link), it creates nested interactive elements:

```tsx
// This creates nested buttons
<button onClick={handleCardClick}>
  {" "}
  {/* Outer button */}
  <BookmarkButton ruleId={rule.id} /> {/* Inner button */}
</button>
```

**Impact**:

- Violates WCAG nested-interactive rule
- Can confuse assistive technologies
- May generate accessibility audit warnings

**Current Mitigation**:

- Uses `e.stopPropagation()` to prevent double-click handling
- Functional but not ideal for accessibility

**Future Consideration**:

- Refactor RuleCard to use `<div>` with click handler instead of `<button>`
- Or extract BookmarkButton outside card boundaries
- See: [RuleCard Known Issues](./RuleCard.md#known-issues)

## Related

- [RuleCard](./RuleCard.md) - Primary use case for BookmarkButton
- [rulesStore](../../store/rulesStore.md) - Manages bookmark state
- [BookmarksPage](../../pages/BookmarksPage/BookmarksPage.md) - Displays bookmarked rules
- [Button](../ui/Button.md) - Base button component
- [ADR-004: State Management](../../../.cursor/features/active/setup-project/adr/ADR-004-state-management.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
