# NOOR Changelog

## v0.19.0 — Sprint 19 Production source intake templates

- Added Quran, tafseer and hadith source intake templates.
- Added `content-pipeline/source-intake/noor-source-candidates.json` for real source candidate planning.
- Added `content-pipeline/schemas/noor-source-intake.schema.json`.
- Added `pnpm source:intake` to validate templates/candidates and generate an intake audit.
- Added `pnpm check:source-intake` for local and CI validation.
- Added Settings Source Intake card.
- Updated master roadmap so Sprint 19 is current and Sprint 20 Quran importer adapter v1 is next.
- Updated NOOR app version to v0.19.0.

## v0.18.0 — Sprint 18 Master roadmap and release control center

- Added `apps/web/lib/roadmap.ts` as the code-level master roadmap.
- Added Settings Roadmap Control card.
- Added `pnpm roadmap:status` to generate JSON and Markdown roadmap status outputs.
- Added `pnpm check:roadmap` for local and CI validation.
- Added master roadmap, Sprint 18 scope and local testing documentation.
- Updated NOOR app version to v0.18.0.

## v0.17.0 — Sprint 17 Source governance and production approval gate

- Added `pnpm source:audit`.
- Added generated source governance JSON and Markdown audit reports.
- Added `pnpm source:gate` as a manual production approval gate.
- Added `pnpm check:source-audit`.
- Added Settings Source Governance card.
- Added source governance documentation and CI validation.

## v0.16.0 — Sprint 16 CDN promotion bundle and environment handoff

- Added `pnpm cdn:promote <published-cdn-base>`.
- Added generated CDN promotion JSON, `.env.local` handoff and checklist outputs.
- Added `pnpm check:cdn-promotion`.
- Added Settings CDN Promotion card.
- Added CDN promotion documentation and CI validation.

## v0.15.0 — Sprint 15 CDN smoke testing and promotion gate

- Added `pnpm cdn:smoke` for local publish-pack smoke testing.
- Added remote CDN URL smoke testing for GitHub Pages and jsDelivr bases.
- Added Settings CDN Smoke Test card.
- Added `pnpm check:cdn-smoke` and CI smoke-test step.
- Added CDN promotion gate documentation.

## v0.14.0 — Sprint 14 Zero-budget CDN publish pack

- Added `pnpm cdn:pack`.
- Added `pnpm cdn:verify`.
- Added `pnpm check:cdn-publish`.
- Added CDN publishing card in Settings.
- Added GitHub Pages / jsDelivr publishing guide.

## v0.13.0 — Sprint 13 Runtime CDN mode and source switching

- Added runtime source modes: mock, local-cdn and cdn.
- Added Settings source switcher.
- Added resolver diagnostics.
- Connected Quran, Tafseer and Hadith pages to selected runtime source.

## v0.12.0 — Sprint 12 Production content pipeline and CDN source preparation

- Added source registry.
- Added CDN-ready content folder layout.
- Added content validation and preparation scripts.
- Added Settings content pipeline card.

## v0.11.0 — Sprint 11 Release automation and changelog center

- Added CI workflow.
- Added release workflow.
- Added changelog page.
- Added release notes card.
