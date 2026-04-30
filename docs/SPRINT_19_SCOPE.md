# Sprint 19 Scope — Production Source Intake Templates

## Objective

Create a structured intake layer for real Quran, tafseer and hadith source candidates before importer work starts.

---

## In scope

1. Source intake templates for Quran, tafseer and hadith.
2. Candidate source registry.
3. Minimum source intake schema.
4. `pnpm source:intake` validator and audit generator.
5. `pnpm check:source-intake` local/CI guard.
6. Settings Source Intake card.
7. App version, changelog, release notes and roadmap update to v0.19.0.

---

## Out of scope

1. Importing real Quran text.
2. Importing real tafseer text.
3. Importing real hadith collections.
4. Approving any production source automatically.
5. Replacing the existing demo content registry.
6. Enabling external paid content services.

---

## Acceptance criteria

- `pnpm source:intake` passes and generates audit files.
- `pnpm check:source-intake` passes after source intake audit generation.
- `pnpm roadmap:status` and `pnpm check:roadmap` pass.
- `pnpm check:pack`, `pnpm check:content`, `pnpm check:release`, `pnpm check:runtime`, CDN checks and source governance checks stay green.
- `pnpm typecheck` passes.
- `pnpm build` passes.
- `/settings` shows NOOR v0.19.0 and the Source Intake card.

