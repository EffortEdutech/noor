# NOOR Release Notes

## v0.19.0 — Sprint 19 Production source intake templates

Sprint 19 prepares NOOR for real production content work without importing any real source yet. It gives the project a clean intake layer for Quran, tafseer and hadith source candidates before Sprint 20 importer work starts.

### Highlights

- Quran, tafseer and hadith source intake templates are now committed under `content-pipeline/source-intake/templates/`.
- A separate candidate source registry lives at `content-pipeline/source-intake/noor-source-candidates.json`.
- `pnpm source:intake` validates templates/candidates and generates JSON + Markdown audit files.
- `pnpm check:source-intake` validates the Sprint 19 files, app version, Settings card and CI wiring.
- Settings now shows a Source Intake card.
- Master roadmap now marks Sprint 19 as current and Sprint 20 Quran importer adapter v1 as next.

### Important production rule

Sprint 19 is only an intake sprint. It does not approve sources, does not import production text and does not bypass the existing `source:gate` production block.

## v0.18.0 — Sprint 18 Master roadmap and release control center

Sprint 18 prevents roadmap confusion by making NOOR's completed work, current sprint and future production-content path visible in docs, Settings and CI.

### Highlights

- `apps/web/lib/roadmap.ts` defines completed, current and future sprint stages.
- Settings now shows the Roadmap Control card.
- `pnpm roadmap:status` generates `content-pipeline/roadmap/noor-roadmap-status.json` and `content-pipeline/roadmap/noor-roadmap-status.md`.
- `pnpm check:roadmap` validates Sprint 18 metadata and generated roadmap outputs.
- `docs/NOOR_MASTER_ROADMAP.md` documents the future sprint path from source intake to production CDN release candidate.

## v0.17.0 — Sprint 17 Source governance and production approval gate

Sprint 17 adds the production safety layer before NOOR moves from demo content into real Quran, tafseer and hadith datasets.

### Highlights

- `pnpm source:audit` validates the source registry and generates local audit reports.
- Generated reports are written to `content-pipeline/audit/noor-source-audit.json` and `content-pipeline/audit/noor-source-audit.md`.
- `pnpm source:gate` is a manual production gate and is expected to fail while sources remain demo-only or not-production-approved.
- `pnpm check:source-audit` validates Sprint 17 metadata, scripts and Settings integration.
- Settings now shows the Source Governance card.

## v0.16.0 — Sprint 16 CDN promotion bundle and environment handoff

Sprint 16 adds the missing handoff between "the published CDN URL passed smoke test" and "the app can be safely configured to use that URL".

### Highlights

- `pnpm cdn:promote <published-cdn-base>` generates a promotion bundle.
- The bundle includes `noor-cdn-promotion.json`, `noor-cdn.env.local`, and a manual checklist.
- `pnpm check:cdn-promotion` validates the Sprint 16 promotion files and metadata.
- Settings now shows the CDN Promotion card.
- CI now checks promotion readiness after the local CDN smoke test.

## v0.15.0 — Sprint 15 CDN smoke testing and promotion gate

Sprint 15 adds the missing safety gate between "we generated a CDN publish pack" and "we trust this URL as a runtime data source".

### Highlights

- `pnpm cdn:smoke` checks required resolver files from the local publish pack by default.
- `pnpm cdn:smoke <url>` checks the same files from GitHub Pages or jsDelivr.
- `pnpm check:cdn-smoke` is added for CI/local validation.
- Settings now shows the CDN Smoke Test card.
- NOOR now has a clearer promotion gate before switching to external CDN mode.

## v0.14.0 — Sprint 14 Zero-budget CDN publish pack

Added a repeatable publish folder for GitHub Pages and jsDelivr.

## v0.13.0 — Sprint 13 Runtime CDN mode and source switching

Added runtime source switching for mock, local CDN and external CDN modes.

## v0.12.0 — Sprint 12 Production content pipeline and CDN source preparation

Added content preparation and validation pipeline.
