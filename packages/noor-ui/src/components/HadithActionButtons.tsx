'use client';

import type { BookmarkItem } from '@noor/content';
import { useState } from 'react';
import { BookmarkButton } from './BookmarkButton';

type HadithActionButtonsProps = {
  bookmarkItem: Omit<BookmarkItem, 'createdAt'>;
  copyText: string;
  referenceText: string;
  topicHref?: string;
};

export function HadithActionButtons({ bookmarkItem, copyText, referenceText, topicHref }: HadithActionButtonsProps) {
  const [status, setStatus] = useState<string | null>(null);

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied`);
      window.setTimeout(() => setStatus(null), 1800);
    } catch {
      setStatus('Copy failed. Select the text manually.');
      window.setTimeout(() => setStatus(null), 2400);
    }
  }

  return (
    <div className="noor-hadith-actions">
      <div className="noor-card-actions">
        <BookmarkButton item={bookmarkItem} />
        <button className="noor-button secondary" type="button" onClick={() => copyToClipboard(copyText, 'Hadith')}>
          Copy Hadith
        </button>
        <button className="noor-button secondary" type="button" onClick={() => copyToClipboard(referenceText, 'Reference')}>
          Copy reference
        </button>
        {topicHref ? <a className="noor-button secondary" href={topicHref}>Explore topic</a> : null}
        <a className="noor-button secondary" href="/studio">Create share card</a>
      </div>
      {status ? <p className="noor-copy-status">{status}</p> : null}
    </div>
  );
}
