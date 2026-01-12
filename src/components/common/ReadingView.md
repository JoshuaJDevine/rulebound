# ReadingView

## Purpose

The ReadingView component provides a document-style reading experience for sequential rule consumption. It displays rules in a continuous, article-like format with a sticky header showing the topic title and progress, fixed bottom navigation for previous/next navigation, and automatic scroll tracking to update the current rule indicator. The component is designed for focused reading sessions where users want to consume rules sequentially without the distraction of navigation elements.

## Usage

```tsx
import { ReadingView } from '@/components/common';

// Basic usage with topic and rules
<ReadingView
  topicTitle="Combat Rules"
  rules={rules}
  onExitReadingMode={() => setReadingMode(false)}
/>

// With initial scroll to specific rule
<ReadingView
  topicTitle="Combat Rules"
  rules={rules}
  initialScrollToRule="103.1"
  onExitReadingMode={() => setReadingMode(false)}
/>

// In a conditional render based on mode
{mode === 'reading' ? (
  <ReadingView
    topicTitle={topic.title}
    rules={childRules}
    onExitReadingMode={() => setMode('navigation')}
  />
) : (
  <RulesList rules={childRules} />
)}
```

## Props / Parameters

| Name                | Type          | Required | Default | Description                                                      |
| ------------------- | ------------- | -------- | ------- | ---------------------------------------------------------------- |
| topicTitle          | string        | Yes      | -       | Title of the topic being read                                    |
| rules               | RuleSection[] | Yes      | -       | Array of rules to display in reading order                       |
| initialScrollToRule | string        | No       | -       | Rule ID to scroll to when component mounts                       |
| onExitReadingMode   | () => void    | Yes      | -       | Handler called when user exits reading mode (back button/Escape) |
| className           | string        | No       | -       | Additional CSS classes to apply to reading view container        |

### RuleSection Type

The component uses the unified `RuleSection` interface (see [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "103.1", "103.2")
  number: string; // Original rule number (e.g., "103.1.", "103.2.")
  title: string; // Rule title
  content: string; // Full text content
  level: number; // Typically 2 for rules
  parentId?: string; // Reference to parent topic ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

## Returns

A full-screen reading view with sticky header, scrollable content area, and fixed bottom navigation, providing a document-style reading experience for sequential rule consumption.

## Examples

```tsx
// Example 1: Basic reading view
function TopicReadingMode({ topicId }: { topicId: string }) {
  const { getRuleById, getChildRules } = useRulesStore();
  const [inReadingMode, setInReadingMode] = useState(false);
  const topic = getRuleById(topicId);
  const rules = topic ? getChildRules(topic.id) : [];

  if (!topic || !inReadingMode) {
    return (
      <TopicCard
        rule={topic}
        onEnterReadingMode={() => setInReadingMode(true)}
      />
    );
  }

  return (
    <ReadingView
      topicTitle={topic.title}
      rules={rules}
      onExitReadingMode={() => setInReadingMode(false)}
    />
  );
}

// Example 2: Reading view with initial scroll
function ReadingModeWithScroll({
  topicId,
  initialRuleId,
}: {
  topicId: string;
  initialRuleId?: string;
}) {
  const { getRuleById, getChildRules } = useRulesStore();
  const topic = getRuleById(topicId);
  const rules = topic ? getChildRules(topic.id) : [];

  if (!topic) return null;

  return (
    <ReadingView
      topicTitle={topic.title}
      rules={rules}
      initialScrollToRule={initialRuleId}
      onExitReadingMode={() => navigate(`/rules/${topicId}`)}
    />
  );
}

// Example 3: Reading view from search result
function SearchResultReading({ ruleId }: { ruleId: string }) {
  const { getRuleById, getChildRules } = useRulesStore();
  const [inReadingMode, setInReadingMode] = useState(false);
  const rule = getRuleById(ruleId);
  const parent = rule?.parentId ? getRuleById(rule.parentId) : null;
  const siblings = parent ? getChildRules(parent.id) : [];

  if (!rule || !parent || !inReadingMode) {
    return <RuleCard rule={rule} onClick={() => setInReadingMode(true)} />;
  }

  return (
    <ReadingView
      topicTitle={parent.title}
      rules={siblings}
      initialScrollToRule={ruleId}
      onExitReadingMode={() => setInReadingMode(false)}
    />
  );
}

// Example 4: Reading view with view mode toggle
function ToggleableReadingView({ topicId }: { topicId: string }) {
  const { getRuleById, getChildRules } = useRulesStore();
  const [mode, setMode] = useState<"navigation" | "reading">("navigation");
  const topic = getRuleById(topicId);
  const rules = topic ? getChildRules(topic.id) : [];

  if (!topic) return null;

  return (
    <div>
      <div className="mb-4">
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>
      {mode === "reading" ? (
        <ReadingView
          topicTitle={topic.title}
          rules={rules}
          onExitReadingMode={() => setMode("navigation")}
        />
      ) : (
        <RulesList rules={rules} />
      )}
    </div>
  );
}
```

## Accessibility

The ReadingView component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves between interactive elements (back button, prev/next buttons)
- **Enter/Space**: Activates focused buttons
- **'n' or 'N'**: Navigate to next rule
- **'p' or 'P'**: Navigate to previous rule
- **Escape**: Exits reading mode (calls `onExitReadingMode`)
- **Focus Management**: 2px focus ring with accent-500 color (gold) on all interactive elements

### Screen Reader Support

- **Semantic HTML**: Uses `<header>`, `<main>`, `<article>`, and `<nav>` elements
- **Heading Hierarchy**: Topic title uses `<h1>`, rule titles use `<h2>`
- **ARIA Labels**: Navigation buttons have clear labels
- **Progress Announcement**: Progress indicator ("Rule X of Y") is announced

### Visual Feedback

- **Focus Indicators**: 2px focus ring with accent-500 color (gold) on all buttons
- **Disabled States**: Previous/next buttons show disabled state when at boundaries
- **Scroll Tracking**: Current rule indicator updates as user scrolls
- **Sticky Elements**: Header and footer remain visible during scroll

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Dark blue header (primary-900) with white text maintains sufficient contrast
- Gold accent colors maintain sufficient contrast
- Dark mode variants tested and validated

### Touch Targets

- All buttons meet minimum 44x44px touch target size
- Adequate padding provides comfortable touch targets
- Bottom navigation is easily accessible on mobile devices

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ← Back  Topic Title        Rule 1 of 5 │  ← Sticky Header
├─────────────────────────────────────────┤
│                                         │
│  103.1.                                 │  ← Rule Number
│  Critical Hit Timing                   │  ← Rule Title (if different)
│                                         │
│  Rule content text here...              │  ← Rule Content
│                                         │
├─────────────────────────────────────────┤
│  103.2.                                 │
│  ...                                    │
├─────────────────────────────────────────┤
│ ← Previous  103.2  Next →              │  ← Fixed Bottom Nav
└─────────────────────────────────────────┘
```

### Styling Details

**Container:**

- Background: neutral-50 (light mode) or neutral-900 (dark mode)
- Min height: min-h-screen
- Bottom padding: pb-20 (space for fixed navigation)

**Header (Sticky):**

- Background: primary-900 (dark blue)
- Border: border-b border-primary-700
- Shadow: shadow-md
- Position: sticky top-0 z-40
- Padding: px-4 py-3
- Layout: Flex row with items-center justify-between

**Content Area:**

- Container: prose-readable (custom prose class)
- Max width: mx-auto (centered)
- Padding: px-4 py-8
- Typography: Optimized for reading

**Articles (Rules):**

- Margin bottom: mb-12
- Padding bottom: pb-8
- Border: border-b border-neutral-200 (light) or primary-800 (dark)
- Last rule: border-b-0

**Bottom Navigation (Fixed):**

- Background: primary-900 (dark blue)
- Border: border-t border-primary-700
- Position: fixed bottom-0 left-0 right-0 z-40
- Padding: px-4 py-3
- Layout: Flex row with items-center justify-between

## Scroll Tracking

The component automatically tracks scroll position to update the current rule indicator:

- **Scroll Listener**: Listens to window scroll events
- **Offset Calculation**: Uses `window.scrollY + 200` to account for sticky header
- **Rule Detection**: Finds the rule whose `offsetTop` is closest to scroll position
- **State Update**: Updates `currentRuleIndex` based on scroll position
- **Performance**: Uses efficient scroll event handling

## Keyboard Shortcuts

The component supports keyboard shortcuts for navigation:

- **'n' or 'N'**: Navigate to next rule
- **'p' or 'P'**: Navigate to previous rule
- **Escape**: Exit reading mode

Keyboard shortcuts are only active when the component is mounted and prevent default behavior to avoid conflicts with browser shortcuts.

## Navigation

### Previous/Next Buttons

- **Previous Button**: Disabled when `currentRuleIndex === 0`
- **Next Button**: Disabled when `currentRuleIndex === rules.length - 1`
- **Navigation**: Smoothly scrolls to target rule using `scrollIntoView`
- **State Update**: Updates `currentRuleIndex` after navigation

### Initial Scroll

If `initialScrollToRule` is provided:

- Component scrolls to the specified rule on mount
- Uses smooth scroll behavior
- Only scrolls if the rule exists in the rules array

## Performance Considerations

### Large Rule Sets

When displaying many rules:

- Scroll tracking is efficient (O(n) where n is number of rules)
- Consider virtualization for 50+ rules if performance issues occur
- Rule refs are stored in a Map for O(1) lookups

### Scroll Event Optimization

- Scroll event listener is cleaned up on unmount
- Consider debouncing scroll events if performance issues occur (though current implementation is efficient)

### Memory Management

- Rule refs Map is cleared when component unmounts
- Event listeners are properly cleaned up
- No memory leaks from event handlers

## Related

- [TopicCard](./TopicCard.md) - Component that can trigger reading mode
- [ViewModeToggle](./ViewModeToggle.md) - Toggle component for switching to reading mode
- [RuleListItem](./RuleListItem.md) - Navigation mode alternative
- [rulesStore](../../store/rulesStore.md) - Provides rules via `getChildRules()` selector
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
