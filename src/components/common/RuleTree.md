# RuleTree

## Purpose

The RuleTree component provides hierarchical tree navigation for exploring the full rule structure. It displays rules in a collapsible tree format with proper ARIA tree semantics, full keyboard navigation support, and automatic expansion to show the current rule. The component is designed for advanced users who want to navigate the entire rule hierarchy efficiently using keyboard shortcuts.

## Usage

```tsx
import { RuleTree } from '@/components/common';
import { useRulesStore } from '@/store/rulesStore';

// Basic usage - show all top-level sections
function RuleNavigation() {
  const { rulesData } = useRulesStore();
  const rulesMap = new Map(
    rulesData?.sections.map(rule => [rule.id, rule]) || []
  );

  return (
    <RuleTree
      rulesMap={rulesMap}
      currentRuleId="103.1.a"
    />
  );
}

// Show tree starting from a specific rule
<RuleTree
  rulesMap={rulesMap}
  rootRuleId="100"
  currentRuleId="103.1.a"
  onNavigate={(ruleId) => navigate(`/rules/${ruleId}`)}
/>

// Limit tree depth
<RuleTree
  rulesMap={rulesMap}
  maxDepth={2}
  currentRuleId="103.1"
/>

// Custom navigation handler
<RuleTree
  rulesMap={rulesMap}
  currentRuleId={currentRuleId}
  onNavigate={(ruleId) => {
    // Custom navigation logic
    navigate(`/rules/${ruleId}`);
    trackNavigation(ruleId);
  }}
/>
```

## Props / Parameters

| Name          | Type                     | Required | Default | Description                                                     |
| ------------- | ------------------------ | -------- | ------- | --------------------------------------------------------------- |
| rulesMap      | Map<string, RuleSection> | Yes      | -       | Map of rule IDs to RuleSection objects (for O(1) lookups)       |
| rootRuleId    | string                   | No       | -       | Start tree from this rule (default: show all level 0 sections)  |
| currentRuleId | string                   | No       | -       | Highlight and auto-expand path to this rule                     |
| onNavigate    | (ruleId: string) => void | No       | -       | Custom navigation handler (default: uses React Router navigate) |
| maxDepth      | number                   | No       | -       | Limit tree depth (default: unlimited, all levels shown)         |
| className     | string                   | No       | -       | Additional CSS classes to apply to tree container               |

### RulesMap Parameter

The `rulesMap` parameter expects a `Map<string, RuleSection>` for efficient O(1) lookups. You can create this from the rules store:

```tsx
const { rulesData } = useRulesStore();
const rulesMap = new Map(
  rulesData?.sections.map((rule) => [rule.id, rule]) || [],
);
```

Alternatively, if your store provides the index directly:

```tsx
const { rulesData } = useRulesStore();
const rulesMap = new Map(Object.entries(rulesData?.index || {}));
```

### RuleSection Type

The component uses the unified `RuleSection` interface (see [ADR-001: Hierarchical Data Model](../../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "000", "103.1.b.2")
  number: string; // Original rule number (e.g., "000.", "103.1.b.2.")
  title: string; // Extracted heading text
  content: string; // Full text content
  level: number; // 0=section, 1=rule, 2=detail, 3=sub-detail, etc.
  parentId?: string; // Reference to parent rule ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

## Returns

A hierarchical tree navigation component wrapped in a `<nav>` element, containing a scrollable tree structure with ARIA tree semantics.

## Keyboard Navigation

The component implements full keyboard navigation following ARIA tree patterns:

### Arrow Keys

| Key             | Action                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| **Arrow Down**  | Move focus to next visible node (sibling or next item)                  |
| **Arrow Up**    | Move focus to previous visible node (previous sibling or parent)        |
| **Arrow Right** | Expand current node (if collapsed) or move to first child (if expanded) |
| **Arrow Left**  | Collapse current node (if expanded) or move to parent (if collapsed)    |

### Action Keys

| Key       | Action                                           |
| --------- | ------------------------------------------------ |
| **Enter** | Navigate to focused rule (triggers `onNavigate`) |
| **Space** | Toggle expand/collapse (without navigating)      |
| **Home**  | Move focus to first node in tree                 |
| **End**   | Move focus to last visible node in tree          |

### Keyboard Navigation Pattern

The component uses the **roving tabindex pattern** for accessibility:

- Only the selected/focused node has `tabIndex={0}` (in tab order)
- All other nodes have `tabIndex={-1}` (not in tab order)
- Arrow keys programmatically move focus between nodes
- This ensures keyboard users can navigate efficiently without tabbing through every node

## Examples

```tsx
// Example 1: Basic tree navigation sidebar
function RuleDetailPage() {
  const { ruleId } = useParams<{ ruleId: string }>();
  const { rulesData } = useRulesStore();
  const navigate = useNavigate();

  const rulesMap = new Map(
    rulesData?.sections.map((rule) => [rule.id, rule]) || [],
  );

  return (
    <div className="flex gap-4">
      <aside className="w-64 flex-shrink-0">
        <RuleTree
          rulesMap={rulesMap}
          currentRuleId={ruleId}
          onNavigate={(id) => navigate(`/rules/${id}`)}
        />
      </aside>
      <main className="flex-1">{/* Rule detail content */}</main>
    </div>
  );
}

// Example 2: Tree starting from specific section
function SectionTree({ sectionId }: { sectionId: string }) {
  const { rulesData } = useRulesStore();
  const navigate = useNavigate();

  const rulesMap = new Map(
    rulesData?.sections.map((rule) => [rule.id, rule]) || [],
  );

  return (
    <RuleTree
      rulesMap={rulesMap}
      rootRuleId={sectionId}
      onNavigate={(id) => navigate(`/rules/${id}`)}
    />
  );
}

// Example 3: Limited depth tree (show only 2 levels)
function ShallowTree() {
  const { rulesData } = useRulesStore();
  const navigate = useNavigate();

  const rulesMap = new Map(
    rulesData?.sections.map((rule) => [rule.id, rule]) || [],
  );

  return (
    <RuleTree
      rulesMap={rulesMap}
      maxDepth={1}
      onNavigate={(id) => navigate(`/rules/${id}`)}
    />
  );
}

// Example 4: Tree with custom navigation
function CustomNavigationTree() {
  const { rulesData } = useRulesStore();
  const { addToRecentlyViewed } = useRulesStore();

  const rulesMap = new Map(
    rulesData?.sections.map((rule) => [rule.id, rule]) || [],
  );

  const handleNavigate = useCallback(
    (ruleId: string) => {
      addToRecentlyViewed(ruleId);
      navigate(`/rules/${ruleId}`);
      // Analytics tracking
      trackEvent("tree_navigation", { ruleId });
    },
    [addToRecentlyViewed, navigate],
  );

  return (
    <RuleTree
      rulesMap={rulesMap}
      currentRuleId={currentRuleId}
      onNavigate={handleNavigate}
    />
  );
}

// Example 5: Responsive tree (hidden on mobile)
function ResponsiveRuleTree() {
  const { rulesData } = useRulesStore();
  const { ruleId } = useParams<{ ruleId: string }>();
  const navigate = useNavigate();

  const rulesMap = new Map(
    rulesData?.sections.map((rule) => [rule.id, rule]) || [],
  );

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <RuleTree
        rulesMap={rulesMap}
        currentRuleId={ruleId}
        onNavigate={(id) => navigate(`/rules/${id}`)}
      />
    </aside>
  );
}
```

## Accessibility

The RuleTree component implements WCAG 2.1 AA compliant tree navigation:

### ARIA Tree Implementation

The component uses proper ARIA tree semantics:

```tsx
<nav aria-label="Rule hierarchy navigation">
  <div role="tree" aria-orientation="vertical" aria-multiselectable="false">
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={level + 1}
      aria-label={`${rule.number} ${rule.title}`}
    >
      {/* Tree node content */}
    </li>
  </div>
</nav>
```

### Screen Reader Support

- **Tree Role**: `<div role="tree">` announces the tree structure
- **Treeitem Role**: Each node uses `role="treeitem"`
- **Aria-Level**: Indicates hierarchy depth (1-4+)
- **Aria-Expanded**: Announces expand/collapse state
- **Aria-Selected**: Indicates current/selected node
- **Aria-Label**: Announces rule number and title for each node
- **Aria-Current**: Uses `aria-current="page"` for current rule

### Keyboard Navigation

- **Roving Tabindex**: Only selected node is in tab order (accessibility best practice)
- **Arrow Key Navigation**: Full directional navigation through tree
- **Enter/Space**: Standard tree interactions
- **Home/End**: Quick navigation to start/end of tree

### Focus Management

- **Focus Indicators**: 2px focus ring with primary-500 color
- **Auto-Scroll**: Current rule is automatically scrolled into view
- **Focus Visible**: Clear visual indication of focused node

### Visual Feedback

- **Selected State**: Current rule has primary-200 background and bold text
- **Hover State**: Nodes show primary-50 background on hover
- **Focus State**: 2px ring with primary-500 color
- **Expand/Collapse Icons**: Clear visual indicators (chevron down/right)

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Rules Navigation                        │  ← Tree heading
│                                         │
│ ▼ 100. Combat                           │  ← Level 0 (expanded)
│   ▼ 100.1. Initiative                   │  ← Level 1 (expanded)
│     • 100.1.a. Rolling Initiative       │  ← Level 2 (leaf, no children)
│   ▶ 100.2. Attack Resolution            │  ← Level 1 (collapsed)
│   ▶ 100.3. Defense                      │  ← Level 1 (collapsed)
│                                         │
│ ▶ 200. Movement                         │  ← Level 0 (collapsed)
│                                         │
└─────────────────────────────────────────┘
  ↑ Scrollable container (max-h-[600px])
  ↑ Indentation: 16px per level
```

### Styling Details

**Container:**

- Background: White (bg-white)
- Border: 1px neutral-200
- Border radius: 8px (rounded-lg)
- Padding: p-4
- Max height: 600px (max-h-[600px])
- Overflow: Vertical scroll (overflow-y-auto)

**Tree Nodes:**

- Indentation: 16px per level (level \* 16px)
- Padding: px-2 py-1.5
- Text: text-sm, text-neutral-700
- Selected: bg-primary-200, text-primary-900, font-bold
- Hover: bg-primary-50, text-primary-700
- Focus: ring-2 ring-primary-500, ring-offset-1

**Icons:**

- Expand/Collapse: 12px (w-3 h-3), text-neutral-400, hover:text-primary-600
- Leaf indicator: Bullet (•), text-neutral-300, text-xs
- Icons hidden from screen readers (aria-hidden="true")

**Typography:**

- Rule Number: font-mono, text-xs, font-medium, text-neutral-500 (selected: text-primary-700)
- Rule Title: text-sm, truncate
- Heading: text-sm, font-semibold, text-neutral-700, uppercase, tracking-wide

### Hierarchy Visual Cues

- **Indentation**: 16px per level (visual depth)
- **Icons**: Chevron down (expanded), chevron right (collapsed), bullet (leaf)
- **Selected State**: Background color and bold text indicate current rule
- **Level**: Visual indentation communicates hierarchy depth

## Auto-Expand Functionality

The component automatically expands the path to the `currentRuleId`:

1. **Path Detection**: When `currentRuleId` changes, the component finds all parent rules
2. **Auto-Expand**: All parent rules are added to the `expandedIds` set
3. **One-Time Processing**: Path expansion happens once per `currentRuleId` (tracked with ref)
4. **Scroll Behavior**: The current rule is highlighted and should be visible (browser handles scroll)

This ensures users can always see where they are in the tree structure, even if they navigated directly to a deep rule.

## Performance Considerations

### Large Rule Sets

When rendering trees with many rules (100+):

1. **Virtualization**: Consider using react-window for very large trees (1000+ nodes)
2. **Lazy Expansion**: Only render children when parent is expanded
3. **Memoization**: Memoize the rulesMap creation if it's recreated frequently

```tsx
function RuleTreeWrapper() {
  const { rulesData } = useRulesStore();

  // Memoize rulesMap to prevent recreation
  const rulesMap = useMemo(
    () => new Map(rulesData?.sections.map((rule) => [rule.id, rule]) || []),
    [rulesData?.sections],
  );

  return <RuleTree rulesMap={rulesMap} currentRuleId={currentRuleId} />;
}
```

### MaxDepth Optimization

Using `maxDepth` limits the tree depth and can improve performance:

- Fewer DOM nodes rendered
- Faster initial render
- Reduced memory usage
- Better for mobile devices

## React Router Integration

The component integrates with React Router:

- **Default Navigation**: If `onNavigate` is not provided, uses `useNavigate()` from react-router-dom
- **Route Pattern**: Default navigation goes to `/rules/${ruleId}`
- **Custom Navigation**: Provide `onNavigate` prop to override default behavior

The component requires `BrowserRouter` context (provided by React Router) when using default navigation.

## Related

- [RuleCard](./RuleCard.md) - Card component for individual rules
- [SectionCard](./SectionCard.md) - Card component for top-level sections
- [rulesStore](../../store/rulesStore.md) - Provides RuleSection data
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
- [Designer Specs](../../../.cursor/features/active/update-rules-and-project-strucutre/designer.md) - Complete visual design specification
- [WAI-ARIA Tree Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) - ARIA tree accessibility guidelines
