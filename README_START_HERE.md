# NOOR Sprint 27.1 — Evidence Record Update Helper

Bismillah.

This patch adds a safe command-line helper to update one Sprint 27 evidence record at a time.

It does not approve production CDN content.
It does not push noor-cdn.
It keeps production_promotion_approval records locked.

## Commands added

```powershell
pnpm ilm:evidence-helper
pnpm ilm:evidence:list
pnpm ilm:evidence:update -- --id=<record-id> --status=<status> ...
pnpm check:ilm-evidence-helper
```

## Normal test flow

```powershell
node scripts/apply-sprint27-1-package-scripts.mjs

pnpm ilm:evidence-helper
pnpm ilm:evidence:list -- --domain=quran
pnpm check:ilm-evidence-helper
pnpm typecheck
pnpm build
```

After build, clean generated cache:

```powershell
git restore apps/web/tsconfig.tsbuildinfo
git status
```

## Example safe update

```powershell
pnpm ilm:evidence:update -- --id=ilm-mate-v1-quran-source_identity-evidence-record --status=submitted --reviewer-name="Darya Malak" --reviewer-role="Founder" --evidence-reference="Initial source evidence received" --source-url-or-document="content source folder / document link" --notes="Submitted for reviewer checking"
```

Then validate again:

```powershell
pnpm check:ilm-evidence-records
pnpm check:ilm-evidence-helper
```

## Policy

Production approval records remain blocked until a future explicit production promotion sprint.
