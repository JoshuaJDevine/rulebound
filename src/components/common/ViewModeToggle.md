# ViewModeToggle

## Purpose

The ViewModeToggle component provides a segmented control for switching between navigation (list) and reading modes. It displays two buttons in a rounded container with a gold active state, allowing users to toggle between browsing rules in a list format and reading rules sequentially in a document-style view. The component uses clear icons and labels to indicate each mode, with smooth transitions and proper ARIA states for accessibility.

## Usage

```tsx
import { ViewModeToggle } from '@/components/common';

// Basic usage with state management
const [mode, setMode] = useState<'navigation' | 'reading'>('navigation');

<ViewModeToggle
  mode={mode}
  onChange={setMode}
/>

// With disabled state
<ViewModeToggle
  mode={mode}
  onChange={setMode}
  disabled={isLoading}
/>

// In a header or toolbar
<header>
  <ViewModeToggle mode={viewMode} onChange={setViewMode} />
  {/* Other controls */}
</header>
```

## Props / Parameters

| Name      | Type                                      | Required | Default | Description                                            |
| --------- | ----------------------------------------- | -------- | ------- | ------------------------------------------------------ |
| mode      | 'navigation' \| 'reading'                 | Yes      | -       | Current active mode                                    |
| onChange  | (mode: 'navigation' \| 'reading') => void | Yes      | -       | Handler called when mode is changed                    |
| disabled  | boolean                                   | No       | false   | Whether the toggle is disabled (both buttons disabled) |
| className | string                                    | No       | -       | Additional CSS classes to apply to toggle container    |

## Returns

A segmented control element with two buttons (List and Read), where the active button has a gold background and the component supports keyboard navigation and ARIA states.

## Examples

```tsx
// Example 1: Basic mode toggle with state
function RuleViewer({ rules }: { rules: RuleSection[] }) {
  const [mode, setMode] = useState<"navigation" | "reading">("navigation");

  return (
    <div>
      <div className="mb-4">
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>
      {mode === "navigation" ? (
        <RulesList rules={rules} />
      ) : (
        <ReadingView
          topicTitle="Rules"
          rules={rules}
          onExitReadingMode={() => setMode("navigation")}
        />
      )}
    </div>
  );
}

// Example 2: Toggle in header with other controls
function RulePageHeader({
  mode,
  onModeChange,
}: {
  mode: "navigation" | "reading";
  onModeChange: (mode: "navigation" | "reading") => void;
}) {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>Rules</h1>
      <div className="flex items-center gap-4">
        <ViewModeToggle mode={mode} onChange={onModeChange} />
        <SearchInput />
      </div>
    </header>
  );
}

// Example 3: Disabled during loading
function RulesPage() {
  const [mode, setMode] = useState<"navigation" | "reading">("navigation");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <ViewModeToggle mode={mode} onChange={setMode} disabled={isLoading} />
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

// Example 4: Toggle with custom styling
function CustomStyledToggle({
  mode,
  onChange,
}: {
  mode: "navigation" | "reading";
  onChange: (mode: "navigation" | "reading") => void;
}) {
  return (
    <ViewModeToggle mode={mode} onChange={onChange} className="shadow-lg" />
  );
}
```

## Accessibility

The ViewModeToggle component is designed to meet WCAG 2.1 AA accessibility standards:

### Keyboard Navigation

- **Tab**: Focus moves between the two mode buttons
- **Enter/Space**: Activates the focused button (changes mode)
- **Arrow Keys**: Can be used to switch between modes (browser default for button groups)
- **Focus Management**: 2px focus ring with accent-500 color (gold)

### Screen Reader Support

- **Semantic HTML**: Uses `<button>` elements for each mode
- **ARIA Roles**: Container has `role="group"` and `aria-label="View mode"`
- **ARIA States**: Each button has `aria-pressed` indicating active state
  - Active button: `aria-pressed={true}`
  - Inactive button: `aria-pressed={false}`
- **Icon Accessibility**: SVG icons are decorative (no aria-label needed)

### Visual Feedback

- **Focus Indicators**: 2px focus ring with accent-500 color (gold) on all buttons
- **Active State**: Gold background (accent-500) with shadow for active button
- **Hover States**: Text color change on inactive buttons
- **Disabled State**: Opacity reduction (50%) and cursor-not-allowed
- **Transitions**: Smooth transitions for all state changes

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Gold active state (accent-500) maintains sufficient contrast with text
- Dark mode variants tested and validated

### Touch Targets

- Both buttons meet minimum 44x44px touch target size
- Adequate padding (px-4 py-2) provides comfortable touch targets
- Full button area is tappable

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│  [List]  [Read]                         │  ← Segmented control
└─────────────────────────────────────────┘
  ↑ Rounded container (rounded-full)
  ↑ Active button: gold background (accent-500)
  ↑ Inactive buttons: transparent
```

### Styling Details

**Container:**

- Background: neutral-100 (light mode) or primary-800 (dark mode)
- Border radius: rounded-full (fully rounded)
- Padding: p-0.5 (small padding for button spacing)
- Layout: Inline flex with gap between buttons

**Buttons:**

- Base: px-4 py-2, rounded-full, text-sm, font-body, font-medium
- Active State: bg-accent-500, text-primary-900, shadow-sm
- Inactive State: transparent background, text-neutral-800 (light) or neutral-300 (dark)
- Hover (inactive): text-neutral-900 (light) or white (dark)
- Disabled: opacity-50, cursor-not-allowed
- Focus: ring-2 ring-accent-500

**Icons:**

- Size: w-4 h-4
- Spacing: gap-1.5 with text
- Color: Inherits from text color

**Transitions:**

- All properties transition smoothly (duration-normal)
- State changes are animated

## Modes

### Navigation Mode

- **Label**: "List"
- **Icon**: Horizontal lines (list icon)
- **Purpose**: Browse rules in a list/navigation format
- **Use Case**: Quick scanning, jumping between rules, hierarchical navigation

### Reading Mode

- **Label**: "Read"
- **Icon**: Book icon
- **Purpose**: Read rules sequentially in a document-style view
- **Use Case**: Sequential reading, learning, focused consumption

## Disabled State

When `disabled` is true:

- Both buttons are disabled
- Opacity is reduced to 50%
- Cursor changes to not-allowed
- Buttons cannot be clicked or focused
- Use this state during loading or when mode switching is not available

## Performance Considerations

### State Updates

The component handles rapid mode changes efficiently:

- State updates are immediate
- Transitions are CSS-based (performant)
- No expensive computations on mode change
- Consider debouncing if mode changes trigger expensive operations:

```tsx
const [mode, setMode] = useState<"navigation" | "reading">("navigation");
const debouncedMode = useDebounce(mode, 100);

useEffect(() => {
  // Expensive operation based on mode
  performExpensiveOperation(debouncedMode);
}, [debouncedMode]);
```

## Related

- [ReadingView](./ReadingView.md) - Reading mode component that can be toggled
- [TopicCard](./TopicCard.md) - Component that may use reading mode
- [RuleListItem](./RuleListItem.md) - Navigation mode component
- [Button](./ui/Button.md) - Base button component (similar styling patterns)
