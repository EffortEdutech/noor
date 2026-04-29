Quran/Hadith/Tafseer data CDN architecture.

# We need to move Quran/Hadith/Tafseer into a data CDN architecture.

First — Important mindset shift

Your app should NOT “host the data”.

Your app should consume public static data endpoints.

Think like frontend app fetching from API/CDN.

Why Vercel fails

Free Vercel limits:

100MB serverless function size
100GB bandwidth/month
Build memory/time limits

Quran + Hadith + Tafseer multi-language easily:

Quran text + translations: 50–150MB
Tafseer: 300MB–2GB
Hadith full corpus: 1–5GB

So putting JSON in repo = impossible.

The ZERO BUDGET architecture (battle-tested)

We split by dataset type, not by “database”.

You were close 🙂 but instead of DB hosts → use static file hosting.

Final architecture
User App (Vercel)
        ↓ fetch
Data CDN layer (FREE multi-host)
        ↓
Static JSON / compressed files

Your app becomes lightweight frontend only.

Where to host huge Islamic datasets FREE

These platforms give free CDN + huge storage.

Platform	Why perfect
GitHub Releases	unlimited file size via assets
Cloudflare R2 (free tier)	S3-like storage, zero egress
jsDelivr CDN	turns GitHub repo into CDN
HuggingFace Datasets	insanely good for huge JSON
Supabase Storage (free)	1GB free

We combine them.

Recommended split per dataset

This is the key design.

1️⃣ Quran text + translations → GitHub + jsDelivr CDN

Create repo:

noor-quran-data

Structure:

/quran
   /uthmani.json
   /indopak.json
/translations
   /en.sahih.json
   /ms.basmeih.json
   /id.indonesian.json
/transliteration

Then access via CDN:

https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data/quran/uthmani.json

Benefits:

Free global CDN
Cached worldwide
No server needed
Perfect for Quran size
2️⃣ Tafseer → HuggingFace datasets (BEST SECRET)

Tafseer is HUGE. GitHub repo will become slow.

Create dataset:

huggingface.co/datasets/noor/tafseer

Store:

/ar/ibn-kathir.json.gz
/en/ibn-kathir.json.gz
/ms/ibn-kathir.json.gz

Why HuggingFace:

Built for multi-GB datasets
Free CDN
Fast downloads
Supports gzip automatically

Fetch example:

https://huggingface.co/datasets/noor/tafseer/resolve/main/en/ibn-kathir.json.gz

This is perfect for tafseer scale.

3️⃣ Hadith → Cloudflare R2 (free object storage)

Hadith corpus is biggest dataset.

Use Cloudflare R2 free tier:

10GB free storage
ZERO bandwidth cost 😍
S3 compatible

Bucket structure:

hadith/
   bukhari/
      en.json.gz
      ar.json.gz
   muslim/
   tirmidhi/

Access via public URL:

https://data.noor.app/hadith/bukhari/en.json.gz

This becomes your “Hadith CDN”.

Very important: Compress EVERYTHING

Never serve raw JSON.

Convert to:

.json.gz

Compression savings:

Data	Raw	Gzip
Quran translations	120MB	20MB
Tafseer	1GB	150MB
Hadith	3GB	400MB

This is the trick that makes zero budget possible.

Browser auto-decompresses.

How the app will fetch data

Your Vercel app becomes simple:

Example:

const quran = await fetch(
  "https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data/quran/uthmani.json"
).then(r=>r.json())

Hadith example:

const hadith = await fetch(
  "https://data.noor.app/hadith/bukhari/en.json.gz"
).then(r=>r.json())

No backend. No database. No cost.

Even better — load per Surah / per Book (critical)

Do NOT load full Quran at once.

Split files like:

quran/surah/1.json
quran/surah/2.json
translations/en/2.json
tafseer/en/2.json
hadith/bukhari/book_1.json

This gives:

instant app load
tiny bandwidth
mobile friendly
Final answer to your idea

Can we split multiple database host?

Correct direction.
But upgrade the idea:

Not multiple databases → multiple static CDNs.

Final stack:

Dataset	Host
Quran + translations	GitHub + jsDelivr
Tafseer	HuggingFace
Hadith	Cloudflare R2
App frontend	Vercel

Monthly cost = $0

And this architecture scales to millions of users.


# First — what this repo should become

Your repo must stay frontend-only.

Meaning:

UI
search logic
state management
caching
fetchers

❌ NOT:

Quran JSON
Hadith JSON
Tafseer JSON

This repo should stay tiny (<20MB) forever.

Correct architecture for Muslim Companion POC

We convert your app into a data-consumer app.

muslim-companion-poc (Vercel)
        ↓ fetch()
Islamic Data CDN Layer (free)

Think “Spotify app vs Spotify music files”.

The mistake to avoid

Do NOT do:

Supabase DB for Quran ❌
MongoDB for Hadith ❌
Firebase for Tafseer ❌

Why?
Because this data is read-only.

Databases cost money because of queries + compute.
You only need static file delivery.

We want CDN, not DB.

The real zero-budget production architecture

We split by data size + update frequency.

Tier 1 — Small & frequently used → GitHub CDN

Create new repo:

EffortEdutech/islamic-static-data

Store:

/quran/
  surah/1.json
  surah/2.json

/translations/
  en/surah/1.json
  ms/surah/1.json

/transliteration/

Serve via jsDelivr:

https://cdn.jsdelivr.net/gh/EffortEdutech/islamic-static-data/quran/surah/1.json

This becomes your Quran API.

Cost = $0 forever.

Tier 2 — Medium (Tafseer) → HuggingFace

Tafseer is too big for GitHub repo.

Create:

huggingface.co/datasets/narrio/tafseer

Store gzipped per-surah:

/en/ibn-kathir/1.json.gz
/ms/ibn-kathir/1.json.gz
/ar/ibn-kathir/1.json.gz

This becomes Tafseer API.

Why HF is perfect:

Free multi-GB hosting
Built for datasets
Global CDN
Fast range downloads
Tier 3 — Massive (Hadith) → Cloudflare R2

Hadith full corpus is the monster.

Free tier gives:

10GB storage
Unlimited bandwidth 😍

Bucket:

r2://narrio-hadith/
   bukhari/book_1.json.gz
   muslim/book_1.json.gz

Public URL:

https://data.muslimcompanion.app/hadith/bukhari/book_1.json.gz

This becomes Hadith API.

How the app will fetch (important)

Inside your repo you create a data layer:

/lib/api/
   quran.ts
   tafseer.ts
   hadith.ts

Example:

// lib/api/quran.ts
export async function getSurah(surah:number){
  const res = await fetch(
   `https://cdn.jsdelivr.net/gh/EffortEdutech/islamic-static-data/quran/surah/${surah}.json`
  )
  return res.json()
}

No backend needed. No DB. No cost.

Critical performance trick (must do)

Split EVERYTHING by smallest unit.

Instead of:

quran.json (6MB)

Do:

surah/1.json (20kb)
surah/2.json (35kb)

Instead of:

bukhari.json (200MB)

Do:

bukhari/book_1.json.gz (1MB)

This makes mobile fast + cheap bandwidth.

Add offline caching (huge win)

Use:

TanStack Query cache
IndexedDB

So user downloads surah once → stays offline.

This makes the app feel native.

Final architecture summary
Layer	Platform	Cost
Frontend app	Vercel	Free
Quran + translations	GitHub + jsDelivr	Free
Tafseer	HuggingFace datasets	Free
Hadith	Cloudflare R2	Free

This stack can scale to millions of users with $0.

# Data Migration

What your repo should look like AFTER migration

Current:

muslim-companion-poc
 ├ content ❌ (must be removed)
 ├ app
 ├ components

Target:

muslim-companion-poc
 ├ app
 ├ components
 ├ lib/api   ← new
 ├ NO DATA FILES

And we create a NEW repo:

islamic-static-data  ← holds all JSON
Step 1 — classify what is inside /content

Your /content likely contains mix of:

quran text
translations
transliteration
tafseer
hadith (maybe later)

We must split them into CDN-friendly structure.

Step 2 — new folder structure (VERY IMPORTANT)

In new repo islamic-static-data:

/quran
   /surah/1.json
   /surah/2.json

/translations
   /en/surah/1.json
   /ms/surah/1.json

/transliteration
   /surah/1.json

/meta
   surah-list.json

If tafseer exists:

/tafseer
   /en/ibn-kathir/1.json.gz

Later hadith:

/hadith/bukhari/book_1.json.gz
Step 3 — split big JSON into per-surah files

Most Quran JSON comes like:

quran.json  (entire Quran)

We must convert into 114 files.

Target format:

/quran/surah/1.json
{
  "surah": 1,
  "name_ar": "الفاتحة",
  "name_en": "Al-Fatihah",
  "ayahs": [
    { "ayah": 1, "text": "بِسْمِ اللَّهِ..." },
    { "ayah": 2, "text": "الْحَمْدُ لِلَّهِ..." }
  ]
}
/translations/en/surah/1.json
{
  "surah": 1,
  "ayahs": [
    { "ayah": 1, "text": "In the name of Allah..." }
  ]
}

This is the most important transformation.

Why?

Users open 1 surah at a time
20–40kb download vs multi-MB
Huge bandwidth savings
Step 4 — host via jsDelivr CDN

After pushing to new repo, your data becomes API instantly:

https://cdn.jsdelivr.net/gh/EffortEdutech/islamic-static-data/quran/surah/1.json

No backend. No cost. Global CDN.

Step 5 — remove /content from app repo

Replace with API layer:

Create:

/lib/api/quran.ts
const CDN = "https://cdn.jsdelivr.net/gh/EffortEdutech/islamic-static-data"

export const getSurah = (id:number)=>
 fetch(`${CDN}/quran/surah/${id}.json`).then(r=>r.json())

export const getTranslation = (lang:string,id:number)=>
 fetch(`${CDN}/translations/${lang}/surah/${id}.json`).then(r=>r.json())

App becomes data consumer.

Why this step is CRITICAL now

If you don’t migrate now:

repo size will explode
builds become slow
Vercel deploy will fail
future Hadith/Tafseer impossible

Migrating early = painless.

Migration plan (simple)
Create new repo islamic-static-data
Move /content there
Split into per-surah files
Delete /content from app repo
Add /lib/api fetch layer

Done.



