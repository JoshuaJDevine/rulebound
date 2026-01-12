# Feature: Improve User Experience

**Branch:** feature/improve-user-experience
**Started:** 2026-01-12
**Status:** Completed
**Completed:** 2026-01-12

## Workflow Progress

- [x] Architect - System Design & ADRs
- [x] Designer - UI/UX Specifications
- [ ] Coder - Implementation
- [ ] Tester - Test Coverage
- [ ] Documentor - Documentation
- [ ] Closer - PR & Cleanup

## Agent Documents

| Agent      | Document                         | Status   |
| ---------- | -------------------------------- | -------- |
| Architect  | [architect.md](./architect.md)   | Complete |
| Designer   | [designer.md](./designer.md)     | Complete |
| Coder      | [coder.md](./coder.md)           | Pending  |
| Tester     | [tester.md](./tester.md)         | Pending  |
| Documentor | [documentor.md](./documentor.md) | Pending  |
| Closer     | [closer.md](./closer.md)         | Pending  |

## Architecture Summary

This feature dramatically improves the user experience for reading and navigating Riftbound rules. The current "spreadsheet of chevrons" interface is being transformed into a delightful, readable rules reference.

## Design Summary

The design transforms Rule Bound into a branded Riftbound experience with the following key changes:

### Visual Identity

- **Color Palette**: Dark blue (`#102a43`) + Warm gold (`#f59e0b`) - aligned with Riftbound branding
- **Typography**: Cinzel (display/headers) + Crimson Pro (body text) from Google Fonts
- **Dark Mode**: Full support from day one, using the dark blue palette

### Navigation Paradigm

- **Top-level (HomePage)**: Bold section cards with dark blue gradients and gold accents
- **Inside sections**: Minimal, compact cards - scannable like a table of contents
- **Topic headers**: Gold left border (4px), expandable with "Read" option
- **Definitions**: Blue-gray left border (2px), very compact
- **Sub-rules**: Inline with parent content, gray continuation line

### New Components

1. `TopicCard` - Level 1 topic headers
2. `RuleListItem` - Compact minimal cards for scanning
3. `SubRuleDisplay` - Inline nested content
4. `ViewModeToggle` - Switch between list/reading modes
5. `ReadingView` - Document-style sequential reading
6. `RuleLink` - Cross-reference links with preview tooltips

See [designer.md](./designer.md) for complete design specifications.

### Key Architectural Decisions

1. **ADR-001: Content Classification** - Runtime classification of rules as section/topic-header/definition/sub-rule
2. **ADR-002: Reading Mode** - Dual-mode interface with navigation and document-style reading
3. **ADR-003: Visual Hierarchy** - Differentiated visual treatment for each rule type
4. **ADR-004: Rule Connections** - Inline cross-reference links with preview popovers

See [architect.md](./architect.md) for complete architecture details and [adr/](./adr/) for all Architecture Decision Records.

## Problem Statement

The current Rule Bound interface treats all rules identically - as expandable cards with chevrons. This fails to:

- Distinguish topic headers ("401. Exhaust") from actual definitions
- Support reading rules sequentially like a document
- Show relationships between connected rules
- Provide visual hierarchy for 80+ pages of content

## Solution Overview

1. **Smart Content Classification**: Automatically categorize rules by type
2. **Reading Mode**: Document-style view for sequential reading
3. **Visual Hierarchy**: Different display styles for different rule types
4. **Connected Rules**: Inline cross-reference links with previews

## Notes

This is a major UX improvement feature. The goal is to transform Rule Bound from a functional navigation tool into a delightful reading experience that makes the 80+ pages of Riftbound rules actually pleasant to read and learn from.
