# NOOR Patch Pack 28.7-09B — Correct Icon Scope and Layout Import Hotfix

## What this fixes

Correct rule:

```text
App icon / HTML icon / topbar NOOR logo:
  apps/web/public/icons/noor-mark.svg

Floating Quran and Tafseer navigator buttons:
  apps/web/public/icons/09-spread-mark.png
```

It also changes the layout import to:

```ts
import { ClientShell } from '@/components/ClientShell';
```

## Apply

Extract this ZIP into:

```text
C:\Users\user\Documents\00 Combo3\Noor
```

Then run:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Test-Path "apps\web\public\icons\noor-mark.svg"
Test-Path "apps\web\public\icons\09-spread-mark.png"
Test-Path "apps\web\components\ClientShell.tsx"

node .\scripts\validate-sprint28-7-09-icon-identity.mjs
pnpm build
```

## Browser QA

```powershell
pnpm --filter @noor/web dev -- --port 3200
```

Open:

```text
http://localhost:3200/icons/noor-mark.svg
http://localhost:3200/icons/09-spread-mark.png
http://localhost:3200/manifest.json
http://localhost:3200/learn/quran/112
http://localhost:3200/learn/tafseer?surah=112
```

Check:

```text
- App/browser/PWA icon uses noor-mark.svg.
- Topbar NOOR logo uses noor-mark.svg.
- Quran floating navigator uses 09-spread-mark.png.
- Tafseer floating navigator uses 09-spread-mark.png.
- Build is green.
```

## Commit after green

If you are committing 28.7-08 and 28.7-09 together, include their files too. For this hotfix add:

```powershell
git add apps/web/app/layout.tsx `
        apps/web/public/manifest.json `
        packages/noor-ui/src/components/AppShell.tsx `
        scripts/validate-sprint28-7-09-icon-identity.mjs `
        docs/SPRINT_28_7_09B_ICON_SCOPE_CORRECTION.md `
        README_PATCH_28_7_09B.md

git commit -m "fix: correct NOOR icon scope and layout import"
git push origin main
```

Do not add:

```text
apps/web/.env.local
apps/web/public/noor-cdn/
```
