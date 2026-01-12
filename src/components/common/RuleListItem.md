# RuleListItem

## Purpose

The RuleListItem component displays individual rules (level 2) in a compact, scannable list format with a blue-gray left border. It provides a streamlined way to browse rules within a section or topic, featuring the rule number, content preview (truncated to 120 characters), and a right arrow indicator. The component is designed for dense list views where users need to quickly scan and navigate between multiple rules.

## Usage

```tsx
import { RuleListItem } from '@/components/common';

// Basic usage with navigation
<RuleListItem
  rule={ruleSection}
  onClick={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// Without content preview
<RuleListItem
  rule={ruleSection}
  showPreview={false}
  onClick={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// In a list of rules
<div className="space-y-1">
  {rules.map((rule) => (
    <RuleListItem
      key={rule.id}
      rule={rule}
      onClick={(ruleId) => navigate(`/rules/${ruleId}`)}
    />
  ))}
</div>
```

## Props / Parameters

| Name        | Type                     | Required | Default | Description                                                   |
| ----------- | ------------------------ | -------- | ------- | ------------------------------------------------------------- |
| rule        | RuleSection              | Yes      | -       | Rule section object to display (typically level 2)            |
| onClick     | (ruleId: string) => void | No       | -       | Handler called when rule item is clicked                      |
| showPreview | boolean                  | No       | true    | Whether to show content preview (truncated to 120 characters) |
| className   | string                   | No       | -       | Additional CSS classes to apply to list item container        |

### RuleSection Type

The component uses the unified `RuleSection` interface (see [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "103.1", "103.2")
  number: string; // Original rule number (e.g., "103.1.", "103.2.")
  title: string; // Rule title
  content: string; // Full text content (used for preview)
  level: number; // Typically 2 for rules
  parentId?: string; // Reference to parent topic ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

## Returns

An interactive button element displaying rule information in a compact list format, with a blue-gray left border, rule number, content preview, and navigation arrow.

## Examples

```tsx
// Example 1: Basic rule list
function RulesList({ rules }: { rules: RuleSection[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {rules.map((rule) => (
        <RuleListItem
          key={rule.id}
          rule={rule}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 2: Rules without preview (more compact)
function CompactRulesList({ rules }: { rules: RuleSection[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {rules.map((rule) => (
        <RuleListItem
          key={rule.id}
          rule={rule}
          showPreview={false}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 3: Rules within a topic
function TopicRules({ topicId }: { topicId: string }) {
  const { getChildRules } = useRulesStore();
  const navigate = useNavigate();
  const rules = getChildRules(topicId);

  return (
    <div className="space-y-1">
      {rules.map((rule) => (
        <RuleListItem
          key={rule.id}
          rule={rule}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 4: Search results as list items
function SearchResultsList({ results }: { results: SearchResult[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {results.map(({ rule }) => (
        <RuleListItem
          key={rule.id}
          rule={rule}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}
```

## Accessibility

The RuleListItem component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves to the rule item button
- **Enter/Space**: Activates navigation (triggers `onClick`)
- **Focus Management**: 2px focus ring with accent-500 color (gold)

### Screen Reader Support

- **Semantic HTML**: Uses `<button>` element for proper navigation
- **Button Type**: Explicitly set to `type="button"` for clarity
- **Icon Accessibility**: Arrow SVG icon is hidden from screen readers (decorative)

### Visual Feedback

- **Focus Indicators**: 2px focus ring with accent-500 color (gold) on focus
- **Hover States**: Background color change (hover:bg-neutral-100) for visual feedback
- **Transitions**: Smooth color transitions for all interactive states

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Blue-gray border colors maintain sufficient contrast
- Dark mode variants tested and validated

### Touch Targets

- Full button area is tappable (w-full)
- Minimum padding (px-4 py-3) provides adequate touch target size
- Meets 44x44px minimum touch target requirements

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ 103.1  Critical Hit Timing...          │  ← Rule number + preview (truncated)
│        →                                │  ← Arrow indicator
└─────────────────────────────────────────┘
  ↑ Blue-gray left border (2px, primary-300)
  ↑ Hover: bg-neutral-100
  ↑ Focus: ring-2 ring-accent-500
```

### Styling Details

**Container:**

- Background: neutral-50 (light mode) or neutral-800 (dark mode)
- Border: 2px left border, primary-300 (light) or primary-500 (dark)
- Border radius: rounded (default)
- Padding: px-4 py-3
- Width: Full width (w-full)
- Layout: Flex row with items-center and gap-3
- Transition: Color transitions for smooth hover/focus

**Typography:**

- Rule Number: font-mono, text-sm, font-medium, primary-600 (light) or primary-400 (dark), flex-shrink-0, min-w-[60px]
- Content Preview: font-body, text-base, neutral-900 (light) or neutral-200 (dark), truncate, flex-1, min-w-0

**Spacing:**

- Number to content: gap-3 (flex gap)
- Content to arrow: gap-3 (flex gap)
- Overall padding: px-4 py-3

**Visual Hierarchy:**

- Blue-gray left border (2px) provides subtle visual separation
- Rule number has fixed minimum width for alignment
- Content preview truncates with ellipsis for long text
- Arrow indicator signals interactivity

## Content Preview

The component displays a preview of the rule content:

- **Truncation**: Content is truncated to 120 characters with "..." appended if longer
- **Fallback**: If `showPreview` is false or content is empty, displays the rule title instead
- **Display**: Preview text is truncated with CSS `truncate` class (single line with ellipsis)

```tsx
const previewContent =
  showPreview && rule.content
    ? rule.content.length > 120
      ? rule.content.slice(0, 120) + "..."
      : rule.content
    : rule.title;
```

## Performance Considerations

### Large Lists

When rendering many rule list items:

- List layout performs well for typical rule counts (20-100 rules per topic)
- Consider virtualization for 100+ items using react-window or react-virtual
- Memoize onClick handlers if rendering many items:

```tsx
function RulesList({ rules }: { rules: RuleSection[] }) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (ruleId: string) => {
      navigate(`/rules/${ruleId}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-1">
      {rules.map((rule) => (
        <RuleListItem key={rule.id} rule={rule} onClick={handleClick} />
      ))}
    </div>
  );
}
```

### Content Preview Optimization

- Content truncation (120 chars) prevents excessive DOM text
- Single-line truncation ensures consistent item heights
- Preview can be disabled for even more compact lists

## Related

- [TopicCard](./TopicCard.md) - Component for topic-level rules (level 1)
- [SubRuleDisplay](./SubRuleDisplay.md) - Component for nested sub-rules (level 3+)
- [RuleCard](./RuleCard.md) - More detailed card component for rules
- [rulesStore](../../store/rulesStore.md) - Provides rules via `getChildRules()` selector
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
