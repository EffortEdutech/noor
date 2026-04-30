# NOOR Master Blueprint & Roadmap

Version: v0.20.0  
Current sprint: Sprint 20 — Quran importer adapter v1

## Current Phase

Phase 3 — Production content pipeline and source governance.

## Completed Foundation

NOOR has completed the zero-budget foundation:

1. app shell and design system,
2. Quran reader foundation,
3. journeys and progress,
4. Studio reminders,
5. PWA install/update support,
6. local content validation,
7. release metadata,
8. runtime CDN mode,
9. zero-budget CDN publish/smoke/promotion flow,
10. source governance,
11. roadmap control,
12. production source intake templates.

## Sprint 20 Current Work

Sprint 20 creates the first Quran importer adapter.

This sprint is deliberately not a production content sprint. It is an adapter and governance sprint.

### Deliverables

- Quran import adapter
- Quran import validation
- generated CDN-style Quran output
- generated import audit
- Settings Quran Import card
- release v0.20.0
- roadmap status update

## Sprint 21 Next Work

Sprint 21 — Quran production source selection gate.

Goal:

- evaluate the real Quran source candidate,
- confirm license and attribution,
- record checksum/import plan,
- define reviewer sign-off path,
- decide whether production Quran import can proceed or must remain blocked.

## Future Sprint Plan

| Sprint | Focus |
|---|---|
| Sprint 21 | Quran production source selection gate |
| Sprint 22 | Tafseer importer adapter v1 |
| Sprint 23 | Hadith importer adapter v1 |
| Sprint 24 | Scholarly review console |
| Sprint 25 | Production CDN v1 promotion |

## Command Set

```bash
pnpm roadmap:status
pnpm quran:import
pnpm check:quran-import
pnpm check:roadmap
pnpm check:pack
```
