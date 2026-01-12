## Description

This PR adds CI/CD infrastructure for automated testing and deployment. It sets up GitHub Actions for continuous integration and configures Netlify for preview and production deployments.

## Changes

- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`)
  - Runs lint, type-check, test, and build on push and PR
  - Uses Node.js 20 with npm caching
- Added Netlify deployment configuration (`netlify.toml`)
  - Configures build settings and SPA routing
  - Sets up security headers
  - Configures environment contexts for preview and production
- Updated README.md
  - Added CI status badge
  - Added CI/CD Pipeline documentation section
  - Documented deployment environments
  - Documented environment variables
- Fixed pre-existing lint error in `SearchPage.tsx`
  - Refactored URL sync to avoid setState in effect

## Testing

### Local Testing

1. **Type checking**:
   ```bash
   npm run type-check
   ```
   Should pass with no errors.

2. **Linting**:
   ```bash
   npm run lint
   ```
   Should pass with no errors (pre-existing error was fixed).

3. **Tests**:
   ```bash
   npm run test:run
   ```
   All tests should pass.

4. **Build**:
   ```bash
   npm run build
   ```
   Should produce `dist/` directory successfully.

### CI/CD Testing

Once merged:
1. GitHub Actions will run automatically on every push and PR
2. Netlify will automatically deploy previews for PRs
3. Netlify will automatically deploy to production on merge to main

### Manual Setup Required

After merging, the following manual steps are required:

1. **Connect Netlify to GitHub repository**:
   - Create/connect Netlify account
   - Import repository
   - Site name: `rulebound` (or as preferred)

2. **Configure GitHub Branch Protection**:
   - Go to Settings → Branches → Branch protection rules
   - Add rule for `main` branch
   - Require status checks: `quality`
   - Require pull request reviews before merging

3. **Verify First Deployment**:
   - Check that production deployment succeeds
   - Verify preview deployments work for PRs

## Documentation

Feature documentation is in `.cursor/features/active/workflow-for-publishing/`:

- Architecture: [architect.md](./.cursor/features/active/workflow-for-publishing/architect.md)
- Design: [designer.md](./.cursor/features/active/workflow-for-publishing/designer.md)
- Implementation: [coder.md](./.cursor/features/active/workflow-for-publishing/coder.md)
- Testing: [tester.md](./.cursor/features/active/workflow-for-publishing/tester.md)
- Documentation: [documentor.md](./.cursor/features/active/workflow-for-publishing/documentor.md)

ADRs:
- [ADR-001: Hosting Platform Selection](./.cursor/features/active/workflow-for-publishing/adr/ADR-001-hosting-platform.md)
- [ADR-002: CI/CD Pipeline Architecture](./.cursor/features/active/workflow-for-publishing/adr/ADR-002-ci-cd-pipeline.md)
- [ADR-003: Environment Strategy](./.cursor/features/active/workflow-for-publishing/adr/ADR-003-environment-strategy.md)
- [ADR-004: SPA Routing Configuration](./.cursor/features/active/workflow-for-publishing/adr/ADR-004-spa-routing-configuration.md)

## Related Issues

None

## Checklist

- [x] All agent documents complete
- [x] Pre-push checks pass (critical checks)
- [x] Tests pass
- [x] Documentation complete
- [x] Type checking passes
- [x] Linting passes (pre-existing error fixed)
- [x] Code reviewed (self-review)
- [ ] Manual Netlify setup required after merge
- [ ] GitHub branch protection configuration required after merge
