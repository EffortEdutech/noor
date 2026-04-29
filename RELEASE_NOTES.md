# NOOR v0.11.0

Sprint 11 — Release automation and changelog center.

Released: 2026-04-30

## Highlights

- Added GitHub Actions CI for pack, content, release metadata, typecheck and build checks.
- Added automatic GitHub Release creation from `apps/web/public/version.json`.
- Added `/changelog` page and Settings release notes card.
- Added `pnpm check:release` to validate version metadata before push.
- Added `pnpm release:bump <version> "label"` helper for future releases.

## Release behavior

When a new version is pushed to `main`, the release workflow reads `apps/web/public/version.json`. If the tag does not exist, it creates a tag such as `v0.11.0` and publishes a GitHub Release using this file as the release body.
