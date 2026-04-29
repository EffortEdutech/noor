# NOOR Sprint 11 — Release Automation + Changelog Center

## Goal

Make NOOR easier to maintain after every successful sprint by adding repeatable local release checks, a visible changelog, and GitHub Actions automation for CI and release creation.

## Added

1. GitHub Actions CI workflow.
2. GitHub Actions release workflow.
3. `pnpm check:release` validation script.
4. `pnpm release:bump <version> "label"` version helper.
5. `CHANGELOG.md`.
6. `RELEASE_NOTES.md`.
7. `/changelog` app page.
8. Settings release notes card.
9. App version update to `0.11.0`.

## GitHub Actions behavior

The release workflow runs on push to `main` and on manual dispatch. It reads:

```text
apps/web/public/version.json
```

If the matching tag already exists, the workflow skips release creation. If the tag does not exist, it creates:

```text
v0.11.0
```

and publishes a GitHub Release using `RELEASE_NOTES.md`.

## Future version command

For the next sprint, run:

```powershell
pnpm release:bump 0.12.0 "Sprint 12 — Your next sprint label"
```

Then manually update:

```text
apps/web/lib/release-notes.ts
CHANGELOG.md
RELEASE_NOTES.md
```

and run:

```powershell
pnpm check:release
```
