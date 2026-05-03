# Local Testing — Sprint 28.2 Quran Reader UX v2

## Starting point

You should already be on a clean branch after Sprint 28.1:

```powershell
git status
```

Recommended branch:

```text
sprint/28-2-quran-reader-ux-v2
```

## Apply patch pack

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint28-2-quran-reader-ux-v2-patch-pack.zip" -DestinationPath "$env:USERPROFILE\Downloads" -Force

$Patch = "$env:USERPROFILE\Downloads\noor-sprint28-2-quran-reader-ux-v2\files"
$Repo = "C:\Users\user\Documents\00 Combo3\Noor"

Copy-Item -Path "$Patch\*" -Destination $Repo -Recurse -Force
cd $Repo
```

## Apply package scripts

```powershell
node scripts/apply-sprint28-2-package-scripts.mjs
```

## Automated checks

```powershell
pnpm check:quran-reader-ux-v2
pnpm typecheck
pnpm build
pnpm check:sprint28-2
```

## Browser testing

```powershell
pnpm dev
```

Open:

```powershell
Start-Process "http://localhost:3200/learn/quran/1"
Start-Process "http://localhost:3200/learn/quran/2"
Start-Process "http://localhost:3200/learn/quran/36"
```

## Manual checks

On `/learn/quran/1`:

- Click Read, Study and Memorise.
- Refresh the page and confirm the selected mode remains.
- Use the Ayah input and Jump button.
- Use the Surah map buttons.
- Copy an ayah.
- Copy a reference.
- Mark an ayah as current.
- Save an ayah bookmark.
- Confirm Study mode shows tafseer where available.
- Confirm Memorise mode hides translation and tafseer.

On `/learn/quran/2` or another longer Surah:

- Confirm the Surah map scrolls nicely.
- Confirm jumping to a later ayah works.
- Confirm mobile layout remains usable using browser responsive view.

## Commit

```powershell
git status

git add apps/web/app/learn/quran/[surah]/page.tsx `
        apps/web/app/globals.css `
        apps/web/components/QuranReadingExperience.tsx `
        apps/web/components/AyahStudyCard.tsx `
        docs/SPRINT_28_2_QURAN_READER_UX_V2.md `
        docs/LOCAL_TESTING_SPRINT_28_2.md `
        scripts/apply-sprint28-2-package-scripts.mjs `
        scripts/check-sprint28-2-quran-reader-ux-v2.mjs `
        package.json

git commit -m "feat: improve quran reader ux v2"
git push -u origin sprint/28-2-quran-reader-ux-v2
```

Manual PR URL:

```text
https://github.com/EffortEdutech/noor/pull/new/sprint/28-2-quran-reader-ux-v2
```
