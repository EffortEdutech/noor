# NOOR Sprint 27.9.1 — Hadith Collection ID Normalization Hotfix

## Purpose

Sprint 27.9 browser QA found a React warning on `/learn/hadith`:

```text
Encountered two children with the same key, `all`.
```

Root cause: migrated ilm-mate Hadith collections used `slugify(edition)` as the CDN collection ID. Some old source files reuse the same edition name, such as `all`, and many books reuse numeric file names such as `01`, `02`, and `03`.

This can create:

- duplicate React keys in the Hadith collection list;
- CDN path collisions such as `hadith/all/items.json`;
- accidental overwriting during migration.

## Scope

This sprint fixes staging content only.

Allowed:

- regenerate migrated Hadith collection IDs;
- rebuild search index;
- rebuild staging CDN candidate;
- rebuild git-safe noor-cdn staging pack;
- push only `noor-cdn/staging-ilm-mate-v1`.

Blocked:

- `noor-cdn/main`;
- production CDN;
- production promotion approval.

## New scripts

```powershell
pnpm ilm:hadith:normalize-ids
pnpm check:ilm-hadith-normalized-ids
```

The normalizer keeps the first occurrence of a legacy ID when safe, then renames later duplicates using the old source path. This preserves compatibility where possible while guaranteeing every final collection ID is unique.

## Expected result

The checker should end with:

```text
NOOR Sprint 27.9.1 Hadith normalized ID check passed.
Duplicate collection IDs: 0
Duplicate item IDs: 0
Production CDN remains blocked. noor-cdn/main remains blocked.
```

## After this sprint

Rebuild and push the noor-cdn staging branch again, then re-test NOOR app against the staging branch.

Do not push `noor-cdn/main` yet.
