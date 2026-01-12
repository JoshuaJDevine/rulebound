# SubRuleDisplay

## Purpose

The SubRuleDisplay component displays nested sub-rules (level 3+) inline within parent rule content. It provides a compact, continuation-style display for deeply nested rules, featuring the sub-rule number, content, and depth-based indentation. The component uses a gray continuation line and smaller text to indicate that these are sub-rules within a parent rule's content, making the hierarchical relationship clear while maintaining readability.

## Usage

```tsx
import { SubRuleDisplay } from '@/components/common';

// Basic usage with default depth
<SubRuleDisplay rule={subRule} />

// With explicit depth
<SubRuleDisplay rule={subRule} depth={2} />

// Rendering multiple sub-rules
<div>
  {subRules.map((subRule) => (
    <SubRuleDisplay key={subRule.id} rule={subRule} depth={1} />
  ))}
</div>

// Nested sub-rules with different depths
<div>
  {subRules.map((subRule, index) => (
    <SubRuleDisplay key={subRule.id} rule={subRule} depth={index + 1} />
  ))}
</div>
```

## Props / Parameters

| Name      | Type        | Required | Default | Description                                               |
| --------- | ----------- | -------- | ------- | --------------------------------------------------------- |
| rule      | RuleSection | Yes      | -       | Sub-rule section object to display (typically level 3+)   |
| depth     | number      | No       | 1       | Depth level for indentation calculation (0-3 recommended) |
| className | string      | No       | -       | Additional CSS classes to apply to sub-rule container     |

### RuleSection Type

The component uses the unified `RuleSection` interface (see [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "103.1.a", "103.1.b.2")
  number: string; // Original rule number (e.g., "103.1.a.", "103.1.b.2.")
  title: string; // Sub-rule title (used as fallback if content is empty)
  content: string; // Full text content (preferred display)
  level: number; // Typically 3+ for sub-rules
  parentId?: string; // Reference to parent rule ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

## Returns

A compact inline display element for sub-rules, featuring depth-based indentation, a gray continuation line, and the sub-rule number and content.

## Examples

```tsx
// Example 1: Display sub-rules within a rule's content
function RuleContent({ rule }: { rule: RuleSection }) {
  const { getChildRules } = useRulesStore();
  const subRules = getChildRules(rule.id);

  return (
    <div>
      <div className="mb-4">{rule.content}</div>
      {subRules.map((subRule) => (
        <SubRuleDisplay key={subRule.id} rule={subRule} depth={1} />
      ))}
    </div>
  );
}

// Example 2: Nested sub-rules with increasing depth
function NestedSubRules({ parentId }: { parentId: string }) {
  const { getChildRules } = useRulesStore();
  const subRules = getChildRules(parentId);

  const renderSubRules = (rules: RuleSection[], depth: number) => {
    return rules.map((rule) => (
      <div key={rule.id}>
        <SubRuleDisplay rule={rule} depth={depth} />
        {rule.children.length > 0 && (
          <div className="ml-4">
            {renderSubRules(getChildRules(rule.id), depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return <div>{renderSubRules(subRules, 1)}</div>;
}

// Example 3: Sub-rules in a rule detail view
function RuleDetail({ ruleId }: { ruleId: string }) {
  const { getRuleById, getChildRules } = useRulesStore();
  const rule = getRuleById(ruleId);
  const subRules = rule ? getChildRules(rule.id) : [];

  if (!rule) return null;

  return (
    <article>
      <h1>{rule.title}</h1>
      <div className="prose">
        <p>{rule.content}</p>
        {subRules.map((subRule) => (
          <SubRuleDisplay key={subRule.id} rule={subRule} depth={1} />
        ))}
      </div>
    </article>
  );
}

// Example 4: Sub-rules with custom styling
function StyledSubRules({ subRules }: { subRules: RuleSection[] }) {
  return (
    <div className="space-y-2">
      {subRules.map((subRule) => (
        <SubRuleDisplay
          key={subRule.id}
          rule={subRule}
          depth={1}
          className="my-2"
        />
      ))}
    </div>
  );
}
```

## Accessibility

The SubRuleDisplay component is designed to meet WCAG 2.1 AA accessibility standards:

### Screen Reader Support

- **Semantic HTML**: Uses `<div>` elements for structure
- **Content Structure**: Sub-rule number and content are clearly separated
- **No Violations**: Component passes accessibility checks (tested with vitest-axe)

### Visual Feedback

- **Continuation Line**: Gray left border provides visual indication of hierarchy
- **Indentation**: Depth-based padding makes nesting relationships clear

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Gray border colors maintain sufficient contrast
- Dark mode variants tested and validated

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│    │ 103.1.a.  Sub-rule content...     │  ← Depth 1 (1.5rem padding)
│    │                                     │
└─────────────────────────────────────────┘
  ↑ Gray continuation line (left border)
  ↑ Indentation based on depth
```

### Styling Details

**Container:**

- Layout: Flex row with gap-2
- Border: 1px left border, neutral-300 (light) or primary-700 (dark)
- Padding: py-2, left padding calculated as `calc(1.5rem * depth)`
- Margin: ml-4 (base left margin)

**Typography:**

- Sub-rule Number: font-mono, text-sm, font-medium, neutral-700 (light) or neutral-400 (dark), flex-shrink-0
- Content: font-body, text-sm, neutral-900 (light) or neutral-200 (dark), flex-1

**Spacing:**

- Number to content: gap-2 (flex gap)
- Vertical spacing: py-2

**Visual Hierarchy:**

- Gray continuation line (left border) indicates sub-rule relationship
- Depth-based indentation (1.5rem per level) shows nesting
- Smaller text size (text-sm) indicates subordinate content

## Depth Handling

The component supports depth levels from 0 to 3+ (though 0-3 are most common):

- **Depth 0**: `paddingLeft: calc(1.5rem * 0)` = 0 (no extra indentation)
- **Depth 1**: `paddingLeft: calc(1.5rem * 1)` = 1.5rem (24px)
- **Depth 2**: `paddingLeft: calc(1.5rem * 2)` = 3rem (48px)
- **Depth 3**: `paddingLeft: calc(1.5rem * 3)` = 4.5rem (72px)

The depth prop allows parent components to control indentation based on the actual nesting level of sub-rules.

## Content Display

The component displays content with a fallback:

- **Primary**: Displays `rule.content` if available
- **Fallback**: Displays `rule.title` if content is empty
- **Empty**: Component still renders if both are empty (shows number only)

```tsx
{
  rule.content || rule.title;
}
```

## Performance Considerations

### Rendering Many Sub-Rules

When rendering many sub-rule displays:

- Inline display performs well for typical sub-rule counts (5-20 per parent)
- Depth calculations are simple and performant
- Consider memoization if rendering deeply nested structures:

```tsx
const SubRuleDisplayMemo = React.memo(SubRuleDisplay);

function RuleWithSubRules({ rule }: { rule: RuleSection }) {
  const { getChildRules } = useRulesStore();
  const subRules = getChildRules(rule.id);

  return (
    <div>
      <div>{rule.content}</div>
      {subRules.map((subRule) => (
        <SubRuleDisplayMemo key={subRule.id} rule={subRule} depth={1} />
      ))}
    </div>
  );
}
```

## Related

- [RuleListItem](./RuleListItem.md) - Component for individual rules (level 2)
- [RuleCard](./RuleCard.md) - More detailed card component for rules
- [ReadingView](./ReadingView.md) - Reading mode that may display sub-rules
- [rulesStore](../../store/rulesStore.md) - Provides sub-rules via `getChildRules()` selector
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
