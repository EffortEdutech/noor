import type { HadithCollection, HadithItem } from '../types';

export const DEMO_HADITH_COLLECTIONS: HadithCollection[] = [
  {
    id: 'demo-nawawi',
    name: '40 Hadith Nawawi — Demo',
    language: 'en',
    description: 'A small demo collection used to test the Hadith resolver and UI cards.'
  }
];

export const DEMO_HADITH_ITEMS: Record<string, HadithItem[]> = {
  'demo-nawawi': [
    {
      id: 'demo-nawawi-001',
      collectionId: 'demo-nawawi',
      book: 'Foundations',
      chapter: 'Intention',
      number: '1',
      narrator: 'Umar ibn al-Khattab',
      translations: {
        en: 'Actions are only by intentions, and every person will have only what they intended.',
        ms: 'Sesungguhnya setiap amalan itu bergantung kepada niat, dan setiap orang akan mendapat berdasarkan apa yang diniatkannya.'
      },
      sourceLabel: 'Demo Hadith Reference',
      tags: ['intention', 'ikhlas', 'actions']
    },
    {
      id: 'demo-nawawi-002',
      collectionId: 'demo-nawawi',
      book: 'Foundations',
      chapter: 'Mercy',
      number: '2',
      translations: {
        en: 'The merciful are shown mercy by the Most Merciful. Be merciful to those on earth and the One above the heavens will have mercy upon you.',
        ms: 'Orang yang penyayang akan disayangi oleh Yang Maha Penyayang. Sayangilah mereka di bumi, nescaya kamu akan disayangi oleh Tuhan di langit.'
      },
      sourceLabel: 'Demo Hadith Reference',
      tags: ['mercy', 'character', 'compassion']
    }
  ]
};
