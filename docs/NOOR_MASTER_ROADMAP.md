# NOOR Master Roadmap

Status: **LOCKED baseline for Sprint 18**  
Version: **v0.18.0**  
Local port: **3200**  
Repository: `https://github.com/EffortEdutech/noor`

## 1. Current Position

NOOR has completed the replacement foundation for Ilm-Mate:

- monorepo foundation,
- design system and app shell,
- Quran/Tafseer/Hadith data resolver contracts,
- local-first bookmarks, reading progress and journey progress,
- search, library, today page and studio reminders,
- PWA/offline shell,
- release notes and changelog automation,
- production content pipeline layout,
- runtime source switching,
- zero-budget CDN publish pack,
- CDN smoke testing,
- CDN promotion handoff,
- source governance and production approval gate.

The app is now ready for the next major phase: **real content intake and governed import preparation**.

## 2. Guardrails

1. NOOR remains local-first and zero-budget for Phase 1.
2. Demo content must never be labelled production-approved.
3. Real Quran, tafseer and hadith sources require licensing, attribution and scholarly/reviewer sign-off.
4. External CDN mode must only be used after smoke testing passes.
5. Every sprint must update version, release notes, docs, local testing instructions and validation checks.

## 3. Completed Sprint Groups

| Sprint | Version | Outcome |
|---|---:|---|
| Sprint 0-2 | 0.2.x | Repo foundation, design system, app shell and data contracts. |
| Sprint 3-8 | 0.8.0 | Reader, search, journeys, studio, PWA and content integrity. |
| Sprint 9-11 | 0.11.0 | Reader preferences, local backup, release automation and changelog. |
| Sprint 12 | 0.12.0 | Production content pipeline and CDN source preparation. |
| Sprint 13 | 0.13.0 | Runtime CDN mode and source switching. |
| Sprint 14 | 0.14.0 | Zero-budget CDN publish pack. |
| Sprint 15 | 0.15.0 | CDN smoke testing and promotion gate. |
| Sprint 16 | 0.16.0 | CDN promotion bundle and environment handoff. |
| Sprint 17 | 0.17.0 | Source governance and production approval gate. |
| Sprint 18 | 0.18.0 | Master roadmap and release control center. |

## 4. Immediate Next Sprint

### Sprint 19 — Production Source Intake Templates

Goal: prepare source intake records before building real import adapters.

Included:

- Quran source intake template,
- tafseer source intake template,
- hadith source intake template,
- candidate source registry schema,
- validation script for candidate intake,
- Settings visibility for source intake status.

Not included:

- importing real production text,
- approving any source automatically,
- replacing the demo CDN.

## 5. Future Sprint Plan

| Sprint | Version | Title | Purpose |
|---|---:|---|---|
| 19 | 0.19.0 | Production source intake templates | Capture candidate source details, licensing, attribution and reviewer requirements. |
| 20 | 0.20.0 | Quran importer adapter v1 | Normalize an approved Quran source into NOOR CDN resolver format. |
| 21 | 0.21.0 | Tafseer importer adapter v1 | Normalize an approved tafseer source into NOOR CDN resolver format. |
| 22 | 0.22.0 | Hadith importer adapter v1 | Normalize an approved hadith source into NOOR CDN resolver format. |
| 23 | 0.23.0 | Scholarly review workflow | Generate reviewer checklist and approval records tied to the source registry. |
| 24 | 0.24.0 | Production CDN release candidate | Package and smoke-test the first production content CDN release candidate. |
| 25 | 0.25.0 | Optional learner accounts and sync planning | Design optional Supabase sync while keeping local-first usage as default. |

## 6. Phase 1 Target

Phase 1 is considered complete when:

- NOOR can run locally and on Vercel,
- demo mode and production CDN mode are clearly separated,
- real source candidates are documented,
- content importers exist behind governance gates,
- the first production CDN release candidate passes smoke testing,
- source licensing, attribution and scholarly review are auditable.
