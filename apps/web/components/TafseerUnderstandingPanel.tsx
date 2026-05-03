'use client';

import type { QuranAyah, TafseerEntry } from '@noor/content';
import { BookmarkButton } from '@noor/ui';

function buildTafseerHref(tafseer: TafseerEntry) {
  const params = new URLSearchParams({
    book: tafseer.bookId,
    surah: String(tafseer.surah)
  });

  return `/learn/tafseer?${params.toString()}`;
}

export function TafseerUnderstandingPanel({
  ayah,
  tafseer,
  surahTitle
}: {
  ayah: QuranAyah;
  tafseer: TafseerEntry;
  surahTitle: string;
}) {
  const tafseerHref = buildTafseerHref(tafseer);
  const ayahReference = `${surahTitle} ${ayah.key}`;

  return (
    <section className="noor-card is-soft noor-tafseer-understanding-panel" aria-label={`Tafseer understanding panel for ${ayahReference}`}>
      <div className="noor-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <span className="noor-badge gold">Understand this ayah</span>
          <h3>{tafseer.title}</h3>
        </div>
        <span className="noor-reference">{tafseer.surah}:{tafseer.fromAyah}-{tafseer.toAyah}</span>
      </div>

      <div className="noor-understanding-flow" aria-label="Read, understand, respond workflow">
        <div>
          <strong>Read</strong>
          <span>{ayahReference}</span>
        </div>
        <div>
          <strong>Understand</strong>
          <span>{tafseer.sourceLabel}</span>
        </div>
        <div>
          <strong>Respond</strong>
          <span>One action today</span>
        </div>
      </div>

      <p className="noor-tafseer-body">{tafseer.body}</p>

      <div className="noor-reflection-prompt">
        <strong>Reflection:</strong> What is one action, du‘a, correction, or gratitude this ayah invites from me today?
      </div>

      <div className="noor-card-actions" style={{ marginTop: 14 }}>
        <BookmarkButton
          item={{
            id: `tafseer-${tafseer.id}-${ayah.key}`,
            type: 'tafseer',
            title: tafseer.title,
            reference: `${tafseer.sourceLabel} · ${tafseer.surah}:${tafseer.fromAyah}-${tafseer.toAyah}`,
            href: tafseerHref
          }}
        />
        <a className="noor-button secondary" href={tafseerHref}>Open tafseer library</a>
        <a className="noor-button secondary" href={`/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`}>Return to ayah</a>
      </div>
    </section>
  );
}
