# Architect: Improve User Experience

**Feature:** Dramatic UX improvement for reading and navigating Riftbound rules
**Date:** 2026-01-12
**Architect:** AI Assistant

## Overview

The current Rule Bound interface presents Riftbound's 80+ pages of rules as a "sophisticated spreadsheet" - functional for navigation but failing to provide an enjoyable or effective reading experience. This feature dramatically improves how users interact with, read, and understand the rules.

### The Problem

Currently:

1. **All rules look the same**: Topic headers like "401. Exhaust" display identically to actual definitions
2. **Navigation-only UI**: Cards with chevrons are great for drilling down, terrible for reading
3. **No reading flow**: Users can't read through rules sequentially like a document
4. **Disconnected rules**: Cross-references are buried, relationships unclear
5. **Visual monotony**: No hierarchy, no rhythm, no delight

### The Vision

Transform Rule Bound into:

1. **A beautiful rules reference** that makes reading 80 pages actually pleasant
2. **An intelligent interface** that adapts to content type (headers vs. definitions vs. sub-rules)
3. **A connected knowledge base** where rule relationships are visible and navigable
4. **A dual-mode experience** supporting both quick lookup and deep reading

## Architecture Decisions

### ADR-001: Rule Content Classification

**Decision:** Implement runtime classification system to distinguish between:

- **Section headers** (Level 0)
- **Topic headers** (e.g., "401. Exhaust" - title equals content)
- **Definitions** (Rules with actual explanatory content)
- **Sub-rules** (Nested supporting rules)

Classification computed at load time and cached in store.

[Full ADR: ./adr/ADR-001-content-classification.md]

### ADR-002: Reading Mode

**Decision:** Implement dual-mode interface:

- **Navigation Mode** (default): Card-based browsing for quick lookup
- **Reading Mode**: Document-style view for sequential reading within a topic

Smart defaults will suggest reading mode for topics with definitional children.

[Full ADR: ./adr/ADR-002-reading-mode.md]

### ADR-003: Visual Hierarchy

**Decision:** Implement differentiated visual treatment:

- Section headers: Gradient backgrounds, large typography
- Topic headers: Prominent left borders, badges, expandable
- Definitions: Content-focused, prose typography
- Sub-rules: Indented, subtle borders, inline with parent

Left-border color coding provides visual continuity across rule levels.

[Full ADR: ./adr/ADR-003-visual-hierarchy.md]

### ADR-004: Rule Connections

**Decision:** Implement inline cross-reference links with preview tooltips:

- Parse content for rule number patterns
- Convert to clickable links
- Show preview popover on hover/tap
- Enhanced "See Also" section with relationship types

[Full ADR: ./adr/ADR-004-rule-connections.md]

## System Design

### Data Model Extensions

```typescript
// Extend RuleSection with classification metadata
interface RuleSection {
  // ... existing fields ...

  // New: Computed at load time (ADR-001)
  classification?: RuleClassification;
}

interface RuleClassification {
  ruleType: "section" | "topic-header" | "definition" | "sub-rule";
  isHeader: boolean; // Has children AND title ≈ content
  hasSubContent: boolean; // Content contains embedded sub-rules (a., b., etc.)
  isTerminal: boolean; // No children (leaf node)
  contentLength: "empty" | "short" | "medium" | "long";
}

// User preference for viewing mode (ADR-002)
interface UserPreferences {
  // ... existing fields ...

  defaultViewMode: "navigation" | "reading";
  viewModeBySection: Record<string, "navigation" | "reading">;
}
```

### Store Enhancements

```typescript
// New store methods
interface RulesStoreActions {
  // Existing...

  // New: Classification helpers
  getRuleClassification: (ruleId: string) => RuleClassification | undefined;
  getTopicHeaderChildren: (ruleId: string) => RuleSection[]; // For reading mode

  // New: View mode
  getViewMode: (sectionId: string) => "navigation" | "reading";
  setViewMode: (sectionId: string, mode: "navigation" | "reading") => void;

  // New: Cross-reference helpers
  parseRuleReferences: (content: string) => RuleReference[];
}

interface RuleReference {
  ruleId: string;
  matchedText: string; // e.g., "rule 346"
  startIndex: number;
  endIndex: number;
}
```

### Component Architecture

```
src/components/
├── common/
│   ├── RuleDisplay/           # New: Smart display based on classification
│   │   ├── RuleDisplay.tsx    # Wrapper that routes to correct variant
│   │   ├── SectionDisplay.tsx # Level 0 sections
│   │   ├── TopicDisplay.tsx   # Topic headers (expandable/navigable)
│   │   ├── DefinitionDisplay.tsx # Rules with content
│   │   ├── SubRuleDisplay.tsx # Nested sub-rules
│   │   └── index.ts
│   ├── ReadingView/           # New: Document-style reading mode
│   │   ├── ReadingView.tsx    # Full reading experience
│   │   ├── ReadingHeader.tsx  # Sticky topic header
│   │   ├── ReadingNav.tsx     # Navigation within reading view
│   │   └── index.ts
│   ├── RuleLink/              # New: Inline cross-reference links
│   │   ├── RuleLink.tsx       # Link component
│   │   ├── RulePreview.tsx    # Preview popover
│   │   └── index.ts
│   ├── ViewModeToggle/        # New: Navigation/Reading toggle
│   │   └── ViewModeToggle.tsx
│   └── ... existing components
├── layout/
│   └── ... existing
└── ui/
    └── ... existing
```

### New Component Specifications

#### 1. RuleDisplay

**Purpose:** Smart wrapper that renders the appropriate display variant based on rule classification.

```typescript
interface RuleDisplayProps {
  rule: RuleSection;
  variant?: "auto" | "card" | "inline" | "reading";
  showChildren?: boolean;
  onNavigate?: (ruleId: string) => void;
}
```

#### 2. TopicDisplay

**Purpose:** Display topic headers (e.g., "401. Exhaust") with prominence and expand/navigate options.

```typescript
interface TopicDisplayProps {
  rule: RuleSection;
  expanded?: boolean;
  onToggle?: () => void;
  onNavigate?: (ruleId: string) => void;
  onEnterReadingMode?: () => void;
}
```

Visual: Prominent left border, topic badge, children count, expand arrow + "Read" button.

#### 3. DefinitionDisplay

**Purpose:** Display rules with actual content in a readable format.

```typescript
interface DefinitionDisplayProps {
  rule: RuleSection;
  showSubRules?: boolean;
  highlightText?: string;
  linkRuleReferences?: boolean;
}
```

Visual: Clean typography, prose styling, optional inline sub-rules.

#### 4. ReadingView

**Purpose:** Document-style reading experience for a topic and all its children.

```typescript
interface ReadingViewProps {
  topicId: string;
  initialScrollToRule?: string;
  onExitReadingMode?: () => void;
}
```

Features:

- Sticky header with topic title
- Sequential display of all child rules
- Scroll spy to highlight current rule
- Previous/Next navigation
- "Jump to rule" quick nav

#### 5. RuleLink

**Purpose:** Inline cross-reference link with preview.

```typescript
interface RuleLinkProps {
  ruleId: string;
  displayText?: string;
  showPreview?: boolean;
  onNavigate?: (ruleId: string) => void;
}
```

Visual: Primary-colored link, underlined. Hover/tap shows preview popover.

#### 6. ViewModeToggle

**Purpose:** Toggle between navigation and reading modes.

```typescript
interface ViewModeToggleProps {
  mode: "navigation" | "reading";
  onChange: (mode: "navigation" | "reading") => void;
  sectionId?: string;
}
```

Visual: Segmented control or toggle button with icons.

## Technology Choices

### Content Parsing (for cross-references)

Use simple regex for rule reference detection:

```typescript
const RULE_REFERENCE_PATTERNS = [
  /rule\s+(\d+(?:\.\d+)*\.?)/gi, // "rule 346" or "rule 103.2"
  /see\s+(\d+(?:\.\d+)*\.)/gi, // "See 346."
  /\((\d{3}(?:\.\d+)*\.?)\)/g, // "(346.2)"
];
```

### Popover Component

Use Radix UI Popover or similar headless component for cross-reference previews:

- Accessible by default
- Proper focus management
- Works with keyboard navigation
- Smart positioning

If not already in dependencies, recommend adding `@radix-ui/react-popover`.

### Scroll Spy (for Reading View)

Use Intersection Observer for highlighting current rule during scroll:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setCurrentRuleId(entry.target.id);
      }
    });
  },
  { rootMargin: "-20% 0px -80% 0px" },
);
```

## Diagrams

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ RuleDetailPage                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ViewModeToggle [Navigation] [Reading]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Navigation Mode (default)                        │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ RuleDisplay (auto-routes to variant)       │ │   │
│  │  │                                            │ │   │
│  │  │  - SectionDisplay (if level 0)             │ │   │
│  │  │  - TopicDisplay (if topic-header)          │ │   │
│  │  │  - DefinitionDisplay (if definition)       │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │  Children Grid (if navigation mode & has kids)  │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐                    │   │
│  │  │Card  │ │Card  │ │Card  │                    │   │
│  │  └──────┘ └──────┘ └──────┘                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Reading Mode (toggled)                           │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │ ReadingView                                │ │   │
│  │  │  - Sticky ReadingHeader                    │ │   │
│  │  │  - Sequential DefinitionDisplay            │ │   │
│  │  │  - SubRuleDisplay (nested inline)          │ │   │
│  │  │  - ReadingNav (prev/next)                  │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Visual Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ 400. Draw                          [SECTION - Gradient BG]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┃ 401. Exhaust                     [TOPIC - Bold border]    │
│ ┃   Topic • 5 rules      [Expand ▼] [Read →]               │
│                                                             │
│   │ 401.1. Exhausting is an action that marks a non-spell  │
│   │ Game Object as "spent."                                │
│   │                                                        │
│   │   ◦ 401.1.a. To mark it, rotate the card 90 degrees... │
│   │   ◦ 401.1.b. A Unit that is already Exhausted cannot...│
│   │                                                        │
│   │ 401.2. Exhausting a card makes that Game Object        │
│   │ unavailable for specific actions.                       │
│                                                             │
│ ┃ 402. Ready                       [TOPIC - Bold border]    │
│ ┃   Topic • 3 rules      [Expand ▼] [Read →]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Legend:
┃  = Primary-500 left border (4px) - Topic headers
│  = Primary-300 left border (2px) - Definitions
◦  = Neutral-300 left border (1px) - Sub-rules
```

### Cross-Reference Flow

```
User reads: "A player Plays cards by paying costs associated
            with that card. See rule [346. Playing Cards] for
            more information."
                                  ↓
                            (hover/tap)
                                  ↓
┌─────────────────────────────────────────┐
│ 346. Playing Cards                      │
│                                         │
│ Playing a card is the primary action    │
│ in Riftbound. A player must pay the...  │
│                                         │
│ [Go to Rule →]                          │
└─────────────────────────────────────────┘
```

## Considerations for Designer

### Key Design Questions

1. **Reading Mode Toggle Placement**
   - In the page header?
   - Floating action button?
   - Within each topic card?

2. **Topic Header Interactions**
   - Expand children inline vs. navigate to reading mode?
   - Both options? Which is primary?

3. **Mobile Reading Experience**
   - Full-width document view?
   - How to handle sticky header without losing too much space?
   - Swipe gestures for prev/next?

4. **Visual Polish Ideas**
   - Thematic elements (Riftbound/RPG styling)?
   - Dark mode considerations?
   - Animation/transition design?

5. **Content Density**
   - How much preview content in cards?
   - When to truncate vs. show full content?
   - Handling very long rules (some have 20+ sub-rules)?

### Accessibility Priorities

- Reading mode must support screen reader sequential navigation
- View mode toggle must have clear ARIA state
- Rule links need proper link text (not just numbers)
- Preview popovers must be keyboard dismissable
- Focus management when switching modes

### User Research Questions

- Do users prefer to read rules sequentially or jump around?
- What's the typical use case: quick lookup during play or study before play?
- How do users currently use the existing PDF/website?

---

## HANDOFF TO DESIGNER

@designer

**Improve User Experience** has been architected. This is a significant UX overhaul to transform Rule Bound from a functional navigation tool into a delightful rules reading experience.

### Key Architectural Decisions:

1. **Content Classification** (ADR-001): Rules will be classified as section/topic-header/definition/sub-rule to enable differentiated display
2. **Reading Mode** (ADR-002): Dual-mode interface with navigation (card-based) and reading (document-style) modes
3. **Visual Hierarchy** (ADR-003): Distinct visual treatment for each rule type using typography, borders, and spacing
4. **Rule Connections** (ADR-004): Inline cross-reference links with preview popovers

### System Architecture is defined:

- Data model extensions for classification metadata
- Store enhancements for view mode and cross-reference parsing
- New component architecture (RuleDisplay, ReadingView, RuleLink, ViewModeToggle)
- Technology choices (Radix UI for popovers, Intersection Observer for scroll spy)

### Focus Areas for Design:

1. **Visual Design System**
   - Define the exact visual treatment for each rule type
   - Color palette for borders and badges
   - Typography refinements for reading mode
   - Consider thematic/RPG styling opportunities

2. **Interaction Design**
   - Reading mode toggle UX
   - Topic header expand vs. navigate flow
   - Cross-reference preview interactions (desktop hover, mobile tap)
   - Transitions between modes

3. **Mobile Experience**
   - Reading mode on small screens
   - Preview popovers on touch devices
   - Navigation within long documents

4. **Delight Factors**
   - What makes this feel special, not just functional?
   - Animation and micro-interactions
   - Progress indicators for reading
   - Any gamification for learning rules?

Please design the user flows and component specifications based on:

- Architecture in this document
- ADRs in `.cursor/features/active/improve-user-experience/adr/`
- Existing design system in `.cursor/features/completed/0001_setup-project/designer.md`

This feature should **dramatically improve** the experience. The bar is transforming a spreadsheet into something users actually enjoy using.
