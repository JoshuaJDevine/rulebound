# AppLayout

## Purpose

The AppLayout component serves as the root layout wrapper for all pages in the Rule Bound application. It provides a consistent structure with a skip link for accessibility, header navigation, main content area, and bottom navigation for mobile. This component ensures a unified layout experience across all routes while implementing key accessibility features like landmark regions and keyboard navigation support.

## Usage

```tsx
import { AppLayout } from "@/components/layout";

function App() {
  return (
    <AppLayout>
      <YourPageContent />
    </AppLayout>
  );
}

// In routing setup
function Routes() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rules" element={<RulesPage />} />
          {/* ... other routes */}
        </Routes>
      </AppLayout>
    </Router>
  );
}
```

## Props / Parameters

| Name     | Type            | Required | Description                         |
| -------- | --------------- | -------- | ----------------------------------- |
| children | React.ReactNode | Yes      | Page content to render in main area |

## Returns

A complete page layout with header, main content area, and navigation, wrapped with accessibility features.

## Examples

```tsx
// Example 1: Basic page wrapper
function HomePage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1>Welcome to Rule Bound</h1>
        {/* Page content */}
      </div>
    </AppLayout>
  );
}

// Example 2: With router integration
function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rules" element={<RulesListPage />} />
          <Route path="/rule/:id" element={<RuleDetailPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

// Example 3: Page with custom layout content
function RuleDetailPage() {
  return (
    <AppLayout>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbs} />
          <article>{/* Rule content */}</article>
        </div>
      </div>
    </AppLayout>
  );
}

// Example 4: Full-width content
function SearchPage() {
  return (
    <AppLayout>
      {/* No container, full width */}
      <div className="min-h-screen bg-neutral-50 px-4 py-8">
        <SearchInterface />
      </div>
    </AppLayout>
  );
}
```

## Accessibility

This component implements several critical accessibility features:

### WCAG 2.4.1: Bypass Blocks (Level A)

- **Skip Link**: Provides keyboard users a way to bypass navigation
- Appears on first Tab press
- Jumps directly to main content

### Landmark Regions

- **Skip Link**: Accessibility bypass mechanism
- **Header**: Top navigation (role="banner" in Header component)
- **Main**: Content area with `role="main"` and `id="main-content"`
- **Navigation**: Bottom navigation (role="navigation" in BottomNav)

### Keyboard Navigation

- **Focusable Main**: `tabIndex={-1}` allows programmatic focus (for skip link)
- **Logical Tab Order**: Skip link → Header → Main content → Bottom nav
- **Focus Management**: Main content receives focus when skip link activated

### Semantic HTML

- Proper HTML5 landmarks (`<main>`)
- Clear page structure
- Hierarchical layout

### Responsive Accessibility

- Bottom navigation hidden on desktop (md:)
- Content padding adjusts for mobile navigation (pb-20 on mobile)
- Touch-friendly navigation on mobile

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────┐
│ [Skip Link - Hidden until focused]  │
├─────────────────────────────────────┤
│          Header (Sticky)            │
├─────────────────────────────────────┤
│                                     │
│                                     │
│          Main Content               │
│          (flex-1)                   │
│                                     │
│                                     │
├─────────────────────────────────────┤
│    Bottom Nav (Mobile Only)         │
└─────────────────────────────────────┘
```

### Container Styling

- Min height: Full viewport (min-h-screen)
- Display: Flex column (flex flex-col)
- Background: Neutral-50 (bg-neutral-50)

### Main Content Area

- Flex: Expands to fill space (flex-1)
- Padding bottom: 80px on mobile (pb-20), 32px on desktop (md:pb-8)
- Role: "main" landmark
- ID: "main-content" (skip link target)
- Tab index: -1 (programmatically focusable)

### Responsive Behavior

- **Mobile**: Header + Main + Bottom Nav (pb-20 for nav space)
- **Desktop**: Header + Main (no bottom nav, reduced padding)

## Implementation Details

### Component Structure

```tsx
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <SkipLink targetId="main-content" />
      <Header />
      <main
        id="main-content"
        className="flex-1 pb-20 md:pb-8"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
```

### Padding Calculation

The main content padding accommodates the bottom navigation:

- Mobile bottom nav height: 64px (h-16)
- Mobile content padding: 80px (pb-20 = 5rem = 80px)
- Extra space: 16px buffer for scroll comfort
- Desktop: Reduced to 32px (pb-8) since no bottom nav

## Usage Patterns

### Application Root

```tsx
function App() {
  return (
    <Router>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
}
```

### With Global State

```tsx
function App() {
  const { loadRules } = useRulesStore();

  useEffect(() => {
    loadRules(); // Load data at app level
  }, []);

  return (
    <Router>
      <AppLayout>
        <Suspense fallback={<LoadingSpinner variant="page" />}>
          <AppRoutes />
        </Suspense>
      </AppLayout>
    </Router>
  );
}
```

### With Error Boundary

```tsx
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </ErrorBoundary>
  );
}
```

### Page-Specific Layouts

Some pages may need custom layouts while maintaining the AppLayout structure:

```tsx
function RuleDetailPage() {
  return (
    <AppLayout>
      {/* Custom background for this page */}
      <div className="bg-white min-h-full">
        <div className="container mx-auto px-4 py-6">
          <RuleContent />
        </div>
      </div>
    </AppLayout>
  );
}
```

## Responsive Considerations

### Mobile (< 768px)

- Bottom navigation visible and fixed
- Content has extra bottom padding (pb-20)
- Header search collapsed to icon
- Vertical space optimization

### Desktop (≥ 768px)

- Bottom navigation hidden (md:hidden in BottomNav)
- Content has reduced bottom padding (md:pb-8)
- Header shows full navigation and search
- Horizontal layout options available

## Performance Considerations

### Layout Shifts

The AppLayout prevents layout shifts by:

- Fixed header height
- Predetermined bottom nav space (via padding)
- Flex layout maintains stability

### Rendering

- AppLayout renders once at app level
- Only children re-render on route changes
- Header and BottomNav remain mounted (better performance)

## Testing Considerations

### Accessibility Testing

Test the following:

1. Skip link appears on Tab
2. Skip link navigates to main content
3. Main content receives focus after skip
4. Keyboard navigation flows logically
5. Screen reader announces landmarks correctly

### Responsive Testing

1. Bottom nav appears on mobile
2. Bottom nav hidden on desktop
3. Content padding adjusts correctly
4. No horizontal scroll at any breakpoint

## Related

- [Header](./Header.md) - Top navigation component
- [BottomNav](./BottomNav.md) - Mobile bottom navigation
- [SkipLink](../ui/SkipLink.md) - Accessibility bypass feature
- [HomePage](../../pages/HomePage/HomePage.md) - Example page using AppLayout
- [RulesListPage](../../pages/RulesListPage/RulesListPage.md) - Example page using AppLayout
- [ADR-002: Routing Solution](../../../.cursor/features/active/setup-project/adr/ADR-002-routing-solution.md)
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
- [ADR-006: Project Structure](../../../.cursor/features/active/setup-project/adr/ADR-006-project-structure.md)
