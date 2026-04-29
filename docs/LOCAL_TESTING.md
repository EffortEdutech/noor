# Local Testing Guide

## Start app

```powershell
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3200
```

## Check key routes

```text
/today
/learn
/learn/quran
/learn/quran/1
/learn/tafseer
/learn/hadith
/explore
/studio
/library
/settings
```

## Expected result

- NOOR shell loads
- bottom nav is visible
- Quran reader displays demo content
- search returns results for:
  - `mercy`
  - `fatiha`
  - `intention`
  - `ikhlas`
- bookmark button saves to local browser storage

## Reset bookmarks

Open browser devtools console and run:

```js
localStorage.removeItem('noor.bookmarks.v1')
location.reload()
```
