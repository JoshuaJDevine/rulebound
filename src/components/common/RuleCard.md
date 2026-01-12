# RuleCard

## Purpose

The RuleCard component displays a rule or section in list views with visual hierarchy cues based on the rule's depth level. It provides a consistent, interactive card format for browsing the hierarchical rules structure, featuring the rule number (sized by level), title, optional content preview, level badge, and metadata (children count and cross-references). The component visually communicates hierarchy through number sizing, border colors, and level badges, making it easy for users to understand the relationship between rules at different levels.

## Usage

```tsx
import { RuleCard } from '@/components/common';

// Basic usage with default variant
<RuleCard
  rule={ruleSection}
  onClick={(id) => navigate(`/rules/${id}`)}
/>

// Compact variant for dense lists
<RuleCard
  rule={ruleSection}
  variant="compact"
  onClick={(id) => navigate(`/rules/${id}`)}
/>

// Inline variant for embedded contexts
<RuleCard
  rule={ruleSection}
  variant="inline"
  onClick={(id) => navigate(`/rules/${id}`)}
/>

// Hide level badge
<RuleCard
  rule={ruleSection}
  showLevel={false}
  onClick={(id) => navigate(`/rules/${id}`)}
/>

// Hide metadata (children count, cross-refs)
<RuleCard
  rule={ruleSection}
  showChildren={false}
  onClick={(id) => navigate(`/rules/${id}`)}
/>
```

## Props / Parameters

| Name         | Type                               | Required | Default   | Description                                                  |
| ------------ | ---------------------------------- | -------- | --------- | ------------------------------------------------------------ |
| rule         | RuleSection                        | Yes      | -         | Rule section object to display (must be a valid RuleSection) |
| onClick      | (id: string) => void               | No       | -         | Click handler called with rule ID when card is clicked       |
| variant      | "default" \| "compact" \| "inline" | No       | "default" | Visual variant affecting padding and content preview         |
| showLevel    | boolean                            | No       | true      | Show level badge (Section/Rule/Sub-rule/Detail)              |
| showChildren | boolean                            | No       | true      | Show metadata (children count and cross-references)          |
| className    | string                             | No       | -         | Additional CSS classes to apply to card container            |

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

An interactive card element displaying rule information with visual hierarchy cues, keyboard navigation support, and integrated metadata display.

## Hierarchy Styling

The component automatically applies visual styling based on the rule's `level` property to communicate hierarchy:

### Level 0 (Sections)

- **Number**: text-2xl, font-extrabold, text-primary-700
- **Border**: 4px left border, primary-600
- **Badge**: "Section"

### Level 1 (Rules)

- **Number**: text-xl, font-bold, text-primary-600
- **Border**: 4px left border, primary-500
- **Badge**: "Rule"

### Level 2 (Sub-rules)

- **Number**: text-lg, font-semibold, text-primary-600
- **Border**: 3px left border, primary-400
- **Badge**: "Sub-rule"

### Level 3+ (Details)

- **Number**: text-lg, font-medium, text-neutral-700
- **Border**: 2px left border, primary-300
- **Badge**: "Detail"

The hierarchy styling system ensures that:

- Higher-level rules (sections) are more prominent
- Depth is immediately visible through number size and border color
- Visual weight decreases with hierarchy depth

## Variants

### default (Default)

Full-featured card for grid and list views:

- Padding: `p-4`
- Content preview: 2-line clamp (if content > 150 chars, truncated)
- All metadata visible
- Border and shadow on hover

### compact

Denser layout for list views:

- Padding: `p-3`
- No content preview
- Smaller title font (text-base)
- All metadata visible
- Border and shadow on hover

### inline

Minimal styling for embedded contexts:

- Padding: `p-2`
- No border (border-0)
- No content preview
- No level badge
- No hover effects
- Minimal visual weight

## Examples

```tsx
// Example 1: Basic rule card in list view
function RulesList({ rules }: { rules: RuleSection[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 2: Grid view with hierarchy
function SectionRules({ sectionId }: { sectionId: string }) {
  const { getChildRules } = useRulesStore();
  const navigate = useNavigate();
  const childRules = getChildRules(sectionId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {childRules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 3: Compact list for nested rules
function SubRulesList({ parentId }: { parentId: string }) {
  const { getChildRules } = useRulesStore();
  const navigate = useNavigate();
  const subRules = getChildRules(parentId);

  return (
    <div className="space-y-2">
      {subRules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          variant="compact"
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 4: Inline variant for related rules
function RelatedRules({ ruleIds }: { ruleIds: string[] }) {
  const { getRuleById } = useRulesStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      {ruleIds.map((id) => {
        const rule = getRuleById(id);
        if (!rule) return null;
        return (
          <RuleCard
            key={rule.id}
            rule={rule}
            variant="inline"
            showLevel={false}
            showChildren={false}
            onClick={(id) => navigate(`/rules/${id}`)}
          />
        );
      })}
    </div>
  );
}

// Example 5: Search results showing hierarchy
function SearchResults({ results }: { results: SearchResult[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {results.map(({ rule }) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 6: Displaying rules at different hierarchy levels
function HierarchyExample() {
  const { getTopLevelSections, getChildRules, getRuleById } = useRulesStore();
  const navigate = useNavigate();

  // Level 0: Sections
  const sections = getTopLevelSections();

  // Level 1: Rules (children of first section)
  const rules = sections[0] ? getChildRules(sections[0].id) : [];

  // Level 2: Sub-rules (children of first rule)
  const subRules = rules[0] ? getChildRules(rules[0].id) : [];

  return (
    <div className="space-y-6">
      <section>
        <h2>Sections (Level 0)</h2>
        <div className="grid grid-cols-3 gap-4">
          {sections.map((section) => (
            <RuleCard
              key={section.id}
              rule={section}
              onClick={(id) => navigate(`/rules/${id}`)}
            />
          ))}
        </div>
      </section>

      {rules.length > 0 && (
        <section>
          <h2>Rules (Level 1)</h2>
          <div className="space-y-3">
            {rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onClick={(id) => navigate(`/rules/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {subRules.length > 0 && (
        <section>
          <h2>Sub-rules (Level 2)</h2>
          <div className="space-y-2">
            {subRules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                variant="compact"
                onClick={(id) => navigate(`/rules/${id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

## Accessibility

The RuleCard component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves to the card button
- **Enter**: Activates the card (triggers `onClick`)
- **Focus Management**: 4px focus ring with primary-500 color and 2px offset

### Screen Reader Support

- **Semantic HTML**: Uses `<button>` element for proper navigation
- **ARIA Labels**: Announces rule number, title, level, and child count
  ```tsx
  aria-label={`Rule ${rule.number} ${rule.title}, Level ${rule.level}${rule.children.length > 0 ? `, ${rule.children.length} sub-rules` : ""}`}
  ```
- **Icon Accessibility**: All SVG icons are hidden from screen readers (`aria-hidden="true"`)

### Visual Feedback

- **Focus Indicators**: 4px focus ring with primary-500 color, 2px offset
- **Hover States**: Shadow increase (hover:shadow-md) and border color change (hover:border-primary-300)
- **Focus-within**: Container shows ring when any child element has focus

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Hierarchy colors (primary-700, primary-600, etc.) maintain sufficient contrast
- Background and text combinations tested and validated

### Touch Targets

- Full card is tappable (w-full on button)
- Minimum touch target sizes maintained for mobile devices
- Padding provides adequate spacing between interactive elements

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ 103.1.a.  Critical Hit Timing           │  ← Rule number (sized by level) + title
│ [Sub-rule]                               │  ← Level badge (optional)
│                                         │
│ Brief excerpt of content text...        │  ← Content preview (2 lines, default only)
│                                         │
│ 📎 2 details • 🔗 3 cross-refs          │  ← Metadata (children count + cross-refs)
└─────────────────────────────────────────┘
  ↑ Left border color indicates level
  ↑ Hover: shadow + border-primary-300
  ↑ Focus: ring-4 ring-primary-500
```

### Styling Details

**Container:**

- Background: White (bg-white)
- Border: 1px neutral-200, colored left border (width/color by level)
- Border radius: 8px (rounded-lg)
- Padding: Variant-dependent (p-4 default, p-3 compact, p-2 inline)
- Width: Full width (w-full)
- Transition: All properties for smooth hover/focus

**Typography:**

- Rule Number: Monospace font, size/weight/color by level
- Title: text-lg (default), text-base (compact), font-semibold, text-neutral-900
- Preview: text-sm, text-neutral-600, line-clamp-2 (default variant only)
- Metadata: text-xs, text-neutral-600
- Badge: text-xs, font-medium, bg-primary-100, text-primary-700

**Spacing:**

- Number to title: gap-3 (flex items-baseline)
- Title to badge: mb-2
- Badge to preview: mb-2
- Preview to metadata: mb-2
- Overall padding: Variant-dependent

**Hierarchy Visual Cues:**

- Left border color: Intensity decreases with depth (primary-600 → primary-300)
- Left border width: 4px (levels 0-1), 3px (level 2), 2px (level 3+)
- Number size: text-2xl (level 0) → text-xl (level 1) → text-lg (levels 2+)
- Number weight: extrabold (level 0) → bold (level 1) → semibold (level 2) → medium (level 3+)

## Performance Considerations

### Large Lists

When rendering many RuleCards:

1. **Virtualization**: Consider using react-window or react-virtual for 100+ items
2. **Memoization**: Memoize onClick handlers and rule data
3. **Lazy Loading**: Load rules data incrementally for very large rule sets

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
    <div className="space-y-4">
      {rules.map((rule) => (
        <RuleCard key={rule.id} rule={rule} onClick={handleClick} />
      ))}
    </div>
  );
}
```

### Content Preview Optimization

- Content preview truncation (150 chars) prevents excessive DOM text
- Line-clamp-2 ensures consistent card heights
- Preview only shown in default variant to reduce rendering cost

## Related

- [SectionCard](./SectionCard.md) - Similar card component for top-level sections
- [RuleTree](./RuleTree.md) - Hierarchical tree navigation component
- [rulesStore](../../store/rulesStore.md) - Provides RuleSection data via selectors
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
- [Designer Specs](../../../.cursor/features/active/update-rules-and-project-strucutre/designer.md) - Complete visual design specification
