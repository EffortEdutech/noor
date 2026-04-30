# NOOR Release Notes

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
