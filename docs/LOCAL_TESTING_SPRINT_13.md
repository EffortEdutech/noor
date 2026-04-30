# Local Testing — Sprint 13 Runtime CDN Mode

## 1. Apply patch

Copy the Sprint 13 patch into the repo root.

## 2. Install

```powershell
pnpm install
```

## 3. Prepare local CDN files

```powershell
pnpm content:validate
pnpm content:prepare
```

## 4. Run checks

```powershell
pnpm check:runtime
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm typecheck
pnpm build
```

## 5. Start local app

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

## 6. Test source switching

In Settings, find the Runtime Content Source card.

Test in this order:

1. Select `Mock fallback`.
2. Confirm diagnostics show mock mode.
3. Select `Local CDN`.
4. Confirm diagnostics show `ok` for local files.
5. Select `External CDN`.
6. Confirm unavailable endpoints fall back safely unless you configured real CDN URLs.
7. Reset to environment default.

## 7. Test reader pages

Open:

```text
http://localhost:3200/learn/quran
http://localhost:3200/learn/quran/1
http://localhost:3200/learn/tafseer
http://localhost:3200/learn/hadith
```

Confirm each page opens cleanly and shows the selected runtime source in the header subtitle.

## 8. Commit

```powershell
git status
git add .
git commit -m "feat: add runtime CDN source switching"
git push origin main
```
