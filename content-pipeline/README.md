# NOOR Content Pipeline

Sprint 12 introduces the first source-to-CDN preparation workflow for NOOR.

The current pack is still demo content, but it is arranged in the same path structure expected by the NOOR CDN resolvers.

## Source folder

```text
content-pipeline/source/noor-demo-v0.12
```

## Generated folders

Running `pnpm content:prepare` creates or refreshes:

```text
content-pipeline/dist/noor-cdn
apps/web/public/noor-cdn
```

The public folder lets you test CDN mode locally with a base URL such as:

```text
http://localhost:3200/noor-cdn
```

## Commands

```powershell
pnpm content:validate
pnpm content:prepare
pnpm check:content
```

## Production rule

Do not promote any real Quran, tafseer or hadith source to production until the source registry records:

1. verified source,
2. redistribution license or permission,
3. attribution label,
4. import transform review,
5. validator pass,
6. scholar/reviewer sign-off.
