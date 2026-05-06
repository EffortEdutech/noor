# Quran Mode Topbar Final Fix

Bismillah.

This correction makes the Quran reader mode switcher appear in the app topbar before Settings:

```txt
[NOOR]                         [Read] [Meaning] [Study] [Settings]
```

It removes the sticky in-page Read / Meaning / Study modebar and removes broken text artifacts from the reader line.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-quran-mode-topbar-final-fix.ps1
node .\scripts\validate-sprint28-6a2-quran-mode-topbar-final-fix.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks it:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-quran-mode-topbar-final-fix.ps1
```

## Commit

```powershell
git status
git add -A
git commit -m "Move Quran reader modes to app topbar"
git pull --rebase origin main
git push origin main
```
