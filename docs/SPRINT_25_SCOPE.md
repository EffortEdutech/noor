# Sprint 25 Scope — Production CDN v1 Promotion

## Objective

Generate a safe production CDN v1 promotion candidate and environment preview while keeping NOOR runtime defaults on bundled content until source review gates are approved.

## Included

- Production CDN promotion script.
- Promotion check script.
- Settings card.
- Generated JSON, Markdown and env preview.
- Roadmap update from Sprint 24 to Sprint 25.
- Release metadata update to v0.25.0.
- CI update.

## Not included

- No real Quran/tafseer/hadith production data is approved.
- No automatic runtime switch to CDN mode.
- No silent Vercel environment change.
- No external publish action.

## Done criteria

```powershell
pnpm production:promote
pnpm check:production-promotion
pnpm roadmap:status
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:roadmap
pnpm typecheck
pnpm build
```
