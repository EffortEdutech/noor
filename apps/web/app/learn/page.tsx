import { NoorCard, PageHeader } from '@noor/ui';

const primaryPaths = [
  {
    title: 'Read Quran',
    badge: 'Start here',
    href: '/learn/quran',
    body: 'Open the Surah index, choose a Surah, and read with translation, tafseer support and local progress.'
  },
  {
    title: 'Understand with Tafseer',
    badge: 'Meaning',
    href: '/learn/tafseer',
    body: 'Use Tafseer to understand the meaning behind the ayat. The best experience is connected back to the Quran reader.'
  },
  {
    title: 'Learn from Hadith',
    badge: 'Sunnah',
    href: '/learn/hadith',
    body: 'Browse Hadith by book or chapter and save reminders that help you practise what you learn.'
  }
];

const guideCards = [
  {
    title: 'I want to read today',
    href: '/learn/quran/1',
    body: 'Begin with Al-Fatihah or continue from your saved reading point on the Today page.'
  },
  {
    title: 'I need guidance by topic',
    href: '/explore',
    body: 'Search mercy, patience, protection, intention, prayer, rizq or other topics across the content library.'
  },
  {
    title: 'I want a structured path',
    href: '/journeys',
    body: 'Follow small guided steps that combine Quran, Hadith, reflection and action.'
  }
];

export default function LearnPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Learn"
        title="Choose your path."
        subtitle="NOOR is centred on reading, understanding, remembering and returning. Start with Quran, then let Tafseer and Hadith support the journey."
      />

      <section className="noor-hero-grid">
        <NoorCard variant="gold" className="noor-link-card">
          <span className="noor-badge emerald">Recommended</span>
          <h2>Begin with Quran reading</h2>
          <p className="noor-subtitle">
            The Quran reader is the heart of NOOR. Read comfortably, study meaning, mark your current ayah and save reminders.
          </p>
          <a className="noor-button" href="/learn/quran">Open Quran reader</a>
        </NoorCard>

        <NoorCard variant="soft">
          <span className="noor-kicker">How NOOR should feel</span>
          <h2>Not a database. A companion.</h2>
          <p className="noor-subtitle">
            Each section should answer a real user need: what to read, what it means, how to practise it, and how to return tomorrow.
          </p>
        </NoorCard>
      </section>

      <section className="noor-grid">
        {primaryPaths.map((module) => (
          <a href={module.href} key={module.title}>
            <NoorCard className="noor-link-card">
              <span className="noor-badge gold">{module.badge}</span>
              <h2>{module.title}</h2>
              <p className="noor-subtitle">{module.body}</p>
            </NoorCard>
          </a>
        ))}
      </section>

      <section className="noor-section-heading">
        <div>
          <span className="noor-kicker">Helpful starting points</span>
          <h2>What do you want to do now?</h2>
        </div>
      </section>

      <section className="noor-grid">
        {guideCards.map((card) => (
          <a href={card.href} key={card.title}>
            <NoorCard variant="soft" className="noor-link-card">
              <h3>{card.title}</h3>
              <p className="noor-subtitle">{card.body}</p>
            </NoorCard>
          </a>
        ))}
      </section>
    </main>
  );
}
