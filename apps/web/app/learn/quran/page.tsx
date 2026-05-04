import { getSurahIndex } from '@noor/data';
import { PageHeader } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function QuranIndexPage() {
  const contentSource = await getServerNoorContentSource();
  const surahs = await getSurahIndex({ source: contentSource });

  return (
    <main className="noor-page noor-learning-page">
      <PageHeader
        kicker="Quran reader"
        title="Read with clear navigation."
        subtitle="Choose a Surah, jump by reference, or open the reader and use the floating Surah/Ayah navigator."
      />

      <section className="noor-learning-intro" aria-label="Quran reading start">
        <div>
          <span className="noor-kicker">Recommended start</span>
          <h2>Open the reader, then navigate by Surah and Ayah.</h2>
          <p>
            The reading page should stay calm. Controls should help the user move, not compete with the Quran text.
          </p>
        </div>
        <a className="noor-button primary" href="/learn/quran/1">Open Al-Fatihah</a>
      </section>

      <section className="noor-learning-list" aria-label="Quran navigation choices">
        <details className="noor-learning-section" open>
          <summary>
            <span className="noor-learning-icon" aria-hidden="true">📖</span>
            <span className="noor-learning-summary-main">
              <strong>Continue or begin</strong>
              <span>Start with Al-Fatihah, open a known reference, or continue your current reading path.</span>
              <span className="noor-learning-preview">
                <em>Al-Fatihah</em>
                <em>32:15</em>
                <em>55:71</em>
              </span>
            </span>
            <span className="noor-learning-chevron" aria-hidden="true">▸</span>
          </summary>
          <div className="noor-learning-body">
            <h3>Quick references</h3>
            <p>Use these to test the new reader navigation behaviour.</p>
            <div className="noor-card-actions">
              <a className="noor-button secondary" href="/learn/quran/1">Al-Fatihah</a>
              <a className="noor-button secondary" href="/learn/quran/32#ayah-15">As-Sajdah 32:15</a>
              <a className="noor-button secondary" href="/learn/quran/55#ayah-71">Ar-Rahman 55:71</a>
            </div>
          </div>
        </details>

        <details className="noor-learning-section">
          <summary>
            <span className="noor-learning-icon" aria-hidden="true">🎚️</span>
            <span className="noor-learning-summary-main">
              <strong>Reader modes</strong>
              <span>Choose how you want to read before opening the full Surah experience.</span>
              <span className="noor-learning-preview">
                <em>Read</em>
                <em>Study</em>
                <em>Memorise</em>
              </span>
            </span>
            <span className="noor-learning-chevron" aria-hidden="true">▸</span>
          </summary>
          <div className="noor-learning-body">
            <h3>One reader, three intentions</h3>
            <p>
              Read mode reduces friction. Study mode opens understanding. Memorise mode gives more space to the Arabic text.
            </p>
          </div>
        </details>

        <details className="noor-learning-section">
          <summary>
            <span className="noor-learning-icon" aria-hidden="true">🗂️</span>
            <span className="noor-learning-summary-main">
              <strong>Surah list</strong>
              <span>Open the Surah list only when you need to browse all Surahs.</span>
              <span className="noor-learning-preview">
                <em>{surahs.length} Surahs</em>
                <em>Revelation</em>
                <em>Ayah count</em>
              </span>
            </span>
            <span className="noor-learning-chevron" aria-hidden="true">▸</span>
          </summary>
          <div className="noor-learning-body">
            <div className="noor-surah-list-clean">
              {surahs.map((surah) => (
                <a className="noor-surah-row-clean" href={`/learn/quran/${surah.number}`} key={surah.number}>
                  <span className="noor-surah-number">{String(surah.number).padStart(3, '0')}</span>
                  <span className="noor-surah-name">
                    <strong>{surah.nameTransliteration}</strong>
                    <small>{surah.nameEnglish} · {surah.revelation} · {surah.ayahCount} ayat</small>
                  </span>
                  <span className="noor-surah-arabic">{surah.nameArabic}</span>
                </a>
              ))}
            </div>
          </div>
        </details>
      </section>
    </main>
  );
}
