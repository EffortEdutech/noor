# NOOR Master Roadmap

Version: 0.24.0  
Current phase: Phase 3 — Production content pipeline and source governance

## Current Sprint

### Sprint 24 — Scholarly review console

Add reviewer checklist, sign-off metadata and source approval evidence UI so production Quran, tafseer and hadith promotion stays blocked until documented review evidence is complete.

## Completed foundation

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
- Sprint 12 — Production content pipeline / CDN source preparation
- Sprint 13 — Runtime CDN mode + source switching
- Sprint 14 — Zero-budget CDN publish pack
- Sprint 15 — CDN smoke testing
- Sprint 16 — CDN promotion bundle
- Sprint 17 — Source governance
- Sprint 18 — Roadmap control center
- Sprint 19 — Production source intake templates
- Sprint 20 — Quran importer adapter v1
- Sprint 21 — Quran production source selection gate
- Sprint 22 — Tafseer importer adapter v1
- Sprint 23 — Hadith importer adapter v1

## Next Sprints

### Sprint 25 — Production CDN v1 promotion

Publish approved content bundle to external CDN and switch runtime defaults carefully after review gates are satisfied.

### Sprint 26 — Search index from production content

Generate a lightweight local search index from approved Quran, tafseer and hadith production content.

### Sprint 27 — Reader experience from approved content

Connect imported approved content into richer reading, tafseer and hadith study journeys.

### Sprint 28 — Quality assurance and regression hardening

Add content QA reports, route regression checks and release candidate hardening.

## Sprint 24 Commands

```bash
pnpm review:console
pnpm check:review-console
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:release
pnpm typecheck
pnpm build
```
