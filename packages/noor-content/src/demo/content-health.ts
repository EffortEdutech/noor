import type { ContentHealthIssue, ContentHealthReport } from '../types';
import { DEMO_CONTENT_MANIFEST } from './content-manifest';
import { DEMO_HADITH_COLLECTIONS, DEMO_HADITH_ITEMS } from './hadith';
import { DEMO_SURAH_CONTENT } from './quran';
import { DEMO_SURAH_INDEX } from './surah-index';
import { DEMO_TAFSEER_ENTRIES } from './tafseer';

export function buildDemoContentHealthReport(): ContentHealthReport {
  const issues: ContentHealthIssue[] = [];
  const surahContentNumbers = new Set(Object.keys(DEMO_SURAH_CONTENT).map(Number));
  const tafseerCoveredSurahs = new Set(DEMO_TAFSEER_ENTRIES.map((entry) => entry.surah));
  const ayahKeys = new Set<string>();
  let ayahContentCount = 0;

  for (const indexEntry of DEMO_SURAH_INDEX) {
    const content = DEMO_SURAH_CONTENT[indexEntry.number];

    if (!content) {
      issues.push({
        severity: 'error',
        area: 'quran',
        message: `Surah index includes ${indexEntry.nameTransliteration}, but no surah content is available.`,
        reference: String(indexEntry.number)
      });
      continue;
    }

    if (content.ayahs.length !== indexEntry.ayahCount) {
      issues.push({
        severity: 'error',
        area: 'quran',
        message: `${indexEntry.nameTransliteration} expects ${indexEntry.ayahCount} ayat but has ${content.ayahs.length}.`,
        reference: String(indexEntry.number)
      });
    }

    for (const ayah of content.ayahs) {
      ayahContentCount += 1;

      if (ayahKeys.has(ayah.key)) {
        issues.push({
          severity: 'error',
          area: 'quran',
          message: `Duplicate ayah key detected: ${ayah.key}`,
          reference: ayah.key
        });
      }

      ayahKeys.add(ayah.key);

      if (!ayah.arabic || !ayah.translations.en) {
        issues.push({
          severity: 'warning',
          area: 'quran',
          message: `Ayah ${ayah.key} is missing Arabic or English demo translation.`,
          reference: ayah.key
        });
      }
    }

    if (!tafseerCoveredSurahs.has(indexEntry.number)) {
      issues.push({
        severity: 'warning',
        area: 'tafseer',
        message: `${indexEntry.nameTransliteration} has no demo tafseer entry yet.`,
        reference: String(indexEntry.number)
      });
    }
  }

  for (const collection of DEMO_HADITH_COLLECTIONS) {
    if (!DEMO_HADITH_ITEMS[collection.id]?.length) {
      issues.push({
        severity: 'warning',
        area: 'hadith',
        message: `${collection.name} has no demo items.`,
        reference: collection.id
      });
    }
  }

  issues.push({
    severity: 'info',
    area: 'manifest',
    message: 'Sprint 8 verifies demo data integrity only. Production Quran, tafseer and hadith datasets still require scholarly/licensing review.'
  });

  const hadithItemCount = Object.values(DEMO_HADITH_ITEMS).reduce((total, items) => total + items.length, 0);
  const hasErrors = issues.some((issue) => issue.severity === 'error');

  return {
    manifest: DEMO_CONTENT_MANIFEST,
    generatedAt: new Date().toISOString(),
    isHealthy: !hasErrors,
    summary: {
      surahIndexedCount: DEMO_SURAH_INDEX.length,
      surahContentCount: surahContentNumbers.size,
      ayahContentCount,
      tafseerEntryCount: DEMO_TAFSEER_ENTRIES.length,
      tafseerCoveredSurahCount: tafseerCoveredSurahs.size,
      hadithCollectionCount: DEMO_HADITH_COLLECTIONS.length,
      hadithItemCount
    },
    issues
  };
}
