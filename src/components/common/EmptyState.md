# EmptyState

## Purpose

The EmptyState component communicates to users when no content is available in a given context. It provides a friendly, centered message with an icon, title, description, and optional call-to-action button. This component improves user experience by clearly explaining empty states (no search results, no bookmarks, no rules) and offering next steps when appropriate.

## Usage

```tsx
import { EmptyState } from '@/components/common';

// Basic empty state
<EmptyState
  icon="🔍"
  title="No Results Found"
  description="Try adjusting your search terms."
/>

// With action button
<EmptyState
  icon="📚"
  title="No Bookmarks Yet"
  description="Start bookmarking rules to build your personal reference."
  action={{
    label: "Browse Rules",
    onClick: () => navigate('/rules')
  }}
/>
```

## Props / Parameters

| Name        | Type            | Required | Description                          |
| ----------- | --------------- | -------- | ------------------------------------ |
| icon        | React.ReactNode | Yes      | Icon or emoji to display             |
| title       | string          | Yes      | Main heading for empty state         |
| description | string          | Yes      | Explanatory text for the empty state |
| action      | ActionObject    | No       | Optional call-to-action button       |

### ActionObject Type

```typescript
interface ActionObject {
  label: string; // Button text
  onClick: () => void; // Click handler
}
```

## Returns

A centered, accessible empty state display with icon, text, and optional action button.

## Examples

```tsx
// Example 1: Empty search results
<EmptyState
  icon="🔍"
  title="No Results Found"
  description="We couldn't find any rules matching your search. Try different keywords."
/>

// Example 2: No bookmarks with action
<EmptyState
  icon="📑"
  title="No Bookmarks Yet"
  description="Save rules to your bookmarks for quick access later."
  action={{
    label: "Explore Rules",
    onClick: () => navigate('/rules')
  }}
/>

// Example 3: Empty section
<EmptyState
  icon="📚"
  title="No Rules in This Section"
  description="This section doesn't contain any rules yet."
/>

// Example 4: Error recovery
<EmptyState
  icon="⚠️"
  title="Unable to Load Content"
  description="Something went wrong while loading the rules."
  action={{
    label: "Try Again",
    onClick: () => refetch()
  }}
/>

// Example 5: Filtered list with no matches
function FilteredRulesList({ filters }) {
  const filteredRules = useFilteredRules(filters);

  if (filteredRules.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No Matching Rules"
        description="No rules match your current filters. Try removing some filters."
        action={{
          label: "Clear Filters",
          onClick: () => clearFilters()
        }}
      />
    );
  }

  return <RulesList rules={filteredRules} />;
}

// Example 6: First-time user experience
<EmptyState
  icon="👋"
  title="Welcome to Rule Bound"
  description="Get started by browsing our collection of RPG rules."
  action={{
    label: "Start Browsing",
    onClick: () => navigate('/rules')
  }}
/>
```

## Accessibility

- **Semantic Structure**:
  - `<h2>` for title (proper heading hierarchy)
  - `<p>` for description text
  - Semantic HTML throughout
- **Icon Semantics**:
  - Icon marked with `aria-hidden="true"` (decorative)
  - All information conveyed through text
- **Color Contrast**:
  - Title: Neutral-900 on neutral-50 background (excellent contrast)
  - Description: Neutral-600 on neutral-50 background (good contrast)
  - Meets WCAG AA standards
- **Keyboard Navigation**:
  - Action button (when present) fully keyboard accessible
  - Logical tab order
- **Screen Reader Experience**:
  - Title announced as heading
  - Description provides context
  - Action button clearly labeled
- **Visual Hierarchy**:
  - Large icon draws attention
  - Clear heading structure
  - Readable body text
  - Prominent action button

## Visual Design

### Layout

- Display: Flexbox column (flex flex-col)
- Alignment: Centered horizontally and vertically (items-center justify-center)
- Text alignment: Center (text-center)
- Padding: 48px vertical, 16px horizontal (py-12 px-4)

### Icon

- Size: 60px (text-6xl)
- Margin bottom: 16px (mb-4)
- Can be emoji or icon component

### Typography

- Title: 20px, semibold (text-xl font-semibold), neutral-900
- Description: 16px (base), neutral-600
- Maximum description width: ~336px (max-w-sm)

### Spacing

- Icon to title: 16px (mb-4)
- Title to description: 8px (mb-2)
- Description to action: 24px (mb-6)

### Action Button

Uses the primary Button component:

- Variant: Primary
- Size: Medium (default)
- Full styling from Button component

## Use Cases

### Empty Search Results

```tsx
function SearchResults({ query, results }) {
  if (results.length === 0 && query) {
    return (
      <EmptyState
        icon="🔍"
        title="No Results"
        description={`No rules found for "${query}"`}
        action={{
          label: "Clear Search",
          onClick: () => setQuery(""),
        }}
      />
    );
  }

  return <ResultsList results={results} />;
}
```

### Empty Bookmarks

```tsx
function BookmarksPage() {
  const { bookmarks } = useRulesStore();
  const navigate = useNavigate();

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon="📑"
        title="No Bookmarks Yet"
        description="Bookmark rules as you explore to build your personal reference collection."
        action={{
          label: "Browse Rules",
          onClick: () => navigate("/rules"),
        }}
      />
    );
  }

  return <BookmarksList bookmarks={bookmarks} />;
}
```

### Empty Category

```tsx
function CategoryView({ categoryId }) {
  const rules = useRulesByCategory(categoryId);

  if (rules.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No Rules Here"
        description="This category doesn't have any rules yet."
      />
    );
  }

  return <RulesList rules={rules} />;
}
```

### Network Error Recovery

```tsx
function DataView() {
  const { data, error, refetch } = useData();

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Unable to Load"
        description="We couldn't load the content. Please check your connection and try again."
        action={{
          label: "Retry",
          onClick: refetch,
        }}
      />
    );
  }

  return <DataDisplay data={data} />;
}
```

## Icon Selection Guidelines

### Appropriate Icons by Context

**Search/Filter Empty:**

- 🔍 Magnifying glass
- 🎯 Target
- 🔎 Magnifying glass tilted

**No Content:**

- 📚 Books
- 📑 Bookmark tabs
- 📭 Empty inbox
- 📄 Empty page

**Error States:**

- ⚠️ Warning
- ❌ X mark
- 🚫 Prohibited

**Welcome/Onboarding:**

- 👋 Waving hand
- ✨ Sparkles
- 🎉 Party popper

**Category-Specific:**

- ⚔️ Combat (combat rules)
- ✨ Magic (spell rules)
- 🎲 Dice (dice mechanics)

### Icon Best Practices

- Use emojis for consistency with existing design
- Choose universally recognizable icons
- Avoid overly specific or obscure icons
- Consider cultural context

## Design Patterns

### Conditional Empty State

```tsx
function ContentList({ items, isLoading, error }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage {...error} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No Items"
        description="Nothing to display right now."
      />
    );
  }

  return <ItemsList items={items} />;
}
```

### Empty State with Multiple Actions

When you need multiple actions, extend the pattern:

```tsx
function CustomEmptyState() {
  return (
    <div className="flex flex-col items-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">📚</div>
      <h2 className="text-xl font-semibold mb-2">No Rules Yet</h2>
      <p className="text-neutral-600 mb-6 max-w-sm">
        Get started by creating your first rule or importing from a template.
      </p>
      <div className="flex gap-4">
        <Button onClick={createRule}>Create Rule</Button>
        <Button variant="secondary" onClick={importRules}>
          Import Template
        </Button>
      </div>
    </div>
  );
}
```

## Related

- [Button](../ui/Button.md) - Used for action button
- [ErrorMessage](../ui/ErrorMessage.md) - Related component for error states
- [LoadingSpinner](../ui/LoadingSpinner.md) - Related component for loading states
- [BookmarksPage](../../pages/BookmarksPage/BookmarksPage.md) - Uses EmptyState for no bookmarks
- [SearchPage](../../pages/SearchPage/SearchPage.md) - Uses EmptyState for no results
- [ADR-003: Styling Approach](../../../.cursor/features/active/setup-project/adr/ADR-003-styling-approach.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
