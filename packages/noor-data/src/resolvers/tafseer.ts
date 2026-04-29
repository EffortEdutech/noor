import type { TafseerEntry } from '@noor/content';
import { DEMO_TAFSEER_ENTRIES } from '@noor/content';
import { getNoorDataConfig, padSurah } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getTafseerEntries(bookId: string, surah: number): Promise<TafseerEntry[]> {
  const fallback = DEMO_TAFSEER_ENTRIES.filter(
    (entry) => entry.bookId === bookId && entry.surah === surah
  );
  const config = getNoorDataConfig();

  return fetchJsonWithFallback<TafseerEntry[]>(
    `${config.tafseerCdnBase}/tafseer/${bookId}/surahs/${padSurah(surah)}.json`,
    fallback
  );
}
