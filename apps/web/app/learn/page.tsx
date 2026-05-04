const learningPaths = [
  {
    icon: '📖',
    title: 'Quran',
    description: 'Read the ayah first. Use Surah and Ayah navigation without losing the reading page.',
    href: '/learn/quran',
    action: 'Open Quran reader'
  },
  {
    icon: '🕯️',
    title: 'Tafseer',
    description: 'Open explanation after the ayah is clear. Tafseer supports understanding, not clutter.',
    href: '/learn/tafseer',
    action: 'Open Tafseer'
  },
  {
    icon: '🌿',
    title: 'Hadith',
    description: 'Connect Prophetic guidance to source, chapter, topic and practice.',
    href: '/learn/hadith',
    action: 'Open Hadith'
  },
  {
    icon: '🧭',
    title: 'Journeys',
    description: 'Follow one short guided path: Quran, understanding, reminder and action.',
    href: '/journeys',
    action: 'Open Journeys'
  }
];

export default function LearnPage() {
  return (
    <main className="noor-page noor-learning-page noor-learn-hub-page">
      <section className="noor-learn-hub-hero" aria-label="Learning hub">
        <div>
          <span className="noor-kicker">Learn</span>
          <h1>Choose one source. Learn one step.</h1>
          <p>
            NOOR should not force every source onto one screen. Start with Quran, then open Tafseer, Hadith or Journeys when you are ready.
          </p>
        </div>
        <a className="noor-button primary" href="/learn/quran">Start with Quran</a>
      </section>

      <section className="noor-learn-path-grid" aria-label="Learning paths">
        {learningPaths.map((path) => (
          <a className="noor-learn-path-card" href={path.href} key={path.title}>
            <span className="noor-learn-path-icon" aria-hidden="true">{path.icon}</span>
            <span className="noor-learn-path-copy">
              <strong>{path.title}</strong>
              <small>{path.description}</small>
              <em>{path.action}</em>
            </span>
          </a>
        ))}
      </section>
    </main>
  );
}
