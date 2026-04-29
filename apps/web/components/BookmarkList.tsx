'use client';

import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate } from '../lib/local-store';
import { useBookmarks } from '../lib/use-bookmarks';

export function BookmarkList() {
  const { bookmarks, remove } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <NoorCard>
        <div className="noor-row">
          <span className="noor-badge gold">Bookmarks</span>
          <span className="noor-reference">0 saved</span>
        </div>
        <p className="noor-subtitle" style={{ marginTop: 12 }}>
          No bookmarks yet. Open a Quran ayah, daily ayah, or hadith and tap Save.
        </p>
        <a className="noor-button" style={{ marginTop: 14 }} href="/learn/quran/1">Open Quran reader</a>
      </NoorCard>
    );
  }

  return (
    <div className="noor-stack">
      {bookmarks.map((item) => (
        <NoorCard key={item.id}>
          <div className="noor-row">
            <span className="noor-badge gold">{item.type}</span>
            <span className="noor-reference">{item.reference}</span>
          </div>
          <h3 style={{ marginBottom: 6 }}>{item.title}</h3>
          <p className="noor-subtitle">Saved {formatRelativeNoorDate(item.createdAt)}</p>
          <div className="noor-card-actions" style={{ marginTop: 14 }}>
            {item.href ? <a className="noor-button" href={item.href}>Open</a> : null}
            <button className="noor-button secondary" type="button" onClick={() => remove(item.id)}>
              Remove
            </button>
          </div>
        </NoorCard>
      ))}
    </div>
  );
}
