# useDarkMode

## Purpose

The useDarkMode hook provides dark mode functionality with system preference detection and localStorage persistence. It manages the application's theme state, allowing users to choose between light mode, dark mode, or system preference, and automatically applies the appropriate theme to the document. The hook listens for system preference changes when in system mode and persists user preferences across sessions.

## Usage

```tsx
import { useDarkMode } from "@/lib/hooks";

// Basic usage
function MyComponent() {
  const { mode, resolvedMode, setMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <p>Resolved mode: {resolvedMode}</p>
      <button onClick={() => setMode("light")}>Light</button>
      <button onClick={() => setMode("dark")}>Dark</button>
      <button onClick={() => setMode("system")}>System</button>
      <button onClick={toggleDarkMode}>Toggle</button>
    </div>
  );
}

// In a theme toggle button
function ThemeToggle() {
  const { resolvedMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode}>
      {resolvedMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    </button>
  );
}

// With mode selector
function ThemeSelector() {
  const { mode, setMode } = useDarkMode();

  return (
    <select
      value={mode}
      onChange={(e) => setMode(e.target.value as "light" | "dark" | "system")}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

## Returns

The hook returns an object with the following properties:

| Name           | Type                                          | Description                                                         |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| mode           | 'light' \| 'dark' \| 'system'                 | Current mode setting (user preference)                              |
| resolvedMode   | 'light' \| 'dark'                             | Resolved mode (actual theme applied, considering system preference) |
| setMode        | (mode: 'light' \| 'dark' \| 'system') => void | Function to set the mode explicitly                                 |
| toggleDarkMode | () => void                                    | Function to toggle between light and dark (respects system mode)    |

## Parameters

The hook takes no parameters. It reads the initial mode from localStorage or defaults to 'system'.

## Examples

```tsx
// Example 1: Theme toggle button
function DarkModeToggle() {
  const { resolvedMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={
        resolvedMode === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {resolvedMode === "dark" ? (
        <SunIcon /> // Switch to light
      ) : (
        <MoonIcon /> // Switch to dark
      )}
    </button>
  );
}

// Example 2: Mode selector with all options
function ThemeModeSelector() {
  const { mode, setMode } = useDarkMode();

  return (
    <div>
      <label htmlFor="theme-mode">Theme:</label>
      <select
        id="theme-mode"
        value={mode}
        onChange={(e) => setMode(e.target.value as "light" | "dark" | "system")}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}

// Example 3: Conditional rendering based on mode
function ThemedComponent() {
  const { resolvedMode } = useDarkMode();

  return (
    <div className={resolvedMode === "dark" ? "dark-theme" : "light-theme"}>
      <h1>Content</h1>
    </div>
  );
}

// Example 4: Display current mode
function ModeDisplay() {
  const { mode, resolvedMode } = useDarkMode();

  return (
    <div>
      <p>Mode setting: {mode}</p>
      <p>Resolved mode: {resolvedMode}</p>
      {mode === "system" && <p>Following system preference: {resolvedMode}</p>}
    </div>
  );
}

// Example 5: Header with theme toggle
function Header() {
  const { resolvedMode, toggleDarkMode } = useDarkMode();

  return (
    <header>
      <h1>My App</h1>
      <button
        onClick={toggleDarkMode}
        aria-label={
          resolvedMode === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
      >
        {resolvedMode === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
```

## Mode Values

### mode

The `mode` property represents the user's preference:

- **'light'**: Always use light mode
- **'dark'**: Always use dark mode
- **'system'**: Follow system preference (default)

### resolvedMode

The `resolvedMode` property represents the actual theme being applied:

- **'light'**: Light theme is active
- **'dark'**: Dark theme is active

When `mode` is 'system', `resolvedMode` reflects the current system preference.

## Initialization

The hook initializes by:

1. **Reading localStorage**: Checks for stored 'darkMode' value
2. **Defaulting to 'system'**: If no stored value exists, defaults to 'system'
3. **Applying theme**: Immediately applies the resolved theme to the document

```tsx
const [mode, setMode] = useState<DarkMode>(() => {
  const stored = localStorage.getItem("darkMode") as DarkMode | null;
  return stored || "system";
});
```

## DOM Updates

The hook automatically applies the theme to the document:

- **Dark mode**: Adds 'dark' class to `document.documentElement`
- **Light mode**: Removes 'dark' class from `document.documentElement`

This works with Tailwind CSS's dark mode feature, which applies dark styles when the 'dark' class is present on the root element.

```tsx
useEffect(() => {
  if (resolvedMode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Save preference
  localStorage.setItem("darkMode", mode);
}, [mode, resolvedMode]);
```

## System Preference Detection

When `mode` is 'system', the hook:

1. **Detects initial preference**: Uses `window.matchMedia('(prefers-color-scheme: dark)')`
2. **Listens for changes**: Adds event listener for system preference changes
3. **Updates DOM**: Automatically updates document class when system preference changes
4. **Cleans up**: Removes event listener on unmount or mode change

```tsx
useEffect(() => {
  if (mode !== "system") return;

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}, [mode]);
```

## LocalStorage Persistence

The hook automatically persists the mode preference:

- **Key**: 'darkMode'\*\*
- **Value**: 'light', 'dark', or 'system'
- **Saving**: Saves whenever mode changes
- **Reading**: Reads on initialization

The preference persists across browser sessions, so users don't need to reconfigure their theme preference.

## Toggle Behavior

The `toggleDarkMode` function intelligently handles toggling:

- **If mode is 'system'**: Toggles based on current `resolvedMode` (switches to opposite of system preference)
- **If mode is 'light'**: Switches to 'dark'
- **If mode is 'dark'**: Switches to 'light'

```tsx
toggleDarkMode: () => {
  setMode((current) => {
    if (current === "system") {
      return resolvedMode === "dark" ? "light" : "dark";
    }
    return current === "dark" ? "light" : "dark";
  });
};
```

## Performance Considerations

### Initialization

- **localStorage read**: Synchronous, but fast (typically < 1ms)
- **System preference check**: Uses `window.matchMedia` (synchronous, fast)
- **DOM update**: Single class toggle (very fast)

### System Preference Listening

- **Event listener**: Only active when mode is 'system'
- **Cleanup**: Properly removes listener on unmount or mode change
- **Performance**: Media query listeners are efficient

### State Updates

- **Resolved mode**: Computed with `useMemo` to avoid unnecessary recalculations
- **DOM updates**: Batched by React, only updates when mode or resolvedMode changes

## Edge Cases

### Invalid localStorage Values

If localStorage contains an invalid value:

- The hook defaults to 'system' mode
- The invalid value is overwritten on next mode change
- No errors are thrown

### Missing matchMedia Support

In environments where `window.matchMedia` is not available (rare, mostly in tests):

- The hook will still work for 'light' and 'dark' modes
- 'system' mode will default to light (or can be mocked in tests)
- See test setup for mock implementation

### Rapid Mode Changes

The hook handles rapid mode changes gracefully:

- State updates are batched by React
- DOM updates are efficient (single class toggle)
- No performance issues with rapid toggling

## Testing

The hook is tested with:

- **Initialization**: localStorage reading, default to 'system'
- **Mode setting**: setMode with all three modes
- **Toggle**: toggleDarkMode in various states
- **System preference**: Listening for system changes
- **DOM updates**: Class addition/removal
- **LocalStorage**: Persistence and retrieval
- **Edge cases**: Invalid values, missing matchMedia

See `useDarkMode.spec.ts` for comprehensive test coverage.

## Related

- [Header](../../components/layout/Header.tsx) - Component using useDarkMode for theme toggle
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode) - Tailwind CSS dark mode configuration
- [Media Query API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) - MDN documentation for matchMedia
