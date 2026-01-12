# Header

## Purpose

The Header component provides the top navigation bar for the Rule Bound application with responsive design for both desktop and mobile viewports. It includes the application logo/branding, primary navigation links (desktop), search functionality (with full search bar on desktop and icon on mobile), and quick access to bookmarks. The header is sticky-positioned to remain accessible during scrolling, ensuring users can always access navigation and search.

## Usage

```tsx
import { Header } from "@/components/layout";

// Used in AppLayout
function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}
```

## Props / Parameters

This component takes no props. All state and navigation is managed internally using React Router hooks.

## Returns

A sticky header with logo, navigation, and search functionality, adapting to mobile and desktop viewports.

## Accessibility

- **Semantic HTML**:
  - `<header>` with `role="banner"` - Main site header landmark
  - `<nav>` with `aria-label="Main navigation"` - Navigation landmark
  - `<Link>` for all navigation (proper routing semantics)

- **Keyboard Navigation**:
  - All links are keyboard accessible (Tab navigation)
  - Search input fully keyboard operable
  - Logical tab order: Logo → Nav links → Search → Mobile icons
  - Focus indicators on all interactive elements (2px ring)

- **ARIA Attributes**:
  - `aria-label="Rule Bound Home"` on logo link
  - `aria-label="Main navigation"` on nav element
  - `aria-label="Search rules"` on mobile search button
  - `aria-label="Bookmarks"` on mobile bookmarks link

- **Touch Targets**: All interactive elements meet WCAG 2.5.5:
  - Logo: adequate height (text height + padding)
  - Nav links: 40×40px+ clickable area
  - Search button (mobile): 40×40px (h-10 w-10)
  - Bookmark button (mobile): 40×40px (h-10 w-10)

- **Responsive Accessibility**:
  - Desktop: Full text labels and navigation
  - Mobile: Icon buttons with aria-labels
  - Appropriate for screen size and touch input

- **Focus Management**:
  - Focus visible on all interactive elements
  - Clear focus indicators (ring with primary color)
  - Focus order follows visual layout

## Visual Design

### Desktop Layout (≥ 768px)

```
┌────────────────────────────────────────────────────────┐
│ [Rule Bound]  [Browse] [Bookmarks]  [Search Input]     │
└────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌────────────────────────────────────────────────┐
│ [Rule Bound]              [🔍] [🔖]           │
└────────────────────────────────────────────────┘
```

### Styling

- Position: Sticky top (sticky top-0)
- Z-index: 50 (above content, z-50)
- Background: Dark blue (primary-900, Riftbound branding)
- Border: Bottom border, primary-700
- Role: "banner" landmark
- Container: Max width with horizontal padding
- Height: 56px mobile (h-14), 64px desktop (md:h-16)

### Logo/Brand

- Font: Cinzel display font (font-display)
- Font size: 20px mobile (text-xl), 24px desktop (md:text-2xl)
- Font weight: Semibold (font-semibold)
- Color: White (text-white)
- Hover: Gold accent (hover:text-accent-400)
- Tracking: Wider letter spacing (tracking-wider)
- Focus ring: 2px gold accent (focus:ring-2 focus:ring-accent-500)

### Navigation Links (Desktop)

- Display: Flex with 24px gap (gap-6)
- Hidden on mobile (hidden md:flex)
- Color: Light primary (text-primary-100)
- Active: White with gold underline (text-white underline decoration-accent-500)
- Hover: White with gold underline (hover:text-white hover:underline hover:decoration-accent-500)
- Underline: 2px gold accent, 4px offset
- Padding: 4px horizontal, 8px vertical (px-2 py-1)
- Focus ring: 2px gold accent (focus:ring-2 focus:ring-accent-500)

### Search Bar (Desktop)

- Max width: 448px (max-w-md)
- Flex: Expands (flex-1)
- Hidden on mobile (hidden md:block)
- Full SearchInput component

### Mobile Icons

- Search icon: Visible only on mobile (md:hidden)
- Bookmark icon: Visible only on mobile (md:hidden)
- Dark mode toggle: Always visible
- Size: 40×40px (h-10 w-10)
- Icon size: 20×20px (h-5 w-5)
- Color: Light primary (text-primary-300)
- Hover: Gold accent (hover:text-accent-400)
- Focus ring: 2px gold accent (focus:ring-2 focus:ring-accent-500)
- Rounded corners for visual style

## Component Structure

### State Management

```tsx
const [searchQuery, setSearchQuery] = useState("");
```

### Navigation Hook

```tsx
const navigate = useNavigate();
```

### Search Handlers

```tsx
const handleSearch = (value: string) => {
  setSearchQuery(value);
  if (value.trim()) {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  }
};

const handleClear = () => {
  setSearchQuery("");
};
```

## Behavior

### Search Flow (Desktop)

1. User types in search input
2. `handleSearch` called on every keystroke
3. If query has content, navigate to `/search?q={query}`
4. Real-time navigation as user types

### Search Flow (Mobile)

1. User clicks search icon
2. Navigates to `/search` page
3. Search page shows full search interface

### Navigation

- Logo links to home (`/`)
- Browse links to rules list (`/rules`)
- Bookmarks links to bookmarks page (`/bookmarks`)
- React Router handles navigation (no page refresh)

## Responsive Behavior

### Desktop (≥ 768px)

- Shows full navigation links (Browse, Bookmarks)
- Shows full search input field
- Hides mobile search and bookmark icons
- More spacious layout (gap-4 between elements)

### Mobile (< 768px)

- Hides text navigation links
- Hides full search input
- Shows search icon button (navigates to search page)
- Shows bookmark icon button (navigates to bookmarks)
- Compact layout optimized for small screens

## Design Patterns

### Basic Implementation

```tsx
// Already implemented in AppLayout
<Header />
```

### With Search State Management

The header manages its own search state for desktop search:

```tsx
function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  // ... component render
}
```

### Custom Branding

To customize the logo/branding:

```tsx
// Modify logo text
<Link to="/" className="..." aria-label="Your App Home">
  Your App Name
</Link>

// Add logo image
<Link to="/" className="..." aria-label="Rule Bound Home">
  <img src="/logo.svg" alt="Rule Bound" className="h-8" />
</Link>
```

### Additional Navigation Items

To add more navigation links:

```tsx
<nav className="hidden md:flex items-center gap-4" aria-label="Main navigation">
  <Link to="/rules">Browse</Link>
  <Link to="/bookmarks">Bookmarks</Link>
  <Link to="/about">About</Link> {/* New link */}
  <Link to="/help">Help</Link> {/* New link */}
</nav>
```

## Sticky Header Behavior

### Benefits

- Always accessible during scroll
- Users can search/navigate from anywhere on page
- Maintains context and orientation

### Considerations

- Takes vertical space (56-64px)
- Content below must account for header height
- May need offset for anchor navigation

### Sticky Implementation

```tsx
<header className="sticky top-0 z-50 ...">
```

- `sticky`: Element sticks when reaching top
- `top-0`: Sticks to top of viewport
- `z-50`: Above main content (z-index: 50)

## Search Integration

### Desktop Search

- Real-time search-as-you-type
- Navigates to search page with query parameter
- Preserves query in input field
- Clear button resets search

### Mobile Search

- Icon button navigates to dedicated search page
- Full search experience on search page
- Better for mobile typing and results viewing

### Search URL Pattern

```
/search?q={encodedQuery}
```

Example:

```
/search?q=attack%20roll
```

## Performance Considerations

### Re-rendering

- Header mounted once at app level
- Only search input state causes re-render
- Navigation doesn't unmount header
- Sticky position uses GPU acceleration

### Search Debouncing

Consider debouncing for less aggressive navigation:

```tsx
const debouncedSearch = useMemo(
  () =>
    debounce((value: string) => {
      if (value.trim()) {
        navigate(`/search?q=${encodeURIComponent(value)}`);
      }
    }, 300),
  [navigate],
);

const handleSearch = (value: string) => {
  setSearchQuery(value);
  debouncedSearch(value);
};
```

## Related

- [AppLayout](./AppLayout.md) - Uses Header component
- [BottomNav](./BottomNav.md) - Mobile navigation complement
- [SearchInput](../ui/SearchInput.md) - Search input component
- [SearchPage](../../pages/SearchPage/SearchPage.md) - Search results page
- [rulesStore](../../store/rulesStore.md) - Provides search functionality
- [ADR-002: Routing Solution](../../../.cursor/features/active/setup-project/adr/ADR-002-routing-solution.md)
- [ADR-003: Styling Approach](../../../.cursor/features/active/setup-project/adr/ADR-003-styling-approach.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
