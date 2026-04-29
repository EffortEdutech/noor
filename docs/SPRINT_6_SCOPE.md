# NOOR Sprint 6 — Studio Share Export

Bismillah.

Sprint 6 upgrades `/studio` from a placeholder route into a local-first reminder creation tool.

## Goal

Allow users to turn a selected ayah, hadith, bookmark, or manual reminder into:

- a preview card
- a ready caption
- a downloadable SVG reminder card
- a downloadable text caption
- a device-native share action where supported

## Why SVG first?

The Sprint 6 export is intentionally zero-budget and dependency-free.

No paid API, server rendering, image service, or third-party canvas package is required.

## Included files

```text
apps/web/app/studio/page.tsx
apps/web/components/StudioShareComposer.tsx
apps/web/lib/studio-share.ts
docs/SPRINT_6_SCOPE.md
docs/LOCAL_TESTING_SPRINT_6.md
scripts/check-noor-pack.mjs
```

## User flow

```text
Open /studio
Choose source
Choose theme
Choose target platform
Edit short note
Preview card
Copy caption / Share / Download SVG / Download caption
```

## Source options

```text
Daily Ayah
Daily Hadith
Recent bookmarks
Manual Reminder
```

## Themes

```text
NOOR Gold
Emerald Night
Paper Light
```

## Safety boundary

NOOR Studio is a formatting and sharing tool.

It should not generate fatwa, religious rulings, or unsourced claims. Future Studio packs should use verified references and controlled templates.
