# Sprint 24 Scope — Scholarly Review Console

## Objective

Add a visible scholarly review console that keeps Quran, tafseer and hadith production approval evidence in one place.

## Included

- Review registry JSON for Quran, tafseer and hadith.
- Generated review audit JSON and Markdown.
- `review:console` generator command.
- `check:review-console` validation command.
- Settings UI card.
- Roadmap, release metadata and CI updates.

## Excluded

- No production content approval.
- No automatic reviewer approval.
- No external database.
- No paid service.
- No production CDN promotion.

## Definition of done

- `pnpm review:console` passes.
- `pnpm check:review-console` passes.
- `pnpm check:pack` passes.
- `pnpm check:release` passes.
- `pnpm check:roadmap` passes.
- `pnpm typecheck` passes.
- `pnpm build` passes.
- Settings page shows the Scholarly Review Console card.
