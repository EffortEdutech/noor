'use client';

import type { QuranAyah, TafseerEntry } from '@noor/content';
import { BookmarkButton, NoorCard } from '@noor/ui';
import { useState } from 'react';
import { getArabicFontSize, useReaderPreferences } from '../lib/reader-preferences';
import { MarkReadingProgressButton } from './MarkReadingProgressButton';
import { TafseerUnderstandingPanel } from './TafseerUnderstandingPanel';

export type QuranReaderMode = 'read' | 'study' | 'memorise';

function getModeBadge(mode: QuranReaderMode) {
  if (mode === 'memorise') return 'Memorise focus';
  if (mode === 'study') return 'Study with meaning';
  return 'Read calmly';
}

function getModeHelper(mode: QuranReaderMode) {
  if (mode === 'memorise') return 'Repeat, listen to your own recitation, then check the meaning in Read or Study mode.';
  if (mode === 'study') return 'Read the meaning slowly, open the tafseer note, then write or save one reflection.';
  return 'Read the Arabic and translation together. Mark this ayah if this is where you stop today.';
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
  const [copyStatus, setCopyStatus] = useState('');
  const href = `/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`;
  const english = ayah.translations.en ?? '';
  const malay = ayah.translations.ms ?? '';
  const showTranslation = mode !== 'memorise';
  const showEnglish = showTranslation && (preferences.languageMode === 'both' || preferences.languageMode === 'en');
  const showMalay = showTranslation && (preferences.languageMode === 'both' || preferences.languageMode === 'ms');
  const showTransliteration = mode !== 'memorise' && preferences.showTransliteration && ayah.transliteration;
  const showTafseer = mode === 'study' && preferences.showTafseer && Boolean(tafseer);

  async function handleCopyAyah() {
    const copied = await copyText([
      `${surahTitle} ${ayah.key}`,
      ayah.arabic,
      english ? `English: ${english}` : '',
      malay ? `Malay: ${malay}` : '',
      `NOOR: ${href}`
    ].filter(Boolean).join('\n\n'));

    setCopyStatus(copied ? 'Ayah copied.' : 'Copy unavailable. Please select the text manually.');
    window.setTimeout(() => setCopyStatus(''), 1600);
  }

  async function handleCopyReference() {
    const copied = await copyText(`${surahTitle} ${ayah.key}`);
    setCopyStatus(copied ? 'Reference copied.' : 'Copy unavailable.');
    window.setTimeout(() => setCopyStatus(''), 1600);
  }

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

        <p className="noor-reader-mode-helper">{getModeHelper(mode)}</p>

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
            <strong>English:</strong> {english}
          </p>
        ) : null}

        {showMalay ? (
          <p className="noor-translation">
            <strong>Malay:</strong> {malay}
          </p>
        ) : null}

        {mode === 'memorise' ? (
          <div className="noor-study-note">
            <strong>Memorise focus:</strong> translation and tafseer are hidden here to reduce distraction.
            Switch to Read or Study when you want to review the meaning.
          </div>
        ) : null}

        {showTafseer && tafseer ? (
          <TafseerUnderstandingPanel
            ayah={ayah}
            tafseer={tafseer}
            surahTitle={surahTitle}
          />
        ) : null}

        {mode !== 'study' && tafseer ? (
          <p className="noor-muted noor-small">Tip: switch to Study mode to read the tafseer note for this ayah.</p>
        ) : null}

        <div className="noor-card-actions noor-ayah-actions" style={{ marginTop: 14 }}>
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
          <button className="noor-button secondary" type="button" onClick={handleCopyReference}>Copy reference</button>
          <a className="noor-button secondary" href="/studio">Create share card</a>
        </div>

        {copyStatus ? <p className="noor-copy-status">{copyStatus}</p> : null}
      </NoorCard>
    </div>
  );
}
