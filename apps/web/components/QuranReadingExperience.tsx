'use client';

import type { QuranAyah, SurahContent, TafseerEntry } from '@noor/content';
import { BookmarkButton } from '@noor/ui';
import { useEffect, useMemo, useState } from 'react';
import { getArabicFontSize, useReaderPreferences } from '../lib/reader-preferences';
import { MarkReadingProgressButton } from './MarkReadingProgressButton';
import { TafseerUnderstandingPanel } from './TafseerUnderstandingPanel';
import { FloatingQuranNavigator, type QuranNavigatorSurah } from './FloatingQuranNavigator';
import { QURAN_LAST_VISIT_KEY } from './QuranLastVisitLanding';

const READER_MODE_STORAGE_KEY = 'noor.quran.readerMode.v4';

type ReaderMode = 'read' | 'meaning' | 'study';

const READER_MODES: Array<{ id: ReaderMode; label: string; helper: string }> = [
  { id: 'read', label: 'Read', helper: 'Arabic first, minimal distraction.' },
  { id: 'meaning', label: 'Meaning', helper: 'Arabic with translation.' },
  { id: 'study', label: 'Study', helper: 'Open tafseer and actions only when needed.' }
];

function getTafseerForAyah(tafseer: TafseerEntry[], ayahNumber: number) {
  return tafseer.find((entry) => ayahNumber >= entry.fromAyah && ayahNumber <= entry.toAyah);
}

function normalizeReaderMode(value: string | null | undefined): ReaderMode {
  if (value === 'study' || value === 'meaning' || value === 'read') return value;
  return 'read';
}

function getAyahFromHash() {
  if (typeof window === 'undefined') return 1;
  const match = window.location.hash.match(/^#ayah-(\d+)$/);
  return match ? Number(match[1]) : 1;
}

function clampAyah(value: number, total: number) {
  return Math.min(Math.max(Number(value) || 1, 1), Math.max(total, 1));
}

async function copyText(value: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function QuranAyahLine({
  ayah,
  tafseer,
  surahTitle,
  mode
}: {
  ayah: QuranAyah;
  tafseer?: TafseerEntry;
  surahTitle: string;
  mode: ReaderMode;
}) {
  const { preferences } = useReaderPreferences();
  const [copyStatus, setCopyStatus] = useState('');
  const english = ayah.translations.en ?? '';
  const malay = ayah.translations.ms ?? '';
  const showMeaning = mode === 'meaning' || mode === 'study';
  const showEnglish = showMeaning && (preferences.languageMode === 'both' || preferences.languageMode === 'en');
  const showMalay = showMeaning && (preferences.languageMode === 'both' || preferences.languageMode === 'ms');
  const href = `/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`;

  async function handleCopyAyah() {
    const copied = await copyText([
      `${surahTitle} ${ayah.key}`,
      ayah.arabic,
      english ? `English: ${english}` : '',
      malay ? `Malay: ${malay}` : '',
      `NOOR: ${href}`
    ].filter(Boolean).join('\n\n'));

    setCopyStatus(copied ? 'Copied.' : 'Copy unavailable.');
    window.setTimeout(() => setCopyStatus(''), 1600);
  }

  return (
    <article id={`ayah-${ayah.ayah}`} data-ayah={ayah.ayah} className="noor-quran-v2-ayah">
      <div className="noor-quran-v2-ayah-ref">
        <span>{ayah.key}</span>
      </div>

      <div
        className="noor-quran-v2-arabic"
        style={{
          fontSize: getArabicFontSize(preferences.arabicSize),
          lineHeight: preferences.arabicSize === 'large' ? 2.2 : 2.0
        }}
      >
        {ayah.arabic}
      </div>

      {showEnglish ? <p className="noor-quran-v2-translation">{english}</p> : null}
      {showMalay ? <p className="noor-quran-v2-translation noor-quran-v2-translation-secondary">{malay}</p> : null}

      {mode === 'study' ? (
        <details className="noor-quran-v2-study">
          <summary>Open study tools for this ayah</summary>
          <div className="noor-quran-v2-study-body">
            {tafseer ? (
              <TafseerUnderstandingPanel ayah={ayah} tafseer={tafseer} surahTitle={surahTitle} />
            ) : (
              <p>This ayah does not have a demo tafseer note yet.</p>
            )}
            <div className="noor-quran-v2-actions">
              <BookmarkButton
                item={{
                  id: `ayah-${ayah.key}`,
                  type: 'ayah',
                  title: english || ayah.arabic,
                  reference: ayah.key,
                  href
                }}
              />
              <MarkReadingProgressButton
                surah={ayah.surah}
                ayah={ayah.ayah}
                ayahKey={ayah.key}
                title={`${surahTitle} · Ayah ${ayah.ayah}`}
                subtitle={english}
                href={href}
              />
              <button className="noor-button secondary" type="button" onClick={handleCopyAyah}>Copy ayah</button>
              <a className="noor-button secondary" href={`/learn/tafseer?surah=${ayah.surah}#ayah-${ayah.ayah}`}>Open Tafseer</a>
            </div>
            {copyStatus ? <p className="noor-copy-status">{copyStatus}</p> : null}
          </div>
        </details>
      ) : null}
    </article>
  );
}

export function QuranReadingExperience({
  content,
  tafseer,
  allSurahs
}: {
  content: SurahContent;
  tafseer: TafseerEntry[];
  allSurahs: QuranNavigatorSurah[];
}) {
  const totalAyahs = content.ayahs.length;
  const [mode, setMode] = useState<ReaderMode>('read');
  const [currentAyah, setCurrentAyah] = useState(1);
  const selectedMode = READER_MODES.find((item) => item.id === mode) ?? READER_MODES[0];

  const tafseerCount = useMemo(() => {
    return content.ayahs.filter((ayah) => getTafseerForAyah(tafseer, ayah.ayah)).length;
  }, [content.ayahs, tafseer]);

  function saveLastVisit(nextAyah: number) {
    try {
      window.localStorage.setItem(QURAN_LAST_VISIT_KEY, JSON.stringify({
        surah: content.surah.number,
        ayah: clampAyah(nextAyah, totalAyahs),
        surahName: content.surah.nameTransliteration,
        surahEnglish: content.surah.nameEnglish,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // Ignore blocked storage.
    }
  }

  function scrollToAyah(nextAyah: number, smooth = true) {
    const normalized = clampAyah(nextAyah, totalAyahs);
    setCurrentAyah(normalized);
    saveLastVisit(normalized);

    if (typeof document === 'undefined') return;
    const target = document.getElementById(`ayah-${normalized}`);
    if (!target) return;

    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#ayah-${normalized}`);
    }
  }

  useEffect(() => {
    try {
      setMode(normalizeReaderMode(window.localStorage.getItem(READER_MODE_STORAGE_KEY)));
      const initialAyah = clampAyah(getAyahFromHash(), totalAyahs);
      setCurrentAyah(initialAyah);
      saveLastVisit(initialAyah);
      window.setTimeout(() => scrollToAyah(initialAyah, false), 120);
    } catch {
      // Keep default reader mode.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAyahs]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-ayah]'));
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const nextAyah = Number((visible.target as HTMLElement).dataset.ayah);
        if (Number.isFinite(nextAyah)) {
          setCurrentAyah(nextAyah);
          saveLastVisit(nextAyah);
        }
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0.15, 0.35, 0.6] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.surah.number, totalAyahs]);

  function updateMode(nextMode: ReaderMode) {
    setMode(nextMode);
    try {
      window.localStorage.setItem(READER_MODE_STORAGE_KEY, nextMode);
    } catch {
      // Ignore blocked storage.
    }
  }

  return (
    <main className="noor-quran-v2-reader" id="reader-top">
      <header className="noor-quran-v2-reader-head">
        <div>
          <span className="noor-quran-v2-eyebrow">Quran reader</span>
          <h1>{content.surah.nameArabic}</h1>
          <p>{content.surah.nameTransliteration} · {content.surah.nameEnglish} · {content.surah.ayahCount} ayat</p>
        </div>
      </header>

      <nav className="noor-quran-v2-modebar" aria-label="Reading mode">
        <div className="noor-quran-v2-modes" role="tablist" aria-label="Reading mode">
          {READER_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={mode === item.id}
              aria-pressed={mode === item.id}
              onClick={() => updateMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p><strong>{content.surah.number}:{currentAyah}</strong> · {selectedMode.helper} · {tafseerCount} tafseer note{tafseerCount === 1 ? '' : 's'}</p>
      </nav>

      <section className="noor-quran-v2-reading-column" aria-label={`${content.surah.nameTransliteration} ayat`}>
        {content.ayahs.map((ayah) => (
          <QuranAyahLine
            key={ayah.key}
            ayah={ayah}
            tafseer={getTafseerForAyah(tafseer, ayah.ayah)}
            surahTitle={content.surah.nameTransliteration}
            mode={mode}
          />
        ))}
      </section>

      <FloatingQuranNavigator
        surahs={allSurahs}
        currentSurah={content.surah.number}
        currentAyah={currentAyah}
        totalAyahs={totalAyahs}
        onJumpAyah={scrollToAyah}
        buttonLabel="Surah / Ayah"
      />
    </main>
  );
}
