# NOOR Patch Pack 28.7-04 — AI Source Context Enrichment and UI Cleanup

Apply this patch on branch:

```text
sprint/28-7-ai-reflection-settings
```

## 1. Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git status
```

Extract this ZIP into the NOOR repo root.

## 2. Build

```powershell
pnpm --filter @noor/web build
```

## 3. Browser QA

```powershell
pnpm --filter @noor/web dev -- --port 3200
```

Open:

```text
http://localhost:3200/settings
http://localhost:3200/learn/quran/112
http://localhost:3200/learn/tafseer?surah=112
http://localhost:3200/learn/tafseer?surah=87
```

Check:

```text
- "Open Talab an-Noor" is gone.
- Quran reader summary says "Talab an-Noor".
- Tafseer details summary says "Talab an-Noor".
- Main point / Key ayah phrase / Lesson note are removed from Tafseer Talab area.
- Copy Ishraq note copies source note correctly.
- Source summary uses " | " and not mojibake "Â·".
- Related ayat/hadith appear as "not supplied" unless verified data exists.
- Generate Reflection / Generate Teaching Notes / Prepare Lesson still work.
```

## 4. Commit

Do not add `apps/web/.env.local`.

```powershell
git add apps/web/app/learn/tafseer/page.tsx `
        apps/web/components/AiSourceAssistant.tsx `
        apps/web/components/AiSourceAssistant.module.css `
        apps/web/components/QuranReadingExperience.tsx `
        apps/web/components/TafseerTeachingActions.tsx `
        apps/web/lib/ai/source-context.ts `
        docs/SPRINT_28_7_04_AI_SOURCE_CONTEXT_ENRICHMENT.md `
        README_PATCH_28_7_04.md

git commit -m "feat: enrich AI source context and clean Talab an-Noor UI"
git push
```

## 5. Merge to Main After Branch Green

```powershell
git checkout main
git pull origin main
git merge sprint/28-7-ai-reflection-settings
pnpm --filter @noor/web build
git push origin main
```
