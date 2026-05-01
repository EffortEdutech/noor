# NOOR Sprint 26.5 — ilm-mate Content Migration Adapter

## Purpose

Sprint 26.5 imports the old ilm-mate content folder into NOOR's CDN-shaped staging format.

Old source:

```text
muslim-companion-poc/content
├─ quran
├─ tafsir
└─ hadith
```

New staging output:

```text
content-pipeline/imported/ilm-mate-v1/noor-cdn
├─ manifest
├─ metadata
├─ quran
├─ tafseer
├─ hadith
└─ search
```

## Important production rule

This sprint does **not** promote migrated content to production.

The output is intentionally marked:

```text
mode: staging
```

Production CDN publishing still requires:

1. source license review,
2. attribution check,
3. checksum/integrity record,
4. scholarly/content review,
5. NOOR production promotion gate approval.

## Commands

```powershell
pnpm ilm:inspect
pnpm ilm:migrate:all
pnpm check:ilm-migration
```

Optional targeted migration:

```powershell
pnpm ilm:migrate:quran
pnpm ilm:migrate:tafseer
pnpm ilm:migrate:hadith
```

## Default source discovery

The scripts try to find ilm-mate content in this order:

```text
ILM_MATE_CONTENT_ROOT env variable
--source=...
../muslim-companion-poc/content
../ilm-mate/content
content-pipeline/sources/ilm-mate/content
./content
```

Recommended local folder layout:

```text
C:\Users\user\Documents\00 Combo3
├─ Noor
└─ muslim-companion-poc
```

## Output notes

- Quran is converted from edition-based files into NOOR surah-based files.
- Tafseer is converted from per-surah ayah files into NOOR `TafseerEntry[]` files.
- Hadith old edition files become NOOR Hadith collections.
- Search index is generated from the staging output using Sprint 26 search index builder.
- Spanish/French are deferred because current NOOR `LanguageCode` does not yet include them.

## Safe preview path

For now, keep migrated content in:

```text
content-pipeline/imported/ilm-mate-v1/noor-cdn
```

Do not copy it into `noor-cdn` production repo yet.
