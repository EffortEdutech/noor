# NOOR Sprint 7 — PWA Install, Offline Shell and Update Banner

Bismillah.

Sprint 7 turns NOOR into a proper installable PWA foundation.

## Goal

Add a local-first PWA lifecycle layer so users can:

- install NOOR as an app
- open NOOR from `/today`
- receive a visible update banner when a new service worker is ready
- load an offline fallback page when network navigation fails
- inspect app version and PWA status from Settings

## Included files

```text
apps/web/components/PwaLifecycleManager.tsx
apps/web/components/PwaStatusCard.tsx
apps/web/components/ClientShell.tsx
apps/web/app/settings/page.tsx
apps/web/lib/app-version.ts
apps/web/public/manifest.json
apps/web/public/sw.js
apps/web/public/offline.html
apps/web/public/version.json
docs/SPRINT_7_SCOPE.md
docs/LOCAL_TESTING_SPRINT_7.md
scripts/check-noor-pack.mjs
```

## What is intentionally included

- dependency-free service worker
- offline fallback shell
- browser install prompt capture
- update prompt with `SKIP_WAITING`
- app version metadata
- Settings PWA status panel

## What is intentionally not included yet

- full Quran/Tafseer/Hadith CDN pre-cache
- background sync
- push notifications
- paid analytics
- server-side user sync

Those belong to later content/data hardening sprints.

## Dev-mode note

The service worker is not registered during `pnpm dev` by default. This avoids stale cache problems while coding.

To test PWA properly:

```powershell
pnpm build
pnpm start
```

Then open:

```text
http://localhost:3200
```

For advanced testing only, SW can be enabled during dev with:

```powershell
$env:NEXT_PUBLIC_NOOR_PWA_IN_DEV="true"; pnpm dev
```

## Safety boundary

PWA update and offline behavior must not cache unverified religious rulings. Future CDN caching should cache verified static datasets only.
