# Rule Bound

An accessible, easy-to-use, and wonderfully designed web interface for the Riftbound Core Rules RPG. Rule Bound serves as both a comprehensive reference and an interactive learning tool to help people understand and master the game.

## Overview

Rule Bound transforms the Riftbound Core Rules into a modern, accessible web experience. Whether you're a new player learning the game or an experienced player looking up rules, Rule Bound makes it easy to find what you need.

## Features

- **Comprehensive Rules Reference** - All Riftbound Core Rules in an easily searchable format
- **Interactive Learning** - Helps teach the game through clear presentation and examples
- **Fully Accessible** - WCAG 2.1 AA compliant for all users
- **Fast and Responsive** - Quick lookups and smooth interactions
- **Modern Design** - Beautiful, intuitive interface

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework

## Development Workflow

This project uses a 6-agent cascade workflow for feature development. Each feature goes through:

1. **Architect** - System design and architecture decisions
2. **Designer** - UI/UX specifications
3. **Coder** - Implementation
4. **Tester** - Test coverage and validation
5. **Documentor** - Documentation
6. **Closer** - Final validation and PR creation

See [.cursor/WORKFLOW.md](.cursor/WORKFLOW.md) for complete workflow documentation.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up git hooks (if not already done)
npm run prepare
```

### Starting a Feature

```bash
# Start a new feature
npm run feature:start

# Follow the agent cascade:
# 1. @architect - Design system architecture
# 2. @designer - Create UI/UX specs
# 3. @coder - Implement code
# 4. @tester - Write tests
# 5. @documentor - Create documentation
# 6. @closer - Create PR
```

### Development Scripts

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Testing
npm test
npm run test:coverage

# Documentation validation
npm run docs:validate

# Pre-push checks (runs all quality checks)
npm run pre-push
```

## Project Structure

```
rulebound/
├── .cursor/
│   ├── agents/              # Agent personality definitions
│   │   ├── architect.md
│   │   ├── designer.md
│   │   ├── coder.md
│   │   ├── tester.md
│   │   ├── documentor.md
│   │   └── closer.md
│   ├── features/
│   │   ├── active/          # Features in progress
│   │   └── completed/       # Completed features
│   └── WORKFLOW.md          # Workflow documentation
├── scripts/                 # Workflow scripts
├── src/                     # Source code (to be created)
└── package.json
```

## Code Quality Standards

- **TypeScript**: All code must be type-safe
- **Testing**: 80%+ test coverage target
- **Documentation**: Every code file needs a corresponding `.md` file
- **Accessibility**: WCAG 2.1 AA compliance required
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier for consistent style

## Accessibility

Accessibility is a core requirement for Rule Bound. All features must:

- Meet WCAG 2.1 AA standards
- Support keyboard navigation
- Work with screen readers
- Have proper ARIA labels and roles
- Maintain sufficient color contrast

## Contributing

1. Start a feature with `npm run feature:start`
2. Follow the 6-agent workflow
3. Ensure all quality checks pass
4. Create a PR with complete documentation
5. Address review feedback
6. Merge via GitHub

See [.cursor/WORKFLOW.md](.cursor/WORKFLOW.md) for detailed workflow instructions.

## License

[License to be determined]

## Resources

- [Riftbound Core Rules PDF](Riftbound Core Rules v1.2.pdf)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
