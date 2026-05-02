import type { LanguageCode, TafseerEntry } from '@noor/content';
import { DEMO_TAFSEER_ENTRIES } from '@noor/content';
import { getNoorDataConfig, joinNoorCdnPath, padSurah, type NoorResolverOptions } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export type TafseerBookIndexEntry = {
  id: string;
  label: string;
  sourceLabel: string;
  language: LanguageCode;
  surahCount: number;
  entryCount: number;
  firstSurah: number;
  lastSurah: number;
  availableSurahs: number[];
  status?: 'demo' | 'staging' | 'production';
  samplePath?: string;
};

type TafseerIndexPayload = {
  version?: string;
  generatedAt?: string;
  source?: string;
  books: TafseerBookIndexEntry[];
};

function buildDemoTafseerIndex(): TafseerBookIndexEntry[] {
  const grouped = new Map<string, TafseerBookIndexEntry>();

  for (const entry of DEMO_TAFSEER_ENTRIES) {
    const existing =
      grouped.get(entry.bookId) ??
      {
        id: entry.bookId,
        label: entry.sourceLabel,
        sourceLabel: entry.sourceLabel,
        language: entry.language,
        surahCount: 0,
        entryCount: 0,
        firstSurah: entry.surah,
        lastSurah: entry.surah,
        availableSurahs: [],
        status: 'demo' as const,
        samplePath: `tafseer/${entry.bookId}/surahs/${padSurah(entry.surah)}.json`
      };

    existing.entryCount += 1;
    existing.firstSurah = Math.min(existing.firstSurah, entry.surah);
    existing.lastSurah = Math.max(existing.lastSurah, entry.surah);
    if (!existing.availableSurahs.includes(entry.surah)) {
      existing.availableSurahs.push(entry.surah);
      existing.availableSurahs.sort((a, b) => a - b);
      existing.surahCount = existing.availableSurahs.length;
    }

    grouped.set(entry.bookId, existing);
  }

  return [...grouped.values()];
}

export async function getTafseerIndex(
  options: NoorResolverOptions = {}
): Promise<TafseerBookIndexEntry[]> {
  const fallbackBooks = buildDemoTafseerIndex();
  const fallback: TafseerIndexPayload = {
    version: 'demo',
    source: 'demo',
    books: fallbackBooks
  };
  const config = getNoorDataConfig(options.source);

  const payload = await fetchJsonWithFallback<TafseerIndexPayload | TafseerBookIndexEntry[]>(
    joinNoorCdnPath(config.tafseerCdnBase, 'metadata/tafseer-index.json'),
    fallback,
    { mode: config.mode, allowFallback: options.allowFallback }
  );

  const books = Array.isArray(payload) ? payload : payload.books;
  return books.length > 0 ? books : fallbackBooks;
}

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
