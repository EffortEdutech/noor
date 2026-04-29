import type { ContentDatasetManifest } from '../types';
import { DEMO_HADITH_ITEMS, DEMO_HADITH_COLLECTIONS } from './hadith';
import { DEMO_SURAH_CONTENT } from './quran';
import { DEMO_TAFSEER_ENTRIES } from './tafseer';

const ayahCount = Object.values(DEMO_SURAH_CONTENT).reduce((total, surah) => total + surah.ayahs.length, 0);
const hadithCount = Object.values(DEMO_HADITH_ITEMS).reduce((total, items) => total + items.length, 0);

export const DEMO_CONTENT_MANIFEST: ContentDatasetManifest = {
  id: 'noor-demo-content-v0.8',
  version: '0.8.0',
  label: 'NOOR demo content integrity pack',
  releasedAt: '2026-04-29',
  mode: 'demo',
  datasets: {
    quran: {
      id: 'quran-demo-short-surahs',
      label: 'Quran demo short surah pack',
      status: 'partial',
      sourceLabel: 'NOOR demo content — replace with verified licensed Quran dataset before production',
      languages: ['ar', 'en', 'ms'],
      itemCount: ayahCount,
      updatedAt: '2026-04-29',
      notes: 'Contains Al-Fatihah, Al-Ikhlas, Al-Falaq and An-Nas for UI and resolver testing.'
    },
    tafseer: {
      id: 'tafseer-demo-basic',
      label: 'Demo tafseer summaries',
      status: 'demo',
      sourceLabel: 'NOOR demo summaries — not a scholarly tafseer source',
      languages: ['en'],
      itemCount: DEMO_TAFSEER_ENTRIES.length,
      updatedAt: '2026-04-29',
      notes: 'Short explanatory summaries used only to test tafseer linking and UI layouts.'
    },
    hadith: {
      id: 'hadith-demo-nawawi',
      label: 'Demo hadith collection',
      status: 'demo',
      sourceLabel: 'Demo Hadith Reference',
      languages: ['en', 'ms'],
      itemCount: hadithCount,
      updatedAt: '2026-04-29',
      notes: `Contains ${DEMO_HADITH_COLLECTIONS.length} demo collection and ${hadithCount} demo hadith records.`
    }
  }
};
