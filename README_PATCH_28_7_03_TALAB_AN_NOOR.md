# Sprint 28.7-03 â€” Talab an-Noor Language Rename

## Purpose

This patch pack renames the temporary AI/study workspace language from:

```text
Talab an-Noor
```

to:

```text
Talab an-Noor
```

This follows the NOOR language note:

```text
Talab an-Noor = The Seeking of Light
Talab = humble seeking / pursuit of knowledge
Noor = light, guidance, clarity
```

## UI language lock

Use these terms going forward:

| Old / temporary term | NOOR term |
|---|---|
| Talab an-Noor | Talab an-Noor |
| Talab | Talab |
| Study tools | Talab an-Noor tools |
| Ishraq | Ishraq |
| Copy Ishraq note | Copy Ishraq note |

## What this patch provides

This pack does not overwrite app files directly. It provides a controlled PowerShell script:

```text
scripts/rename-talab-to-talab-an-noor.ps1
```

The script updates known NOOR 28.7 files only:

```text
apps/web/app/learn/tafseer/page.tsx
apps/web/app/settings/page.tsx
apps/web/components/AiSettingsPanel.tsx
apps/web/components/AiSourceAssistant.tsx
apps/web/components/LanguageSettingsPanel.tsx
apps/web/components/QuranReadingExperience.tsx
apps/web/components/SettingsTabs.tsx
apps/web/components/TafseerTeachingActions.tsx
apps/web/lib/ai/prompts.ts
apps/web/lib/ai/types.ts
apps/web/lib/platform-preferences.ts
docs/AI_ISLAMIC_GOVERNANCE_RULES.md
docs/SPRINT_28_7_01_AI_REFLECTION_SETTINGS_FOUNDATION.md
docs/SPRINT_28_7_02_AI_PROMPT_STYLE_PROFILES.md
```

## Apply

From NOOR repo root:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git status
```

Copy the files from this patch pack into the repo root.

Optional dry run:

```powershell
.\scripts\rename-talab-to-talab-an-noor.ps1 -WhatIf
```

Apply:

```powershell
.\scripts\rename-talab-to-talab-an-noor.ps1
```

Build:

```powershell
pnpm --filter @noor/web build
```

Browser QA:

```text
http://localhost:3200/settings
http://localhost:3200/learn/quran/112
http://localhost:3200/learn/tafseer?surah=112
```

Check:

```text
Talab an-Noor is gone
Talab an-Noor appears for the AI/study workspace
Topbar short label uses Talab if there is limited space
Ishraq language uses Ishraq where appropriate
Generate Reflection works
Generate Ishraq Notes works
Prepare Lesson works
```

## Commit all 28.7 files after green

Do not include `apps/web/.env.local`.

Use:

```powershell
git add apps/web/.env.local.example `
        apps/web/app/api/ai/reflection/route.ts `
        apps/web/app/learn/tafseer/page.tsx `
        apps/web/app/settings/page.tsx `
        apps/web/components/AiSettingsPanel.tsx `
        apps/web/components/AiSourceAssistant.module.css `
        apps/web/components/AiSourceAssistant.tsx `
        apps/web/components/LanguageSettingsPanel.tsx `
        apps/web/components/QuranReadingExperience.tsx `
        apps/web/components/SettingsTabs.module.css `
        apps/web/components/SettingsTabs.tsx `
        apps/web/components/TafseerTeachingActions.tsx `
        apps/web/lib/ai/prompts.ts `
        apps/web/lib/ai/types.ts `
        apps/web/lib/platform-preferences.ts `
        docs/AI_ISLAMIC_GOVERNANCE_RULES.md `
        docs/SPRINT_28_7_01_AI_REFLECTION_SETTINGS_FOUNDATION.md `
        docs/SPRINT_28_7_02_AI_PROMPT_STYLE_PROFILES.md

git status
git commit -m "feat: add Talab an-Noor AI study workflow"
```

Push branch:

```powershell
git push -u origin sprint/28-7-ai-reflection-settings
```

Merge to main manually after review:

```powershell
git checkout main
git pull origin main
git merge sprint/28-7-ai-reflection-settings
pnpm --filter @noor/web build
git push origin main
```

