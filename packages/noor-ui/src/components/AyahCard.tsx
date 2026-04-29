import type { QuranAyah, TafseerEntry } from '@noor/content';
import { BookmarkButton } from './BookmarkButton';
import { NoorCard } from './NoorCard';

export function AyahCard({ ayah, tafseer }: { ayah: QuranAyah; tafseer?: TafseerEntry }) {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge emerald">Ayah {ayah.ayah}</span>
        <span className="noor-reference">{ayah.key}</span>
      </div>

      <div className="noor-arabic">{ayah.arabic}</div>

      {ayah.transliteration ? <p className="noor-muted">{ayah.transliteration}</p> : null}

      <p className="noor-translation"><strong>EN:</strong> {ayah.translations.en}</p>
      <p className="noor-translation"><strong>MS:</strong> {ayah.translations.ms}</p>

      {tafseer ? (
        <div className="noor-card is-soft" style={{ marginTop: 14 }}>
          <span className="noor-badge gold">Tafseer</span>
          <h3>{tafseer.title}</h3>
          <p className="noor-subtitle">{tafseer.body}</p>
        </div>
      ) : null}

      <div className="noor-row" style={{ marginTop: 14 }}>
        <BookmarkButton
          item={{
            id: `ayah-${ayah.key}`,
            type: 'ayah',
            title: ayah.translations.en ?? ayah.arabic,
            reference: ayah.key,
            href: `/learn/quran/${ayah.surah}`
          }}
        />
        <a className="noor-button" href="/studio">Share later</a>
      </div>
    </NoorCard>
  );
}
