# AppShell Logo Icon Fix

Bismillah.

This patch fixes the broken NOOR logo text `âœ¦` by replacing the text glyph with the real icon from:

```txt
public/icon-192.png
```

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-appshell-logo-icon-fix.ps1
node .\scripts\validate-sprint28-6a2-appshell-logo-icon-fix.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks it:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-appshell-logo-icon-fix.ps1
```

## Commit

```powershell
git status
git add -A
git commit -m "Replace AppShell text mark with NOOR icon"
git pull --rebase origin main
git push origin main
```
