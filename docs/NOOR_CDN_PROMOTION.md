# NOOR CDN Promotion Handoff

## Purpose

The CDN promotion handoff prevents accidental switching to an unverified CDN URL.

The safe sequence is:

1. Generate CDN publish pack.
2. Verify publish pack.
3. Smoke-test local or published CDN URL.
4. Generate promotion handoff.
5. Manually apply environment values.
6. Rebuild/redeploy NOOR.

## Commands

```powershell
pnpm cdn:pack
pnpm cdn:verify
pnpm cdn:smoke
pnpm cdn:promote
pnpm check:cdn-promotion
```

For a published URL:

```powershell
pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn
pnpm cdn:promote https://effortedutech.github.io/noor-cdn/noor-cdn
```

## Generated files

`pnpm cdn:promote` writes:

```text
content-pipeline/promotion/noor-cdn-promotion.json
content-pipeline/promotion/noor-cdn.env.local
content-pipeline/promotion/noor-cdn-promotion-checklist.md
```

These files are ignored by git because they are local handoff artefacts.

## Environment values

The generated `.env.local` handoff contains:

```text
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=<published-cdn-base>
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=<published-cdn-base>
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=<published-cdn-base>
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=<published-cdn-base>
```

## Local apply

Copy the generated file to `.env.local`:

```powershell
Copy-Item .\content-pipeline\promotion\noor-cdn.env.local .\.env.local -Force
pnpm dev
```

Open `/settings` and use External CDN mode.

## Vercel apply

In Vercel Project Settings → Environment Variables, add the generated `NEXT_PUBLIC_*` values. Then redeploy `main`.

## Production content warning

This sprint does not approve any real production Islamic content. Real Quran, tafseer and hadith datasets still require:

- licensing confirmation,
- attribution confirmation,
- source provenance,
- scholarly review,
- and a production promotion record.
