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
        kicker="Quran reader"
        title="Read with presence."
        subtitle="Choose a Surah and read in a cleaner flow. You can mark your current ayah, study the meaning, or use memorisation focus inside the reader."
      />

      <section className="noor-hero-grid">
        <NoorCard variant="gold" className="noor-link-card">
          <span className="noor-badge emerald">Recommended start</span>
          <h2>Al-Fatihah</h2>
          <p className="noor-subtitle">
            Start with the opening Surah. Read, study, memorise, save your place and return from Today.
          </p>
          <a className="noor-button" href="/learn/quran/1">Open Al-Fatihah</a>
        </NoorCard>

        <NoorCard variant="soft">
          <span className="noor-kicker">Reader modes</span>
          <div className="noor-reader-mode-preview">
            <span className="noor-badge">Read</span>
            <span className="noor-badge">Study</span>
            <span className="noor-badge">Memorise</span>
          </div>
          <p className="noor-subtitle">
            The reader is now organised around the user’s intention instead of only showing content rows.
          </p>
        </NoorCard>
      </section>

      <section className="noor-section-heading">
        <div>
          <span className="noor-kicker">Surah index</span>
          <h2>Choose where to begin</h2>
        </div>
        <span className="noor-badge gold">{surahs.length} Surahs</span>
      </section>

      <section className="noor-surah-grid">
        {surahs.map((surah) => (
          <a href={`/learn/quran/${surah.number}`} key={surah.number}>
            <NoorCard className="noor-surah-card noor-link-card">
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
