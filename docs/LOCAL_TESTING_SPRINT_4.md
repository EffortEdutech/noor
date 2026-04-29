# NOOR Sprint 4 Local Testing

## 1. Start local app

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
pnpm dev
```

Open:

```text
http://localhost:3200/explore
```

## 2. Test search queries

Try:

```text
mercy
guidance
straight path
ikhlas
intention
refuge
Allah
1:1
Al-Fatihah
```

Expected result:

- Result cards appear.
- Each result shows content type, reference, excerpt, score and matched fields.
- Open button navigates to the relevant reader page.

## 3. Test filters

On `/explore`:

1. Disable Hadith.
2. Search `intention`.
3. Hadith results should disappear.
4. Enable Hadith again.
5. Results should return.

Do not disable all filters. The UI prevents the last active filter from being removed.

## 4. Test quick topics

Click:

```text
Mercy
Guidance
Tawhid
Intention
Protection
```

Expected result:

- Query changes automatically.
- Topic becomes active.
- Results update.

## 5. Test recent searches

1. Type `straight path`.
2. Press Enter or click Search.
3. Refresh page.
4. Recent searches should still show `straight path`.

Recent search storage key:

```text
noor.search.recent.v1
```

## 6. Run checks

```powershell
pnpm check:pack
pnpm typecheck
pnpm build
```

## 7. Commit

```powershell
git status
git add .
git commit -m "feat: upgrade Explore search experience"
git push origin main
```
