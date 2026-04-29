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

export type JourneyDifficulty = 'beginner' | 'basic' | 'intermediate';

export type JourneyStepContentType = 'ayah' | 'hadith' | 'tafseer' | 'reflection' | 'action';

export type JourneyStep = {
  id: string;
  title: string;
  body: string;
  contentType: JourneyStepContentType;
  reference?: string;
  href?: string;
  minutes: number;
  prompt?: string;
  tags: string[];
};

export type Journey = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: JourneyDifficulty;
  estimatedMinutes: number;
  stepCount: number;
  theme: string;
  icon: string;
  tags: string[];
  steps: JourneyStep[];
};

export type JourneySummary = Omit<Journey, 'steps'>;
