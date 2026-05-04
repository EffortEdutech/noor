import { DailyAyahCard, DailyHadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getDailyNoorContent, getFeaturedJourney } from '@noor/data';
import { ContinueGuidancePathCard } from '../../components/ContinueGuidancePathCard';
import { ContinueJourneyCard } from '../../components/ContinueJourneyCard';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import { DailyGuidedSessionCard } from '../../components/DailyGuidedSessionCard';
import { NoorHomeDashboard } from '../../components/NoorHomeDashboard';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';
import { ReflectionNotesPanel } from '../../components/ReflectionNotesPanel';

export default async function TodayPage() {
  const [daily, featuredJourney] = await Promise.all([
    getDailyNoorContent(),
    getFeaturedJourney()
  ]);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Today with NOOR"
        title="Continue your journey with the light."
        subtitle="Your home dashboard now connects reading progress, guidance topics, reflection notes and daily sessions into one calm path."
      />

      <NoorHomeDashboard />

      <section className="noor-hero-grid">
        <ContinueReadingCard />
        <ContinueGuidancePathCard />
      </section>

      <DailyGuidedSessionCard />

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

      <ReflectionNotesPanel limit={3} />

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
