# Architect: Workflow for Publishing

## Overview

This document defines the architecture for Rule Bound's publishing workflow—enabling the team to deploy the application to live environments for testing and eventually production use.

The architecture provides:
- **Automated CI/CD pipeline** via GitHub Actions
- **Preview deployments** for every PR via Netlify
- **Production deployments** on merge to main
- **Quality gates** that must pass before deployment

## Architecture Decisions

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](./adr/ADR-001-hosting-platform.md) | Hosting Platform Selection | Accepted |
| [ADR-002](./adr/ADR-002-ci-cd-pipeline.md) | CI/CD Pipeline Architecture | Accepted |
| [ADR-003](./adr/ADR-003-environment-strategy.md) | Environment Strategy | Accepted |
| [ADR-004](./adr/ADR-004-spa-routing-configuration.md) | SPA Routing Configuration | Accepted |

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Developer Workflow                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Git Push / PR                            │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│   GitHub Actions CI      │      │   Netlify Auto-Deploy    │
│                          │      │                          │
│  • Lint                  │      │  • Build from branch     │
│  • Type Check            │      │  • Deploy preview        │
│  • Test                  │      │  • Post URL to PR        │
│  • Build Verification    │      │                          │
└──────────────────────────┘      └──────────────────────────┘
              │                                 │
              ▼                                 ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│   PR Status Checks       │      │   Preview Environment    │
│   (must pass to merge)   │      │   deploy-preview-*.app   │
└──────────────────────────┘      └──────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Merge to Main Branch                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Netlify Production Deploy                        │
│                 rulebound.netlify.app                            │
└─────────────────────────────────────────────────────────────────┘
```

### Environments

| Environment | Purpose | URL | Trigger |
|-------------|---------|-----|---------|
| Development | Local dev | `localhost:5173` | `npm run dev` |
| Preview | PR testing | `deploy-preview-{num}--rulebound.netlify.app` | PR opened/updated |
| Production | Live site | `rulebound.netlify.app` | Merge to main |

## Configuration Files

### 1. Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "20"

# SPA routing - serve index.html for all routes
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Environment contexts
[context.production]
  environment = { VITE_DEPLOY_CONTEXT = "production" }

[context.deploy-preview]
  environment = { VITE_DEPLOY_CONTEXT = "preview" }

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. GitHub Actions CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Type Check
        run: npm run type-check
        
      - name: Test
        run: npm run test:run
        
      - name: Build
        run: npm run build
```

### 3. Environment Files

**`.env`** (committed - shared defaults):
```env
VITE_APP_NAME=Rule Bound
```

**`.env.production`** (committed - production overrides):
```env
# Production-specific settings (future use)
# VITE_ENABLE_ANALYTICS=true
```

## Component Structure

This feature adds infrastructure files, not React components:

```
rulebound/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── netlify.toml                # Netlify deployment config
├── .env                        # Shared environment variables
└── .env.production             # Production environment variables
```

## Technology Choices

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Netlify** | Hosting & Deployment | Free tier, automatic preview deploys, great DX, SPA support |
| **GitHub Actions** | CI Pipeline | GitHub-native, free tier sufficient, excellent caching |
| **Vite Build** | Production Build | Already in project, fast, optimized output |

## Security Considerations

1. **Security Headers**: Configured in `netlify.toml`:
   - `X-Frame-Options: DENY` - Prevent clickjacking
   - `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
   - `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info

2. **No Secrets in Client Code**: Environment variables are build-time only; no runtime secrets

3. **Branch Protection**: Recommend enabling GitHub branch protection on `main`:
   - Require PR reviews
   - Require status checks to pass
   - No direct pushes to main

## Manual Setup Required

After implementation, the following manual steps are needed:

1. **Create Netlify Account** and connect to GitHub repo
2. **Configure Site Settings** in Netlify dashboard:
   - Set site name (e.g., `rulebound`)
   - Configure custom domain (optional)
3. **Enable GitHub Branch Protection** on `main` branch:
   - Require status checks: `quality`
   - Require PR before merge
4. **Verify First Deployment** works correctly

## Diagrams

### Deployment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Local   │────▶│  GitHub  │────▶│  GitHub  │────▶│ Netlify  │
│   Dev    │push │   Repo   │     │ Actions  │     │  Deploy  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                       │                │                │
                       │                ▼                ▼
                       │          ┌──────────┐    ┌──────────┐
                       │          │  Status  │    │  Preview │
                       │          │  Checks  │    │   URL    │
                       │          └──────────┘    └──────────┘
                       │                │
                       ▼                ▼
                 ┌──────────┐    ┌──────────┐
                 │  Merge   │───▶│Production│
                 │  to Main │    │  Deploy  │
                 └──────────┘    └──────────┘
```

### File Changes Overview

```
New Files:
  .github/workflows/ci.yml    - CI pipeline
  netlify.toml                - Deployment config
  .env                        - Environment defaults
  .env.production             - Production env vars

No existing files modified.
```

---

## HANDOFF TO DESIGNER

@designer

**Workflow for Publishing** has been architected. Key decisions:

1. **Netlify** selected as hosting platform for its automatic preview deployments and SPA support
2. **GitHub Actions** handles CI (lint, type-check, test, build) as quality gates
3. **Three environments** defined: Development, Preview, Production
4. **SPA routing** handled via `netlify.toml` redirects (no code changes needed)

The system architecture is defined in this document. Please proceed with UI/UX design and feature specifications based on:

- ADRs in `.cursor/features/active/workflow-for-publishing/adr/`
- Architecture details in this document

**Note for Designer**: This feature is primarily infrastructure (CI/CD configuration files). There are **no new UI components** to design. However, you may want to consider:

1. **Build Status Badge**: Should we add a CI status badge to the README?
2. **Environment Indicator**: Should the app show which environment it's running in (e.g., a small "Preview" badge in non-production)?
3. **Documentation**: Any user-facing documentation about the deployment process?

If no UI work is needed, the Designer phase can be minimal—just confirm the handoff to Coder with implementation specifications.
