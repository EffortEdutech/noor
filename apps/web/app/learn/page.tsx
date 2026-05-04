import { PageHeader } from '@noor/ui';

const learningSections = [
  {
    icon: '📖',
    title: 'Quran Reading',
    description: 'Start with the Quran text. Read calmly, jump by reference, and continue one Surah at a time.',
    previewItems: ['Surah', 'Ayah', 'Read mode', 'Continue'],
    href: '/learn/quran',
    action: 'Open Quran reader',
    bodyTitle: 'Begin with the foundation',
    body: 'This is the primary learning path. The Quran reader should feel clean, focused and easy to navigate. Use it when the user knows a Surah, an ayah reference, or simply wants to read today.'
  },
  {
    icon: '🕯️',
    title: 'Tafseer Understanding',
    description: 'Open meaning only when the user wants depth. Tafseer should support the ayah, not crowd the reader.',
    previewItems: ['Meaning', 'Context', 'Range notes'],
    href: '/learn/tafseer',
    action: 'Open Tafseer',
    bodyTitle: 'Understand after reading',
    body: 'Tafseer belongs after the user has seen the ayah. It should explain what the ayah means, what range it covers, and how it connects to other guidance.'
  },
  {
    icon: '🌿',
    title: 'Hadith Guidance',
    description: 'Connect prophetic guidance to Quranic topics, not as isolated database records.',
    previewItems: ['Collection', 'Chapter', 'Topic', 'Practice'],
    href: '/learn/hadith',
    action: 'Open Hadith',
    bodyTitle: 'Learn how guidance is practised',
    body: 'Hadith should be presented as guidance, with source reference and practical connection. Users should see why the hadith matters and what it helps them practise.'
  },
  {
    icon: '🧭',
    title: 'Guided Journeys',
    description: 'Small paths that combine Quran, Tafseer, Hadith, reflection and one action.',
    previewItems: ['Step by step', 'Topic', 'Reflection'],
    href: '/journeys',
    action: 'Open Journeys',
    bodyTitle: 'Learn one step at a time',
    body: 'Journeys should be used when the user wants learning structure. One topic, one short session, one reflection, one action.'
  }
];

export default function LearnPage() {
  return (
    <main className="noor-page noor-learning-page">
      <PageHeader
        kicker="Learn"
        title="Choose one learning path."
        subtitle="NOOR should not show everything at once. Open one subject, learn one step, then continue."
      />

      <section className="noor-learning-intro" aria-label="Learning direction">
        <div>
          <span className="noor-kicker">Recommended</span>
          <h2>Start with Quran, then open understanding only when needed.</h2>
          <p>
            This page is a learning hub. It shows the structure first, and keeps detail hidden until you choose a section.
          </p>
        </div>
        <a className="noor-button primary" href="/learn/quran">Start Quran reading</a>
      </section>

      <section className="noor-learning-list" aria-label="NOOR learning paths">
        {learningSections.map((section, index) => (
          <details className="noor-learning-section" key={section.title} open={index === 0}>
            <summary>
              <span className="noor-learning-icon" aria-hidden="true">{section.icon}</span>
              <span className="noor-learning-summary-main">
                <strong>{section.title}</strong>
                <span>{section.description}</span>
                <span className="noor-learning-preview">
                  {section.previewItems.map((item) => (
                    <em key={item}>{item}</em>
                  ))}
                </span>
              </span>
              <span className="noor-learning-chevron" aria-hidden="true">▸</span>
            </summary>
            <div className="noor-learning-body">
              <h3>{section.bodyTitle}</h3>
              <p>{section.body}</p>
              <a className="noor-button secondary" href={section.href}>{section.action}</a>
            </div>
          </details>
        ))}
      </section>
    </main>
  );
}
