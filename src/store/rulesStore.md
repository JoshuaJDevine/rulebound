# rulesStore (Zustand State Management)

## Purpose

The `rulesStore` is the central state management solution for the Rule Bound application, built with Zustand. It manages hierarchical rules data, bookmarks, user preferences, and provides search functionality. The store uses a unified hierarchical data model (see [ADR-001: Hierarchical Data Model](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)) with an index pattern for O(1) lookups (see [ADR-002: Index Pattern for Lookups](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-002-index-pattern-for-lookups.md)) and selector methods for consistent data access (see [ADR-003: Selector Pattern for Computed Data](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-003-selector-pattern-for-computed-data.md)). The store includes persistence middleware to save bookmarks and preferences to localStorage, ensuring user data survives page refreshes and browser sessions.

## Usage

```tsx
import { useRulesStore } from "@/store/rulesStore";

function Component() {
  // Access state and actions
  const {
    rulesData,
    isLoading,
    error,
    bookmarks,
    preferences,
    getTopLevelSections,
    getRuleById,
    getChildRules,
    getReferencedBy,
    loadRules,
    addBookmark,
    removeBookmark,
    updatePreferences,
    addToRecentlyViewed,
    searchRules,
  } = useRulesStore();

  // Use selectors
  const topLevelSections = getTopLevelSections();
  const rule = getRuleById("103.1");

  // Use in component
  useEffect(() => {
    loadRules();
  }, [loadRules]);

  return <div>{/* Component JSX */}</div>;
}
```

## Store Structure

### State

| Property    | Type              | Description                                      |
| ----------- | ----------------- | ------------------------------------------------ |
| rulesData   | RulesData \| null | Hierarchical rules data (sections array + index) |
| isLoading   | boolean           | Loading state for async operations               |
| error       | Error \| null     | Error object if load failed                      |
| bookmarks   | Bookmark[]        | User's bookmarked rules                          |
| preferences | UserPreferences   | User preferences and settings                    |

### Selectors (Computed Getters)

The store provides selector methods for consistent data access (see [ADR-003: Selector Pattern](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-003-selector-pattern-for-computed-data.md)):

| Selector            | Signature                                | Description                                | Performance |
| ------------------- | ---------------------------------------- | ------------------------------------------ | ----------- |
| getTopLevelSections | () => RuleSection[]                      | Returns all top-level sections (level 0)   | O(n)        |
| getRuleById         | (id: string) => RuleSection \| undefined | Returns rule by ID (uses index)            | O(1)        |
| getChildRules       | (id: string) => RuleSection[]            | Returns all child rules of a parent        | O(k)        |
| getReferencedBy     | (id: string) => RuleSection[]            | Returns all rules that reference this rule | O(n)        |

### Actions

| Action              | Signature                                 | Description                              |
| ------------------- | ----------------------------------------- | ---------------------------------------- |
| loadRules           | () => Promise<void>                       | Loads rules from static JSON file        |
| addBookmark         | (ruleId: string, notes?: string) => void  | Adds rule to bookmarks                   |
| removeBookmark      | (ruleId: string) => void                  | Removes rule from bookmarks              |
| updatePreferences   | (prefs: Partial<UserPreferences>) => void | Updates user preferences                 |
| addToRecentlyViewed | (ruleId: string) => void                  | Tracks recently viewed rules (max 10)    |
| searchRules         | (query: string) => SearchResult[]         | Searches rules by number, title, content |

## RulesData Structure

The store uses a unified hierarchical data model:

```typescript
interface RulesData {
  version: string; // Version number (e.g., "1.2")
  lastUpdated: string; // ISO date string (e.g., "2025-12-01")
  sections: RuleSection[]; // Array of all rules (hierarchical)
  index: Record<string, RuleSection>; // O(1) lookup by ID (see ADR-002)
}
```

### RuleSection Type

All rules are represented as `RuleSection` objects (see [ADR-001: Hierarchical Data Model](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)):

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "000", "103.1.b.2")
  number: string; // Original rule number (e.g., "000.", "103.1.b.2.")
  title: string; // Extracted heading text
  content: string; // Full text content
  level: number; // 0=section, 1=rule, 2=detail, 3=sub-detail, etc.
  parentId?: string; // Reference to parent rule ID
  children: string[]; // IDs of child rules
  crossRefs: string[]; // IDs of referenced rules
  version: string; // Version number (e.g., "1.2")
}
```

**Hierarchy Levels:**

- **Level 0**: Top-level sections (e.g., "100. Combat")
- **Level 1**: Rules (e.g., "103. Attack Resolution")
- **Level 2**: Sub-rules (e.g., "103.1. Declare Target")
- **Level 3+**: Details (e.g., "103.1.a. Critical Hit Timing")

## Index Pattern

The store uses an index pattern for O(1) rule lookups (see [ADR-002: Index Pattern](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-002-index-pattern-for-lookups.md)):

- **Index Structure**: `Record<string, RuleSection>` mapping rule IDs to rule objects
- **Auto-Building**: Index is built automatically if missing from loaded data
- **Performance**: O(1) lookups instead of O(n) array searches
- **Use Case**: Critical for breadcrumb rendering (multiple parent lookups), navigation, and cross-references

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
  rule: RuleSection; // Matched rule
  score: number; // Relevance score (higher is better)
  matches: SearchMatch[]; // Where the search term matched
}

interface SearchMatch {
  field: "number" | "title" | "content";
  snippet: string; // Text snippet with match
  position: number; // Character position
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

### Using Selectors

```tsx
function HomePage() {
  const { getTopLevelSections } = useRulesStore();
  const navigate = useNavigate();

  // Get top-level sections for home page
  const sections = getTopLevelSections();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          onClick={(id) => navigate(`/rules/${id}`)}
        />
      ))}
    </div>
  );
}

function RuleDetailPage({ ruleId }: { ruleId: string }) {
  const { getRuleById, getChildRules, getReferencedBy } = useRulesStore();

  // O(1) lookup using index
  const rule = getRuleById(ruleId);

  // Get child rules
  const childRules = getChildRules(ruleId);

  // Get rules that reference this rule
  const referencedBy = getReferencedBy(ruleId);

  if (!rule) {
    return <ErrorMessage title="Rule Not Found" />;
  }

  return (
    <div>
      <h1>
        {rule.number} {rule.title}
      </h1>
      <p>{rule.content}</p>

      {childRules.length > 0 && (
        <section>
          <h2>Sub-rules</h2>
          {childRules.map((child) => (
            <RuleCard key={child.id} rule={child} />
          ))}
        </section>
      )}

      {referencedBy.length > 0 && (
        <section>
          <h2>Referenced By</h2>
          {referencedBy.map((ref) => (
            <RuleCard key={ref.id} rule={ref} />
          ))}
        </section>
      )}
    </div>
  );
}
```

### Bookmarking Rules

```tsx
function RuleDetail({ rule }: { rule: RuleSection }) {
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
  const { bookmarks, getRuleById } = useRulesStore();
  const navigate = useNavigate();

  // Get bookmarked rules using selector
  const bookmarkedRules = bookmarks
    .map((bookmark) => ({
      rule: getRuleById(bookmark.ruleId),
      timestamp: bookmark.timestamp,
      notes: bookmark.notes,
    }))
    .filter((item) => item.rule); // Filter out missing rules

  return (
    <div>
      <h1>My Bookmarks</h1>
      {bookmarkedRules.map(({ rule, timestamp, notes }) => (
        <div key={rule!.id}>
          <RuleCard rule={rule!} />
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
  const { preferences, getRuleById, addToRecentlyViewed } = useRulesStore();

  // Display recently viewed
  const recentRules = preferences.recentlyViewed
    .map((id) => getRuleById(id))
    .filter((r): r is RuleSection => r !== undefined)
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

// Track recently viewed when viewing a rule
function RuleDetailPage({ ruleId }: { ruleId: string }) {
  const { addToRecentlyViewed } = useRulesStore();

  useEffect(() => {
    addToRecentlyViewed(ruleId);
  }, [ruleId, addToRecentlyViewed]);

  // ... rest of component
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
            {matches.map((match, index) => (
              <span key={index} className="text-xs text-neutral-500">
                {match.field}: {match.snippet}
              </span>
            ))}
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
              fontSize: e.target.value as "small" | "medium" | "large",
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
  return <div>{store.rulesData?.sections.length}</div>;
}

// ✅ Good - subscribes only to rulesData
function Component() {
  const rulesData = useRulesStore((state) => state.rulesData);
  return <div>{rulesData?.sections.length}</div>;
}

// ✅ Good - subscribes only to specific selector
function Component() {
  const getTopLevelSections = useRulesStore(
    (state) => state.getTopLevelSections,
  );
  const sections = getTopLevelSections();
  return <div>{sections.length}</div>;
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
**Not Persisted**: rulesData, isLoading, error (loaded fresh each session)

### Loading Rules

The `loadRules` action:

1. Sets `isLoading` to `true`
2. Fetches `/data/rules.json`
3. Parses JSON as `RulesData`
4. **Builds index if missing** (backward compatibility)
5. Sets `rulesData` and `isLoading` to `false`

```typescript
loadRules: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await fetch("/data/rules.json");
    if (!response.ok) {
      throw new Error("Failed to load rules");
    }
    const data: RulesData = await response.json();

    // Ensure index is populated if not present (backward compatibility)
    if (!data.index || Object.keys(data.index).length === 0) {
      data.index = {};
      for (const section of data.sections) {
        data.index[section.id] = section;
      }
    }

    set({
      rulesData: data,
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

### Selector Implementation

#### getTopLevelSections

Filters sections array for level 0:

```typescript
getTopLevelSections: (): RuleSection[] => {
  const { rulesData } = get();
  if (!rulesData) return [];
  return rulesData.sections.filter((rule) => rule.level === 0);
};
```

#### getRuleById

Uses index for O(1) lookup:

```typescript
getRuleById: (id: string): RuleSection | undefined => {
  const { rulesData } = get();
  if (!rulesData) return undefined;
  return rulesData.index[id]; // O(1) lookup
};
```

#### getChildRules

Resolves child IDs using index:

```typescript
getChildRules: (id: string): RuleSection[] => {
  const { rulesData, getRuleById } = get();
  if (!rulesData) return [];
  const rule = getRuleById(id);
  if (!rule) return [];
  return rule.children
    .map((childId) => getRuleById(childId))
    .filter((r): r is RuleSection => r !== undefined);
};
```

#### getReferencedBy

Filters sections array for cross-references:

```typescript
getReferencedBy: (id: string): RuleSection[] => {
  const { rulesData } = get();
  if (!rulesData) return [];
  return rulesData.sections.filter((rule) => rule.crossRefs.includes(id));
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

The search algorithm searches in rule number, title, and content with weighted scoring:

```typescript
searchRules: (query: string): SearchResult[] => {
  const { rulesData } = get();
  if (!rulesData) return [];

  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const rule of rulesData.sections) {
    const matches: SearchResult["matches"] = [];
    let score = 0;

    // Search in rule number (weight: 15)
    if (rule.number.toLowerCase().includes(lowerQuery)) {
      score += 15;
      matches.push({
        field: "number",
        snippet: rule.number,
        position: rule.number.toLowerCase().indexOf(lowerQuery),
      });
    }

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

    if (matches.length > 0) {
      results.push({ rule, score, matches });
    }
  }

  // Sort by score (highest first)
  return results.sort((a, b) => b.score - a.score);
};
```

**Search Weights:**

- Rule number: 15 (highest priority - exact rule matches)
- Title: 10 (high priority - rule names)
- Content: 5 (lower priority - rule text)

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

### Using Selectors

Always use selector methods instead of accessing `rulesData` directly:

```tsx
// ✅ Good - use selector
const rule = getRuleById(ruleId);

// ❌ Bad - access rulesData directly
const rule = rulesData?.sections.find((r) => r.id === ruleId);
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
function useRule(ruleId: string): RuleSection | undefined {
  const getRuleById = useRulesStore((state) => state.getRuleById);
  return getRuleById(ruleId);
}

// Usage
function RuleCard({ ruleId }: { ruleId: string }) {
  const rule = useRule(ruleId);
  const isBookmarked = useIsBookmarked(ruleId);

  if (!rule) return null;

  return <div>{/* render rule */}</div>;
}
```

## Testing

The store has 100% test coverage with 52 tests covering:

### State Initialization

- ✅ Initial state values
- ✅ Default preferences

### Loading Rules

- ✅ Successful load
- ✅ Error handling
- ✅ Loading state management
- ✅ Index building (if missing)

### Selectors

- ✅ getTopLevelSections
- ✅ getRuleById (O(1) lookup)
- ✅ getChildRules
- ✅ getReferencedBy

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

- ✅ Number matching (high priority)
- ✅ Title matching
- ✅ Content matching
- ✅ Score calculation
- ✅ Result sorting
- ✅ Empty query handling
- ✅ Case insensitivity

### Preferences

- ✅ Update preferences
- ✅ Partial updates
- ✅ Merge behavior

## Performance Considerations

### Index Pattern Benefits

The index pattern provides O(1) lookups:

- **Breadcrumb Rendering**: Multiple parent lookups per page load (critical)
- **Rule Detail Pages**: Fast rule lookup by ID
- **Navigation**: Quick child rule resolution
- **Cross-References**: Efficient reference resolution

### Selector Pattern Benefits

Selector methods provide:

- **Consistent API**: All data access through selectors
- **Performance**: Can optimize internally (use index)
- **Loose Coupling**: Components don't know data structure
- **Future-Proof**: Easy to add caching/memoization

### Selective State Access

Use selectors to prevent unnecessary re-renders:

```tsx
// ❌ Component re-renders on ANY store change
const { rulesData, bookmarks } = useRulesStore();

// ✅ Component re-renders only when rulesData changes
const rulesData = useRulesStore((state) => state.rulesData);

// ✅ Component re-renders only when selector result changes (better)
const getRuleById = useRulesStore((state) => state.getRuleById);
const rule = getRuleById(ruleId);
```

### Memoization

Search function should be memoized:

```tsx
const searchRules = useRulesStore((state) => state.searchRules);
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
          "ruleId": "103.1",
          "timestamp": 1704067200000,
          "notes": "Important for combat"
        }
      ],
      "preferences": {
        "theme": "light",
        "fontSize": "medium",
        "highContrast": false,
        "reducedMotion": false,
        "recentlyViewed": ["103.1", "100.2"]
      }
    },
    "version": 0
  }
}
```

## Related

- [RuleCard](../components/common/RuleCard.md) - Uses `getRuleById` selector
- [SectionCard](../components/common/SectionCard.md) - Uses `getTopLevelSections` selector
- [RuleTree](../components/common/RuleTree.md) - Uses `getRuleById` and `getChildRules` selectors
- [ADR-001: Hierarchical Data Model](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md) - Unified RuleSection type design
- [ADR-002: Index Pattern for Lookups](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-002-index-pattern-for-lookups.md) - O(1) lookup pattern
- [ADR-003: Selector Pattern for Computed Data](../../.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-003-selector-pattern-for-computed-data.md) - Selector method pattern
- [ADR-004: State Management](../../.cursor/features/active/setup-project/adr/ADR-004-state-management.md) - Zustand choice rationale
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
9. **Selector Caching**: Add memoization to selectors for better performance
10. **Virtual Scrolling**: Support for very large rule sets (1000+ rules)