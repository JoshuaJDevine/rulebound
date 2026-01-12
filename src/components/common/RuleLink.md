# RuleLink

## Purpose

The RuleLink component provides an inline cross-reference link with a preview tooltip. It displays rule references within rule content as clickable links with a distinctive gold color and dotted underline, and shows a preview tooltip on hover or focus that displays the referenced rule's title and content preview. This component enables users to quickly understand cross-references without leaving their current reading context.

## Usage

```tsx
import { RuleLink } from '@/components/common';

// Basic usage with navigation
<RuleLink
  ruleId="103.1"
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// With custom display text
<RuleLink
  ruleId="103.1"
  displayText="see Attack Resolution"
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// With preview content
<RuleLink
  ruleId="103.1"
  previewTitle="103.1. Attack Resolution"
  previewContent="When making an attack, resolve it as follows..."
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// Without preview tooltip
<RuleLink
  ruleId="103.1"
  showPreview={false}
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// In rule content with parsed cross-references
<div>
  {parseRuleContent(rule.content).map((part, index) => {
    if (part.type === 'text') return <span key={index}>{part.text}</span>;
    return (
      <RuleLink
        key={index}
        ruleId={part.ruleId}
        displayText={part.text}
        previewTitle={getRuleTitle(part.ruleId)}
        previewContent={getRuleContent(part.ruleId)}
        onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
      />
    );
  })}
</div>
```

## Props / Parameters

| Name           | Type                     | Required | Default | Description                                                  |
| -------------- | ------------------------ | -------- | ------- | ------------------------------------------------------------ |
| ruleId         | string                   | Yes      | -       | ID of the rule to link to                                    |
| displayText    | string                   | No       | -       | Custom text to display (defaults to "rule {ruleId}")         |
| showPreview    | boolean                  | No       | true    | Whether to show preview tooltip on hover/focus               |
| previewTitle   | string                   | No       | -       | Title to display in preview tooltip                          |
| previewContent | string                   | No       | -       | Content preview to display in tooltip (truncated to 3 lines) |
| onNavigate     | (ruleId: string) => void | No       | -       | Handler called when link is clicked                          |
| className      | string                   | No       | -       | Additional CSS classes to apply to link button               |

## Returns

An inline button element styled as a link, with optional preview tooltip that appears on hover or focus, providing a way to reference and navigate to other rules.

## Examples

```tsx
// Example 1: Basic rule link in content
function RuleContent({ rule }: { rule: RuleSection }) {
  const navigate = useNavigate();
  const { getRuleById } = useRulesStore();

  // Parse content and replace rule references
  const contentWithLinks = parseRuleReferences(rule.content, (ruleId) => {
    const referencedRule = getRuleById(ruleId);
    return (
      <RuleLink
        key={ruleId}
        ruleId={ruleId}
        displayText={`rule ${referencedRule?.number || ruleId}`}
        previewTitle={referencedRule?.title}
        previewContent={referencedRule?.content}
        onNavigate={(id) => navigate(`/rules/${id}`)}
      />
    );
  });

  return <div>{contentWithLinks}</div>;
}

// Example 2: Rule link with preview
function RuleWithPreview({ ruleId }: { ruleId: string }) {
  const navigate = useNavigate();
  const { getRuleById } = useRulesStore();
  const rule = getRuleById(ruleId);

  if (!rule) return null;

  return (
    <div>
      <p>
        For more information, see{" "}
        <RuleLink
          ruleId={ruleId}
          displayText={rule.number}
          previewTitle={rule.title}
          previewContent={rule.content}
          onNavigate={(id) => navigate(`/rules/${id}`)}
        />
        .
      </p>
    </div>
  );
}

// Example 3: Multiple rule links in content
function RuleContentWithLinks({
  content,
  crossRefs,
}: {
  content: string;
  crossRefs: string[];
}) {
  const navigate = useNavigate();
  const { getRuleById } = useRulesStore();

  return (
    <div>
      {content}
      {crossRefs.length > 0 && (
        <div className="mt-4">
          <h3>Related Rules:</h3>
          <ul>
            {crossRefs.map((ruleId) => {
              const rule = getRuleById(ruleId);
              if (!rule) return null;
              return (
                <li key={ruleId}>
                  <RuleLink
                    ruleId={ruleId}
                    displayText={`${rule.number} ${rule.title}`}
                    previewTitle={rule.title}
                    previewContent={rule.content}
                    onNavigate={(id) => navigate(`/rules/${id}`)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example 4: Rule link without preview (simple link)
function SimpleRuleLink({ ruleId }: { ruleId: string }) {
  const navigate = useNavigate();

  return (
    <RuleLink
      ruleId={ruleId}
      showPreview={false}
      onNavigate={(id) => navigate(`/rules/${id}`)}
    />
  );
}
```

## Accessibility

The RuleLink component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves to the link button
- **Enter/Space**: Activates navigation (triggers `onNavigate`)
- **Focus Management**: 2px focus ring with accent-500 color (gold)
- **Tooltip on Focus**: Tooltip appears when link receives focus (keyboard accessible)

### Screen Reader Support

- **Semantic HTML**: Uses `<button>` element with `type="button"` for proper navigation
- **Tooltip Role**: Tooltip has `role="tooltip"` for screen reader announcement
- **Button Type**: Explicitly set to `type="button"` for clarity
- **Display Text**: Button text clearly indicates the rule being referenced

### Visual Feedback

- **Focus Indicators**: 2px focus ring with accent-500 color (gold) on focus
- **Hover States**: Text color change and underline style change (dotted to solid)
- **Tooltip Visibility**: Tooltip appears on hover and focus, hides on blur/mouse leave
- **Transitions**: Smooth color transitions for all interactive states

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Gold link color (accent-600/400) maintains sufficient contrast
- Tooltip background and text maintain sufficient contrast
- Dark mode variants tested and validated

### Touch Targets

- Link button meets minimum 44x44px touch target size (inline elements may need padding)
- Tooltip is positioned to avoid covering other content
- Touch-friendly spacing around links

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ ...see rule 103.1...                   │  ← Inline link (gold, dotted underline)
│                                         │
│ ┌─────────────────────────────┐         │
│ │ 103.1. Attack Resolution   │         │  ← Tooltip (on hover/focus)
│ │ When making an attack...    │         │
│ │ Click to view full rule →   │         │
│ └─────────────────────────────┘         │
└─────────────────────────────────────────┘
```

### Styling Details

**Link Button:**

- Color: accent-600 (light) or accent-400 (dark)
- Underline: decoration-dotted, underline-offset-2
- Hover: accent-500 color, decoration-solid
- Focus: ring-2 ring-accent-500, rounded-sm
- Cursor: pointer
- Transition: Color transitions

**Tooltip:**

- Position: absolute, z-50, w-80, mt-2, left-0
- Background: white (light) or neutral-800 (dark)
- Border: border-neutral-200 (light) or primary-700 (dark)
- Border radius: rounded-md
- Shadow: shadow-lg
- Padding: p-4
- Pointer events: none (doesn't interfere with clicks)

**Tooltip Content:**

- Title: font-display, text-base, font-semibold, primary-900 (light) or neutral-100 (dark), mb-2
- Content: font-body, text-sm, neutral-700 (light) or neutral-300 (dark), line-clamp-3
- Footer: text-xs, accent-600 (light) or accent-400 (dark), font-medium, mt-2

## Tooltip Behavior

The tooltip appears and disappears based on user interaction:

- **Show on**: Mouse enter, focus
- **Hide on**: Mouse leave, blur
- **Conditional**: Only shows if `showPreview` is true and either `previewTitle` or `previewContent` is provided
- **Positioning**: Positioned below the link, left-aligned
- **Non-interactive**: Tooltip has `pointer-events-none` to avoid interfering with clicks

## Content Preview

The tooltip displays preview information:

- **Title**: Shows `previewTitle` if provided
- **Content**: Shows `previewContent` if provided, truncated to 3 lines with `line-clamp-3`
- **Footer**: Always shows "Click to view full rule →" in accent color
- **Fallback**: If neither title nor content is provided, tooltip doesn't show

## Performance Considerations

### Many Links in Content

When rendering many rule links:

- Each link manages its own tooltip state (lightweight)
- Tooltip rendering is conditional (only when visible)
- Consider memoizing link components if parsing large content:

```tsx
const RuleLinkMemo = React.memo(RuleLink);

function RuleContentWithManyLinks({ content }: { content: string }) {
  const navigate = useNavigate();
  const { getRuleById } = useRulesStore();
  const links = parseRuleReferences(content);

  return (
    <div>
      {links.map((part, index) => {
        if (part.type === "text") return <span key={index}>{part.text}</span>;
        const rule = getRuleById(part.ruleId);
        return (
          <RuleLinkMemo
            key={index}
            ruleId={part.ruleId}
            displayText={part.text}
            previewTitle={rule?.title}
            previewContent={rule?.content}
            onNavigate={(id) => navigate(`/rules/${id}`)}
          />
        );
      })}
    </div>
  );
}
```

### Tooltip Performance

- Tooltip only renders when `showTooltip` is true
- Tooltip content is static (no expensive computations)
- Position calculations are simple (CSS-based)

## Related

- [RuleCard](./RuleCard.md) - Component for displaying full rule details
- [ReadingView](./ReadingView.md) - Reading mode that may contain rule links
- [rulesStore](../../store/rulesStore.md) - Provides rule data for previews via `getRuleById()`
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/completed/0002_update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
