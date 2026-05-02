# NOOR Sprint 27.10 — Staging CDN Acceptance Checklist

## Purpose

Sprint 27.10 is the formal staging acceptance gate before any `noor-cdn/main` promotion discussion.

This sprint does **not** promote production CDN content. It only answers:

> Is the `staging-ilm-mate-v1` CDN branch safe enough for reviewer/runtime testing?

## Scope

The checklist verifies:

1. A staging CDN root exists locally.
2. The local `noor-cdn` repository is on `staging-ilm-mate-v1` when available.
3. Manifest and health files exist.
4. Quran has 114 surahs and 6,236 ayat.
5. Tafseer has a CDN index and actual Tafseer files.
6. Hadith has both `by_book` and `by_chapter` views.
7. Hadith collection IDs are unique.
8. Search index exists.
9. Runtime `.env.local` points to staging, not `noor-cdn@main`.
10. Production promotion remains blocked.

## Commands

```powershell
pnpm cdn:staging-acceptance
pnpm check:cdn-staging-acceptance
pnpm check:sprint27-10
pnpm typecheck
pnpm build
```

## Output

Generated files:

```text
content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json
content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.md
```

## Decision Rule

If required checks pass:

```text
Staging accepted for reviewer/runtime testing only.
Production CDN remains blocked.
```

If any required check fails:

```text
Do not promote.
Fix staging data/app wiring first.
```

## Important

Do not push to `noor-cdn/main` in this sprint.
