# Sprint 28.7-01 â€” AI Reflection Buttons and Settings Refactor Foundation

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-01  
**Scope:** Settings refactor, language preference foundation, three AI buttons, and safe server-side OpenAI adapter.

---

## 1. Product Rule

NOOR AI is an assistant for reflection and Ishraqaration.

NOOR AI is **not**:

- a mufti
- a scholar
- an independent tafseer source
- a fatwa engine
- a hadith authentication engine

NOOR AI may generate only from the supplied source context:

- selected Quran ayah or passage
- available translation
- available tafseer
- related Quran ayat when NOOR has verified relation data
- related hadith when NOOR has verified relation data
- source labels and references supplied by NOOR

If source context is insufficient, the output must say so.

---

## 2. User-Facing AI Buttons

The foundation adds three buttons:

```text
Generate Reflection
Generate Ishraq Notes
Prepare Lesson
```

Each button uses a separate prompt structure.

### Generate Reflection

For personal learning and tadabbur support.

Expected structure:

1. Source-based summary
2. Reflection questions
3. Practical action
4. Reminder or caution
5. Sources used

### Generate Ishraq Notes

For teacher preparation.

Expected structure:

1. Main teaching point
2. Key Arabic phrase
3. Explanation from available tafseer
4. Related evidence from supplied sources
5. Discussion questions
6. Sources used

### Prepare Lesson

For halaqah or classroom planning.

Expected structure:

1. Lesson title
2. Learning objective
3. Opening question
4. Quran passage
5. Tafseer explanation from supplied source
6. Related hadith or related ayat if supplied
7. Activity or reflection
8. Closing reminder
9. Sources used

---

## 3. Language Foundation

Settings now includes a Language tab.

Language preferences are stored locally under:

```text
noor.platformPreferences.v1
```

Initial preferences:

- Interface language
- Quran translation language
- Tafseer language
- AI output language
- Fallback language

The AI assistant uses the Settings AI output language by default, with a local per-generation override.

---

## 4. Settings Page Refactor

The Settings page is now grouped into tabs:

1. Preferences
2. Language
3. AI Assistant
4. Content Source
5. System
6. Dev Log

The Dev Log tab holds developer-heavy cards such as importers, review consoles, CDN promotion, staging, roadmap, and pipeline controls.

---

## 5. Server-Side OpenAI Adapter

The browser never receives the API key.

Environment variables:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Do **not** use:

```env
NEXT_PUBLIC_OPENAI_API_KEY=
```

The API route is:

```text
POST /api/ai/reflection
```

When the API key is missing, the route returns a safe configuration-needed response instead of crashing.

---

## 6. Files Added

```text
apps/web/app/api/ai/reflection/route.ts
apps/web/components/AiSettingsPanel.tsx
apps/web/components/AiSourceAssistant.tsx
apps/web/components/AiSourceAssistant.module.css
apps/web/components/LanguageSettingsPanel.tsx
apps/web/components/SettingsTabs.tsx
apps/web/components/SettingsTabs.module.css
apps/web/lib/ai/islamic-ai-guardrails.ts
apps/web/lib/ai/openai-client.ts
apps/web/lib/ai/prompts.ts
apps/web/lib/ai/status.ts
apps/web/lib/ai/types.ts
apps/web/lib/platform-preferences.ts
```

---

## 7. Files Updated

```text
apps/web/app/settings/page.tsx
apps/web/app/learn/tafseer/page.tsx
apps/web/components/QuranReadingExperience.tsx
apps/web/components/TafseerTeachingActions.tsx
apps/web/.env.local.example
```

---

## 8. QA Checklist

Build:

```powershell
pnpm --filter @noor/web build
```

Browser checks:

```text
/settings
- Preferences tab shows reader preferences.
- Language tab shows platform language settings.
- AI Assistant tab shows configured/missing key state.
- Content Source tab shows runtime content source and CDN URLs.
- System tab shows version/PWA/local backup/content health.
- Dev Log tab contains developer pipeline cards.

/learn/quran/112
- 112:1 does not display Bismillah before the ayah text.
- Study mode shows the three AI buttons.

/learn/tafseer?surah=112
- Tafseer action area shows the three AI buttons.
- Arabic is RTL and right aligned.
- AI buttons return a safe missing-key response when OPENAI_API_KEY is empty.
```

---

## 9. Future Work

This patch creates the safe foundation.

Later patches can add:

- verified related ayah retrieval
- verified related hadith retrieval
- saved AI notes
- teacher export
- classroom lesson templates
- account-level settings sync

