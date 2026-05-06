import Link from 'next/link';
import type { LanguageCode, QuranAyah, TafseerEntry } from '@noor/content';
import { getSurahContent, getSurahIndex, getTafseerEntries, getTafseerIndex } from '@noor/data';
import { FloatingTafseerNavigator } from '../../../components/FloatingTafseerNavigator';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';
import styles from './TafseerPage.module.css';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

type TafseerPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

const VALID_LANGUAGES: LanguageCode[] = ['ar', 'en', 'ms', 'id', 'ur', 'zh', 'ta'];
const RTL_LANGUAGES: LanguageCode[] = ['ar', 'ur'];

function firstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseSurah(value: SearchParamValue): number | undefined {
  const raw = firstValue(value);
  if (!raw) return undefined;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 114) return undefined;

  return parsed;
}

function normalizeLanguage(value: SearchParamValue): LanguageCode | undefined {
  const raw = firstValue(value)?.toLowerCase();
  if (!raw) return undefined;

  return VALID_LANGUAGES.includes(raw as LanguageCode) ? (raw as LanguageCode) : undefined;
}

function isRtlLanguage(language: LanguageCode) {
  return RTL_LANGUAGES.includes(language);
}

function languageLabel(language: LanguageCode | undefined) {
  if (!language) return 'Unknown';
  const labels: Record<LanguageCode, string> = {
    ar: 'Arabic',
    en: 'English',
    ms: 'Malay',
    id: 'Indonesian',
    ur: 'Urdu',
    zh: 'Chinese',
    ta: 'Tamil'
  };

  return labels[language] ?? language.toUpperCase();
}

function buildTafseerHref(bookId: string, surah: number, language?: LanguageCode) {
  const params = new URLSearchParams({
    book: bookId,
    surah: String(surah)
  });

  if (language) params.set('language', language);

  return `/learn/tafseer?${params.toString()}`;
}

function getPrimaryTopic(tags: string[]) {
  return tags.find((tag) => tag.trim().length > 1)?.toLowerCase() ?? 'guidance';
}

function getRangeText(entry: TafseerEntry) {
  if (entry.fromAyah === entry.toAyah) return `${entry.surah}:${entry.fromAyah}`;
  return `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`;
}

function getCoverageText(entry: TafseerEntry, ayahCount?: number) {
  if (ayahCount && entry.fromAyah === 1 && entry.toAyah >= ayahCount) return 'Surah-level explanation';
  if (entry.fromAyah === entry.toAyah) return 'Ayah explanation';
  return 'Passage explanation';
}

function getAyahContext(ayahs: QuranAyah[] | undefined, entry: TafseerEntry) {
  if (!ayahs?.length) return [];
  return ayahs.filter((ayah) => ayah.ayah >= entry.fromAyah && ayah.ayah <= entry.toAyah);
}

function getPreviewAyahs(ayahs: QuranAyah[]) {
  return ayahs.slice(0, 5);
}

function getTranslationPreview(ayah: QuranAyah) {
  return ayah.translations.en ?? ayah.translations.ms ?? '';
}

export default async function TafseerPage({ searchParams }: TafseerPageProps) {
  const params = (await searchParams) ?? {};
  const contentSource = await getServerNoorContentSource();

  const [books, surahs] = await Promise.all([
    getTafseerIndex({ source: contentSource }),
    getSurahIndex({ source: contentSource })
  ]);

  const selectedLanguage = normalizeLanguage(params.language);
  const visibleBooks = selectedLanguage ? books.filter((book) => book.language === selectedLanguage) : books;
  const selectedBookId = firstValue(params.book);
  const selectedBook =
    books.find((book) => book.id === selectedBookId) ??
    visibleBooks[0] ??
    books[0];

  const selectedSurah = parseSurah(params.surah) ?? selectedBook?.firstSurah ?? 1;

  const tafseerPayload = selectedBook
    ? await Promise.all([
        getTafseerEntries(selectedBook.id, selectedSurah, { source: contentSource }),
        getSurahContent(selectedSurah, { source: contentSource })
      ])
    : ([[], null] as [TafseerEntry[], Awaited<ReturnType<typeof getSurahContent>>]);

  const [entries, selectedSurahContent] = tafseerPayload;
  const selectedSurahMeta = selectedSurahContent?.surah ?? surahs.find((surah) => surah.number === selectedSurah);
  const oneAyahEntries = entries.filter((entry) => entry.fromAyah === entry.toAyah).length;
  const rangeEntries = entries.length - oneAyahEntries;

  return (
    <main className={`noor-page ${styles.page}`} id="tafseer-top">
      <section className={styles.readerHeader} aria-label="Current tafseer reading context">
        <div className={styles.readerTitle}>
          <span className="noor-kicker">Tafseer reading space</span>
          <h1>{selectedSurahMeta?.nameTransliteration ?? `Surah ${selectedSurah}`}</h1>
          <p>
            {selectedBook?.label ?? 'No tafseer source'} - {languageLabel(selectedBook?.language)}.
            Use the floating Tafseer button to change source, Surah, or ayah.
          </p>
        </div>

        <div className={styles.readerMeta} aria-label="Tafseer source summary">
          <div>
            <span>Source</span>
            <strong>{selectedBook?.label ?? 'Not available'}</strong>
          </div>
          <div>
            <span>Coverage</span>
            <strong>{entries.length} entries</strong>
          </div>
          <div>
            <span>Structure</span>
            <strong>{oneAyahEntries} ayah, {rangeEntries} range</strong>
          </div>
        </div>
      </section>

      <section className={styles.readerActions} aria-label="Reading actions">
        <Link className="noor-button secondary" href={`/learn/quran/${selectedSurah}#ayah-1`}>
          Open Quran reader
        </Link>
        <Link className="noor-button secondary" href="/learn/quran">
          Choose Quran passage
        </Link>
        {selectedBook ? (
          <Link className="noor-button secondary" href={buildTafseerHref(selectedBook.id, selectedSurah, selectedBook.language)}>
            Refresh current tafseer
          </Link>
        ) : null}
      </section>

      <section className={styles.knowledgeSurface} id="tafseer-content" aria-label="Tafseer knowledge content">
        {entries.length === 0 ? (
          <article className={styles.emptyState}>
            <span className="noor-badge">No entries</span>
            <h2>No Tafseer entries found for this selection</h2>
            <p>
              Use the floating Tafseer button to try another source, Surah, or language. The Quran reader remains available even when tafseer coverage is missing.
            </p>
            <Link className="noor-button" href={`/learn/quran/${selectedSurah}`}>
              Read Quran context
            </Link>
          </article>
        ) : null}

        {entries.map((entry, index) => {
          const primaryTopic = getPrimaryTopic(entry.tags);
          const ayahContext = getAyahContext(selectedSurahContent?.ayahs, entry);
          const previewAyahs = getPreviewAyahs(ayahContext);
          const omittedAyahCount = Math.max(ayahContext.length - previewAyahs.length, 0);
          const entryDirection = isRtlLanguage(entry.language) ? 'rtl' : 'ltr';

          return (
            <article key={`${entry.id}-${index}`} id={`ayah-${entry.fromAyah}`} className={styles.entryCard}>
              <header className={styles.entryHeader}>
                <div>
                  <span className="noor-badge gold">{getCoverageText(entry, selectedSurahMeta?.ayahCount)}</span>
                  <h2>{entry.title}</h2>
                </div>
                <span className={styles.entryReference}>{getRangeText(entry)}</span>
              </header>

              {previewAyahs.length ? (
                <section className={styles.quranContext} aria-label={`Quran context for ${getRangeText(entry)}`}>
                  <div className={styles.contextHead}>
                    <span>Quran passage</span>
                    <Link href={`/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`}>Open full context</Link>
                  </div>

                  <p className={styles.arabicLine} lang="ar" dir="rtl">
                    {previewAyahs.map((ayah) => ayah.arabic).join(' ')}
                  </p>

                  <div className={styles.translationPreview}>
                    {previewAyahs.map((ayah) => {
                      const translation = getTranslationPreview(ayah);
                      return translation ? (
                        <p key={ayah.key}>
                          <strong>{ayah.key}</strong>
                          <span>{translation}</span>
                        </p>
                      ) : null;
                    })}
                  </div>

                  {omittedAyahCount > 0 ? (
                    <p className={styles.omittedNote}>
                      {omittedAyahCount} more ayat are included in this tafseer range. Open the Quran reader for the full passage.
                    </p>
                  ) : null}
                </section>
              ) : null}

              <section
                className={styles.tafseerBody}
                lang={entry.language}
                dir={entryDirection}
                data-direction={entryDirection}
                aria-label={`Tafseer body from ${entry.sourceLabel}`}
              >
                {entry.body}
              </section>

              <footer className={styles.entryFooter}>
                <div>
                  <span>{entry.sourceLabel}</span>
                  <strong>{languageLabel(entry.language)}</strong>
                </div>
                <nav aria-label={`Actions for ${getRangeText(entry)}`}>
                  <Link href={`/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`}>Quran context</Link>
                  <Link href={`/explore?topic=${encodeURIComponent(primaryTopic)}`}>Explore topic</Link>
                </nav>
              </footer>
            </article>
          );
        })}
      </section>

      <FloatingTafseerNavigator
        books={books.map((book) => ({
          id: book.id,
          label: book.label,
          language: book.language,
          availableSurahs: book.availableSurahs,
          firstSurah: book.firstSurah
        }))}
        surahs={surahs}
        entries={entries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          surah: entry.surah,
          fromAyah: entry.fromAyah,
          toAyah: entry.toAyah,
          sourceLabel: entry.sourceLabel
        }))}
        currentBookId={selectedBook?.id ?? ''}
        currentSurah={selectedSurah}
        currentAyahCount={selectedSurahMeta?.ayahCount ?? selectedSurahContent?.ayahs.length ?? 1}
      />
    </main>
  );
}
