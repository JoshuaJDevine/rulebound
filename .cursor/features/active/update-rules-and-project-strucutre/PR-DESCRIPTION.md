# Update Rules Data Structure and Project Architecture

## Description

This feature refactors the core data model and state management architecture to better align with the hierarchical nature of the Riftbound Core Rules document. The changes transition from a flat, artificially separated data structure to a unified hierarchical model with optimized data access patterns.

## Changes

### Architecture (ADR-001, ADR-002, ADR-003)
- **Unified Hierarchical Data Model**: Single `RuleSection` type for all rules and sections
- **Index Pattern**: O(1) rule lookups via `Record<string, RuleSection>` index
- **Selector Pattern**: Store provides selector methods for consistent data access

### Components
- **RuleCard**: Updated with hierarchy styling (4 levels, 3 variants: default, compact, inline)
- **SectionCard**: Updated with new `RuleSection` interface and 2 variants (default, featured)
- **RuleTree**: New component with ARIA tree navigation, keyboard shortcuts, and roving tabindex

### State Management
- **rulesStore**: Updated with new `RulesData` structure (sections array + index)
- **Selectors**: `getTopLevelSections()`, `getRuleById()`, `getChildRules()`, `getReferencedBy()`
- **Backward Compatibility**: Index auto-building for existing data

### Pages
- **HomePage**: Updated to use `getTopLevelSections()` selector
- **RuleDetailPage**: Updated with breadcrumb paths and new data structure
- **SearchPage**: Updated with breadcrumb paths in results
- **BookmarksPage**: Updated to use new RuleCard interface

### Testing
- **472 tests passing** with **100% coverage** on all updated/created components
- **Accessibility**: WCAG 2.1 AA compliant, 0 axe violations
- **Performance**: ~30s full test suite

### Documentation
- **Priority 1 files**: All 4 critical components fully documented
  - `RuleCard.md` - Updated
  - `SectionCard.md` - Updated
  - `RuleTree.md` - Created (new)
  - `rulesStore.md` - Updated

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- All components: 100% coverage
- 472 tests passing, 0 failures
- Accessibility validated with axe

### Manual Testing Checklist
- [ ] Navigate to home page - sections display correctly
- [ ] Click section card - navigates to section detail
- [ ] Click rule card - navigates to rule detail
- [ ] Use breadcrumb navigation - shows full hierarchy path
- [ ] Use tree navigation - keyboard shortcuts work (Arrow keys, Enter, Space, Home, End)
- [ ] Search for rules - results show breadcrumb paths
- [ ] Bookmark rules - bookmarks persist correctly
- [ ] Cross-reference links - navigate properly
- [ ] "Referenced By" links - navigate properly

## Documentation

Feature documentation is in `.cursor/features/active/update-rules-and-project-strucutre/`:

- **Architecture**: [architect.md](./.cursor/features/active/update-rules-and-project-strucutre/architect.md)
- **Design**: [designer.md](./.cursor/features/active/update-rules-and-project-strucutre/designer.md)
- **Implementation**: [coder.md](./.cursor/features/active/update-rules-and-project-strucutre/coder.md)
- **Testing**: [tester.md](./.cursor/features/active/update-rules-and-project-strucutre/tester.md)
- **Documentation**: [documentor.md](./.cursor/features/active/update-rules-and-project-strucutre/documentor.md)
- **Closer**: [closer.md](./.cursor/features/active/update-rules-and-project-strucutre/closer.md)

### Architecture Decision Records (ADRs)
- [ADR-001: Hierarchical Data Model](./.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-001-hierarchical-data-model.md)
- [ADR-002: Index Pattern for Lookups](./.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-002-index-pattern-for-lookups.md)
- [ADR-003: Selector Pattern for Computed Data](./.cursor/features/active/update-rules-and-project-strucutre/adr/ADR-003-selector-pattern-for-computed-data.md)

## Checklist

- [x] All agent documents complete
- [x] Pre-push checks pass
- [x] Tests pass (472 tests, 100% coverage)
- [x] Documentation complete
- [x] Accessibility verified (WCAG 2.1 AA)
- [x] Code reviewed (self-review)
- [x] TypeScript errors fixed
- [x] ESLint errors fixed
- [x] Code formatted with Prettier

## Related Issues

N/A - This is a feature implementation following the established workflow.

---

**Status**: Ready for Review

All agent workflows complete. Feature is production-ready and ready for code review.
