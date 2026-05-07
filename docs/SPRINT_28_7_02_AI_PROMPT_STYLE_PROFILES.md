# Sprint 28.7-02 â€” AI Prompt Style Profiles and Talab an-Noor Workflow

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-02  
**Depends on:** 28.7-01 AI Reflection and Settings Foundation

---

## 1. Purpose

This patch adds AI writing style profiles and refactors the Quran/Tafseer AI workflow into one NOOR language pattern:

```text
Talab an-Noor
```

Talab an-Noor becomes the universal learner/teacher workspace name.

- In Quran Reader: **Talab an-Noor for this ayah**
- In Tafseer: **Talab an-Noor for Ishraqaration**

The setup is different on each surface, but the language is unified.

---

## 2. AI Writing Style Profiles

The Settings â†’ AI Assistant tab now includes:

```text
Default AI writing style
```

Available styles:

1. **Clear Modern**  
   Warm, readable, direct language for everyday learners.

2. **Gentle Kitab Style**  
   Traditional and soulful wording while remaining easy to understand.

3. **Deep Kitab Style**  
   More classical and literary. Suitable for advanced teaching drafts.

4. **Academic Teaching**  
   Structured, source-aware teaching language.

---

## 3. Kitab Style Safety Rule

The Kitab Style idea is accepted as a tone system, not as a religious source.

It may beautify expression only.

It must not:

- change meaning
- invent tafseer
- invent hadith
- issue fatwa
- imitate revelation
- override supplied source context

---

## 4. Tafseer Workflow Change

The old static **Action or reflection** line is removed.

Inside the Tafseer teaching area:

```text
Open Talab an-Noor
- Main point
- Key ayah phrase
- Lesson note
- Generate Reflection
- Generate Ishraq Notes
- Prepare Lesson
- Copy Ishraq note
```

The old **Explore topic** link is removed.

---

## 5. Quran Reader Workflow Change

The old wording:

```text
Open study tools for this ayah
```

is replaced by:

```text
Open Talab an-Noor for this ayah
```

The reader mode label becomes:

```text
Talab
```

Internally it still uses the existing `study` mode id to avoid unnecessary routing/storage migration.

The Quran ayah workspace is simplified around:

- source context
- available tafseer
- Generate Reflection
- Generate Ishraq Notes
- Prepare Lesson
- Copy ayah source note

Unnecessary study links are removed.

---

## 6. API Key Setup

Local development:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Copy-Item "apps\web\.env.local.example" "apps\web\.env.local" -ErrorAction SilentlyContinue
notepad "apps\web\.env.local"
```

Add:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Do not add:

```env
NEXT_PUBLIC_OPENAI_API_KEY=
```

Restart the dev server after editing `.env.local`.

---

## 7. Test API Status

After restarting dev server:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3200/api/ai/reflection"
```

Expected when key exists:

```text
configured : True
```

Expected when key is missing:

```text
configured : False
```

---

## 8. Browser QA

```text
/settings
- AI Assistant tab shows Default AI writing style.

/learn/quran/112
- Topbar mode shows Read / Meaning / Talab.
- Talab opens AI buttons.
- Generate Reflection works with configured key or shows safe missing-key response.

/learn/tafseer?surah=112
- Tafseer action area shows Open Talab an-Noor.
- Action or reflection static line is gone.
- Explore topic link is gone.
- AI buttons appear inside Talab an-Noor.
```

---

## 9. Files Updated

```text
apps/web/app/api/ai/reflection/route.ts
apps/web/app/learn/tafseer/page.tsx
apps/web/components/AiSettingsPanel.tsx
apps/web/components/AiSourceAssistant.tsx
apps/web/components/AiSourceAssistant.module.css
apps/web/components/QuranReadingExperience.tsx
apps/web/components/TafseerTeachingActions.tsx
apps/web/lib/ai/prompts.ts
apps/web/lib/ai/types.ts
apps/web/lib/platform-preferences.ts
docs/AI_ISLAMIC_GOVERNANCE_RULES.md
```

