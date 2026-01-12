# SectionCard

## Purpose

The SectionCard component displays top-level sections (level 0) in a prominent, scannable format, typically used on the home page for primary navigation. It provides an entry point for users to explore rules within a specific section, featuring the section number (large and prominent), title, optional content description, and child count. The component uses a centered layout with elevated styling to make sections visually distinct from regular rule cards.

## Usage

```tsx
import { SectionCard } from '@/components/common';

// Basic usage with default variant
<SectionCard
  section={section}
  onClick={(sectionId) => navigate(`/rules/${sectionId}`)}
/>

// Featured variant for emphasis
<SectionCard
  section={featuredSection}
  variant="featured"
  onClick={(sectionId) => navigate(`/rules/${sectionId}`)}
/>

// Grid layout on home page
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {sections.map(section => (
    <SectionCard
      key={section.id}
      section={section}
      onClick={(sectionId) => navigate(`/rules/${sectionId}`)}
    />
  ))}
</div>
```

## Props / Parameters

| Name      | Type                        | Required | Default   | Description                                               |
| --------- | --------------------------- | -------- | --------- | --------------------------------------------------------- |
| section   | RuleSection                 | Yes      | -         | Rule section object to display (must have `level: 0`)     |
| onClick   | (sectionId: string) => void | Yes      | -         | Click handler called with section ID when card is clicked |
| variant   | "default" \| "featured"     | No       | "default" | Visual variant affecting size, padding, and gradient      |
| className | string                      | No       | -         | Additional CSS classes to apply to card container         |

### RuleSection Type

The component uses the unified `RuleSection` interface (see [ADR-001: Hierarchical Data Model](../../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "000", "100")
  number: string; // Original section number (e.g., "000.", "100.")
  title: string; // Section title
  content: string; // Full text content (used for description)
  level: number; // Must be 0 for sections
  parentId?: string; // Usually undefined for top-level sections
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

**Note**: The component is designed specifically for level 0 sections. Using it with rules at other levels will still work but may not display correctly.

## Returns

An interactive, visually prominent card element for navigating to a section's rules, featuring large section number, title, description, and child count.

## Variants

### default (Default)

Standard section card for grid layouts:

- Background: White (bg-white)
- Padding: p-6 md:p-8
- Section number: text-4xl, text-primary-600
- Title: text-xl md:text-2xl
- Shadow: shadow-lg on hover:shadow-2xl
- Scale: hover:scale-102 (2% larger on hover)

### featured

Emphasized section card for featured/promoted content:

- Background: Gradient (from-primary-100 via-primary-50 to-white)
- Padding: p-8 md:p-10 (larger)
- Section number: text-5xl md:text-6xl, text-primary-700 (larger and darker)
- Title: text-2xl md:text-3xl (larger)
- Shadow: shadow-xl on hover:shadow-2xl (stronger)
- Scale: hover:scale-105 (5% larger on hover)
- Border: border-primary-300 (colored border)

## Examples

```tsx
// Example 1: Basic section card
function SectionCardExample() {
  const { getTopLevelSections } = useRulesStore();
  const navigate = useNavigate();
  const sections = getTopLevelSections();

  return (
    <SectionCard
      section={sections[0]}
      onClick={(id) => navigate(`/rules/${id}`)}
    />
  );
}

// Example 2: Grid of sections on home page
function HomePage() {
  const { getTopLevelSections } = useRulesStore();
  const navigate = useNavigate();
  const sections = getTopLevelSections();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse by Section</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onClick={(id) => navigate(`/rules/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}

// Example 3: Featured section for first/promoted section
function FeaturedSections() {
  const { getTopLevelSections } = useRulesStore();
  const navigate = useNavigate();
  const sections = getTopLevelSections();
  const featuredSection = sections[0];
  const otherSections = sections.slice(1);

  return (
    <div className="space-y-6">
      {/* Featured section */}
      {featuredSection && (
        <SectionCard
          section={featuredSection}
          variant="featured"
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      )}

      {/* Other sections in grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherSections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onClick={(id) => navigate(`/rules/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}

// Example 4: Section navigation with child count
function SectionNavigation() {
  const { getTopLevelSections } = useRulesStore();
  const navigate = useNavigate();
  const sections = getTopLevelSections();

  return (
    <nav>
      <h2>Quick Navigation</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onClick={(id) => navigate(`/rules/${id}`)}
          />
        ))}
      </div>
    </nav>
  );
}

// Example 5: Responsive grid with different variants
function ResponsiveSectionGrid() {
  const { getTopLevelSections } = useRulesStore();
  const navigate = useNavigate();
  const sections = getTopLevelSections();

  return (
    <div className="space-y-8">
      {/* Large featured section on mobile, grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            variant={index === 0 ? "featured" : "default"}
            onClick={(id) => navigate(`/rules/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

## Accessibility

The SectionCard component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves to the card button
- **Enter**: Activates the card (triggers `onClick`)
- **Focus Management**: 4px focus ring with primary-500 color and 2px offset

### Screen Reader Support

- **Semantic HTML**: Uses `<button>` element for proper navigation
- **ARIA Labels**: Announces section number, title, and child count
  ```tsx
  aria-label={`Section ${section.number} ${section.title}, contains ${childCount} ${childCount === 1 ? "rule" : "rules"}`}
  ```
- **Icon Accessibility**: SVG icons are hidden from screen readers (`aria-hidden="true"`)

### Visual Feedback

- **Focus Indicators**: 4px focus ring with primary-500 color, 2px offset
- **Hover States**: Shadow increase and scale transformation (2% default, 5% featured)
- **Active States**: Slight scale reduction for tactile feedback

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Section numbers (primary-600/700) maintain sufficient contrast
- Background and text combinations tested and validated

### Touch Targets

- Full card is tappable (w-full on button)
- Adequate padding provides comfortable touch targets
- Minimum size requirements met for mobile devices

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│                                         │
│           100.                           │  ← Large section number (text-4xl)
│                                         │
│          Combat                          │  ← Section title (text-xl/2xl, bold)
│                                         │
│   Rules for combat encounters and        │  ← Description (3 lines max, truncated)
│   battle mechanics...                    │
│                                         │
│   📋 24 rules                            │  ← Child count with icon
│                                         │
└─────────────────────────────────────────┘
  ↑ Centered layout
  ↑ Elevated shadow (shadow-lg)
  ↑ Hover: shadow-2xl + scale
  ↑ Focus: ring-4 ring-primary-500
```

### Styling Details

**Container:**

- Background: White (default) or gradient (featured)
- Border: 1px neutral-200 (default) or primary-300 (featured)
- Border radius: 12px (rounded-xl)
- Padding: p-6 md:p-8 (default) or p-8 md:p-10 (featured)
- Width: Full width (w-full)
- Text alignment: Center (text-center)
- Transition: All properties for smooth hover/focus

**Typography:**

- Section Number: font-mono, font-extrabold, text-4xl (default) or text-5xl md:text-6xl (featured), primary-600 (default) or primary-700 (featured)
- Title: font-bold, text-xl md:text-2xl (default) or text-2xl md:text-3xl (featured), text-neutral-900
- Description: text-sm (default) or text-base (featured), text-neutral-600, line-clamp-3, max-w-md (default) or max-w-lg (featured)
- Child Count: text-sm, text-neutral-500

**Spacing:**

- Number to title: mb-3
- Title to description: mb-3
- Description to count: mb-4
- Overall padding: Variant-dependent (p-6 md:p-8 or p-8 md:p-10)

**Visual Hierarchy:**

- Section numbers are the largest text on the home page
- Centered layout creates visual prominence
- Elevated shadows indicate clickability
- Featured variant uses gradient background for emphasis

### Gradient Background (Featured Variant)

The featured variant uses a subtle gradient:

- From: primary-100 (top-left)
- Via: primary-50 (middle)
- To: white (bottom-right)
- Direction: Bottom-right (to-br)
- Effect: Gentle elevation and visual interest

## Child Count Display

The component displays the number of child rules with proper pluralization:

- **0 rules**: "0 rules"
- **1 rule**: "1 rule" (singular)
- **2+ rules**: "24 rules" (plural)

The count is displayed with a document icon (📋) and uses the `children` array from the `RuleSection` interface.

```tsx
{
  childCount;
}
{
  childCount === 1 ? "rule" : "rules";
}
```

## Content Description

The component displays a truncated version of the section's content as a description:

- **Truncation**: Content is truncated to 200 characters with "..." appended
- **Line Clamp**: Description is limited to 3 lines using `line-clamp-3`
- **Conditional Display**: Description is only shown if:
  - Content exists
  - Content is different from the title
  - Content is not empty

The description provides context about the section's content without overwhelming the card design.

## Performance Considerations

### Grid Performance

When rendering many section cards:

- Grid layout performs well for typical section counts (5-20 sections)
- No virtualization needed (unlike rule lists which can have 100+ items)
- Consider lazy loading if adding images to sections in the future

### Memoization

Consider memoizing the onClick handler if rendering many cards:

```tsx
function SectionGrid({ sections }: { sections: RuleSection[] }) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (sectionId: string) => {
      navigate(`/rules/${sectionId}`);
    },
    [navigate],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} onClick={handleClick} />
      ))}
    </div>
  );
}
```

## Related

- [RuleCard](./RuleCard.md) - Related component for individual rules (levels 1+)
- [HomePage](../../pages/HomePage/HomePage.tsx) - Primary use case for section cards
- [rulesStore](../../store/rulesStore.md) - Provides sections via `getTopLevelSections()` selector
- [ADR-001: Hierarchical Data Model](../../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
- [Designer Specs](../../../.cursor/features/active/update-rules-and-project-strucutre/designer.md) - Complete visual design specification
