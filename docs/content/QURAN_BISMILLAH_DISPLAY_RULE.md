# Quran Bismillah Display Rule

**Project:** NOOR  
**Rule status:** Locked content display rule  
**Applies to:** Quran reader, Tafseer passage preview, copy/share, search excerpts, teaching cards, and any Quran passage surface

---

## 1. Locked Rule

For Surah 2 to Surah 114, if the Quran JSON has:

```text
بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
```

at the beginning of ayah 1, NOOR must not treat that Bismillah text as part of ayah 1.

The Bismillah may be displayed as a separate Surah header where appropriate, but it must not be merged into the ayah 1 text.

---

## 2. Exception

For Surah 1, Al-Fatihah, Bismillah is ayah 1 and must remain displayed as ayah 1.

Do not strip Bismillah from Surah 1.

---

## 3. Surah 9 Rule

Surah 9, At-Tawbah, does not have a Bismillah header.

Do not add or display a Bismillah header for Surah 9.

---

## 4. Required Display Behavior

### 4.1 Surah 1

Display ayah 1 as ayah 1:

```text
1:1 بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
```

### 4.2 Surah 2 to Surah 114, except Surah 9

Display Bismillah separately if the Surah has a Bismillah header.

Then display ayah 1 without Bismillah.

Example for Surah 2:

```text
بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ

2:1 الٓمٓ
```

Not:

```text
2:1 بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الٓمٓ
```

### 4.3 Surah 9

Display ayah 1 directly. No Bismillah header.

---

## 5. Why This Matters

If Bismillah is embedded into ayah 1 for every Surah:

```text
[ ] Quran reading display becomes inaccurate.
[ ] Tafseer passage preview becomes misleading.
[ ] Copy/share references become inaccurate.
[ ] Teaching materials may incorrectly quote ayah 1.
[ ] Search excerpts and future retrieval may index the wrong passage text.
```

---

## 6. App-Side Safety Guard

NOOR app must keep an app-side safety guard even after the CDN is normalized.

Helper location:

```text
apps/web/lib/quran-bismillah.ts
```

Reason:

```text
[ ] Local demo content may still contain embedded Bismillah.
[ ] External CDN content may regress.
[ ] Future imports may accidentally reintroduce embedded Bismillah.
```

---

## 7. CDN Canonical Data Goal

```text
Surah 1:
- Bismillah remains ayah 1.
- bismillahIsAyah: true

Surah 2 to 114, except Surah 9:
- Bismillah removed from ayah 1 Arabic text.
- Bismillah stored as Surah metadata.
- hasBismillahHeader: true
- bismillahIsAyah: false

Surah 9:
- No Bismillah header.
- hasBismillahHeader: false
- bismillahIsAyah: false
```

---

## 8. Rule Ownership

This rule is owned by NOOR content governance.

Any future Quran display, Tafseer preview, copy/share, search excerpt, teaching note, or Quran-to-tafseer relationship feature must follow this document.
