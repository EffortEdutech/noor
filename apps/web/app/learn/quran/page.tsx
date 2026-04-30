import { getSurahIndex } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function QuranIndexPage() {
  const contentSource = await getServerNoorContentSource();
  const surahs = await getSurahIndex({ source: contentSource });

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Quran"
        title="Surah index"
        subtitle={`Loaded through the NOOR data resolver. Runtime content source: ${contentSource}.`}
      />

      <section className="noor-grid">
        {surahs.map((surah) => (
          <a href={`/learn/quran/${surah.number}`} key={surah.number}>
            <NoorCard className="noor-link-card">
              <div className="noor-row">
                <span className="noor-badge emerald">{surah.number}</span>
                <span className="noor-reference">{surah.ayahCount} ayat</span>
              </div>
              <div className="noor-arabic small">{surah.nameArabic}</div>
              <h2>{surah.nameTransliteration}</h2>
              <p className="noor-subtitle">{surah.nameEnglish} · {surah.revelation}</p>
            </NoorCard>
          </a>
        ))}
      </section>
    </main>
  );
}
