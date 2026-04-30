# Local Testing — Sprint 18

Run from the NOOR repo root:

```powershell
pnpm install
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:cdn-publish
pnpm check:cdn-smoke
pnpm check:cdn-promotion
pnpm source:audit
pnpm check:source-audit
pnpm typecheck
pnpm build
```

## Manual browser checks

```powershell
pnpm dev
```

Open:

- `http://localhost:3200/settings`
- `http://localhost:3200/changelog`
- `http://localhost:3200/learn/quran/1`
- `http://localhost:3200/explore`

Confirm:

- NOOR shows v0.18.0.
- Sprint 18 release note appears.
- Settings shows Roadmap Control.
- Roadmap Control shows Sprint 19 as the next sprint.
- Existing CDN, source governance and content health cards still appear.
- Build remains green.

## Git commands after green test

```powershell
git status
git add .
git commit -m "Sprint 18 roadmap control center"
git push origin main
```
