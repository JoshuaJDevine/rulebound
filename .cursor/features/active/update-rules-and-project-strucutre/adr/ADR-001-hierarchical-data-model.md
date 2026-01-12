# ADR-001: Hierarchical Data Model for Rules

## Status

Accepted

## Context

The initial project setup used a flat data structure for rules, with separate `Rule` and `Section` types. This approach had several limitations:

1. **Artificial Separation**: The Riftbound Core Rules document has a natural hierarchy (sections → rules → sub-rules → details), but we were treating sections and rules as separate entities
2. **Manual Relationship Management**: Parent-child relationships were managed through arrays of IDs without strong guarantees
3. **Difficult Navigation**: Building navigation trees required complex logic to reconstruct the hierarchy
4. **Inconsistent Data Source**: The parsed rules from the TXT file naturally produced a hierarchical `RuleSection` structure, but we were transforming it into a flatter model

The actual rules content has these characteristics:

- Numbered hierarchically (e.g., "103.", "103.1.", "103.1.a.", "103.1.a.1.")
- Multiple levels of nesting (sections, rules, sub-rules, details)
- Cross-references between rules
- Parent-child relationships that need preservation

## Options Considered

### Option A: Keep Flat Structure with Separate Rule and Section Types

**Pros:**

- Already implemented in initial setup
- Simple to understand at first glance
- Works well for flat list views

**Cons:**

- Requires data transformation from parsed rules
- Complex logic to reconstruct hierarchy for navigation
- Duplication of fields between Rule and Section types
- Difficult to query parent/child relationships
- Doesn't match the source data structure

### Option B: Unified Hierarchical RuleSection Type

**Pros:**

- Matches the parsed data structure directly
- Natural representation of the source document
- Easier to build tree navigation
- Single type to maintain
- Parent-child relationships are explicit
- Supports arbitrary nesting levels
- Cross-references are tracked

**Cons:**

- Slightly more complex type definition
- Components need to handle hierarchy
- List views need to filter by level

### Option C: Tree Structure with Explicit Parent References

**Pros:**

- Clear parent-child relationships
- Easy to traverse up the tree

**Cons:**

- Circular reference concerns
- More complex to serialize
- Still requires transformation from parsed data

## Decision

We will use **Option B: Unified Hierarchical RuleSection Type**.

The `RuleSection` interface will serve as the single source of truth for all rule data:

```typescript
interface RuleSection {
  id: string; // Unique identifier (e.g., "103.1.a.2")
  number: string; // Display number (e.g., "103.1.a.2.")
  title: string; // Rule heading
  content: string; // Full text content
  level: number; // 0=section, 1=rule, 2=detail, etc.
  parentId?: string; // Reference to parent
  children: string[]; // Child rule IDs
  crossRefs: string[]; // Referenced rule IDs
  version: string; // Rules version
}
```

This structure:

- Represents the document hierarchy naturally
- Eliminates the need for separate Rule/Section types
- Makes tree navigation straightforward
- Matches the parser output directly
- Supports the RPG rules domain model

## Consequences

### Positive

- **Simpler Data Pipeline**: Parser output can be used directly without transformation
- **Easier Navigation**: Tree components can traverse children arrays naturally
- **Better Performance**: No need to rebuild hierarchy on every render
- **Type Safety**: Single type means fewer type conversions
- **Flexible Queries**: Can easily find siblings, descendants, or filter by level
- **Future-Proof**: Supports adding more hierarchy levels without schema changes

### Negative

- **Migration Required**: Existing components need updates to use RuleSection instead of Rule
- **List View Complexity**: Need to filter by level (0 for sections, >0 for rules)
- **Learning Curve**: Developers need to understand the level-based hierarchy

### Neutral

- Components become hierarchy-aware, which is appropriate for this domain
- The index pattern (see ADR-002) complements this structure for O(1) lookups
