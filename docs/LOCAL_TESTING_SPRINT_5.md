# NOOR Sprint 5 — Local Testing

## Run

```powershell
pnpm check:pack
pnpm dev
```

Open:

```text
http://localhost:3200/journeys
```

## Test flow

1. Open `/journeys`
2. Open `Foundations of NOOR`
3. Mark step 1 complete
4. Refresh page
5. Confirm step remains completed
6. Mark another step complete
7. Open `/today`
8. Confirm Continue Journey card appears
9. Open `/library`
10. Confirm Journey progress appears
11. Open `/explore`
12. Search:
   - journey
   - foundations
   - prayer
   - protection
   - intention

## Final checks

```powershell
pnpm typecheck
pnpm build
```

## Commit

```powershell
git status
git add .
git commit -m "feat: add guided journeys and local journey progress"
git push origin main
```
