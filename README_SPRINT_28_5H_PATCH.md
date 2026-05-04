# NOOR Sprint 28.5H — Readable Learning UI + Quran Navigation

Bismillah.

This patch fixes the immediate UI direction problem:

- readable contrast across NOOR
- consistent light learning theme
- serious settings-style page structure
- `/learn` redesigned as simple learning sections
- `/learn/quran` redesigned as a clean Quran entry page
- Quran reader gets a floating Surah/Ayah navigator inspired by Tanzil/Quran.com navigation behaviour

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5h-readable-learning-ui-quran-nav.zip" -DestinationPath . -Force

powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5h-readable-learning-ui.ps1
```

## Test

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/learn
http://localhost:3200/learn/quran
http://localhost:3200/learn/quran/32#ayah-15
http://localhost:3200/learn/quran/55#ayah-71
```

## Visual rules locked

1. Never use bright text on bright backgrounds.
2. Never use dark text on dark backgrounds.
3. One NOOR theme must be used across all pages.
4. Page first screen must show what can be opened.
5. Detailed learning content stays hidden until user expands it.
6. Quran reader should stay calm, readable and navigable.
