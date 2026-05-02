# NOOR Master Roadmap

Version: 0.27.12

## Current phase

Phase 3 — Staging CDN validation and release governance.

## Current sprint

### Sprint 27.12 — Release metadata and staging CDN QA

Update NOOR version metadata, changelog, release notes and roadmap after staging CDN acceptance and browser QA, while keeping production CDN promotion blocked.

## Completed foundation

- Sprint 18 — Roadmap control center
- Sprint 19 — Production source intake templates
- Sprint 20 — Quran importer adapter v1
- Sprint 21 — Quran production source selection gate
- Sprint 22 — Tafseer importer adapter v1
- Sprint 23 — Hadith importer adapter v1
- Sprint 24 — Scholarly review console
- Sprint 25 — Production CDN v1 promotion
- Sprint 26 — CDN search index
- Sprint 27.9.2 — Hadith view model navigation
- Sprint 27.9.3 — Tafseer/Hadith CDN reader stabilization
- Sprint 27.10 — Staging CDN acceptance checklist
- Sprint 27.11 — Staging browser QA

## Next sprints

- Sprint 28 — Quality assurance and regression hardening
- Sprint 29 — Public beta release candidate
- Sprint 30 — Production content promotion review

## Sprint 27.12 commands

```powershell
pnpm roadmap:status
pnpm check:release
pnpm check:roadmap
pnpm check:pack
pnpm check:sprint27-10
pnpm check:sprint27-11
pnpm check:sprint27-12
```

## Production rule

NOOR must not promote production content until Quran, tafseer and hadith source review gates are approved with license, attribution, checksum/integrity evidence and scholarly reviewer sign-off. External staging CDN runtime testing is allowed through `noor-cdn/staging-ilm-mate-v1` with production promotion blocked.
