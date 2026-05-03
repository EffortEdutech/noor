'use client';

import type { SurahContent, TafseerEntry } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { useMemo, useState } from 'react';
import { AyahStudyCard, type QuranReaderMode } from './AyahStudyCard';
import { ReaderPreferencesPanel } from './ReaderPreferencesPanel';
import { ReadingProgressPanel } from './ReadingProgressPanel';

const READER_MODES: {
  id: QuranReaderMode;
  label: string;
  helper: string;
}[] = [
  {
    id: 'read',
    label: 'Read',
    helper: 'A calm reading flow with Arabic and translation.'
  },
  {
    id: 'study',
    label: 'Study',
    helper: 'Show tafseer notes and learning context when available.'
  },
  {
    id: 'memorise',
    label: 'Memorise',
    helper: 'Reduce distractions and focus on the Arabic text.'
  }
];

function getTafseerForAyah(tafseer: TafseerEntry[], ayahNumber: number) {
  return tafseer.find((entry) => ayahNumber >= entry.fromAyah && ayahNumber <= entry.toAyah);
}

export function QuranReadingExperience({
  content,
  tafseer
}: {
  content: SurahContent;
  tafseer: TafseerEntry[];
}) {
  const [mode, setMode] = useState<QuranReaderMode>('read');
  const selectedMode = READER_MODES.find((item) => item.id === mode) ?? READER_MODES[0];

  const previousSurah = content.surah.number > 1 ? content.surah.number - 1 : undefined;
  const nextSurah = content.surah.number < 114 ? content.surah.number + 1 : undefined;

  const tafseerCount = useMemo(() => {
    return content.ayahs.filter((ayah) => getTafseerForAyah(tafseer, ayah.ayah)).length;
  }, [content.ayahs, tafseer]);

  return (
    <div className="noor-stack">
      <section className="noor-hero-grid">
        <NoorCard variant="gold" className="noor-reader-hero">
          <span className="noor-badge emerald">You are reading</span>
          <h2>{content.surah.nameTransliteration}</h2>
          <p className="noor-subtitle">
            Read at your own pace. Mark your current ayah, save meaningful reminders and switch mode based on your intention.
          </p>
          <div className="noor-reader-facts">
            <span>{content.surah.ayahCount} ayat</span>
            <span>{content.surah.revelation}</span>
            <span>{tafseerCount} tafseer note{tafseerCount === 1 ? '' : 's'}</span>
          </div>
        </NoorCard>

        <NoorCard variant="soft">
          <span className="noor-kicker">Reading intention</span>
          <h2>{selectedMode.label}</h2>
          <p className="noor-subtitle">{selectedMode.helper}</p>
          <div className="noor-card-actions" style={{ marginTop: 14 }}>
            <a className="noor-button secondary" href="/learn/quran">Surah index</a>
            {previousSurah ? <a className="noor-button secondary" href={`/learn/quran/${previousSurah}`}>Previous</a> : null}
            {nextSurah ? <a className="noor-button secondary" href={`/learn/quran/${nextSurah}`}>Next</a> : null}
          </div>
        </NoorCard>
      </section>

      <nav className="noor-reader-toolbar" aria-label="Quran reader controls">
        <div className="noor-reader-tabs" role="tablist" aria-label="Reading mode">
          {READER_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="noor-reader-tab"
              data-active={mode === item.id}
              aria-pressed={mode === item.id}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <a className="noor-button secondary" href="#ayah-1">Top</a>
      </nav>

      <section className="noor-reader-layout">
        <aside className="noor-reader-side">
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
