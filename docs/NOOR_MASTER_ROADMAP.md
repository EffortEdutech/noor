# NOOR Master Roadmap

Version: 0.25.0

## Current phase

Phase 3 — Production content pipeline and source governance.

## Current sprint

### Sprint 25 — Production CDN v1 promotion

Generate a safe production CDN v1 promotion candidate and environment preview while keeping runtime defaults bundled until scholarly review and source gates are approved.

## Completed foundation

- Sprint 18 — Roadmap control center
- Sprint 19 — Production source intake templates
- Sprint 20 — Quran importer adapter v1
- Sprint 21 — Quran production source selection gate
- Sprint 22 — Tafseer importer adapter v1
- Sprint 23 — Hadith importer adapter v1
- Sprint 24 — Scholarly review console

## Next sprints

- Sprint 26 — Search index from production content
- Sprint 27 — Reader experience from approved content
- Sprint 28 — Quality assurance and regression hardening
- Sprint 29 — Public beta release candidate

## Sprint 25 commands

```powershell
pnpm production:promote
pnpm check:production-promotion
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
```

## Production rule

NOOR must not switch to external CDN mode until Quran, tafseer and hadith source review gates are approved with license, attribution, checksum/integrity evidence and scholarly reviewer sign-off.
