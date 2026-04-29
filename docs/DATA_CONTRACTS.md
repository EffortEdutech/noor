# NOOR Data Contracts v0.1

NOOR must not embed huge datasets inside the app repo. The app uses resolvers that can read from local mock data or remote CDN sources.

## 1. Data mode

```text
NEXT_PUBLIC_NOOR_DATA_MODE=mock | cdn
```

- `mock`: always use bundled demo content.
- `cdn`: try remote CDN first, then fallback to bundled demo content.

## 2. Environment variables

```text
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data@main
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://huggingface.co/datasets/EffortEdutech/noor-tafseer-data/resolve/main
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://data.noor.app
```

## 3. Quran CDN contract

### Surah index

```text
{QURAN_CDN_BASE}/metadata/surah-index.json
```

```ts
type SurahIndexEntry = {
  number: number;
  slug: string;
  nameArabic: string;
  nameTransliteration: string;
  nameEnglish: string;
  revelation: "makki" | "madani";
  ayahCount: number;
};
```

### Surah content

```text
{QURAN_CDN_BASE}/quran/surahs/001.json
```

```ts
type SurahContent = {
  surah: SurahIndexEntry;
  ayahs: Array<{
    surah: number;
    ayah: number;
    key: string;
    arabic: string;
    transliteration?: string;
    translations: {
      en?: string;
      ms?: string;
    };
  }>;
};
```

## 4. Tafseer CDN contract

```text
{TAFSEER_CDN_BASE}/tafseer/{bookId}/surahs/001.json
```

```ts
type TafseerEntry = {
  id: string;
  bookId: string;
  language: string;
  surah: number;
  fromAyah: number;
  toAyah: number;
  title: string;
  body: string;
  sourceLabel: string;
  tags: string[];
};
```

## 5. Hadith CDN contract

```text
{HADITH_CDN_BASE}/hadith/collections.json
{HADITH_CDN_BASE}/hadith/{collectionId}/items.json
```

```ts
type HadithItem = {
  id: string;
  collectionId: string;
  book?: string;
  chapter?: string;
  number: string;
  narrator?: string;
  arabic?: string;
  translations: {
    en?: string;
    ms?: string;
  };
  sourceLabel: string;
  tags: string[];
};
```

## 6. Resolver rule

UI must call resolver functions only:

```ts
getSurahIndex()
getSurahContent(surah)
getTafseerEntries(bookId, surah)
getHadithCollections()
getHadithItems(collectionId)
searchNoorLocal(query)
```

Do not hardcode CDN URLs inside screens.
