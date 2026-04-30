# NOOR Changelog

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
