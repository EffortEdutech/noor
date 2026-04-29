# Local Testing — Sprint 3

From the NOOR repo root:

```powershell
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3200/today
```

Test pages:

```text
/today
/learn/quran/1
/library
```

Recommended checks:

```powershell
pnpm typecheck
pnpm build
```

To reset local test data in the browser console:

```js
localStorage.removeItem('noor.bookmarks.v1')
localStorage.removeItem('noor.readingProgress.v1')
localStorage.removeItem('noor.readingHistory.v1')
location.reload()
```
