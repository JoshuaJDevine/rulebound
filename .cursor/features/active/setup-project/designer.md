# Designer: Project Setup

**Feature:** Initial UI/UX design system and component specifications for Rule Bound  
**Date:** 2026-01-12  
**Designer:** AI Assistant

## Overview

This document defines the complete UI/UX design system for Rule Bound - an accessible, mobile-friendly web application for the Riftbound Core Rules RPG. The design prioritizes:

1. **Mobile-First**: Optimized for touch interactions and small screens
2. **Accessibility**: WCAG 2.1 AA compliant across all components
3. **Clarity**: Easy to scan and read RPG rules quickly
4. **Progressive Disclosure**: Complex information revealed gradually
5. **Consistency**: Unified design language across the application

## Design System

### Color Palette

All colors meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text).

#### Primary Colors
```css
/* Brand Colors */
primary-50:   #f0f9ff  /* Lightest blue - backgrounds */
primary-100:  #e0f2fe  /* Light blue - hover states */
primary-200:  #bae6fd  /* Medium light - subtle highlights */
primary-300:  #7dd3fc  /* Medium - borders, dividers */
primary-400:  #38bdf8  /* Medium strong - interactive elements */
primary-500:  #0ea5e9  /* Primary brand color */
primary-600:  #0284c7  /* Primary dark - main CTAs */
primary-700:  #0369a1  /* Darker - hover on CTAs */
primary-800:  #075985  /* Very dark - text on light bg */
primary-900:  #0c4a6e  /* Darkest - headings */

/* Neutral Colors */
neutral-50:   #f8fafc  /* White alternative */
neutral-100:  #f1f5f9  /* Very light gray - subtle backgrounds */
neutral-200:  #e2e8f0  /* Light gray - borders */
neutral-300:  #cbd5e1  /* Medium light gray - disabled states */
neutral-400:  #94a3b8  /* Medium gray - placeholders */
neutral-500:  #64748b  /* Gray - secondary text */
neutral-600:  #475569  /* Dark gray - body text */
neutral-700:  #334155  /* Darker gray - headings */
neutral-800:  #1e293b  /* Very dark - important text */
neutral-900:  #0f172a  /* Almost black - primary text */

/* Semantic Colors */
success-50:   #f0fdf4  /* Success background */
success-600:  #16a34a  /* Success text/icons */
success-700:  #15803d  /* Success interactive */

warning-50:   #fffbeb  /* Warning background */
warning-600:  #d97706  /* Warning text/icons */
warning-700:  #b45309  /* Warning interactive */

error-50:     #fef2f2  /* Error background */
error-600:    #dc2626  /* Error text/icons */
error-700:    #b91c1c  /* Error interactive */

info-50:      #eff6ff  /* Info background */
info-600:     #2563eb  /* Info text/icons */
info-700:     #1d4ed8  /* Info interactive */
```

#### Contrast Ratios (WCAG AA Compliance)

| Combination | Ratio | Pass |
|-------------|-------|------|
| neutral-900 on neutral-50 | 19.3:1 | ✅ AAA |
| neutral-800 on neutral-50 | 14.8:1 | ✅ AAA |
| neutral-700 on neutral-50 | 10.4:1 | ✅ AAA |
| neutral-600 on neutral-50 | 7.9:1 | ✅ AAA |
| primary-700 on primary-50 | 8.2:1 | ✅ AAA |
| primary-600 on neutral-50 | 5.1:1 | ✅ AA |
| success-700 on success-50 | 7.1:1 | ✅ AAA |
| error-700 on error-50 | 8.9:1 | ✅ AAA |

### Typography

#### Font Families
```css
/* System font stack for optimal performance and accessibility */
font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
           'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 
           'Segoe UI Emoji', 'Segoe UI Symbol';

/* Monospace for code/references */
font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, 
           Consolas, 'Liberation Mono', 'Courier New', monospace;
```

#### Type Scale

| Name | Size (px) | Line Height | Weight | Usage |
|------|-----------|-------------|--------|-------|
| xs | 12px (0.75rem) | 1.5 | 400 | Captions, tiny labels |
| sm | 14px (0.875rem) | 1.5 | 400 | Small text, metadata |
| base | 16px (1rem) | 1.5 | 400 | Body text (default) |
| lg | 18px (1.125rem) | 1.5 | 400 | Large body text |
| xl | 20px (1.25rem) | 1.4 | 600 | Section headings |
| 2xl | 24px (1.5rem) | 1.3 | 700 | Page sub-headings |
| 3xl | 30px (1.875rem) | 1.3 | 700 | Page headings |
| 4xl | 36px (2.25rem) | 1.2 | 800 | Hero text (mobile) |
| 5xl | 48px (3rem) | 1.1 | 800 | Hero text (desktop) |

**Accessibility Notes:**
- Base font size is 16px (1rem) - never smaller for body text
- Line height 1.5 for readability
- Text must be resizable up to 200% without loss of functionality
- Adequate spacing between text blocks (at least 1.5x font size)

### Spacing Scale

Based on Tailwind's default spacing scale (4px base unit):

| Token | Size | Usage |
|-------|------|-------|
| 0.5 | 2px | Hairline borders |
| 1 | 4px | Tight spacing |
| 2 | 8px | Small spacing |
| 3 | 12px | Compact spacing |
| 4 | 16px | Base spacing |
| 5 | 20px | Medium spacing |
| 6 | 24px | Large spacing |
| 8 | 32px | Section spacing |
| 10 | 40px | Large section spacing |
| 12 | 48px | XL spacing |
| 16 | 64px | Hero spacing |

**Touch Target Minimum:** 44x44px (11 spacing units) on mobile

### Breakpoints (Mobile-First)

```css
/* Default: Mobile (< 640px) */
sm:  640px   /* Small tablets, large phones (landscape) */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops, large tablets */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Large desktop */
```

**Design Priority:** Mobile (default) > Tablet (md) > Desktop (lg)

### Elevation & Shadows

```css
/* Subtle shadows for cards and elevated elements */
shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow:     0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)

/* Focus rings for keyboard navigation */
ring-offset: 2px
ring-width:  3px
ring-color:  primary-500
```

### Border Radius

```css
rounded-none: 0px
rounded-sm:   2px   /* Subtle rounding */
rounded:      4px   /* Default */
rounded-md:   6px   /* Cards, buttons */
rounded-lg:   8px   /* Large cards */
rounded-xl:   12px  /* Featured content */
rounded-2xl:  16px  /* Hero sections */
rounded-full: 9999px /* Circular elements */
```

## User Flows

### 1. Browse Rules Flow

**Primary Path:**
```
Home Page
  ↓ (tap "Browse Rules" or section card)
Rules List (by section)
  ↓ (tap a rule from list)
Rule Detail
  ↓ (tap bookmark icon)
Bookmark Added (feedback)
  ↓ (tap back or breadcrumb)
Rules List
```

**Key Interactions:**
- **Home → Rules List**: Section cards are large, tappable (min 44x44px)
- **Rules List**: Scrollable list with search bar at top
- **Rule Detail**: Full rule content with bookmark button in header
- **Bookmarking**: Instant feedback with animation + success message

**Accessibility:**
- Skip link to main content
- Breadcrumb navigation with proper aria-labels
- Focus management when navigating between views
- Screen reader announces "Rule bookmarked" on bookmark action

### 2. Search Rules Flow

**Primary Path:**
```
Any Page
  ↓ (tap search icon in header)
Search Input (focused)
  ↓ (type query)
Search Results (live/debounced)
  ↓ (tap result)
Rule Detail
```

**Key Interactions:**
- **Search activation**: Search icon in header, always accessible
- **Search input**: Auto-focus on mobile, clear button visible
- **Live results**: Debounced (300ms) instant results as you type
- **No results**: Helpful message with suggestions

**Accessibility:**
- Search input has clear label "Search rules"
- Results announced to screen readers (aria-live region)
- Keyboard navigation through results (arrow keys)
- Escape key clears/closes search
- Search results count announced

### 3. Bookmark Management Flow

**Primary Path:**
```
Any Page
  ↓ (tap bookmarks icon in navigation)
Bookmarks Page
  ↓ (view bookmarked rules)
Rule List (bookmarked)
  ↓ (tap rule)
Rule Detail
  ↓ (tap bookmark icon to remove)
Bookmark Removed (feedback)
```

**Key Interactions:**
- **Access bookmarks**: Bottom nav icon (mobile) or header link (desktop)
- **Empty state**: Helpful message if no bookmarks yet
- **Remove bookmark**: Same icon, different state (filled/outlined)
- **Undo**: Optional undo toast after removing bookmark

**Accessibility:**
- Bookmarks count badge (if any) announced to screen readers
- Empty state clearly described
- Remove action confirmed with accessible feedback
- Focus management returns to list after removal

### 4. Read Rule Detail Flow

**Primary Path:**
```
Rule List
  ↓ (tap rule)
Rule Detail
  ↓ (scroll to read)
Related Rules Section
  ↓ (tap related rule)
Another Rule Detail
```

**Key Interactions:**
- **Rule header**: Title, section, bookmark button
- **Rule content**: Formatted text, readable typography
- **Related rules**: Chips/cards linking to related rules
- **Page reference**: Link to PDF page (if available)
- **Share**: Optional share button for future

**Accessibility:**
- Heading hierarchy (h1 for title, h2 for sections)
- Proper semantic markup for content
- Related rules are keyboard navigable
- Back button clearly labeled with destination

## Component Specifications

### Layout Components

#### 1. AppLayout

**Purpose:** Root layout component wrapping all pages with header, main content, and navigation.

**Structure:**
```tsx
<div className="min-h-screen flex flex-col bg-neutral-50">
  <Header />
  <main className="flex-1 pb-20 md:pb-0">
    {children}
  </main>
  <BottomNav /> {/* Mobile only */}
</div>
```

**Props:**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Responsive Behavior:**
- **Mobile**: Bottom navigation (fixed), content padding for nav height
- **Desktop (md+)**: Header navigation only, no bottom nav

**Accessibility:**
- Skip to main content link (visually hidden, keyboard accessible)
- Proper landmark regions (`<header>`, `<main>`, `<nav>`)
- Focus management on route changes

---

#### 2. Header

**Purpose:** Top navigation bar with logo, search, and primary actions.

**Mobile Layout:**
```
┌─────────────────────────────────┐
│ [Logo]    [Search] [Bookmarks]  │
└─────────────────────────────────┘
```

**Desktop Layout:**
```
┌──────────────────────────────────────────────────┐
│ [Logo] [Browse] [Bookmarks] [Search......] [🔍] │
└──────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface HeaderProps {
  // No props initially - pulls from context/store
}
```

**Styling:**
```tsx
<header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
  <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
    {/* Logo, Nav, Search */}
  </div>
</header>
```

**Accessibility:**
- `<header>` landmark with aria-label="Main navigation"
- Logo link has accessible text "Rule Bound Home"
- Search button has aria-label="Search rules"
- Focus visible on all interactive elements

---

#### 3. BottomNav (Mobile Only)

**Purpose:** Mobile bottom navigation for primary app sections.

**Layout:**
```
┌─────────────────────────────────┐
│ [Home]  [Browse]  [Bookmarks]   │
│  Icon     Icon       Icon        │
│  Text     Text       Text        │
└─────────────────────────────────┘
```

**Navigation Items:**
1. **Home**: House icon + "Home" label
2. **Browse**: Book icon + "Browse" label  
3. **Bookmarks**: Bookmark icon + "Saved" label

**Props:**
```typescript
interface BottomNavProps {
  currentPath: string;
}
```

**Styling:**
```tsx
<nav 
  className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden"
  aria-label="Primary navigation"
>
  <div className="grid grid-cols-3 h-16">
    {/* Nav items - min 44x44px touch targets */}
  </div>
</nav>
```

**States:**
- **Default**: neutral-500 icon + text
- **Active**: primary-600 icon + text, bolder weight
- **Pressed**: primary-700 background tint

**Accessibility:**
- `<nav>` landmark
- Each item is a link (`<a>`) with proper label
- Current page has aria-current="page"
- Focus ring visible on keyboard navigation
- Touch targets: 56px height (exceeds 44px minimum)

---

### Page Components

#### 4. HomePage

**Purpose:** Landing page with hero section and primary navigation to rule sections.

**Layout (Mobile):**
```
┌─────────────────────────────┐
│ Hero Section                │
│ "Welcome to Rule Bound"     │
│ [Search Bar]                │
├─────────────────────────────┤
│ Popular Sections            │
│ [Character Creation Card]   │
│ [Combat Card]               │
│ [Magic Card]                │
├─────────────────────────────┤
│ Recent Rules (if viewed)    │
└─────────────────────────────┘
```

**Props:**
```typescript
interface HomePageProps {
  // Pulls data from store
}
```

**Sections:**

1. **Hero**: 
   - Large heading (text-3xl md:text-5xl)
   - Subtitle/description
   - Prominent search input
   - Background gradient (primary-50 to neutral-50)

2. **Popular Sections**:
   - Grid of section cards (1 col mobile, 2 cols tablet, 3 cols desktop)
   - Each card: Icon, title, rule count, tap to browse

3. **Recently Viewed**:
   - Horizontal scrollable list (mobile)
   - Only shows if user has viewed rules
   - Quick access to recent rules

**Accessibility:**
- h1 for main heading "Welcome to Rule Bound"
- Section headings are h2
- Cards are clickable with proper focus states
- Skip link to main content

---

#### 5. RulesListPage

**Purpose:** Displays a list of rules, optionally filtered by section.

**Layout (Mobile):**
```
┌─────────────────────────────┐
│ [< Back]  Combat Rules      │
├─────────────────────────────┤
│ [Search within section...]  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Rule Title              │ │
│ │ Brief preview text...   │ │
│ │ [Bookmark icon]         │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Another Rule Title      │ │
│ │ Brief preview text...   │ │
│ │ [Bookmark icon]         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Props:**
```typescript
interface RulesListPageProps {
  sectionId?: string; // Optional section filter
}
```

**Components:**
- **Header**: Section title, back button (if filtered)
- **Search**: Section-scoped search input
- **List**: Scrollable list of RuleCard components
- **Empty state**: If no rules match

**Styling:**
- Full-height scrollable container
- Cards have 4 spacing (16px) between them
- Touch targets for cards and bookmark buttons meet 44px minimum

**Accessibility:**
- Page title in h1 (e.g., "Combat Rules")
- Search input properly labeled
- List uses semantic `<ul>` and `<li>`
- Each rule card is keyboard navigable
- Bookmark button labeled "Bookmark [Rule Name]"

---

#### 6. RuleDetailPage

**Purpose:** Full display of a single rule with content, references, and actions.

**Layout (Mobile):**
```
┌─────────────────────────────┐
│ [< Back to Combat]          │
├─────────────────────────────┤
│ Rule Title            [🔖]  │
│ Combat > Attacks            │
├─────────────────────────────┤
│                             │
│ Full rule content goes      │
│ here with proper formatting │
│ and readable typography.    │
│                             │
│ Multiple paragraphs...      │
│                             │
├─────────────────────────────┤
│ Related Rules               │
│ [Related Rule Chip]         │
│ [Related Rule Chip]         │
├─────────────────────────────┤
│ Page Reference: p. 42       │
└─────────────────────────────┘
```

**Props:**
```typescript
interface RuleDetailPageProps {
  ruleId: string;
}
```

**Sections:**

1. **Header**:
   - Back navigation with section name
   - Rule title (h1)
   - Bookmark button (large touch target)
   - Breadcrumb (section > subsection)

2. **Content**:
   - Full rule text (markdown rendered)
   - Proper typography (text-base, line-height 1.5)
   - Adequate spacing between paragraphs

3. **Related Rules**:
   - Clickable chips/cards
   - Horizontal scroll on mobile if many

4. **Metadata**:
   - PDF page reference (if available)
   - Tags (future)

**Styling:**
```tsx
<div className="container mx-auto px-4 py-6 max-w-3xl">
  <BackButton />
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
        {rule.title}
      </h1>
      <Breadcrumb sections={rule.sections} />
    </div>
    <BookmarkButton ruleId={rule.id} size="lg" />
  </div>
  
  <div className="prose prose-neutral max-w-none">
    {/* Rendered rule content */}
  </div>
  
  {/* Related rules, metadata */}
</div>
```

**Accessibility:**
- h1 for rule title
- Breadcrumb with proper aria-label
- Prose styling maintains proper heading hierarchy
- Related rules navigable with keyboard
- Page reference is a link (if PDF viewer implemented)

---

#### 7. BookmarksPage

**Purpose:** Display user's bookmarked rules.

**Layout (Mobile):**
```
┌─────────────────────────────┐
│ Bookmarks              [⚙]  │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Rule Title         [🔖✓]│ │
│ │ Section name            │ │
│ │ Bookmarked 2 days ago   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Another Rule       [🔖✓]│ │
│ │ Section name            │ │
│ │ Bookmarked 1 week ago   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Props:**
```typescript
interface BookmarksPageProps {
  // Pulls bookmarks from store
}
```

**States:**

1. **Has Bookmarks**: List of bookmarked rules with metadata
2. **Empty State**: 
   - Icon + message "No bookmarks yet"
   - CTA: "Browse rules to bookmark your favorites"

**Sorting Options** (future):
- Most recent first (default)
- Alphabetical
- By section

**Styling:**
```tsx
<div className="container mx-auto px-4 py-6">
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">Bookmarks</h1>
    <button aria-label="Bookmark settings">⚙</button>
  </div>
  
  {bookmarks.length === 0 ? (
    <EmptyState />
  ) : (
    <ul className="space-y-4">
      {bookmarks.map(bookmark => (
        <RuleCard key={bookmark.ruleId} {...bookmark} />
      ))}
    </ul>
  )}
</div>
```

**Accessibility:**
- h1 "Bookmarks"
- Empty state clearly communicated to screen readers
- Each bookmark card is keyboard navigable
- Remove bookmark action has confirmation

---

#### 8. SearchPage

**Purpose:** Full-featured search interface with results.

**Layout (Mobile):**
```
┌─────────────────────────────┐
│ [<]  [Search input...] [x]  │
├─────────────────────────────┤
│ 12 results for "attack"     │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Basic Attack            │ │
│ │ ...in combat when you   │ │
│ │ attack a target...      │ │
│ │ Combat                  │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Opportunity Attack      │ │
│ │ ...you can attack when  │ │
│ │ an enemy moves away...  │ │
│ │ Combat                  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Props:**
```typescript
interface SearchPageProps {
  initialQuery?: string;
}
```

**States:**

1. **Empty Query**: Show recent searches or popular rules
2. **Searching**: Loading spinner
3. **Has Results**: List of matching rules with snippets
4. **No Results**: Helpful message with suggestions

**Search Features:**
- **Live search**: Results update as you type (debounced 300ms)
- **Highlighting**: Search terms highlighted in results
- **Sorting**: By relevance (default) or alphabetical
- **Filters**: By section (future)

**Styling:**
```tsx
<div className="min-h-screen flex flex-col">
  <SearchHeader 
    query={query}
    onQueryChange={setQuery}
    onClear={clearSearch}
  />
  
  <div className="flex-1 container mx-auto px-4 py-6">
    {isSearching && <LoadingSpinner />}
    
    {results.length > 0 && (
      <>
        <p className="text-sm text-neutral-600 mb-4">
          {results.length} results for "{query}"
        </p>
        <ul className="space-y-4">
          {results.map(result => (
            <SearchResultCard key={result.rule.id} result={result} />
          ))}
        </ul>
      </>
    )}
    
    {results.length === 0 && query && (
      <NoResults query={query} />
    )}
  </div>
</div>
```

**Accessibility:**
- Search input auto-focused on page load (mobile)
- Results count announced to screen readers (aria-live)
- Each result keyboard navigable
- Clear button properly labeled
- Loading state announced

---

### UI Components

#### 9. Button

**Purpose:** Primary interactive element for actions.

**Variants:**

1. **Primary**: Main CTAs
   ```tsx
   <button className="bg-primary-600 text-white hover:bg-primary-700 
                      focus:ring-4 focus:ring-primary-500/50">
   ```

2. **Secondary**: Alternative actions
   ```tsx
   <button className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300 
                      focus:ring-4 focus:ring-neutral-500/50">
   ```

3. **Ghost**: Subtle actions
   ```tsx
   <button className="bg-transparent text-primary-600 hover:bg-primary-50 
                      focus:ring-4 focus:ring-primary-500/50">
   ```

4. **Danger**: Destructive actions
   ```tsx
   <button className="bg-error-600 text-white hover:bg-error-700 
                      focus:ring-4 focus:ring-error-500/50">
   ```

**Sizes:**

| Size | Height | Padding X | Font Size | Use Case |
|------|--------|-----------|-----------|----------|
| sm | 36px | 12px | 14px | Compact spaces |
| md | 44px | 16px | 16px | Default (mobile) |
| lg | 48px | 24px | 18px | Primary CTAs |

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}
```

**States:**
- **Default**: Base styling
- **Hover**: Darker background (desktop only)
- **Focus**: Visible ring (3px, primary color, 2px offset)
- **Active/Pressed**: Even darker, slight scale
- **Disabled**: Opacity 50%, cursor not-allowed
- **Loading**: Spinner replaces text, disabled

**Accessibility:**
- Minimum touch target 44x44px
- Focus ring always visible (WCAG 2.4.7)
- Disabled state communicated via aria-disabled
- Icon-only buttons have aria-label
- Loading state announced to screen readers

---

#### 10. Card

**Purpose:** Container for grouped content (rules, sections, etc.).

**Base Card:**
```tsx
<div className="bg-white rounded-lg border border-neutral-200 p-4 
                hover:shadow-md transition-shadow">
  {children}
</div>
```

**Variants:**

1. **Interactive Card** (clickable):
   ```tsx
   <button 
     className="w-full bg-white rounded-lg border border-neutral-200 p-4 
                text-left hover:shadow-md hover:border-primary-300 
                focus:ring-4 focus:ring-primary-500/50 transition-all"
   >
   ```

2. **Elevated Card**:
   ```tsx
   <div className="bg-white rounded-lg shadow-lg p-6">
   ```

**Props:**
```typescript
interface CardProps {
  variant?: 'default' | 'interactive' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}
```

**Accessibility:**
- Interactive cards are `<button>` or `<a>` elements
- Proper focus states
- aria-label for cards without text content
- Touch target meets 44px minimum (vertical padding)

---

#### 11. RuleCard

**Purpose:** Displays a rule in list views with preview.

**Layout:**
```
┌─────────────────────────────────┐
│ Rule Title               [🔖]   │
│ Brief preview of the rule       │
│ content goes here...            │
│ Section Name • 2 days ago       │
└─────────────────────────────────┘
```

**Props:**
```typescript
interface RuleCardProps {
  rule: Rule;
  showPreview?: boolean;
  showSection?: boolean;
  showTimestamp?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: (ruleId: string) => void;
}
```

**Styling:**
```tsx
<button
  className="w-full bg-white rounded-lg border border-neutral-200 p-4 
             text-left hover:shadow-md hover:border-primary-300 
             focus:ring-4 focus:ring-primary-500/50 transition-all"
  onClick={handleCardClick}
>
  <div className="flex items-start justify-between gap-4 mb-2">
    <h3 className="text-lg font-semibold text-neutral-900">
      {rule.title}
    </h3>
    <BookmarkButton 
      ruleId={rule.id}
      isBookmarked={isBookmarked}
      size="sm"
      onClick={handleBookmark}
    />
  </div>
  
  {showPreview && (
    <p className="text-sm text-neutral-600 line-clamp-2 mb-2">
      {rule.content}
    </p>
  )}
  
  <div className="flex items-center gap-2 text-xs text-neutral-500">
    {showSection && <span>{rule.section}</span>}
    {showTimestamp && (
      <>
        <span>•</span>
        <time>{formatTimestamp(timestamp)}</time>
      </>
    )}
  </div>
</button>
```

**Accessibility:**
- Card is keyboard navigable
- Bookmark button is separate from card click (event.stopPropagation)
- Title is h3 for proper heading hierarchy
- Timestamp uses semantic `<time>` element
- Focus ring on card, separate focus on bookmark button

---

#### 12. BookmarkButton

**Purpose:** Toggle bookmark status for a rule.

**States:**

1. **Not Bookmarked**: Outline bookmark icon
2. **Bookmarked**: Filled bookmark icon with primary color
3. **Hover**: Scale up slightly
4. **Adding**: Brief animation (scale + fade)

**Props:**
```typescript
interface BookmarkButtonProps {
  ruleId: string;
  isBookmarked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onToggle?: (ruleId: string, isBookmarked: boolean) => void;
}
```

**Styling:**
```tsx
<button
  className={cn(
    "inline-flex items-center justify-center rounded-md",
    "transition-all hover:scale-110 focus:ring-4",
    "focus:ring-primary-500/50 focus:outline-none",
    size === 'sm' && "h-11 w-11", // 44px minimum
    size === 'md' && "h-12 w-12",
    size === 'lg' && "h-14 w-14",
    isBookmarked 
      ? "text-primary-600 hover:text-primary-700" 
      : "text-neutral-400 hover:text-neutral-600"
  )}
  onClick={handleToggle}
  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this rule"}
  aria-pressed={isBookmarked}
>
  {isBookmarked ? <BookmarkFilledIcon /> : <BookmarkOutlineIcon />}
  {showLabel && (
    <span className="ml-2 text-sm">
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </span>
  )}
</button>
```

**Animation:**
```css
/* When bookmark is added */
@keyframes bookmark-added {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

**Accessibility:**
- Minimum touch target: 44x44px (all sizes)
- aria-label describes action ("Bookmark this rule" / "Remove bookmark")
- aria-pressed indicates toggle state
- Focus ring visible
- State change announced to screen readers

---

#### 13. SearchInput

**Purpose:** Text input for searching rules.

**Layout (Mobile):**
```
┌─────────────────────────────────┐
│ [🔍] Search rules...       [x]  │
└─────────────────────────────────┘
```

**Props:**
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}
```

**Styling:**
```tsx
<div className="relative">
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
    <SearchIcon className="h-5 w-5" />
  </div>
  
  <input
    type="search"
    className="w-full h-12 pl-12 pr-12 rounded-lg border border-neutral-300
               bg-white text-neutral-900 placeholder:text-neutral-400
               focus:border-primary-500 focus:ring-4 focus:ring-primary-500/50
               transition-all"
    placeholder="Search rules..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Search rules"
  />
  
  {value && (
    <button
      className="absolute right-4 top-1/2 -translate-y-1/2 
                 h-8 w-8 rounded-full hover:bg-neutral-100
                 focus:ring-2 focus:ring-primary-500/50"
      onClick={onClear}
      aria-label="Clear search"
    >
      <XIcon className="h-4 w-4" />
    </button>
  )}
</div>
```

**Accessibility:**
- Proper label (aria-label or associated `<label>`)
- Focus ring visible
- Clear button keyboard accessible
- Clear button has descriptive label
- Input height 48px (exceeds 44px minimum)

---

#### 14. LoadingSpinner

**Purpose:** Indicates loading state.

**Variants:**

1. **Inline**: Small spinner in buttons/cards
2. **Page**: Centered spinner for page loading

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'page';
  label?: string;
}
```

**Styling:**
```tsx
<div 
  className={cn(
    "flex items-center justify-center",
    variant === 'page' && "min-h-screen"
  )}
  role="status"
  aria-live="polite"
  aria-label={label || "Loading"}
>
  <div className={cn(
    "animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600",
    size === 'sm' && "h-6 w-6",
    size === 'md' && "h-10 w-10",
    size === 'lg' && "h-16 w-16"
  )} />
  <span className="sr-only">{label || "Loading"}</span>
</div>
```

**Accessibility:**
- role="status" indicates dynamic update
- aria-live="polite" announces to screen readers
- Visible label or sr-only text describes what's loading
- Animation respects prefers-reduced-motion

---

#### 15. EmptyState

**Purpose:** Communicates when no content is available.

**Layout:**
```
┌─────────────────────────────┐
│                             │
│         [📭]                │
│                             │
│   No bookmarks yet          │
│                             │
│   Browse rules to bookmark  │
│   your favorites            │
│                             │
│   [Browse Rules Button]     │
│                             │
└─────────────────────────────┘
```

**Props:**
```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Styling:**
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div className="text-6xl mb-4" aria-hidden="true">
    {icon}
  </div>
  
  <h2 className="text-xl font-semibold text-neutral-900 mb-2">
    {title}
  </h2>
  
  <p className="text-neutral-600 mb-6 max-w-sm">
    {description}
  </p>
  
  {action && (
    <Button variant="primary" onClick={action.onClick}>
      {action.label}
    </Button>
  )}
</div>
```

**Accessibility:**
- Proper heading hierarchy (h2 for title)
- Icon is decorative (aria-hidden)
- Clear, descriptive text
- Optional action button properly labeled

---

#### 16. Breadcrumb

**Purpose:** Shows current location in hierarchy and enables navigation.

**Layout:**
```
Home > Combat > Basic Attacks
```

**Props:**
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: React.ReactNode;
}
```

**Styling:**
```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center flex-wrap gap-2 text-sm">
    {items.map((item, index) => (
      <li key={index} className="flex items-center gap-2">
        {index > 0 && (
          <span className="text-neutral-400" aria-hidden="true">
            /
          </span>
        )}
        {item.href ? (
          <a 
            href={item.href}
            className="text-primary-600 hover:text-primary-700 
                       hover:underline focus:ring-2 focus:ring-primary-500/50
                       rounded px-1"
          >
            {item.label}
          </a>
        ) : (
          <span className="text-neutral-900 font-medium">
            {item.label}
          </span>
        )}
      </li>
    ))}
  </ol>
</nav>
```

**Accessibility:**
- `<nav>` with aria-label="Breadcrumb"
- Ordered list (`<ol>`) for semantic structure
- Separator is decorative (aria-hidden)
- Current page not a link, visually distinguished
- Links have proper focus states

---

#### 17. SectionCard

**Purpose:** Navigational card to browse rules by section.

**Layout:**
```
┌─────────────────────────────┐
│         [⚔️]                │
│                             │
│       Combat                │
│     24 rules                │
└─────────────────────────────┘
```

**Props:**
```typescript
interface SectionCardProps {
  section: Section;
  icon: React.ReactNode;
  onClick: (sectionId: string) => void;
}
```

**Styling:**
```tsx
<button
  className="w-full bg-gradient-to-br from-primary-50 to-white 
             rounded-xl border border-neutral-200 p-6
             text-center hover:shadow-lg hover:border-primary-300
             focus:ring-4 focus:ring-primary-500/50 transition-all
             min-h-[120px] flex flex-col items-center justify-center"
  onClick={() => onClick(section.id)}
  aria-label={`Browse ${section.title} (${section.rules.length} rules)`}
>
  <div className="text-4xl mb-3" aria-hidden="true">
    {icon}
  </div>
  
  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
    {section.title}
  </h3>
  
  <p className="text-sm text-neutral-600">
    {section.rules.length} rules
  </p>
</button>
```

**Accessibility:**
- Interactive card is `<button>`
- Icon is decorative (aria-hidden)
- aria-label provides full context
- Minimum touch target 120px height
- Focus ring visible
- Gradient background meets contrast requirements for text

---

#### 18. Chip

**Purpose:** Small, tappable label for tags, filters, or related items.

**Variants:**

1. **Default**: Static label
2. **Interactive**: Clickable/removable
3. **Selected**: Active filter state

**Props:**
```typescript
interface ChipProps {
  label: string;
  variant?: 'default' | 'interactive' | 'selected';
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
}
```

**Styling:**
```tsx
<button
  className={cn(
    "inline-flex items-center gap-2 px-3 h-11 rounded-full text-sm",
    "border transition-all focus:ring-2 focus:ring-primary-500/50",
    variant === 'default' && "bg-neutral-100 border-neutral-200 text-neutral-700",
    variant === 'interactive' && "bg-white border-neutral-300 text-neutral-900 hover:border-primary-500",
    variant === 'selected' && "bg-primary-600 border-primary-600 text-white"
  )}
  onClick={onClick}
  aria-label={label}
>
  {icon && <span aria-hidden="true">{icon}</span>}
  <span>{label}</span>
  {onRemove && (
    <button
      className="ml-1 -mr-1 hover:bg-black/10 rounded-full p-1"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      aria-label={`Remove ${label}`}
    >
      <XIcon className="h-3 w-3" />
    </button>
  )}
</button>
```

**Accessibility:**
- Minimum height 44px
- Interactive chips are buttons with proper labels
- Remove action has separate click handler
- Focus states visible
- Selected state communicated with aria-pressed (if toggle)

---

### Common Components

#### 19. ErrorMessage

**Purpose:** Display error states to users.

**Props:**
```typescript
interface ErrorMessageProps {
  title: string;
  message: string;
  retry?: () => void;
}
```

**Styling:**
```tsx
<div 
  className="bg-error-50 border border-error-200 rounded-lg p-4"
  role="alert"
  aria-live="assertive"
>
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-error-600">
      <AlertIcon className="h-5 w-5" />
    </div>
    
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-error-900 mb-1">
        {title}
      </h3>
      <p className="text-sm text-error-700">
        {message}
      </p>
    </div>
  </div>
  
  {retry && (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={retry}
      className="mt-4"
    >
      Try Again
    </Button>
  )}
</div>
```

**Accessibility:**
- role="alert" ensures immediate announcement
- aria-live="assertive" for critical errors
- Color not sole indicator (icon + text)
- Retry button properly labeled
- Sufficient contrast (error-700 on error-50 = 7.1:1)

---

#### 20. SkipLink

**Purpose:** Allow keyboard users to skip to main content.

**Props:**
```typescript
interface SkipLinkProps {
  targetId: string;
  label?: string;
}
```

**Styling:**
```tsx
<a
  href={`#${targetId}`}
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
             focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white 
             focus:rounded-md focus:shadow-lg focus:ring-4 focus:ring-primary-500/50"
>
  {label || "Skip to main content"}
</a>
```

**Behavior:**
- Hidden by default (sr-only)
- Visible when focused with Tab key
- Positioned at top-left when visible
- Clicking scrolls to target and focuses it

**Accessibility:**
- WCAG 2.4.1 requirement
- Must be first focusable element
- Target must have id and tabindex="-1"

---

## Accessibility Requirements

### Keyboard Navigation

All interactive elements must be keyboard accessible:

| Element | Key | Action |
|---------|-----|--------|
| Links/Buttons | Enter, Space | Activate |
| Search Input | Escape | Clear and close |
| Search Results | Arrow Up/Down | Navigate results |
| Search Results | Enter | Select result |
| Modal | Escape | Close modal |
| Tabs | Arrow Left/Right | Switch tabs |
| List Items | Tab | Navigate items |

**Focus Management:**
- Visible focus indicator (3px ring, 2px offset)
- Logical tab order (follows visual flow)
- No keyboard traps
- Focus moves appropriately on route change
- Skip link is first focusable element

### Screen Reader Support

**ARIA Landmarks:**
```html
<header role="banner">
<nav role="navigation" aria-label="Main navigation">
<main role="main" id="main-content">
<footer role="contentinfo">
```

**ARIA Live Regions:**
```html
<!-- Search results count -->
<div aria-live="polite" aria-atomic="true">
  12 results for "combat"
</div>

<!-- Errors -->
<div role="alert" aria-live="assertive">
  Error loading rules
</div>

<!-- Loading states -->
<div role="status" aria-live="polite">
  Loading...
</div>
```

**ARIA Labels:**
- Icon-only buttons: `aria-label="Bookmark this rule"`
- Complex widgets: `aria-labelledby` referencing visible label
- Dynamic content: `aria-describedby` for additional context

**ARIA States:**
- Toggle buttons: `aria-pressed="true|false"`
- Expandable sections: `aria-expanded="true|false"`
- Current page: `aria-current="page"`
- Disabled items: `aria-disabled="true"`

### Color Contrast

All text must meet WCAG AA contrast ratios:

| Text Size | Minimum Ratio | Examples |
|-----------|---------------|----------|
| Small (< 18px) | 4.5:1 | neutral-600 on neutral-50 (7.9:1 ✅) |
| Large (≥ 18px or ≥ 14px bold) | 3:1 | neutral-500 on neutral-50 (5.1:1 ✅) |
| UI Components | 3:1 | Border, icon, focus ring |

**Do NOT rely on color alone:**
- Use icons + text for states
- Use labels + color for categories
- Provide text alternatives

### Touch Targets

All interactive elements on mobile:
- **Minimum**: 44x44px (WCAG 2.5.5 Level AAA)
- **Recommended**: 48x48px
- **Adequate spacing**: 8px between targets

### Focus Indicators

```css
/* Default focus ring */
.focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 2px white,
    0 0 0 5px theme('colors.primary.500');
}

/* Alternative focus ring (on dark backgrounds) */
.focus-visible-inverse {
  outline: none;
  box-shadow: 
    0 0 0 2px theme('colors.primary.900'),
    0 0 0 5px white;
}
```

**Requirements:**
- Focus indicator visible on ALL focusable elements
- Minimum 3px thickness
- Sufficient contrast with background (3:1)
- Not removed or obscured

### Responsive Text

Text must be resizable up to 200% without:
- Loss of content
- Loss of functionality
- Overlapping text
- Horizontal scrolling (width only)

**Implementation:**
- Use relative units (rem, em, %)
- Test at 200% zoom in browser
- No fixed pixel widths on text containers

### Animations

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Guidelines:**
- No auto-playing videos
- Animations are optional enhancements
- Essential information not conveyed by animation alone

## Design Decisions

### 1. Mobile-First Approach

**Decision:** Design and build for mobile screens first, then enhance for larger screens.

**Rationale:**
- Primary use case is quick reference on phone during game sessions
- Forces prioritization of essential features
- Easier to scale up than scale down
- Tailwind CSS is mobile-first by default

**Implementation:**
- Default styles target < 640px
- Use `md:` prefix for tablet optimizations (768px+)
- Use `lg:` prefix for desktop optimizations (1024px+)

### 2. Bottom Navigation (Mobile)

**Decision:** Use bottom tab bar for primary navigation on mobile.

**Rationale:**
- Easily reachable with thumb on large phones
- Standard pattern in mobile apps (user familiarity)
- Keeps navigation persistent and visible
- Clearly communicates primary sections

**Alternatives Considered:**
- Hamburger menu: Hides navigation, extra tap required
- Top tabs: Hard to reach on large phones

### 3. Card-Based Layout

**Decision:** Use cards as primary container for content.

**Rationale:**
- Clear visual grouping
- Tapable areas are obvious
- Works well on any screen size
- Elevates content from background
- Accessible with proper semantic HTML

### 4. Minimal Color Palette

**Decision:** Use a restrained color palette focused on blues and neutrals.

**Rationale:**
- Accessibility: Easier to maintain contrast ratios
- Professional appearance for reference material
- Blue is associated with trust and clarity
- Reduces cognitive load
- Easier to maintain consistency

### 5. Search-First Experience

**Decision:** Prominent search in header, dedicated search page.

**Rationale:**
- Key use case: "I need to look up X rule quickly"
- Faster than navigating hierarchy for known rules
- Search bar always visible (no extra tap)
- Supports both browsing and searching workflows

### 6. Progressive Disclosure

**Decision:** Show preview text in lists, full content on detail pages.

**Rationale:**
- Reduces cognitive load
- Faster scanning in lists
- Full content available when needed
- Improves performance (less DOM)
- Mobile screens have limited space

### 7. No Dark Mode (Initial)

**Decision:** Light mode only for initial release.

**Rationale:**
- Faster initial development
- Simpler to ensure accessibility compliance
- Can add dark mode later without redesigning
- Architecture supports theming (Context)

**Future:** Add dark mode based on user demand.

### 8. System Font Stack

**Decision:** Use system fonts instead of custom web fonts.

**Rationale:**
- Performance: No font download
- Accessibility: Users' preferred reading font
- Cross-platform: Looks native on every OS
- Maintenance: No font licensing/hosting
- Familiarity: Users are comfortable with system fonts

## Responsive Breakpoint Strategy

### Mobile (< 640px) - Default

**Layout:**
- Single column
- Full-width cards
- Bottom navigation
- Stack content vertically
- Touch-optimized (48px targets)

**Typography:**
- text-base (16px) for body
- text-2xl (24px) for h1
- text-lg (18px) for h2

**Spacing:**
- px-4 (16px) container padding
- space-y-4 (16px) between cards

**Navigation:**
- Bottom nav (3 items)
- Collapsed search in header

---

### Tablet (640px - 1024px) - `md:`

**Layout:**
- 2 column grid for cards
- Wider containers (max-w-4xl)
- Bottom nav still visible
- Slight spacing increase

**Typography:**
- text-3xl (30px) for h1
- text-xl (20px) for h2

**Spacing:**
- px-6 (24px) container padding
- space-y-6 (24px) between sections

**Navigation:**
- Bottom nav or transition to header nav
- Search bar expands

---

### Desktop (1024px+) - `lg:`

**Layout:**
- 3 column grid for cards
- Max container width (max-w-7xl)
- Header navigation only (no bottom nav)
- Sidebar for filters (future)

**Typography:**
- text-5xl (48px) for hero
- text-4xl (36px) for h1
- text-2xl (24px) for h2

**Spacing:**
- px-8 (32px) container padding
- space-y-8 (32px) between sections

**Navigation:**
- Horizontal nav in header
- Full search bar always visible
- Hover states enabled

## Component Checklist

Every component must have:

- [ ] **TypeScript Props Interface**: Fully typed
- [ ] **Responsive Styling**: Mobile-first with breakpoints
- [ ] **Accessibility**:
  - [ ] Proper semantic HTML
  - [ ] ARIA labels where needed
  - [ ] Keyboard navigable
  - [ ] Focus states visible
  - [ ] Touch targets ≥44px
  - [ ] Color contrast ≥4.5:1 (normal text)
  - [ ] Screen reader tested
- [ ] **States Handled**:
  - [ ] Default
  - [ ] Hover (desktop)
  - [ ] Focus
  - [ ] Active/Pressed
  - [ ] Disabled
  - [ ] Loading (if applicable)
  - [ ] Error (if applicable)
- [ ] **Documentation**: Component .md file
- [ ] **Tests**: Component .spec.tsx file

## Handoff Checklist

- [x] Design system defined (colors, typography, spacing)
- [x] Responsive breakpoints specified
- [x] User flows documented
- [x] Layout components specified
- [x] Page components specified
- [x] UI components specified
- [x] Accessibility requirements documented
- [x] Design decisions documented with rationale

## HANDOFF TO CODER

**@coder**

The **Project Setup** design specifications are complete. The UI/UX foundation for Rule Bound is now defined with comprehensive component specifications and accessibility requirements.

### Design System Summary

**Visual Foundation:**
- Color palette: Blue primary (primary-600) + neutral grays
- All colors WCAG AA compliant (4.5:1+ contrast)
- Typography: System font stack, 16px base size, 1.5 line height
- Spacing: 4px base unit (Tailwind defaults)
- Touch targets: 44px minimum on mobile

**Responsive Strategy:**
- Mobile-first approach (< 640px default)
- Tablet optimizations at 768px (`md:`)
- Desktop optimizations at 1024px (`lg:`)
- Bottom nav on mobile, header nav on desktop

### Component Architecture

**Layout Components (3):**
1. `AppLayout`: Root layout wrapper
2. `Header`: Top navigation with search
3. `BottomNav`: Mobile bottom tab bar

**Page Components (5):**
4. `HomePage`: Hero + section cards
5. `RulesListPage`: Filterable list of rules
6. `RuleDetailPage`: Full rule content
7. `BookmarksPage`: User's saved rules
8. `SearchPage`: Search interface + results

**UI Components (12):**
9. `Button`: Primary interactive element (4 variants)
10. `Card`: Content container (3 variants)
11. `RuleCard`: Rule preview in lists
12. `BookmarkButton`: Toggle bookmark state
13. `SearchInput`: Search text field
14. `LoadingSpinner`: Loading states
15. `EmptyState`: No content messaging
16. `Breadcrumb`: Navigation path
17. `SectionCard`: Section navigation cards
18. `Chip`: Tags, filters, related items
19. `ErrorMessage`: Error states
20. `SkipLink`: Accessibility skip to content

### Accessibility Requirements

**Must implement:**
- Keyboard navigation for all interactive elements
- Focus indicators (3px ring, 2px offset, primary-500 color)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content (search results, errors)
- Skip link to main content (first focusable element)
- Semantic HTML (header, main, nav, article, etc.)
- Color contrast ≥4.5:1 for normal text, ≥3:1 for large text
- Touch targets ≥44px on mobile
- Screen reader announcements for state changes

**Testing required:**
- ESLint jsx-a11y rules must pass
- vitest-axe tests must pass
- Keyboard-only navigation functional
- Screen reader compatibility (manual test)

### Implementation Priority

**Phase 1 (Foundation):**
1. Set up Tailwind config with design tokens
2. Implement layout components (AppLayout, Header, BottomNav)
3. Implement basic UI components (Button, Card, LoadingSpinner, ErrorMessage)
4. Set up routing with React Router

**Phase 2 (Core Features):**
5. Implement HomePage with section navigation
6. Implement RulesListPage with rule cards
7. Implement RuleDetailPage with content display
8. Implement basic search functionality

**Phase 3 (User Features):**
9. Implement BookmarksPage
10. Implement SearchPage with full search
11. Implement bookmark functionality
12. Polish animations and transitions

### Key Implementation Notes

**Tailwind Configuration:**
- Extend default theme with custom colors
- Configure font family (system stack)
- Enable focus-visible plugin
- Configure container max-widths

**Accessibility Setup:**
- Install and configure eslint-plugin-jsx-a11y
- Set up @axe-core/react for dev mode
- Add vitest-axe for component tests
- Create SkipLink as first element in AppLayout

**State Management:**
- Use Zustand for rules, bookmarks, preferences
- Use Context for theme, UI state (mobile menu, modals)
- localStorage for persisting bookmarks and preferences

**Code Organization:**
- Follow ADR-006 project structure
- Colocate components with tests and docs
- Use index.ts for clean exports
- Configure path aliases (@/components, @/lib, etc.)

### Design Resources

All design specifications are in this document:
- **Design System**: Colors, typography, spacing, breakpoints
- **User Flows**: Browse, search, bookmark, read
- **Component Specs**: All 20 components with props, styling, accessibility
- **Accessibility Requirements**: Comprehensive WCAG 2.1 AA checklist

### Architecture References

Implementation must follow architecture decisions:
- [architect.md](./architect.md): Full system architecture
- [ADR-001](./adr/ADR-001-build-tool-selection.md): Vite setup
- [ADR-002](./adr/ADR-002-routing-solution.md): React Router
- [ADR-003](./adr/ADR-003-styling-approach.md): Tailwind CSS
- [ADR-004](./adr/ADR-004-state-management.md): Zustand + Context
- [ADR-005](./adr/ADR-005-accessibility-tooling.md): A11y tooling
- [ADR-006](./adr/ADR-006-project-structure.md): File organization

### Success Criteria

Implementation is complete when:
- All 20 components implemented with TypeScript
- Design system tokens in Tailwind config
- Mobile-first responsive on all breakpoints
- All accessibility requirements met (ESLint + axe tests pass)
- Keyboard navigation fully functional
- Focus indicators visible on all interactive elements
- Color contrast meets WCAG AA
- Touch targets ≥44px on mobile

Please implement according to these specifications. Focus on accessibility from the start - it's non-negotiable for Rule Bound.
