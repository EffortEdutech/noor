# NOOR Sprint 27.4 — ilm-mate Staging CDN Publish Pack Gate

## Purpose

Sprint 27.4 introduces a safe staging CDN publish gate for migrated ilm-mate content.

It does **not** publish to `noor-cdn/main`.

It does **not** approve production.

It only answers this question:

> Are Quran, Tafseer and Hadith ready to be copied into a `noor-cdn` staging branch?

## Commands

```powershell
pnpm ilm:staging-cdn-pack
pnpm check:ilm-staging-cdn-pack
```

## Output

```text
content-pipeline/review/ilm-mate-v1/staging-cdn-publish/
├── staging-cdn-publish-report.json
├── staging-cdn-publish-report.md
├── staging-cdn-domain-readiness.csv
├── staging-cdn-required-next-evidence.csv
└── future-noor-cdn-staging-commands.md
```

## Current expected status

After Sprint 27.3, only three `source_identity` records are accepted for staging.

Therefore Sprint 27.4 should report:

```text
Domains ready for staging: 0/3
Can push noor-cdn staging branch: false
Status: blocked
productionApproved: false
canPromoteToProduction: false
```

## Why blocked?

Each domain needs five non-production evidence items accepted for staging:

1. source identity
2. license or written redistribution permission
3. attribution wording
4. checksum / integrity plan
5. scholarly reviewer sign-off

The production promotion approval record remains blocked for a future sprint.

## noor-cdn rule

For Sprint 27.4:

```text
noor main: yes, after merge and checks
noor-cdn staging branch: not yet
noor-cdn main: no
production CDN: blocked
```
