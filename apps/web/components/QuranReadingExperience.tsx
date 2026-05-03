'use client';

import type { SurahContent, TafseerEntry } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { useEffect, useMemo, useState } from 'react';
import { AyahStudyCard, type QuranReaderMode } from './AyahStudyCard';
import { ReaderPreferencesPanel } from './ReaderPreferencesPanel';
import { ReadingProgressPanel } from './ReadingProgressPanel';

const READER_MODE_STORAGE_KEY = 'noor.quran.readerMode.v2';

const READER_MODES: {
  id: QuranReaderMode;
  label: string;
  helper: string;
}[] = [
  {
    id: 'read',
    label: 'Read',
    helper: 'A calm flow for daily tilawah with translation close by.'
  },
  {
    id: 'study',
    label: 'Study',
    helper: 'Open meaning, tafseer notes and reflection prompts beside the ayah.'
  },
  {
    id: 'memorise',
    label: 'Memorise',
    helper: 'Reduce distraction and focus on the Arabic text and repetition.'
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
  tafseer
}: {
  content: SurahContent;
  tafseer: TafseerEntry[];
}) {
  const totalAyahs = content.ayahs.length;
  const [mode, setMode] = useState<QuranReaderMode>('read');
  const [jumpAyah, setJumpAyah] = useState(1);
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
      if (initialAyah >= 1 && initialAyah <= totalAyahs) setJumpAyah(initialAyah);
    } catch {
      // Keep the default read mode when localStorage is unavailable.
    }
  }, [totalAyahs]);

  function updateMode(nextMode: QuranReaderMode) {
    setMode(nextMode);
    try {
      window.localStorage.setItem(READER_MODE_STORAGE_KEY, nextMode);
    } catch {
      // Ignore blocked storage and continue with session-only state.
    }
  }

  function scrollToAyah(nextAyah: number) {
    const normalized = Math.min(Math.max(Number(nextAyah) || 1, 1), totalAyahs);
    setJumpAyah(normalized);

    if (typeof document === 'undefined') return;
    const target = document.getElementById(`ayah-${normalized}`);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#ayah-${normalized}`);
    }
  }

  return (
    <div className="noor-stack" id="reader-top">
      <section className="noor-hero-grid">
        <NoorCard variant="gold" className="noor-reader-hero">
          <span className="noor-badge emerald">You are reading</span>
          <h2>{content.surah.nameTransliteration}</h2>
          <p className="noor-subtitle">
            Read at your own pace. Jump to any ayah, choose your reading intention, save what touches the heart, and return tomorrow without losing your place.
          </p>
          <div className="noor-reader-facts">
            <span>{content.surah.ayahCount} ayat</span>
            <span>{content.surah.revelation}</span>
            <span>{tafseerCount} tafseer note{tafseerCount === 1 ? '' : 's'}</span>
          </div>
        </NoorCard>

        <NoorCard variant="soft" className="noor-reader-session-card">
          <span className="noor-kicker">Current intention</span>
          <h2>{selectedMode.label}</h2>
          <p className="noor-subtitle">{selectedMode.helper}</p>
          <div className="noor-card-actions" style={{ marginTop: 14 }}>
            <a className="noor-button secondary" href="/learn/quran">Surah index</a>
            {previousSurah ? <a className="noor-button secondary" href={`/learn/quran/${previousSurah}`}>Previous Surah</a> : null}
            {nextSurah ? <a className="noor-button secondary" href={`/learn/quran/${nextSurah}`}>Next Surah</a> : null}
          </div>
        </NoorCard>
      </section>

      <nav className="noor-reader-toolbar noor-reader-toolbar-v2" aria-label="Quran reader controls">
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

        <form
          className="noor-reader-jump-form"
          onSubmit={(event) => {
            event.preventDefault();
            scrollToAyah(jumpAyah);
          }}
        >
          <label className="noor-reader-jump-label" htmlFor="noor-jump-ayah">Ayah</label>
          <input
            id="noor-jump-ayah"
            className="noor-input noor-reader-jump-input"
            type="number"
            min={1}
            max={totalAyahs}
            value={jumpAyah}
            onChange={(event) => setJumpAyah(Number(event.target.value))}
          />
          <button className="noor-button secondary" type="submit">Jump</button>
        </form>

        <a className="noor-button secondary" href="#reader-top">Top</a>
      </nav>

      <section className="noor-reader-layout">
        <aside className="noor-reader-side">
          <NoorCard variant="soft" className="noor-reader-map-card">
            <span className="noor-kicker">Surah map</span>
            <p className="noor-subtitle">Jump directly to an ayah in this Surah.</p>
            <div className="noor-ayah-map" aria-label={`${content.surah.nameTransliteration} ayah shortcuts`}>
              {content.ayahs.map((ayah) => (
                <button
                  key={ayah.key}
                  type="button"
                  className="noor-ayah-map-button"
                  aria-current={jumpAyah === ayah.ayah ? 'true' : undefined}
                  onClick={() => scrollToAyah(ayah.ayah)}
                >
                  {ayah.ayah}
                </button>
              ))}
            </div>
          </NoorCard>

          <ReaderPreferencesPanel compact />
          <ReadingProgressPanel />
        </aside>

        <section className="noor-stack noor-reader-main" aria-label={`${content.surah.nameTransliteration} ayat`}>
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
      </section>
    </div>
  );
}
