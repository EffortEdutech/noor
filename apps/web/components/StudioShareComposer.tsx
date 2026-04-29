'use client';

import { DEMO_HADITH_ITEMS, DEMO_SURAH_CONTENT, type BookmarkItem } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { useEffect, useMemo, useState } from 'react';
import { readBookmarks } from '../lib/local-store';
import {
  buildNoorShareCaption,
  buildNoorShareSvg,
  copyToClipboard,
  downloadSvgFile,
  downloadTextFile,
  getNoorShareFilename,
  type NoorSharePlatform,
  type NoorShareSource,
  type NoorShareTheme
} from '../lib/studio-share';

type StudioSourceOption = {
  id: string;
  label: string;
  helper: string;
  source: NoorShareSource;
};

const PLATFORM_OPTIONS: { id: NoorSharePlatform; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' }
];

const THEME_OPTIONS: { id: NoorShareTheme; label: string; helper: string }[] = [
  { id: 'noor-gold', label: 'NOOR Gold', helper: 'Dark card with gold accent' },
  { id: 'emerald-night', label: 'Emerald Night', helper: 'Dark card with green accent' },
  { id: 'paper-light', label: 'Paper Light', helper: 'Soft printable reminder' }
];

function getDemoAyahSource(): NoorShareSource {
  const ayah = DEMO_SURAH_CONTENT[1].ayahs[0];

  return {
    type: 'ayah',
    title: 'In the name of Allah',
    reference: ayah.key,
    body: ayah.arabic,
    translation: ayah.translations.en,
    sourceLabel: 'Demo Quran content'
  };
}

function getDemoHadithSource(): NoorShareSource {
  const hadith = DEMO_HADITH_ITEMS['demo-nawawi'][0];

  return {
    type: 'hadith',
    title: `Hadith ${hadith.number}`,
    reference: hadith.sourceLabel,
    body: hadith.translations.en ?? hadith.translations.ms ?? '',
    translation: hadith.narrator ? `Narrator: ${hadith.narrator}` : undefined,
    sourceLabel: 'Demo Hadith content'
  };
}

function bookmarkToSource(bookmark: BookmarkItem): NoorShareSource {
  return {
    type: 'bookmark',
    title: bookmark.title,
    reference: bookmark.reference,
    body: `Saved from your NOOR Library${bookmark.href ? ` · ${bookmark.href}` : ''}`,
    sourceLabel: `Saved locally on ${new Date(bookmark.createdAt).toLocaleDateString()}`
  };
}

export function StudioShareComposer() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('daily-ayah');
  const [theme, setTheme] = useState<NoorShareTheme>('noor-gold');
  const [platform, setPlatform] = useState<NoorSharePlatform>('whatsapp');
  const [note, setNote] = useState('May this reminder bring light to your day.');
  const [manualTitle, setManualTitle] = useState('A gentle reminder');
  const [manualReference, setManualReference] = useState('NOOR Reflection');
  const [manualBody, setManualBody] = useState('Write your short reminder here.');
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    function refreshBookmarks() {
      setBookmarks(readBookmarks());
    }

    refreshBookmarks();

    window.addEventListener('noor:bookmarks-updated', refreshBookmarks);
    window.addEventListener('storage', refreshBookmarks);

    return () => {
      window.removeEventListener('noor:bookmarks-updated', refreshBookmarks);
      window.removeEventListener('storage', refreshBookmarks);
    };
  }, []);

  const sourceOptions = useMemo<StudioSourceOption[]>(() => {
    const bookmarkOptions = bookmarks.slice(0, 8).map((bookmark) => ({
      id: `bookmark-${bookmark.id}`,
      label: bookmark.title,
      helper: `${bookmark.type} · ${bookmark.reference}`,
      source: bookmarkToSource(bookmark)
    }));

    return [
      {
        id: 'daily-ayah',
        label: 'Daily Ayah',
        helper: 'Use the demo daily ayah as a share card source',
        source: getDemoAyahSource()
      },
      {
        id: 'daily-hadith',
        label: 'Daily Hadith',
        helper: 'Use the demo hadith as a share card source',
        source: getDemoHadithSource()
      },
      ...bookmarkOptions,
      {
        id: 'manual',
        label: 'Manual Reminder',
        helper: 'Write your own reminder text',
        source: {
          type: 'manual',
          title: manualTitle,
          reference: manualReference,
          body: manualBody,
          sourceLabel: 'Manual NOOR Studio reminder'
        }
      }
    ];
  }, [bookmarks, manualBody, manualReference, manualTitle]);

  const selectedOption = sourceOptions.find((option) => option.id === selectedSourceId) ?? sourceOptions[0];
  const selectedSource = selectedOption.source;
  const caption = buildNoorShareCaption(selectedSource, { note, platform });
  const svg = buildNoorShareSvg(selectedSource, theme, note);

  async function handleCopyCaption() {
    const copied = await copyToClipboard(caption);
    setCopyStatus(copied ? 'Caption copied.' : 'Copy failed. You can still select and copy manually.');
  }

  async function handleNativeShare() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: selectedSource.title,
          text: caption
        });
        setCopyStatus('Shared with your device share sheet.');
        return;
      } catch {
        // User cancelled or the device rejected the share request.
      }
    }

    await handleCopyCaption();
  }

  return (
    <div className="noor-stack">
      <section className="noor-grid">
        <NoorCard variant="soft">
          <span className="noor-kicker">1 · Choose source</span>

          <label className="noor-form-field" style={{ marginTop: 12 }}>
            <span className="noor-muted">Reminder source</span>
            <select
              className="noor-input"
              value={selectedSourceId}
              onChange={(event) => setSelectedSourceId(event.target.value)}
            >
              {sourceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <p className="noor-subtitle" style={{ marginTop: 10 }}>
            {selectedOption.helper}
          </p>

          {selectedSourceId === 'manual' ? (
            <div className="noor-stack" style={{ marginTop: 14 }}>
              <label className="noor-form-field">
                <span className="noor-muted">Title</span>
                <input className="noor-input" value={manualTitle} onChange={(event) => setManualTitle(event.target.value)} />
              </label>
              <label className="noor-form-field">
                <span className="noor-muted">Reference</span>
                <input className="noor-input" value={manualReference} onChange={(event) => setManualReference(event.target.value)} />
              </label>
              <label className="noor-form-field">
                <span className="noor-muted">Reminder body</span>
                <textarea className="noor-input" rows={5} value={manualBody} onChange={(event) => setManualBody(event.target.value)} />
              </label>
            </div>
          ) : null}
        </NoorCard>

        <NoorCard variant="soft">
          <span className="noor-kicker">2 · Format</span>

          <div className="noor-stack" style={{ marginTop: 12 }}>
            <label className="noor-form-field">
              <span className="noor-muted">Card theme</span>
              <select className="noor-input" value={theme} onChange={(event) => setTheme(event.target.value as NoorShareTheme)}>
                {THEME_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} — {option.helper}
                  </option>
                ))}
              </select>
            </label>

            <label className="noor-form-field">
              <span className="noor-muted">Caption target</span>
              <select className="noor-input" value={platform} onChange={(event) => setPlatform(event.target.value as NoorSharePlatform)}>
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="noor-form-field">
              <span className="noor-muted">Short personal note</span>
              <textarea className="noor-input" rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
            </label>
          </div>
        </NoorCard>
      </section>

      <section className="noor-grid">
        <NoorCard variant={theme === 'paper-light' ? 'soft' : 'gold'} className="noor-link-card">
          <div className="noor-row">
            <span className="noor-badge emerald">{selectedSource.type}</span>
            <span className="noor-reference">{selectedSource.reference}</span>
          </div>

          <div>
            <h2 style={{ margin: '0 0 10px' }}>{selectedSource.title}</h2>
            <p className={selectedSource.body.match(/[\u0600-\u06FF]/) ? 'noor-arabic small' : 'noor-translation'}>
              {selectedSource.body}
            </p>
          </div>

          {selectedSource.translation ? <p className="noor-subtitle">{selectedSource.translation}</p> : null}
          {note.trim() ? <p className="noor-subtitle">{note}</p> : null}

          <div className="noor-row">
            <span className="noor-badge gold">Preview</span>
            <span className="noor-muted noor-small">{selectedSource.sourceLabel}</span>
          </div>
        </NoorCard>

        <NoorCard>
          <span className="noor-kicker">3 · Export</span>
          <p className="noor-subtitle" style={{ marginTop: 10 }}>
            Copy a ready caption, open your device share sheet, or download an SVG card. SVG keeps the app zero-budget and dependency-free.
          </p>

          <div className="noor-card-actions" style={{ marginTop: 16 }}>
            <button className="noor-button" type="button" onClick={handleCopyCaption}>
              Copy caption
            </button>
            <button className="noor-button secondary" type="button" onClick={handleNativeShare}>
              Share
            </button>
            <button
              className="noor-button secondary"
              type="button"
              onClick={() => downloadSvgFile(getNoorShareFilename(selectedSource, 'svg'), svg)}
            >
              Download SVG
            </button>
            <button
              className="noor-button secondary"
              type="button"
              onClick={() => downloadTextFile(getNoorShareFilename(selectedSource, 'txt'), caption)}
            >
              Download caption
            </button>
          </div>

          {copyStatus ? <p className="noor-subtitle" style={{ marginTop: 12 }}>{copyStatus}</p> : null}

          <div className="noor-divider" />

          <label className="noor-form-field">
            <span className="noor-muted">Caption preview</span>
            <textarea className="noor-input" rows={10} readOnly value={caption} />
          </label>
        </NoorCard>
      </section>

      <NoorCard variant="soft">
        <span className="noor-kicker">Safety note</span>
        <p className="noor-subtitle" style={{ marginTop: 8 }}>
          NOOR Studio formats content for sharing. It should preserve verified references and avoid generating religious rulings.
          Future versions can add approved templates, citations, and reviewer-controlled reminder packs.
        </p>
      </NoorCard>
    </div>
  );
}
