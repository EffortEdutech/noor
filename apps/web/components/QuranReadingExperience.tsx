'use client';

import type { SurahContent, TafseerEntry } from '@noor/content';
import { useEffect, useMemo, useState } from 'react';
import { AyahStudyCard, type QuranReaderMode } from './AyahStudyCard';
import { FloatingQuranNavigator, type QuranNavigatorSurah } from './FloatingQuranNavigator';

const READER_MODE_STORAGE_KEY = 'noor.quran.readerMode.v2';

const READER_MODES: {
  id: QuranReaderMode;
  label: string;
  helper: string;
}[] = [
  {
    id: 'read',
    label: 'Read',
    helper: 'Calm Quran reading with translation close by.'
  },
  {
    id: 'study',
    label: 'Study',
    helper: 'Open tafseer notes, connections and reflection prompts.'
  },
  {
    id: 'memorise',
    label: 'Memorise',
    helper: 'Reduce noise and give more space to the Arabic text.'
  }
];

function getTafseerForAyah(tafseer: TafseerEntry[], ayahNumber: number) {
  return tafseer.find((entry) => ayahNumber >= entry.fromAyah && ayahNumber <= entry.toAyah);
}

function normalizeReaderMode(value: string | null | undefined): QuranReaderMode {
  if (value === 'study' || value === 'memorise' || value === 'read') return value;
  return 'read';
}

function getAyahFromHash() {
  if (typeof window === 'undefined') return 1;
  const match = window.location.hash.match(/^#ayah-(\d+)$/);
  return match ? Number(match[1]) : 1;
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
  const [mode, setMode] = useState<QuranReaderMode>('read');
  const [currentAyah, setCurrentAyah] = useState(1);
  const selectedMode = READER_MODES.find((item) => item.id === mode) ?? READER_MODES[0];

  const previousSurah = content.surah.number > 1 ? content.surah.number - 1 : undefined;
  const nextSurah = content.surah.number < 114 ? content.surah.number + 1 : undefined;

  const tafseerCount = useMemo(() => {
    return content.ayahs.filter((ayah) => getTafseerForAyah(tafseer, ayah.ayah)).length;
  }, [content.ayahs, tafseer]);

  useEffect(() => {
    try {
      setMode(normalizeReaderMode(window.localStorage.getItem(READER_MODE_STORAGE_KEY)));
      const initialAyah = getAyahFromHash();
      if (initialAyah >= 1 && initialAyah <= totalAyahs) {
        setCurrentAyah(initialAyah);
        window.setTimeout(() => scrollToAyah(initialAyah, false), 120);
      }
    } catch {
      // Keep default read mode when storage is unavailable.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAyahs]);

  function updateMode(nextMode: QuranReaderMode) {
    setMode(nextMode);
    try {
      window.localStorage.setItem(READER_MODE_STORAGE_KEY, nextMode);
    } catch {
      // Ignore blocked storage and continue with session-only state.
    }
  }

  function scrollToAyah(nextAyah: number, smooth = true) {
    const normalized = Math.min(Math.max(Number(nextAyah) || 1, 1), totalAyahs);
    setCurrentAyah(normalized);

    if (typeof document === 'undefined') return;
    const target = document.getElementById(`ayah-${normalized}`);
    if (!target) return;

    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#ayah-${normalized}`);
    }
  }

  return (
    <div className="noor-quran-reader-shell" id="reader-top">
      <section className="noor-quran-reader-intro" aria-label="Quran reading session">
        <div>
          <span className="noor-kicker">Reading session</span>
          <h2>{content.surah.nameArabic}</h2>
          <p>
            {content.surah.ayahCount} ayat · {content.surah.revelation} · {tafseerCount} tafseer note{tafseerCount === 1 ? '' : 's'} available
          </p>
        </div>
        <div className="noor-quran-reader-actions">
          <a className="noor-button secondary" href="/learn/quran">Surah list</a>
          {previousSurah ? <a className="noor-button secondary" href={`/learn/quran/${previousSurah}`}>Previous</a> : null}
          {nextSurah ? <a className="noor-button secondary" href={`/learn/quran/${nextSurah}`}>Next</a> : null}
        </div>
      </section>

      <nav className="noor-reader-mode-bar" aria-label="Reading mode">
        <div className="noor-reader-tabs" role="tablist" aria-label="Reading mode">
          {READER_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="noor-reader-tab"
              data-active={mode === item.id}
              aria-pressed={mode === item.id}
              onClick={() => updateMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span>{selectedMode.helper}</span>
      </nav>

      <section className="noor-quran-reader-main" aria-label={`${content.surah.nameTransliteration} ayat`}>
        {content.ayahs.map((ayah) => (
          <AyahStudyCard
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
      />
    </div>
  );
}
