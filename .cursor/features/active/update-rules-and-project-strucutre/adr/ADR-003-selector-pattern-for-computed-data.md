# ADR-003: Selector Pattern for Computed Data Access

## Status

Accepted

## Context

With the new hierarchical data model and index pattern (ADR-001, ADR-002), components need to query the rules data in various ways:

- Get all top-level sections (level 0) for the home page
- Find a specific rule by ID for detail pages
- Get all child rules of a parent for navigation
- Find all rules that reference a specific rule

The initial approach exposed raw data arrays (`rules`, `sections`) and let components filter/transform as needed. This led to:

1. **Logic Duplication**: Multiple components implementing the same filtering logic
2. **Inconsistent Queries**: Different ways to find the same data
3. **Performance Issues**: Components re-filtering on every render
4. **Tight Coupling**: Components depend on the exact data structure

Example of problematic component code:

```typescript
const topSections = sections.filter((s) => s.level === 0); // Repeated everywhere
const rule = rules.find((r) => r.id === targetId); // O(n) lookup
```

## Options Considered

### Option A: Direct Data Access (Status Quo)

Expose raw data and let components query it:

```typescript
interface RulesStore {
  rules: Rule[];
  sections: Section[];
  // Components access these directly
}
```

**Pros:**

- Simple store interface
- Maximum flexibility for components
- No additional store logic needed

**Cons:**

- Logic duplication across components
- Inconsistent query patterns
- Poor performance (repeated filtering)
- Tight coupling to data structure
- Hard to refactor data model later

### Option B: Selector Functions with Memoization

Add selector methods to the store that encapsulate common queries:

```typescript
interface RulesStore {
  rulesData: RulesData | null;

  // Selector methods
  getTopLevelSections: () => RuleSection[];
  getRuleById: (id: string) => RuleSection | undefined;
  getChildRules: (id: string) => RuleSection[];
  getReferencedBy: (id: string) => RuleSection[];
}
```

**Pros:**

- Centralized query logic
- Consistent API for all data access
- Can optimize internally (use index)
- Easy to add caching/memoization
- Loose coupling (components don't know data structure)
- Easy to refactor data model

**Cons:**

- More methods to maintain
- Slightly larger store interface
- Need to anticipate common queries

### Option C: Separate Selector Library

Create a separate file with selector functions:

```typescript
// selectors.ts
export const getTopLevelSections = (data: RulesData) =>
  data.sections.filter((r) => r.level === 0);
```

**Pros:**

- Separates concerns (data vs queries)
- Can be tested independently
- Reusable outside store

**Cons:**

- Components need to pass data to selectors
- No access to store internals (index)
- Can't optimize with store state
- More files to maintain

## Decision

We will use **Option B: Selector Functions in the Store**.

The store will provide selector methods that:

- Encapsulate all data access logic
- Use the index for O(1) lookups
- Return computed/filtered data
- Hide the internal data structure from components

```typescript
interface RulesStore {
  // State
  rulesData: RulesData | null;

  // Selectors (computed getters)
  getTopLevelSections: () => RuleSection[];
  getRuleById: (id: string) => RuleSection | undefined;
  getChildRules: (id: string) => RuleSection[];
  getReferencedBy: (id: string) => RuleSection[];

  // Actions
  loadRules: () => Promise<void>;
  searchRules: (query: string) => SearchResult[];
  // ...
}
```

Components use selectors instead of accessing raw data:

```typescript
// Component code
const { getTopLevelSections, getRuleById } = useRulesStore();
const sections = getTopLevelSections(); // Filtered list
const rule = getRuleById(id); // O(1) lookup
```

## Consequences

### Positive

- **Consistent API**: All components use the same methods to access data
- **Performance**: Selectors use the index for fast lookups
- **Maintainability**: Query logic is centralized and easy to update
- **Testability**: Selectors can be tested independently
- **Loose Coupling**: Components don't depend on data structure details
- **Future-Proof**: Can add caching/memoization internally without breaking components
- **Type Safety**: TypeScript ensures correct usage

### Negative

- **Store Complexity**: More methods in the store interface
- **Learning Curve**: Developers need to know which selector to use
- **Anticipation Required**: Need to think about common queries upfront

### Neutral

- Selectors are "getter" methods that compute on every call (no automatic memoization yet)
- Can add `useMemo` in components if needed, or implement memoization in store later
- The pattern is familiar to Redux users (similar to Reselect)

### Implementation Details

Key selectors implemented:

1. **getTopLevelSections()**: Returns all rules with `level === 0`
   - Used by home page to show main sections
   - Filters the sections array once

2. **getRuleById(id)**: Returns a specific rule
   - Uses index for O(1) lookup: `rulesData.index[id]`
   - Used for detail pages and breadcrumbs

3. **getChildRules(id)**: Returns all direct children of a rule
   - Maps child IDs through index: `rule.children.map(id => index[id])`
   - Used for navigation and tree components

4. **getReferencedBy(id)**: Returns all rules that reference a given rule
   - Filters sections where `crossRefs` includes the ID
   - Used for "see also" / "referenced by" sections

### Future Enhancements

- Add memoization with Zustand's `shallow` comparison
- Implement selector caching for expensive computations
- Add more specialized selectors as needed (e.g., `getSiblings`, `getBreadcrumb`)
