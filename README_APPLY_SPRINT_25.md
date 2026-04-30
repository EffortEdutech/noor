# Apply NOOR Sprint 25 Patch

Extract this zip at the NOOR repo root and overwrite existing files.

Then run:

```powershell
pnpm install
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
pnpm dev
```

Commit suggestion:

```powershell
git add .
git commit -m "feat(noor): add sprint 25 production cdn promotion gate"
git push
```
