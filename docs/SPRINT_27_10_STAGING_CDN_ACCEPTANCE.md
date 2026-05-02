# Sprint 27.10 — Staging CDN Acceptance Checklist

## Status

Accepted for staging runtime and reviewer QA only.

Production CDN remains blocked.

## Purpose

Sprint 27.10 verifies that the migrated ilm-mate CDN candidate is ready for staging browser testing before any production CDN promotion.

## Confirmed Gates

- Quran staging CDN content is present.
- Tafseer staging CDN index and files are present.
- Hadith staging CDN collections are present.
- Search staging CDN files are present.
- Runtime staging environment is configured.
- Browser QA remains required before production consideration.

## Production Safety

This sprint does not promote content to noor-cdn/main.

Allowed CDN branch:

noor-cdn/staging-ilm-mate-v1

Blocked production branch:

noor-cdn/main

## Commands

pnpm cdn:staging-acceptance
pnpm check:cdn-staging-acceptance
pnpm check:cdn-staging-runtime
pnpm typecheck
pnpm build

## Outcome

Sprint 27.10 accepted the staging CDN candidate for reviewer/runtime testing only.

Production CDN promotion remains blocked pending final approval.
