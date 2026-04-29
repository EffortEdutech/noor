import { DailyAyahCard, DailyHadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getDailyNoorContent } from '@noor/data';

export default async function TodayPage() {
  const daily = await getDailyNoorContent();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Today with NOOR"
        title="Assalamualaikum 🌙"
        subtitle="A gentle daily path: read, understand, remember, and carry one light into your day."
      />

      <NoorCard variant="gold">
        <div className="noor-row">
          <div>
            <span className="noor-kicker">Your light today</span>
            <h2 style={{ margin: '8px 0 0' }}>3 small steps</h2>
          </div>
          <span className="noor-badge emerald">Sprint 0–2</span>
        </div>
        <p className="noor-subtitle" style={{ marginTop: 12 }}>
          Continue with a daily ayah, a hadith reminder, and one guided reading action.
        </p>
      </NoorCard>

      <DailyAyahCard ayah={daily.ayah} />
      <DailyHadithCard hadith={daily.hadith} />

      <section className="noor-grid">
        <NoorCard className="noor-link-card">
          <span className="noor-badge emerald">Continue</span>
          <h3>Open Quran reader</h3>
          <p className="noor-subtitle">Start with Al-Fatihah and test the new resolver-driven reader.</p>
          <a className="noor-button" href="/learn/quran/1">Read Surah Al-Fatihah</a>
        </NoorCard>

        <NoorCard className="noor-link-card">
          <span className="noor-badge gold">Explore</span>
          <h3>Search across content</h3>
          <p className="noor-subtitle">Try demo search across Quran, Tafseer and Hadith.</p>
          <a className="noor-button secondary" href="/explore">Open Explore</a>
        </NoorCard>
      </section>
    </main>
  );
}
