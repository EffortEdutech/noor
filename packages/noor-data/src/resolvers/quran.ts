import type { SurahContent, SurahIndexEntry } from '@noor/content';
import { DEMO_SURAH_CONTENT, DEMO_SURAH_INDEX } from '@noor/content';
import { getNoorDataConfig, padSurah } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getSurahIndex(): Promise<SurahIndexEntry[]> {
  const config = getNoorDataConfig();
  return fetchJsonWithFallback<SurahIndexEntry[]>(
    `${config.quranCdnBase}/metadata/surah-index.json`,
    DEMO_SURAH_INDEX
  );
}

export async function getSurahContent(surah: number): Promise<SurahContent | null> {
  const fallback = DEMO_SURAH_CONTENT[surah] ?? null;
  const config = getNoorDataConfig();

  return fetchJsonWithFallback<SurahContent | null>(
    `${config.quranCdnBase}/quran/surahs/${padSurah(surah)}.json`,
    fallback
  );
}
