# BottomNav

## Purpose

The BottomNav component provides mobile-optimized bottom navigation for the Rule Bound application. It displays primary navigation links (Home, Browse, Saved) in a fixed bottom bar, making key destinations easily accessible with thumb-friendly touch targets. The component adapts to the current route by highlighting the active page and is hidden on desktop viewports where the Header navigation is used instead.

## Usage

```tsx
import { BottomNav } from "@/components/layout";

// Used in AppLayout
function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <BottomNav /> {/* Visible on mobile only */}
    </div>
  );
}
```

## Props / Parameters

This component takes no props. Navigation items are hardcoded, and active state is determined automatically from the current route using React Router's `useLocation` hook.

## Returns

A fixed bottom navigation bar with three navigation items, visible only on mobile viewports (< 768px).

## Accessibility

- **Semantic HTML**:
  - `<nav>` with `aria-label="Primary navigation"` - Navigation landmark
  - `<Link>` for all navigation (proper routing semantics)

- **Keyboard Navigation**:
  - All links are keyboard accessible
  - Logical tab order (left to right: Home → Browse → Saved)
  - Focus indicators on all links (4px ring with primary color)

- **ARIA Attributes**:
  - `aria-label="Primary navigation"` identifies navigation purpose
  - `aria-current="page"` on active link indicates current page
  - Icons marked as decorative (aria-hidden via React pattern)

- **Touch Targets**: Exceeds WCAG 2.5.5 minimum:
  - Each nav item: Full column width × 64px height
  - Large, easy-to-tap areas for thumb navigation
  - No accidentally missed taps

- **Visual Feedback**:
  - Active page: Primary blue color + semibold font
  - Inactive pages: Neutral gray
  - Clear visual distinction
  - Color + text weight (not relying on color alone)

- **Screen Reader Support**:
  - Navigation landmark announced
  - Current page announced via aria-current
  - Icon + label provides clear context

## Visual Design

### Layout

```
┌──────────────┬──────────────┬──────────────┐
│              │              │              │
│     🏠       │      📚      │      🔖      │
│    Home      │    Browse    │    Saved     │
│              │              │              │
└──────────────┴──────────────┴──────────────┘
```

### Positioning

- Position: Fixed bottom (fixed bottom-0 left-0 right-0)
- Z-index: 40 (above content, below header: z-40)
- Width: Full width (left-0 right-0)
- Display: Mobile only (md:hidden)

### Container Styling

- Background: White (bg-white)
- Border: Top border, neutral-200 (border-t border-neutral-200)
- Layout: CSS Grid, 3 equal columns (grid grid-cols-3)
- Height: 64px (h-16)

### Navigation Items

- Layout: Flex column (flex flex-col)
- Alignment: Center (items-center justify-center)
- Gap: 4px between icon and label (gap-1)
- Full column width and height

### Icon Styling

- Size: 24×24px (h-6 w-6)
- Stroke width: 2px (strokeWidth={2})
- Marked as decorative (aria-hidden)

### Label Styling

- Font size: 12px (text-xs)
- Active state: Primary-600, semibold (text-primary-600 font-semibold)
- Inactive state: Neutral-500 (text-neutral-500)
- Hover: Neutral-700 (hover:text-neutral-700)

### Active State

- Text color: Primary-600
- Font weight: Semibold
- Icon color: Matches text (currentColor)

### Focus State

- 4px focus ring (focus:ring-4)
- Primary color at 50% opacity (focus:ring-primary-500/50)
- No outline (focus:outline-none)
- Smooth transitions (transition-colors)

## Navigation Items

### Home

- Path: `/`
- Icon: House icon (home with roof and door)
- Label: "Home"
- Destination: Home page with section cards

### Browse

- Path: `/rules`
- Icon: Book icon (open book)
- Label: "Browse"
- Destination: Rules list page

### Saved

- Path: `/bookmarks`
- Icon: Bookmark icon (bookmark ribbon)
- Label: "Saved"
- Destination: Bookmarked rules page

## Active State Detection

Uses React Router's `useLocation` hook:

```tsx
const location = useLocation();
const isActive = location.pathname === item.path;
```

- Exact path matching
- Updates automatically on route change
- No manual state management needed

## Responsive Behavior

### Mobile (< 768px)

- ✅ Visible and fixed to bottom
- ✅ Primary navigation method
- ✅ Easy thumb access
- ✅ Doesn't scroll with content

### Desktop (≥ 768px)

- ❌ Hidden (md:hidden)
- Header navigation used instead
- More screen real estate for content

## Implementation Details

### Component Structure

```tsx
export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/rules", label: "Browse", icon: <BookIcon /> },
    { path: "/bookmarks", label: "Saved", icon: <BookmarkIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-40">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return <NavItem key={item.path} item={item} isActive={isActive} />;
        })}
      </div>
    </nav>
  );
}
```

### Content Padding

AppLayout adds bottom padding to account for the fixed bottom nav:

```tsx
<main className="flex-1 pb-20 md:pb-8">{children}</main>
```

- Mobile: `pb-20` (80px) gives space for 64px nav + 16px buffer
- Desktop: `md:pb-8` (32px) reduces padding when nav hidden

## Design Patterns

### Adding Navigation Items

To add more navigation items (note: consider UX - 3-5 items ideal):

```tsx
const navItems = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/rules', label: 'Browse', icon: <BookIcon /> },
  { path: '/search', label: 'Search', icon: <SearchIcon /> },  // New
  { path: '/bookmarks', label: 'Saved', icon: <BookmarkIcon /> },
];

// Update grid columns
<div className="grid grid-cols-4 h-16">
```

### Custom Active State

To customize active state styling:

```tsx
<Link
  className={cn(
    'flex flex-col items-center justify-center gap-1',
    isActive
      ? 'text-primary-600 font-semibold bg-primary-50'  // Add background
      : 'text-neutral-500 hover:text-neutral-700'
  )}
  aria-current={isActive ? 'page' : undefined}
>
```

### With Badge/Notification

To add notification badges (e.g., unread count):

```tsx
<Link className="relative ...">
  {notificationCount > 0 && (
    <span className="absolute top-2 right-4 h-4 w-4 bg-error-600 rounded-full text-xs text-white flex items-center justify-center">
      {notificationCount}
    </span>
  )}
  <span aria-hidden="true">{item.icon}</span>
  <span>{item.label}</span>
</Link>
```

## User Experience Considerations

### Mobile Navigation Best Practices

- **3-5 items**: Current 3 is ideal, max 5 for usability
- **Clear icons**: Universally recognizable icons
- **Text labels**: Don't rely on icons alone
- **Large targets**: Full column width/height for easy tapping
- **Active state**: Clear visual indication of current page

### Why Fixed Bottom?

- **Thumb-friendly**: Easy to reach with one hand
- **Always accessible**: No scrolling needed
- **Convention**: Common mobile pattern (iOS, Android)
- **Space efficient**: Doesn't take permanent space from content

### Icon Selection

Current icons chosen for clarity:

- **Home** (🏠): Universal symbol for main page
- **Browse** (📚): Book represents rule browsing
- **Saved** (🔖): Bookmark for saved items

## Performance Considerations

### Rendering

- Component rendered once in AppLayout
- Only re-renders on route change (location update)
- Fixed position doesn't affect layout reflows
- CSS Grid for efficient layout

### Paint Performance

- Fixed positioning uses GPU acceleration
- Simple layout prevents jank
- Minimal state changes

## Testing Considerations

### Responsive Testing

1. Verify visible on mobile (< 768px)
2. Verify hidden on desktop (≥ 768px)
3. Check content padding adjusts correctly

### Navigation Testing

1. Each item navigates to correct route
2. Active state updates on navigation
3. Keyboard navigation works correctly
4. Focus indicators visible

### Accessibility Testing

1. Screen reader announces as navigation
2. aria-current on active item
3. Keyboard accessible
4. Touch targets adequate size

## Related

- [AppLayout](./AppLayout.md) - Uses BottomNav component
- [Header](./Header.md) - Desktop navigation complement
- [HomePage](../../pages/HomePage/HomePage.md) - Home destination
- [RulesListPage](../../pages/RulesListPage/RulesListPage.md) - Browse destination
- [BookmarksPage](../../pages/BookmarksPage/BookmarksPage.md) - Saved destination
- [ADR-002: Routing Solution](../../../.cursor/features/active/setup-project/adr/ADR-002-routing-solution.md)
- [ADR-003: Styling Approach](../../../.cursor/features/active/setup-project/adr/ADR-003-styling-approach.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
