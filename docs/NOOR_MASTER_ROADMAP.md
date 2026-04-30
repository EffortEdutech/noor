# NOOR Master Blueprint & Roadmap

Version: v0.21.0

## Current Phase

Phase 3 — Production content pipeline and source governance.

## Current Sprint

### Sprint 21 — Quran production source selection gate

Create a Quran-specific source selection gate that keeps production import blocked until a real source, license, attribution, checksum plan and reviewer sign-off are complete.

## Completed Foundation

- Sprint 0 — Repo foundation + data contracts
- Sprint 1 — Design system + app shell
- Sprint 2 — Quran/Tafseer/Hadith CDN resolvers
- Sprint 3 — Quran reader foundation
- Sprint 4 — Explore/search foundation
- Sprint 5 — Journeys and reading progress
- Sprint 6 — NOOR Studio reminder foundation
- Sprint 7 — PWA install and offline UX
- Sprint 8 — Content integrity checks
- Sprint 9 — Release metadata and governance
- Sprint 10 — Reader preferences and settings polish
- Sprint 11 — Content health settings dashboard
- Sprint 11.5 — Master blueprint and roadmap consolidation
- Sprint 12 — Production content pipeline/CDN source preparation
- Sprint 13 — Runtime CDN mode and source switching
- Sprint 14 — Zero-budget CDN publish pack
- Sprint 15 — CDN smoke testing
- Sprint 16 — CDN promotion bundle
- Sprint 17 — Source governance
- Sprint 18 — Roadmap control center
- Sprint 19 — Production source intake templates
- Sprint 20 — Quran importer adapter v1

## Near-Term Roadmap

### Sprint 22 — Tafseer importer adapter v1

Normalize approved tafseer book data into NOOR CDN tafseer routes after source intake and approval gates are in place.

### Sprint 23 — Hadith importer adapter v1

Normalize approved hadith collection data into NOOR CDN hadith routes.

### Sprint 24 — Scholarly review console

Add reviewer checklist, sign-off metadata and source approval evidence UI.

### Sprint 25 — Production CDN v1 promotion

Publish approved content bundle to external CDN and switch runtime defaults carefully.

### Sprint 26 — Search index from production content

Generate a lightweight local search index from approved Quran, tafseer and hadith production content.

## Sprint 21 Command Set

```powershell
pnpm roadmap:status
pnpm quran:gate
pnpm check:quran-source-gate
pnpm quran:import
pnpm check:quran-import
pnpm check:roadmap
pnpm check:pack
```

## Production Content Principle

NOOR can support demo and fixture data during development, but production Islamic content must pass source, license, attribution, checksum and reviewer gates before promotion.
