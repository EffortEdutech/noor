# Sprint 28.6A.2 Hotfix - AppShell Logo Icon Fix

## Problem

The NOOR topbar logo rendered broken text:

```txt
âœ¦
NOOR
Daily Islamic Companion
```

This is mojibake. It was probably originally a decorative text glyph such as `✦`, but it was saved or interpreted with the wrong encoding.

## Fix

Do not use a text glyph for the app logo.

The AppShell now renders:

```tsx
<img className="noor-mark-img" src="/icon-192.png" alt="" width="42" height="42" />
```

The icon already exists in the public folder.

## Files

- `packages/noor-ui/src/components/AppShell.tsx`
- `apps/web/app/globals.css`

## Why `/icon-192.png`

It is part of the existing PWA icon set and is safe to serve from the app root.
