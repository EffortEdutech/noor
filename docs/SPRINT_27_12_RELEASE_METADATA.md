# Sprint 27.12 — Release Metadata / Version Update

## Objective

Update NOOR release metadata after the Sprint 27 staging CDN acceptance and browser QA sequence.

This sprint does not promote `noor-cdn/main`. It only updates the app-facing version, changelog, release notes, roadmap metadata and local validation checks.

## Version

- App version: `0.27.12`
- Build label: `Sprint 27.12 — Release metadata and staging CDN QA`
- Release date: `2026-05-02`

## Included updates

- `apps/web/lib/app-version.ts`
- `apps/web/public/version.json`
- `CHANGELOG.md`
- `RELEASE_NOTES.md`
- `apps/web/lib/release-notes.ts`
- `apps/web/lib/roadmap.ts`
- `docs/NOOR_MASTER_ROADMAP.md`
- `scripts/generate-noor-roadmap.mjs`
- `scripts/check-noor-roadmap.mjs`
- `scripts/check-noor-release.mjs`
- `scripts/check-noor-pack.mjs`
- `scripts/apply-sprint27-12-package-scripts.mjs`

## Validation commands

```powershell
node scripts/apply-sprint27-12-package-scripts.mjs
pnpm roadmap:status
pnpm check:release
pnpm check:roadmap
pnpm check:pack
pnpm check:sprint27-11
pnpm check:sprint27-12
pnpm typecheck
pnpm build
```

## Browser verification

Start the app:

```powershell
pnpm dev -- --port 3200
```

Open:

```text
http://localhost:3200/settings
```

Expected:

```text
NOOR v0.27.12
Sprint 27.12 — Release metadata and staging CDN QA
```

## Production guard

Production remains blocked. `noor-cdn/main` must not be promoted in this sprint.
