# Architect: Update Rules Data Structure and Project Architecture

## Overview

This feature refactors the core data model and state management architecture to better align with the hierarchical nature of the Riftbound Core Rules document. The changes transition from a flat, artificially separated data structure to a unified hierarchical model with optimized data access patterns.

**Key Architectural Changes:**

1. Unified hierarchical `RuleSection` data model (replaces separate Rule/Section types)
2. Index pattern for O(1) rule lookups
3. Selector pattern for consistent data access
4. Updated routing structure to support hierarchical navigation

## Architecture Decisions

Three Architecture Decision Records (ADRs) document the key decisions:

### [ADR-001: Hierarchical Data Model](./adr/ADR-001-hierarchical-data-model.md)

**Decision**: Use a unified `RuleSection` type to represent all rules and sections hierarchically.

**Rationale**:

- Matches the natural structure of the RPG rules document
- Eliminates artificial separation between rules and sections
- Directly maps to parser output (no transformation needed)
- Supports arbitrary nesting levels (sections → rules → sub-rules → details)

**Impact**: All components now work with `RuleSection` instead of separate `Rule`/`Section` types.

### [ADR-002: Index Pattern for O(1) Rule Lookups](./adr/ADR-002-index-pattern-for-lookups.md)

**Decision**: Maintain a `Record<string, RuleSection>` index alongside the sections array for fast lookups.

**Rationale**:

- Enables O(1) lookups by ID instead of O(n) array searches
- Critical for breadcrumb rendering (multiple parent lookups)
- Improves performance for navigation and cross-references
- Minimal memory overhead

**Impact**: Store loads data into both array and index; all lookups use the index.

### [ADR-003: Selector Pattern for Computed Data Access](./adr/ADR-003-selector-pattern-for-computed-data.md)

**Decision**: Provide selector methods in the store instead of exposing raw data.

**Rationale**:

- Centralizes query logic (avoid duplication across components)
- Hides internal data structure from components
- Enables optimization (use index internally)
- Consistent API for data access

**Impact**: Components use selectors like `getRuleById()` instead of direct array access.

## System Design

### Data Model

The core data structure is `RulesData` containing hierarchical `RuleSection` entities:

```typescript
interface RulesData {
  version: string; // e.g., "1.2"
  lastUpdated: string; // e.g., "2025-12-01"
  sections: RuleSection[]; // All rules (flat array for iteration)
  index: Record<string, RuleSection>; // ID → Rule map for O(1) lookup
}

interface RuleSection {
  id: string; // e.g., "103.1.a.2"
  number: string; // e.g., "103.1.a.2."
  title: string; // Rule heading
  content: string; // Full text content
  level: number; // 0=section, 1=rule, 2=detail, etc.
  parentId?: string; // Parent rule ID
  children: string[]; // Child rule IDs
  crossRefs: string[]; // Referenced rule IDs
  version: string; // Rules version
}
```

**Hierarchy Levels:**

- Level 0: Top-level sections (e.g., "100. Combat")
- Level 1: Main rules (e.g., "103. Attack Resolution")
- Level 2+: Sub-rules and details (e.g., "103.1.a.2. Critical Hit Timing")

**Relationships:**

- `parentId`: References parent in hierarchy (for breadcrumbs)
- `children`: Array of child IDs (for navigation trees)
- `crossRefs`: Related rules mentioned in content (for "See Also" links)

### State Management Architecture

The Zustand store provides a clean API with three layers:

```typescript
interface RulesStore {
  // 1. STATE - Raw data
  rulesData: RulesData | null;
  isLoading: boolean;
  error: Error | null;
  bookmarks: Bookmark[];
  preferences: UserPreferences;

  // 2. SELECTORS - Computed getters
  getTopLevelSections: () => RuleSection[];
  getRuleById: (id: string) => RuleSection | undefined;
  getChildRules: (id: string) => RuleSection[];
  getReferencedBy: (id: string) => RuleSection[];

  // 3. ACTIONS - State mutations
  loadRules: () => Promise<void>;
  addBookmark: (ruleId: string, notes?: string) => void;
  removeBookmark: (ruleId: string) => void;
  searchRules: (query: string) => SearchResult[];
}
```

**Key Selectors:**

1. **`getTopLevelSections()`** - Returns level 0 sections for home page

   ```typescript
   return rulesData.sections.filter((r) => r.level === 0);
   ```

2. **`getRuleById(id)`** - O(1) lookup using index

   ```typescript
   return rulesData.index[id];
   ```

3. **`getChildRules(id)`** - Resolves child IDs to full rules

   ```typescript
   const rule = getRuleById(id);
   return rule.children.map((id) => getRuleById(id)).filter(Boolean);
   ```

4. **`getReferencedBy(id)`** - Finds rules that reference this rule
   ```typescript
   return rulesData.sections.filter((r) => r.crossRefs.includes(id));
   ```

### Component Structure Updates

Components have been updated to work with the hierarchical model:

#### **RuleCard** (`src/components/common/RuleCard.tsx`)

- Accepts `RuleSection` instead of `Rule`
- Displays rule number, title, and hierarchy level
- Shows child count instead of section name
- Provides visual depth cues for hierarchy

#### **SectionCard** (`src/components/common/SectionCard.tsx`)

- Accepts `RuleSection` (level 0 only)
- Displays section number and title
- Shows count of direct children

#### **RuleTree** (`src/components/common/RuleTree.tsx`) - NEW

- Renders hierarchical tree navigation
- Supports expand/collapse
- Keyboard navigation (arrow keys)
- WCAG-compliant tree role/aria attributes

### Routing Structure

Updated routes to support hierarchical navigation:

```typescript
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },              // Sections browser
      { path: "/rules/:id", element: <RuleDetailPage /> }, // Hierarchical detail
      { path: "/search", element: <SearchPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
    ],
  },
]);
```

**Changes:**

- Removed `/rules` list page (replaced by hierarchical home page)
- Single `/rules/:id` route handles all levels (sections, rules, sub-rules)
- Navigation flows: Home → Section → Rule → Sub-rule (all use same detail page)

### Data Flow

```
┌─────────────┐
│ rules.json  │  (RulesData with sections array + index)
└──────┬──────┘
       │ HTTP GET
       ▼
┌─────────────────────┐
│ rulesStore          │
│  loadRules()        │  Build index if missing
│  ├─ sections[]      │  ← For iteration
│  └─ index{}         │  ← For O(1) lookup
└──────┬──────────────┘
       │
       │ Selectors (getters)
       ▼
┌─────────────────────┐
│ Components          │
│  ├─ HomePage        │  → getTopLevelSections()
│  ├─ RuleDetailPage  │  → getRuleById(), getChildRules()
│  ├─ SearchPage      │  → searchRules()
│  └─ BookmarksPage   │  → getRuleById()
└─────────────────────┘
```

## Technology Choices

No new libraries were introduced. The refactor uses existing tech:

- **React 18** - Component rendering
- **TypeScript** - Type safety for new data model
- **Zustand** - State management with persist middleware
- **React Router** - Navigation with hierarchical routes
- **Tailwind CSS** - Styling (unchanged)

## API/Service Boundaries

### Store API (Public Interface)

```typescript
// Selectors (read operations)
getTopLevelSections(): RuleSection[]
getRuleById(id: string): RuleSection | undefined
getChildRules(id: string): RuleSection[]
getReferencedBy(id: string): RuleSection[]

// Actions (write operations)
loadRules(): Promise<void>
searchRules(query: string): SearchResult[]
addBookmark(ruleId: string, notes?: string): void
removeBookmark(ruleId: string): void
addToRecentlyViewed(ruleId: string): void
```

### Component Contracts

Components receive `RuleSection` props and use store selectors:

```typescript
// Card components
<RuleCard rule={section} onClick={() => navigate(`/rules/${section.id}`)} />
<SectionCard section={section} onClick={(id) => navigate(`/rules/${id}`)} />

// Tree navigation
<RuleTree
  rootRuleId={id}
  rulesMap={new Map(Object.entries(rulesData.index))}
/>
```

## Diagrams

### Data Model Hierarchy

```
RulesData
├─ version: "1.2"
├─ lastUpdated: "2025-12-01"
├─ sections: RuleSection[]
│   ├─ [0] RuleSection (level 0) "Combat"
│   │   ├─ children: ["103", "104", ...]
│   │   └─ crossRefs: []
│   ├─ [1] RuleSection (level 1) "103. Attack Resolution"
│   │   ├─ parentId: "100"
│   │   ├─ children: ["103.1", "103.2"]
│   │   └─ crossRefs: ["104", "200"]
│   └─ [2] RuleSection (level 2) "103.1. Declare Target"
│       ├─ parentId: "103"
│       ├─ children: ["103.1.a", "103.1.b"]
│       └─ crossRefs: []
└─ index: Record<string, RuleSection>
    ├─ "100": RuleSection (reference to sections[0])
    ├─ "103": RuleSection (reference to sections[1])
    └─ "103.1": RuleSection (reference to sections[2])
```

### Component Data Flow

```
HomePage
  ↓ getTopLevelSections()
  [Level 0 Sections]
  ↓ Click Section
  navigate(`/rules/${sectionId}`)
  ↓
RuleDetailPage (id = section)
  ↓ getRuleById(id)
  ↓ getChildRules(id)
  Display: Section title, content, child rules
  ↓ Click Child Rule
  navigate(`/rules/${childId}`)
  ↓
RuleDetailPage (id = child)
  ↓ getRuleById(id)
  ↓ getChildRules(id)
  Display: Rule title, content, sub-rules
  ... (continues recursively)
```

### State Management Layers

```
┌─────────────────────────────────────┐
│ Components (UI Layer)               │
│  - HomePage, RuleDetailPage, etc.   │
└────────────┬────────────────────────┘
             │ useRulesStore()
             ▼
┌─────────────────────────────────────┐
│ Selectors (Query Layer)             │
│  - getTopLevelSections()            │
│  - getRuleById()                    │
│  - getChildRules()                  │
│  - getReferencedBy()                │
└────────────┬────────────────────────┘
             │ Access rulesData.index
             ▼
┌─────────────────────────────────────┐
│ State (Data Layer)                  │
│  - rulesData: RulesData | null      │
│    - sections: RuleSection[]        │
│    - index: Record<string, Rule>    │
└────────────┬────────────────────────┘
             │ loadRules()
             ▼
┌─────────────────────────────────────┐
│ Data Source (JSON File)             │
│  - public/data/rules.json           │
└─────────────────────────────────────┘
```

## Migration Impact

### Files Modified

**Type Definitions:**

- `src/types/index.ts` - Moved `RuleSection` and `RulesData` to primary position, updated `RulesStore` interface

**Store:**

- `src/store/rulesStore.ts` - Refactored to use `rulesData` state, added selectors, updated search logic

**Components:**

- `src/components/common/RuleCard.tsx` - Updated to use `RuleSection`, show hierarchy
- `src/components/common/SectionCard.tsx` - Updated to use `RuleSection` (level 0)
- `src/components/common/RuleTree.tsx` - NEW hierarchical tree component
- `src/components/common/index.ts` - Export `RuleTree`

**Pages:**

- `src/pages/HomePage/HomePage.tsx` - Use `getTopLevelSections()` selector
- `src/pages/RulesListPage/RulesListPage.tsx` - Use `getRuleById()`, show hierarchy
- `src/pages/RuleDetailPage/RuleDetailPage.tsx` - Use `getRuleById()`, `getChildRules()`
- `src/pages/SearchPage/SearchPage.tsx` - Updated for new search results
- `src/pages/BookmarksPage/BookmarksPage.tsx` - Use `getRuleById()` selector

**Routes:**

- `src/routes/index.tsx` - Updated route structure for hierarchical navigation

### Data Migration

**JSON File Structure:**
The `public/data/rules.json` file now uses the `RulesData` format:

```json
{
  "version": "1.2",
  "lastUpdated": "2025-12-01",
  "sections": [
    {
      "id": "000",
      "number": "000.",
      "title": "Golden and Silver Rules",
      "content": "...",
      "level": 0,
      "children": ["001", "002"],
      "crossRefs": [],
      "version": "1.2"
    }
  ],
  "index": {
    "000": {
      /* ... */
    }
  }
}
```

**Backward Compatibility:**
The store's `loadRules()` builds the index if missing, so the JSON can omit it:

```typescript
if (!data.index || Object.keys(data.index).length === 0) {
  data.index = {};
  for (const section of data.sections) {
    data.index[section.id] = section;
  }
}
```

## Accessibility Considerations

All architectural decisions support WCAG 2.1 AA compliance:

1. **Hierarchical Navigation**: The `RuleTree` component uses proper ARIA roles (`tree`, `treeitem`, `group`)
2. **Keyboard Support**: Tree navigation supports arrow keys, Enter, and Space
3. **Semantic Structure**: Hierarchy levels map to `aria-level` attributes
4. **Screen Reader Support**: Rule numbers and titles are properly announced
5. **Focus Management**: Consistent focus behavior in navigation components

The architecture enables accessible patterns rather than hindering them.

## Performance Characteristics

**Lookup Operations:**

- Get rule by ID: O(1) via index
- Get top-level sections: O(n) filter (once per page load)
- Get child rules: O(k) where k = number of children (uses index)
- Search: O(n) scan of all rules (acceptable for 100s-1000s of rules)

**Memory:**

- Index adds ~8 bytes per rule (object reference)
- For 1000 rules: ~8KB overhead (negligible)

**Rendering:**

- Components re-render only when relevant data changes
- Selectors compute on each call (no memoization yet, but can be added)

## Future Enhancements

The architecture supports these future improvements:

1. **Memoized Selectors**: Add caching to selectors for expensive computations
2. **Lazy Loading**: Load rule details on-demand instead of full dataset
3. **Virtual Scrolling**: For long rule lists (tree component supports this)
4. **Rule Versioning**: Compare rules across versions (data model supports version field)
5. **Offline Support**: The hierarchical structure works well with service workers
6. **Advanced Search**: Full-text search with relevance scoring (data model supports this)

---

## HANDOFF TO DESIGNER

@designer

The **Update Rules Data Structure** feature has been architected. Here are the key decisions:

### Architecture Decisions Made:

1. **Unified Hierarchical Data Model** (ADR-001)
   - Single `RuleSection` type for all rules and sections
   - Hierarchy encoded via `level` (0=section, 1=rule, 2+=details)
   - Parent-child relationships via `parentId` and `children` arrays

2. **Index Pattern for Fast Lookups** (ADR-002)
   - O(1) rule lookups via `Record<string, RuleSection>` index
   - Critical for breadcrumbs, navigation, and cross-references

3. **Selector Pattern for Data Access** (ADR-003)
   - Store provides selector methods (getters) instead of raw data access
   - Consistent API: `getRuleById()`, `getTopLevelSections()`, etc.
   - Components are decoupled from internal data structure

### System Architecture:

The system now uses a hierarchical data model that directly maps to the RPG rules document structure. All rules are `RuleSection` entities with:

- Numeric hierarchy (000. → 103. → 103.1. → 103.1.a.)
- Parent-child relationships
- Cross-references between rules
- Version tracking

Components use store selectors to access data efficiently. The routing structure supports hierarchical navigation where users can drill down from sections to rules to sub-rules.

### Key Files:

- Type definitions: `src/types/index.ts`
- State management: `src/store/rulesStore.ts`
- Data file: `public/data/rules.json`
- ADRs: `.cursor/features/active/update-rules-and-project-strucutre/adr/`

### Design Considerations:

Please proceed with UI/UX specifications based on this architecture. Focus on:

1. **Hierarchical Navigation UX**
   - How should users navigate the rule hierarchy?
   - Breadcrumb design for deep navigation paths
   - Tree view vs. linear view tradeoffs

2. **Visual Hierarchy Cues**
   - How to visually indicate rule levels (sections vs. rules vs. details)?
   - Rule number display (should they be prominent?)
   - Indentation or other visual cues for depth

3. **Component Specifications**
   - `RuleCard` needs to show hierarchy level and child count
   - `SectionCard` represents level 0 sections
   - `RuleTree` needs accessible, keyboard-friendly tree navigation design
   - `RuleDetailPage` shows current rule + children (how to lay this out?)

4. **Cross-Reference Display**
   - How to show related rules (via `crossRefs`)?
   - "See Also" sections or inline links?

5. **Accessibility for Hierarchy**
   - WCAG-compliant tree navigation patterns
   - Screen reader announcements for hierarchy levels
   - Keyboard shortcuts for navigation

The architecture supports all these design decisions. Review the ADRs for detailed context, and create specifications that leverage the hierarchical structure effectively.
