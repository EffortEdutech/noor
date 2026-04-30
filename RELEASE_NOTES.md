# NOOR v0.13.0

Sprint 13 — Runtime CDN mode and source switching.

Released: 2026-04-30

## Highlights

- Added runtime source modes: `mock`, `local-cdn` and `cdn`.
- Added a Settings source switcher with cookie-based persistence.
- Added resolver diagnostics for manifest, content health, Quran, Tafseer and Hadith endpoints.
- Connected Quran, Tafseer, Hadith and Settings pages to the selected runtime source.
- Added `pnpm check:runtime` for local validation.

## How to test local CDN mode

1. Run `pnpm content:prepare`.
2. Run `pnpm dev`.
3. Open `http://localhost:3200/settings`.
4. Select `Local CDN` in the Runtime Content Source card.
5. Confirm resolver diagnostics show `ok` for local files.
6. Open `/learn/quran/1`, `/learn/tafseer` and `/learn/hadith`.

## Important production note

External CDN mode is fallback-safe, but should not be used as a production claim until the selected Quran, Tafseer and Hadith datasets have passed licensing, attribution, checksum and scholarly review gates.
