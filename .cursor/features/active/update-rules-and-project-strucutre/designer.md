# Designer: Update Rules Data Structure and Project Architecture

## Overview

This design specification defines the UI/UX for the hierarchical rules browsing experience. The new data model enables deep hierarchical navigation through sections, rules, sub-rules, and details, replacing the previous flat structure.

**Core Design Goals:**

1. **Visual Hierarchy**: Make rule depth and relationships immediately clear
2. **Progressive Disclosure**: Allow users to drill down from overview to detail
3. **Efficient Navigation**: Enable quick jumps between related rules
4. **Accessibility First**: WCAG 2.1 AA compliant hierarchical navigation
5. **Teaching-Friendly**: Help users learn rule relationships and structure

## Design Principles

### 1. Hierarchy as Information

The visual design actively communicates hierarchy through:

- Rule number prominence (larger for higher levels)
- Indentation and depth cues
- Color intensity (deeper rules are more subtle)
- Typography scale (sections > rules > details)

### 2. Context Preservation

Users always know where they are through:

- Persistent breadcrumbs showing the full path
- Visual indicators of depth level
- Parent context in detail views
- Consistent navigation patterns

### 3. Accessible Patterns

All navigation supports:

- Keyboard-only operation
- Screen reader announcements with hierarchy levels
- Focus management for tree navigation
- Clear focus indicators at all levels

## User Flows

### Flow 1: Browse from Top-Level Sections

```
HomePage (Sections Browser)
├─ Display: Grid of level 0 sections
├─ User Action: Click "100. Combat"
└─ Navigate to: /rules/100

RuleDetailPage (Section View)
├─ Display: Section title, content, child rules list
├─ Breadcrumb: Home > Combat
├─ User Action: Click "103. Attack Resolution"
└─ Navigate to: /rules/103

RuleDetailPage (Rule View)
├─ Display: Rule title, content, sub-rules, cross-refs
├─ Breadcrumb: Home > Combat > Attack Resolution
├─ User Action: Click "103.1. Declare Target"
└─ Navigate to: /rules/103.1

RuleDetailPage (Sub-rule View)
├─ Display: Sub-rule title, content, details
├─ Breadcrumb: Home > Combat > Attack Resolution > Declare Target
└─ User can navigate to siblings, children, or cross-refs
```

**Key Interactions:**

- Each level shows its children as navigable cards
- Breadcrumbs allow jumping back to any ancestor
- Cross-references link to related rules at any level

### Flow 2: Search and Navigate to Deep Rule

```
SearchPage
├─ User Action: Search "critical hit timing"
├─ Display: Ranked results with hierarchy context
└─ Result: "103.1.a.2. Critical Hit Timing" (shows parent path)

User Action: Click result
├─ Navigate to: /rules/103.1.a.2
└─ Breadcrumb: Home > Combat > Attack Resolution > Declare Target > Critical Hit Timing

RuleDetailPage (Detail View)
├─ Display: Full rule content
├─ Parent Context: Shows parent rule 103.1.a
├─ Siblings: Shows other details under 103.1.a
├─ Cross-refs: "See also: 200. Damage Resolution"
└─ User can navigate up, to siblings, or to cross-refs
```

**Key Interactions:**

- Search results show hierarchy path for context
- Detail pages provide parent context
- Users can navigate up or to related rules

### Flow 3: Tree Navigation (Advanced)

```
RuleDetailPage (with RuleTree component)
├─ Left Sidebar: Collapsible tree of all rules
├─ Current Rule: Highlighted and auto-scrolled into view
├─ User Action: Expand/collapse sections with keyboard
│   - Arrow Right: Expand node
│   - Arrow Left: Collapse node
│   - Arrow Down: Next node
│   - Arrow Up: Previous node
│   - Enter: Navigate to selected node
└─ Tree shows full hierarchy with visual depth cues
```

**Key Interactions:**

- Tree navigation for power users
- Keyboard-driven with arrow keys
- Current location always visible
- Supports rapid navigation without page loads (optional enhancement)

## Component Specifications

### RuleCard

**Purpose**: Display a single rule in list or grid views, showing hierarchy level and navigation affordance.

**TypeScript Interface:**

```typescript
interface RuleCardProps {
  rule: RuleSection;
  onClick?: (id: string) => void;
  variant?: "default" | "compact" | "inline";
  showLevel?: boolean;
  showChildren?: boolean;
  className?: string;
}
```

**Visual Design:**

```
┌─────────────────────────────────────────┐
│ 103.1.a.2.              [Level 3]      │  ← Rule number (bold) + level badge
│ Critical Hit Timing                     │  ← Title (medium font)
│                                         │
│ Brief excerpt of content text...        │  ← Content preview (2 lines max)
│                                         │
│ 📎 2 details • 🔗 3 cross-refs          │  ← Metadata (icons + counts)
└─────────────────────────────────────────┘
  ↑ Card has hover/focus states (primary-300 border)
```

**Hierarchy Visual Cues:**

Level-based styling:

- **Level 0 (Sections)**: Large number (text-2xl), primary-700 color, bold
- **Level 1 (Rules)**: Medium number (text-xl), primary-600 color, semibold
- **Level 2+ (Details)**: Small number (text-lg), neutral-700 color, normal

Depth indicator:

- Colored left border: 4px wide, color intensity decreases with depth
  - Level 0: primary-600
  - Level 1: primary-500
  - Level 2: primary-400
  - Level 3+: primary-300

**Variants:**

1. **default**: Full card with all metadata (grid view)
2. **compact**: Smaller padding, single-line content (list view)
3. **inline**: No border, minimal padding (embedded in text)

**Accessibility:**

```typescript
<article
  role="article"
  aria-label={`Rule ${rule.number} ${rule.title}, Level ${rule.level}`}
  className="..."
  onClick={onClick}
  onKeyDown={(e) => e.key === 'Enter' && onClick(rule.id)}
  tabIndex={0}
>
  {/* Card content */}
</article>
```

**Key Features:**

- Keyboard: Enter key triggers navigation
- Screen Reader: Announces rule number, title, and level
- Focus: Clear 4px ring in primary-500 with offset
- Hover: Shadow increase + border color change

**State:**

- **Default**: Neutral border (neutral-200)
- **Hover**: Primary border (primary-300), subtle shadow
- **Focus**: Ring (primary-500), elevated shadow
- **Active**: Slightly darker background

---

### SectionCard

**Purpose**: Display top-level sections (level 0) on the home page in a prominent, scannable format.

**TypeScript Interface:**

```typescript
interface SectionCardProps {
  section: RuleSection; // level must be 0
  onClick?: (id: string) => void;
  variant?: "default" | "featured";
  className?: string;
}
```

**Visual Design:**

```
┌─────────────────────────────────────────┐
│                                         │
│         100.                            │  ← Large section number (text-4xl)
│     Combat                              │  ← Section title (text-2xl, bold)
│                                         │
│   Master combat mechanics including     │  ← Section description (3 lines max)
│   attacks, defense, and damage...       │
│                                         │
│   📋 24 rules                           │  ← Child count
│                                         │
└─────────────────────────────────────────┘
  ↑ Elevated card (shadow-lg), interactive
```

**Visual Hierarchy:**

- Largest text on home page (text-4xl for number)
- Centered layout for prominence
- More padding (p-6 or p-8)
- Elevated shadow to indicate clickability

**Variants:**

1. **default**: Standard grid card with shadow
2. **featured**: Gradient background, larger size (for first section or featured content)

**Accessibility:**

```typescript
<article
  role="article"
  aria-label={`Section ${section.number} ${section.title}, contains ${section.children.length} rules`}
  className="..."
  onClick={onClick}
  onKeyDown={(e) => e.key === 'Enter' && onClick(section.id)}
  tabIndex={0}
>
  {/* Card content */}
</article>
```

**Key Features:**

- Keyboard navigation with Enter
- Screen reader announces section number, title, and child count
- Prominent hover/focus states
- Visual distinction from RuleCard (larger, more prominent)

**State:**

- **Default**: Elevated shadow, white background
- **Hover**: Increased shadow (shadow-2xl), subtle scale (1.02)
- **Focus**: Primary ring, maximum shadow
- **Active**: Slight scale down (0.98)

---

### RuleTree

**Purpose**: Hierarchical tree navigation component for exploring the full rule structure. Supports keyboard navigation and collapse/expand.

**TypeScript Interface:**

```typescript
interface RuleTreeProps {
  rootRuleId?: string; // Start tree from this rule (default: show all)
  currentRuleId?: string; // Highlight this rule
  onNavigate?: (ruleId: string) => void;
  maxDepth?: number; // Limit tree depth (default: unlimited)
  className?: string;
}

interface RuleTreeNodeProps {
  rule: RuleSection;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  onNavigate: (id: string) => void;
}
```

**Visual Design:**

```
┌─────────────────────────────────────────┐
│ Rules Navigation                        │  ← Tree heading
│                                         │
│ ▼ 100. Combat                           │  ← Level 0 (expandable)
│   ▶ 103. Attack Resolution              │  ← Level 1 (collapsed)
│   ▼ 104. Defense                        │  ← Level 1 (expanded)
│     • 104.1. Block                      │  ← Level 2 (no children)
│     ▶ 104.2. Dodge                      │  ← Level 2 (collapsed)
│   ▶ 105. Damage                         │  ← Level 1 (collapsed)
│                                         │
│ ▼ 200. Character Creation              │  ← Level 0
│   ...                                   │
└─────────────────────────────────────────┘
  ↑ Scrollable container with current rule visible
```

**Hierarchy Visual Cues:**

Indentation:

- Level 0: 0px indent
- Level 1: 16px indent (pl-4)
- Level 2: 32px indent (pl-8)
- Level 3+: 48px indent (pl-12)

Icons:

- **▼** (expanded): Chevron down, indicates children are visible
- **▶** (collapsed): Chevron right, indicates hidden children
- **•** (leaf): Dot, indicates no children

Connecting lines (optional enhancement):

- Subtle vertical lines connecting parent to children (border-l with neutral-300)

**Keyboard Navigation:**

```typescript
// Tree role with keyboard support
<div role="tree" aria-label="Rule hierarchy navigation">
  <div
    role="treeitem"
    aria-expanded={isExpanded}
    aria-level={rule.level + 1}
    aria-posinset={index + 1}
    aria-setsize={siblings.length}
    tabIndex={isActive ? 0 : -1}
  >
    {/* Tree node content */}
  </div>
</div>
```

**Keyboard Interactions:**

| Key         | Action                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Arrow Down  | Move focus to next visible node                                         |
| Arrow Up    | Move focus to previous visible node                                     |
| Arrow Right | Expand current node (if collapsed) or move to first child (if expanded) |
| Arrow Left  | Collapse current node (if expanded) or move to parent (if collapsed)    |
| Enter       | Navigate to focused rule (trigger navigation)                           |
| Space       | Toggle expand/collapse (without navigating)                             |
| Home        | Move to first node in tree                                              |
| End         | Move to last visible node in tree                                       |
| Type-ahead  | Focus node starting with typed characters                               |

**Accessibility:**

```typescript
// Tree container
<nav aria-label="Rule hierarchy navigation">
  <div
    role="tree"
    aria-orientation="vertical"
    aria-multiselectable="false"
  >
    {/* Tree nodes */}
  </div>
</nav>

// Tree node
<div
  role="treeitem"
  aria-expanded={hasChildren ? isExpanded : undefined}
  aria-level={level + 1}
  aria-label={`${rule.number} ${rule.title}`}
  tabIndex={isFocused ? 0 : -1}
  onKeyDown={handleKeyDown}
>
  {/* Node content */}
</div>
```

**Focus Management:**

- Only one node is in tab order (tabindex="0")
- Other nodes have tabindex="-1"
- Arrow keys move focus (roving tabindex pattern)
- Current rule is auto-scrolled into view on mount

**State:**

Tree node states:

- **Default**: Neutral text (neutral-700), no background
- **Hover**: Primary text (primary-600), light background (primary-50)
- **Focus**: Primary ring, primary background (primary-100)
- **Active/Current**: Bold text, darker background (primary-200), primary-700 text
- **Expanded**: Chevron rotated down
- **Collapsed**: Chevron pointing right

**Performance Considerations:**

- Virtualize tree if > 100 visible nodes
- Lazy load deep children (render only visible nodes)
- Debounce type-ahead search

---

### RuleDetailPage

**Purpose**: Display a single rule's full content, children, cross-references, and navigation context.

**Page Structure:**

```
┌────────────────────────────────────────────────────────┐
│ Header (persistent)                                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [Breadcrumb: Home > Combat > Attack Resolution]       │  ← Navigation context
│                                                        │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 103.                                             │ │  ← Rule number (large)
│ │ Attack Resolution                                │ │  ← Rule title (heading)
│ │                                                  │ │
│ │ [Full rule content with formatted text...]       │ │  ← Content area
│ │                                                  │ │
│ │ Multiple paragraphs of rule text can appear      │ │
│ │ here with proper line spacing and formatting.    │ │
│ └──────────────────────────────────────────────────┘ │
│                                                        │
│ ─────────────────────────────────────────────────────  │
│                                                        │
│ Sub-Rules (if children exist)                         │  ← Children section
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│ │ 103.1.       │ │ 103.2.       │ │ 103.3.       │  │  ← RuleCard components
│ │ Declare...   │ │ Roll...      │ │ Compare...   │  │
│ └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                        │
│ See Also (if crossRefs exist)                         │  ← Cross-refs section
│ • 104. Defense Mechanics                              │  ← Links to related rules
│ • 200. Damage Resolution                              │
│                                                        │
│ Referenced By (if referenced by others)               │  ← Backlinks
│ • 105. Critical Hits                                  │
│ • 150. Special Attacks                                │
│                                                        │
└────────────────────────────────────────────────────────┘
│ Bottom Navigation (mobile)                            │
└────────────────────────────────────────────────────────┘
```

**TypeScript Interface:**

```typescript
interface RuleDetailPageProps {
  // Props from router
  ruleId: string; // From URL params (/rules/:id)
}

interface RuleDetailContentProps {
  rule: RuleSection;
  children: RuleSection[];
  crossRefs: RuleSection[];
  referencedBy: RuleSection[];
  breadcrumbPath: BreadcrumbItem[];
}
```

**Layout Sections:**

1. **Breadcrumb Area** (sticky on scroll)
   - Shows full hierarchy path
   - Each segment is clickable
   - Responsive: Truncate middle segments on mobile

2. **Rule Header**
   - Rule number (text-4xl for level 0, text-3xl for level 1, text-2xl for level 2+)
   - Rule title (text-2xl or text-xl depending on level)
   - Level badge (optional, shows "Section", "Rule", "Detail")
   - Bookmark button (floating right)

3. **Content Area**
   - Full rule text with proper typography
   - Uses `@tailwindcss/typography` for prose styling
   - Line height: 1.7 for readability
   - Max width: 65ch for optimal reading

4. **Children Section** (if rule has children)
   - Heading: "Sub-Rules" or "Details" depending on level
   - Grid of RuleCard components
   - Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop

5. **Cross-References Section** (if crossRefs exist)
   - Heading: "See Also"
   - List of related rules as links
   - Show rule number + title
   - Secondary text color (neutral-600)

6. **Referenced By Section** (backlinks)
   - Heading: "Referenced By"
   - List of rules that reference this rule
   - Helps users understand rule relationships
   - Same styling as cross-refs

**Responsive Behavior:**

Desktop (≥1024px):

- Optional left sidebar with RuleTree
- Content area: max-width 800px, centered
- Children grid: 3 columns

Tablet (768px - 1023px):

- No sidebar (or collapsible)
- Content area: max-width 700px
- Children grid: 2 columns

Mobile (<768px):

- Full-width content
- Children grid: 1 column
- Breadcrumb: Truncate middle, show "... >"
- Sticky header with back button

**Accessibility:**

```typescript
<main id="rule-detail" role="main" aria-labelledby="rule-title">
  {/* Breadcrumb */}
  <nav aria-label="Breadcrumb">
    {/* Breadcrumb component */}
  </nav>

  {/* Rule header */}
  <header>
    <h1 id="rule-title" className="...">
      <span className="text-primary-600">{rule.number}</span>
      {rule.title}
    </h1>
  </header>

  {/* Content */}
  <article aria-label="Rule content">
    <div className="prose prose-lg">
      {rule.content}
    </div>
  </article>

  {/* Children section */}
  {children.length > 0 && (
    <section aria-labelledby="sub-rules-heading">
      <h2 id="sub-rules-heading">Sub-Rules</h2>
      <div className="grid ...">
        {/* RuleCard components */}
      </div>
    </section>
  )}

  {/* Cross-refs section */}
  {crossRefs.length > 0 && (
    <nav aria-labelledby="see-also-heading">
      <h2 id="see-also-heading">See Also</h2>
      <ul>
        {/* Links to related rules */}
      </ul>
    </nav>
  )}
</main>
```

**Key Features:**

- Skip link to main content
- Keyboard navigation between sections
- Focus management when navigating between rules
- Screen reader announcements for section transitions
- Semantic HTML (header, article, nav, section)

---

### HomePage

**Purpose**: Entry point for rules browsing, displaying top-level sections.

**Page Structure:**

```
┌────────────────────────────────────────────────────────┐
│ Header (with search)                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Rule Bound                                           │  ← App title
│  Browse Riftbound Core Rules v1.2                     │  ← Subtitle with version
│                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │   000.     │  │   100.     │  │   200.     │     │  ← SectionCard grid
│  │  Golden... │  │  Combat    │  │  Character │     │
│  │            │  │            │  │            │     │
│  │  8 rules   │  │  24 rules  │  │  15 rules  │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │   300.     │  │   400.     │  │   500.     │     │
│  │  Magic     │  │  Equipment │  │  Gameplay  │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                        │
│  ... (more sections)                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
│ Bottom Navigation (mobile)                            │
└────────────────────────────────────────────────────────┘
```

**Layout:**

Grid layout:

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Gap: 4 (16px)

Section cards:

- Use SectionCard component
- Variant: "default"
- Sorted by section number (ascending)

**Empty State:**

If no sections loaded:

```
┌────────────────────────────────────────┐
│                                        │
│         📚 No Rules Loaded            │
│                                        │
│  Rules data is loading or unavailable │
│                                        │
│  [Retry Button]                       │
│                                        │
└────────────────────────────────────────┘
```

**Loading State:**

```
┌────────────────────────────────────────┐
│         ⏳ Loading Rules...            │
│  [Spinner animation]                   │
└────────────────────────────────────────┘
```

---

### SearchPage

**Purpose**: Full-text search across all rules with hierarchical context in results.

**Page Structure:**

```
┌────────────────────────────────────────────────────────┐
│ Header                                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Search Input: "critical hit timing"]                │  ← Large search input
│                                                        │
│  ─────────────────────────────────────────────────────  │
│                                                        │
│  5 results for "critical hit timing"                  │  ← Result count
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 103.1.a.2. Critical Hit Timing        [Level 3]  │ │  ← Result item
│  │ Home > Combat > Attack Resolution > Declare...    │ │  ← Breadcrumb path
│  │                                                   │ │
│  │ ...determines when a critical hit is resolved... │ │  ← Content excerpt (highlighted)
│  │                                                   │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 200.5. Critical Damage                [Level 2]  │ │
│  │ Home > Damage > Critical Hits                    │ │
│  │ ...when timing a critical hit, consider...       │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ... (more results)                                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Search Result Item:**

```typescript
interface SearchResultProps {
  result: SearchResult;
  query: string;
  onClick: (ruleId: string) => void;
}

interface SearchResult {
  rule: RuleSection;
  relevance: number; // 0-1 score
  excerpt: string; // Content with context
  breadcrumbPath: string[]; // Parent IDs for path
}
```

**Visual Design for Result Item:**

```
┌─────────────────────────────────────────────────────┐
│ 103.1.a.2. Critical Hit Timing          [Level 3]  │  ← Number + title + level badge
│ Home > Combat > Attack Resolution > Declare Target  │  ← Breadcrumb (secondary text)
│                                                     │
│ ...determines when a <mark>critical hit</mark> is  │  ← Excerpt with highlighted query
│ resolved during the <mark>timing</mark> phase...    │
│                                                     │
│ 🔗 3 cross-references                              │  ← Metadata
└─────────────────────────────────────────────────────┘
```

**Key Features:**

1. **Highlight Matches**: Use `<mark>` element with primary-200 background
2. **Show Hierarchy**: Breadcrumb path shows where result lives
3. **Relevance Sorting**: Most relevant results first
4. **Excerpt Context**: Show ~200 characters around match

**Empty Search State:**

```
┌────────────────────────────────────────┐
│                                        │
│         🔍 No Results                  │
│                                        │
│  No rules found for "xyz"              │
│                                        │
│  Try different keywords or browse      │
│  sections instead.                     │
│                                        │
│  [Browse Sections Button]             │
│                                        │
└────────────────────────────────────────┘
```

---

### BookmarksPage

**Purpose**: Display user's bookmarked rules with notes and hierarchy context.

**Page Structure:**

```
┌────────────────────────────────────────────────────────┐
│ Header                                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Your Bookmarks                                       │  ← Page title
│  8 rules saved                                        │  ← Bookmark count
│                                                        │
│  [Sort: Most Recent ▼]  [Filter: All Sections ▼]     │  ← Controls
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 103.1. Declare Target              [Level 2]     │ │  ← Bookmark item
│  │ Home > Combat > Attack Resolution                │ │
│  │                                                   │ │
│  │ 📝 "Remember: This affects initiative!"          │ │  ← User note (if present)
│  │                                                   │ │
│  │ Bookmarked: 2 days ago               [Remove]    │ │  ← Timestamp + action
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 200. Damage Resolution              [Level 1]    │ │
│  │ Home > Damage                                    │ │
│  │ Bookmarked: 1 week ago               [Remove]    │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Empty State:**

```
┌────────────────────────────────────────┐
│                                        │
│         🔖 No Bookmarks Yet            │
│                                        │
│  Bookmark rules to save them for       │
│  quick reference later.                │
│                                        │
│  [Browse Rules Button]                │
│                                        │
└────────────────────────────────────────┘
```

---

## Visual Hierarchy System

### Rule Number Display

Rule numbers are the primary hierarchy indicator. Size and weight communicate level:

| Level        | Text Size       | Font Weight    | Color       |
| ------------ | --------------- | -------------- | ----------- |
| 0 (Section)  | text-4xl (36px) | font-extrabold | primary-700 |
| 1 (Rule)     | text-3xl (30px) | font-bold      | primary-600 |
| 2 (Sub-rule) | text-2xl (24px) | font-semibold  | primary-600 |
| 3 (Detail)   | text-xl (20px)  | font-medium    | neutral-700 |
| 4+ (Deep)    | text-lg (18px)  | font-normal    | neutral-600 |

### Color Intensity by Depth

Use color to reinforce hierarchy:

**Borders:**

- Level 0: primary-600 (4px left border)
- Level 1: primary-500 (4px left border)
- Level 2: primary-400 (3px left border)
- Level 3+: primary-300 (2px left border)

**Backgrounds (on hover):**

- Level 0: primary-50
- Level 1: primary-50
- Level 2: neutral-50
- Level 3+: neutral-50

**Text Hierarchy:**

- Primary content (rule number, title): High contrast (neutral-900)
- Secondary content (metadata, counts): Medium contrast (neutral-600)
- Tertiary content (timestamps, hints): Low contrast (neutral-400)

### Typography Scale

Following Material Design principles:

```
H1 (Page title): text-4xl, font-extrabold, neutral-900
H2 (Section heading): text-3xl, font-bold, neutral-900
H3 (Sub-section): text-2xl, font-semibold, neutral-800
H4 (Component heading): text-xl, font-semibold, neutral-800
Body: text-base, font-normal, neutral-700
Caption: text-sm, font-normal, neutral-600
Label: text-xs, font-medium, neutral-600, uppercase, tracking-wide
```

### Spacing System

Consistent spacing reinforces hierarchy:

**Component Padding:**

- SectionCard: p-6 or p-8 (24-32px)
- RuleCard: p-4 (16px)
- Detail content: p-3 (12px)

**Section Gaps:**

- Between cards: gap-4 (16px)
- Between sections: mb-8 or mb-12 (32-48px)
- Between content blocks: mb-6 (24px)

**Indentation in Tree:**

- Each level: pl-4 (16px)
- Visual indicator: 12px from left edge

---

## Cross-Reference Display Patterns

Cross-references are critical for understanding rule relationships. Design them prominently.

### Inline Cross-References

When rules reference others in content text:

```typescript
<p>
  When attacking, see{" "}
  <a href="/rules/103" className="text-primary-600 hover:text-primary-700 underline decoration-primary-300 decoration-2 hover:decoration-primary-500">
    103. Attack Resolution
  </a>
  {" "}for details.
</p>
```

**Styling:**

- Color: primary-600
- Underline: 2px, primary-300 color
- Hover: primary-700 text, primary-500 underline
- Focus: ring with primary-500

### "See Also" Section

Display cross-references as a dedicated section on detail pages:

```
See Also
─────────────────────────────────
→ 104. Defense Mechanics
→ 200. Damage Resolution
→ 150.3. Critical Hit Effects
```

**Implementation:**

```typescript
<nav aria-labelledby="see-also-heading" className="mt-8">
  <h2 id="see-also-heading" className="text-xl font-semibold mb-4">
    See Also
  </h2>
  <ul className="space-y-2">
    {crossRefs.map(ref => (
      <li key={ref.id}>
        <a
          href={`/rules/${ref.id}`}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 hover:underline"
        >
          <span aria-hidden="true">→</span>
          <span>{ref.number} {ref.title}</span>
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### "Referenced By" Section (Backlinks)

Show rules that reference the current rule:

```
Referenced By
─────────────────────────────────
← 105. Critical Hits
← 150. Special Attacks
```

**Visual Distinction:**

- Use left arrow (←) instead of right arrow (→)
- Secondary color (neutral-600) instead of primary
- Smaller text (text-sm)
- Label: "Referenced By" or "Used In"

### Cross-Reference Badge

In card views, show cross-reference count:

```typescript
<div className="flex items-center gap-1 text-sm text-neutral-600">
  <svg className="h-4 w-4" /* link icon */>
  <span>{crossRefs.length} cross-refs</span>
</div>
```

---

## Accessibility Requirements

All components and patterns must meet WCAG 2.1 AA standards. This section provides specific requirements.

### Keyboard Navigation

**Global Shortcuts:**

- **Tab**: Move focus through interactive elements
- **Shift+Tab**: Move focus backward
- **Enter**: Activate focused element (navigate to rule)
- **Escape**: Close modals, cancel actions

**Tree Navigation (RuleTree component):**

- **Arrow Down**: Next node
- **Arrow Up**: Previous node
- **Arrow Right**: Expand node or move to first child
- **Arrow Left**: Collapse node or move to parent
- **Home**: First node
- **End**: Last node
- **Type-ahead**: Jump to node starting with typed character

**Page Navigation:**

- **Skip Link**: Jump to main content (visible on focus)
- **Tab Order**: Logical reading order (breadcrumb → content → children → cross-refs)

### Screen Reader Support

**ARIA Landmarks:**

```html
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <header role="banner">
    <!-- Header content -->
  </header>

  <nav role="navigation" aria-label="Main navigation">
    <!-- Primary nav -->
  </nav>

  <main id="main-content" role="main">
    <!-- Page content -->
  </main>

  <footer role="contentinfo">
    <!-- Footer -->
  </footer>
</body>
```

**ARIA Labels for Hierarchy:**

```typescript
// RuleCard
<article
  role="article"
  aria-label={`Rule ${rule.number} ${rule.title}, Level ${rule.level}, ${rule.children.length} sub-rules`}
>
  {/* Card content */}
</article>

// Tree item
<div
  role="treeitem"
  aria-level={level + 1}
  aria-expanded={hasChildren ? isExpanded : undefined}
  aria-label={`${rule.number} ${rule.title}`}
  aria-current={isActive ? "page" : undefined}
>
  {/* Tree node */}
</div>

// Breadcrumb
<nav aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/" aria-current={isLast ? "page" : undefined}>
        {label}
      </a>
    </li>
  </ol>
</nav>
```

**Live Regions:**

```typescript
// Search results count
<div role="status" aria-live="polite" aria-atomic="true">
  {resultCount} results found for "{query}"
</div>

// Loading state
<div role="status" aria-live="polite" aria-atomic="true">
  <span className="sr-only">Loading rules...</span>
</div>

// Error state
<div role="alert" aria-live="assertive">
  Error loading rules. Please try again.
</div>
```

### Focus Management

**Focus Indicators:**

- All interactive elements have visible focus indicator
- Focus ring: 3px solid, primary-500 color, 2px offset
- Minimum contrast ratio: 3:1 against background
- Never remove outline without alternative indicator

**Focus Order:**

- Logical tab order following visual layout
- Skip links first in tab order
- Modal traps focus (no escape via Tab)
- Returning focus to trigger element when closing modals

**Focus Restoration:**

- When navigating back, restore focus to previous element
- After closing modal, return focus to trigger button
- After delete action, move focus to next logical element

### Color Contrast

All text and interactive elements meet WCAG AA contrast requirements:

**Text Contrast:**

- Large text (≥18pt or ≥14pt bold): 3:1 minimum
- Normal text: 4.5:1 minimum
- Interactive elements: 4.5:1 minimum

**Color Combinations (verified ratios):**

| Foreground  | Background  | Ratio  | Pass |
| ----------- | ----------- | ------ | ---- |
| neutral-900 | white       | 18.5:1 | ✓    |
| neutral-700 | white       | 10.5:1 | ✓    |
| neutral-600 | white       | 7.2:1  | ✓    |
| primary-600 | white       | 5.8:1  | ✓    |
| primary-700 | white       | 7.4:1  | ✓    |
| white       | primary-600 | 5.8:1  | ✓    |
| white       | primary-700 | 7.4:1  | ✓    |

**Non-Text Contrast:**

- Interactive component borders: 3:1 minimum
- Focus indicators: 3:1 minimum
- Icons and graphics: 3:1 minimum

### Semantic HTML

Use appropriate HTML elements for their semantic meaning:

```html
<!-- Page structure -->
<header>, <nav>, <main>, <aside>, <footer>

<!-- Content structure -->
<article>, <section>, <h1>-<h6>

<!-- Lists -->
<ul>, <ol>, <dl> (not <div> styled as lists)

<!-- Interactive -->
<button> for actions, <a> for navigation

<!-- Forms -->
<form>, <label>, <input>, <select>, <textarea>
```

### Responsive and Mobile Accessibility

**Touch Targets:**

- Minimum size: 44x44 CSS pixels (Apple HIG, WCAG 2.5.5)
- Spacing between targets: 8px minimum
- Interactive areas extend beyond visible element

**Mobile Navigation:**

- Bottom nav for primary actions (within thumb reach)
- Sticky header for context
- Large, tappable breadcrumb segments
- Swipe gestures optional, not required

**Orientation Support:**

- Works in portrait and landscape
- No content locked to single orientation
- Reflow content without horizontal scrolling

### Screen Reader Testing Checklist

Test with:

- **NVDA** (Windows, free)
- **JAWS** (Windows, commercial)
- **VoiceOver** (macOS/iOS, built-in)
- **TalkBack** (Android, built-in)

**Verification Points:**

- [ ] All images have meaningful alt text or aria-label
- [ ] Landmark regions are announced
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Form inputs have associated labels
- [ ] Interactive elements announce their role
- [ ] Current page/location is announced
- [ ] Loading and error states are announced
- [ ] Dynamic content changes are announced (live regions)

---

## Responsive Design Specifications

### Breakpoints

Following Tailwind's default breakpoints:

```typescript
const breakpoints = {
  sm: "640px", // Mobile landscape
  md: "768px", // Tablet
  lg: "1024px", // Desktop
  xl: "1280px", // Large desktop
  "2xl": "1536px", // Extra large
};
```

### Mobile (<640px)

**Layout:**

- Single column for all content
- Full-width cards
- Stacked navigation
- Bottom nav for primary actions

**Typography:**

- Slightly smaller headings (-1 size step)
- Increased line height (1.7 → 1.8)
- Larger touch targets (44px minimum)

**Components:**

- SectionCard: p-4 (reduced from p-6)
- RuleCard: Compact variant by default
- Breadcrumb: Truncate middle segments ("Home > ... > Current")

### Tablet (640px - 1023px)

**Layout:**

- 2-column grid for cards
- Sidebar optional (collapsible)
- Mixed navigation (some top, some bottom)

**Typography:**

- Standard sizes
- Optimal reading width: 60ch

**Components:**

- SectionCard: p-6 (standard)
- RuleCard: Default variant
- Tree: Collapsible sidebar or hidden

### Desktop (≥1024px)

**Layout:**

- 3-column grid for cards
- Persistent sidebar with tree navigation
- Top navigation only

**Typography:**

- Full sizes
- Optimal reading width: 65ch
- Increased spacing

**Components:**

- SectionCard: p-8 (expanded)
- RuleCard: Default variant with hover states
- Tree: Persistent left sidebar (280px width)

### Responsive Patterns

**Grid Columns:**

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {sections.map(section => (
    <SectionCard key={section.id} section={section} />
  ))}
</div>
```

**Conditional Rendering:**

```typescript
// Desktop sidebar
<div className="hidden lg:block lg:w-64">
  <RuleTree currentRuleId={ruleId} />
</div>

// Mobile bottom nav
<div className="lg:hidden fixed bottom-0 left-0 right-0">
  <BottomNav />
</div>
```

**Responsive Typography:**

```typescript
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  {section.title}
</h1>
```

---

## Design Decisions

### Decision 1: Unified Card Component vs. Specialized Cards

**Choice**: Separate `SectionCard` and `RuleCard` components

**Rationale**:

- Sections (level 0) require distinct visual treatment
- Sections are entry points and need prominence
- Rules/details share similar structure (can use variants)
- Clearer component API and usage

**Alternative Considered**:

- Single `UnifiedCard` component with level prop
- Rejected: Too many conditional branches, less clear intent

### Decision 2: Tree Navigation Placement

**Choice**: Optional left sidebar on desktop, hidden on mobile

**Rationale**:

- Power users benefit from persistent tree navigation
- Mobile users rely on breadcrumbs and back navigation
- Sidebar competes with content for limited mobile space
- Can add as progressive enhancement

**Alternative Considered**:

- Modal tree on mobile (hamburger menu)
- Rejected: Adds interaction cost, requires animation

### Decision 3: Breadcrumb vs. Back Button on Mobile

**Choice**: Breadcrumb with truncation, back button in header

**Rationale**:

- Breadcrumb preserves full navigation path
- Users can jump to any ancestor (not just back one level)
- Truncation saves space while showing entry and exit points
- Back button provides familiar pattern

**Alternative Considered**:

- Back button only
- Rejected: Loses context for deep hierarchies

### Decision 4: Cross-Reference Display Location

**Choice**: Dedicated "See Also" section after content, before children

**Rationale**:

- Users read content first, then explore related rules
- Cross-refs provide context before drilling into children
- Separates "related" from "child" relationships
- Consistent location across all detail pages

**Alternative Considered**:

- Inline cross-refs within content text
- Rejected: Clutters reading flow, inconsistent presentation

### Decision 5: Level Badge Display

**Choice**: Show level badge on cards, optional on detail pages

**Rationale**:

- Helps users understand hierarchy at a glance
- Useful in search results (provides context)
- Less important on detail page (breadcrumb shows context)
- Can be hidden for cleaner aesthetic

**Alternative Considered**:

- Always show level badge everywhere
- Rejected: Redundant with other hierarchy cues

### Decision 6: Rule Number Prominence

**Choice**: Rule number always visible, size indicates level

**Rationale**:

- Rule numbers are primary identifiers for players
- Size variation reinforces hierarchy without explicit labels
- Familiar pattern from tabletop RPG rulebooks
- Supports "cite by number" use case

**Alternative Considered**:

- Hide numbers for cleaner look, rely on titles
- Rejected: Numbers are essential for reference

### Decision 7: Hierarchical vs. Flat Search Results

**Choice**: Show breadcrumb path with each search result

**Rationale**:

- Provides context for where rule lives in hierarchy
- Helps users understand relevance (is this a main rule or detail?)
- Supports decision-making ("which of these results is what I need?")
- Minimal space cost (small secondary text)

**Alternative Considered**:

- Flat results with just title and excerpt
- Rejected: Loses valuable context, especially for similar titles

### Decision 8: Bookmark Organization

**Choice**: Single list with sort/filter, not folders

**Rationale**:

- Simple initial implementation
- Most users have < 50 bookmarks
- Sort and filter provide sufficient organization
- Can add folders later if needed

**Alternative Considered**:

- Folder system for organizing bookmarks
- Rejected: Added complexity for MVP, can enhance later

---

## Component Styling Guide

### Color Usage

**Primary Colors (Blue):**

- Use for: Actionable elements, links, focus states
- Example: Button backgrounds, link text, active tree nodes

**Neutral Colors (Gray):**

- Use for: Text, borders, backgrounds, disabled states
- Example: Body text (neutral-700), borders (neutral-200)

**Semantic Colors:**

- Success (Green): Confirmation, success messages
- Warning (Amber): Warnings, cautions
- Error (Red): Errors, destructive actions
- Info (Blue): Informational messages

**Do NOT:**

- Use color alone to convey information (pair with text/icons)
- Use more than 2-3 colors per component
- Use colors outside the palette without accessibility check

### Spacing Guidelines

Use Tailwind's spacing scale (4px base unit):

**Component Padding:**

- Compact: p-2 (8px)
- Default: p-4 (16px)
- Spacious: p-6 (24px)
- Extra: p-8 (32px)

**Gaps Between Elements:**

- Tight: gap-2 (8px)
- Normal: gap-4 (16px)
- Loose: gap-6 (24px)

**Margin Between Sections:**

- Small: mb-4 (16px)
- Medium: mb-6 (24px)
- Large: mb-8 (32px)
- Extra: mb-12 (48px)

### Border Radius

Consistent rounding:

- Cards: rounded-lg (8px)
- Buttons: rounded-md (6px)
- Badges: rounded-full (fully rounded)
- Inputs: rounded-md (6px)

### Shadows

Elevation system:

- Flat: No shadow
- Raised: shadow-sm (subtle)
- Elevated: shadow-md (moderate)
- Floating: shadow-lg (prominent)
- Modal: shadow-2xl (strong)

**Usage:**

- Default cards: shadow-sm or border
- Interactive cards: shadow-md on hover
- Modals/overlays: shadow-2xl
- Dropdown menus: shadow-lg

---

## HANDOFF TO CODER

@coder

The **Update Rules Data Structure** design specifications are complete. This design leverages the hierarchical data model architected by @architect to create an intuitive, accessible rules browsing experience.

### Design Summary

**Key Design Decisions:**

1. **Visual Hierarchy System**: Rule numbers scale with level (text-4xl → text-xl), colored borders indicate depth, and typography reinforces structure
2. **Progressive Disclosure**: Users navigate from sections → rules → sub-rules, with each level showing relevant children
3. **Dual Navigation**: Breadcrumbs for context + optional tree navigation for power users
4. **Prominent Cross-References**: Dedicated "See Also" sections connect related rules
5. **Accessible Tree Component**: Full keyboard navigation with ARIA tree role, roving tabindex, and semantic HTML

### Components to Implement

**Priority 1 (Core Experience):**

1. **RuleCard** - Display rules with hierarchy cues (borders, number sizing, level badges)
2. **SectionCard** - Prominent cards for level 0 sections on home page
3. **RuleDetailPage** - Full rule view with content, children, cross-refs, breadcrumbs
4. **HomePage** - Grid of SectionCards for browsing entry

**Priority 2 (Enhanced Navigation):** 5. **RuleTree** - Hierarchical tree navigation with keyboard support and ARIA roles 6. **SearchPage** - Update to show breadcrumb paths in results 7. **BookmarksPage** - Update to use getRuleById selector

### Key Implementation Notes

**Data Access:**

- Use store selectors (NOT direct data access)
- `getTopLevelSections()` for home page
- `getRuleById(id)` for detail pages
- `getChildRules(id)` for child lists
- `getReferencedBy(id)` for backlinks

**Hierarchy Visual Cues:**

- Left border: 4px for levels 0-1, 3px for level 2, 2px for 3+
- Border color: primary-600 → primary-300 (lighter as depth increases)
- Number size: text-4xl → text-lg (smaller as depth increases)
- Font weight: extrabold → normal (lighter as depth increases)

**Accessibility Requirements:**

- All interactive elements: tabindex="0" and keyboard support
- Tree navigation: ARIA tree role with treeitem children
- Focus indicators: 3px ring, primary-500 color, 2px offset
- Screen reader labels: Include rule number, title, and level
- Semantic HTML: Use article, nav, section appropriately

**Responsive Behavior:**

- Mobile: Single column, compact variants, truncated breadcrumbs
- Tablet: 2 columns, collapsible sidebar
- Desktop: 3 columns, persistent sidebar with tree

### Testing Focus

When implementing, verify:

- [ ] Keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] Screen reader announces hierarchy levels
- [ ] Focus indicators are visible (never `outline: none` without alternative)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Touch targets are ≥44px on mobile
- [ ] Tree navigation supports all specified keyboard shortcuts
- [ ] Breadcrumbs update correctly when navigating
- [ ] Cross-references link to correct rules

### Architecture Integration

Refer to:

- **Architecture**: `.cursor/features/active/update-rules-and-project-strucutre/architect.md`
- **ADRs**: `.cursor/features/active/update-rules-and-project-strucutre/adr/`
  - ADR-001: Hierarchical data model
  - ADR-002: Index pattern for lookups
  - ADR-003: Selector pattern for data access

### Design Specifications

All component specs, user flows, accessibility requirements, and visual hierarchy details are documented in this file (designer.md).

Please implement the components according to these specifications, prioritizing accessibility and the hierarchical visual system. The architecture supports all these design decisions with efficient data access patterns.

Let me know if any design details need clarification!
