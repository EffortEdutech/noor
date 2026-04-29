import type { HadithItem } from '@noor/content';
import { BookmarkButton } from './BookmarkButton';
import { NoorCard } from './NoorCard';

export function HadithCard({ hadith }: { hadith: HadithItem }) {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge emerald">Hadith {hadith.number}</span>
        <span className="noor-reference">{hadith.sourceLabel}</span>
      </div>
      {hadith.narrator ? <p className="noor-muted">Narrator: {hadith.narrator}</p> : null}
      {hadith.arabic ? <div className="noor-arabic small">{hadith.arabic}</div> : null}
      <p className="noor-translation">{hadith.translations.en}</p>
      <p className="noor-subtitle">{hadith.translations.ms}</p>
      <div className="noor-row" style={{ marginTop: 14 }}>
        <BookmarkButton
          item={{
            id: `hadith-${hadith.id}`,
            type: 'hadith',
            title: hadith.translations.en ?? `Hadith ${hadith.number}`,
            reference: hadith.sourceLabel,
            href: '/learn/hadith'
          }}
        />
        <a className="noor-button" href="/studio">Share later</a>
      </div>
    </NoorCard>
  );
}
