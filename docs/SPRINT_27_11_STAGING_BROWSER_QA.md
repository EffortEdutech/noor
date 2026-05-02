# NOOR Sprint 27.11 — Staging Browser QA / Quran + Tafseer + Hadith Runtime Verification

## Purpose

Sprint 27.11 moves beyond terminal acceptance and verifies the NOOR app in the browser against the staging CDN branch.

This sprint does not promote production. It validates that the staging CDN branch can be used safely for reviewer/runtime testing.

## Scope

- Verify Settings shows external CDN staging runtime.
- Verify Quran Surah index and sample Surahs load from CDN.
- Verify Tafseer library and sample entries load from CDN.
- Verify Hadith view by book and view by chapter are populated.
- Verify Hadith page has no duplicate React key console error.
- Verify Explore search uses external CDN search index.
- Document observed Hadith duplicate/search behavior for later refinement.
- Keep production CDN blocked.

## Commands

```powershell
pnpm qa:staging-browser
pnpm qa:staging-browser:update -- --id quran-index-cdn --status pass --reviewer "Darya Malak" --note "Loaded from CDN"
pnpm check:qa-staging-browser
```

After all browser checks are completed, a trusted reviewer may mark all as passed with:

```powershell
pnpm qa:staging-browser:update -- --all --status pass --reviewer "Darya Malak" --note "Manual browser QA completed on localhost:3200 against staging CDN."
```

Only use `--all` after the pages were actually checked.

## Output

```text
content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-report.json
content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-report.md
content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-checklist.csv
```

## Production gate

Production CDN promotion remains blocked. Do not update `noor-cdn/main` in this sprint.
