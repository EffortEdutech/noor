# NOOR Patch Pack 28.7-09 — Icon Identity and Floating Buttons

## Why Vercel icon can differ from local

NOOR currently has multiple icon sources:

```text
HTML metadata icon: apps/web/app/layout.tsx -> /icons/noor-mark.svg
PWA manifest icon: apps/web/public/manifest.json -> /icons/noor-mark.svg
Visible topbar logo: packages/noor-ui/src/components/AppShell.tsx -> /icon-192.png
```

So the browser tab/PWA icon and the visible logo are not guaranteed to match.

Also, for the deployed Next app, the public files must exist under:

```text
apps/web/public/
```

The new icon must be committed here:

```text
apps/web/public/icons/09-spread-mark.png
```

This ZIP does not include your binary icon file. You already have it locally. Make sure it exists and is added to Git.

## Apply

Extract this ZIP into:

```text
C:\Users\user\Documents\00 Combo3\Noor
```

Then run:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Test-Path "apps\web\public\icons\09-spread-mark.png"

.\scripts\apply-sprint28-7-09-icon-identity-css.ps1
node .\scripts\validate-sprint28-7-09-icon-identity.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks the script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-7-09-icon-identity-css.ps1
```

## Browser QA

```powershell
pnpm --filter @noor/web dev -- --port 3200
```

Open:

```text
http://localhost:3200/icons/09-spread-mark.png
http://localhost:3200/manifest.json
http://localhost:3200/learn/quran/112
http://localhost:3200/learn/tafseer?surah=112
```

Check:

```text
- Browser tab icon points to 09-spread-mark.png.
- NOOR topbar logo uses the same icon.
- Quran floating navigator button uses the same icon.
- Tafseer floating navigator button uses the same icon.
- No missing image appears.
```

## Add, commit, and push after green

If you are also committing Patch 28.7-08 in the same batch, include those files too. For this patch, add:

```powershell
git add apps/web/app/layout.tsx `
        apps/web/public/manifest.json `
        apps/web/public/icons/09-spread-mark.png `
        packages/noor-ui/src/components/AppShell.tsx `
        apps/web/components/FloatingQuranNavigator.tsx `
        apps/web/components/FloatingTafseerNavigator.tsx `
        apps/web/components/FloatingTafseerNavigator.module.css `
        apps/web/app/globals.css `
        patches/sprint28-7-09-icon-identity.css `
        scripts/apply-sprint28-7-09-icon-identity-css.ps1 `
        scripts/validate-sprint28-7-09-icon-identity.mjs `
        docs/SPRINT_28_7_09_ICON_IDENTITY_AND_FLOATING_BUTTONS.md `
        README_PATCH_28_7_09.md

git commit -m "feat: align NOOR icon identity and floating navigators"
git push origin main
```

Do not add:

```text
apps/web/.env.local
apps/web/public/noor-cdn/
```

## Hard refresh after deploy

Browsers cache favicons/PWA icons strongly. After Vercel deployment, use:

```text
Ctrl + F5
```

or open a private window. For installed PWA, reinstall may be needed to refresh the app icon.
