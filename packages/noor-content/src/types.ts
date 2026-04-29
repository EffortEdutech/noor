export type RevelationType = 'makki' | 'madani';
export type LanguageCode = 'ar' | 'en' | 'ms' | 'id' | 'ur' | 'zh' | 'ta';

export type SurahIndexEntry = {
  number: number;
  slug: string;
  nameArabic: string;
  nameTransliteration: string;
  nameEnglish: string;
  revelation: RevelationType;
  ayahCount: number;
};

export type QuranAyah = {
  surah: number;
  ayah: number;
  key: string;
  arabic: string;
  transliteration?: string;
  translations: Partial<Record<LanguageCode, string>>;
};

export type SurahContent = {
  surah: SurahIndexEntry;
  ayahs: QuranAyah[];
};

export type TafseerEntry = {
  id: string;
  bookId: string;
  language: LanguageCode;
  surah: number;
  fromAyah: number;
  toAyah: number;
  title: string;
  body: string;
  sourceLabel: string;
  tags: string[];
};

export type HadithCollection = {
  id: string;
  name: string;
  language: LanguageCode;
  description: string;
};

export type HadithItem = {
  id: string;
  collectionId: string;
  book?: string;
  chapter?: string;
  number: string;
  narrator?: string;
  arabic?: string;
  translations: Partial<Record<LanguageCode, string>>;
  sourceLabel: string;
  tags: string[];
};

export type BookmarkItem = {
  id: string;
  type: 'ayah' | 'hadith' | 'tafseer';
  title: string;
  reference: string;
  href?: string;
  createdAt: string;
};
