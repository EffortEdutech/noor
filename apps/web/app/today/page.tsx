import { DailyAyahCard, DailyHadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getDailyNoorContent } from '@noor/data';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';

export default async function TodayPage() {
  const daily = await getDailyNoorContent();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Today with NOOR"
        title="Assalamualaikum 🌙"
        subtitle="A gentle daily path: continue reading, save one light, and carry one reminder into your day."
      />

      <ContinueReadingCard />

      <section className="noor-grid">
        <NoorCard variant="gold">
          <div className="noor-row">
            <div>
              <span className="noor-kicker">Your light today</span>
              <h2 style={{ margin: '8px 0 0' }}>3 small steps</h2>
            </div>
            <span className="noor-badge emerald">Sprint 3</span>
          </div>
          <p className="noor-subtitle" style={{ marginTop: 12 }}>
            Read one ayah, reflect on one hadith, and mark your reading point so NOOR can guide your next visit.
          </p>
        </NoorCard>

        <ReadingProgressPanel />
      </section>

      <DailyAyahCard ayah={daily.ayah} />
      <DailyHadithCard hadith={daily.hadith} />

      <section className="noor-grid">
        <NoorCard className="noor-link-card">
          <span className="noor-badge emerald">Continue</span>
          <h3>Open Quran reader</h3>
          <p className="noor-subtitle">Mark any ayah as current reading progress.</p>
          <a className="noor-button" href="/learn/quran/1">Read Surah Al-Fatihah</a>
        </NoorCard>

        <NoorCard className="noor-link-card">
          <span className="noor-badge gold">Library</span>
          <h3>Review saved light</h3>
          <p className="noor-subtitle">Open your locally saved bookmarks and reading history.</p>
          <a className="noor-button secondary" href="/library">Open Library</a>
        </NoorCard>
      </section>
    </main>
  );
}
