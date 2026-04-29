# Rebuild into Ilm-Mate v2

0️⃣ Context Alignment

Current assets:

Repo → GitHub
https://github.com/EffortEdutech/muslim-companion-poc
Live app → hosted on Vercel
https://ilm-mate.vercel.app/

Goal:
Rebuild into Ilm-Mate v2
A serious Quran • Hadith • Tafseer companion (not chatbot).

Core pillars from previous chats:

Zero-budget data hosting
Smart Quran search blueprint
UI redesign → real companion experience
1️⃣ First — Honest audit of current app direction

Current app = POC chatbot shell

Problem:
It feels like generic AI assistant with Islamic label.

But Ilm-Mate must feel like:

“Quran.com + Sunnah.com + Tafsir.com + Smart Search”
in one companion experience.

So v2 is not redesign only.
It is product repositioning.

2️⃣ New Product Positioning (CRITICAL)
Ilm-Mate is NOT:
❌ ChatGPT for Islam
❌ AI fatwa generator
❌ Conversational bot
Ilm-Mate IS:

A structured knowledge companion

User comes to:

Read Quran
Understand ayah
Explore tafseer
Search hadith
Discover connections

AI = navigation + discovery layer
NOT the content.

This decision simplifies everything.

3️⃣ New App Information Architecture

We replace “Chat first” with Content first.

Main Navigation (bottom tabs)

1️⃣ Home
2️⃣ Quran
3️⃣ Hadith
4️⃣ Search
5️⃣ Library

This is the biggest change.

4️⃣ New UX Concept — “Companion not Chatbot”

Instead of chat screen, we introduce:

Companion Panel (collapsible)

AI appears as:

Suggestions
Explanations
Related content
Guided exploration

User never starts with chat.

This solves theological + trust concerns too.

5️⃣ Home Screen Redesign
Current:

Empty / chat oriented.

New Home = Daily Companion

Sections:

Hero

Greeting
Continue reading
Daily ayah card

Today in Quran

Last read surah
Resume reading

Discover

Topics
Collections
Popular searches

Hadith of the day

Recently opened

This turns app into daily habit.

6️⃣ Quran Module Redesign (Core Product)

This becomes main feature.

Quran Reader Layout

Screen structure:

Top:

Surah name
Translation selector
Tafseer selector

Verse card:

Arabic
Transliteration
Translation
Actions row:

Buttons:

Tafseer
Hadith
Related verses
Bookmark
Share

👇 This is where Smart Search lives.

7️⃣ Tafseer Experience (Key Differentiator)

When user taps “Tafseer”:

Slide-up panel opens with tabs:

Tabs:

Tafseer Ibn Kathir
Tafseer Jalalayn
Tafseer Maududi
AI Summary (optional)

Important:
AI summary is labelled:

“AI summary of classical tafseer”

Trust preserved.

8️⃣ Hadith Module Redesign

Structure similar to Quran:

Filters:

Collection (Bukhari, Muslim, etc)
Topic
Grade

Hadith card:

Arabic
Translation
Grade
Narrator
Tags

Actions:

Related verses
Similar hadith
Bookmark

This connects Quran ↔ Hadith.

9️⃣ Smart Search (Heart of v2)

Search becomes global knowledge search.

Search across:

Quran verses
Tafseer
Hadith
Topics

Results grouped:

🔹 Verses
🔹 Tafseer
🔹 Hadith
🔹 Topics

This is the “Google for Islamic knowledge”.

🔟 Zero Budget Data Architecture (finalised)

We apply the split hosting strategy you proposed.

Separate static datasets

Host separately as static JSON:

1️⃣ Quran API (Cloudflare Pages / GitHub Pages)

quran text
translations
transliterations

2️⃣ Tafseer API

tafseer datasets

3️⃣ Hadith API

hadith collections

4️⃣ Search index

prebuilt mini search index

Frontend fetches from multiple endpoints.

Why this works:

No server cost
Unlimited CDN bandwidth
Vercel only serves UI

This is perfect for free tier.

1️⃣1️⃣ New Frontend Architecture

We rebuild app into modules:

app/
  home/
  quran/
  hadith/
  search/
  library/
  companion-panel/

State management:

Zustand or Redux toolkit
IndexedDB caching for offline

Offline reading becomes possible 🔥

1️⃣2️⃣ Companion Panel Behaviour

This replaces chatbot.

It shows context-aware suggestions:

When reading ayah:

Show related hadith
Show themes
Show keywords
Offer explanation button

When searching:

Suggest refined queries

This keeps AI helpful but controlled.

1️⃣3️⃣ Phased Rebuild Plan
Phase 1 — Foundation (2–3 weeks)
New navigation
Home screen
Quran reader v2
Static dataset hosting
Phase 2 — Knowledge Engine
Tafseer viewer
Hadith module
Smart search v1
Phase 3 — Companion Intelligence
Companion panel
Related content engine
Offline caching
1️⃣4️⃣ What happens to current repo?

We do soft reset architecture:

Keep:

NextJS setup
Vercel deployment
Basic components

Replace:

Chat UI
Routing
Data loading logic

This becomes v2 branch rebuild.

1️⃣5️⃣ The real transformation summary

Old app:

Ask → AI answers

New app:

Read → Explore → Understand → Discover

This is the right direction for trust + long-term growth.

# The Real Ilm-Mate Product Triangle

Ilm-Mate must become simultaneously:

Pillar	What user feels	Retention role
1️⃣ Learning Tool	“I understand Islam better”	Deep value
2️⃣ Daily Companion	“This app walks with me daily”	Habit loop
3️⃣ Content Factory	“This helps me share Islam”	Viral growth

Most Quran apps only do pillar 1.
We will connect the 3 pillars into one loop.

This changes the entire UX architecture.

The CORE USER LOOP (Important)

New loop we are designing:

Read → Reflect → Save → Share → Return tomorrow → Continue journey

This loop drives:

Retention
Organic growth
Daily usage

Now we redesign the app around this loop.

NEW APP STRUCTURE (Updated Tabs)

We upgrade the navigation to support the 3 pillars:

1️⃣ Today
2️⃣ Learn
3️⃣ Search
4️⃣ Create
5️⃣ Library

This replaces previous Home/Quran/Hadith tabs.

Why?
Because behaviour > content type.

1️⃣ TODAY TAB (Daily Companion Engine)

This is the most important screen of the whole app.

Opens when user launches app.

Sections of Today Screen
🌅 Daily Verse Card
Ayah of the day
30-sec reflection
Save / Share / Deep dive

This feeds both learning + content factory.

🔥 Streak & Progress Widget

We introduce Journey streaks:

Track:

Reading streak
Reflection streak
Sharing streak

We gamify consistency, not worship.

This is extremely important for retention.

📚 Continue Learning

Resume:

Last Surah
Last Hadith
Last Journey

Netflix-style resume row.

🧭 Journeys (Guided Learning Paths)

Journeys are curriculum packs:

Examples:

Understanding Salah
Stories of Prophets
Marriage in Islam
Anxiety & Tawakkul
30 Days with the Quran

This turns the app into a learning program, not a reader.

Journeys = retention monster.

2️⃣ LEARN TAB (Knowledge Library)

This is where Quran + Hadith + Tafseer live.

We merge them into one unified knowledge explorer.

Sections:

Quran

Reader we already planned.

Hadith

Collections + topics.

Topics Hub (New)

Topic pages combine:

Verses
Hadith
Tafseer snippets

Example Topic Page:
“Patience (Sabr)”

Key verses
Related hadith
Scholar insights

This is HUGE for beginners.

3️⃣ SEARCH TAB (Knowledge Engine)

We upgrade Smart Search role.

Search types:

Natural search: “What Quran says about anxiety”
Keyword search
Topic search
Question search

Results grouped:

Verses
Hadith
Tafseer
Topics
Journeys

Search becomes discovery engine.

4️⃣ CREATE TAB (Content Factory 🔥)

This was the big missing piece.

This is what makes Ilm-Mate grow organically.

We help users generate Islamic content to share.

Why this matters

Users already screenshot Quran apps and share.

We turn this into first-class feature.

Create Studio Features

User selects:

Verse / Hadith / Reflection

Then generate:

📱 Social Post Generator

Formats:

Instagram square
Story format
Twitter post
WhatsApp share card

Auto layouts:

Arabic + translation
Beautiful typography
Attribution footer

One tap → Share.

This turns users into da’wah amplifiers.

✍️ Reflection Writer

User writes reflection → app beautifies into shareable card.

This is powerful for engagement.

📂 Drafts & Templates

Saved content to post later.

This is our “Canva for Islamic content”.

5️⃣ LIBRARY TAB (Personal Knowledge Vault)

User saves:

Bookmarks
Highlights
Notes
Generated posts
Journey progress

This becomes their personal Islamic notebook.

Very sticky feature.

Companion AI — Final Role (Revised)

Now that app has strong structure:

AI is placed in 3 strategic locations only:

1. Verse Companion

Explains ayah in simple language.

2. Search Assistant

Helps refine queries.

3. Content Assistant

Helps write reflections/captions.

NOT a free chat bot.

This keeps trust + avoids fatwa risk.

How the 3 Pillars Now Connect
Learning Tool → provides content

Quran / Hadith / Tafseer / Topics

Daily Companion → builds habit

Today screen / Journeys / Streaks

Content Factory → drives growth

Create studio / Share cards

This is now a complete ecosystem loop.

What This Means for Rebuild

We are no longer rebuilding pages.

We are rebuilding product identity.

New top-level routes:

/today
/learn
/search
/create
/library

This is the correct v2 architecture.

# Multilanguage is not a feature… it’s foundational architecture for Ilm-Mate.

Because our vision = global Muslim companion 🌍
Let’s properly integrate it into the product + data + UX.
________________________________________
🌍 Multilanguage = 4 Layers (very important)
We discussed before that Ilm-Mate has 4 different language layers, not one.
Layer	What it affects
1️⃣ App UI language	buttons, menus, journeys
2️⃣ Quran translations	verse translations
3️⃣ Tafseer translations	scholar commentary
4️⃣ Hadith translations	hadith text
Most apps mix these.
We must separate them in architecture.
This impacts hosting, UI, and search.
________________________________________
1️⃣ App UI Language (Interface i18n)
Supported at launch:
Priority markets:
•	English 
•	Bahasa Melayu 🇲🇾 
•	Bahasa Indonesia 🇮🇩 
•	Arabic 🇸🇦 
•	Urdu 🇵🇰 
Why this set?
Covers massive global Muslim base with minimal overhead.
UX Rule
App language is chosen during onboarding and can be changed anytime.
Settings → Language:
•	App language 
•	Preferred translation 
•	Preferred tafseer 
These must be separate settings.
________________________________________
2️⃣ Quran Translation System
We design translation switching like a playlist system.
User can:
•	Choose 1 primary translation 
•	Enable multiple translations 
Verse card becomes:
Arabic
Transliteration (optional)
Primary translation
“+2 more translations”
Tap → expand.
This keeps UI clean while supporting scholars/students.
________________________________________
3️⃣ Tafseer Multilanguage Strategy
Reality check:
Most tafseer exist only in Arabic or English.
So we design 3 tiers of tafseer availability:
Tier	Source
Tier A	Native translation available
Tier B	Human translated excerpts
Tier C	AI assisted translation (clearly labelled)
UI label example:
•	Tafseer Ibn Kathir (EN) 
•	Tafseer Ibn Kathir (MS – AI translated) 
Transparency preserves trust.
________________________________________
4️⃣ Hadith Multilanguage Strategy
Hadith collections already have many translations.
We design hadith selector:
Collection → Language → Edition
Example:
Sahih Bukhari
•	English (Muhsin Khan) 
•	Bahasa Melayu 
•	Urdu 
This matches Sunnah.com mental model.
________________________________________
5️⃣ Multilanguage Search (Critical 🔥)
Smart Search must work across languages.
User searches in Malay:
“kesabaran dalam quran”
Engine must find:
•	English translations 
•	Arabic verses 
•	Malay tafseer 
•	Hadith English/Malay 
This requires cross-language search index.
Solution (zero budget friendly)
Prebuild search index like:
index/
  en.json
  ms.json
  id.json
  ar.json
  ur.json
Each index maps keywords → verse IDs / hadith IDs.
Frontend merges results.
No paid search engine needed.
________________________________________
6️⃣ Multilanguage Journeys
Journeys must be translatable content packs.
Journey structure:
journeys/
  en/
    understanding-salah.json
  ms/
    memahami-solat.json
This allows:
•	Community translation later 
•	Easy expansion 
Journeys are actually content CMS in JSON.
________________________________________
7️⃣ Create Studio Multilanguage (Content Factory Impact)
When user generates social post:
They can choose language of output:
•	Arabic only 
•	English translation 
•	Malay translation 
•	Bilingual card 
Example:
Arabic + English Instagram post.
This massively increases shareability.
________________________________________
8️⃣ Settings Screen (New)
Language settings need their own section:
Language & Content
App language
Primary translation
Secondary translations
Preferred tafseer language
Preferred hadith language
Content generation language
This gives power users control.
________________________________________
9️⃣ Zero Budget Hosting Impact
We split datasets by language.
Instead of one giant dataset:
quran-en.json
quran-ms.json
quran-id.json
hadith-en.json
hadith-ms.json
tafseer-en.json
tafseer-ar.json
Host each on CDN separately.
User downloads only needed language.
Huge bandwidth savings.
________________________________________
🔟 Final Architecture Impact
Multilanguage now touches ALL pillars:
Learning tool → multi translation reading
Daily companion → localized journeys
Content factory → multilingual sharing
Search → cross-language discovery
This is now truly global-ready.
________________________________________
Next step that naturally follows:
We should design the Journeys system + CMS structure because it must be multilingual from day one.
Please check the conversations again to see if we have missed any important information before we proceed with our design
Show moreShow less
Bismillah. Good step before moving forward 👍
I re-reviewed the whole project conversation history and extracted everything that is still missing or only partially integrated into Ilm-Mate v2.
Below is the final gap analysis before we continue design.
________________________________________
🧠 MASTER CHECK — What we already integrated
We already captured:
✔ Learning tool (Quran / Hadith / Tafseer)
✔ Daily companion (Today screen, streaks, journeys)
✔ Content factory (Create Studio)
✔ Multilanguage architecture
✔ Zero-budget data hosting split
✔ Companion AI role redefined
✔ Smart search foundation
Now let’s find the things still missing from previous discussions.
There ARE several important ones.
________________________________________
🚨 Missing Pillar 1 — OFFLINE FIRST STRATEGY
We discussed this during zero-budget hosting + PWA work but haven’t integrated into product UX.
This is critical for:
•	Emerging markets 
•	Daily usage habit 
•	Differentiation vs competitors 
Ilm-Mate must be offline-friendly by design
Not full offline.
Smart offline.
Offline capabilities:
Available offline after first load:
•	Last read surah 
•	Downloaded translations 
•	Saved hadith 
•	Bookmarks 
•	Saved journeys 
•	Generated content 
This is huge for retention in Malaysia/Indonesia/Pakistan/Africa.
We must design Download management UI.
New Settings section:
“Offline & Storage”
Download packs:
•	Quran Arabic (mandatory) 
•	Translation packs 
•	Tafseer packs 
•	Journey packs 
This was discussed but not merged into UI yet.
________________________________________
🚨 Missing Pillar 2 — TRUST & SCHOLAR POSITIONING
We discussed theological risk + positioning earlier.
This must appear in the product UX.
We need visible Trust Layer.
Trust UI elements:
About the Sources page
Explain:
•	Quran sources 
•	Tafseer sources 
•	Hadith grading sources 
•	AI role limitations 
AI Transparency labels
Examples:
•	“AI summary of classical tafseer” 
•	“AI assisted translation” 
Scholar roadmap
Future “Scholar verified” badge.
This builds credibility from day one.
________________________________________
🚨 Missing Pillar 3 — AMANAH / PERSONAL GROWTH METRICS
This came from AmanahGP conversations and we partially reused ideas.
We must adapt it for Ilm-Mate.
Not gamification.
Self-growth tracking.
We rename it:
📊 “Consistency Insights”
Instead of points/badges.
Track privately:
•	Reading days this month 
•	Journeys completed 
•	Reflections written 
•	Verses saved 
Private analytics → not competitive → not public.
Fits Islamic sensitivity.
This belongs in Library tab dashboard.
________________________________________
🚨 Missing Pillar 4 — ONBOARDING EXPERIENCE
We designed settings but not the first-time user journey.
This is critical.
First Launch Onboarding Flow
1️⃣ Choose app language
2️⃣ Choose translation
3️⃣ Choose goals:
“What do you want from Ilm-Mate?”
Options:
•	Understand Quran better 
•	Build daily reading habit 
•	Learn Hadith 
•	Create Islamic content 
•	Reduce anxiety / spiritual growth 
These choices personalize:
•	Today screen 
•	Journeys suggested 
•	Companion tone 
We discussed “meeting the companion” earlier — this replaces that concept.
________________________________________
🚨 Missing Pillar 5 — NOTIFICATIONS STRATEGY
Daily companion needs nudges.
But Islamic apps must be gentle.
We discussed “respectful notifications”.
Notification types:
•	Daily verse reminder 
•	Resume journey reminder 
•	Friday reminder (Jumuah content) 
•	Ramadan mode (future) 
Subtle, not spammy.
________________________________________
🚨 Missing Pillar 6 — RAMADAN MODE (Seasonal Mode)
We briefly mentioned seasonal content strategy.
This is BIG for growth.
Future seasonal modes:
•	Ramadan mode 
•	Hajj mode 
•	Dhul Hijjah mode 
Ramadan mode example:
•	Daily juz tracker 
•	Extra reminders 
•	Charity content journeys 
We don’t build now, but we must design architecture ready.
________________________________________
🚨 Missing Pillar 7 — COMMUNITY CONTENT FUTURE
We discussed “content factory → future community”.
Phase-future idea:
Users eventually share:
•	Reflections 
•	Public collections 
•	Journey playlists 
We don’t build social feed now.
But we must design data model ready for it.
________________________________________
🚨 Missing Pillar 8 — ANALYTICS & SUCCESS METRICS
From earlier product docs:
We must track:
Core KPIs:
•	Daily active users 
•	Reading streak retention 
•	Journeys started → completed 
•	Content generated per user 
•	Shares per user 
This influences event tracking later.
________________________________________
📌 FINAL GAP SUMMARY
Before moving forward, Ilm-Mate v2 now includes:
Product pillars
1️⃣ Learning tool
2️⃣ Daily companion
3️⃣ Content factory
Infrastructure pillars
4️⃣ Multilanguage architecture
5️⃣ Zero budget hosting
6️⃣ Offline-first capability
Trust & growth pillars
7️⃣ Trust & transparency layer
8️⃣ Consistency insights (private metrics)
9️⃣ Onboarding personalization
🔟 Gentle notifications
1️⃣1️⃣ Seasonal modes ready
1️⃣2️⃣ Future community ready
1️⃣3️⃣ Analytics ready
NOW the product definition is truly complete.


# 🧠 MASTER CHECK — What we already integrated

We already captured:

✔ Learning tool (Quran / Hadith / Tafseer)
✔ Daily companion (Today screen, streaks, journeys)
✔ Content factory (Create Studio)
✔ Multilanguage architecture
✔ Zero-budget data hosting split
✔ Companion AI role redefined
✔ Smart search foundation

Now let’s find the things still missing from previous discussions.

There ARE several important ones.

🚨 Missing Pillar 1 — OFFLINE FIRST STRATEGY

We discussed this during zero-budget hosting + PWA work but haven’t integrated into product UX.

This is critical for:

Emerging markets
Daily usage habit
Differentiation vs competitors
Ilm-Mate must be offline-friendly by design

Not full offline.
Smart offline.

Offline capabilities:

Available offline after first load:

Last read surah
Downloaded translations
Saved hadith
Bookmarks
Saved journeys
Generated content

This is huge for retention in Malaysia/Indonesia/Pakistan/Africa.

We must design Download management UI.

New Settings section:
“Offline & Storage”

Download packs:

Quran Arabic (mandatory)
Translation packs
Tafseer packs
Journey packs

This was discussed but not merged into UI yet.

🚨 Missing Pillar 2 — TRUST & SCHOLAR POSITIONING

We discussed theological risk + positioning earlier.

This must appear in the product UX.

We need visible Trust Layer.

Trust UI elements:
About the Sources page

Explain:

Quran sources
Tafseer sources
Hadith grading sources
AI role limitations
AI Transparency labels

Examples:

“AI summary of classical tafseer”
“AI assisted translation”
Scholar roadmap

Future “Scholar verified” badge.

This builds credibility from day one.

🚨 Missing Pillar 3 — AMANAH / PERSONAL GROWTH METRICS

This came from AmanahGP conversations and we partially reused ideas.

We must adapt it for Ilm-Mate.

Not gamification.
Self-growth tracking.

We rename it:

📊 “Consistency Insights”

Instead of points/badges.

Track privately:

Reading days this month
Journeys completed
Reflections written
Verses saved

Private analytics → not competitive → not public.

Fits Islamic sensitivity.

This belongs in Library tab dashboard.

🚨 Missing Pillar 4 — ONBOARDING EXPERIENCE

We designed settings but not the first-time user journey.

This is critical.

First Launch Onboarding Flow

1️⃣ Choose app language
2️⃣ Choose translation
3️⃣ Choose goals:

“What do you want from Ilm-Mate?”

Options:

Understand Quran better
Build daily reading habit
Learn Hadith
Create Islamic content
Reduce anxiety / spiritual growth

These choices personalize:

Today screen
Journeys suggested
Companion tone

We discussed “meeting the companion” earlier — this replaces that concept.

🚨 Missing Pillar 5 — NOTIFICATIONS STRATEGY

Daily companion needs nudges.

But Islamic apps must be gentle.

We discussed “respectful notifications”.

Notification types:
Daily verse reminder
Resume journey reminder
Friday reminder (Jumuah content)
Ramadan mode (future)

Subtle, not spammy.

🚨 Missing Pillar 6 — RAMADAN MODE (Seasonal Mode)

We briefly mentioned seasonal content strategy.

This is BIG for growth.

Future seasonal modes:

Ramadan mode
Hajj mode
Dhul Hijjah mode

Ramadan mode example:

Daily juz tracker
Extra reminders
Charity content journeys

We don’t build now, but we must design architecture ready.

🚨 Missing Pillar 7 — COMMUNITY CONTENT FUTURE

We discussed “content factory → future community”.

Phase-future idea:

Users eventually share:

Reflections
Public collections
Journey playlists

We don’t build social feed now.

But we must design data model ready for it.

🚨 Missing Pillar 8 — ANALYTICS & SUCCESS METRICS

From earlier product docs:

We must track:

Core KPIs:

Daily active users
Reading streak retention
Journeys started → completed
Content generated per user
Shares per user

This influences event tracking later.

📌 FINAL GAP SUMMARY

Before moving forward, Ilm-Mate v2 now includes:

Product pillars

1️⃣ Learning tool
2️⃣ Daily companion
3️⃣ Content factory

Infrastructure pillars

4️⃣ Multilanguage architecture
5️⃣ Zero budget hosting
6️⃣ Offline-first capability

Trust & growth pillars

7️⃣ Trust & transparency layer
8️⃣ Consistency insights (private metrics)
9️⃣ Onboarding personalization
🔟 Gentle notifications
1️⃣1️⃣ Seasonal modes ready
1️⃣2️⃣ Future community ready
1️⃣3️⃣ Analytics ready

NOW the product definition is truly complete.

# 🧭 Journeys = Guided Islamic learning paths

Think:

Duolingo course structure
Netflix episode flow
Quran.com credibility

Each journey teaches ONE theme step-by-step using:

Quran verses
Hadith
Tafseer snippets
Reflections
Actions

They power:
Daily habit + learning + content creation.

🧠 Journey User Experience (Full Flow)
Entry points

User discovers journeys from:

• Today screen → “Continue Journey”
• Today screen → Suggested journeys
• Learn tab → Journeys Library
• Search results → “Start Journey”

Journeys must feel core, not secondary.

🪜 Journey UX Flow
1️⃣ Journey Overview Screen

Example:
“Understanding Salah”

Shows:

Cover image / theme color
Short description
Duration (e.g. 7 days)
Steps count (7 lessons)
What you’ll learn
Start / Resume button

Important:
Journey length must feel small and achievable.

Sweet spot: 5–10 steps per journey.

2️⃣ Step / Lesson Screen

Each step is a micro learning session (2–4 minutes).

Structure of a lesson:

Title
Context intro (short paragraph)
Quran verse card
Tafseer snippet
Hadith card (optional)
Reflection prompt
Action button → “Mark complete”

This is the HEART of the system.

3️⃣ Completion Screen

When lesson completed:

Celebrate gently:

“Step completed”
Show progress bar
Suggest shareable card
Suggest next lesson tomorrow

We reinforce daily habit.

4️⃣ Journey Completion Screen

When finished:

Show:

Summary of what learned
Verses saved
Reflections written
Shareable completion card 🔥

This feeds Content Factory.

🧩 Lesson Types (Important)

Not all lessons are identical.

We define 5 lesson types:

Type	Purpose
Verse lesson	Quran-focused
Hadith lesson	Sunnah-focused
Topic lesson	Concept explanation
Reflection lesson	Journaling
Action lesson	Habit building

This allows rich curriculum.

🗂 Journey Data Model (Core Architecture)

Journeys must be JSON CMS content so we can host free + translate easily.

Journey Object
{
  "id": "understanding-salah",
  "language": "en",
  "title": "Understanding Salah",
  "description": "Learn the meaning and purpose of prayer",
  "duration_days": 7,
  "cover_color": "#3A7D6B",
  "tags": ["prayer","beginner"],
  "steps": ["salah-1","salah-2","salah-3"]
}
Step Object
{
  "id": "salah-1",
  "journey_id": "understanding-salah",
  "order": 1,
  "type": "verse_lesson",
  "title": "Why we pray",
  "intro": "Prayer is the pillar of Islam...",
  "verse_refs": ["2:43"],
  "hadith_refs": ["bukhari:8"],
  "tafseer_refs": ["ibn-kathir:2:43"],
  "reflection_prompt": "What does prayer mean to you?"
}

Key idea:
Journeys only store references, not full content.

This keeps datasets small and reusable.

🌍 Multilanguage Journey Structure

We store journeys per language:

journeys/
  en/
    understanding-salah.json
  ms/
    memahami-solat.json
  id/
  ur/

Each language version can:

Translate text
Replace reflection prompts culturally
Keep same verse/hadith IDs

Perfect for scaling.

🧠 User Progress Data Model

Stored locally (IndexedDB) + optionally synced later.

{
  "user_id": "local",
  "journey_progress": {
    "understanding-salah": {
      "completed_steps": ["salah-1","salah-2"],
      "started_at": "date",
      "last_opened": "date"
    }
  }
}

Zero backend required.

🎯 Journey Recommendation Engine

Used in Today tab.

Recommend based on:

User goals (onboarding)
Current streak
Completed journeys
Recently searched topics

Simple rules engine → no AI needed.

🛠 Journey CMS (Content Creation System)

We must make content creation EASY for your team.

This is internal workflow.

Journey Authoring Structure (Markdown)

Each journey written as Markdown:

journey.md
step1.md
step2.md
step3.md

Example step file:

title: Why we pray
type: verse_lesson
verse_refs: 2:43
hadith_refs: bukhari:8

Intro text...

Reflection prompt...

Then build script converts → JSON.

This allows:

GitHub workflow
Version control
Community translators later

Perfect for zero budget.

✍️ Journey Authoring Guidelines

Each step must:

• Be under 300 words
• Use max 1–2 verses
• Include reflection question
• Encourage bookmarking/sharing

This keeps lessons snackable.

🔁 How Journeys feed the whole ecosystem

Journeys generate:

• Daily content for Today tab
• Saved verses for Library
• Reflection prompts for journaling
• Shareable completion cards
• Searchable topic pages

Journeys = content engine.

🚀 Initial Journey Launch Pack

We should launch with 6–8 journeys:

Starter pack ideas:

Understanding Salah
Building Daily Quran Habit
Stories of Prophet Ibrahim
Anxiety & Tawakkul
The Power of Dua
Ramadan Preparation
Patience (Sabr)
Gratitude (Shukr)

This gives strong onboarding.

📌 Final Summary

Journeys system now includes:

• Micro-learning lesson UX
• JSON multilingual CMS
• Offline-friendly progress tracking
• Recommendation engine
• Content generation integration

This is now a complete retention system.

# 🎨 CREATE STUDIO — PRODUCT GOAL
Turn users into Islamic content creators in 30 seconds.
Not influencers.
Not scholars.
Just make sharing easy & beautiful.
This is the most viral feature in the app.
________________________________________
🧭 Entry Points to Create Studio
User can open Create Studio from:
• Bottom tab “Create”
• After completing Journey step
• From verse/hadith action buttons
• From bookmarks/library
Creation must feel contextual and instant.
________________________________________
🪄 Main Create Studio Screen
Screen layout
Top:
“Create & Share”
Creation options:
1️⃣ Verse Post
2️⃣ Hadith Post
3️⃣ Reflection Post
4️⃣ Journey Completion Card
5️⃣ Custom Post (advanced)
Each opens the same editor with different presets.
________________________________________
✨ Creation Flow
Example: user taps Verse Post
Flow:
Select verse → Choose template → Edit text → Export → Share
Max 3–4 steps only.
Speed is critical.
________________________________________
🧱 Step 1 — Content Picker
User chooses source:
Tabs:
• Quran
• Hadith
• Bookmarks
• Recent
• Journeys
This connects whole app ecosystem.
________________________________________
🧩 Step 2 — Template Picker
This is where magic happens.
Templates = Canva-style layouts.
Template categories:
Category	Purpose
Minimal	Clean & simple
Arabic focus	Big Arabic typography
Translation focus	Big translation text
Dual language	Arabic + translation
Reflection	User text highlight
Story format	Vertical story
Start with 6–8 templates only.
Keep scope small.
________________________________________
🎛 Step 3 — Editor Screen
User can edit:
• Translation text toggle
• Show/hide transliteration
• Add reflection caption
• Choose language output
• Light / dark theme
• Choose background style
Keep controls simple.
We are NOT building Canva.
________________________________________
🌍 Multilanguage Output (Important)
User can generate card in:
• Arabic only
• English
• Malay
• Indonesian
• Urdu
• Bilingual (Arabic + translation)
This massively boosts shareability.
________________________________________
🖼 Step 4 — Export Screen
Export sizes:
• Instagram post (1:1)
• Instagram story (9:16)
• Twitter/X post
• WhatsApp share image
One tap → download image.
Then quick-share buttons.
________________________________________
📦 Generated Content Storage
Saved into Library → “My Posts”.
User can:
• Re-edit
• Re-export
• Re-share
Creates personal da’wah archive.
________________________________________
🔥 Journey Integration (Key Growth Loop)
After finishing lesson:
Show CTA:
“Create a post from this lesson”
Pre-filled with:
• Verse used in lesson
• Reflection prompt
• Journey branding
This will drive content creation naturally.
________________________________________
🧠 Reflection Writer (Unique Feature)
Users write reflections during journeys.
We turn reflections into shareable cards.
Flow:
User writes reflection → Tap “Create Post” → Template applied automatically.
This is powerful for engagement.
________________________________________
🗂 Content Data Model
Generated posts stored locally first.
{
  "id": "post_001",
  "type": "verse",
  "source_ref": "2:43",
  "language": "en",
  "template": "minimal_dark",
  "user_caption": "Prayer grounds my day",
  "created_at": "date"
}
No backend required.
________________________________________
🎨 Template System Architecture
Templates stored as JSON config.
{
  "id": "minimal_dark",
  "fonts": "serif",
  "layout": "centered",
  "show_arabic": true,
  "show_translation": true
}
Frontend renderer generates image.
________________________________________
🚀 V1 Template Pack
We launch with:
1.	Minimal Light 
2.	Minimal Dark 
3.	Arabic Hero 
4.	Translation Hero 
5.	Dual Language Card 
6.	Reflection Card 
7.	Story Template 
Enough to feel rich without complexity.
________________________________________
📈 Why This Feature Matters
This creates:
• Organic growth
• User emotional connection
• Daily engagement
• Viral loop
Most Islamic apps miss this.
This becomes Ilm-Mate’s signature feature.
________________________________________
🔁 How Create Studio fits ecosystem
Learning → Journeys → Reflection → Create Post → Share → New Users
Now the full product loop is complete.
________________________________________
Next step:
We should design the Library & Consistency Insights dashboard, which ties journeys, bookmarks, and created posts together.
Proceed please Bismillah
Show moreShow less
Bismillah 🤲
Now we design the Library + Consistency Insights — the user’s personal Islamic knowledge vault.
This is the memory + progress center of Ilm-Mate.
Everything user saves, writes, creates, and learns ends up here.
________________________________________
📚 LIBRARY TAB — PURPOSE
User feeling:
“This is my Islamic space.”
The Library must feel:
•	Personal 
•	Private 
•	Valuable over time 
It combines:
Bookmarks + Notes + Journeys + Posts + Progress.
________________________________________
🧭 Library Main Screen Layout
Top header:
My Library
Sections:
1️⃣ Continue Journey
2️⃣ Saved Collection
3️⃣ My Reflections
4️⃣ My Posts
5️⃣ Consistency Insights
This order matches usage frequency.
________________________________________
1️⃣ Continue Journey Section
Shows active journeys with progress bars.
Card info:
•	Journey name 
•	% completed 
•	Last opened 
•	Resume button 
Goal: remove friction to continue habit.
________________________________________
2️⃣ Saved Collection (Bookmarks Hub)
This becomes user’s personal Islamic notebook.
Tabs inside:
• Verses
• Hadith
• Tafseer snippets
• Topics
Each item can have:
•	Highlight 
•	Personal note 
•	Date saved 
________________________________________
Bookmark Data Model
{
  "id": "bookmark_001",
  "type": "verse",
  "ref": "2:43",
  "note": "Reminder to stay consistent",
  "created_at": "date"
}
Offline-first. Stored locally.
________________________________________
3️⃣ My Reflections (Journal)
Every reflection written in journeys is saved here.
This becomes a spiritual journal over time.
Reflection card shows:
•	Related verse/hadith 
•	Journey name 
•	Date written 
•	Edit button 
•	Create post button 
Very powerful retention feature.
________________________________________
4️⃣ My Posts (Content Archive)
All generated social posts stored here.
User actions:
•	Re-edit template 
•	Export again 
•	Share again 
•	Delete 
This reinforces content creation habit.
________________________________________
📊 5️⃣ Consistency Insights Dashboard
This replaces gamification.
Private. Gentle. No points. No leaderboard.
We track consistency, not piety.
________________________________________
Insights Cards
📖 Reading Days This Month
Count days user opened Quran/Hadith.
🧭 Journeys Progress
•	Journeys started 
•	Journeys completed 
✍️ Reflections Written
Encourages journaling habit.
📤 Posts Created
Encourages sharing habit.
🔥 Current Streak
Simple day streak.
________________________________________
Insights Data Model
{
  "reading_days": 12,
  "current_streak": 5,
  "journeys_completed": 2,
  "reflections_written": 8,
  "posts_created": 3
}
All computed locally → zero backend.
________________________________________
🎯 Why Insights Matter
This creates:
•	Sense of progress 
•	Emotional attachment 
•	Long-term retention 
Without unhealthy gamification.
________________________________________
🔎 Smart Re-Engagement Prompts
Insights screen can show gentle nudges:
Examples:
•	“You haven’t written a reflection this week” 
•	“Continue your Salah journey” 
This feeds notification system later.
________________________________________
🗂 Local Storage Architecture
Everything in Library stored in IndexedDB.
Collections:
bookmarks
reflections
generated_posts
journey_progress
analytics_stats
Zero server cost. Offline ready.
________________________________________
🔁 How Library Connects Whole App
Learning → bookmark → reflect → create → track progress → return daily.
Library = user’s Islamic digital legacy.
This makes app sticky long-term.
________________________________________
🧩 We Now Completed Core Feature Set
We have fully designed:
• Today (daily companion)
• Learn (knowledge explorer)
• Search (discovery engine)
• Journeys (learning engine)
• Create Studio (content factory)
• Library (personal vault)
• Multilanguage
• Offline-first
Core product is now fully defined.


# full system blueprint layer — turning everything into a buildable app structure.

I’ll give you:

📐 Information Architecture (IA)
🧭 Full Screen Map (every screen)
🔁 Navigation flows (how user moves)
🧠 System behavior rules

No missing modules.

🧠 1. INFORMATION ARCHITECTURE (MASTER STRUCTURE)

Ilm-Mate v2 is organized into 6 core systems:

1. Today (Daily Companion Engine)
2. Learn (Knowledge System)
3. Search (Discovery Engine)
4. Journeys (Learning Curriculum System)
5. Create (Content Factory)
6. Library (Personal Knowledge Vault)
7. Settings (System Control + Language + Offline + Trust)

Everything else is sub-system.

🧭 2. FULL NAVIGATION STRUCTURE
Bottom Navigation (PRIMARY)
[ Today ] [ Learn ] [ Search ] [ Create ] [ Library ]

Why this works:

Behaviour-based (not content-based)
Matches user intent
Supports daily habit loop
🏠 3. SCREEN MAP (FULL APP TREE)
1️⃣ TODAY SYSTEM
Today Screen
 ├── Daily Verse Card
 ├── Streak Dashboard
 ├── Continue Journey
 ├── Recommended Journey
 ├── Hadith of the Day
 ├── Quick Actions
      ├── Bookmark
      ├── Create Post
      ├── Open Tafseer
Sub-screens:
Verse Detail (expanded view)
Streak Detail
Journey Resume
2️⃣ LEARN SYSTEM
Learn Home
 ├── Quran Reader
 │     ├── Surah List
 │     ├── Verse View
 │     ├── Tafseer Panel
 │     ├── Related Hadith
 │
 ├── Hadith Library
 │     ├── Collection List
 │     ├── Hadith View
 │     ├── Grading Info
 │
 ├── Topics Hub
 │     ├── Topic Page
 │     ├── Multi-source view (Quran + Hadith + Tafseer)
3️⃣ SEARCH SYSTEM
Search Home
 ├── Global Search Input
 ├── Recent Searches
 ├── Suggested Topics

Search Results
 ├── Quran Results
 ├── Hadith Results
 ├── Tafseer Results
 ├── Topics Results
 ├── Journeys Results
4️⃣ JOURNEYS SYSTEM
Journeys Home
 ├── Featured Journeys
 ├── Recommended Journeys
 ├── All Journeys

Journey Detail
 ├── Overview Screen
 ├── Step List

Journey Step Screen
 ├── Verse Lesson
 ├── Hadith Lesson
 ├── Reflection Prompt
 ├── Action Complete

Journey Completion Screen
 ├── Summary
 ├── Share Card
 ├── Next Journey Suggestion
5️⃣ CREATE SYSTEM
Create Home
 ├── Content Type Picker
 │     ├── Verse Post
 │     ├── Hadith Post
 │     ├── Reflection Post
 │     ├── Journey Card
 │     ├── Custom Post
 │
 ├── Content Picker (Quran / Hadith / Bookmark)
 ├── Template Picker
 ├── Editor Screen
 ├── Export Screen
 ├── Share Screen
6️⃣ LIBRARY SYSTEM
Library Home
 ├── Continue Journey
 ├── Saved Bookmarks
 ├── My Reflections
 ├── My Posts
 ├── Consistency Insights

Bookmark Detail
Reflection Detail
Post Detail
Insight Dashboard
7️⃣ SETTINGS SYSTEM
Settings Home
 ├── Language Settings
 ├── Translation Preferences
 ├── Tafseer Preferences
 ├── Hadith Preferences
 ├── Offline Mode
 ├── Download Manager
 ├── Trust & Sources
 ├── Notifications
 ├── About App
🔁 4. FULL NAVIGATION FLOWS (CRITICAL)

Now we map how users actually move.

🔄 FLOW 1 — NEW USER ONBOARDING
App Open
 → Language Select
 → Translation Select
 → Goal Selection
 → Enter Today Screen

Goal selection:

Learn Quran
Build habit
Understand Islam
Create content
Personal growth

This customizes entire app.

🔄 FLOW 2 — DAILY USE LOOP
Open App
 → Today Screen
 → Daily Verse
 → Tap Verse
 → Read Tafseer
 → Save Bookmark
 → Create Post (optional)
 → Continue Journey
 → Exit

This is the retention loop engine

🔄 FLOW 3 — JOURNEY FLOW
Today → Continue Journey
 → Journey Overview
 → Start Step
 → Read Verse
 → Read Hadith
 → Write Reflection
 → Complete Step
 → Mark Done
 → Next Step Tomorrow
🔄 FLOW 4 — CONTENT CREATION FLOW
Verse / Hadith / Reflection
 → Create Button
 → Template Select
 → Edit Content
 → Choose Language
 → Export
 → Share
 → Save to Library
🔄 FLOW 5 — SEARCH FLOW
Search Input
 → Query
 → Results Grouped
 → Select Item
 → View Detail
 → (optional) Save / Create / Start Journey
🔄 FLOW 6 — LIBRARY FLOW
Library
 → Open Bookmark
 → Read Source
 → Add Note
 → Create Post (optional)

OR

→ Open Reflection
→ Reuse in Create Studio
🧠 5. SYSTEM BEHAVIOR RULES (IMPORTANT)
Rule 1 — Content-first, AI-second

AI never leads. Content always leads.

Rule 2 — Every screen is connected

Every content type links to:

Bookmark
Journey
Create Studio

No dead ends.

Rule 3 — Offline-first priority

Anything viewed once = cached.

Rule 4 — Multilanguage always present

Every content node supports:

Arabic
Translation
Tafseer language variant
Rule 5 — Gentle UX philosophy

No:

aggressive gamification
popups
social pressure

Only:

guidance
reflection
consistency
📊 FINAL SYSTEM MAP (ONE VIEW)
                ┌──────────────┐
                │    TODAY     │
                └──────┬───────┘
                       ↓
     ┌─────────── CORE LOOP ───────────┐
     ↓                ↓                ↓
  LEARN           JOURNEYS         SEARCH
     ↓                ↓                ↓
     └─────── CREATE STUDIO ──────────┘
                       ↓
                  LIBRARY
                       ↓
                 CONSISTENCY

This is the full ecosystem.

🚀 WHAT WE HAVE NOW

We now have:

✔ Full product architecture
✔ Full UX flows
✔ Full screen map
✔ Full navigation system
✔ Full data structure direction
✔ Full growth loop

This is production-level system design.

# engineering blueprint

This is the Component-Level Design System + React Architecture for Ilm-Mate v2.

I’ll structure this so your repo can directly scale cleanly.

🧱 1. DESIGN SYSTEM PHILOSOPHY

Ilm-Mate UI must follow 4 principles:

1. Content-first UI

UI never dominates Quran/Hadith content.

2. Calm + scholarly tone

No “gamified app” feel.

3. Modular components

Every feature is reusable across Learn / Journey / Create.

4. Offline-first rendering

UI must work without backend dependency.

🎨 2. DESIGN SYSTEM (UI KIT)
🎯 Core Visual Language
Minimal Islamic aesthetic
Soft contrast (not harsh black/white)
Arabic typography emphasis
Calm green / sand / neutral palette (optional tokens)
🧩 2.1 ATOMIC COMPONENTS

These are the smallest building blocks.

TEXT SYSTEM
<Text variant="arabic" />
<Text variant="translation" />
<Text variant="heading" />
<Text variant="caption" />
<Text variant="ayah" />
BUTTON SYSTEM
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="ghost" />
<Button variant="icon" />
<Button variant="danger" />
CARD SYSTEM
<Card />
<CardHeader />
<CardBody />
<CardFooter />

Used for:

Verse card
Hadith card
Journey step
Reflection card
BADGE SYSTEM
<Badge type="surah" />
<Badge type="hadith-grade" />
<Badge type="language" />
<Badge type="journey-progress" />
INPUT SYSTEM
  <Input />
  <SearchInput />
  '<TextArea />
  LAYOUT SYSTEM
  <Container />
  <'Section />
  <Grid />
  <Stack />
📖 2.2 DOMAIN COMPONENTS (IMPORTANT)

These are Ilm-Mate specific components

📘 Quran Components
<VerseCard />
<SurahHeader />
<AyahText />
<TafseerPanel />
<TranslationSwitcher />
<VerseActions />
📚 Hadith Components
<HadithCard />
<HadithMeta />
<GradeBadge />
<NarratorInfo />
🧭 Journey Components
<JourneyCard />
<JourneyStep />
<JourneyProgress />
<JourneyOverview />
<ReflectionPrompt />
✍️ Create Studio Components
<PostTemplate />
<TemplateSelector />
<ContentPicker />
<EditorCanvas />
<ExportPreview />
📂 Library Components
<BookmarkItem />
<ReflectionCard />
<PostCard />
<InsightCard />
<ProgressStats />
🌍 Multilanguage Components
<LanguageSelector />
<TranslationSwitcher />
<TafseerSelector />
⚙️ 3. FEATURE SYSTEM COMPONENTS
🧭 TODAY SYSTEM
<DailyVerseCard />
<StreakWidget />
<ContinueJourneyCard />
<RecommendationFeed />
🔍 SEARCH SYSTEM
<GlobalSearchBar />
<SearchResultsGroup />
<ResultCard />
<FilterTabs />
🧠 COMPANION PANEL

Important hidden system:

'<CompanionPanel />
<InsightBubble />
<SuggestionCard />
<ExplanationBox />

AI is embedded here, NOT central.

🏗️ 4. REACT PROJECT ARCHITECTURE

Now the engineering structure.

We use scalable modular architecture.

📁 ROOT STRUCTURE
src/
  app/
  modules/
  components/
  design-system/
  lib/
  hooks/
  store/
  data/
  styles/
  types/
  utils/
📦 5. MODULE-BASED ARCHITECTURE (VERY IMPORTANT)

Each major system is a module.

🏠 app/ (Routes Layer)
app/
  (today)/
  (learn)/
  (search)/
  (journeys)/
  (create)/
  (library)/
  settings/

Each folder = route group.

🧠 modules/ (FEATURE LOGIC)
modules/
  today/
  learn/
  search/
  journeys/
  create/
  library/
  companion/

Each module contains:

components/
hooks/
services/
types/
utils/
🎨 components/ (SHARED UI)
components/
  ui/          (atomic system)
  cards/       (generic cards)
  layout/      (containers)
  navigation/  (tabs, menus)
🎨 design-system/
design-system/
  tokens/
    colors.ts
    spacing.ts
    typography.ts
  theme/
  components/
📡 lib/ (DATA LAYER)
lib/
  quran/
  hadith/
  tafseer/
  journeys/
  search/

This is where zero-budget datasets connect

🧠 store/ (STATE MANAGEMENT)

Use lightweight system (Zustand recommended)

store/
  user-store.ts
  journey-store.ts
  bookmark-store.ts
  settings-store.ts
🧩 hooks/
useVerse.ts
useJourney.ts
useSearch.ts
useOfflineSync.ts
useLanguage.ts
📊 data/ (LOCAL DATA CACHE)
data/
  quran/
  hadith/
  tafseer/
  journeys/
  translations/

This supports offline-first design.

🔁 6. DATA FLOW ARCHITECTURE

Very important:

UI Component
   ↓
Module Hook
   ↓
Lib (data resolver)
   ↓
Local Cache (IndexedDB)
   ↓
Static JSON CDN

No backend required.

🧠 7. DESIGN RULES FOR BUILDING COMPONENTS
Rule 1 — Everything is reusable

VerseCard = used in:

Learn
Journey
Search
Create
Rule 2 — No feature-specific UI

No “one-off screens”

Rule 3 — Data-driven UI

Components only render:

verse_ref
hadith_ref
journey_step
Rule 4 — Stateless UI by default

State lives in:

store/
hooks/
Rule 5 — Always multilingual-ready

Every component supports:

{
  language,
  translation,
  rtl_support
}
🚀 8. FINAL SYSTEM SUMMARY

You now have:

🧱 UI System
Atomic components
Domain components
Feature components
🏗 Architecture
Modular app structure
Feature-based modules
Clean separation of concerns
🔁 Data Flow
Offline-first
CDN datasets
Local cache layer
🧭 WHAT YOU HAVE NOW (FULL STACK VIEW)

You now have full:

✔ Product vision
✔ UX flows
✔ Screen map
✔ System architecture
✔ Component architecture
✔ Data architecture direction

This is now production-grade system design for v2 build


# Zero-Budget Backend Architecture 
— this is what makes Ilm-Mate v2 real, scalable, and sustainable without servers.

This is not a traditional backend.
This is a distributed static + edge + local-first knowledge system.

🧠 1. CORE BACKEND PHILOSOPHY

We do NOT build:

❌ Traditional database backend
❌ Heavy API server
❌ Paid search infrastructure

We build:

✅ Static data architecture
✅ Edge/CDN distribution
✅ Client-side intelligence
✅ Local-first caching system

🧱 2. SYSTEM OVERVIEW (HIGH LEVEL)
                ┌────────────────────────┐
                │   GitHub Repo (CMS)   │
                └──────────┬────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Build Pipeline (JSON Compiler)  │
        └──────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────┐
        │  Static Data Packs (Versioned)   │
        └──────────────────────────────────┘
                           ↓
     ┌──────────────┬──────────────┬──────────────┐
     ↓              ↓              ↓              ↓
 Quran API     Hadith API     Tafseer API   Journeys API
     ↓              ↓              ↓              ↓
        ┌──────────────────────────────────┐
        │   CDN (Vercel / Cloudflare)     │
        └──────────────────────────────────┘
                           ↓
                Mobile / Web App (Client)
                           ↓
              IndexedDB Local Cache Layer
📦 3. DATA ARCHITECTURE (CORE IDEA)

We split everything into independent data domains:

📖 3.1 Quran Data Pack
quran/
  surah.json
  ayah.json
  translation/
    en.json
    ms.json
    id.json
  transliteration.json

Each ayah has stable ID:

"2:255"

No database needed.

📚 3.2 Hadith Data Pack
hadith/
  bukhari.json
  muslim.json
  abu-dawud.json
  collections.json
  grading.json

Structure:

{
  "id": "bukhari:1",
  "text": "...",
  "grade": "sahih",
  "book": "revelation"
}
📘 3.3 Tafseer Data Pack
tafseer/
  ibn-kathir/
    en.json
    ar.json
  jalalayn/
  maududi/

Important:
Tafseer is linked by ayah reference, not stored inside Quran.

🌍 3.4 Translation System
translations/
  quran/
    en.json
    ms.json
    id.json
  hadith/
  tafseer/

All language packs are independent.

🧭 3.5 Journeys Data Pack
journeys/
  en/
    understanding-salah.json
    sabr.json
  ms/
  id/

Each journey = static curriculum.

🔎 3.6 Search Index Pack (VERY IMPORTANT)

This is your Google-like engine replacement

search-index/
  en.json
  ms.json
  id.json

Each entry:

{
  "keyword": "patience",
  "refs": ["2:153", "bukhari:3", "journey:sabr"]
}

This enables zero-cost semantic search

⚙️ 4. BUILD PIPELINE (THE "BACKEND")

We create a data compiler script

Purpose:

Convert raw markdown/JSON → optimized static packs

Pipeline flow:
raw content (markdown/json)
        ↓
validation layer
        ↓
reference linking engine
        ↓
translation sync
        ↓
minification
        ↓
versioned output packs
Tools:
Node.js script
GitHub Actions (auto build)
Optional: pnpm CLI
🚀 5. DEPLOYMENT LAYER (ZERO COST)

We use:

Option A (recommended)

Cloudflare

Cloudflare Pages
Cloudflare CDN
Unlimited static delivery
Option B

Vercel

Already used in your app
Good for UI + small JSON
🧠 6. CLIENT-SIDE BACKEND (MOST IMPORTANT PART)

The real backend is inside the app

6.1 Data Resolver Layer
lib/
  quran-resolver.ts
  hadith-resolver.ts
  tafseer-resolver.ts
  journey-resolver.ts
  search-resolver.ts

These:

Fetch from CDN
Cache locally
Merge multilingual data
Return unified objects
6.2 IndexedDB Cache Layer
cache:
  quran_verses
  translations
  journeys
  bookmarks
  search_history

Rules:

First load → CDN
Next load → local
6.3 Offline Sync Engine
useOfflineSync()

Features:

Detect network
Switch to cache
Sync user data locally
🔁 7. DATA FLOW (REAL BEHAVIOR)

Example: user opens ayah 2:255

UI → resolver
   → check IndexedDB
   → if not found:
         fetch CDN quran-pack
         cache locally
   → merge translation pack
   → return UI-ready object
🔍 8. SEARCH ARCHITECTURE (NO ELASTICSEARCH)

We replace backend search with:

Hybrid search engine:
1. Keyword index
2. Prefix matching
3. Tag matching
4. Journey linking

Example:

Search: “patience”

Returns:

Quran verses
Hadith
Journey “Sabr”
Tafseer mentions

All resolved locally.

🌍 9. MULTILANGUAGE BACKEND FLOW

Key principle:

👉 Language is NOT a backend concern
👉 Language is a data overlay

Flow:

base Quran data (Arabic)
        +
translation pack (user selected)
        +
tafseer pack (selected language)
        ↓
merged runtime object

No duplication of Quran data.

📊 10. VERSIONING SYSTEM (IMPORTANT)

Every dataset is versioned:

quran-v1.0.0
hadith-v1.0.0
journeys-v1.0.0

App checks:

“Do I have latest pack?”
If not → update only changed file

No full redownload.

🧩 11. CONTENT MANAGEMENT (CMS STRATEGY)

We use GitHub as CMS:

content/
  journeys/
  tafseer/
  translations/

Workflow:

Edit JSON/Markdown
Commit to GitHub
GitHub Action builds packs
Deploy to CDN

Zero backend admin panel needed.

🔐 12. TRUST & INTEGRITY LAYER

Important for Islamic content:

We add metadata:

{
  "source": "ibn-kathir",
  "verified": true,
  "reviewed_by": "scholar-team",
  "ai_generated": false
}

AI content must always be tagged.

📦 13. FINAL SYSTEM SUMMARY

You now have:

🧱 Backend type:
Static-first
Edge distributed
Client-resolved
📦 Data layers:
Quran pack
Hadith pack
Tafseer pack
Translation pack
Journey pack
Search index pack
⚙️ Engine:
Build pipeline (GitHub Actions)
CDN deployment
Local IndexedDB cache
🧠 Intelligence:
Client-side resolvers
Offline-first sync
Multilingual merge system
🚀 FINAL RESULT

This architecture gives you:

✔ Zero server cost
✔ Infinite scalability
✔ Offline capability
✔ Fast global access
✔ Easy Git-based content updates
✔ Multilingual expansion ready


# Now we design the core intelligence layer of Ilm-Mate v2: Smart Search Engine.

This is not just search.
This is Islamic knowledge navigation intelligence.

It connects:

Quran
Hadith
Tafseer
Journeys
Reflections
Multilingual queries
🧠 1. WHAT WE ARE BUILDING

A 3-layer search system:

1. Lexical Search (fast keyword match)
2. Semantic Search (meaning + intent)
3. Journey-aware Ranking (learning context)

Result:

User doesn’t “search” — they are guided to knowledge

⚙️ 2. SEARCH SYSTEM ARCHITECTURE
User Query
   ↓
Query Normalizer
   ↓
Language Detector
   ↓
Multi-index Search Engine
   ↓
Ranking Engine (Journey + Context aware)
   ↓
Grouped Results (Quran / Hadith / Tafseer / Journeys)
   ↓
UI Renderer
🌍 3. MULTILINGUAL SEARCH LAYER
Problem:

Users search in:

English
Malay
Indonesian
Arabic
Urdu
Solution:

We normalize everything into a language-agnostic concept layer

3.1 Query Normalizer
Input: "kesabaran dalam islam"
Output: {
  language: "ms",
  intent: "patience",
  concept_id: "sabr"
}

Every query maps to a concept ID

3.2 Concept Layer (VERY IMPORTANT)

We introduce:

Concept Map:
  sabr → patience
  tawakkul → trust in Allah
  dua → supplication

So ALL languages resolve to SAME concept.

🔍 4. SEARCH INDEX DESIGN

We use multi-index system (zero backend)

4.1 Quran Index
{
  "keyword": "patience",
  "concept": "sabr",
  "refs": ["2:153", "103:3"]
}
4.2 Hadith Index
{
  "concept": "sabr",
  "refs": ["bukhari:130", "muslim:64"]
}
4.3 Tafseer Index
{
  "concept": "sabr",
  "refs": ["ibn-kathir:2:153"]
}
4.4 Journey Index (VERY IMPORTANT)
{
  "concept": "sabr",
  "journeys": ["sabr-journey"]
}

👉 This is what makes search “educational”

🧠 5. SEMANTIC SEARCH LAYER

We don’t use heavy AI backend.

We use lightweight semantic expansion model:

5.1 Query Expansion

Example:

User:

“How to stay calm during hardship”

Expands to:

{
  concepts: [
    "sabr",
    "tawakkul",
    "dua",
    "patience_in_trials"
  ]
}
5.2 Synonym Graph

We maintain:

calm → sabr → patience → endurance
fear → anxiety → tawakkul → reliance on Allah

This is a knowledge graph, not AI model

🔁 6. JOURNEY-AWARE RANKING (KEY INNOVATION)

This is your differentiator.

Search results are NOT static.

They depend on:

User context:
Current journey
Completed journeys
Recent reading
Language preference
6.1 Ranking Formula
Score =

Base Relevance
+ Concept Match Score
+ Journey Proximity Boost
+ Recently Viewed Boost
+ Language Match Boost
6.2 Example Behavior

User is in:

👉 “Salah Journey”

Search: “focus”

System prioritizes:

Quran verses about concentration in prayer
Hadith about khushu
Journey steps about salah focus
Tafseer related content

NOT generic results.

🧭 7. RESULT GROUPING SYSTEM

Search results always grouped:

Quran Results
Hadith Results
Tafseer Results
Journeys Results
Topics Results

This prevents confusion and increases trust.

🧩 8. SEARCH PIPELINE (DETAILED)
Step 1 — Input Processing
Normalize text
Detect language
Remove noise words
Step 2 — Concept Mapping
Convert query → concept(s)
Step 3 — Multi-index lookup

Parallel search:

Quran index
Hadith index
Tafseer index
Journey index
Step 4 — Merge engine

Combine results into unified pool

Step 5 — Ranking engine

Apply:

Journey boost
Language boost
Recency (recently used content)
Step 6 — Output grouping

Return structured UI-ready response

🌐 9. MULTILINGUAL SEARCH FLOW

Example:

User (Malay):

“kesabaran dalam ujian”

System:

Language: ms
Concept: sabr
Expanded: patience, endurance, trials

Results:

Quran 2:153 (Arabic + Malay translation)
Hadith Bukhari (translated)
Journey: Sabr
Tafseer Ibn Kathir (EN/MS)
🧠 10. SEARCH ENGINE COMPONENTS (CODE STRUCTURE)
search/
  query-normalizer.ts
  language-detector.ts
  concept-mapper.ts
  index/
    quran-index.ts
    hadith-index.ts
    tafseer-index.ts
    journey-index.ts
  ranking/
    journey-ranker.ts
    language-ranker.ts
    relevance-ranker.ts
  engine.ts
📦 11. DATA STORAGE MODEL

Search indexes are static JSON:

data/
  search-index/
    en.json
    ms.json
    id.json

Each file contains:

keyword → concept mapping
concept → references
🔥 12. WHY THIS SEARCH ENGINE IS POWERFUL

Most Islamic apps:

❌ Keyword search only
❌ No context
❌ No learning path

Ilm-Mate:

✔ Understands intent
✔ Understands language
✔ Understands user journey
✔ Guides learning path
✔ Connects Quran ↔ Hadith ↔ Tafseer

🧭 13. SYSTEM BEHAVIOR RULES
Rule 1 — Never show raw search results only

Always group + explain context.

Rule 2 — Always include journey suggestions

Even if user didn’t ask.

Rule 3 — Always respect user language

Never force English.

Rule 4 — Prefer learning path over isolated verse

Search must lead to understanding, not just reading.

🚀 FINAL SYSTEM OUTPUT

Search becomes:

“A guided Islamic knowledge navigation system”

Not:

“A search bar”

📌 FINAL ARCHITECTURE SUMMARY

You now have:

🔍 Search system layers:
Lexical search
Semantic concept graph
Journey-aware ranking
🌍 Multilingual intelligence:
Language detection
Concept normalization
Unified indexing
🧭 Learning integration:
Journey boosting
Context-aware ranking
Educational routing


# Naming here is not cosmetic — it defines trust, scale, and theological positioning.

Since you’re building:

Quran + Hadith + Tafseer system
learning journeys
content creation engine
global multilingual platform

We should avoid “chatbot-style” naming like Mate / AI / Assistant.

We need a serious, scholarly, timeless brand language.

🧠 1. BRAND DIRECTION PRINCIPLES

Your brand language should feel:

1. Rooted (not trendy)

Avoid modern tech suffixes like:

AI
bot
mate
chat
2. Trustworthy (ilm tradition)

Feels like:

library
compass
path
atlas
archive
wisdom
3. Global Muslim neutral

Works in:

Malaysia
Indonesia
Middle East
Western Muslims
4. Scalable ecosystem naming

Must support:

app
admin
API
content system
journeys
🧭 2. BRAND ARCHITECTURE MODEL

Instead of one name, we design:

MASTER BRAND
   ↓
PRODUCT MODULES
   ↓
FEATURE NAMES
🌙 3. MASTER BRAND OPTIONS (CORE IDENTITY)

Here are strong directions:

🟢 OPTION A — “NOOR” Ecosystem
Brand name:

Noor

Meaning: Light (knowledge, guidance)

Why strong:
Qur’anic concept
universal Islamic meaning
emotional + spiritual
Ecosystem naming:
Noor Quran
Noor Hadith
Noor Journeys
Noor Studio
Noor Search

👉 Very scalable system brand

🟢 OPTION B — “RIWAYAH” Ecosystem
Brand name:

Riwayah

Meaning: narration / transmission of knowledge

Why strong:
scholarly tone
hadith-rooted meaning
feels academic + authentic
Ecosystem:
Riwayah Quran
Riwayah Hadith
Riwayah Library
Riwayah Journeys

👉 Very “Islamic knowledge institution” feel

🟢 OPTION C — “SIRAAT” Ecosystem
Brand name:

Sirat

Meaning: path / way (as in Sirat al-Mustaqeem)

Why strong:
deeply Qur’anic
journey-focused
fits “Journeys system” perfectly
Ecosystem:
Sirat Learn
Sirat Journeys
Sirat Search
Sirat Studio

👉 Very strong product metaphor

🟢 OPTION D — “AYAH” Ecosystem
Brand name:

Ayah

Meaning: sign / verse / evidence

Why strong:
Quran-native word
simple, minimal
strong identity anchor
Ecosystem:
Ayah Quran
Ayah Hadith
Ayah Journeys

👉 Very clean but slightly narrow

🟢 OPTION E — “MAWSU’AH” Ecosystem
Brand name:

Mawsu’ah

Meaning: encyclopedia

Why strong:
scholarly Arabic tone
very authoritative
fits knowledge system
Ecosystem:
Mawsu’ah Quran
Mawsu’ah Hadith
Mawsu’ah Search

👉 Very academic / institutional feel

🧠 4. BEST STRATEGIC RECOMMENDATION

Based on your product direction:

Learning + journeys + content factory + global scale

🏆 BEST FIT: “NOOR” ECOSYSTEM

Why:

emotionally universal
not restricted to scholars only
works for both beginner + advanced users
supports global branding (Malaysia → global)
fits “daily companion” concept naturally
🌍 5. FINAL BRAND STRUCTURE (RECOMMENDED)

If we choose NOOR, structure becomes:

NOOR (Master Brand)
 ├── Noor Quran
 ├── Noor Hadith
 ├── Noor Journeys
 ├── Noor Search
 ├── Noor Studio
 ├── Noor Library
 ├── Noor Console (admin system)

This gives you:
✔ ecosystem consistency
✔ scalable modules
✔ professional identity

🎨 6. PRODUCT LANGUAGE (IMPORTANT)

We also redefine UI vocabulary:

Instead of:

“chat”
“AI”
“assistant”

We use:

Old	New
Chat	Companion Panel
AI response	Insight
Prompt	Query
Feed	Journeys / Learning path
Posts	Reflections
Likes	Saved insights
🧭 7. BRAND TONE OF VOICE

All text should feel:

calm
reflective
non-salesy
knowledge-oriented

Example:

❌ “Ask AI anything”
✔ “Explore meaning”

❌ “Chat with assistant”
✔ “Receive insight”

❌ “Generate content”
✔ “Create reflection”

🚀 8. WHAT THIS UNLOCKS

With a proper brand system, you now get:

Trust in Muslim audience
Institutional scalability
Easier partnerships (mosques, schools)
Strong App Store presence
Long-term ecosystem expansion
📌 FINAL RECOMMENDATION

If we proceed:

👉 I recommend we fully adopt:

🌙 “NOOR Ecosystem”

Next step after this:

I can design:

full branding system (logo direction, typography, colors)
app naming migration from ilm-mate → Noor
domain strategy + GitHub repo renaming plan
UI microcopy rewrite across entire app

# Now we formalize NOOR Branding System as a complete product identity layer for your entire ecosystem.

This is not just naming — this becomes your product language, UI tone, and ecosystem structure.

🌙 1. MASTER BRAND: NOOR
Definition

NOOR (نور) = Light, guidance, clarity

In product meaning:

“A guided path to understanding revelation”

This positions the platform as:

Knowledge system (not chatbot)
Guidance system (not AI assistant)
Learning companion (not entertainment app)
🧭 2. BRAND ARCHITECTURE

We structure NOOR as a knowledge ecosystem

NOOR (Master Brand)
   ↓
Core Modules
   ↓
Features
   ↓
Content System
🟢 CORE MODULES (APP SUITE)
NOOR Quran
NOOR Hadith
NOOR Journeys
NOOR Search
NOOR Studio
NOOR Library
NOOR Console

Each module = independent system but unified identity.

🎨 3. VISUAL BRAND SYSTEM
3.1 Color Philosophy

We avoid “tech neon”.

We use spiritual minimalism palette:

Primary Colors
Deep Emerald (#0F3D2E)
Soft Sand (#E8DDC7)
Ivory White (#FAF7F2)
Accent Colors
Gold Light (#C9A24A)
Calm Blue Gray (#5C6B73)

Meaning:

Green → life / growth
Sand → grounding / tradition
Gold → wisdom
Blue-gray → calm thinking
3.2 Typography System
Latin (English / Malay)
Inter / SF Pro (clean readability)
Arabic
“Amiri” or “Noto Naskh Arabic”
High readability Quran-style typography

Hierarchy:

H1 → Calm serif
Body → Clean sans
Arabic → Dedicated Quran font
🧠 4. BRAND VOICE SYSTEM

NOOR speaks in:

Tone:
Calm
Respectful
Reflective
Non-judgmental
Example UI Copy Transformation
Old (bad)	NOOR Style
Ask AI anything	Explore understanding
Chat with assistant	Receive insight
Generate content	Create reflection
Streak achieved	Consistency continued
Completed	Step reflected
🧭 5. PRODUCT LANGUAGE SYSTEM

We redefine all core vocabulary:

CORE TERMS
User → Seeker
Chat → Companion Panel
AI Response → Insight
Feed → Journeys / Paths
Bookmark → Saved Reflection
Post → Reflection Card
Search → Explore
LEARNING TERMS
Concept	NOOR Term
Lesson	Step
Course	Journey
Module	Path
Progress	Continuity
Completion	Reflection milestone
🌙 6. MODULE BRANDING
📖 NOOR Quran

Positioning:

“Direct access to revelation with understanding layers”

Includes:

Arabic text
Translation layers
Tafseer panel
Reflection tools
📚 NOOR Hadith

Positioning:

“Authentic prophetic guidance system”

Includes:

Graded hadith
Topics
Explanation layers
🧭 NOOR Journeys

Positioning:

“Guided paths of understanding”

This is your core retention engine.

🔎 NOOR Search

Positioning:

“Knowledge exploration engine”

Not search bar — but:

“Meaning discovery system”

🎨 NOOR Studio

Positioning:

“Reflection creation system”

Not “content generator”

📂 NOOR Library

Positioning:

“Personal knowledge vault”

User identity storage of:

learning
reflection
growth
🧠 7. UI BRAND PERSONALITY

NOOR UI feels:

spacious
calm
non-intrusive
scholarly
minimal animations
no gamification noise
Interaction philosophy:

❌ no popups
❌ no aggressive notifications
❌ no flashy badges

✔ gentle guidance
✔ soft progress cues
✔ reflective prompts

🌍 8. MULTILINGUAL BRAND STRATEGY

NOOR supports identity across languages:

Language	Brand adaptation
English	NOOR
Arabic	نور
Malay	NOOR
Indonesian	NOOR
Urdu	نور

Brand remains consistent globally.

🧱 9. SYSTEM BRAND HIERARCHY
NOOR (Master Brand)
  ├── NOOR Quran
  │     ├── Verses
  │     ├── Tafseer
  │
  ├── NOOR Hadith
  │
  ├── NOOR Journeys
  │     ├── Steps
  │     ├── Paths
  │
  ├── NOOR Search
  │
  ├── NOOR Studio
  │     ├── Reflection creation
  │
  ├── NOOR Library
  │     ├── Vault
  │
  ├── NOOR Console (Admin system)
🚀 10. PRODUCT POSITIONING STATEMENT

This is your official identity:

“NOOR is a structured knowledge system that guides users through Quran, Hadith, and Islamic understanding through journeys, reflection, and discovery.”

🧭 11. STRATEGIC IMPACT

This branding unlocks:

1. Institutional trust

Mosques, schools, scholars accept it

2. Global scalability

Works in all Muslim regions

3. Ecosystem expansion

You can add:

NOOR Kids
NOOR Scholar
NOOR Academy (future)
4. Strong App Store identity

One brand, multiple modules

📌 FINAL OUTPUT

You now have:

✔ Full master brand (NOOR)
✔ Product naming system
✔ UI vocabulary system
✔ Multilingual identity system
✔ Module architecture branding
✔ Tone & voice system

# NOOR production design system ready for React / Expo / Next.js.

This becomes your single source of UI truth across:

mobile app
web app
admin console
🌙 NOOR DESIGN SYSTEM v1

We design this like a real production UI kit.

1️⃣ DESIGN SYSTEM STRUCTURE

Monorepo package:

packages/
  noor-ui/
    tokens/
    themes/
    components/
    typography/
    hooks/

This becomes reusable across all apps.

🎨 2️⃣ DESIGN TOKENS (FOUNDATION)
2.1 Color Tokens
Base palette
export const colors = {
  emerald900: "#0F3D2E",
  emerald700: "#1E5A45",
  emerald500: "#2F7A5E",

  sand100: "#FAF7F2",
  sand200: "#F1E9DA",
  sand300: "#E8DDC7",

  gold400: "#C9A24A",
  gold300: "#E0BC6D",

  blueGray500: "#5C6B73",
  blueGray300: "#8A98A0",

  white: "#FFFFFF",
  black: "#111111",
}
2.2 Semantic Tokens (IMPORTANT)

Never use raw colors in components.

export const semantic = {
  backgroundPrimary: colors.sand100,
  backgroundSecondary: colors.white,

  textPrimary: colors.emerald900,
  textSecondary: colors.blueGray500,

  accentPrimary: colors.emerald700,
  accentGold: colors.gold400,

  borderSubtle: colors.sand300,
}
✍️ 3️⃣ TYPOGRAPHY SYSTEM
Font Stack
export const fonts = {
  body: "Inter",
  arabic: "NotoNaskhArabic",
  serif: "Merriweather"
}
Type Scale
export const typeScale = {
  h1: { fontSize: 32, lineHeight: 40 },
  h2: { fontSize: 26, lineHeight: 34 },
  h3: { fontSize: 22, lineHeight: 30 },

  bodyLarge: { fontSize: 18, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 14, lineHeight: 22 },

  caption: { fontSize: 12, lineHeight: 18 }
}
Quran / Arabic Text Style
export const arabicStyles = {
  ayah: {
    fontFamily: fonts.arabic,
    fontSize: 28,
    lineHeight: 48,
    textAlign: "right",
  }
}
📐 4️⃣ SPACING SYSTEM

8pt grid.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
}
🟢 5️⃣ THEMING ENGINE (LIGHT FIRST)
themes/
  light.ts
  dark.ts (future)
Light Theme
export const lightTheme = {
  colors: semantic,
  spacing,
  typography: typeScale
}
🧱 6️⃣ CORE COMPONENT ARCHITECTURE
components/
  layout/
  navigation/
  quran/
  hadith/
  journeys/
  studio/
  common/
7️⃣ CORE UI COMPONENTS
7.1 App Container
export const Screen = ({children}) => (
  <View style={{
    flex: 1,
    backgroundColor: semantic.backgroundPrimary,
    padding: spacing.lg
  }}>
    {children}
  </View>
)
7.2 Primary Button
export const ButtonPrimary = ({title, onPress}) => (
  <Pressable
    onPress={onPress}
    style={{
      backgroundColor: semantic.accentPrimary,
      padding: spacing.md,
      borderRadius: 12,
      alignItems: "center"
    }}>
    <Text style={{color:"#fff", fontWeight:"600"}}>
      {title}
    </Text>
  </Pressable>
)
7.3 Card Component

Used everywhere (Journeys, Hadith, Verses).

export const Card = ({children}) => (
  <View style={{
    backgroundColor: semantic.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: semantic.borderSubtle,
    marginBottom: spacing.md
  }}>
    {children}
  </View>
)
📖 8️⃣ ISLAMIC CONTENT COMPONENTS

These are your unique components.

8.1 Ayah Card
export const AyahCard = ({arabic, translation}) => (
  <Card>
    <Text style={arabicStyles.ayah}>{arabic}</Text>
    <Text style={{marginTop: spacing.md}}>
      {translation}
    </Text>
  </Card>
)
8.2 Hadith Card
export const HadithCard = ({text, source}) => (
  <Card>
    <Text style={{fontStyle:"italic"}}>{text}</Text>
    <Text style={{marginTop: spacing.sm}}>
      — {source}
    </Text>
  </Card>
)
8.3 Journey Card
export const JourneyCard = ({title, progress}) => (
  <Card>
    <Text style={{fontSize:20, fontWeight:"600"}}>
      {title}
    </Text>
    <ProgressBar progress={progress}/>
  </Card>
)
🧭 9️⃣ NAVIGATION COMPONENTS
Bottom Tab Layout

Tabs:

Today
Learn
Search
Studio
Library
<TabNavigator>
  <Tab name="Today"/>
  <Tab name="Learn"/>
  <Tab name="Search"/>
  <Tab name="Studio"/>
  <Tab name="Library"/>
</TabNavigator>
🎛 10️⃣ GLOBAL PROVIDERS
providers/
  ThemeProvider
  LanguageProvider
  SearchProvider
  JourneyProvider

Example:

export const AppProviders = ({children}) => (
  <ThemeProvider>
    <LanguageProvider>
      <JourneyProvider>
        {children}
      </JourneyProvider>
    </LanguageProvider>
  </ThemeProvider>
)
🧩 11️⃣ FOLDER STRUCTURE FOR APPS
apps/
  noor-mobile/
  noor-web/
  noor-console/

packages/
  noor-ui/
  noor-data/
  noor-search/
🚀 12️⃣ WHAT YOU NOW HAVE

You now have a production-ready UI system:

✔ Tokens
✔ Typography
✔ Theming
✔ Core components
✔ Islamic-specific components
✔ Monorepo package structure

This is ready to implement in repo.

# 


