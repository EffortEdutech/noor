# Local Testing — Sprint 28.1 Real Reading UX

## 1. Start from the real UX branch

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
git status
```

Expected branch:

```text
sprint/28-1-real-reading-ux
```

## 2. Copy patch files

Unzip the patch pack. Then copy the content of the `files` folder into the repo root.

Example:

```powershell
$Patch = "C:\Users\user\Downloads\noor-sprint28-1-real-reading-ux\files"
$Repo = "C:\Users\user\Documents\00 Combo3\Noor"

Copy-Item -Path "$Patch\*" -Destination $Repo -Recurse -Force
cd $Repo
```

## 3. Apply package scripts

```powershell
node scripts/apply-sprint28-1-package-scripts.mjs
```

This adds:

```text
check:real-reading-ux
check:sprint28-1
```

## 4. Run tests

```powershell
pnpm check:real-reading-ux
pnpm typecheck
pnpm build
```

Full sprint check:

```powershell
pnpm check:sprint28-1
```

## 5. Run browser test

```powershell
pnpm dev
```

Open:

```powershell
Start-Process "http://localhost:3200/today"
Start-Process "http://localhost:3200/learn"
Start-Process "http://localhost:3200/learn/quran"
Start-Process "http://localhost:3200/learn/quran/1"
Start-Process "http://localhost:3200/learn/tafseer"
Start-Process "http://localhost:3200/learn/hadith"
Start-Process "http://localhost:3200/explore"
Start-Process "http://localhost:3200/studio"
Start-Process "http://localhost:3200/library"
```

## 6. Manual UX checklist

Check these manually:

- Today feels like a daily companion, not a technical dashboard.
- Bottom nav shows Today, Learn, Explore, Studio, Library.
- Learn guides the user to read Quran first.
- Quran Surah page has Read, Study and Memorise modes.
- Study mode shows tafseer note when available.
- Memorise mode hides translation and tafseer.
- Ayah cards still support bookmark, mark current and share-card action.
- Tafseer page links back to Quran context.
- Hadith page feels like a reader, not a raw collection dump.
- Explore suggests guidance by topic.

## 7. Commit

```powershell
git status

git add packages/noor-config/src/index.ts `
        packages/noor-ui/src/components/HadithCard.tsx `
        apps/web/app/today/page.tsx `
        apps/web/app/learn/page.tsx `
        apps/web/app/learn/quran/page.tsx `
        apps/web/app/learn/quran/[surah]/page.tsx `
        apps/web/app/learn/tafseer/page.tsx `
        apps/web/app/learn/hadith/page.tsx `
        apps/web/app/explore/page.tsx `
        apps/web/app/library/page.tsx `
        apps/web/app/globals.css `
        apps/web/components/QuranReadingExperience.tsx `
        apps/web/components/AyahStudyCard.tsx `
        apps/web/components/ReaderPreferencesPanel.tsx `
        apps/web/components/SearchPanel.tsx `
        docs/SPRINT_28_1_REAL_READING_UX.md `
        docs/LOCAL_TESTING_SPRINT_28_1.md `
        scripts/apply-sprint28-1-package-scripts.mjs `
        scripts/check-sprint28-1-real-reading-ux.mjs `
        package.json

git commit -m "feat: add sprint 28.1 real reading UX foundation"
git push -u origin sprint/28-1-real-reading-ux
```

## 8. Manual PR

Open this URL in browser after pushing:

```text
https://github.com/EffortEdutech/noor/pull/new/sprint/28-1-real-reading-ux
```

Use this PR title:

```text
Sprint 28.1 — Real Reading UX Foundation
```
