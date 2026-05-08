'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LanguageCode, SurahIndexEntry } from '@noor/content';
import { TAFSEER_LAST_VISIT_KEY } from '../lib/knowledge-last-visit';
import styles from './FloatingTafseerNavigator.module.css';

type TafseerNavigatorBook = {
  id: string;
  label: string;
  language: LanguageCode;
  availableSurahs: number[];
  firstSurah: number;
};

type TafseerNavigatorEntry = {
  id: string;
  title: string;
  surah: number;
  fromAyah: number;
  toAyah: number;
  sourceLabel: string;
  language: LanguageCode;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(Number(value) || min, min), max);
}

function getAyahFromHash() {
  if (typeof window === 'undefined') return 1;
  const match = window.location.hash.match(/^#ayah-(\d+)$/);
  return match ? Number(match[1]) : 1;
}

function coverageLabel(entry: TafseerNavigatorEntry) {
  if (entry.fromAyah === entry.toAyah) return `Ayah ${entry.fromAyah}`;
  return `Ayah ${entry.fromAyah}-${entry.toAyah}`;
}

function languageLabel(language: string | undefined) {
  const labels: Record<string, string> = {
    ar: 'Arabic',
    en: 'English',
    ms: 'Malay',
    id: 'Indonesian',
    ur: 'Urdu',
    zh: 'Chinese',
    ta: 'Tamil'
  };

  return language ? labels[language] ?? language.toUpperCase() : 'Language';
}

function buildTafseerHref(bookId: string, surah: number, language?: string, ayah?: number, page?: number) {
  const params = new URLSearchParams({
    book: bookId,
    surah: String(surah)
  });

  if (language) params.set('language', language);
  if (page && page > 1) params.set('page', String(page));

  const hash = ayah ? `#ayah-${ayah}` : '';
  return `/learn/tafseer?${params.toString()}${hash}`;
}

function uniqueLanguages(books: TafseerNavigatorBook[]) {
  return Array.from(new Set(books.map((book) => book.language))).sort();
}

function saveTafseerLastVisit({
  bookId,
  sourceLabel,
  surahName,
  surah,
  language,
  ayah
}: {
  bookId: string;
  sourceLabel?: string;
  surahName?: string;
  surah: number;
  language?: LanguageCode;
  ayah: number;
}) {
  try {
    const safeAyah = Math.max(Number(ayah) || 1, 1);
    window.localStorage.setItem(TAFSEER_LAST_VISIT_KEY, JSON.stringify({
      href: buildTafseerHref(bookId, surah, language, safeAyah),
      title: `${surahName ?? `Surah ${surah}`} - Ayah ${safeAyah}`,
      subtitle: sourceLabel,
      updatedAt: new Date().toISOString()
    }));
  } catch {
    // Ignore blocked storage.
  }
}

export function FloatingTafseerNavigator({
  books,
  surahs,
  entries,
  currentBookId,
  currentLanguage,
  currentSurah,
  currentAyahCount
}: {
  books: TafseerNavigatorBook[];
  surahs: SurahIndexEntry[];
  entries: TafseerNavigatorEntry[];
  currentBookId: string;
  currentLanguage?: LanguageCode;
  currentSurah: number;
  currentAyahCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | undefined>(currentLanguage);
  const [selectedBookId, setSelectedBookId] = useState(currentBookId);
  const [selectedSurah, setSelectedSurah] = useState(currentSurah);
  const [selectedAyah, setSelectedAyah] = useState(1);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
    setSelectedBookId(currentBookId);
    setSelectedSurah(currentSurah);
    setSelectedAyah((value) => clamp(value || getAyahFromHash(), 1, currentAyahCount || 1));
  }, [currentBookId, currentLanguage, currentSurah, currentAyahCount]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const languages = useMemo(() => uniqueLanguages(books), [books]);

  const booksForLanguage = useMemo(() => {
    if (!selectedLanguage) return books;
    const filtered = books.filter((book) => book.language === selectedLanguage);
    return filtered.length ? filtered : books;
  }, [books, selectedLanguage]);

  const selectedBook = useMemo(() => {
    return booksForLanguage.find((book) => book.id === selectedBookId) ?? booksForLanguage[0] ?? books[0];
  }, [books, booksForLanguage, selectedBookId]);

  const currentBook = useMemo(() => {
    return books.find((book) => book.id === currentBookId) ?? selectedBook;
  }, [books, currentBookId, selectedBook]);

  const selectedSurahInfo = useMemo(() => {
    return surahs.find((surah) => surah.number === selectedSurah) ?? surahs[0];
  }, [selectedSurah, surahs]);

  const availableSurahs = selectedBook?.availableSurahs?.length
    ? selectedBook.availableSurahs
    : surahs.map((surah) => surah.number);

  const ayahCount = selectedSurahInfo?.ayahCount ?? currentAyahCount ?? 1;
  const ayahOptions = Array.from({ length: ayahCount }, (_, index) => index + 1);
  const canUseVisibleEntries = selectedBook?.id === currentBookId && selectedSurah === currentSurah;
  const coveredEntry = canUseVisibleEntries
    ? entries.find((entry) => selectedAyah >= entry.fromAyah && selectedAyah <= entry.toAyah)
    : undefined;
  const coveredEntryIndex = coveredEntry ? entries.findIndex((entry) => entry.id === coveredEntry.id) : -1;
  const selectedRangeLabel = coveredEntry ? coverageLabel(coveredEntry) : `Ayah ${selectedAyah}`;

  useEffect(() => {
    saveTafseerLastVisit({
      bookId: currentBookId,
      sourceLabel: currentBook?.label,
      surahName: surahs.find((surah) => surah.number === currentSurah)?.nameTransliteration,
      surah: currentSurah,
      language: currentLanguage,
      ayah: clamp(getAyahFromHash(), 1, currentAyahCount || 1)
    });
  }, [currentAyahCount, currentBook?.label, currentBookId, currentLanguage, currentSurah, surahs]);

  function changeLanguage(language: LanguageCode) {
    setSelectedLanguage(language);
    const nextBook = books.find((book) => book.language === language) ?? books[0];
    if (!nextBook) return;

    setSelectedBookId(nextBook.id);
    const nextSurah = nextBook.availableSurahs.includes(selectedSurah)
      ? selectedSurah
      : nextBook.availableSurahs[0] ?? nextBook.firstSurah ?? 1;
    setSelectedSurah(nextSurah);
    setSelectedAyah(1);
  }

  function changeBook(bookId: string) {
    const nextBook = books.find((book) => book.id === bookId);
    setSelectedBookId(bookId);

    if (nextBook) {
      setSelectedLanguage(nextBook.language);
      if (!nextBook.availableSurahs.includes(selectedSurah)) {
        setSelectedSurah(nextBook.availableSurahs[0] ?? nextBook.firstSurah ?? 1);
        setSelectedAyah(1);
      }
    }
  }

  function changeSurah(surah: number) {
    const nextSurah = surahs.find((item) => item.number === surah);
    setSelectedSurah(surah);
    setSelectedAyah((value) => clamp(value, 1, nextSurah?.ayahCount ?? 1));
  }

  function closeAndScrollToAyah(ayah: number) {
    const entryIndex = entries.findIndex((entry) => ayah >= entry.fromAyah && ayah <= entry.toAyah);
    const page = entryIndex >= 0 ? entryIndex + 1 : undefined;
    saveTafseerLastVisit({
      bookId: currentBookId,
      sourceLabel: currentBook?.label,
      surahName: surahs.find((surah) => surah.number === currentSurah)?.nameTransliteration,
      surah: currentSurah,
      language: currentLanguage,
      ayah
    });
    setOpen(false);
    router.push(buildTafseerHref(currentBookId, currentSurah, currentLanguage, ayah, page));
  }

  function goToSelection() {
    if (!selectedBook) return;

    const safeAyah = clamp(selectedAyah, 1, ayahCount);
    setSelectedAyah(safeAyah);
    setOpen(false);
    saveTafseerLastVisit({
      bookId: selectedBook.id,
      sourceLabel: selectedBook.label,
      surahName: selectedSurahInfo?.nameTransliteration,
      surah: selectedSurah,
      language: selectedBook.language,
      ayah: coveredEntry?.fromAyah ?? safeAyah
    });

    if (selectedBook.id === currentBookId && selectedSurah === currentSurah) {
      closeAndScrollToAyah(coveredEntry?.fromAyah ?? safeAyah);
      return;
    }

    router.push(buildTafseerHref(
      selectedBook.id,
      selectedSurah,
      selectedBook.language,
      safeAyah,
      coveredEntryIndex >= 0 ? coveredEntryIndex + 1 : undefined
    ));
  }

  function openQuranContext() {
    setOpen(false);
    router.push(`/learn/quran/${selectedSurah}#ayah-${clamp(selectedAyah, 1, ayahCount)}`);
  }

  return (
    <div className={styles.float} data-open={open ? 'true' : 'false'}>
      {open ? <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" /> : null}

      {open ? (
        <section className={styles.panel} role="dialog" aria-modal="true" aria-label="Tafseer navigation">
          <header className={styles.panelHead}>
            <div>
              <span>Tafseer navigator</span>
              <h2>Find source, Surah, ayah, or range</h2>
              <p>Use this navigator so the page remains a clean reading surface.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Tafseer navigator">
              Close
            </button>
          </header>

          <div className={styles.panelBody}>
            <div className={styles.fields}>
              <label>
                <span>Language</span>
                <select value={selectedLanguage ?? ''} onChange={(event) => changeLanguage(event.target.value as LanguageCode)}>
                  {languages.map((language) => (
                    <option value={language} key={language}>
                      {languageLabel(language)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Source</span>
                <select value={selectedBook?.id ?? ''} onChange={(event) => changeBook(event.target.value)}>
                  {booksForLanguage.map((book) => (
                    <option value={book.id} key={book.id}>
                      {book.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Surah</span>
                <select value={selectedSurah} onChange={(event) => changeSurah(Number(event.target.value))}>
                  {availableSurahs.map((surahNumber) => {
                    const surah = surahs.find((item) => item.number === surahNumber);
                    return (
                      <option value={surahNumber} key={surahNumber}>
                        {surahNumber}. {surah?.nameTransliteration ?? 'Surah'}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label>
                <span>Ayah</span>
                <select value={selectedAyah} onChange={(event) => setSelectedAyah(Number(event.target.value))}>
                  {ayahOptions.map((ayah) => (
                    <option value={ayah} key={ayah}>{ayah}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.selectionSummary}>
              <span>Selected coverage</span>
              <strong>{selectedRangeLabel}</strong>
              <p>
                {coveredEntry
                  ? `This ayah is covered by ${coveredEntry.title}.`
                  : 'Open the selected source to see exact coverage for this ayah.'}
              </p>
            </div>

            <div className={styles.structureMap} aria-label="Visible Tafseer structure">
              <div className={styles.structureHead}>
                <strong>Visible structure</strong>
                <span>{entries.length} entries</span>
              </div>

              {entries.length ? (
                entries.slice(0, 24).map((entry) => (
                  <button
                    type="button"
                    key={entry.id}
                    data-active={coveredEntry?.id === entry.id}
                    onClick={() => closeAndScrollToAyah(entry.fromAyah)}
                  >
                    <span>{coverageLabel(entry)}</span>
                    <strong>{entry.title}</strong>
                    <em>{entry.sourceLabel}</em>
                  </button>
                ))
              ) : (
                <p>No entries are visible for this source and Surah.</p>
              )}
            </div>
          </div>

          <footer className={styles.actions}>
            <button type="button" className={styles.primaryAction} onClick={goToSelection}>
              Go to Tafseer
            </button>
            <button type="button" onClick={openQuranContext}>
              Open Quran context
            </button>
          </footer>
        </section>
      ) : null}

      <button
        type="button"
        className={styles.floatButton}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open Tafseer navigator"
      >
        <span className={styles.floatMark} aria-hidden="true">
          <img src="/icons/09-spread-mark.png?v=noor-floating-tafseer" alt="" width="44" height="44" />
        </span>
      </button>
    </div>
  );
}
