import type { QuranAyah } from '@noor/content';
import { BookmarkButton } from './BookmarkButton';
import { NoorCard } from './NoorCard';

export function DailyAyahCard({ ayah }: { ayah: QuranAyah }) {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Daily ayah</span>
        <span className="noor-reference">{ayah.key}</span>
      </div>
      <div className="noor-arabic">{ayah.arabic}</div>
      <p className="noor-translation">{ayah.translations.en}</p>
      <p className="noor-subtitle">{ayah.translations.ms}</p>
      <div className="noor-row" style={{ marginTop: 14 }}>
        <a className="noor-button" href={`/learn/quran/${ayah.surah}`}>Read</a>
        <BookmarkButton
          item={{
            id: `ayah-${ayah.key}`,
            type: 'ayah',
            title: ayah.translations.en ?? ayah.arabic,
            reference: ayah.key,
            href: `/learn/quran/${ayah.surah}`
          }}
        />
      </div>
    </NoorCard>
  );
}
