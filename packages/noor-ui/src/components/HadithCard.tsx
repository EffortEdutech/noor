import type { HadithItem } from '@noor/content';
import { BookmarkButton } from './BookmarkButton';
import { NoorCard } from './NoorCard';

export function HadithCard({ hadith }: { hadith: HadithItem }) {
  return (
    <NoorCard className="noor-hadith-card">
      <div className="noor-row">
        <span className="noor-badge emerald">Hadith {hadith.number}</span>
        <span className="noor-reference">{hadith.sourceLabel}</span>
      </div>

      {hadith.book || hadith.chapter ? (
        <p className="noor-muted">
          {[hadith.book, hadith.chapter].filter(Boolean).join(' · ')}
        </p>
      ) : null}

      {hadith.narrator ? <p className="noor-muted">Narrated by {hadith.narrator}</p> : null}
      {hadith.arabic ? <div className="noor-arabic small noor-hadith-arabic">{hadith.arabic}</div> : null}

      {hadith.translations.en ? <p className="noor-translation">{hadith.translations.en}</p> : null}
      {hadith.translations.ms ? <p className="noor-subtitle">{hadith.translations.ms}</p> : null}

      {hadith.tags.length > 0 ? (
        <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
          {hadith.tags.slice(0, 4).map((tag) => (
            <span className="noor-badge" key={`${hadith.id}-${tag}`}>#{tag}</span>
          ))}
        </div>
      ) : null}

      <div className="noor-card-actions" style={{ marginTop: 14 }}>
        <BookmarkButton
          item={{
            id: `hadith-${hadith.id}`,
            type: 'hadith',
            title: hadith.translations.en ?? `Hadith ${hadith.number}`,
            reference: hadith.sourceLabel,
            href: '/learn/hadith'
          }}
        />
        <a className="noor-button secondary" href="/studio">Create share card</a>
      </div>
    </NoorCard>
  );
}
