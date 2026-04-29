# Local Testing — NOOR Sprint 6

## Start

```powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\Noor"
pnpm check:pack
pnpm dev
```

Open:

```text
http://localhost:3200/studio
```

## Test flow

1. Select **Daily Ayah**
2. Change the theme to **Emerald Night**
3. Edit the personal note
4. Click **Copy caption**
5. Click **Download SVG**
6. Click **Download caption**
7. Select **Manual Reminder**
8. Edit title, reference and body
9. Confirm preview updates
10. Save one bookmark elsewhere in NOOR
11. Return to Studio and confirm bookmark appears as a source

## Final checks

```powershell
pnpm typecheck
pnpm build
```

## Commit

```powershell
git status
git add .
git commit -m "feat: add Studio share export"
git push origin main
```
