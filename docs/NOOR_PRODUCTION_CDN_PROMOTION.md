# NOOR Production CDN v1 Promotion

Sprint 25 adds a safe production CDN promotion candidate layer.

The goal is not to publish real sacred content automatically. The goal is to prepare the exact report, environment preview and CI gate that will later allow NOOR to move from bundled content to external CDN mode after approval.

## What Sprint 25 adds

- `pnpm production:promote`
- `pnpm check:production-promotion`
- `content-pipeline/production-cdn/noor-production-cdn-promotion.json`
- `content-pipeline/production-cdn/noor-production-cdn-promotion.md`
- `content-pipeline/production-cdn/.env.noor-production-cdn.example`
- Settings card: `ProductionCdnPromotionCard`

## Current decision

Production promotion is blocked.

Reason:

- Quran review case is not approved.
- Tafseer review case is not approved.
- Hadith review case is not approved.
- Imported content reports are still fixture/importer-stage outputs.
- Runtime source must remain `bundled`.

## Manual future release path

1. Approve real Quran source.
2. Approve real tafseer source.
3. Approve real hadith source.
4. Capture reviewer sign-off.
5. Re-run importers against approved sources.
6. Build and smoke-test CDN pack.
7. Only then enable external CDN environment variables.
