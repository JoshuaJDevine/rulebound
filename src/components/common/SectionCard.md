# SectionCard

## Purpose

The SectionCard component provides a navigational card for browsing rules by section in the Rule Bound application. It displays a section's icon, title, and rule count in an attractive gradient card design. The component serves as an entry point for users to explore rules within a specific category or section, making the application's content structure immediately discoverable from the home page.

## Usage

```tsx
import { SectionCard } from '@/components/common';

// Basic usage
<SectionCard
  section={section}
  onClick={(sectionId) => navigate(`/rules/${sectionId}`)}
/>

// In a grid layout
<div className="grid grid-cols-2 gap-4">
  {sections.map(section => (
    <SectionCard
      key={section.id}
      section={section}
      onClick={handleSectionClick}
    />
  ))}
</div>
```

## Props / Parameters

| Name      | Type                        | Required | Description                        |
| --------- | --------------------------- | -------- | ---------------------------------- |
| section   | Section                     | Yes      | Section object to display          |
| onClick   | (sectionId: string) => void | Yes      | Click handler receiving section ID |
| className | string                      | No       | Additional CSS classes             |

### Section Type

```typescript
interface Section {
  id: string;
  title: string;
  icon?: string; // Emoji or icon component
  rules: Rule[]; // Array of rules in this section
}
```

## Returns

An interactive, visually distinctive card for navigating to a section's rules.

## Examples

```tsx
// Example 1: Basic section card
<SectionCard
  section={{
    id: 'combat',
    title: 'Combat',
    icon: '⚔️',
    rules: combatRules
  }}
  onClick={(id) => navigate(`/rules/${id}`)}
/>

// Example 2: Grid of sections
function SectionGrid({ sections }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sections.map(section => (
        <SectionCard
          key={section.id}
          section={section}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

// Example 3: Featured sections on home page
function HomePage() {
  const { sections } = useRulesStore();

  return (
    <div>
      <h1>Browse Rule Sections</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {sections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            onClick={(id) => navigate(`/sections/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}

// Example 4: Custom styled card
<SectionCard
  section={section}
  onClick={handleClick}
  className="hover:scale-105"
/>

// Example 5: Section with many rules
<SectionCard
  section={{
    id: 'spells',
    title: 'Spells',
    icon: '✨',
    rules: [...] // 150 rules
  }}
  onClick={viewSection}
/>
// Displays: "150 rules"
```

## Accessibility

- **Semantic HTML**: Proper `<button>` element with `type="button"`
- **ARIA Attributes**:
  - `aria-label` provides full context: "Browse {section title} ({count} rules)"
  - Example: "Browse Combat (23 rules)"
- **Keyboard Navigation**:
  - Tab to focus card
  - Enter or Space to activate
  - Full keyboard accessibility
- **Focus Indicators**:
  - 4px focus ring with primary color at 50% opacity
  - High contrast against card background
  - Clear visual indication
- **Touch Targets**:
  - Minimum height: 120px (min-h-[120px]) ✅
  - Full width card (w-full)
  - Large, easy-to-tap target
- **Icon Semantics**:
  - Icon marked with `aria-hidden="true"` (decorative)
  - Information conveyed through text title and aria-label
- **Text Contrast**:
  - Title: Neutral-900 on light background (excellent contrast)
  - Count: Neutral-600 on light background (good contrast)
- **Visual Feedback**:
  - Shadow increase on hover (hover:shadow-lg)
  - Border color change (hover:border-primary-300)
  - Smooth transitions

## Visual Design

### Layout Structure

```
┌───────────────────────────┐
│                           │
│           🎲              │
│                           │
│      Dice Rolling         │
│        12 rules           │
│                           │
└───────────────────────────┘
```

### Styling

- Background: Gradient from primary-50 to white (bg-gradient-to-br from-primary-50 to-white)
- Border: 1px neutral-200, changes to primary-300 on hover
- Border radius: 12px (rounded-xl) - more rounded than standard cards
- Padding: 24px (p-6)
- Minimum height: 120px (min-h-[120px])
- Width: Full width (w-full)
- Text alignment: Center (text-center)

### Typography

- Icon: 36px (text-4xl)
- Title: 18px, semibold (text-lg font-semibold), neutral-900
- Count: 14px (text-sm), neutral-600

### Spacing

- Icon to title: 12px (mb-3)
- Title to count: 4px (mb-1)
- Flexbox: Column, centered (flex flex-col items-center justify-center)

### Hover State

- Shadow: Large shadow (shadow-lg)
- Border: Primary-300
- Transition: All properties with smooth animation

### Gradient Background

The subtle gradient creates visual interest:

- From: Primary-50 (light blue tint) at top-left
- To: White at bottom-right
- Direction: Bottom-right (to-br)
- Effect: Gentle, professional elevation

## Design Patterns

### Home Page Section Grid

```tsx
function HomePage() {
  const { sections, isLoading } = useRulesStore();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner variant="page" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse by Section</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
```

### Responsive Grid

```tsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {sections.map((section) => (
    <SectionCard key={section.id} section={section} onClick={handleClick} />
  ))}
</div>
```

### Section Navigation

```tsx
function SectionNavigation() {
  const navigate = useNavigate();
  const { sections } = useRulesStore();

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      navigate(`/rules?section=${sectionId}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-4">
      <h2>Quick Navigation</h2>
      <div className="grid grid-cols-2 gap-4">
        {sections.slice(0, 4).map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onClick={handleSectionClick}
          />
        ))}
      </div>
    </div>
  );
}
```

### Empty Section Handling

```tsx
function SectionGrid({ sections }) {
  if (sections.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="No Sections Available"
        description="Rule sections will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} onClick={handleClick} />
      ))}
    </div>
  );
}
```

## Rule Count Display

The component displays a grammatically correct rule count:

- 0 rules: "0 rules"
- 1 rule: "1 rule" (singular)
- 2+ rules: "23 rules" (plural)

```tsx
<p className="text-sm text-neutral-600">
  {section.rules.length} {section.rules.length === 1 ? "rule" : "rules"}
</p>
```

## Icon Guidelines

### Recommended Icon Styles

- **Emojis**: ⚔️, 🎲, ✨, 📜, 🛡️, 🗡️
- **Size**: Large enough to be visible (text-4xl = 36px)
- **Relevance**: Choose icons that represent the section content
- **Consistency**: Use similar style (all emoji or all icon library)

### Icon Best Practices

```tsx
const sectionIcons = {
  combat: "⚔️",
  magic: "✨",
  equipment: "🛡️",
  character: "🧙",
  dice: "🎲",
  rules: "📜",
};
```

## Performance Considerations

### Grid Performance

When rendering many section cards:

- Grid layout performs well for typical section counts (5-20)
- No virtualization needed (unlike rule lists)
- Consider lazy loading section images if added

### Memoization

```tsx
const SectionCard = memo(({ section, onClick, className }) => {
  // Component implementation
});
```

## Related

- [RuleCard](./RuleCard.md) - Related component for individual rules
- [EmptyState](./EmptyState.md) - Shown when no sections available
- [Card](../ui/Card.md) - Base card component
- [HomePage](../../pages/HomePage/HomePage.md) - Primary use case
- [RulesListPage](../../pages/RulesListPage/RulesListPage.md) - Section-filtered view
- [rulesStore](../../store/rulesStore.md) - Provides section data
- [ADR-006: Project Structure](../../../.cursor/features/active/setup-project/adr/ADR-006-project-structure.md)
