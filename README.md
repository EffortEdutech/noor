# NOOR — Sprint 0–2 Starter Pack

**Repo:** https://github.com/EffortEdutech/noor  
**Localhost port:** `3200`  
**Build mode:** zero-budget, offline-first, static CDN resolver ready

Bismillah. This pack combines:

- **Sprint 0 — Repo foundation + data contracts**
- **Sprint 1 — Design system + app shell**
- **Sprint 2 — Quran / Tafseer / Hadith CDN resolvers**

## Quick local test

```powershell
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3200
```

The root route redirects to `/today`.

## If you already cloned the GitHub repo

Copy the contents of this pack's `noor/` folder into your cloned repo root, then run:

```powershell
pnpm install
pnpm dev
```

## Folder paths included

```text
noor/
  apps/web/                 # Next.js app, port 3200
  packages/noor-ui/          # design system + shell components
  packages/noor-data/        # CDN resolvers + mock fallback
  packages/noor-content/     # content schemas + demo data
  packages/noor-search/      # local search over demo content
  packages/noor-config/      # shared project config
  docs/                      # sprint docs + contracts
  scripts/                   # local validation helper
```

## Data mode

By default, the app runs in mock mode:

```text
NEXT_PUBLIC_NOOR_DATA_MODE=mock
```

Later, when Quran / Tafseer / Hadith CDN buckets are ready:

```text
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data@main
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://huggingface.co/datasets/EffortEdutech/noor-tafseer-data/resolve/main
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://data.noor.app
```

## Commands

```powershell
pnpm dev          # runs apps/web on port 3200
pnpm build        # builds apps/web
pnpm typecheck    # TypeScript check
pnpm check:pack   # verifies required starter files exist
```

## Manual Git commit after testing

```powershell
git status
git add .
git commit -m "feat: initialize NOOR sprint 0-2 foundation"
git push origin main
```

## Safety rule

This pack intentionally avoids AI fatwa/chat features. The foundation focuses on verified content delivery, reader experience, bookmarks, search, and CDN-ready architecture.
