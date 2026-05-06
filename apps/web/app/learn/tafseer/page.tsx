import Link from 'next/link';
import { getSurahIndex, getTafseerEntries, getTafseerIndex } from '@noor/data';
import { NoorCard, SourceConnectionsPanel } from '@noor/ui';
import styles from './tafseer.module.css';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

type TafseerPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

type TafseerBook = Awaited<ReturnType<typeof getTafseerIndex>>[number];
type SurahIndexItem = Awaited<ReturnType<typeof getSurahIndex>>[number];

const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'Arabic',
  en: 'English',
  ms: 'Malay',
  id: 'Indonesian',
  ur: 'Urdu',
  zh: 'Chinese',
  ta: 'Tamil'
};

function firstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: SearchParamValue): number | undefined {
  const raw = firstValue(value);
  if (!raw) return undefined;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return undefined;

  return parsed;
}

function parseSurah(value: SearchParamValue): number | undefined {
  const parsed = parseNumber(value);
  if (!parsed || parsed < 1 || parsed > 114) return undefined;
  return parsed;
}

function clampAyah(value: number | undefined, surah?: SurahIndexItem): number | undefined {
  if (!value) return undefined;
  const ayahCount = surah?.ayahCount ?? 286;
  return Math.min(Math.max(value, 1), ayahCount);
}

function languageLabel(language: string) {
  return LANGUAGE_LABELS[language] ?? language.toUpperCase();
}

function buildTafseerHref({
  book,
  surah,
  ayah,
  from,
  to,
  language
}: {
  book?: string;
  surah?: number;
  ayah?: number;
  from?: number;
  to?: number;
  language?: string;
}) {
  const params = new URLSearchParams();

  if (book) params.set('book', book);
  if (surah) params.set('surah', String(surah));
  if (ayah) params.set('ayah', String(ayah));
  if (from) params.set('from', String(from));
  if (to) params.set('to', String(to));
  if (language) params.set('lang', language);

  const query = params.toString();
  return query ? `/learn/tafseer?${query}` : '/learn/tafseer';
}

function formatRange(surah: number, fromAyah: number, toAyah: number) {
  if (fromAyah === toAyah) return `${surah}:${fromAyah}`;
  return `${surah}:${fromAyah}-${toAyah}`;
}

function coverageLabel(fromAyah: number, toAyah: number) {
  if (fromAyah === toAyah) return 'Ayah explanation';
  return 'Passage explanation';
}

function getPrimaryTopic(tags: string[]) {
  return tags.find((tag) => tag.trim().length > 1)?.toLowerCase() ?? 'guidance';
}

function getBookStatus(book: TafseerBook) {
  if (!book.status) return 'Available';
  return book.status.charAt(0).toUpperCase() + book.status.slice(1);
}

function chooseActiveLanguage(params: Record<string, SearchParamValue>, books: TafseerBook[]) {
  const requestedLanguage = firstValue(params.lang);
  const requestedBookId = firstValue(params.book);
  const requestedBook = books.find((book) => book.id === requestedBookId);
  const languages = [...new Set(books.map((book) => book.language))];

  if (requestedLanguage && languages.includes(requestedLanguage as TafseerBook['language'])) {
    return requestedLanguage;
  }

  if (requestedBook?.language) return requestedBook.language;

  return books[0]?.language ?? 'en';
}

function chooseActiveBook(params: Record<string, SearchParamValue>, books: TafseerBook[], language: string) {
  const requestedBookId = firstValue(params.book);
  const requestedBook = books.find((book) => book.id === requestedBookId);
  const booksInLanguage = books.filter((book) => book.language === language);

  if (requestedBook && requestedBook.language === language) return requestedBook;
  return booksInLanguage[0] ?? books[0];
}

function overlapsRange(entry: { fromAyah: number; toAyah: number }, fromAyah?: number, toAyah?: number) {
  if (!fromAyah && !toAyah) return true;

  const start = fromAyah ?? toAyah ?? 1;
  const end = toAyah ?? fromAyah ?? start;

  return entry.fromAyah <= end && entry.toAyah >= start;
}

function SourceCard({ book }: { book: TafseerBook }) {
  return (
    <Link
      className={`${styles.sourceCard} noor-card`}
      href={buildTafseerHref({
        book: book.id,
        surah: book.firstSurah,
        ayah: 1,
        language: book.language
      })}
    >
      <div className={styles.sourceCardHead}>
        <span className="noor-badge gold">{languageLabel(book.language)}</span>
        <span className="noor-reference">{getBookStatus(book)}</span>
      </div>
      <strong>{book.label}</strong>
      <span>{book.surahCount} Surahs covered</span>
      <span>{book.entryCount.toLocaleString()} tafseer entries</span>
      <span>Coverage: {book.firstSurah} to {book.lastSurah}</span>
    </Link>
  );
}

export default async function TafseerPage({ searchParams }: TafseerPageProps) {
  const params = (await searchParams) ?? {};
  const contentSource = await getServerNoorContentSource();

  const [books, surahs] = await Promise.all([
    getTafseerIndex({ source: contentSource }),
    getSurahIndex({ source: contentSource })
  ]);

  const languages = [...new Set(books.map((book) => book.language))];
  const activeLanguage = chooseActiveLanguage(params, books);
  const booksInLanguage = books.filter((book) => book.language === activeLanguage);
  const selectedBook = chooseActiveBook(params, books, activeLanguage);

  const requestedSurah = parseSurah(params.surah);
  const selectedSurah = requestedSurah ?? selectedBook?.firstSurah ?? 1;
  const selectedSurahMeta = surahs.find((surah) => surah.number === selectedSurah);
  const selectedAyah = clampAyah(parseNumber(params.ayah), selectedSurahMeta);
  const selectedFrom = clampAyah(parseNumber(params.from), selectedSurahMeta) ?? selectedAyah;
  const selectedTo = clampAyah(parseNumber(params.to), selectedSurahMeta) ?? selectedFrom;
  const normalizedFrom = selectedFrom && selectedTo ? Math.min(selectedFrom, selectedTo) : selectedFrom;
  const normalizedTo = selectedFrom && selectedTo ? Math.max(selectedFrom, selectedTo) : selectedTo;

  const entries = selectedBook
    ? await getTafseerEntries(selectedBook.id, selectedSurah, { source: contentSource })
    : [];

  const passageEntries = entries.filter((entry) => overlapsRange(entry, normalizedFrom, normalizedTo));
  const visibleEntries = passageEntries.length > 0 ? passageEntries : entries.slice(0, 8);
  const primaryEntry = visibleEntries[0];
  const primaryTopic = primaryEntry ? getPrimaryTopic(primaryEntry.tags) : 'guidance';
  const quranContextHref = `/learn/quran/${selectedSurah}#ayah-${normalizedFrom ?? selectedAyah ?? 1}`;
  const selectedPassageLabel = normalizedFrom
    ? formatRange(selectedSurah, normalizedFrom, normalizedTo ?? normalizedFrom)
    : `Surah ${selectedSurah}`;
  const availableSurahs = selectedBook?.availableSurahs?.length ? selectedBook.availableSurahs : surahs.map((surah) => surah.number);

  return (
    <main className={`noor-page ${styles.studyPage}`}>
      <section className={`noor-card is-gold ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <span className="noor-kicker">Tafseer study</span>
          <h1>Understand the Quran through trusted explanation.</h1>
          <p>
            Choose a Quran passage, select a tafseer source, then study the explanation with clear source,
            language, coverage, and next-step connections.
          </p>
          <div className={styles.heroActions}>
            <Link className="noor-button" href={quranContextHref}>
              Open Quran context
            </Link>
            <Link className="noor-button secondary" href="/learn/quran">
              Start from Quran reader
            </Link>
          </div>
        </div>

        <div className={styles.heroPanel} aria-label="Tafseer source summary">
          <span className="noor-badge emerald">Current selection</span>
          <strong>{selectedPassageLabel}</strong>
          <span>{selectedBook?.label ?? 'No tafseer source found'}</span>
          <small>{selectedBook ? `${languageLabel(selectedBook.language)} source` : 'Add tafseer content to continue.'}</small>
        </div>
      </section>

      <section className={`noor-card ${styles.navigatorCard}`} aria-label="Tafseer navigator">
        <div className={styles.sectionHead}>
          <div>
            <span className="noor-kicker">Quick study</span>
            <h2>Choose passage and source</h2>
          </div>
          <p>Use Surah, ayah or range, source, and language. This replaces the old wall of Surah number buttons.</p>
        </div>

        <form className={styles.navigatorForm} action="/learn/tafseer" method="get">
          <label className={styles.field}>
            <span>Language</span>
            <select name="lang" defaultValue={activeLanguage}>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {languageLabel(language)}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Tafseer source</span>
            <select name="book" defaultValue={selectedBook?.id ?? ''}>
              {(booksInLanguage.length ? booksInLanguage : books).map((book) => (
                <option key={book.id} value={book.id}>
                  {book.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Surah</span>
            <select name="surah" defaultValue={selectedSurah}>
              {surahs
                .filter((surah) => availableSurahs.includes(surah.number))
                .map((surah) => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number}. {surah.nameTransliteration} ({surah.ayahCount})
                  </option>
                ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Ayah</span>
            <input
              name="ayah"
              type="number"
              min="1"
              max={selectedSurahMeta?.ayahCount ?? 286}
              defaultValue={selectedAyah ?? normalizedFrom ?? 1}
            />
          </label>

          <label className={styles.field}>
            <span>Range from</span>
            <input
              name="from"
              type="number"
              min="1"
              max={selectedSurahMeta?.ayahCount ?? 286}
              defaultValue={normalizedFrom ?? ''}
              placeholder="Optional"
            />
          </label>

          <label className={styles.field}>
            <span>Range to</span>
            <input
              name="to"
              type="number"
              min="1"
              max={selectedSurahMeta?.ayahCount ?? 286}
              defaultValue={normalizedTo ?? ''}
              placeholder="Optional"
            />
          </label>

          <div className={styles.formActions}>
            <button className="noor-button" type="submit">
              Open tafseer
            </button>
            <Link className="noor-button secondary" href="/learn/tafseer">
              Reset
            </Link>
          </div>
        </form>
      </section>

      <section className={styles.workspaceGrid} aria-label="Tafseer workspace">
        <NoorCard className={styles.contextCard}>
          <span className="noor-badge emerald">Quran passage</span>
          <h2>{selectedSurahMeta?.nameTransliteration ?? `Surah ${selectedSurah}`}</h2>
          <p className="noor-subtitle">
            {selectedSurahMeta
              ? `${selectedSurahMeta.nameEnglish} - ${selectedSurahMeta.ayahCount} ayat`
              : 'Selected Surah context'}
          </p>
          <div className={styles.referenceBox}>
            <strong>{selectedPassageLabel}</strong>
            <span>
              Tafseer should always be read as an explanation of a Quran ayah or passage, not as an isolated note.
            </span>
          </div>
          <div className="noor-card-actions">
            <Link className="noor-button secondary" href={quranContextHref}>
              Read in Quran context
            </Link>
          </div>
        </NoorCard>

        <NoorCard className={styles.sourceMetaCard}>
          <span className="noor-badge gold">Source awareness</span>
          <h2>{selectedBook?.label ?? 'No tafseer source available'}</h2>
          {selectedBook ? (
            <div className={styles.metaGrid}>
              <div>
                <strong>{languageLabel(selectedBook.language)}</strong>
                <span>Language</span>
              </div>
              <div>
                <strong>{selectedBook.surahCount}</strong>
                <span>Surahs</span>
              </div>
              <div>
                <strong>{selectedBook.entryCount.toLocaleString()}</strong>
                <span>Entries</span>
              </div>
              <div>
                <strong>{getBookStatus(selectedBook)}</strong>
                <span>Status</span>
              </div>
            </div>
          ) : (
            <p className="noor-subtitle">No tafseer source could be loaded from the current content source.</p>
          )}
        </NoorCard>
      </section>

      <section className={`noor-card ${styles.entriesPanel}`} aria-label="Tafseer explanations">
        <div className={styles.sectionHead}>
          <div>
            <span className="noor-kicker">Explanation</span>
            <h2>{selectedBook ? `Tafseer for ${selectedPassageLabel}` : 'No tafseer available'}</h2>
          </div>
          <p>
            {normalizedFrom
              ? 'Showing entries that explain or overlap this selected ayah or range.'
              : 'Showing available entries for the selected Surah.'}
          </p>
        </div>

        {visibleEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <span className="noor-badge">No entries</span>
            <h3>No tafseer entries found for this selection</h3>
            <p>
              Try another source, Surah, ayah, or language. Missing tafseer should guide the user toward available
              sources instead of becoming a dead end.
            </p>
          </div>
        ) : (
          <div className={styles.entryList}>
            {visibleEntries.map((entry) => {
              const reference = formatRange(entry.surah, entry.fromAyah, entry.toAyah);

              return (
                <article key={entry.id} id={`ayah-${entry.fromAyah}`} className={styles.entryCard}>
                  <div className={styles.entryMeta}>
                    <span className="noor-badge gold">{coverageLabel(entry.fromAyah, entry.toAyah)}</span>
                    <span className="noor-reference">{reference}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p>{entry.body}</p>
                  <div className={styles.entryFooter}>
                    <span>{entry.sourceLabel}</span>
                    <span>{languageLabel(entry.language)}</span>
                  </div>
                  <div className="noor-card-actions">
                    <Link className="noor-button secondary" href={`/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`}>
                      Quran context
                    </Link>
                    <Link
                      className="noor-button secondary"
                      href={buildTafseerHref({
                        book: entry.bookId,
                        surah: entry.surah,
                        ayah: entry.fromAyah,
                        language: entry.language
                      })}
                    >
                      Focus this ayah
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {primaryEntry ? (
        <SourceConnectionsPanel
          compact
          title="Continue learning"
          subtitle="Move from tafseer back to Quran context, related topic exploration, or hadith reminders."
          connections={[
            {
              label: 'Quran',
              badge: 'Quran',
              title: 'Read the passage in Quran context',
              description: `Open ${formatRange(primaryEntry.surah, primaryEntry.fromAyah, primaryEntry.toAyah)} in the Quran reader.`,
              href: `/learn/quran/${primaryEntry.surah}#ayah-${primaryEntry.fromAyah}`
            },
            {
              label: 'Topic',
              badge: 'Topic',
              title: `Explore ${primaryTopic}`,
              description: 'Search Quran, Tafseer, and Hadith together through this theme.',
              href: `/explore?topic=${encodeURIComponent(primaryTopic)}`
            },
            {
              label: 'Hadith',
              badge: 'Hadith',
              title: 'Find related Hadith reminders',
              description: 'Continue from explanation into Prophetic application.',
              href: `/learn/hadith?mode=reflect&topic=${encodeURIComponent(primaryTopic)}#hadith-reader`
            }
          ]}
        />
      ) : null}

      <section className={`noor-card ${styles.sourcesPanel}`} aria-label="Available tafseer sources">
        <div className={styles.sectionHead}>
          <div>
            <span className="noor-kicker">Available sources</span>
            <h2>Choose by source and language</h2>
          </div>
          <p>Each source has its own coverage, language, and reading style.</p>
        </div>

        {languages.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No tafseer source found</h3>
            <p>Check the content source setting or prepare tafseer content before using this page.</p>
          </div>
        ) : (
          <div className={styles.languageGroups}>
            {languages.map((language) => {
              const groupBooks = books.filter((book) => book.language === language);

              return (
                <div key={language} className={styles.languageGroup}>
                  <div className={styles.languageHead}>
                    <strong>{languageLabel(language)}</strong>
                    <span>{groupBooks.length} source{groupBooks.length === 1 ? '' : 's'}</span>
                  </div>
                  <div className={styles.sourceGrid}>
                    {groupBooks.map((book) => (
                      <SourceCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
