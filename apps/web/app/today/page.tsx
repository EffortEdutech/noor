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
        title="Return to the light."
        subtitle="A calm daily path: continue your Quran reading, understand one reminder, save what touches the heart, and carry it into your day."
      />

      <section className="noor-hero-grid">
        <ContinueReadingCard />
        <NoorCard variant="soft" className="noor-intention-card">
          <span className="noor-badge gold">Today’s intention</span>
          <h2>Read a little. Understand a little. Act on one thing.</h2>
          <p className="noor-subtitle">
            NOOR is designed for a small consistent routine, not a heavy study session every time.
          </p>
          <div className="noor-card-actions">
            <a className="noor-button" href="/learn/quran">Open Quran</a>
            <a className="noor-button secondary" href="/explore">Find guidance</a>
          </div>
        </NoorCard>
      </section>

      <section className="noor-grid">
        <ContinueJourneyCard fallbackJourney={featuredJourney} />
        <ReadingProgressPanel />
      </section>

      <section className="noor-section-heading">
        <div>
          <span className="noor-kicker">Daily reminders</span>
          <h2>One ayah and one hadith for your day</h2>
        </div>
        <a className="noor-button secondary" href="/library">Open saved light</a>
      </section>

      <DailyAyahCard ayah={daily.ayah} />
      <DailyHadithCard hadith={daily.hadith} />

      <section className="noor-grid">
        <NoorCard className="noor-link-card">
          <span className="noor-badge emerald">Read</span>
          <h3>Quran reader</h3>
          <p className="noor-subtitle">Read with translation, study with tafseer, or switch to memorisation focus.</p>
          <a className="noor-button" href="/learn/quran/1">Start with Al-Fatihah</a>
        </NoorCard>

        <NoorCard className="noor-link-card">
          <span className="noor-badge gold">Understand</span>
          <h3>Tafseer support</h3>
          <p className="noor-subtitle">Use tafseer to understand the ayah while keeping the Quran as the centre.</p>
          <a className="noor-button secondary" href="/learn/tafseer">Open Tafseer</a>
        </NoorCard>

        <NoorCard className="noor-link-card">
          <span className="noor-badge emerald">Sunnah</span>
          <h3>Hadith guidance</h3>
          <p className="noor-subtitle">Read Hadith as practical guidance connected to daily reflection.</p>
          <a className="noor-button secondary" href="/learn/hadith">Open Hadith</a>
        </NoorCard>
      </section>
    </main>
  );
}
