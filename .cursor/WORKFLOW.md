# Agent Workflow System

This document describes the 6-agent cascade workflow for developing features in Rule Bound with AI assistance.

## The Philosophy

> Every feature goes through 6 specialized agents, each with a single responsibility and clear handoff to the next.

**Key Principles:**

1. **Separation of Concerns** - Each agent does ONE thing well
2. **No Shared Artifacts** - Each agent creates their own documentation
3. **Clear Handoffs** - Generated prompts preserve context
4. **Blockers Enforce Quality** - Agents cannot skip steps
5. **Human Reviews at the End** - All work flows to a PR

## The 6 Agents

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FEATURE REQUEST                                │
│                              ↓                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐               │
│  │ ARCHITECT   │───▶│  DESIGNER   │───▶│   CODER     │               │
│  │             │    │             │    │             │               │
│  │ • System    │    │ • UI/UX     │    │ • Implement │               │
│  │   Design    │    │ • Specs     │    │ • Commit    │               │
│  │ • ADRs      │    │ • Components│    │ • Validate  │               │
│  │ • Tech Stack│    │ • A11y      │    │             │               │
│  └─────────────┘    └─────────────┘    └─────────────┘               │
│                              ↓                                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐               │
│  │   TESTER    │───▶│ DOCUMENTOR  │───▶│   CLOSER    │               │
│  │             │    │             │    │             │               │
│  │ • Write     │    │ • Create    │    │ • Validate  │               │
│  │   tests     │    │   .md docs  │    │ • Run checks│               │
│  │ • Coverage  │    │ • Examples  │    │ • Create PR │               │
│  │ • A11y tests│    │ • Link docs │    │             │               │
│  └─────────────┘    └─────────────┘    └─────────────┘               │
│                                                              ↓        │
│                                                           PR & MERGE  │
└──────────────────────────────────────────────────────────────────────┘
```

## Agent Roles

### 1. Architect (@architect)

**First in the chain** - Designs system architecture before any feature work begins.

- Creates Architecture Decision Records (ADRs)
- Defines data models and system boundaries
- Makes technology choices
- Documents system architecture

### 2. Designer (@designer)

**Second** - Creates UI/UX specifications based on architecture.

- Designs user flows and interactions
- Specifies component structure
- Documents accessibility requirements
- Creates design specifications

### 3. Coder (@coder)

**Third** - Implements the code following architecture and design.

- Writes TypeScript/React code
- Follows specifications exactly
- Commits code with conventional commits
- Validates implementation

### 4. Tester (@tester)

**Fourth** - Ensures code quality through testing.

- Writes comprehensive test suites
- Validates test coverage (80%+ target)
- Tests accessibility
- Documents test results

### 5. Documentor (@documentor)

**Fifth** - Creates documentation for maintainability.

- Creates `.md` file for every code file
- Includes usage examples
- Documents APIs and interfaces
- Links related documentation

### 6. Closer (@closer)

**Final** - Validates everything and creates the PR.

- Runs pre-push checks
- Verifies all artifacts exist
- Creates GitHub issues for gaps
- Creates pull request

## Quick Start

### 1. Start a Feature

```bash
npm run feature:start
```

This will:

- Checkout main and pull latest
- Create a feature branch (`feature/<name>`)
- Initialize the feature folder structure

### 2. Invoke the Architect

```
@architect I want to build [your feature]. Help me design the system architecture.
```

### 3. Follow the Cascade

Each agent creates a handoff prompt for the next. Copy and paste to invoke:

```
Architect → "HANDOFF TO DESIGNER" → @designer
Designer → "HANDOFF TO CODER" → @coder
Coder → "HANDOFF TO TESTER" → @tester
Tester → "HANDOFF TO DOCUMENTOR" → @documentor
Documentor → "HANDOFF TO CLOSER" → @closer
```

### 4. Review and Merge

The Closer creates the PR. Review it, merge via GitHub, then:

```bash
npm run feature:complete
```

## Feature Structure

Each feature gets a folder in `.cursor/features/active/<feature-name>/`:

```
.cursor/features/active/<feature-name>/
├── README.md           # Feature overview and progress
├── architect.md        # System architecture and ADRs
├── designer.md         # UI/UX specifications
├── coder.md            # Implementation details
├── tester.md           # Test coverage and results
├── documentor.md       # Documentation summary
├── closer.md           # PR details and validation
└── adr/                # Architecture Decision Records
    ├── ADR-001-*.md
    └── ADR-002-*.md
```

## Workflow Details

### Starting a Feature

1. Run `npm run feature:start`
2. Enter feature name
3. Feature branch and folder structure created
4. Invoke `@architect` with feature request

### Architect Phase

- Analyzes feature request
- Creates ADRs for significant decisions
- Defines system architecture
- Creates `architect.md` with handoff to Designer

### Designer Phase

- Reads Architect handoff
- Creates UI/UX specifications
- Designs component structure
- Documents accessibility requirements
- Creates `designer.md` with handoff to Coder

### Coder Phase

- Reads Designer and Architect handoffs
- Implements code following specs
- Validates with type-check and lint
- Creates `coder.md` with handoff to Tester

### Tester Phase

- Reads Coder handoff
- Writes test suites
- Validates coverage (80%+ target)
- Tests accessibility
- Creates `tester.md` with handoff to Documentor

### Documentor Phase

- Reads Tester handoff
- Creates `.md` file for every code file
- Includes examples and usage
- Updates architecture docs if needed
- Creates `documentor.md` with handoff to Closer

### Closer Phase

- Reads Documentor handoff
- Verifies all artifacts exist
- Runs pre-push checks
- Creates GitHub issues for gaps
- Creates pull request
- Creates `closer.md` marking feature complete

### Completing a Feature

1. Review the PR on GitHub
2. Check the feature documents in `.cursor/features/active/<feature-name>/`
3. Merge via GitHub (never locally)
4. Run `npm run feature:complete` to archive

## Agent Rules

Each agent has strict rules they must follow. See individual agent files in `.cursor/agents/` for:

- **Personality** - How they approach problems
- **Responsibilities** - What they must do
- **Blockers** - What they cannot skip
- **Workflow** - Step-by-step process
- **Handoff Template** - What they pass to the next agent
- **Anti-Patterns** - What they must NOT do

## Quality Gates

The workflow enforces quality at multiple points:

| Stage  | Check                  | Enforced By      |
| ------ | ---------------------- | ---------------- |
| Arch   | ADRs exist             | Architect agent  |
| Arch   | Clean branch from main | Architect agent  |
| Design | Component specs        | Designer agent   |
| Code   | Type-check passes      | Coder agent      |
| Code   | Lint passes            | Coder agent      |
| Test   | 80%+ coverage          | Tester agent     |
| Docs   | .md for every .ts/.tsx | Documentor agent |
| Close  | All pre-push checks    | Closer agent     |
| Close  | Conventional commits   | Closer agent     |

## Naming Conventions

### Branch Names

```
feature/<kebab-case-name>

Valid:
  feature/add-user-auth
  feature/fix-login-bug
  feature/update-dashboard

Invalid:
  addUserAuth
  Feature/something
  feature/Add_User_Auth
```

### Commit Messages

```
type(scope): description

Types:
  feat     - New feature
  fix      - Bug fix
  docs     - Documentation only
  style    - Formatting, no code change
  refactor - Code restructuring
  test     - Adding tests
  chore    - Maintenance tasks

Examples:
  feat(auth): add login form validation
  fix(dashboard): correct chart rendering
  docs(api): document REST endpoints
  test(utils): add edge case coverage
```

### File Names

```
Code:  PascalCase.tsx or camelCase.ts
Tests: Same name + .spec.ts(x)
Docs:  Same name + .md

Example:
  UserProfile.tsx
  UserProfile.spec.tsx
  UserProfile.md
```

## Project Context: Rule Bound

Rule Bound is an accessible, easy-to-use web interface for the Riftbound Core Rules RPG. Key considerations:

- **Accessibility First**: WCAG 2.1 AA compliance is non-negotiable
- **React + TypeScript**: Primary technology stack
- **Teaching Through Design**: Interface helps users learn the game
- **Fast Reference**: Quick lookups for experienced players
- **Progressive Disclosure**: Complex rules broken into digestible pieces

## Troubleshooting

### Agent Can't Proceed

Check blockers in the agent's personality file. Common issues:

- Missing previous agent's handoff document
- Pre-requisites not met
- Quality checks failing

### Pre-Push Checks Fail

Run checks individually to identify issues:

```bash
npm run type-check
npm run lint
npm test
npm run docs:validate
```

### Missing Documentation

Use the issue creator:

```bash
npm run create-issue -- --type=docs --file=src/component.ts
```

## Getting Help

- Review agent personality files in `.cursor/agents/`
- Check feature documentation in `.cursor/features/active/<feature-name>/`
- Review this workflow document
- Check GitHub issues for known problems
