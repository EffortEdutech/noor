# NOOR Replacement Blueprint v1

**Project:** NOOR — replacement for Ilm-Mate  
**Old repo:** `https://github.com/EffortEdutech/muslim-companion-poc`  
**New repo:** `https://github.com/EffortEdutech/noor`  
**Status:** Master product + technical direction for rebuild  
**Prepared for:** Effort Edutech / Darya Malak  

---

## 1. Executive Decision

NOOR should not be a simple rename of Ilm-Mate.

NOOR should be rebuilt as a **zero-budget, offline-first Islamic knowledge companion** for Quran, Tafseer, Hadith, learning journeys, personal practice, and teaching support.

The existing Ilm-Mate POC proves useful foundations:

- Quran browsing
- Tafseer linking
- Hadith reading
- Unified search
- PWA direction
- Reader preferences
- Bookmarks / last reading context

But the new NOOR should fix the deeper product problem:

> Ilm-Mate is currently content-first. NOOR must become user-intent-first.

Old mental model:

```text
Quran → Tafseer → Hadith → Search
```

New mental model:

```text
Today → Learn → Explore → Practice → Teach → Library
```

This makes NOOR feel like a daily companion, not only a static Islamic reference app.

---

## 2. Product Positioning

### 2.1 NOOR is not

NOOR is not:

- a fatwa chatbot
- a generic AI assistant with Islamic branding
- a heavy social media app
- a content dump
- a Quran-only reader
- a paid SaaS dependency in Phase 1

### 2.2 NOOR is

NOOR is:

> A guided Islamic knowledge companion that helps Muslims read, understand, remember, reflect, practise, and teach from Quran, Tafseer, and Hadith.

### 2.3 Core promise

```text
Open NOOR every day.
Receive light.
Read with understanding.
Save what touches the heart.
Continue your journey.
Share and teach with confidence.
```

### 2.4 Brand feeling

NOOR should feel:

- calm
- trustworthy
- beautiful
- scholarly but approachable
- daily-use friendly
- emotionally warm
- non-judgmental
- suitable for learners, parents, teachers, students, and general Muslims

---

## 3. Main Product Pillars

NOOR should be built around 7 pillars.

| Pillar | Purpose |
|---|---|
| Today | Daily ayah, hadith, reminder, continue reading, journey progress |
| Learn | Quran, Tafseer, Hadith, structured learning paths |
| Explore | Search, topics, cross-references, related ayat and hadith |
| Practice | Dhikr, dua, prayer habits, memorisation support |
| Reflect | Personal notes, saved ayat, saved hadith, heart journal |
| Teach | Share cards, lesson preparation, khutbah / tazkirah helper |
| Library | Bookmarks, collections, downloaded/offline content |

For MVP, the most important pillars are:

1. Today
2. Learn
3. Explore
4. Library

Practice, Reflect, and Teach can start small and grow.

---

## 4. Recommended App Navigation

### 4.1 Mobile bottom navigation

```text
Today | Learn | Explore | Studio | Library
```

### 4.2 Why this is better than Quran/Tafseer/Hadith tabs

A Quran/Tafseer/Hadith tab structure is logical for developers, but not always emotionally engaging for users.

A user opens the app asking:

- What should I read today?
- Where did I stop?
- What does this ayah mean?
- Is there a hadith related to this topic?
- Can I save this?
- Can I share this beautifully?
- Can I teach this to my family or class?

So the navigation should match user intent.

### 4.3 Route structure

```text
/
/today
/learn
/learn/quran
/learn/quran/[surah]
/learn/quran/[surah]/[ayah]
/learn/tafseer
/learn/tafseer/[book]
/learn/tafseer/[book]/[surah]
/learn/hadith
/learn/hadith/[collection]
/learn/hadith/[collection]/[book]
/explore
/explore/search
/explore/topics
/explore/topics/[slug]
/journeys
/journeys/[slug]
/studio
/studio/share-card
/library
/library/bookmarks
/library/reflections
/settings
```

For Phase 1, implement only:

```text
/today
/learn
/learn/quran
/learn/quran/[surah]
/explore/search
/library/bookmarks
/settings
```

---

## 5. Home Screen: Today With Allah

The most important screen is **Today**.

This is the habit loop.

### 5.1 Today screen layout

```text
Assalamualaikum 🌙
Today is a new opening of mercy.

[ Continue Reading ]
Surah Al-Mulk · Ayah 7
Resume

[ Daily Ayah ]
Arabic
Translation
Buttons: Read | Tafseer | Save | Share

[ Daily Hadith ]
Hadith text
Source
Buttons: Read | Save | Share

[ Journey Progress ]
Understanding Surah Al-Fatihah
3 of 7 lessons completed
Continue

[ Quick Practice ]
Morning adhkar
Evening adhkar
Dua for anxiety
Dhikr counter
```

### 5.2 Dopamine loops without gamification excess

NOOR should avoid childish points, but still reward consistency.

Use gentle signals:

- “3 days of reading this week”
- “You completed Surah Al-Fatihah journey”
- “5 saved reflections”
- “Continue where your heart stopped”
- “You returned to this ayah 4 times”

Use “light” language instead of aggressive streak language.

Example:

```text
Your light this week
4 readings · 2 reflections · 1 journey completed
```

---

## 6. Quran Experience

### 6.1 Quran modes

The Quran module should support 3 modes.

| Mode | Purpose |
|---|---|
| Read | clean reading experience |
| Study | translation, tafseer, notes, related hadith |
| Memorise | repetition, hide/reveal, audio loop later |

Phase 1 should build Read + basic Study.

### 6.2 Surah reader layout

```text
Surah Al-Fatihah
الفاتحة
The Opening · Makki · 7 ayat

[ Reader Controls ]
Arabic style | Translation | Tafseer | Font size

Ayah Card
Arabic
Transliteration optional
Translation
Actions: Tafseer | Save | Note | Share
```

### 6.3 Ayah card actions

Each ayah should support:

- open tafseer
- copy text
- save bookmark
- add reflection
- share as image/card
- view related hadith
- view topic tags

### 6.4 Translation approach

Start with:

- Arabic Uthmani
- English Sahih International
- Malay Basmeih
- transliteration optional

Later add:

- Indonesian
- Urdu
- more English translations

---

## 7. Tafseer Experience

### 7.1 Tafseer should not be hidden

In old reader apps, tafseer is often a button.

In NOOR, tafseer should feel like guided understanding.

### 7.2 Tafseer layout

```text
Ayah
Translation

Understanding
- Short explanation
- Full tafseer
- Related ayat
- Related hadith
- Reflection prompt
```

### 7.3 Multi-format tafseer support

Tafseer data may be:

- one entry per ayah
- one entry for a range of ayat
- one surah-level essay
- mixed commentary with headings

So NOOR should use a flexible tafseer schema.

Suggested schema:

```json
{
  "bookId": "ibn-kathir-en",
  "surah": 113,
  "entries": [
    {
      "id": "113-1-5-a",
      "fromAyah": 1,
      "toAyah": 5,
      "title": "Seeking refuge from evil",
      "body": "...",
      "source": "...",
      "language": "en",
      "tags": ["protection", "refuge"]
    }
  ]
}
```

This supports Celik Tafsir-style long-form content later.

---

## 8. Hadith Experience

### 8.1 Hadith should be searchable and thematic

Hadith should not only be a book browser.

NOOR should support:

- browse by collection
- browse by book/chapter
- search by keyword
- search by narrator
- topic exploration
- related hadith from ayah/topic

### 8.2 Initial hadith collections

Recommended Phase 1/2:

- Sahih Bukhari
- Sahih Muslim
- Riyad as-Salihin
- 40 Nawawi

Start with smaller curated collections before huge corpora.

### 8.3 Hadith card

```text
Hadith title / number
Narrator
Arabic text optional
English / Malay translation
Source grading/source reference
Actions: Save | Copy | Share | Related Quran
```

---

## 9. Explore and Search

### 9.1 Search should be central

Search is the user’s discovery gateway.

Search should support:

- Quran
- Tafseer
- Hadith
- topics
- saved notes/reflections

### 9.2 Search tabs

```text
All | Quran | Tafseer | Hadith | Topics | My Library
```

### 9.3 Smart search examples

```text
mercy
patience
2:255
ayat about rizq
hadith about intention
Surah Al-Kahf
قل أعوذ
```

### 9.4 Cross-reference discovery

For selected Quran ayat, show:

- tafseer entries
- hadith references
- topic tags
- related ayat
- saved reflections

This is where NOOR becomes more than a reader.

---

## 10. Library

The Library is the user’s personal space.

### 10.1 Library sections

```text
Bookmarks
Reflections
Collections
Downloaded content
Reading history
Shared cards
```

### 10.2 Local-first storage

Phase 1 should use browser local storage / IndexedDB.

Suggested storage:

- IndexedDB for bookmarks, notes, reading progress, offline chunks
- localStorage only for small settings

Future optional sync:

- Supabase Auth
- Supabase Postgres
- user account sync

But do not require Supabase for Phase 1.

---

## 11. Studio / Teaching Tools

Studio can start small.

### 11.1 Share card generator

User selects an ayah or hadith and generates a beautiful share card.

Options:

- Arabic only
- translation only
- Arabic + translation
- dark theme
- light theme
- square format
- story format

### 11.2 Teaching mode later

Future teaching tools:

- lesson plan from selected ayat/hadith
- study notes export
- halaqah collection
- classroom reading list
- printable handout

Important safety rule:

> AI may help structure teaching material, but should not invent Islamic rulings.

---

## 12. Data CDN Architecture

### 12.1 Core principle

The app repo should not carry large Islamic datasets.

The NOOR app should be a lightweight frontend that fetches static data from free CDN/object storage.

### 12.2 Recommended split

| Dataset | Recommended host | Reason |
|---|---|---|
| Quran Arabic + translations | GitHub + jsDelivr | small enough, fast CDN |
| Quran metadata/search index | GitHub + jsDelivr | easy versioning |
| Tafseer | HuggingFace Datasets | large files, free dataset hosting |
| Hadith | Cloudflare R2 | object storage, large corpus, zero egress model |
| App shell | Vercel | frontend only |
| User local data | IndexedDB | free, offline-first |
| Future user sync | Supabase | optional later |

### 12.3 Data repositories

Recommended new repos/datasets:

```text
EffortEdutech/noor              → app
EffortEdutech/noor-quran-data   → Quran static data
EffortEdutech/noor-search-data  → compact search indexes
HuggingFace/noor-tafseer-data   → tafseer datasets
Cloudflare R2 noor-hadith-data  → hadith object bucket
```

### 12.4 Example Quran CDN URLs

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data/quran/uthmani.json
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data/translations/en.sahih.json
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data/translations/ms.basmeih.json
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data/metadata/surah-index.json
```

### 12.5 Example Tafseer URL

```text
https://huggingface.co/datasets/EffortEdutech/noor-tafseer-data/resolve/main/en/ibn-kathir/001.json.gz
```

### 12.6 Example Hadith URL

```text
https://data.noor.app/hadith/bukhari/en/001.json.gz
```

### 12.7 Compression rule

All large data files should be compressed.

Use:

- `.json` for very small metadata
- `.json.gz` for tafseer/hadith chunks
- chunk by surah/book/chapter, not one giant file

### 12.8 Data resolver interface

App code should never directly hardcode every URL.

Create a resolver layer:

```ts
export async function getSurah(surah: number, options?: {
  translation?: string;
  tafseer?: string;
})

export async function getTafseer(bookId: string, surah: number)

export async function getHadithCollection(collectionId: string)

export async function searchNoor(query: string, filters?: SearchFilters)
```

This allows data hosts to change without rewriting UI.

---

## 13. Offline-First Strategy

### 13.1 What should work offline in Phase 1

- app shell
- last opened surah
- bookmarked ayat
- reading progress
- saved reflections
- downloaded Quran metadata
- optionally selected surah content

### 13.2 Cache levels

| Level | Content | Storage |
|---|---|---|
| L1 | UI shell | service worker |
| L2 | small metadata | IndexedDB/cache storage |
| L3 | recently opened Quran/Tafseer/Hadith chunks | IndexedDB |
| L4 | user bookmarks/reflections | IndexedDB |

### 13.3 User-facing offline copy

```text
Available offline
This surah is saved on your device.
```

```text
Connect to download tafseer
The Quran text is available, but this tafseer has not been downloaded yet.
```

---

## 14. Recommended Tech Stack

### 14.1 App

- Next.js App Router
- TypeScript
- Tailwind CSS
- PWA service worker
- IndexedDB via Dexie or small custom wrapper
- Static CDN data fetching

### 14.2 Package manager

Use pnpm.

### 14.3 Repo structure

```text
noor/
  apps/
    web/
      app/
      components/
      public/
      styles/
  packages/
    noor-ui/
    noor-data/
    noor-search/
    noor-content/
    noor-config/
  docs/
  scripts/
  package.json
  pnpm-workspace.yaml
```

### 14.4 Suggested package responsibilities

| Package | Responsibility |
|---|---|
| noor-ui | shared components, buttons, cards, typography |
| noor-data | CDN resolvers, schemas, fetch/cache logic |
| noor-search | local search indexes and query handling |
| noor-content | content models, constants, language metadata |
| noor-config | environment and deployment config |

---

## 15. Design System Direction

### 15.1 Visual identity

NOOR should use a “light emerging from depth” design.

Recommended themes:

- Midnight Noor: dark navy + warm gold
- Paper Noor: warm cream + ink + emerald
- Masjid Glass: subtle glass cards with soft gradients

### 15.2 Design tokens

```css
:root {
  --noor-bg: #071014;
  --noor-surface: #101c22;
  --noor-card: #13232b;
  --noor-gold: #d8b75a;
  --noor-emerald: #2fbf9b;
  --noor-ink: #f4efe2;
  --noor-muted: #a8b0aa;
  --noor-danger: #d66b6b;
}
```

### 15.3 Typography

Recommended:

- Arabic: Amiri or Scheherazade New
- English/Malay body: Lora, Inter, or system sans
- Headings: Cormorant Garamond / Lora

### 15.4 Core components

```text
AppShell
BottomNav
TopBar
NoorCard
DailyAyahCard
DailyHadithCard
SurahCard
AyahCard
TafseerPanel
HadithCard
SearchBar
SearchResultCard
TopicChip
BookmarkButton
ReflectionEditor
ShareCardPreview
DownloadStatusBadge
ReaderSettingsSheet
```

---

## 16. Migration from Ilm-Mate

### 16.1 Reuse conceptually

Reuse these ideas:

- Quran compiled data structure
- surah index
- tafseer per-surah loading
- hadith collections
- search page logic
- reading progress
- bookmarks
- PWA service worker
- reader preferences

### 16.2 Avoid copying blindly

Avoid bringing these weaknesses:

- large content inside app repo
- `fs`-based server loaders as primary data layer
- old Ilm-Mate brand naming
- content-first navigation
- desktop-heavy top nav as the main mobile UX
- too many inline styles inside components

### 16.3 Migration rule

Do not migrate all at once.

Build NOOR Core first, then bring features one by one.

---

## 17. NOOR MVP Scope

### 17.1 MVP v0.1 must include

```text
- Clean Next.js app shell
- Mobile-first bottom navigation
- Today page
- Quran surah index via CDN/local static mock
- Surah reader
- Arabic + English + Malay translation display
- Reader settings
- Bookmark ayah locally
- Reading progress locally
- Basic search over Quran metadata/content
- PWA manifest
```

### 17.2 MVP v0.1 should not include yet

```text
- user login
- payment
- AI chatbot
- full tafseer corpus
- full hadith corpus
- cloud sync
- admin dashboard
- social feed
```

---

## 18. Sprint Plan

### Sprint 0 — Foundation

Goal: prepare repo and contracts.

Tasks:

- initialize `EffortEdutech/noor`
- create pnpm monorepo
- create `apps/web`
- create packages
- create base docs
- define data schemas
- define CDN resolver interface
- setup Vercel deployment

Deliverable:

```text
NOOR app boots locally and deploys empty shell.
```

### Sprint 1 — Design System + Shell

Tasks:

- AppShell
- BottomNav
- TopBar
- design tokens
- typography
- cards
- settings sheet
- responsive layout

Deliverable:

```text
NOOR feels like NOOR visually.
```

### Sprint 2 — Quran Data Resolver

Tasks:

- `getSurahIndex()`
- `getSurah()`
- translation resolver
- local mock fallback
- cache layer
- error states

Deliverable:

```text
Quran reader works from CDN/static resolver.
```

### Sprint 3 — Today + Reading Progress

Tasks:

- Today page
- continue reading
- daily ayah
- daily hadith placeholder
- local reading history
- local bookmarks

Deliverable:

```text
User has a daily home, not just a reader.
```

### Sprint 4 — Explore Search

Tasks:

- search UI
- Quran search index
- filters
- search result cards
- deep link to ayah

Deliverable:

```text
User can discover ayat quickly.
```

### Sprint 5 — Tafseer Lite

Tasks:

- tafseer resolver
- tafseer panel
- one tafseer book/sample
- ayah-to-tafseer link
- unavailable/offline states

Deliverable:

```text
Reading becomes understanding.
```

### Sprint 6 — Hadith Lite

Tasks:

- hadith resolver
- collection browser
- hadith card
- basic search
- save hadith

Deliverable:

```text
Quran + Hadith knowledge base begins.
```

### Sprint 7 — Studio + Share Card

Tasks:

- share card preview
- export as image
- themes
- copy text

Deliverable:

```text
NOOR becomes shareable and teachable.
```

---

## 19. GitHub Issues Breakdown

### Epic 1 — Repo Foundation

- Create pnpm monorepo structure
- Create Next.js web app
- Add TypeScript config
- Add Tailwind config
- Add base deployment config
- Add README
- Add docs folder

### Epic 2 — NOOR Design System

- Add design tokens
- Build AppShell
- Build BottomNav
- Build NoorCard
- Build Reader typography components
- Build SettingsSheet

### Epic 3 — Quran Core

- Define Quran schemas
- Build Quran data resolver
- Build Surah index page
- Build Surah reader page
- Add translation selector
- Add ayah bookmark button
- Add reading progress tracker

### Epic 4 — Today Page

- Build DailyAyahCard
- Build DailyHadithCard placeholder
- Build ContinueReadingCard
- Build JourneyProgressCard
- Build QuickPracticeCard

### Epic 5 — Explore Search

- Build SearchBar
- Build SearchResults layout
- Build Quran search index loader
- Add deep linking to ayah
- Add empty and error states

### Epic 6 — Offline + PWA

- Add PWA manifest
- Add service worker registration
- Cache app shell
- Cache recently opened surah
- Add offline status badge

---

## 20. Safety and Trust Rules

NOOR must be careful with Islamic knowledge.

### 20.1 AI rule

AI may:

- help navigate content
- summarize non-ruling content carefully
- suggest related topics
- help format reflections
- help generate study notes from verified sources

AI must not:

- issue fatwa
- invent Quran/Hadith content
- invent tafseer
- claim authenticity without source
- replace scholars

### 20.2 Content source rule

Every Quran, Tafseer, and Hadith item must have:

- source ID
- language
- version
- collection/book reference
- stable canonical key

### 20.3 UI disclaimer

Suggested copy:

```text
NOOR helps you explore verified Islamic texts. It is not a fatwa service. For personal rulings, please consult qualified scholars.
```

---

## 21. Final Recommended Build Order

Build in this order:

```text
1. New repo foundation
2. Design shell
3. Quran resolver
4. Quran reader
5. Today screen
6. Local bookmarks/progress
7. Search
8. Tafseer
9. Hadith
10. Studio/share cards
11. Journeys
12. Optional sync/login
```

This avoids the common trap of starting with huge data migration before the app experience is right.

---

## 22. Final Product Statement

NOOR should become:

> A beautiful daily Islamic companion where Muslims read Quran, understand through tafseer, discover hadith, save reflections, continue learning journeys, and share light with others — all using a zero-budget, offline-first architecture.

This is the best replacement direction for Ilm-Mate.

---

## 23. Immediate Next Step

Create the first implementation file set for the new repo:

```text
README.md
pnpm-workspace.yaml
package.json
apps/web/package.json
apps/web/app/layout.tsx
apps/web/app/page.tsx
apps/web/app/today/page.tsx
apps/web/app/learn/page.tsx
apps/web/app/explore/page.tsx
apps/web/app/library/page.tsx
apps/web/app/globals.css
packages/noor-data/src/index.ts
packages/noor-ui/src/index.ts
```

Then deploy a clean NOOR shell to Vercel before migrating the Quran reader.

