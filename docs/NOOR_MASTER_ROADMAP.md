# NOOR Master Blueprint & Roadmap

**Current version:** v0.19.0  
**Current sprint:** Sprint 19 — Production source intake templates  
**Local port:** 3200  
**Repository:** `https://github.com/EffortEdutech/noor`

---

## 1. Roadmap purpose

This document is the control document for NOOR after the Ilm-Mate replacement foundation. It keeps the team aligned on what has already been completed, what sprint is active now, and which future sprints are planned before real production Quran, tafseer and hadith content can be promoted.

NOOR is still local-first and zero-budget by default. Production content work must remain gated by source licensing, attribution and scholarly/reviewer sign-off.

---

## 2. Completed foundation

| Stage | Status | Summary |
| --- | --- | --- |
| Sprint 0-2 | Complete | Repo foundation, app shell, design system and Quran/Tafseer/Hadith data contracts. |
| Sprint 3-8 | Complete | Core reader, search, journeys, studio, PWA/offline shell and content integrity checks. |
| Sprint 9-11 | Complete | Reader preferences, local backup/reset, release automation, changelog and CI. |
| Sprint 12-17 | Complete | Content pipeline, runtime CDN mode, zero-budget CDN publish pack, smoke testing, promotion handoff and source governance gate. |
| Sprint 18 | Complete | Master roadmap, roadmap status generator and Settings Roadmap Control card. |

---

## 3. Current sprint

### Sprint 19 — Production source intake templates

Objective: create structured source intake records before the first real importer is built.

Sprint 19 adds:

- Quran source intake template.
- Tafseer source intake template.
- Hadith source intake template.
- Candidate source registry under `content-pipeline/source-intake/noor-source-candidates.json`.
- Source intake schema under `content-pipeline/schemas/noor-source-intake.schema.json`.
- `pnpm source:intake` validation and audit generation.
- `pnpm check:source-intake` local/CI check.
- Settings Source Intake card.

This sprint does **not** approve production sources and does **not** import real Quran, tafseer or hadith content yet.

---

## 4. Future sprint plan

| Sprint | Version | Target | Purpose |
| --- | --- | --- | --- |
| Sprint 20 | v0.20.0 | Quran importer adapter v1 | Normalize the first approved Quran source into NOOR CDN format. |
| Sprint 21 | v0.21.0 | Tafseer importer adapter v1 | Normalize approved tafseer source files into NOOR tafseer route format. |
| Sprint 22 | v0.22.0 | Hadith importer adapter v1 | Normalize approved hadith source files into collection route format. |
| Sprint 23 | v0.23.0 | Scholarly review workflow | Generate reviewer checklists and approval records linked to the source registry. |
| Sprint 24 | v0.24.0 | Production CDN release candidate | Package the first approved production-content CDN release candidate. |
| Sprint 25 | v0.25.0 | Learner accounts and sync planning | Plan optional Supabase sync while keeping local-first mode. |

---

## 5. Current control commands

Run these after applying Sprint 19:

```bash
pnpm install
pnpm source:intake
pnpm check:source-intake
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm check:cdn-smoke
pnpm cdn:promote
pnpm check:cdn-promotion
pnpm source:audit
pnpm check:source-audit
pnpm typecheck
pnpm build
```

`pnpm source:gate` should still fail until real sources are reviewed and approved.

---

## 6. Production content guardrails

1. Demo content remains blocked from production.
2. Candidate sources must remain separate from the existing demo CDN source registry.
3. No source can be promoted without license, attribution, checksum/import plan and reviewer sign-off.
4. Importers must not rewrite or guess religious content.
5. Every future sprint must update version, release notes, docs, Settings card and validation checks.

---

## 7. Sprint 20 readiness

Sprint 20 can begin once the Quran candidate record has at least:

- Source URL or internal source file path.
- License/permission decision.
- Attribution wording.
- Checksum/import plan.
- Reviewer role assigned.
- Import format notes.

