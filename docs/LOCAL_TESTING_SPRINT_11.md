# NOOR Sprint 11 — Local Testing

## Commands

```powershell
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm typecheck
pnpm build
pnpm dev
```

## Pages to test

```text
http://localhost:3200/settings
http://localhost:3200/changelog
```

## Expected results

1. Settings should show `NOOR v0.11.0`.
2. Settings should show a Release notes card.
3. `/changelog` should show current and recent releases.
4. `pnpm check:release` should pass.
5. GitHub Actions should appear after push:
   - NOOR CI
   - NOOR Release

## After push

Open GitHub:

```text
https://github.com/EffortEdutech/noor/actions
```

Confirm both workflows complete successfully.

Then open:

```text
https://github.com/EffortEdutech/noor/releases
```

If `v0.11.0` did not already exist, the release workflow should create it automatically.
