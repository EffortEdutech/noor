import { DailyAyahCard, DailyHadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getDailyNoorContent, getFeaturedJourney } from '@noor/data';
import { ContinueJourneyCard } from '../../components/ContinueJourneyCard';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';

export default async function TodayPage() {
  const [daily, featuredJourney] = await Promise.all([
    getDailyNoorContent(),
    getFeaturedJourney()
  ]);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Today with NOOR"
        title="Assalamualaikum 🌙"
        subtitle="A gentle daily path: continue reading, continue a guided journey, save one light, and carry one reminder into your day."
      />

      <section className="noor-grid">
        <ContinueReadingCard />
        <ContinueJourneyCard fallbackJourney={featuredJourney} />
      </section>

      <section className="noor-grid">
        <NoorCard variant="gold">
          <div className="noor-row">
            <div>
              <span className="noor-kicker">Your light today</span>
              <h2 style={{ margin: '8px 0 0' }}>3 small steps</h2>
            </div>
            <span className="noor-badge emerald">Sprint 5</span>
          </div>
          <p className="noor-subtitle" style={{ marginTop: 12 }}>
            Read one ayah, continue one journey step, and save one reminder so NOOR can guide your next visit.
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
          <span className="noor-badge gold">Journey</span>
          <h3>Open guided paths</h3>
          <p className="noor-subtitle">Follow small structured steps for Quran, Hadith and reflection.</p>
          <a className="noor-button secondary" href="/journeys">Open Journeys</a>
        </NoorCard>

        <NoorCard className="noor-link-card">
          <span className="noor-badge gold">Library</span>
          <h3>Review saved light</h3>
          <p className="noor-subtitle">Open your locally saved bookmarks, journey progress and reading history.</p>
          <a className="noor-button secondary" href="/library">Open Library</a>
        </NoorCard>
      </section>
    </main>
  );
}
