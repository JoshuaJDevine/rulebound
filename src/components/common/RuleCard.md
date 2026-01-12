# RuleCard

## Purpose

The RuleCard component displays a rule in list views with a preview of its content. It provides a consistent, interactive card format for browsing rules, featuring the rule title, content preview, section information, optional timestamp, and an integrated bookmark button. The card is designed to be clickable for navigation to the full rule details while maintaining good accessibility practices.

## Usage

```tsx
import { RuleCard } from '@/components/common';

// Basic usage
<RuleCard
  rule={rule}
  onClick={() => navigate(`/rule/${rule.id}`)}
/>

// With timestamp for recently viewed
<RuleCard
  rule={rule}
  showTimestamp
  timestamp={viewedTimestamp}
  onClick={() => navigate(`/rule/${rule.id}`)}
/>

// Minimal card without preview
<RuleCard
  rule={rule}
  showPreview={false}
  onClick={handleClick}
/>
```

## Props / Parameters

| Name          | Type       | Required | Description                                        |
| ------------- | ---------- | -------- | -------------------------------------------------- |
| rule          | Rule       | Yes      | Rule object to display                             |
| showPreview   | boolean    | No       | Show content preview (default: true)               |
| showSection   | boolean    | No       | Show section name (default: true)                  |
| showTimestamp | boolean    | No       | Show timestamp (default: false)                    |
| timestamp     | number     | No       | Unix timestamp to display (requires showTimestamp) |
| onClick       | () => void | No       | Click handler for card navigation                  |
| className     | string     | No       | Additional CSS classes                             |

### Rule Type

```typescript
interface Rule {
  id: string;
  title: string;
  content: string;
  section: string;
  tags: string[];
  // ... other properties
}
```

## Returns

An interactive card displaying rule information with integrated bookmark functionality.

## Examples

```tsx
// Example 1: Basic rule card in list
{rules.map(rule => (
  <RuleCard
    key={rule.id}
    rule={rule}
    onClick={() => navigate(`/rule/${rule.id}`)}
  />
))}

// Example 2: Recently viewed with timestamp
<div>
  <h2>Recently Viewed</h2>
  {recentRules.map(({ rule, timestamp }) => (
    <RuleCard
      key={rule.id}
      rule={rule}
      showTimestamp
      timestamp={timestamp}
      onClick={() => navigate(`/rule/${rule.id}`)}
    />
  ))}
</div>

// Example 3: Compact list without preview
{rules.map(rule => (
  <RuleCard
    key={rule.id}
    rule={rule}
    showPreview={false}
    onClick={() => viewRule(rule.id)}
  />
))}

// Example 4: Search results (section context important)
<SearchResults>
  {results.map(({ rule }) => (
    <RuleCard
      key={rule.id}
      rule={rule}
      showSection
      showPreview
      onClick={() => navigate(`/rule/${rule.id}`)}
    />
  ))}
</SearchResults>

// Example 5: Custom styled card
<RuleCard
  rule={featuredRule}
  onClick={viewRule}
  className="border-primary-500 bg-primary-50"
/>

// Example 6: Section-filtered list (no need to show section)
function SectionRules({ sectionId }) {
  const rules = useRulesBySection(sectionId);

  return (
    <div className="space-y-4">
      {rules.map(rule => (
        <RuleCard
          key={rule.id}
          rule={rule}
          showSection={false}  // All same section
          onClick={() => navigate(`/rule/${rule.id}`)}
        />
      ))}
    </div>
  );
}
```

## Accessibility

- **Semantic HTML**: Renders as `<button>` for proper keyboard navigation
- **Keyboard Navigation**:
  - Tab to focus card
  - Enter or Space to activate
  - Nested bookmark button separately focusable
- **Focus Indicators**:
  - 4px focus ring with primary color at 50% opacity
  - Clear visual indication of focused card
- **ARIA Attributes**:
  - `type="button"` explicitly set
  - Implicit label from card content (title as main label)
- **Touch Targets**: Full card is tappable (w-full)
- **Visual Feedback**:
  - Shadow on hover (hover:shadow-md)
  - Border color change (hover:border-primary-300)
  - Smooth transitions
- **Text Truncation**: Preview uses `line-clamp-2` for consistent height
- **Time Element**: Uses semantic `<time>` with `dateTime` attribute for timestamps

## Known Issues

### Nested Interactive Elements

**Issue**: RuleCard creates nested interactive elements:

- Outer card is a `<button>` (for navigation)
- Inner BookmarkButton is also a `<button>` (for bookmarking)

```tsx
<button onClick={navigateToRule}>
  {" "}
  {/* Outer button */}
  <BookmarkButton /> {/* Inner button - nested! */}
</button>
```

**Impact**:

- Violates WCAG nested-interactive guideline
- Can confuse assistive technologies
- Screen readers may not announce structure correctly
- Keyboard navigation can be unpredictable

**Current Mitigation**:

- BookmarkButton uses `e.stopPropagation()` to prevent double-click
- Functional for users but not semantically correct

**Recommended Fix** (Future):

Option 1 - Use div with click handler:

```tsx
<div
  onClick={onClick}
  onKeyPress={handleKeyPress}
  role="button"
  tabIndex={0}
  className="..."
>
  {/* Content */}
  <BookmarkButton ruleId={rule.id} />
</div>
```

Option 2 - Extract bookmark outside card:

```tsx
<div className="flex gap-2">
  <button onClick={onClick} className="flex-1">
    {/* Card content without bookmark */}
  </button>
  <BookmarkButton ruleId={rule.id} />
</div>
```

**Testing Note**:

- Test with vitest-axe is currently skipped for this component
- Re-enable test after fixing nested interactive elements

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ [Title]                    [Bookmark]    │
│                                          │
│ Content preview text that may wrap...   │
│                                          │
│ Section Name • Viewed 2 hours ago       │
└─────────────────────────────────────────┘
```

### Styling

- Background: White (bg-white)
- Border: 1px neutral-200, changes to primary-300 on hover
- Border radius: 8px (rounded-lg)
- Padding: 16px (p-4)
- Width: Full width (w-full)
- Text alignment: Left (text-left)

### Typography

- Title: 18px, semibold (text-lg font-semibold), neutral-900
- Preview: 14px (text-sm), neutral-600, 2-line clamp
- Metadata: 12px (text-xs), neutral-500

### Spacing

- Title to preview: 8px (mb-2)
- Preview to metadata: 8px (mb-2)
- Gap between title and bookmark: 16px (gap-4)
- Gap between metadata items: 8px (gap-2)

### Hover State

- Shadow: Medium shadow (shadow-md)
- Border: Primary-300
- Transition: All properties

### Content Preview

Uses `line-clamp-2` for consistent card heights:

- Maximum 2 lines of content
- Ellipsis (...) for overflow
- Maintains visual rhythm in lists

## Design Patterns

### Rule Lists

```tsx
function RulesList({ rules }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onClick={() => navigate(`/rule/${rule.id}`)}
        />
      ))}
    </div>
  );
}
```

### Recently Viewed

```tsx
function RecentlyViewed() {
  const { rules, preferences } = useRulesStore();
  const recentRules = preferences.recentlyViewed
    .map((id) => rules.find((r) => r.id === id))
    .filter(Boolean);

  return (
    <div>
      <h2>Recently Viewed</h2>
      {recentRules.map((rule, index) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          showTimestamp
          timestamp={Date.now() - index * 3600000} // Example
          onClick={() => navigate(`/rule/${rule.id}`)}
        />
      ))}
    </div>
  );
}
```

### Search Results with Highlighting

```tsx
function SearchResults({ query, results }) {
  return (
    <div className="space-y-4">
      <p>
        {results.length} results for "{query}"
      </p>
      {results.map(({ rule, score }) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          showSection
          onClick={() => navigate(`/rule/${rule.id}`)}
        />
      ))}
    </div>
  );
}
```

## Performance Considerations

### Large Lists

When rendering many RuleCards:

1. **Virtualization**: Consider using react-window for 100+ items
2. **Pagination**: Load rules in batches
3. **Memoization**: Memoize onClick handlers

```tsx
function RulesList({ rules }) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (ruleId: string) => {
      navigate(`/rule/${ruleId}`);
    },
    [navigate],
  );

  return (
    <div>
      {rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onClick={() => handleClick(rule.id)}
        />
      ))}
    </div>
  );
}
```

## Related

- [BookmarkButton](./BookmarkButton.md) - Integrated bookmark functionality
- [SectionCard](./SectionCard.md) - Related card component for sections
- [Card](../ui/Card.md) - Base card component
- [formatTimestamp](../../lib/utils/formatTimestamp.md) - Used for timestamp display
- [rulesStore](../../store/rulesStore.md) - Provides rule data
- [RulesListPage](../../pages/RulesListPage/RulesListPage.md) - Primary use case
- [SearchPage](../../pages/SearchPage/SearchPage.md) - Search results display
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
