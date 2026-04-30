import type { SurahContent, SurahIndexEntry } from '@noor/content';
import { DEMO_SURAH_CONTENT, DEMO_SURAH_INDEX } from '@noor/content';
import { getNoorDataConfig, joinNoorCdnPath, padSurah, type NoorResolverOptions } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getSurahIndex(options: NoorResolverOptions = {}): Promise<SurahIndexEntry[]> {
  const config = getNoorDataConfig(options.source);

  return fetchJsonWithFallback<SurahIndexEntry[]>(
    joinNoorCdnPath(config.quranCdnBase, 'metadata/surah-index.json'),
    DEMO_SURAH_INDEX,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}

export async function getSurahContent(
  surah: number,
  options: NoorResolverOptions = {}
): Promise<SurahContent | null> {
  const fallback = DEMO_SURAH_CONTENT[surah] ?? null;
  const config = getNoorDataConfig(options.source);

  return fetchJsonWithFallback<SurahContent | null>(
    joinNoorCdnPath(config.quranCdnBase, `quran/surahs/${padSurah(surah)}.json`),
    fallback,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}
