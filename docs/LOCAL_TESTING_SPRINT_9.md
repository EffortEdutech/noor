# Local Testing — NOOR Sprint 9

Run from the repo root:

```powershell
pnpm check:pack
pnpm check:content
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/learn/quran/1
http://localhost:3200/learn/quran/113
http://localhost:3200/settings
```

Manual test:

```text
1. Change translation mode.
2. Change Arabic size.
3. Hide/show tafseer.
4. Hide/show transliteration.
5. Toggle focus mode.
6. Refresh.
7. Confirm preferences persist.
```

Commit:

```powershell
git add .
git commit -m "feat: add reader preferences and Quran study controls"
git push origin main
```
