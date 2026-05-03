'use client';

import type { QuranAyah, TafseerEntry } from '@noor/content';
import { BookmarkButton, NoorCard } from '@noor/ui';
import { getArabicFontSize, useReaderPreferences } from '../lib/reader-preferences';
import { MarkReadingProgressButton } from './MarkReadingProgressButton';

export type QuranReaderMode = 'read' | 'study' | 'memorise';

function getModeBadge(mode: QuranReaderMode) {
  if (mode === 'memorise') return 'Memorise focus';
  if (mode === 'study') return 'Study with meaning';
  return 'Read calmly';
}

export function AyahStudyCard({
  ayah,
  tafseer,
  surahTitle,
  mode = 'study'
}: {
  ayah: QuranAyah;
  tafseer?: TafseerEntry;
  surahTitle: string;
  mode?: QuranReaderMode;
}) {
  const { preferences } = useReaderPreferences();
  const href = `/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`;
  const showTranslation = mode !== 'memorise';
  const showEnglish = showTranslation && (preferences.languageMode === 'both' || preferences.languageMode === 'en');
  const showMalay = showTranslation && (preferences.languageMode === 'both' || preferences.languageMode === 'ms');
  const showTransliteration = mode !== 'memorise' && preferences.showTransliteration && ayah.transliteration;
  const showTafseer = mode === 'study' && preferences.showTafseer && tafseer;

  return (
    <div id={`ayah-${ayah.ayah}`} className="noor-anchor-wrap">
      <NoorCard variant={preferences.focusMode || mode === 'memorise' ? 'gold' : 'default'} className={`noor-ayah-card noor-ayah-card-${mode}`}>
        <div className="noor-row">
          <span className="noor-badge emerald">Ayah {ayah.ayah}</span>
          <span className="noor-reference">{ayah.key}</span>
        </div>

        <div className="noor-row" style={{ justifyContent: 'flex-start', marginTop: 10 }}>
          <span className="noor-badge gold">{getModeBadge(mode)}</span>
          {tafseer ? <span className="noor-badge">Tafseer available</span> : null}
        </div>

        <div
          className="noor-arabic noor-ayah-arabic"
          style={{
            fontSize: getArabicFontSize(preferences.arabicSize),
            lineHeight: preferences.arabicSize === 'large' ? 2.25 : 2.05
          }}
        >
          {ayah.arabic}
        </div>

        {showTransliteration ? <p className="noor-muted">{ayah.transliteration}</p> : null}

        {showEnglish ? (
          <p className="noor-translation">
            <strong>English:</strong> {ayah.translations.en}
          </p>
        ) : null}

        {showMalay ? (
          <p className="noor-translation">
            <strong>Malay:</strong> {ayah.translations.ms}
          </p>
        ) : null}

        {mode === 'memorise' ? (
          <div className="noor-study-note">
            <strong>Memorise focus:</strong> translation and tafseer are hidden here to reduce distraction.
            Switch to Read or Study when you want to review the meaning.
          </div>
        ) : null}

        {showTafseer ? (
          <div className="noor-card is-soft noor-tafseer-inline" style={{ marginTop: 14 }}>
            <span className="noor-badge gold">Understand this ayah</span>
            <h3>{tafseer.title}</h3>
            <p className="noor-subtitle">{tafseer.body}</p>
          </div>
        ) : null}

        {mode !== 'study' && tafseer ? (
          <p className="noor-muted noor-small">Tip: switch to Study mode to read the tafseer note for this ayah.</p>
        ) : null}

        <div className="noor-card-actions noor-ayah-actions" style={{ marginTop: 14 }}>
          <BookmarkButton
            item={{
              id: `ayah-${ayah.key}`,
              type: 'ayah',
              title: ayah.translations.en ?? ayah.arabic,
              reference: ayah.key,
              href
            }}
          />
          <MarkReadingProgressButton
            surah={ayah.surah}
            ayah={ayah.ayah}
            ayahKey={ayah.key}
            title={`${surahTitle} · Ayah ${ayah.ayah}`}
            subtitle={ayah.translations.en}
            href={href}
          />
          <a className="noor-button secondary" href="/studio">Create share card</a>
        </div>
      </NoorCard>
    </div>
  );
}
