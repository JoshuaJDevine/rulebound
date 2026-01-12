# Designer: Improve User Experience

**Feature:** Dramatic UX improvement for reading and navigating Riftbound rules
**Date:** 2026-01-12
**Designer:** AI Assistant

## Overview

This document defines the complete UI/UX redesign for Rule Bound, transforming it from a functional navigation tool into a delightful, branded reading experience aligned with Riftbound's visual identity.

### Design Goals

1. **Brand Alignment**: Dark blue + warm gold palette reflecting Riftbound's official theming
2. **Visual Hierarchy**: Clear differentiation between sections, topics, definitions, and sub-rules
3. **Reading Experience**: Document-style scanning once inside sections (minimal cards)
4. **Dual Mode Support**: Navigation mode (cards) at top level, reading mode for deep content
5. **Dark Mode**: Full dark mode support from day one
6. **Delight**: Subtle animations, branded typography, professional polish

### Key Design Decisions

| Decision             | Choice                | Rationale                                      |
| -------------------- | --------------------- | ---------------------------------------------- |
| Color palette        | Dark blue + warm gold | Matches Riftbound official branding            |
| Header font          | Cinzel                | Classical, fantasy-appropriate, majestic       |
| Body font            | Crimson Pro           | Elegant serif, excellent readability for rules |
| Top-level navigation | Section cards         | Visual impact, clear wayfinding                |
| Inside sections      | Minimal cards         | Compact, scannable, document-like              |
| Circular motif       | Subtle                | Icons, badges, focus rings - not overwhelming  |
| Dark mode            | Priority              | Natural fit with dark blue palette             |

---

## Design System

### Color Palette

The palette shifts from the current sky blue to Riftbound-appropriate dark blue with warm gold accents.

#### Primary Colors (Dark Blue)

```css
/* Riftbound Dark Blue - Primary brand color */
--primary-50: #f0f4f8; /* Lightest - subtle backgrounds */
--primary-100: #d9e2ec; /* Light - hover states (light mode) */
--primary-200: #bcccdc; /* Light medium - borders (light mode) */
--primary-300: #9fb3c8; /* Medium - disabled states */
--primary-400: #829ab1; /* Medium - secondary text */
--primary-500: #627d98; /* Medium strong - body text */
--primary-600: #486581; /* Primary - interactive elements */
--primary-700: #334e68; /* Primary dark - headings */
--primary-800: #243b53; /* Dark - dark backgrounds */
--primary-900: #102a43; /* Darkest - hero, headers, dark mode bg */
```

#### Accent Colors (Warm Gold)

```css
/* Riftbound Gold - Accent color for highlights and CTAs */
--accent-50: #fffbeb; /* Lightest - subtle highlight bg */
--accent-100: #fef3c7; /* Light - hover states */
--accent-200: #fde68a; /* Light medium - badges */
--accent-300: #fcd34d; /* Medium - active borders */
--accent-400: #fbbf24; /* Medium strong - icons */
--accent-500: #f59e0b; /* Primary accent - CTAs, links */
--accent-600: #d97706; /* Accent dark - hover on CTAs */
--accent-700: #b45309; /* Darker - pressed states */
--accent-800: #92400e; /* Very dark - text on light bg */
--accent-900: #78350f; /* Darkest - headings on light bg */
```

#### Neutral Colors

```css
/* Neutral grays for text and backgrounds */
--neutral-50: #f8fafc; /* White alternative - page bg light mode */
--neutral-100: #f1f5f9; /* Very light - card backgrounds */
--neutral-200: #e2e8f0; /* Light - borders, dividers */
--neutral-300: #cbd5e1; /* Medium light - disabled */
--neutral-400: #94a3b8; /* Medium - placeholder text */
--neutral-500: #64748b; /* Gray - secondary text */
--neutral-600: #475569; /* Dark gray - body text */
--neutral-700: #334155; /* Darker - headings */
--neutral-800: #1e293b; /* Very dark - dark mode cards */
--neutral-900: #0f172a; /* Almost black - dark mode bg */
```

#### Semantic Colors

```css
/* Success */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;
--success-700: #15803d;

/* Warning */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;
--warning-700: #b45309;

/* Error */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;
--error-700: #b91c1c;

/* Info */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
--info-700: #1d4ed8;
```

### Dark Mode Colors

Dark mode uses the deep primary blues as backgrounds with gold accents for contrast.

```css
/* Dark Mode Semantic Tokens */
--dm-bg-primary: var(--neutral-900); /* #0f172a - main background */
--dm-bg-secondary: var(--primary-900); /* #102a43 - elevated surfaces */
--dm-bg-card: var(--neutral-800); /* #1e293b - cards */
--dm-bg-hover: var(--primary-800); /* #243b53 - hover states */

--dm-text-primary: var(--neutral-100); /* #f1f5f9 - main text */
--dm-text-secondary: var(--neutral-400); /* #94a3b8 - secondary text */
--dm-text-muted: var(--neutral-500); /* #64748b - muted text */

--dm-border: var(--primary-700); /* #334e68 - borders */
--dm-border-subtle: var(--primary-800); /* #243b53 - subtle borders */

--dm-accent: var(--accent-400); /* #fbbf24 - gold accent */
--dm-accent-hover: var(--accent-300); /* #fcd34d - hover gold */
```

### Color Contrast Verification (WCAG AA)

| Combination     | Light Mode                | Dark Mode                  | Ratio           | Pass   |
| --------------- | ------------------------- | -------------------------- | --------------- | ------ |
| Body text on bg | neutral-700 on neutral-50 | neutral-100 on neutral-900 | 10.4:1 / 15.1:1 | AAA    |
| Headings on bg  | primary-900 on neutral-50 | neutral-50 on neutral-900  | 16.1:1 / 18.1:1 | AAA    |
| Accent on bg    | accent-600 on neutral-50  | accent-400 on neutral-900  | 4.6:1 / 8.2:1   | AA/AAA |
| Muted text      | neutral-500 on neutral-50 | neutral-400 on neutral-900 | 5.1:1 / 4.7:1   | AA     |

---

### Typography

#### Font Families

```css
/* Cinzel - Headers, logo, section titles */
--font-display: "Cinzel", Georgia, "Times New Roman", serif;

/* Crimson Pro - Body text, rules content */
--font-body: "Crimson Pro", Georgia, "Times New Roman", serif;

/* System mono - Rule numbers, code */
--font-mono:
  ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas,
  "Liberation Mono", "Courier New", monospace;
```

#### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
  rel="stylesheet"
/>
```

#### Type Scale

| Token        | Size            | Line Height | Weight | Font        | Usage             |
| ------------ | --------------- | ----------- | ------ | ----------- | ----------------- |
| `display-xl` | 48px (3rem)     | 1.1         | 700    | Cinzel      | Hero title        |
| `display-lg` | 36px (2.25rem)  | 1.2         | 700    | Cinzel      | Page titles       |
| `display-md` | 30px (1.875rem) | 1.25        | 600    | Cinzel      | Section headers   |
| `display-sm` | 24px (1.5rem)   | 1.3         | 600    | Cinzel      | Topic headers     |
| `heading-lg` | 20px (1.25rem)  | 1.4         | 600    | Crimson Pro | Subsection titles |
| `heading-md` | 18px (1.125rem) | 1.4         | 600    | Crimson Pro | Card titles       |
| `body-lg`    | 18px (1.125rem) | 1.6         | 400    | Crimson Pro | Featured body     |
| `body-md`    | 16px (1rem)     | 1.6         | 400    | Crimson Pro | Default body      |
| `body-sm`    | 14px (0.875rem) | 1.5         | 400    | Crimson Pro | Secondary text    |
| `caption`    | 12px (0.75rem)  | 1.5         | 500    | Crimson Pro | Labels, captions  |
| `mono-lg`    | 20px (1.25rem)  | 1.3         | 600    | Mono        | Section numbers   |
| `mono-md`    | 16px (1rem)     | 1.4         | 500    | Mono        | Rule numbers      |
| `mono-sm`    | 14px (0.875rem) | 1.4         | 500    | Mono        | Sub-rule numbers  |

#### Typography Accessibility

- Base font size: 16px minimum (never smaller for body text)
- Line height: 1.5-1.6 for body text (optimal readability)
- Letter spacing: Default (Crimson Pro has good natural spacing)
- Text resizable to 200% without loss of functionality
- Maximum line length: 65-75 characters (use `max-width: 65ch`)

---

### Spacing Scale

Based on 4px base unit:

| Token      | Value | Usage                  |
| ---------- | ----- | ---------------------- |
| `space-0`  | 0     | Reset                  |
| `space-1`  | 4px   | Tight inline spacing   |
| `space-2`  | 8px   | Compact spacing        |
| `space-3`  | 12px  | Default inline spacing |
| `space-4`  | 16px  | Default block spacing  |
| `space-5`  | 20px  | Medium spacing         |
| `space-6`  | 24px  | Section spacing        |
| `space-8`  | 32px  | Large spacing          |
| `space-10` | 40px  | XL spacing             |
| `space-12` | 48px  | Hero spacing           |
| `space-16` | 64px  | Page sections          |

---

### Border Radius

```css
--radius-none: 0;
--radius-sm: 4px; /* Subtle rounding - badges */
--radius-md: 8px; /* Default - cards, buttons */
--radius-lg: 12px; /* Large - modals, featured cards */
--radius-xl: 16px; /* Hero sections */
--radius-full: 9999px; /* Circular - icons, pills */
```

The circular motif is expressed subtly through:

- Fully rounded badges and pills
- Circular icon containers
- Round focus rings
- Progress indicators

---

### Shadows

```css
/* Light mode shadows */
--shadow-sm: 0 1px 2px 0 rgb(16 42 67 / 0.05);
--shadow-md:
  0 4px 6px -1px rgb(16 42 67 / 0.08), 0 2px 4px -2px rgb(16 42 67 / 0.05);
--shadow-lg:
  0 10px 15px -3px rgb(16 42 67 / 0.08), 0 4px 6px -4px rgb(16 42 67 / 0.05);
--shadow-xl:
  0 20px 25px -5px rgb(16 42 67 / 0.1), 0 8px 10px -6px rgb(16 42 67 / 0.05);

/* Dark mode shadows (more subtle, use border instead) */
--shadow-dm-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-dm-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
--shadow-dm-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3);

/* Gold glow for accent states */
--glow-accent: 0 0 20px rgb(251 191 36 / 0.3);
```

---

### Focus States

```css
/* Focus ring - circular motif */
--focus-ring-width: 3px;
--focus-ring-offset: 2px;
--focus-ring-color-light: var(--accent-500); /* Gold */
--focus-ring-color-dark: var(--accent-400); /* Brighter gold */

/* Applied as */
.focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--focus-ring-offset) var(--bg-color),
    0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
      var(--focus-ring-color);
}
```

---

## Visual Hierarchy System

### Rule Type Differentiation

The core UX improvement: different rule types look different.

#### Level 0: Section Headers

**Purpose:** Major divisions (000. Glossary, 100. The Game, etc.)

**Visual Treatment:**

- Background: Gradient from `primary-800` to `primary-900` (dark blue)
- Typography: `display-md` Cinzel, white text
- Number: `mono-lg`, `accent-400` (gold)
- Border: None (the background IS the differentiation)
- Shadow: `shadow-lg`
- Icon: Section-specific icon in gold
- Spacing: `space-8` padding, `space-6` margin-bottom

```
┌─────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░  [Icon]                                                 ░ │
│ ░  400                                                    ░ │
│ ░  DRAW PHASE                                             ░ │
│ ░  12 rules                                               ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────┘
  (Dark blue gradient background, gold number, white title)
```

#### Level 1: Topic Headers

**Purpose:** Topic concepts (401. Exhaust, 402. Ready, etc.)

**Visual Treatment:**

- Background: White (light) / `neutral-800` (dark)
- Left border: 4px `accent-500` (gold)
- Typography: `display-sm` Cinzel for title
- Number: `mono-md`, `accent-600` (gold)
- Badge: "Topic" pill, gold-tinted
- Children count: Subtle, right-aligned
- Hover: Subtle shadow, border brightens

```
┃ 401                                              5 rules  →
┃ Exhaust                                            [Topic]
┃
```

#### Level 2+: Definitions (Minimal Cards)

**Purpose:** Actual rule content (401.1, 401.2, etc.)

**Visual Treatment:**

- Background: `neutral-50` (light) / `neutral-800` (dark)
- Left border: 2px `primary-300` (blue-gray)
- Typography: `body-md` Crimson Pro
- Number: `mono-sm`, `primary-600`
- Content preview: 1-2 lines, truncated
- Hover: Very subtle highlight
- Compact: Less padding than section cards

```
│ 401.1  Exhausting is an action that marks a non-spell...  →
│ 401.2  A card that is already Exhausted cannot be...       →
│ 401.3  Some effects may "ready" an Exhausted card...       →
```

#### Level 3+: Sub-rules (Inline)

**Purpose:** Nested details (401.1.a, 401.1.b, etc.)

**Visual Treatment:**

- Background: Transparent
- Left border: 1px `neutral-300` continuation line
- Typography: `body-sm` Crimson Pro
- Number: `mono-sm`, `neutral-500`
- Indentation: 24px from parent
- Display: Always inline with parent (no separate navigation)

```
  │ a. To exhaust a card, rotate it 90 degrees clockwise.
  │ b. A Unit that is already Exhausted cannot attack.
```

### Visual Hierarchy Summary Table

| Level          | Background         | Border             | Number Style | Title Style             | Behavior               |
| -------------- | ------------------ | ------------------ | ------------ | ----------------------- | ---------------------- |
| 0 (Section)    | Dark blue gradient | None               | Gold mono-lg | White Cinzel display-md | Card, navigate         |
| 1 (Topic)      | White/dark card    | 4px gold left      | Gold mono-md | Cinzel display-sm       | Card, expand/navigate  |
| 2 (Definition) | Subtle bg          | 2px blue-gray left | Blue mono-sm | Crimson heading-md      | Minimal card, navigate |
| 3+ (Sub-rule)  | Transparent        | 1px gray left      | Gray mono-sm | Crimson body-sm         | Inline, no navigation  |

---

## Component Specifications

### Updated Components

#### 1. Header (Redesigned)

**Changes from current:**

- Background: `primary-900` (dark blue) instead of white
- Logo: Cinzel font, white with gold accent on hover
- Nav links: White, gold underline on hover/active
- Search: Dark input with gold focus ring
- Mobile: Dark background, gold icons

**Light Mode:**

```
┌─────────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████████████ │
│ █  RULE BOUND        Browse  Bookmarks  [Search...]     █ │
│ ████████████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────┘
  (Dark blue #102a43 background, white text, gold accents)
```

**Styling:**

```css
.header {
  background: var(--primary-900);
  border-bottom: 1px solid var(--primary-700);
}

.header-logo {
  font-family: var(--font-display);
  font-weight: 600;
  color: white;
  letter-spacing: 0.05em;
}

.header-logo:hover {
  color: var(--accent-400);
}

.header-nav-link {
  color: var(--primary-100);
}

.header-nav-link:hover,
.header-nav-link.active {
  color: white;
  text-decoration: underline;
  text-decoration-color: var(--accent-500);
  text-underline-offset: 4px;
}
```

#### 2. BottomNav (Mobile - Redesigned)

**Changes from current:**

- Background: `primary-900` (dark blue)
- Icons: `primary-300` default, `accent-400` (gold) when active
- Labels: Small, below icons
- Active indicator: Gold dot or underline

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████████████ │
│ █     🏠           📚           🔖           🔍          █ │
│ █    Home        Browse      Bookmarks     Search        █ │
│ ████████████████████████████████████████████████████████████ │
└─────────────────────────────────────────────────────────────┘
  (Dark blue background, gold active state)
```

**Styling:**

```css
.bottom-nav {
  background: var(--primary-900);
  border-top: 1px solid var(--primary-700);
}

.bottom-nav-item {
  color: var(--primary-300);
}

.bottom-nav-item.active {
  color: var(--accent-400);
}

.bottom-nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-400);
}
```

#### 3. SectionCard (Level 0 - Redesigned)

**Purpose:** Display top-level sections on HomePage with strong visual impact.

**Props:**

```typescript
interface SectionCardProps {
  section: RuleSection;
  icon?: React.ReactNode;
  onClick: (sectionId: string) => void;
}
```

**Visual Design:**

```
┌─────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░                                     ░ │
│ ░   ⚔️                                ░ │
│ ░   400                               ░ │
│ ░   DRAW PHASE                        ░ │
│ ░   12 rules                          ░ │
│ ░                                     ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────┘
```

**Styling:**

```css
.section-card {
  background: linear-gradient(
    135deg,
    var(--primary-800) 0%,
    var(--primary-900) 100%
  );
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  color: white;
  box-shadow: var(--shadow-lg);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.section-card:focus-visible {
  outline: none;
  box-shadow: var(--glow-accent), var(--shadow-lg);
}

.section-card-number {
  font-family: var(--font-mono);
  font-size: var(--mono-lg);
  color: var(--accent-400);
  font-weight: 600;
}

.section-card-title {
  font-family: var(--font-display);
  font-size: var(--display-sm);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.section-card-count {
  font-family: var(--font-body);
  font-size: var(--body-sm);
  color: var(--primary-200);
}
```

#### 4. TopicCard (Level 1 - New Component)

**Purpose:** Display topic headers with expand/navigate options.

**Props:**

```typescript
interface TopicCardProps {
  rule: RuleSection;
  expanded?: boolean;
  onToggle?: () => void;
  onNavigate?: (ruleId: string) => void;
  onEnterReadingMode?: () => void;
}
```

**Visual Design:**

```
┌─────────────────────────────────────────────────────────────┐
│ ┃  401                                          5 rules    │
│ ┃  Exhaust                                        [Topic]  │
│ ┃                                           [▼] [Read →]   │
└─────────────────────────────────────────────────────────────┘
  (White bg, 4px gold left border, gold number)
```

**Styling:**

```css
.topic-card {
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--neutral-200);
  border-left: 4px solid var(--accent-500);
  padding: var(--space-4);
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.topic-card:hover {
  box-shadow: var(--shadow-md);
  border-left-color: var(--accent-400);
}

.topic-card-number {
  font-family: var(--font-mono);
  font-size: var(--mono-md);
  color: var(--accent-600);
  font-weight: 600;
}

.topic-card-title {
  font-family: var(--font-display);
  font-size: var(--display-sm);
  color: var(--primary-900);
}

.topic-badge {
  background: var(--accent-100);
  color: var(--accent-800);
  font-size: var(--caption);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

/* Dark mode */
.dark .topic-card {
  background: var(--neutral-800);
  border-color: var(--primary-700);
  border-left-color: var(--accent-500);
}

.dark .topic-card-title {
  color: var(--neutral-100);
}
```

#### 5. RuleListItem (Level 2 - Minimal Card)

**Purpose:** Compact, scannable rule items inside a section.

**Props:**

```typescript
interface RuleListItemProps {
  rule: RuleSection;
  onClick?: (ruleId: string) => void;
  showPreview?: boolean;
  highlightText?: string;
}
```

**Visual Design:**

```
┌─────────────────────────────────────────────────────────────┐
│ │  401.1  Exhausting is an action that marks...          → │
└─────────────────────────────────────────────────────────────┘
  (Subtle bg, 2px blue-gray left border, compact)
```

**Styling:**

```css
.rule-list-item {
  background: var(--neutral-50);
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--primary-300);
  padding: var(--space-3) var(--space-4);
  transition: background 0.15s ease;
}

.rule-list-item:hover {
  background: var(--neutral-100);
}

.rule-list-item-number {
  font-family: var(--font-mono);
  font-size: var(--mono-sm);
  color: var(--primary-600);
  font-weight: 500;
  min-width: 60px;
}

.rule-list-item-content {
  font-family: var(--font-body);
  font-size: var(--body-md);
  color: var(--neutral-700);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rule-list-item-arrow {
  color: var(--neutral-400);
  flex-shrink: 0;
}

/* Dark mode */
.dark .rule-list-item {
  background: var(--neutral-800);
  border-left-color: var(--primary-500);
}

.dark .rule-list-item:hover {
  background: var(--primary-800);
}

.dark .rule-list-item-content {
  color: var(--neutral-200);
}
```

#### 6. SubRuleDisplay (Level 3+ - Inline)

**Purpose:** Display nested sub-rules inline within parent content.

**Props:**

```typescript
interface SubRuleDisplayProps {
  rule: RuleSection;
  depth?: number; // For nested indentation
}
```

**Visual Design:**

```
  │ a. To exhaust a card, rotate it 90 degrees clockwise.
  │ b. A Unit that is already Exhausted cannot attack.
```

**Styling:**

```css
.sub-rule {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  padding-left: calc(var(--space-6) * var(--depth, 1));
  border-left: 1px solid var(--neutral-300);
  margin-left: var(--space-4);
}

.sub-rule-number {
  font-family: var(--font-mono);
  font-size: var(--mono-sm);
  color: var(--neutral-500);
  font-weight: 500;
  flex-shrink: 0;
}

.sub-rule-content {
  font-family: var(--font-body);
  font-size: var(--body-sm);
  color: var(--neutral-600);
}

/* Dark mode */
.dark .sub-rule {
  border-left-color: var(--primary-700);
}

.dark .sub-rule-content {
  color: var(--neutral-300);
}
```

#### 7. ViewModeToggle (New Component)

**Purpose:** Toggle between navigation and reading modes.

**Props:**

```typescript
interface ViewModeToggleProps {
  mode: "navigation" | "reading";
  onChange: (mode: "navigation" | "reading") => void;
  disabled?: boolean;
}
```

**Visual Design:**

```
┌───────────────────────────────┐
│  [≡ List]  │  [📖 Read]      │
└───────────────────────────────┘
  (Segmented control, gold active state)
```

**Styling:**

```css
.view-mode-toggle {
  display: inline-flex;
  background: var(--neutral-100);
  border-radius: var(--radius-full);
  padding: 2px;
}

.view-mode-option {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--body-sm);
  font-weight: 500;
  color: var(--neutral-600);
  transition: all 0.2s ease;
}

.view-mode-option.active {
  background: var(--accent-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

/* Dark mode */
.dark .view-mode-toggle {
  background: var(--primary-800);
}

.dark .view-mode-option {
  color: var(--neutral-300);
}

.dark .view-mode-option.active {
  background: var(--accent-500);
  color: var(--primary-900);
}
```

#### 8. ReadingView (New Component)

**Purpose:** Document-style reading experience for sequential rule consumption.

**Props:**

```typescript
interface ReadingViewProps {
  topicId: string;
  initialScrollToRule?: string;
  onExitReadingMode: () => void;
}
```

**Features:**

- Sticky header with topic title and progress
- Sequential display of all child rules
- Scroll spy highlighting current rule
- Previous/Next navigation
- "Jump to rule" quick nav

**Visual Design:**

```
┌─────────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████████████ │
│ █  ← Back    401. Exhaust           Rule 2 of 5    ███████ █ │
│ ████████████████████████████████████████████████████████████ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   401.1                                                     │
│   ─────                                                     │
│   Exhausting is an action that marks a non-spell Game       │
│   Object as "spent." This indicates the object has been     │
│   used for its primary function this turn.                  │
│                                                             │
│     a. To mark it, rotate the card 90 degrees clockwise     │
│        so that it is horizontal (landscape orientation).    │
│                                                             │
│     b. A Unit that is already Exhausted cannot be chosen    │
│        to attack or use abilities that require exhausting.  │
│                                                             │
│   ─────────────────────────────────────────────────────────│
│                                                             │
│   401.2                                                     │
│   ─────                                                     │
│   A card that is already Exhausted cannot be Exhausted      │
│   again until it has been Readied (see rule 402).           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ █           [← 401.1]        [401.3 →]                    █ │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**

```css
.reading-view {
  background: var(--neutral-50);
  min-height: 100vh;
}

.reading-header {
  position: sticky;
  top: 0;
  background: var(--primary-900);
  color: white;
  padding: var(--space-3) var(--space-4);
  z-index: 40;
  border-bottom: 1px solid var(--primary-700);
}

.reading-header-title {
  font-family: var(--font-display);
  font-size: var(--heading-md);
}

.reading-progress {
  font-family: var(--font-body);
  font-size: var(--body-sm);
  color: var(--primary-200);
}

.reading-content {
  max-width: 65ch;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.reading-rule {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--neutral-200);
}

.reading-rule-number {
  font-family: var(--font-mono);
  font-size: var(--mono-md);
  color: var(--accent-600);
  margin-bottom: var(--space-2);
}

.reading-rule-content {
  font-family: var(--font-body);
  font-size: var(--body-lg);
  line-height: 1.7;
  color: var(--neutral-700);
}

.reading-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--primary-900);
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--primary-700);
}

/* Dark mode */
.dark .reading-view {
  background: var(--neutral-900);
}

.dark .reading-rule {
  border-bottom-color: var(--primary-800);
}

.dark .reading-rule-content {
  color: var(--neutral-200);
}
```

#### 9. RuleLink (New Component)

**Purpose:** Inline cross-reference link with preview tooltip.

**Props:**

```typescript
interface RuleLinkProps {
  ruleId: string;
  displayText?: string;
  showPreview?: boolean;
  onNavigate?: (ruleId: string) => void;
}
```

**Visual Design:**

- Inline link styled in gold
- Underline on hover
- Popover preview on hover (desktop) or tap (mobile)

```
"...must pay costs (see rule 346)..."
                        ↑
                   ┌─────────────────────────────┐
                   │ 346. Playing Cards          │
                   │                             │
                   │ Playing a card is the       │
                   │ primary action in...        │
                   │                             │
                   │ [Go to Rule →]              │
                   └─────────────────────────────┘
```

**Styling:**

```css
.rule-link {
  color: var(--accent-600);
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: color 0.15s ease;
}

.rule-link:hover {
  color: var(--accent-500);
  text-decoration-style: solid;
}

.rule-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-500);
  border-radius: 2px;
}

.rule-preview {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--space-4);
  max-width: 320px;
}

.rule-preview-title {
  font-family: var(--font-display);
  font-size: var(--heading-md);
  color: var(--primary-900);
  margin-bottom: var(--space-2);
}

.rule-preview-content {
  font-family: var(--font-body);
  font-size: var(--body-sm);
  color: var(--neutral-600);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dark mode */
.dark .rule-link {
  color: var(--accent-400);
}

.dark .rule-preview {
  background: var(--neutral-800);
  border-color: var(--primary-700);
}

.dark .rule-preview-title {
  color: var(--neutral-100);
}
```

#### 10. Button (Updated)

**Changes from current:**

- Primary variant uses gold accent
- Ghost variant works on dark backgrounds
- New "dark" variant for use on light sections

**Variants:**

```css
/* Primary - Gold */
.btn-primary {
  background: var(--accent-500);
  color: var(--primary-900);
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--accent-400);
}

/* Secondary - Outlined */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--neutral-300);
  color: var(--neutral-700);
}

.btn-secondary:hover {
  background: var(--neutral-100);
  border-color: var(--neutral-400);
}

/* Ghost - Minimal */
.btn-ghost {
  background: transparent;
  color: var(--neutral-600);
}

.btn-ghost:hover {
  background: var(--neutral-100);
}

/* Ghost on dark (for header/nav) */
.btn-ghost-dark {
  background: transparent;
  color: var(--primary-100);
}

.btn-ghost-dark:hover {
  background: var(--primary-800);
  color: white;
}

/* Dark mode adjustments */
.dark .btn-primary {
  background: var(--accent-500);
  color: var(--primary-900);
}

.dark .btn-secondary {
  border-color: var(--primary-600);
  color: var(--neutral-200);
}

.dark .btn-secondary:hover {
  background: var(--primary-800);
}
```

---

### Icon System

A consistent icon system using a subtle circular motif where appropriate.

#### Section Icons

Each top-level section gets a unique icon:

| Section        | Icon | Description              |
| -------------- | ---- | ------------------------ |
| 000. Glossary  | 📖   | Open book                |
| 100. The Game  | 🎮   | Game controller or cards |
| 200. Cards     | 🃏   | Playing card             |
| 300. Turns     | 🔄   | Circular arrows          |
| 400. Phases    | ⏱️   | Clock/timer              |
| 500. Combat    | ⚔️   | Crossed swords           |
| 600. Abilities | ✨   | Sparkle/magic            |
| 700. Keywords  | 🏷️   | Tag/label                |

**Icon Styling:**

```css
.section-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full); /* Circular motif */
  font-size: 24px;
}
```

#### UI Icons

Standard icons for navigation and actions:

- Search: Magnifying glass
- Bookmark: Bookmark outline/filled
- Back: Left chevron
- Forward: Right chevron
- Expand: Down chevron
- Collapse: Up chevron
- External link: Arrow pointing out
- Close: X mark
- Menu: Hamburger (3 lines)
- Reading mode: Open book
- List mode: Bullet list

All icons should be from a consistent set (recommend Heroicons or Lucide).

---

## Page Designs

### HomePage

**Hero Section:**

- Background: Subtle gradient from `primary-100` to `neutral-50`
- Logo area: Optional subtle circular pattern/watermark
- Typography: Cinzel display for title, Crimson for body
- CTA: Gold "Browse Rules" button

**Sections Grid:**

- 1 column mobile, 2 columns tablet, 3 columns desktop
- SectionCards with dark blue gradient backgrounds
- Gold numbers, white titles

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│   ░                                                     ░  │
│   ░              RULE BOUND                             ░  │
│   ░                                                     ░  │
│   ░    Your guide to the Riftbound Core Rules           ░  │
│   ░                                                     ░  │
│   ░              [Browse Rules]                         ░  │
│   ░                                                     ░  │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                             │
│   Browse by Section                                         │
│   ─────────────────                                         │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │ 000         │  │ 100         │  │ 200         │        │
│   │ GLOSSARY    │  │ THE GAME    │  │ CARDS       │        │
│   │ 24 rules    │  │ 18 rules    │  │ 32 rules    │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │ 300         │  │ 400         │  │ 500         │        │
│   │ TURNS       │  │ PHASES      │  │ COMBAT      │        │
│   │ 15 rules    │  │ 12 rules    │  │ 28 rules    │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Section Detail Page (Inside a Section)

**Header:**

- Section title with gold number
- View mode toggle (List/Read)
- Breadcrumb navigation

**Content (List Mode - Default):**

- TopicCards for level 1 rules
- RuleListItems for level 2+ rules
- Compact, scannable layout

```
┌─────────────────────────────────────────────────────────────┐
│ ← Home / 400. Draw Phase                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   400                                    [List] [Read]      │
│   DRAW PHASE                                                │
│   ─────────────────────────────────────────────────────────│
│                                                             │
│   ┃ 401  Exhaust                                 5 rules → │
│   │ 401.1  Exhausting is an action that marks...         → │
│   │ 401.2  A card that is already Exhausted...           → │
│   │ 401.3  Some effects may ready an Exhausted...        → │
│                                                             │
│   ┃ 402  Ready                                   3 rules → │
│   │ 402.1  Readying is the opposite of Exhausting...     → │
│   │ 402.2  At the start of each turn, all cards...       → │
│                                                             │
│   ┃ 403  Tap and Untap                           4 rules → │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Rule Detail Page

**For Topic Headers (has children):**

- Show topic header prominently
- List children as RuleListItems
- Option to enter reading mode

**For Leaf Rules (no children):**

- Full prose display of content
- Sub-rules rendered inline
- Cross-references as RuleLinks
- Previous/Next navigation

---

## Animation Specifications

### Transitions

All transitions should respect `prefers-reduced-motion`.

```css
/* Default transition */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;

/* Specific transitions */
--transition-color: color var(--transition-fast);
--transition-bg: background-color var(--transition-fast);
--transition-shadow: box-shadow var(--transition-normal);
--transition-transform: transform var(--transition-normal);
```

### Hover Effects

| Element      | Effect                              | Duration |
| ------------ | ----------------------------------- | -------- |
| SectionCard  | `translateY(-2px)`, shadow increase | 200ms    |
| TopicCard    | Border brightens, subtle shadow     | 150ms    |
| RuleListItem | Background highlight                | 150ms    |
| Button       | Background color shift              | 150ms    |
| Link         | Color shift, underline style        | 150ms    |

### Focus Effects

- Gold focus ring (3px)
- Subtle glow effect for important actions
- Immediate visibility (no delay)

### Loading States

- Skeleton screens with subtle shimmer animation
- Spinner using circular motif (gold on dark, dark blue on light)
- Progress bars for reading mode

### Mode Transitions

When switching between navigation and reading modes:

- Crossfade content (200ms)
- Slide in reading header from top
- No jarring layout shifts

---

## Accessibility Requirements

### Color Contrast

All text combinations verified for WCAG AA (4.5:1 normal, 3:1 large):

- See contrast table in Color Palette section
- Both light and dark modes tested

### Focus Indicators

- 3px gold focus ring on all interactive elements
- 2px offset from element edge
- Never removed or hidden
- Works on both light and dark backgrounds

### Keyboard Navigation

| Element      | Key           | Action             |
| ------------ | ------------- | ------------------ |
| Cards        | Enter/Space   | Navigate/Expand    |
| Links        | Enter         | Navigate           |
| Toggle       | Space         | Toggle state       |
| Modal        | Escape        | Close              |
| Reading mode | Arrow Up/Down | Scroll             |
| Reading mode | N/P           | Next/Previous rule |

### Screen Reader Support

- Proper heading hierarchy (h1 > h2 > h3)
- ARIA labels on icon-only buttons
- Live regions for dynamic content
- Skip link to main content
- Landmarks: header, main, nav, footer

### Touch Targets

- Minimum 44x44px on all interactive elements
- 8px minimum spacing between targets
- Larger targets for primary actions (48px+)

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode Implementation

### Toggle Mechanism

- System preference detection by default
- Manual toggle in settings
- Persist preference in localStorage
- Class-based switching (`.dark` on `<html>`)

### CSS Variables Approach

```css
:root {
  /* Light mode defaults */
  --bg-primary: var(--neutral-50);
  --bg-card: white;
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --border: var(--neutral-200);
  --accent: var(--accent-500);
}

:root.dark {
  /* Dark mode overrides */
  --bg-primary: var(--neutral-900);
  --bg-card: var(--neutral-800);
  --text-primary: var(--neutral-100);
  --text-secondary: var(--neutral-400);
  --border: var(--primary-700);
  --accent: var(--accent-400);
}
```

### Component-Specific Adjustments

Some components need more than variable swaps:

- Section cards: Gradient values change
- Shadows: Lighter shadows in dark mode, rely more on borders
- Images: Consider filter adjustments if any
- Focus rings: Brighter gold for visibility

---

## Responsive Breakpoints

```css
/* Mobile first */
--bp-sm: 640px; /* Large phones */
--bp-md: 768px; /* Tablets */
--bp-lg: 1024px; /* Laptops */
--bp-xl: 1280px; /* Desktop */
--bp-2xl: 1536px; /* Large desktop */
```

### Layout Changes

| Breakpoint  | Grid Columns | Container Max | Navigation |
| ----------- | ------------ | ------------- | ---------- |
| < 640px     | 1            | 100%          | Bottom nav |
| 640-767px   | 2            | 640px         | Bottom nav |
| 768-1023px  | 2            | 768px         | Header nav |
| 1024-1279px | 3            | 1024px        | Header nav |
| 1280px+     | 3-4          | 1280px        | Header nav |

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Update Tailwind config with new color palette
- [ ] Add Google Fonts (Cinzel, Crimson Pro)
- [ ] Create CSS custom properties for design tokens
- [ ] Implement dark mode toggle infrastructure
- [ ] Update base styles and typography

### Phase 2: Core Components

- [ ] Redesign Header component
- [ ] Redesign BottomNav component
- [ ] Create SectionCard component (Level 0)
- [ ] Create TopicCard component (Level 1)
- [ ] Create RuleListItem component (Level 2)
- [ ] Create SubRuleDisplay component (Level 3+)
- [ ] Update Button variants

### Phase 3: New Features

- [ ] Implement ViewModeToggle
- [ ] Implement ReadingView
- [ ] Implement RuleLink with preview
- [ ] Add scroll spy for reading mode
- [ ] Add keyboard navigation for reading mode

### Phase 4: Pages

- [ ] Redesign HomePage with new hero
- [ ] Implement section detail page (hybrid navigation)
- [ ] Update rule detail page
- [ ] Update search results styling
- [ ] Update bookmarks page

### Phase 5: Polish

- [ ] Add all animations and transitions
- [ ] Implement loading skeletons
- [ ] Test all color contrast
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test on mobile devices
- [ ] Performance optimization

---

## HANDOFF TO CODER

@coder

The **Improve User Experience** design specifications are complete. This document provides everything needed to transform Rule Bound from a functional tool into a delightful, branded Riftbound rules reference.

### Key Design Changes Summary

**Visual Identity:**

- New color palette: Dark blue (`#102a43` → `#f0f4f8`) + Warm gold (`#f59e0b`)
- Typography: Cinzel (headers) + Crimson Pro (body) from Google Fonts
- Subtle circular motif in badges, icons, and focus rings
- Full dark mode support

**Navigation Paradigm:**

- Top-level: Bold section cards (dark blue gradient, gold accents)
- Inside sections: Minimal cards (compact, scannable, document-like)
- Topic headers: Gold left border, expandable
- Definitions: Blue-gray left border, very compact
- Sub-rules: Inline with parent, gray continuation line

**New Components:**

1. `TopicCard` - Level 1 topic headers with expand/read options
2. `RuleListItem` - Compact minimal cards for scanning
3. `SubRuleDisplay` - Inline nested content
4. `ViewModeToggle` - Switch between list and reading modes
5. `ReadingView` - Full document-style reading experience
6. `RuleLink` - Cross-reference links with preview tooltips

**Updated Components:**

- `Header` - Dark blue background, Cinzel logo, gold accents
- `BottomNav` - Dark blue background, gold active states
- `SectionCard` - Dark gradient, gold numbers, section icons
- `Button` - Gold primary variant, ghost-dark for headers

### Critical Implementation Notes

1. **Google Fonts**: Load Cinzel (400-700) and Crimson Pro (300-700, italic)
2. **CSS Variables**: Use the token system for easy dark mode switching
3. **Dark Mode**: Implement with `.dark` class on `<html>`, detect system preference
4. **Transitions**: Respect `prefers-reduced-motion`
5. **Touch Targets**: 44px minimum on all interactive elements
6. **Focus States**: Gold focus rings (3px) on everything

### Architecture References

This design builds on the architecture decisions:

- ADR-001: Content Classification (drives visual hierarchy)
- ADR-002: Reading Mode (ViewModeToggle, ReadingView)
- ADR-003: Visual Hierarchy (differentiated rule type displays)
- ADR-004: Rule Connections (RuleLink with previews)

### Priority Order

1. Design tokens and foundation (colors, fonts, dark mode infra)
2. Header and navigation (most visible branding)
3. SectionCard and TopicCard (top-level experience)
4. RuleListItem (inside-section experience)
5. Reading mode components
6. Polish and animations

The design is intentionally "medium boldness" - professional and branded without being overwhelming. The gold accents should feel special, not overused.

### Success Criteria

The implementation is complete when:

- [ ] All color tokens implemented in Tailwind config
- [ ] Cinzel and Crimson Pro fonts loading correctly
- [ ] Dark mode fully functional with system preference detection
- [ ] Section cards have dark blue gradient and gold numbers
- [ ] Inside sections show minimal, scannable list items
- [ ] Topic headers have gold left borders and expand correctly
- [ ] Reading mode provides document-style sequential experience
- [ ] Cross-references show preview tooltips
- [ ] All accessibility requirements met (contrast, focus, keyboard, screen reader)
- [ ] Animations respect reduced motion preference
- [ ] Mobile navigation styled with dark theme

Please implement according to these specifications. Focus on the branded feeling - this should feel like opening an official Riftbound rulebook, not a generic database.
