'use client';

import type { QuranAyah, TafseerEntry } from '@noor/content';
import { BookmarkButton, NoorCard } from '@noor/ui';
import { getArabicFontSize, useReaderPreferences } from '../lib/reader-preferences';
import { MarkReadingProgressButton } from './MarkReadingProgressButton';

export function AyahStudyCard({
  ayah,
  tafseer,
  surahTitle
}: {
  ayah: QuranAyah;
  tafseer?: TafseerEntry;
  surahTitle: string;
}) {
  const { preferences } = useReaderPreferences();
  const href = `/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`;
  const showEnglish = preferences.languageMode === 'both' || preferences.languageMode === 'en';
  const showMalay = preferences.languageMode === 'both' || preferences.languageMode === 'ms';

  return (
    <div id={`ayah-${ayah.ayah}`} className="noor-anchor-wrap">
      <NoorCard variant={preferences.focusMode ? 'gold' : 'default'}>
        <div className="noor-row">
          <span className="noor-badge emerald">Ayah {ayah.ayah}</span>
          <span className="noor-reference">{ayah.key}</span>
        </div>

        <div
          className="noor-arabic"
          style={{
            fontSize: getArabicFontSize(preferences.arabicSize),
            lineHeight: preferences.arabicSize === 'large' ? 2.25 : 2.05
          }}
        >
          {ayah.arabic}
        </div>

        {preferences.showTransliteration && ayah.transliteration ? <p className="noor-muted">{ayah.transliteration}</p> : null}

        {showEnglish ? (
          <p className="noor-translation">
            <strong>EN:</strong> {ayah.translations.en}
          </p>
        ) : null}

        {showMalay ? (
          <p className="noor-translation">
            <strong>MS:</strong> {ayah.translations.ms}
          </p>
        ) : null}

        {preferences.showTafseer && tafseer ? (
          <div className="noor-card is-soft" style={{ marginTop: 14 }}>
            <span className="noor-badge gold">Tafseer</span>
            <h3>{tafseer.title}</h3>
            <p className="noor-subtitle">{tafseer.body}</p>
          </div>
        ) : null}

        <div className="noor-card-actions" style={{ marginTop: 14 }}>
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
          <a className="noor-button" href="/studio">Share later</a>
        </div>
      </NoorCard>
    </div>
  );
}
