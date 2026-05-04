import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { KnowledgeSettingsPanel } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';
import { UniversalKnowledgeBar } from '../../components/UniversalKnowledgeBar';
import { GUIDANCE_TOPIC_DETAILS } from '../../lib/guidance-topics';

type ActionRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

function ActionRow({ icon, title, description, href, actionLabel }: ActionRowProps) {
  const rowContent = (
    <>
      <span style={S.rowIcon} aria-hidden="true">{icon}</span>
      <span style={S.rowCopy}>
        <strong style={S.rowTitle}>{title}</strong>
        <p style={S.rowDescription}>{description}</p>
      </span>
      <span style={S.rowAction}>{actionLabel}</span>
    </>
  );

  if (href.startsWith('#')) {
    return <a href={href} style={S.actionRow}>{rowContent}</a>;
  }

  return <Link href={href} style={S.actionRow}>{rowContent}</Link>;
}

export default function ExplorePage() {
  return (
    <main className="noor-page noor-learning-page" style={S.page}>
      <header style={S.header}>
        <p style={S.kicker}>Explore</p>
        <h1 style={S.title}>Find one guidance path.</h1>
        <p style={S.subtitle}>
          Choose one starting point. NOOR will keep the details collapsed until you decide what to read next.
        </p>
      </header>

      <KnowledgeSettingsPanel
        title="Start here"
        subtitle="Open only the section you need. Each section explains its purpose before showing the next layer."
        sections={[
          {
            id: 'explore-start',
            icon: '🧭',
            title: 'Choose how you want to begin',
            summary: 'Use this when you are not sure whether to start with Quran, Tafseer, Hadith or a topic.',
            chips: ['Recommended', 'One path at a time'],
            children: (
              <div style={S.rowList}>
                <ActionRow
                  icon="صبر"
                  title="Open a guided topic"
                  description="Choose this when you know the need, such as patience, mercy, rizq, prayer or repentance, but you do not know which source to open first."
                  href="/explore/patience"
                  actionLabel="Start"
                />
                <ActionRow
                  icon="2:255"
                  title="Jump to a known reference"
                  description="Choose this when you already know the surah, ayah, topic word or hadith keyword you want to search."
                  href="#explore-search"
                  actionLabel="Search"
                />
                <ActionRow
                  icon="☰"
                  title="Browse the guidance library"
                  description="Choose this when you want to review available themes quietly and open only one learning path at a time."
                  href="#explore-topics"
                  actionLabel="Browse"
                />
              </div>
            )
          },
          {
            id: 'explore-topics',
            icon: '🌿',
            title: 'Browse guided topics',
            summary: 'Each topic is delivered in layers: need, Quran foundation, tafseer, hadith, reflection and continuation.',
            chips: ['Topic by topic', 'Layered learning'],
            children: (
              <div style={S.rowList}>
                {GUIDANCE_TOPIC_DETAILS.map((topic) => (
                  <ActionRow
                    key={topic.id}
                    icon={topic.arabic}
                    title={topic.label}
                    description={`${topic.prompt} ${topic.description}`}
                    href={topic.exploreHref}
                    actionLabel="Open"
                  />
                ))}
              </div>
            )
          },
          {
            id: 'explore-search',
            icon: '🔎',
            title: 'Search or jump directly',
            summary: 'Use search when you already have a word, topic, surah, ayah reference or hadith reminder in mind.',
            chips: ['Ayah', 'Surah', 'Topic', 'Hadith'],
            children: (
              <div style={S.searchStack}>
                <UniversalKnowledgeBar
                  title="Search across NOOR"
                  subtitle="Try 2:255, Al-Kahf, sabr, intention, tafseer Al-Fatihah, or a life need."
                />
                <SearchPanel />
              </div>
            )
          }
        ]}
      />
    </main>
  );
}

const S: Record<string, CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 88,
    color: '#0f172a'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '2px 2px 0'
  },
  kicker: {
    margin: 0,
    color: '#0f766e',
    fontSize: 12,
    fontWeight: 850,
    letterSpacing: '0.14em',
    textTransform: 'uppercase'
  },
  title: {
    margin: 0,
    color: '#0f172a',
    fontSize: 25,
    lineHeight: 1.15,
    fontWeight: 850,
    letterSpacing: '-0.03em'
  },
  subtitle: {
    margin: 0,
    color: '#475569',
    fontSize: 14,
    lineHeight: 1.65,
    maxWidth: 740
  },
  rowList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  actionRow: {
    display: 'grid',
    gridTemplateColumns: '56px minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    minHeight: 86,
    padding: '14px 16px',
    border: '1px solid #d8e1ec',
    borderRadius: 18,
    background: '#ffffff',
    color: '#0f172a',
    textDecoration: 'none',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.045)'
  },
  rowIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    minWidth: 52,
    height: 52,
    borderRadius: 16,
    background: '#e6f7f3',
    border: '1px solid #a7ded5',
    color: '#075e59',
    fontSize: 16,
    fontWeight: 900,
    lineHeight: 1,
    textAlign: 'center',
    overflow: 'hidden'
  },
  rowCopy: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    minWidth: 0
  },
  rowTitle: {
    display: 'block',
    color: '#0f172a',
    fontSize: 15.5,
    lineHeight: 1.3,
    fontWeight: 850,
    letterSpacing: '-0.01em'
  },
  rowDescription: {
    display: 'block',
    margin: 0,
    color: '#475569',
    fontSize: 13.5,
    lineHeight: 1.55
  },
  rowAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
    padding: '7px 12px',
    borderRadius: 999,
    background: '#f8fafc',
    border: '1px solid #d8e1ec',
    color: '#334155',
    fontSize: 12.5,
    fontWeight: 800,
    whiteSpace: 'nowrap'
  },
  searchStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }
};
