# NOOR Master Roadmap

Version: 0.26.0

## Current phase

Phase 3 — Production content pipeline and source governance.

## Current sprint

### Sprint 26 — CDN search index

Generate and consume a lightweight search index from published CDN Quran, tafseer and hadith content while preserving bundled fallback safety.

## Completed foundation

- Sprint 18 — Roadmap control center
- Sprint 19 — Production source intake templates
- Sprint 20 — Quran importer adapter v1
- Sprint 21 — Quran production source selection gate
- Sprint 22 — Tafseer importer adapter v1
- Sprint 23 — Hadith importer adapter v1
- Sprint 24 — Scholarly review console
- Sprint 25 — Production CDN v1 promotion

## Next sprints

- Sprint 27 — Reader experience from approved content
- Sprint 28 — Quality assurance and regression hardening
- Sprint 29 — Public beta release candidate

## Sprint 26 commands

```powershell
pnpm content:prepare
pnpm search:build-cdn-index
pnpm cdn:pack
pnpm cdn:verify
pnpm roadmap:status
pnpm check:release
pnpm check:roadmap
pnpm check:pack
```

## Production rule

NOOR must not promote production content until Quran, tafseer and hadith source review gates are approved with license, attribution, checksum/integrity evidence and scholarly reviewer sign-off. External CDN runtime testing is allowed with demo/partial CDN content and bundled fallback enabled.
