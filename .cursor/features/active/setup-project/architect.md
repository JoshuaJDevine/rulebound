# Architect: Project Setup

**Feature:** Initial React web application setup for Rule Bound  
**Date:** 2026-01-11  
**Architect:** AI Assistant

## Overview

This document defines the complete technical architecture for Rule Bound - an accessible, mobile-friendly web application for the Riftbound Core Rules RPG. The architecture prioritizes:

1. **Accessibility First**: WCAG 2.1 AA compliance is non-negotiable
2. **Mobile-Friendly**: Responsive, mobile-first design
3. **Modern Stack**: React + TypeScript + Vite
4. **Developer Experience**: Fast feedback, good tooling
5. **Maintainability**: Clear structure, comprehensive testing

## Architecture Decisions

All architectural decisions have been documented in ADRs:

| ADR | Decision | Status |
|-----|----------|--------|
| [ADR-001](./adr/ADR-001-build-tool-selection.md) | Build Tool Selection (Vite) | ✅ Accepted |
| [ADR-002](./adr/ADR-002-routing-solution.md) | Routing Solution (React Router v6) | ✅ Accepted |
| [ADR-003](./adr/ADR-003-styling-approach.md) | Styling Approach (Tailwind CSS) | ✅ Accepted |
| [ADR-004](./adr/ADR-004-state-management.md) | State Management (Context + Zustand) | ✅ Accepted |
| [ADR-005](./adr/ADR-005-accessibility-tooling.md) | Accessibility Tooling (Multi-layer) | ✅ Accepted |
| [ADR-006](./adr/ADR-006-project-structure.md) | Project Structure (Hybrid Layer-Based) | ✅ Accepted |

## System Design

### Technology Stack

**Core:**
- **React 18+**: UI framework
- **TypeScript 5+**: Type safety
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing

**Styling:**
- **Tailwind CSS**: Utility-first CSS framework
- **@tailwindcss/forms**: Accessible form styling
- **@tailwindcss/typography**: Rich text content styling

**State Management:**
- **React Context + Hooks**: UI state, theme
- **Zustand**: Global app state, user preferences

**Accessibility:**
- **eslint-plugin-jsx-a11y**: Development linting
- **@axe-core/react**: Runtime accessibility checks (dev mode)
- **vitest-axe**: Automated accessibility testing

**Testing:**
- **Vitest**: Test runner
- **React Testing Library**: Component testing
- **@vitest/coverage-c8**: Code coverage

**Code Quality:**
- **ESLint**: Linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │                                                            │  │
│  │  ┌──────────────┐    ┌──────────────┐   ┌─────────────┐  │  │
│  │  │   Pages      │◄───┤ React Router │   │   Layout    │  │  │
│  │  │  (Routes)    │    │              │   │ Components  │  │  │
│  │  └──────┬───────┘    └──────────────┘   └─────────────┘  │  │
│  │         │                                                 │  │
│  │         ▼                                                 │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │           Feature Components                      │    │  │
│  │  │  (Search, Rules Display, Bookmarks)               │    │  │
│  │  └──────┬────────────────────────┬──────────────────┘    │  │
│  │         │                        │                        │  │
│  │         ▼                        ▼                        │  │
│  │  ┌─────────────┐          ┌──────────────┐              │  │
│  │  │  Zustand    │          │   Context    │              │  │
│  │  │   Stores    │          │  Providers   │              │  │
│  │  │             │          │              │              │  │
│  │  │ • Rules     │          │ • Theme      │              │  │
│  │  │ • Bookmarks │          │ • UI State   │              │  │
│  │  │ • Prefs     │          │              │              │  │
│  │  └──────┬──────┘          └──────────────┘              │  │
│  │         │                                                │  │
│  │         ▼                                                │  │
│  │  ┌──────────────────────────────┐                       │  │
│  │  │      localStorage            │                       │  │
│  │  │  (Persisted User Data)       │                       │  │
│  │  └──────────────────────────────┘                       │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────┐                       │  │
│  │  │    UI Component Library      │                       │  │
│  │  │  (Shared, Accessible)        │                       │  │
│  │  └──────────────────────────────┘                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── Router
│   ├── Layout
│   │   ├── Header (navigation, search)
│   │   ├── Main (page content)
│   │   └── Footer
│   └── Routes
│       ├── HomePage
│       ├── RulesPage (browsing rules)
│       │   ├── RulesList
│       │   └── RuleDetail
│       ├── SearchPage
│       └── BookmarksPage
└── Providers
    ├── ThemeProvider (Context)
    └── ErrorBoundary
```

## Data Models

### Core Types

```typescript
// Rule represents a single rule from the Riftbound Core Rules
interface Rule {
  id: string;                    // Unique identifier
  title: string;                 // Rule title
  section: string;               // Major section (e.g., "Combat", "Character Creation")
  subsection?: string;           // Optional subsection
  content: string;               // Rule text content (markdown)
  tags: string[];                // Searchable tags
  references: string[];          // IDs of related rules
  pageNumber?: number;           // PDF page reference
}

// Section groups rules hierarchically
interface Section {
  id: string;
  title: string;
  description: string;
  icon?: string;                 // Icon identifier for UI
  rules: string[];               // Array of rule IDs
  subsections?: Section[];       // Nested sections
}

// Bookmark represents a user's saved rule
interface Bookmark {
  ruleId: string;
  timestamp: number;             // When bookmarked
  notes?: string;                // Optional user notes
}

// User preferences
interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  bookmarks: Bookmark[];
  recentlyViewed: string[];      // Rule IDs, most recent first
}

// Search result
interface SearchResult {
  rule: Rule;
  score: number;                 // Relevance score
  matches: SearchMatch[];        // Where the search term matched
}

interface SearchMatch {
  field: 'title' | 'content' | 'tags';
  snippet: string;               // Text snippet with match
  position: number;              // Character position
}
```

### State Interfaces

```typescript
// Zustand store for rules and user data
interface RulesStore {
  // Rules data
  rules: Rule[];
  sections: Section[];
  isLoading: boolean;
  error: Error | null;
  
  // User data
  bookmarks: Bookmark[];
  preferences: UserPreferences;
  
  // Actions
  loadRules: () => Promise<void>;
  addBookmark: (ruleId: string, notes?: string) => void;
  removeBookmark: (ruleId: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addToRecentlyViewed: (ruleId: string) => void;
}

// Context for theme
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Context for UI state (modals, etc.)
interface UIContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}
```

## API / Services

### Data Loading

Initially, rules will be stored as static JSON data in the repository. Future iterations may load from an API or parse the PDF dynamically.

```typescript
// Data loading service
interface DataService {
  /**
   * Load all rules from static JSON
   * Returns parsed rules array
   */
  loadRules(): Promise<Rule[]>;
  
  /**
   * Load section hierarchy
   */
  loadSections(): Promise<Section[]>;
  
  /**
   * Search rules by query
   */
  searchRules(query: string): SearchResult[];
}
```

### Storage Service

```typescript
// Local storage wrapper
interface StorageService {
  /**
   * Save user preferences to localStorage
   */
  savePreferences(prefs: UserPreferences): void;
  
  /**
   * Load user preferences from localStorage
   */
  loadPreferences(): UserPreferences | null;
  
  /**
   * Clear all stored data
   */
  clear(): void;
}
```

## Technology Choices

### Why Vite?
- Extremely fast dev server (native ES modules)
- Optimized production builds
- Excellent TypeScript support
- Modern, well-maintained

### Why React Router v6?
- Industry standard
- Built-in accessibility features
- Code splitting support
- Strong TypeScript support

### Why Tailwind CSS?
- Mobile-first responsive design by default
- Built-in accessibility utilities
- Highly performant (PurgeCSS)
- Design token system for consistency
- Rapid development

### Why Zustand + Context?
- Zustand: Minimal boilerplate, great performance, small bundle
- Context: Built-in, perfect for simple UI state
- Hybrid approach: Use the right tool for the job

### Why Multi-Layer Accessibility?
- Defense in depth: catch issues at multiple stages
- Fast feedback: ESLint catches issues immediately
- Comprehensive: static + runtime + automated tests
- Industry standard tools

## Project Structure

```
rulebound/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── ui/             # Basic elements (Button, Card, Input)
│   │   ├── layout/         # Layout (Header, Footer, Nav)
│   │   └── common/         # Common (Loading, Error)
│   ├── pages/              # Route-level pages
│   │   ├── HomePage/
│   │   ├── RulesPage/
│   │   ├── SearchPage/
│   │   └── BookmarksPage/
│   ├── features/           # Feature-specific code (future)
│   ├── lib/                # Utilities and hooks
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── api/            # Data fetching
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript types
│   ├── data/               # Static data (rules JSON)
│   ├── styles/             # Global styles
│   ├── routes/             # Route definitions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── tests/                  # Test utilities
└── docs/                   # Documentation
```

See [ADR-006](./adr/ADR-006-project-structure.md) for detailed structure decisions.

## Development Workflow

### Quality Gates

1. **ESLint**: Catches code quality and accessibility issues
2. **TypeScript**: Ensures type safety
3. **Vitest**: Runs all tests (unit, integration, accessibility)
4. **Prettier**: Enforces consistent formatting
5. **Pre-push checks**: All of the above must pass

### Testing Strategy

- **Unit Tests**: For utilities, hooks, pure logic
- **Component Tests**: For React components (RTL)
- **Accessibility Tests**: For every component (vitest-axe)
- **Integration Tests**: For user flows
- **Coverage Target**: 80%+

### Documentation Requirements

Every `.ts`/`.tsx` file needs:
- **Source file**: The code itself
- **Test file**: `.spec.ts(x)` with comprehensive tests
- **Doc file**: `.md` with usage examples and API docs

## Mobile-First Considerations

### Responsive Breakpoints (Tailwind)

```
Default:  Mobile (< 640px)
sm:       640px  - Small tablets
md:       768px  - Tablets
lg:       1024px - Small laptops
xl:       1280px - Desktops
2xl:      1536px - Large screens
```

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA)
- Recommended: 48x48px
- All interactive elements must meet this on mobile

### Performance

- Route-based code splitting (React.lazy)
- Lazy load images
- Optimize Tailwind (PurgeCSS)
- Minimize bundle size

### Mobile UX

- Bottom navigation for easy thumb access
- Swipe gestures for navigation (consider)
- Collapsible sections for space efficiency
- Large, tappable buttons
- No hover-dependent interactions

## Accessibility Requirements

### WCAG 2.1 AA Compliance

Must meet all Level A and AA criteria:

1. **Perceivable**
   - Text alternatives for images
   - Captions for audio/video
   - Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
   - Resizable text up to 200%

2. **Operable**
   - Full keyboard navigation
   - No keyboard traps
   - Skip navigation links
   - Descriptive page titles
   - Focus order makes sense
   - Focus visible

3. **Understandable**
   - Language of page identified
   - Predictable navigation
   - Input assistance (labels, error messages)
   - Error prevention

4. **Robust**
   - Valid HTML
   - ARIA roles and labels
   - Compatible with assistive technologies

### Tools Enforce Compliance

- **eslint-plugin-jsx-a11y**: Catches common issues at write-time
- **@axe-core/react**: Runtime checks in development
- **vitest-axe**: Automated tests prevent regressions
- **Manual testing**: Screen readers, keyboard nav

## Security Considerations

- **XSS Prevention**: All user input sanitized (React handles by default)
- **Content Security Policy**: Configure in Vite
- **No inline scripts**: All JavaScript in bundles
- **HTTPS only**: (for production deployment)
- **localStorage**: Safe for user preferences (no sensitive data)

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+ (Performance, Accessibility)
- **Bundle Size**: < 200KB (gzipped, initial)
- **Code Splitting**: Route-based

## Future Considerations

### Phase 2 (Not in Initial Setup)

- PDF parsing (extract rules from PDF programmatically)
- Full-text search (fuzzy search, filters)
- Offline support (PWA, service worker)
- Dark mode toggle
- Font size adjustments
- Export bookmarks
- Share rules (URL deep linking)

### Extensibility

The architecture supports future additions:
- Additional data sources (API, PDF parsing)
- More complex state (Redux if needed)
- Server-side rendering (Vite SSR)
- Native mobile app (React Native code reuse)

## Diagrams

### Data Flow

```
User Interaction
      │
      ▼
  Component
      │
      ├─► Context (UI state)
      │
      └─► Zustand Store
              │
              ├─► Read state
              │
              └─► Update state ──► localStorage
                                       │
                                       └─► Persist
```

### Routing Flow

```
Browser URL
      │
      ▼
React Router
      │
      ├─► Lazy Load Route
      │
      ▼
   Layout
      │
      ├─► Header (navigation)
      ├─► Page Component
      └─► Footer
```

## HANDOFF TO DESIGNER

**@designer**

The **Project Setup** feature has been architected. The technical foundation for Rule Bound is now defined.

### Key Architectural Decisions

1. **Tech Stack**: React + TypeScript + Vite + Tailwind CSS
2. **Routing**: React Router v6 with client-side routing
3. **Styling**: Mobile-first Tailwind CSS with design tokens
4. **State**: Zustand for app state, Context for UI state
5. **Accessibility**: Multi-layer tooling (ESLint + axe + tests)
6. **Structure**: Hybrid layer-based project organization

### Architecture Details

All architectural decisions are documented in ADRs:
- [ADR-001: Build Tool Selection](./adr/ADR-001-build-tool-selection.md)
- [ADR-002: Routing Solution](./adr/ADR-002-routing-solution.md)
- [ADR-003: Styling Approach](./adr/ADR-003-styling-approach.md)
- [ADR-004: State Management](./adr/ADR-004-state-management.md)
- [ADR-005: Accessibility Tooling](./adr/ADR-005-accessibility-tooling.md)
- [ADR-006: Project Structure](./adr/ADR-006-project-structure.md)

Full architecture details are in this document.

### Focus Areas for Design

Please proceed with UI/UX design and feature specifications based on this architecture. Focus on:

1. **Mobile-First Design**
   - Design for mobile first, enhance for desktop
   - Touch targets minimum 44x44px
   - Bottom navigation for thumb accessibility
   - Collapsible sections for space efficiency

2. **Accessibility**
   - WCAG 2.1 AA compliance required
   - Color contrast: 4.5:1 (normal), 3:1 (large)
   - Keyboard navigation flow
   - Screen reader compatibility
   - Focus indicators

3. **Component Design**
   - Reusable UI component library
   - Layout components (Header, Footer, Nav)
   - Page components (Home, Rules, Search, Bookmarks)
   - Design system with Tailwind tokens

4. **User Flows**
   - Browsing rules (section → rule)
   - Searching rules
   - Bookmarking favorite rules
   - Reading rule details

5. **Responsive Breakpoints**
   - Mobile: < 640px (primary focus)
   - Tablet: 640px - 1024px
   - Desktop: 1024px+

6. **Design System**
   - Define color palette (with contrast ratios)
   - Typography scale
   - Spacing scale
   - Component variants
   - Interactive states (hover, focus, active, disabled)

### Data Models Available

The following TypeScript interfaces are defined and available:
- `Rule`: Individual rule entries
- `Section`: Hierarchical rule organization
- `Bookmark`: User-saved rules
- `UserPreferences`: User settings
- `SearchResult`: Search functionality

See the "Data Models" section in this document for complete definitions.

### Next Steps

1. Create UI/UX specifications
2. Design component library
3. Define user flows and navigation
4. Document accessibility requirements
5. Create mockups/wireframes (if helpful)
6. Hand off to Coder with complete specifications

The architecture is ready. Please create the design specifications!
