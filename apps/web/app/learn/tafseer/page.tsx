import Link from 'next/link';
import type { LanguageCode, QuranAyah, TafseerEntry } from '@noor/content';
import { getSurahContent, getSurahIndex, getTafseerEntries, getTafseerIndex } from '@noor/data';
import { FloatingTafseerNavigator } from '../../../components/FloatingTafseerNavigator';
import { TafseerTeachingActions } from '../../../components/TafseerTeachingActions';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';
import styles from './TafseerPage.module.css';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

type TafseerPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

const VALID_LANGUAGES = ['ar', 'en', 'ms', 'id', 'ur', 'zh', 'ta'];
const RTL_LANGUAGES = ['ar', 'ur'];
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
const BISMILLAH_PATTERN = /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَـٰنِ\s+ٱلرَّحِيمِ\s*/u;

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

  return VALID_LANGUAGES.includes(raw) ? (raw as LanguageCode) : undefined;
}

function isRtlLanguage(language: string | undefined) {
  return language ? RTL_LANGUAGES.includes(language) : false;
}

function languageLabel(language: string | undefined) {
  if (!language) return 'Unknown';

  const labels: Record<string, string> = {
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

function getPrimaryTopic(tags: string[]) {
  return tags.find((tag) => tag.trim().length > 1)?.toLowerCase() ?? 'guidance';
}

function getRangeText(entry: TafseerEntry) {
  if (entry.fromAyah === entry.toAyah) return `${entry.surah}:${entry.fromAyah}`;
  return `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`;
}

function getRangeKind(entry: TafseerEntry, ayahCount?: number) {
  if (ayahCount && entry.fromAyah === 1 && entry.toAyah >= ayahCount) return 'surah';
  if (entry.fromAyah === entry.toAyah) return 'ayah';
  return 'passage';
}

function getCoverageText(entry: TafseerEntry, ayahCount?: number) {
  const rangeKind = getRangeKind(entry, ayahCount);
  if (rangeKind === 'surah') return 'Surah-level note';
  if (rangeKind === 'ayah') return 'Ayah explanation';
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
  return ayah.translations.en ?? ayah.translations.ms ?? ayah.translations.id ?? '';
}

function stripLeadingBismillah(arabic: string, surah: number, ayah: number) {
  if (surah === 1 && ayah === 1) return arabic;

  const trimmed = arabic.trimStart();
  if (trimmed.startsWith(BISMILLAH)) return trimmed.slice(BISMILLAH.length).trimStart();

  return trimmed.replace(BISMILLAH_PATTERN, '');
}

function getArabicPassage(ayahs: QuranAyah[]) {
  return ayahs.map((ayah) => stripLeadingBismillah(ayah.arabic, ayah.surah, ayah.ayah)).join(' ');
}

function makeQuote(text: string, maxLength = 420) {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength).trim()}...`;
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
  const selectedBook = books.find((book) => book.id === selectedBookId) ?? visibleBooks[0] ?? books[0];

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
  const rangeEntries = entries.filter((entry) => entry.fromAyah !== entry.toAyah).length;
  const sourceLanguage = selectedBook?.language;

  return (
    <main className={`noor-page ${styles.page}`} id="tafseer-top">
      <section className={styles.contextBar} aria-label="Current Tafseer context">
        <div className={styles.contextTitle}>
          <span className="noor-kicker">Tafseer reading surface</span>
          <h1>{selectedSurahMeta?.nameTransliteration ?? `Surah ${selectedSurah}`}</h1>
          <p>
            Read the Quran passage, study the tafseer, and keep source details visible without crowding the page.
          </p>
        </div>

        <dl className={styles.contextFacts} aria-label="Tafseer source facts">
          <div>
            <dt>Book</dt>
            <dd>{selectedBook?.label ?? 'Not available'}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{languageLabel(sourceLanguage)}</dd>
          </div>
          <div>
            <dt>Coverage</dt>
            <dd>{entries.length} entries</dd>
          </div>
          <div>
            <dt>Structure</dt>
            <dd>{oneAyahEntries} ayah, {rangeEntries} range</dd>
          </div>
        </dl>
      </section>

      <section className={styles.surface} id="tafseer-content" aria-label="Tafseer content">
        {entries.length === 0 ? (
          <article className={styles.emptyState}>
            <span className="noor-badge">No entries</span>
            <h2>No tafseer entries found for this selection</h2>
            <p>
              Use the floating Tafseer button to try another source, Surah, ayah, or language. The Quran reader remains available even when tafseer coverage is missing.
            </p>
            <div className={styles.emptyActions}>
              <Link className="noor-button" href={`/learn/quran/${selectedSurah}`}>
                Read Quran context
              </Link>
              <Link className="noor-button secondary" href="/learn/tafseer">
                Reset Tafseer view
              </Link>
            </div>
          </article>
        ) : null}

        {entries.map((entry, index) => {
          const primaryTopic = getPrimaryTopic(entry.tags);
          const ayahContext = getAyahContext(selectedSurahContent?.ayahs, entry);
          const previewAyahs = getPreviewAyahs(ayahContext);
          const omittedAyahCount = Math.max(ayahContext.length - previewAyahs.length, 0);
          const entryDirection = isRtlLanguage(entry.language) ? 'rtl' : 'ltr';
          const quranPassage = getArabicPassage(previewAyahs);
          const rangeText = getRangeText(entry);
          const rangeKind = getRangeKind(entry, selectedSurahMeta?.ayahCount);
          const quranHref = `/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`;
          const sourceReference = `${entry.sourceLabel} - ${rangeText}`;
          const teachingQuote = makeQuote(entry.body);

          return (
            <article key={`${entry.id}-${index}`} id={`ayah-${entry.fromAyah}`} className={styles.entryCard}>
              <header className={styles.entryHeader}>
                <div className={styles.entryTitleBlock}>
                  <div className={styles.badgeRow} aria-label="Tafseer entry metadata">
                    <span className="noor-badge gold">{getCoverageText(entry, selectedSurahMeta?.ayahCount)}</span>
                    <span className={styles.metaBadge}>{rangeText}</span>
                    <span className={styles.metaBadge}>{languageLabel(entry.language)}</span>
                  </div>
                  <h2>{entry.title || `Tafseer for ${rangeText}`}</h2>
                </div>
              </header>

              {previewAyahs.length ? (
                <section className={styles.quranPassage} aria-label={`Quran passage for ${rangeText}`}>
                  <div className={styles.passageHead}>
                    <div>
                      <span>Quran passage</span>
                      <strong>{rangeText}</strong>
                    </div>
                    <Link href={quranHref}>Open full context</Link>
                  </div>

                  <p className={styles.arabicLine} lang="ar" dir="rtl">
                    {quranPassage}
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

              <TafseerTeachingActions
                reference={sourceReference}
                quranPassage={quranPassage}
                tafseerQuote={teachingQuote}
                quranHref={quranHref}
                topicHref={`/explore?topic=${encodeURIComponent(primaryTopic)}`}
                teachingTitle={entry.title || `Tafseer for ${rangeText}`}
                keyPhrase={quranPassage ? makeQuote(quranPassage, 180) : rangeText}
                lessonNote={teachingQuote}
                reflectionPrompt={`What does ${rangeText} teach about ${primaryTopic}?`}
                saveKey={`tafseer:${entry.sourceLabel}:${rangeText}`}
              />

              <footer className={styles.sourceFooter} aria-label="Source awareness and compare foundation">
                <dl>
                  <div>
                    <dt>Source</dt>
                    <dd>{entry.sourceLabel}</dd>
                  </div>
                  <div>
                    <dt>Language</dt>
                    <dd>{languageLabel(entry.language)}</dd>
                  </div>
                  <div>
                    <dt>Ayah coverage</dt>
                    <dd>{rangeText}</dd>
                  </div>
                  <div>
                    <dt>Range type</dt>
                    <dd>{rangeKind}</dd>
                  </div>
                </dl>
                <p>
                  Compare foundation: this entry can later be compared with other tafseer sources using the same Surah and ayah coverage.
                </p>
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
          sourceLabel: entry.sourceLabel,
          language: entry.language
        }))}
        currentBookId={selectedBook?.id ?? ''}
        currentLanguage={selectedBook?.language}
        currentSurah={selectedSurah}
        currentAyahCount={selectedSurahMeta?.ayahCount ?? selectedSurahContent?.ayahs.length ?? 1}
      />

    </main>
  );
}
