# SearchInput

## Purpose

The SearchInput component provides a specialized text input for searching rules in the Rule Bound application. It features a built-in search icon, clear button (when text is present), and proper accessibility attributes. The component handles real-time search input with optional auto-focus and disabled states, making it suitable for both page-level and inline search functionality.

## Usage

```tsx
import { SearchInput } from "@/components/ui";

function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      onClear={() => setQuery("")}
      placeholder="Search rules..."
    />
  );
}
```

## Props / Parameters

| Name        | Type                    | Required | Description                                         |
| ----------- | ----------------------- | -------- | --------------------------------------------------- |
| value       | string                  | Yes      | Current search input value                          |
| onChange    | (value: string) => void | Yes      | Callback when input value changes                   |
| onClear     | () => void              | Yes      | Callback when clear button is clicked               |
| placeholder | string                  | No       | Input placeholder text (default: 'Search rules...') |
| autoFocus   | boolean                 | No       | Auto-focus input on mount (default: false)          |
| disabled    | boolean                 | No       | Disables the input (default: false)                 |
| ariaLabel   | string                  | No       | Accessible label (default: 'Search rules')          |
| className   | string                  | No       | Additional CSS classes for container                |

## Returns

An accessible search input with search icon, clear button (conditionally rendered), and proper keyboard support.

## Examples

```tsx
// Example 1: Basic search input
<SearchInput
  value={searchQuery}
  onChange={setSearchQuery}
  onClear={() => setSearchQuery('')}
/>

// Example 2: Auto-focused search on page load
<SearchInput
  value={query}
  onChange={setQuery}
  onClear={clearSearch}
  autoFocus
  placeholder="Find a rule..."
/>

// Example 3: Disabled state during loading
<SearchInput
  value={query}
  onChange={setQuery}
  onClear={clearSearch}
  disabled={isSearching}
  placeholder="Searching..."
/>

// Example 4: Custom aria-label for context
<SearchInput
  value={bookmarkQuery}
  onChange={setBookmarkQuery}
  onClear={() => setBookmarkQuery('')}
  ariaLabel="Search bookmarked rules"
  placeholder="Search your bookmarks..."
/>

// Example 5: With custom styling
<SearchInput
  value={query}
  onChange={setQuery}
  onClear={clearSearch}
  className="max-w-2xl mx-auto"
/>

// Example 6: Integrated search with navigation
function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <SearchInput
      value={query}
      onChange={handleSearch}
      onClear={() => setQuery('')}
    />
  );
}
```

## Accessibility

- **Semantic HTML**: Uses `<input type="search">` for native search semantics
- **Keyboard Navigation**:
  - Standard text input navigation
  - Tab to focus input
  - Tab to reach clear button (when visible)
  - Enter to submit (handled by parent)
  - Escape clears input (native browser behavior)
- **Focus Indicators**:
  - 4px focus ring on input with 50% opacity primary color
  - 2px focus ring on clear button
  - Visible focus outline meets WCAG standards
- **ARIA Attributes**:
  - `aria-label` provides context for screen readers
  - Clear button has descriptive `aria-label="Clear search"`
- **Touch Targets**:
  - Input height: 48px (h-12) ✅
  - Clear button: 32px (h-8 w-8) tap area with visual feedback
- **Icon Semantics**: Search and clear icons are decorative (aria-hidden implicit)
- **Color Contrast**:
  - Placeholder text: neutral-400 on white (meets AA for placeholders)
  - Input text: neutral-900 on white (excellent contrast)
  - Border: neutral-300 with primary-500 focus state

## Visual Design

### Input Structure

- **Height**: 48px (h-12) - meets touch target size
- **Padding Left**: 48px (pl-12) - space for search icon
- **Padding Right**: 48px (pr-12) - space for clear button when visible
- **Border**: 1px neutral-300, changes to primary-500 on focus
- **Border Radius**: 8px (rounded-lg)
- **Background**: White (bg-white)

### Icons

- **Search Icon**:
  - Position: Absolute left, centered vertically
  - Left offset: 16px (left-4)
  - Size: 20×20px (h-5 w-5)
  - Color: neutral-400 (decorative, not interactive)

- **Clear Button**:
  - Position: Absolute right, centered vertically
  - Right offset: 16px (right-4)
  - Size: 32×32px (h-8 w-8) with 16×16px icon
  - Visible only when `value` is not empty
  - Hover: light gray background (hover:bg-neutral-100)
  - Rounded: full circle

### States

- **Default**: Border neutral-300, white background
- **Focus**: Border primary-500, 4px primary ring with 50% opacity
- **Disabled**: Standard disabled styling (browser default)
- **With Value**: Clear button appears

## Behavior

### Real-time Search

The component calls `onChange` on every keystroke, enabling real-time search functionality:

```tsx
const handleSearch = (value: string) => {
  setQuery(value);
  // Perform search immediately or debounce
  performSearch(value);
};

<SearchInput
  value={query}
  onChange={handleSearch}
  onClear={() => setQuery("")}
/>;
```

### Clear Button Logic

The clear button:

1. Only renders when `value` is truthy
2. Calls `onClear()` when clicked
3. Uses `e.stopPropagation()` (implicit in implementation)
4. Is a separate button element for accessibility

### Auto Focus

When `autoFocus={true}`, the input receives focus on mount. Use sparingly:

- Search-dedicated pages: ✅ Good
- Modals/dialogs: ✅ Good
- General pages: ❌ Avoid (can be disorienting)

## Design Patterns

### Header Search

```tsx
function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex-1 max-w-md">
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value)}`);
          }
        }}
        onClear={() => setQuery("")}
      />
    </div>
  );
}
```

### Search Page with Auto-Focus

```tsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useSearch(query);

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
        autoFocus
      />
      <SearchResults results={results} />
    </div>
  );
}
```

### Debounced Search

```tsx
function SearchWithDebounce() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const results = useSearch(debouncedQuery);

  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      onClear={() => setQuery("")}
    />
  );
}
```

## Related

- [Header](../layout/Header.md) - Uses SearchInput for top navigation search
- [SearchPage](../../pages/SearchPage/SearchPage.md) - Dedicated search page
- [rulesStore](../../store/rulesStore.md) - Provides search functionality
- [ADR-005: Accessibility Tooling](../../../.cursor/features/active/setup-project/adr/ADR-005-accessibility-tooling.md)
