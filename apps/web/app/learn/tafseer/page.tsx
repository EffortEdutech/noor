import Link from 'next/link';
import type { LanguageCode, QuranAyah, TafseerEntry } from '@noor/content';
import { getSurahContent, getSurahIndex, getTafseerEntries, getTafseerIndex } from '@noor/data';
import { NoorCard, PageHeader, SourceConnectionsPanel } from '@noor/ui';
import { FloatingTafseerNavigator } from '../../../components/FloatingTafseerNavigator';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';
import styles from './TafseerPage.module.css';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

type TafseerPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

const VALID_LANGUAGES: LanguageCode[] = ['ar', 'en', 'ms', 'id', 'ur', 'zh', 'ta'];

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

function getCoverageLabel(entry: TafseerEntry, ayahCount?: number) {
  if (ayahCount && entry.fromAyah === 1 && entry.toAyah >= ayahCount) return 'Surah-level note';
  if (entry.fromAyah === entry.toAyah) return `Ayah ${entry.fromAyah}`;
  return `Ayah ${entry.fromAyah}-${entry.toAyah}`;
}

function getRangeText(entry: TafseerEntry) {
  if (entry.fromAyah === entry.toAyah) return `${entry.surah}:${entry.fromAyah}`;
  return `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`;
}

function getAyahContext(ayahs: QuranAyah[] | undefined, entry: TafseerEntry) {
  if (!ayahs?.length) return [];
  return ayahs.filter((ayah) => ayah.ayah >= entry.fromAyah && ayah.ayah <= entry.toAyah);
}

function getLeadTranslation(ayahs: QuranAyah[]) {
  const first = ayahs[0];
  if (!first) return '';
  return first.translations.en ?? first.translations.ms ?? '';
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
  const availableSurahs = selectedBook?.availableSurahs?.length ? selectedBook.availableSurahs : [selectedSurah];
  const oneAyahEntries = entries.filter((entry) => entry.fromAyah === entry.toAyah).length;
  const rangeEntries = entries.length - oneAyahEntries;
  const languages = Array.from(new Set(books.map((book) => book.language))).sort();

  return (
    <main className={`noor-page ${styles.page}`} id="tafseer-top">
      <PageHeader
        kicker="Tafseer"
        title="Study the meaning behind the ayat."
        subtitle="Tafseer should show the Quran passage, the source, the coverage range, and the next step for reading, teaching, or reflection."
      />

      <section className={styles.heroGrid} aria-label="Tafseer study entry points">
        <NoorCard variant="gold" className={styles.heroCard}>
          <span className="noor-badge emerald">Study hub</span>
          <h2>Quran context first, tafseer second.</h2>
          <p className="noor-subtitle">
            Use this page to choose a tafseer source and passage. For focused daily reading, open the same passage in Quran Study mode.
          </p>
          <div className="noor-card-actions">
            <Link className="noor-button" href={`/learn/quran/${selectedSurah}#ayah-1`}>
              Open Quran context
            </Link>
            <a className="noor-button secondary" href="#tafseer-workspace">
              View tafseer workspace
            </a>
          </div>
        </NoorCard>

        <NoorCard variant="soft" className={styles.workflowCard}>
          <span className="noor-kicker">Teacher workflow</span>
          <h2>Read - Understand - Prepare</h2>
          <div className={styles.workflowSteps} aria-label="Tafseer learning workflow">
            <div>
              <strong>1</strong>
              <span>Read the ayah in context.</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Check which ayah range is explained.</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Copy the reference into notes or teaching prep later.</span>
            </div>
          </div>
        </NoorCard>
      </section>

      <section className={styles.controlGrid} aria-label="Tafseer source and passage summary">
        <NoorCard className={styles.sourceCard}>
          <span className="noor-badge gold">Current source</span>
          <h2>{selectedBook?.label ?? 'No Tafseer source found'}</h2>
          <dl className={styles.metaGrid}>
            <div>
              <dt>Language</dt>
              <dd>{selectedBook?.language ?? 'n/a'}</dd>
            </div>
            <div>
              <dt>Coverage</dt>
              <dd>{selectedBook ? `${selectedBook.firstSurah}-${selectedBook.lastSurah}` : 'n/a'}</dd>
            </div>
            <div>
              <dt>Entries</dt>
              <dd>{selectedBook?.entryCount ?? 0}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{selectedBook?.status ?? 'available'}</dd>
            </div>
          </dl>
        </NoorCard>

        <NoorCard className={styles.sourceCard}>
          <span className="noor-badge emerald">Current passage</span>
          <h2>
            Surah {selectedSurah}
            {selectedSurahMeta ? ` - ${selectedSurahMeta.nameTransliteration}` : ''}
          </h2>
          <p className="noor-subtitle">
            {entries.length} tafseer entries found. {oneAyahEntries} ayah-specific, {rangeEntries} range-based.
          </p>
          <div className={styles.languageChips} aria-label="Available tafseer languages">
            <Link className={!selectedLanguage ? styles.activeChip : styles.chip} href={buildTafseerHref(selectedBook?.id ?? '', selectedSurah)}>
              All languages
            </Link>
            {languages.map((language) => {
              const bookForLanguage = books.find((book) => book.language === language);
              if (!bookForLanguage) return null;
              return (
                <Link
                  key={language}
                  className={selectedLanguage === language ? styles.activeChip : styles.chip}
                  href={buildTafseerHref(bookForLanguage.id, selectedSurah, language)}
                >
                  {language}
                </Link>
              );
            })}
          </div>
        </NoorCard>
      </section>

      {selectedBook ? (
        <section className={styles.pickerPanel} aria-label="Choose tafseer source and Surah">
          <div className={styles.pickerHeader}>
            <div>
              <span className="noor-badge gold">Source and Surah</span>
              <h2>Choose the book, then choose the passage.</h2>
              <p className="noor-subtitle">
                This layout avoids pretending that every tafseer note is one-to-one with one ayah. Each card below shows its actual coverage.
              </p>
            </div>
          </div>

          <div className={styles.bookScroller} aria-label="Tafseer sources">
            {visibleBooks.map((book) => (
              <Link
                key={book.id}
                className={book.id === selectedBook.id ? styles.activeBookCard : styles.bookCard}
                href={buildTafseerHref(book.id, book.availableSurahs[0] ?? book.firstSurah, selectedLanguage)}
              >
                <span>{book.language}</span>
                <strong>{book.label}</strong>
                <small>{book.surahCount} surahs, {book.entryCount} entries</small>
              </Link>
            ))}
          </div>

          <div className={styles.surahScroller} aria-label="Available Surahs in selected tafseer source">
            {availableSurahs.slice(0, 114).map((surah) => (
              <Link
                key={`${selectedBook.id}-${surah}`}
                className={surah === selectedSurah ? styles.activeSurahButton : styles.surahButton}
                href={buildTafseerHref(selectedBook.id, surah, selectedLanguage)}
              >
                {surah}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.workspace} id="tafseer-workspace" aria-label="Tafseer workspace">
        <aside className={styles.contextPanel}>
          <span className="noor-badge emerald">Quran to Tafseer</span>
          <h2>{selectedSurahMeta?.nameTransliteration ?? `Surah ${selectedSurah}`}</h2>
          <p className="noor-subtitle">
            Tafseer explains a Quran passage. Keep the Quran context visible before reading the explanation.
          </p>
          <div className={styles.contextActions}>
            <Link className="noor-button" href={`/learn/quran/${selectedSurah}#ayah-1`}>
              Read Surah
            </Link>
            <Link className="noor-button secondary" href={`/learn/quran/${selectedSurah}#ayah-1`}>
              Open Study mode
            </Link>
          </div>
          <div className={styles.miniMap} aria-label="Tafseer passage map">
            {entries.length ? (
              entries.slice(0, 12).map((entry) => (
                <a key={entry.id} href={`#ayah-${entry.fromAyah}`}>
                  <span>{getCoverageLabel(entry, selectedSurahMeta?.ayahCount)}</span>
                  <strong>{getRangeText(entry)}</strong>
                </a>
              ))
            ) : (
              <p>No passage map is available for this selection.</p>
            )}
          </div>
        </aside>

        <section className={styles.entryColumn} aria-label="Tafseer entries">
          {entries.length === 0 ? (
            <NoorCard>
              <span className="noor-badge">No entries</span>
              <h2>No Tafseer entries found for this selection</h2>
              <p className="noor-subtitle">
                Try another source or Surah. You can still read the Quran context and return when this source has coverage.
              </p>
              <div className="noor-card-actions">
                <Link className="noor-button" href={`/learn/quran/${selectedSurah}`}>
                  Read Quran context
                </Link>
              </div>
            </NoorCard>
          ) : null}

          {entries.map((entry, index) => {
            const primaryTopic = getPrimaryTopic(entry.tags);
            const ayahContext = getAyahContext(selectedSurahContent?.ayahs, entry);
            const leadTranslation = getLeadTranslation(ayahContext);

            return (
              <article key={`${entry.id}-${index}`} id={`ayah-${entry.fromAyah}`} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <div>
                    <span className="noor-badge gold">{getCoverageLabel(entry, selectedSurahMeta?.ayahCount)}</span>
                    <h2>{entry.title}</h2>
                  </div>
                  <span className="noor-reference">{getRangeText(entry)}</span>
                </div>

                <div className={styles.coverageNotice}>
                  <strong>Coverage notice</strong>
                  <span>
                    This tafseer entry explains {getCoverageLabel(entry, selectedSurahMeta?.ayahCount).toLowerCase()} from {entry.sourceLabel}.
                  </span>
                </div>

                {ayahContext.length ? (
                  <details className={styles.ayahDetails}>
                    <summary>View Quran passage context</summary>
                    <div className={styles.ayahContextBox}>
                      <p className={styles.ayahArabic} lang="ar" dir="rtl">
                        {ayahContext.map((ayah) => ayah.arabic).join(' ')}
                      </p>
                      {leadTranslation ? <p>{leadTranslation}</p> : null}
                      <Link className="noor-button secondary" href={`/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`}>
                        Open full Quran context
                      </Link>
                    </div>
                  </details>
                ) : null}

                <div className={styles.entryBody}>{entry.body}</div>

                {entry.tags.length ? (
                  <div className={styles.tagRow} aria-label="Tafseer topics">
                    {entry.tags.slice(0, 8).map((tag) => (
                      <Link key={`${entry.id}-${tag}`} href={`/explore?topic=${encodeURIComponent(tag.toLowerCase())}`}>
                        {tag}
                      </Link>
                    ))}
                  </div>
                ) : null}

                <SourceConnectionsPanel
                  compact
                  subtitle="Continue from this explanation into Quran context, topic exploration, or Hadith reminders."
                  connections={[
                    {
                      label: 'Quran',
                      badge: 'Quran',
                      title: 'Read the passage in Quran context',
                      description: `Open Surah ${entry.surah} from ayah ${entry.fromAyah}.`,
                      href: `/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`
                    },
                    {
                      label: 'Topic',
                      badge: 'Topic',
                      title: `Explore ${primaryTopic}`,
                      description: 'Search Quran, Tafseer and Hadith through this theme.',
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

                <div className={styles.entryActions}>
                  <Link className="noor-button secondary" href={`/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`}>
                    Read Quran context
                  </Link>
                  <a className="noor-button secondary" href="#tafseer-top">
                    Back to source controls
                  </a>
                </div>
              </article>
            );
          })}
        </section>
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
