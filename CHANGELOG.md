# NOOR Changelog

## v0.14.0 — 2026-04-30

Sprint 14 — Zero-budget CDN publish pack.

### Added

- `pnpm cdn:pack` command to generate a clean publish folder at `content-pipeline/publish/noor-cdn-gh-pages`.
- `pnpm cdn:verify` command to verify required resolver paths and SHA-256 checksums.
- `pnpm check:cdn-publish` command for local and CI validation.
- Settings CDN publishing card with GitHub Pages and jsDelivr target bases.
- `docs/NOOR_CDN_PUBLISHING.md` deployment guide.

### Changed

- CI now checks runtime source switching and CDN publishing readiness.
- Runtime check now supports future app versions instead of being locked to Sprint 13 only.

### Notes

- This sprint prepares zero-budget hosting flow only.
- Production datasets still require licensing, attribution and scholarly review before they are published as real NOOR production data.

## v0.13.0 — 2026-04-30

Sprint 13 — Runtime CDN mode and source switching.

### Added

- Runtime content source modes: `mock`, `local-cdn` and `cdn`.
- Settings runtime source switcher with cookie-based persistence.
- Resolver diagnostics for manifest, content health, Quran, Tafseer and Hadith endpoints.
- `pnpm check:runtime` command.
- Local CDN mode using prepared files served from `apps/web/public/noor-cdn`.

### Changed

- Quran, Tafseer, Hadith and Settings pages now read the selected runtime content source.
- Data resolvers now accept optional source overrides and keep bundled fallback behavior.
- Data mode configuration now includes a dedicated `NEXT_PUBLIC_NOOR_LOCAL_CDN_BASE` setting.

### Notes

- External CDN mode remains fallback-safe until production datasets pass licensing, attribution and scholarly review.
- Local CDN mode is intended for localhost testing after `pnpm content:prepare` and `pnpm dev`.

## v0.12.0 — 2026-04-30

Sprint 12 — Production content pipeline and CDN source preparation.

### Added

- `content-pipeline/source/noor-demo-v0.12` CDN-ready source folder.
- Source registry with production promotion gate for licensing and scholarly/source review.
- CDN folder layout matching existing resolver paths:
  - `metadata/surah-index.json`
  - `quran/surahs/001.json`
  - `tafseer/demo-tafseer/surahs/001.json`
  - `hadith/collections.json`
  - `hadith/demo-nawawi/items.json`
- `pnpm content:validate` command.
- `pnpm content:prepare` command.
- Local public CDN output under `apps/web/public/noor-cdn` for resolver testing.
- Settings content pipeline card.
- `docs/NOOR_CONTENT_PIPELINE.md`.

### Notes

- This sprint prepares the pipeline and data shape only.
- Production Quran, tafseer and hadith datasets are still blocked by source licensing, attribution and scholarly review.

## v0.11.0 — 2026-04-30

Sprint 11 — Release automation and changelog center.

### Added

- GitHub Actions CI workflow for pack check, content check, release metadata check, typecheck and build.
- GitHub Actions release workflow that creates a GitHub Release from `apps/web/public/version.json` when a new version is pushed to `main`.
- `/changelog` page for visible release history.
- Settings release notes card.
- `pnpm check:release` validation command.
- `pnpm release:bump <version> "label"` helper command.

### Notes

- The release workflow creates a tag such as `v0.11.0` only if that tag does not already exist.
- Future version updates should keep `app-version.ts`, `version.json`, `CHANGELOG.md`, `RELEASE_NOTES.md` and `release-notes.ts` aligned.

## v0.10.0 — 2026-04-29

Sprint 10 — Local backup restore and reset center.

- Local backup export as JSON.
- Copy backup JSON to clipboard.
- Import backup JSON.
- Clear local NOOR data.
- Backup & Restore card in Settings.

## v0.9.0 — 2026-04-29

Sprint 9 — Reader preferences and Quran study controls.

- Translation mode controls.
- Arabic size controls.
- Transliteration and tafseer toggles.
- Focus mode.
- Reader preference panel in Quran reader and Settings.

## v0.8.0 — 2026-04-29

Sprint 8 — Content integrity and expanded demo content.

- Expanded demo Quran content.
- Content manifest and health report.
- Settings content integrity card.
- `pnpm check:content` command.
