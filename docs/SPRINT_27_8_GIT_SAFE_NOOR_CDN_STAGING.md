# NOOR Sprint 27.8 Hotfix — Git-safe noor-cdn staging pack

## Purpose

The migrated ilm-mate CDN candidate can generate a very large full search index. GitHub blocks files above 100 MB, so the noor-cdn staging branch must not contain a monolithic `search/search-index.json` when that file is too large.

## What this hotfix does

- Creates `content-pipeline/publish/ilm-mate-v1-staging-cdn-git-safe/noor-cdn`.
- Mirrors the staging CDN candidate into the git-safe folder.
- Converts a large `search/search-index.json` into:
  - `search/search-index.json` — small lite compatibility index.
  - `search/search-index-lite.json` — same lite index copy.
  - `search/shards/search-index-0001.json`, etc. — full sharded search data.
  - `manifest/search-index-manifest.json` — sharded manifest and checksums.
- Generates a handoff guide for pushing only `noor-cdn/staging-ilm-mate-v1`.

## Production gate

Production remains blocked. This is only a staging CDN branch handoff.
