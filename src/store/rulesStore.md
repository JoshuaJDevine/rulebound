# rulesStore (Zustand State Management)

## Purpose

The `rulesStore` is the central state management solution for the Rule Bound application, built with Zustand. It manages rules data, sections, bookmarks, user preferences, and provides search functionality. The store includes persistence middleware to save bookmarks and preferences to localStorage, ensuring user data survives page refreshes and browser sessions.

## Usage

```tsx
import { useRulesStore } from "@/store/rulesStore";

function Component() {
  // Access state and actions
  const {
    rules,
    sections,
    isLoading,
    error,
    bookmarks,
    loadRules,
    addBookmark,
    searchRules,
  } = useRulesStore();

  // Use in component
  useEffect(() => {
    loadRules();
  }, [loadRules]);

  return <div>{/* Component JSX */}</div>;
}
```

## Store Structure

### State

| Property    | Type            | Description                         |
| ----------- | --------------- | ----------------------------------- |
| rules       | Rule[]          | Array of all rules loaded from JSON |
| sections    | Section[]       | Array of sections loaded from JSON  |
| isLoading   | boolean         | Loading state for async operations  |
| error       | Error \| null   | Error object if load failed         |
| bookmarks   | Bookmark[]      | User's bookmarked rules             |
| preferences | UserPreferences | User preferences and settings       |

### Actions

| Action              | Signature                                 | Description                            |
| ------------------- | ----------------------------------------- | -------------------------------------- |
| loadRules           | () => Promise<void>                       | Loads rules from static JSON file      |
| addBookmark         | (ruleId: string, notes?: string) => void  | Adds rule to bookmarks                 |
| removeBookmark      | (ruleId: string) => void                  | Removes rule from bookmarks            |
| updatePreferences   | (prefs: Partial<UserPreferences>) => void | Updates user preferences               |
| addToRecentlyViewed | (ruleId: string) => void                  | Tracks recently viewed rules (max 10)  |
| searchRules         | (query: string) => SearchResult[]         | Searches rules by title, content, tags |

## Type Definitions

### Bookmark

```typescript
interface Bookmark {
  ruleId: string; // ID of bookmarked rule
  timestamp: number; // When bookmark was created (Date.now())
  notes?: string; // Optional user notes
}
```

### UserPreferences

```typescript
interface UserPreferences {
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  reducedMotion: boolean;
  bookmarks: Bookmark[]; // Redundant with store.bookmarks (for persistence)
  recentlyViewed: string[]; // Array of rule IDs (max 10, newest first)
}
```

### SearchResult

```typescript
interface SearchResult {
  rule: Rule;
  score: number;
  matches: Array<{
    field: "title" | "content" | "tags";
    snippet: string;
    position: number;
  }>;
}
```

## Examples

### Loading Rules

```tsx
function App() {
  const { loadRules, isLoading, error } = useRulesStore();

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  if (isLoading) return <LoadingSpinner variant="page" />;
  if (error)
    return <ErrorMessage title="Failed to Load" message={error.message} />;

  return <AppContent />;
}
```

### Bookmarking Rules

```tsx
function RuleDetail({ rule }) {
  const { bookmarks, addBookmark, removeBookmark } = useRulesStore();
  const isBookmarked = bookmarks.some((b) => b.ruleId === rule.id);

  const handleToggle = () => {
    if (isBookmarked) {
      removeBookmark(rule.id);
    } else {
      addBookmark(rule.id, "Important rule!");
    }
  };

  return (
    <div>
      <h1>{rule.title}</h1>
      <button onClick={handleToggle}>
        {isBookmarked ? "Remove Bookmark" : "Bookmark"}
      </button>
    </div>
  );
}
```

### Displaying Bookmarks

```tsx
function BookmarksPage() {
  const { bookmarks, rules } = useRulesStore();

  const bookmarkedRules = bookmarks
    .map((bookmark) => ({
      rule: rules.find((r) => r.id === bookmark.ruleId),
      timestamp: bookmark.timestamp,
      notes: bookmark.notes,
    }))
    .filter((item) => item.rule); // Filter out missing rules

  return (
    <div>
      <h1>My Bookmarks</h1>
      {bookmarkedRules.map(({ rule, timestamp, notes }) => (
        <div key={rule.id}>
          <RuleCard rule={rule} showTimestamp timestamp={timestamp} />
          {notes && <p className="text-sm">{notes}</p>}
        </div>
      ))}
    </div>
  );
}
```

### Recently Viewed

```tsx
function RecentlyViewed() {
  const { preferences, rules, addToRecentlyViewed } = useRulesStore();

  // When viewing a rule
  useEffect(() => {
    addToRecentlyViewed(currentRuleId);
  }, [currentRuleId, addToRecentlyViewed]);

  // Display recently viewed
  const recentRules = preferences.recentlyViewed
    .map((id) => rules.find((r) => r.id === id))
    .filter(Boolean)
    .slice(0, 5); // Show top 5

  return (
    <div>
      <h2>Recently Viewed</h2>
      {recentRules.map((rule) => (
        <RuleCard key={rule.id} rule={rule} />
      ))}
    </div>
  );
}
```

### Searching Rules

```tsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const searchRules = useRulesStore((state) => state.searchRules);

  const results = useMemo(() => searchRules(query), [query, searchRules]);

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
      />

      {results.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Results"
          description={`No rules found for "${query}"`}
        />
      ) : (
        results.map(({ rule, score, matches }) => (
          <div key={rule.id}>
            <RuleCard rule={rule} />
            <p className="text-xs">Score: {score}</p>
          </div>
        ))
      )}
    </div>
  );
}
```

### Updating Preferences

```tsx
function SettingsPage() {
  const { preferences, updatePreferences } = useRulesStore();

  return (
    <div>
      <h1>Settings</h1>

      <label>
        <input
          type="checkbox"
          checked={preferences.highContrast}
          onChange={(e) =>
            updatePreferences({
              highContrast: e.target.checked,
            })
          }
        />
        High Contrast Mode
      </label>

      <label>
        Font Size
        <select
          value={preferences.fontSize}
          onChange={(e) =>
            updatePreferences({
              fontSize: e.target.value as any,
            })
          }
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    </div>
  );
}
```

### Selective State Access (Performance Optimization)

```tsx
// ❌ Bad - subscribes to entire store
function Component() {
  const store = useRulesStore();
  return <div>{store.rules.length}</div>;
}

// ✅ Good - subscribes only to rules
function Component() {
  const rules = useRulesStore((state) => state.rules);
  return <div>{rules.length}</div>;
}

// ✅ Good - subscribes only to specific action
function Component() {
  const addBookmark = useRulesStore((state) => state.addBookmark);
  return <button onClick={() => addBookmark("rule-123")}>Bookmark</button>;
}
```

## Implementation Details

### Persistence Configuration

```typescript
persist(
  (set, get) => ({
    /* state and actions */
  }),
  {
    name: "rulebound-storage", // localStorage key
    partialize: (state) => ({
      bookmarks: state.bookmarks,
      preferences: state.preferences,
    }),
  },
);
```

**Persisted**: bookmarks, preferences
**Not Persisted**: rules, sections, isLoading, error (loaded fresh each session)

### Loading Rules

```typescript
loadRules: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await fetch("/data/rules.json");
    if (!response.ok) {
      throw new Error("Failed to load rules");
    }
    const data = await response.json();
    set({
      rules: data.rules || [],
      sections: data.sections || [],
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error as Error,
      isLoading: false,
    });
  }
};
```

### Bookmark Management

```typescript
addBookmark: (ruleId: string, notes?: string) => {
  const { bookmarks } = get();
  if (bookmarks.find((b) => b.ruleId === ruleId)) {
    return; // Already bookmarked (no duplicates)
  }
  const newBookmark: Bookmark = {
    ruleId,
    timestamp: Date.now(),
    notes,
  };
  set({ bookmarks: [...bookmarks, newBookmark] });
};

removeBookmark: (ruleId: string) => {
  const { bookmarks } = get();
  set({ bookmarks: bookmarks.filter((b) => b.ruleId !== ruleId) });
};
```

### Recently Viewed Management

```typescript
addToRecentlyViewed: (ruleId: string) => {
  const { preferences } = get();
  const recentlyViewed = preferences.recentlyViewed.filter(
    (id) => id !== ruleId,
  );
  recentlyViewed.unshift(ruleId); // Add to front
  const trimmed = recentlyViewed.slice(0, 10); // Keep only 10
  set({
    preferences: {
      ...preferences,
      recentlyViewed: trimmed,
    },
  });
};
```

### Search Algorithm

```typescript
searchRules: (query: string): SearchResult[] => {
  const { rules } = get();
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return [];

  const results: SearchResult[] = [];

  for (const rule of rules) {
    const matches: SearchResult["matches"] = [];
    let score = 0;

    // Search in title (weight: 10)
    if (rule.title.toLowerCase().includes(lowerQuery)) {
      score += 10;
      matches.push({
        field: "title",
        snippet: rule.title,
        position: rule.title.toLowerCase().indexOf(lowerQuery),
      });
    }

    // Search in content (weight: 5)
    if (rule.content.toLowerCase().includes(lowerQuery)) {
      score += 5;
      const index = rule.content.toLowerCase().indexOf(lowerQuery);
      const start = Math.max(0, index - 50);
      const end = Math.min(rule.content.length, index + lowerQuery.length + 50);
      const snippet =
        (start > 0 ? "..." : "") +
        rule.content.slice(start, end) +
        (end < rule.content.length ? "..." : "");
      matches.push({
        field: "content",
        snippet,
        position: index,
      });
    }

    // Search in tags (weight: 3)
    for (const tag of rule.tags) {
      if (tag.toLowerCase().includes(lowerQuery)) {
        score += 3;
        matches.push({
          field: "tags",
          snippet: tag,
          position: 0,
        });
      }
    }

    if (matches.length > 0) {
      results.push({ rule, score, matches });
    }
  }

  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
};
```

## Design Patterns

### Initialization

```tsx
function App() {
  const loadRules = useRulesStore((state) => state.loadRules);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  return <AppContent />;
}
```

### Derived State

```tsx
// Get bookmarked rules
const bookmarkedRules = useRulesStore((state) =>
  state.bookmarks
    .map((b) => state.rules.find((r) => r.id === b.ruleId))
    .filter(Boolean),
);

// Get rules by section
const sectionRules = useRulesStore((state) =>
  state.rules.filter((r) => r.section === sectionId),
);
```

### Custom Hooks

```tsx
// Hook for bookmark status
function useIsBookmarked(ruleId: string): boolean {
  return useRulesStore((state) =>
    state.bookmarks.some((b) => b.ruleId === ruleId),
  );
}

// Hook for specific rule
function useRule(ruleId: string): Rule | undefined {
  return useRulesStore((state) => state.rules.find((r) => r.id === ruleId));
}

// Usage
function RuleCard({ ruleId }) {
  const rule = useRule(ruleId);
  const isBookmarked = useIsBookmarked(ruleId);

  if (!rule) return null;

  return <div>{/* render rule */}</div>;
}
```

## Testing

The store has 100% test coverage with 40 tests covering:

### State Initialization

- ✅ Initial state values
- ✅ Default preferences

### Loading Rules

- ✅ Successful load
- ✅ Error handling
- ✅ Loading state management

### Bookmarks

- ✅ Add bookmark
- ✅ Remove bookmark
- ✅ Duplicate prevention
- ✅ Bookmark with notes

### Recently Viewed

- ✅ Add to recently viewed
- ✅ Move to front if exists
- ✅ Limit to 10 items
- ✅ Order preservation

### Search

- ✅ Title matching
- ✅ Content matching
- ✅ Tag matching
- ✅ Score calculation
- ✅ Result sorting
- ✅ Empty query handling
- ✅ Case insensitivity
- ✅ Special characters

### Preferences

- ✅ Update preferences
- ✅ Partial updates
- ✅ Merge behavior

## Performance Considerations

### Selector Pattern

Use selectors to prevent unnecessary re-renders:

```tsx
// ❌ Component re-renders on ANY store change
const { rules, sections, bookmarks } = useRulesStore();

// ✅ Component re-renders only when rules change
const rules = useRulesStore((state) => state.rules);
```

### Memoization

Search function should be memoized:

```tsx
const results = useMemo(() => searchRules(query), [query, searchRules]);
```

### Persistence

localStorage operations are synchronous but fast. For very large bookmark lists, consider:

- Debouncing writes
- IndexedDB for large datasets
- Compression for stored data

## LocalStorage Structure

```json
{
  "rulebound-storage": {
    "state": {
      "bookmarks": [
        {
          "ruleId": "rule-123",
          "timestamp": 1704067200000,
          "notes": "Important for combat"
        }
      ],
      "preferences": {
        "theme": "light",
        "fontSize": "medium",
        "highContrast": false,
        "reducedMotion": false,
        "recentlyViewed": ["rule-123", "rule-456"]
      }
    },
    "version": 0
  }
}
```

## Related

- [BookmarkButton](../components/common/BookmarkButton.md) - Uses bookmark actions
- [SearchPage](../pages/SearchPage/SearchPage.md) - Uses search functionality
- [BookmarksPage](../pages/BookmarksPage/BookmarksPage.md) - Displays bookmarks
- [ADR-004: State Management](../../.cursor/features/active/setup-project/adr/ADR-004-state-management.md) - Explains Zustand choice
- [Zustand Documentation](https://github.com/pmndrs/zustand) - Library documentation

## Migration & Future Enhancements

### Potential Improvements

1. **Search Enhancement**: Add fuzzy matching with libraries like Fuse.js
2. **Bookmark Notes**: Add full CRUD operations for bookmark notes
3. **Bookmark Folders**: Organize bookmarks into folders/categories
4. **Export/Import**: Allow users to export/import bookmarks
5. **Sync**: Cloud sync for bookmarks across devices
6. **Offline Support**: Service worker integration
7. **Search History**: Track and display recent searches
8. **Bookmark Sharing**: Generate shareable bookmark URLs
