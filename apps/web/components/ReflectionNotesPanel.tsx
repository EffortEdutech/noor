'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useState } from 'react';
import {
  deleteReflectionNote,
  formatRelativeNoorDate,
  NOOR_REFLECTION_NOTES_EVENT,
  readReflectionNotes,
  type ReflectionNote
} from '../lib/local-store';

export function ReflectionNotesPanel({ limit }: { limit?: number }) {
  const [notes, setNotes] = useState<ReflectionNote[]>([]);

  function refresh() {
    setNotes(readReflectionNotes());
  }

  useEffect(() => {
    refresh();
    window.addEventListener(NOOR_REFLECTION_NOTES_EVENT, refresh);
    return () => window.removeEventListener(NOOR_REFLECTION_NOTES_EVENT, refresh);
  }, []);

  const visibleNotes = typeof limit === 'number' ? notes.slice(0, limit) : notes;

  return (
    <NoorCard className="noor-reflection-notes-panel">
      <div className="noor-row">
        <div>
          <span className="noor-badge emerald">Reflection notes</span>
          <h2>Your saved reflections</h2>
        </div>
        <span className="noor-reference">{notes.length} saved</span>
      </div>

      {visibleNotes.length === 0 ? (
        <p className="noor-subtitle">
          No reflection note yet. Open a guidance topic, read the path, then save one sincere response.
        </p>
      ) : (
        <div className="noor-reflection-note-list">
          {visibleNotes.map((item) => (
            <article key={item.id} className="noor-reflection-note-item">
              <div className="noor-row">
                <span className="noor-badge gold">{item.topicLabel}</span>
                <span className="noor-muted noor-small">{formatRelativeNoorDate(item.updatedAt)}</span>
              </div>
              <strong>{item.prompt}</strong>
              <p>{item.note}</p>
              {item.action ? <small>Action: {item.action}</small> : null}
              <div className="noor-card-actions">
                {item.sourceHref ? (
                  <a className="noor-button secondary" href={item.sourceHref}>
                    Reopen path
                  </a>
                ) : null}
                <button
                  className="noor-button secondary"
                  type="button"
                  onClick={() => {
                    deleteReflectionNote(item.id);
                    refresh();
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </NoorCard>
  );
}
