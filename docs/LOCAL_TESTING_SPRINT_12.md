# Local Testing — Sprint 12

## Standard test

```powershell
pnpm content:validate
pnpm content:prepare
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm:

1. NOOR shows v0.12.0.
2. Release notes show Sprint 12.
3. Content pipeline card appears.
4. Data mode still works normally.

## Optional CDN mode test

Create `.env.local`:

```env
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=http://localhost:3200/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=http://localhost:3200/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=http://localhost:3200/noor-cdn
```

Then restart dev server:

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/learn/quran/1
http://localhost:3200/settings
```

Confirm the app still loads the same demo content, now through the local static CDN path.

After testing, delete `.env.local` or change `NEXT_PUBLIC_NOOR_DATA_MODE=mock`.
