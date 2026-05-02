# Sprint 27.9.2 — Hadith View Model Normalization

Generated: 2026-05-02T08:14:05.406Z
Source root: `C:\Users\user\Documents\00 Combo3\muslim-companion-poc\content`
Output root: `C:\Users\user\Documents\00 Combo3\Noor\content-pipeline\imported\ilm-mate-v1\noor-cdn`

## Summary

- Hadith source files read: 630
- Collections generated: 630
- Items generated: 102012
- by_book collections: 23
- by_chapter collections: 607
- Duplicate collection ids: 0
- Duplicate item ids inside a collection: 0

## Model

- by_book and by_chapter are navigation views, not duplicate errors.
- collection.id is globally unique and generated from the source path.
- canonicalHadithId may repeat across views because the same Hadith may appear by book and by chapter.
- viewItemId is unique for rendering/search view output.

## Gate

- noor-cdn/staging-ilm-mate-v1 may be updated after checks pass.
- noor-cdn/main remains blocked.
- Production CDN remains blocked.
