import type { TafseerEntry } from '@noor/content';
import { DEMO_TAFSEER_ENTRIES } from '@noor/content';
import { getNoorDataConfig, joinNoorCdnPath, padSurah, type NoorResolverOptions } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getTafseerEntries(
  bookId: string,
  surah: number,
  options: NoorResolverOptions = {}
): Promise<TafseerEntry[]> {
  const fallback = DEMO_TAFSEER_ENTRIES.filter(
    (entry) => entry.bookId === bookId && entry.surah === surah
  );
  const config = getNoorDataConfig(options.source);

  return fetchJsonWithFallback<TafseerEntry[]>(
    joinNoorCdnPath(config.tafseerCdnBase, `tafseer/${bookId}/surahs/${padSurah(surah)}.json`),
    fallback,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}
