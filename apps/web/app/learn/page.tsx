import { NoorCard, PageHeader } from '@noor/ui';

const modules = [
  {
    title: 'Quran',
    badge: 'Read + Study',
    href: '/learn/quran',
    body: 'Surah index, Arabic text, transliteration, English and Malay translations.'
  },
  {
    title: 'Tafseer',
    badge: 'Understand',
    href: '/learn/tafseer',
    body: 'Resolver-ready tafseer entries, starting with demo explanations linked to ayat.'
  },
  {
    title: 'Hadith',
    badge: 'Sunnah',
    href: '/learn/hadith',
    body: 'Collection and item resolver with sample Hadith for Sprint 2 testing.'
  },
  {
    title: 'Journeys',
    badge: 'Guided Path',
    href: '/journeys',
    body: 'Small structured learning paths that combine Quran, Hadith, reflection and action.'
  }
];

export default function LearnPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Learn"
        title="Read with understanding."
        subtitle="NOOR separates user experience from content delivery so Quran, Tafseer, Hadith and guided journeys can grow without making the app heavy."
      />
      <section className="noor-grid">
        {modules.map((module) => (
          <a href={module.href} key={module.title}>
            <NoorCard className="noor-link-card">
              <span className="noor-badge gold">{module.badge}</span>
              <h2>{module.title}</h2>
              <p className="noor-subtitle">{module.body}</p>
            </NoorCard>
          </a>
        ))}
      </section>
    </main>
  );
}
