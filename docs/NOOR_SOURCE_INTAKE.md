# NOOR Source Intake

**Sprint:** 19  
**Version:** v0.19.0  
**Purpose:** Prepare real source candidates before production importer work begins.

---

## 1. Why this exists

NOOR is moving from demo content toward production Quran, tafseer and hadith content. Before building importers, every real source candidate must be recorded in a consistent intake format.

This prevents three risks:

1. Importing content before license/permission is clear.
2. Losing attribution requirements.
3. Treating unreviewed religious text as production-ready.

---

## 2. Files added

| File | Purpose |
| --- | --- |
| `content-pipeline/source-intake/templates/quran-source-intake.template.json` | Template for canonical Quran text source candidates. |
| `content-pipeline/source-intake/templates/tafseer-source-intake.template.json` | Template for tafseer book/source candidates. |
| `content-pipeline/source-intake/templates/hadith-source-intake.template.json` | Template for hadith collection/source candidates. |
| `content-pipeline/source-intake/noor-source-candidates.json` | Draft candidate registry for real sources. |
| `content-pipeline/schemas/noor-source-intake.schema.json` | Minimum schema for source candidate records. |
| `scripts/validate-noor-source-intake.mjs` | Validates templates and candidate registry. |
| `scripts/check-noor-source-intake.mjs` | Confirms Sprint 19 wiring, generated audit and CI setup. |

---

## 3. Commands

```bash
pnpm source:intake
pnpm check:source-intake
```

Generated audit output:

```text
content-pipeline/source-intake/audit/noor-source-intake-audit.json
content-pipeline/source-intake/audit/noor-source-intake-audit.md
```

The audit folder is generated and ignored by git. Regenerate it locally when testing.

---

## 4. Required fields

Each candidate must include:

- `id`
- `domain`
- `title`
- `language`
- `sourceType`
- `sourceUrl`
- `licenseStatus`
- `attributionText`
- `reviewerRequired`
- `approvalStatus`
- `importReadiness`

Additional domain-specific fields are allowed, such as `author`, `translator`, `compiler` or `gradingPolicy`.

---

## 5. Approval rule

A source candidate is not production-ready until all of these are complete:

1. Source URL or source file path recorded.
2. License status approved for redistribution.
3. Attribution wording approved.
4. Checksum/import plan recorded.
5. Reviewer role assigned.
6. Scholar/reviewer sign-off recorded.
7. `approvalStatus` changed to `production-approved` only after manual review.

---

## 6. Relationship with source governance

Sprint 17 source governance protects the existing demo CDN source registry.

Sprint 19 source intake prepares future real source candidates.

Both must remain active:

- `pnpm source:audit` checks the current demo/source governance registry.
- `pnpm source:intake` checks future candidate intake records.
- `pnpm source:gate` remains the production gate and should still block demo/unapproved sources.

