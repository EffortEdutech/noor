# Sprint 28.7-09 — Icon Identity and Floating Buttons

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-09

---

## 1. Problem

The Vercel deployed app can show a different HTML icon from the local visible NOOR logo because NOOR currently has multiple icon channels:

```text
HTML / browser metadata icon
PWA manifest icon
AppShell topbar logo
floating Quran navigator icon
floating Tafseer navigator icon
```

Before this patch, the metadata and manifest pointed to:

```text
/icons/noor-mark.svg
```

while the AppShell logo used:

```text
/icon-192.png
```

This made the browser favicon/PWA icon and visible app logo inconsistent.

---

## 2. Important Next.js Monorepo Rule

For the web app, files must be inside:

```text
apps/web/public/
```

A file under root:

```text
public/
```

is not guaranteed to be served by the deployed Next app when the active app is `apps/web`.

---

## 3. New Canonical Icon

The new canonical UI icon is:

```text
apps/web/public/icons/09-spread-mark.png
```

Served URL:

```text
/icons/09-spread-mark.png
```

---

## 4. Updated Surfaces

This patch aligns:

```text
apps/web/app/layout.tsx
apps/web/public/manifest.json
packages/noor-ui/src/components/AppShell.tsx
apps/web/components/FloatingQuranNavigator.tsx
apps/web/components/FloatingTafseerNavigator.tsx
apps/web/components/FloatingTafseerNavigator.module.css
apps/web/app/globals.css
```

---

## 5. Floating Navigator Buttons

Quran Reader:

```text
Q glyph button -> image icon button
```

Tafseer:

```text
T glyph button -> image icon button
```

The text labels are still available through accessible labels and screen-reader-hidden text.

---

## 6. QA Commands

```powershell
.\scripts\apply-sprint28-7-09-icon-identity-css.ps1
node .\scripts\validate-sprint28-7-09-icon-identity.mjs
pnpm --filter @noor/web build
```

Browser QA:

```text
/learn/quran/112
/learn/tafseer?surah=112
/manifest.json
/icons/09-spread-mark.png
```

---

## 7. Vercel Note

After deployment, Vercel will only show this new icon if the icon file is committed:

```text
apps/web/public/icons/09-spread-mark.png
```

Also hard refresh because favicons/PWA icons are aggressively cached by browsers.
