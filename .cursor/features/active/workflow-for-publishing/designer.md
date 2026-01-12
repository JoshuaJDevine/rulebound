# Designer: Workflow for Publishing

## Overview

This feature is **infrastructure-focused** (CI/CD configuration files) with minimal UI impact. After reviewing the architect's specifications and ADRs, I've made decisions on the optional UI considerations raised in the handoff.

## UI Design Decisions

### 1. README CI Status Badge ✅ Recommended

**Decision**: Add a CI status badge to the README

**Rationale**:
- Standard practice for open-source projects
- Provides immediate visibility into build health
- Zero runtime cost (static markdown)
- Builds confidence for contributors

**Specification**:
```markdown
![CI](https://github.com/[owner]/rulebound/actions/workflows/ci.yml/badge.svg)
```

Place at the top of README.md, below the title.

### 2. Environment Indicator ❌ Not Recommended (for now)

**Decision**: Do not add an environment indicator at this time

**Rationale**:
- **URL is sufficient**: Preview deployments have obvious URLs (`deploy-preview-123--rulebound.netlify.app`)
- **Minimal user confusion risk**: Target users (playtesters, stakeholders reviewing PRs) will access via PR links
- **Avoid UI clutter**: The app is focused on rules reference; visual noise detracts from that purpose
- **Future consideration**: Can revisit if user testing reveals confusion

**Alternative**: If needed later, a simple approach would be a small banner at the top of the page only in preview context, dismissible and using the `VITE_DEPLOY_CONTEXT` environment variable.

### 3. Deployment Documentation

**Decision**: Leave to Documentor phase

**Rationale**: Documentation about the deployment process belongs in the Documentor phase, not UI/UX design. The README should include basic badge; detailed setup instructions are documentation scope.

## Component Specifications

**No new React components required.**

This feature adds only configuration files:
- `.github/workflows/ci.yml` - GitHub Actions CI pipeline
- `netlify.toml` - Netlify deployment configuration
- `.env` - Shared environment variables
- `.env.production` - Production environment variables

## Accessibility Requirements

**Not applicable** - No UI components being added.

If an environment indicator is added in the future:
- Must meet WCAG 2.1 AA color contrast requirements
- Should not rely on color alone to convey meaning
- Should be announced by screen readers (use `role="status"` or similar)

## User Flows

**No new user flows** - This feature operates entirely in the CI/CD infrastructure layer. Users interact with:

1. **Developers**: Push code → CI runs automatically → See results in GitHub PR
2. **Reviewers**: Open PR → Click Netlify preview link → Test the app
3. **End Users**: No change in experience (production deployments are transparent)

## Design Decisions Summary

| Consideration | Decision | Rationale |
|---------------|----------|-----------|
| CI Badge in README | ✅ Add | Standard practice, zero cost |
| Environment Indicator | ❌ Skip | URLs are sufficient, avoid clutter |
| Documentation | ➡️ Defer | Documentor phase responsibility |

---

## HANDOFF TO CODER

@coder

**Workflow for Publishing** design review is complete. This is an **infrastructure-only feature** with no new React components.

### Implementation Summary

**Files to create:**

1. **`.github/workflows/ci.yml`** - GitHub Actions CI pipeline
   - See `architect.md` for exact configuration
   - Jobs: lint, type-check, test, build
   
2. **`netlify.toml`** - Netlify deployment configuration
   - See `architect.md` for exact configuration
   - Includes SPA routing redirect and security headers

3. **`.env`** - Shared environment defaults
   - `VITE_APP_NAME=Rule Bound`

4. **`.env.production`** - Production environment variables
   - Placeholder for future production-specific settings

5. **Update `README.md`** - Add CI status badge
   - Add badge below title: `![CI](https://github.com/[owner]/rulebound/actions/workflows/ci.yml/badge.svg)`
   - Note: Replace `[owner]` with actual GitHub username/org

### Key Points

- **No React components** to implement
- **No existing files modified** (except README badge)
- Use exact configurations from `architect.md`
- Ensure `type-check` script exists in `package.json` (may need to add if missing)

### Verification

After implementation:
1. CI workflow should be valid YAML
2. `netlify.toml` should be valid TOML
3. Local build should still work: `npm run build`

Please implement according to:
- Architecture from `architect.md`
- ADRs in `adr/` directory
