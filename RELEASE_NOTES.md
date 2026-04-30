# NOOR Release Notes

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
