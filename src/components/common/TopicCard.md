# TopicCard

## Purpose

The TopicCard component displays topic-level rules (level 1) in a prominent, scannable format with a distinctive gold left border. It provides an entry point for users to explore rules within a specific topic, featuring the topic number, title, child count, and action buttons for expanding/collapsing and entering reading mode. The component uses the Cinzel display font for titles and provides clear visual hierarchy through the gold accent border, making topics visually distinct from other rule levels.

## Usage

```tsx
import { TopicCard } from '@/components/common';

// Basic usage with navigation
<TopicCard
  rule={topicRule}
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// With expand/collapse functionality
<TopicCard
  rule={topicRule}
  expanded={isExpanded}
  onToggle={() => setIsExpanded(!isExpanded)}
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// With reading mode entry
<TopicCard
  rule={topicRule}
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
  onEnterReadingMode={() => setReadingMode(true)}
/>

// Full featured usage
<TopicCard
  rule={topicRule}
  expanded={isExpanded}
  onToggle={() => setIsExpanded(!isExpanded)}
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
  onEnterReadingMode={() => setReadingMode(true)}
/>
```

## Props / Parameters

| Name               | Type                     | Required | Default | Description                                                    |
| ------------------ | ------------------------ | -------- | ------- | -------------------------------------------------------------- |
| rule               | RuleSection              | Yes      | -       | Rule section object to display (should have `level: 1`)        |
| expanded           | boolean                  | No       | false   | Whether the topic is currently expanded                        |
| onToggle           | () => void               | No       | -       | Handler called when expand/collapse button is clicked          |
| onNavigate         | (ruleId: string) => void | No       | -       | Handler called when topic card is clicked (navigates to topic) |
| onEnterReadingMode | () => void               | No       | -       | Handler called when "Read" button is clicked                   |
| className          | string                   | No       | -       | Additional CSS classes to apply to card container              |

### RuleSection Type

The component uses the unified `RuleSection` interface (see [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "100", "103.1")
  number: string; // Original rule number (e.g., "100.", "103.1.")
  title: string; // Topic title
  content: string; // Full text content
  level: number; // Should be 1 for topics
  parentId?: string; // Reference to parent section ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

**Note**: The component is designed specifically for level 1 topics. Using it with rules at other levels will still work but may not display correctly.

## Returns

An interactive card element for displaying topic-level rules, featuring a gold left border, Cinzel title font, child count display, and optional action buttons for expand/collapse and reading mode entry.

## Examples

```tsx
// Example 1: Basic topic card in list
function TopicsList({ topics }: { topics: RuleSection[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          rule={topic}
          onNavigate={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 2: Expandable topics with child rules
function ExpandableTopics({ sectionId }: { sectionId: string }) {
  const { getChildRules } = useRulesStore();
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const topics = getChildRules(sectionId);

  const handleToggle = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div key={topic.id}>
          <TopicCard
            rule={topic}
            expanded={expandedTopics.has(topic.id)}
            onToggle={() => handleToggle(topic.id)}
            onNavigate={(id) => navigate(`/rules/${id}`)}
          />
          {expandedTopics.has(topic.id) && (
            <div className="mt-2 ml-4">{/* Render child rules here */}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// Example 3: Topics with reading mode
function TopicsWithReadingMode({ sectionId }: { sectionId: string }) {
  const { getChildRules } = useRulesStore();
  const navigate = useNavigate();
  const [readingModeTopic, setReadingModeTopic] = useState<string | null>(null);
  const topics = getChildRules(sectionId);

  if (readingModeTopic) {
    const topic = topics.find((t) => t.id === readingModeTopic);
    if (topic) {
      const childRules = getChildRules(topic.id);
      return (
        <ReadingView
          topicTitle={topic.title}
          rules={childRules}
          onExitReadingMode={() => setReadingModeTopic(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          rule={topic}
          onNavigate={(id) => navigate(`/rules/${id}`)}
          onEnterReadingMode={() => setReadingModeTopic(topic.id)}
        />
      ))}
    </div>
  );
}

// Example 4: Topic card with all features
function FullFeaturedTopicCard({ topic }: { topic: RuleSection }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [inReadingMode, setInReadingMode] = useState(false);
  const { getChildRules } = useRulesStore();
  const childRules = getChildRules(topic.id);

  if (inReadingMode) {
    return (
      <ReadingView
        topicTitle={topic.title}
        rules={childRules}
        onExitReadingMode={() => setInReadingMode(false)}
      />
    );
  }

  return (
    <TopicCard
      rule={topic}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      onNavigate={(id) => navigate(`/rules/${id}`)}
      onEnterReadingMode={() => setInReadingMode(true)}
    />
  );
}
```

## Accessibility

The TopicCard component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves to the topic card button (main navigation area)
- **Enter/Space**: Activates navigation (triggers `onNavigate`)
- **Focus Management**: 2px focus ring with accent-500 color (gold)
- **Action Buttons**: Expand/collapse and Read buttons are separately focusable

### Screen Reader Support

- **Semantic HTML**: Uses `<button>` element for main navigation area
- **ARIA Labels**: Topic number and title are announced
- **Icon Accessibility**: SVG icons are hidden from screen readers (`aria-hidden="true"`)
- **Heading Hierarchy**: Title uses `<h3>` for proper document structure

### Visual Feedback

- **Focus Indicators**: 2px focus ring with accent-500 color (gold) on all interactive elements
- **Hover States**: Border color change (hover:border-l-accent-400) and shadow increase (hover:shadow-md)
- **Transitions**: Smooth transitions for all interactive states

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Gold accent colors (accent-500, accent-400) maintain sufficient contrast
- Dark mode variants tested and validated

### Touch Targets

- Full card navigation area is tappable
- Action buttons meet minimum 44x44px touch target size
- Adequate spacing between interactive elements

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ 103.                                    │  ← Topic number (mono, accent-600)
│                                         │
│ Attack Resolution                       │  ← Title (Cinzel, text-xl/2xl)
│                                         │
│                          3 rules        │  ← Child count (right-aligned)
│                          [Topic]        │  ← Badge (right-aligned)
│                                         │
│  [Expand]  [Read →]                     │  ← Action buttons (if has children)
└─────────────────────────────────────────┘
  ↑ Gold left border (4px, accent-500)
  ↑ Hover: border-l-accent-400 + shadow-md
  ↑ Focus: ring-2 ring-accent-500
```

### Styling Details

**Container:**

- Background: White (light mode) or neutral-800 (dark mode)
- Border: 1px neutral-200 (light) or primary-700 (dark), 4px gold left border (accent-500)
- Border radius: 6px (rounded-md)
- Padding: p-4
- Width: Full width (w-full)
- Transition: All properties for smooth hover/focus

**Typography:**

- Topic Number: font-mono, text-base, font-semibold, accent-600 (light) or accent-400 (dark)
- Title: font-display (Cinzel), text-xl md:text-2xl, font-semibold, primary-900 (light) or neutral-100 (dark)
- Child Count: text-sm, neutral-700 (light) or neutral-300 (dark), font-body
- Badge: text-xs, font-medium, bg-accent-100 text-accent-800 (light) or bg-accent-900/30 text-accent-300 (dark)

**Spacing:**

- Number to title: mb-1
- Title to action buttons: mt-4
- Action buttons: gap-2

**Visual Hierarchy:**

- Gold left border (4px) creates visual prominence
- Cinzel display font for titles adds elegance
- Child count and badge positioned on the right for balance
- Action buttons only shown when topic has children

## Child Count Display

The component displays the number of child rules with proper pluralization:

- **0 rules**: No count displayed (no children)
- **1 rule**: "1 rule" (singular)
- **2+ rules**: "3 rules" (plural)

The count is displayed with the `children` array from the `RuleSection` interface.

## Action Buttons

### Expand/Collapse Button

- Only shown when `onToggle` is provided and topic has children
- Displays "Expand" or "Collapse" based on `expanded` prop
- Icon rotates 180 degrees when expanded
- Styled as secondary button with border

### Read Button

- Only shown when `onEnterReadingMode` is provided and topic has children
- Displays "Read" with book and arrow icons
- Styled as primary button with gold background (accent-500)
- Triggers reading mode entry when clicked

## Performance Considerations

### List Performance

When rendering many topic cards:

- Grid/list layout performs well for typical topic counts (10-50 topics per section)
- No virtualization needed for typical use cases
- Consider memoizing handlers if rendering many cards:

```tsx
function TopicsList({ topics }: { topics: RuleSection[] }) {
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (ruleId: string) => {
      navigate(`/rules/${ruleId}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <TopicCard key={topic.id} rule={topic} onNavigate={handleNavigate} />
      ))}
    </div>
  );
}
```

## Related

- [SectionCard](./SectionCard.md) - Component for top-level sections (level 0)
- [RuleListItem](./RuleListItem.md) - Component for individual rules (level 2)
- [ReadingView](./ReadingView.md) - Reading mode component for sequential rule consumption
- [rulesStore](../../store/rulesStore.md) - Provides topics via `getChildRules()` selector
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
