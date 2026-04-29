import {
  DEMO_HADITH_ITEMS,
  DEMO_SURAH_CONTENT,
  DEMO_TAFSEER_ENTRIES
} from '@noor/content';

export type NoorSearchResult = {
  id: string;
  type: 'Quran' | 'Tafseer' | 'Hadith';
  title: string;
  excerpt: string;
  reference: string;
  href?: string;
};

function includes(haystack: string | undefined, needle: string) {
  return (haystack ?? '').toLowerCase().includes(needle);
}

export function searchNoorLocal(query: string): NoorSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: NoorSearchResult[] = [];

  for (const surah of Object.values(DEMO_SURAH_CONTENT)) {
    for (const ayah of surah.ayahs) {
      const joined = [
        surah.surah.nameEnglish,
        surah.surah.nameTransliteration,
        ayah.key,
        ayah.arabic,
        ayah.transliteration,
        ayah.translations.en,
        ayah.translations.ms
      ].join(' ');

      if (includes(joined, q)) {
        results.push({
          id: ayah.key,
          type: 'Quran',
          title: `${surah.surah.nameTransliteration} ${ayah.ayah}`,
          excerpt: ayah.translations.en ?? ayah.arabic,
          reference: ayah.key,
          href: `/learn/quran/${ayah.surah}`
        });
      }
    }
  }

  for (const entry of DEMO_TAFSEER_ENTRIES) {
    const joined = [entry.title, entry.body, entry.tags.join(' ')].join(' ');
    if (includes(joined, q)) {
      results.push({
        id: entry.id,
        type: 'Tafseer',
        title: entry.title,
        excerpt: entry.body,
        reference: `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`,
        href: `/learn/quran/${entry.surah}`
      });
    }
  }

  for (const collectionItems of Object.values(DEMO_HADITH_ITEMS)) {
    for (const hadith of collectionItems) {
      const joined = [
        hadith.number,
        hadith.narrator,
        hadith.translations.en,
        hadith.translations.ms,
        hadith.tags.join(' ')
      ].join(' ');
      if (includes(joined, q)) {
        results.push({
          id: hadith.id,
          type: 'Hadith',
          title: `Hadith ${hadith.number}`,
          excerpt: hadith.translations.en ?? '',
          reference: hadith.sourceLabel,
          href: '/learn/hadith'
        });
      }
    }
  }

  return results.slice(0, 12);
}
