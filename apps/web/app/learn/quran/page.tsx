import { getSurahIndex } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';

export default async function QuranIndexPage() {
  const surahs = await getSurahIndex();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Quran"
        title="Surah index"
        subtitle="Loaded through the NOOR data resolver. In Sprint 2 this uses mock fallback first, and can later switch to CDN mode."
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
