import type { HadithItem } from '@noor/content';
import { HadithActionButtons } from './HadithActionButtons';
import { NoorCard } from './NoorCard';
import { SourceConnectionsPanel } from './SourceConnectionsPanel';

type HadithReaderMode = 'read' | 'reflect' | 'practice';

type HadithCardProps = {
  hadith: HadithItem;
  mode?: HadithReaderMode;
  index?: number;
};

function getPrimaryText(hadith: HadithItem) {
  return hadith.translations.en ?? hadith.translations.ms ?? `Hadith ${hadith.number}`;
}

function buildCopyText(hadith: HadithItem) {
  return [
    hadith.arabic,
    getPrimaryText(hadith),
    hadith.translations.ms,
    hadith.narrator ? `Narrated by ${hadith.narrator}` : undefined,
    hadith.sourceLabel
  ]
    .filter(Boolean)
    .join('\n\n');
}

function buildReflectionPrompt(mode: HadithReaderMode, hadith: HadithItem) {
  if (mode === 'practice') {
    return 'Practice: choose one small Sunnah action from this narration and write how you will apply it today.';
  }

  if (mode === 'reflect') {
    return 'Reflect: what character, intention or warning should I take from this narration?';
  }

  const firstTag = hadith.tags[0];
  return firstTag
    ? `Read: notice how this Hadith relates to #${firstTag}, then save it if you want to return later.`
    : 'Read: understand the reference, then save the narration if it is useful for your journey.';
}

function buildTopicHref(hadith: HadithItem) {
  const topic = hadith.tags[0];
  if (!topic) return undefined;
  const params = new URLSearchParams({ topic: topic.toLowerCase() });
  return `/explore?${params.toString()}`;
}

export function HadithCard({ hadith, mode = 'read', index }: HadithCardProps) {
  const primaryText = getPrimaryText(hadith);
  const referenceText = hadith.sourceLabel;
  const copyText = buildCopyText(hadith);
  const topicHref = buildTopicHref(hadith);
  const firstTopic = hadith.tags[0]?.toLowerCase();

  return (
    <NoorCard className="noor-hadith-card noor-hadith-card-v1">
      <div className="noor-row">
        <div className="noor-hadith-reference-stack">
          <span className="noor-badge emerald">Hadith {hadith.number}</span>
          {typeof index === 'number' ? <span className="noor-badge">Reader item {index}</span> : null}
        </div>
        <span className="noor-reference">{referenceText}</span>
      </div>

      {hadith.book || hadith.chapter ? (
        <p className="noor-muted noor-hadith-source-line">
          {[hadith.book, hadith.chapter].filter(Boolean).join(' · ')}
        </p>
      ) : null}

      {hadith.narrator ? <p className="noor-muted">Narrated by {hadith.narrator}</p> : null}
      {hadith.arabic ? <div className="noor-arabic small noor-hadith-arabic">{hadith.arabic}</div> : null}

      {hadith.translations.en ? <p className="noor-translation noor-hadith-primary-text">{hadith.translations.en}</p> : null}
      {hadith.translations.ms ? <p className="noor-subtitle">{hadith.translations.ms}</p> : null}

      <div className="noor-hadith-guidance-note">
        <span className="noor-kicker">{mode === 'practice' ? 'Practise' : mode === 'reflect' ? 'Reflect' : 'Read'}</span>
        <p>{buildReflectionPrompt(mode, hadith)}</p>
      </div>

      {hadith.tags.length > 0 ? (
        <div className="noor-topic-chip-row">
          {hadith.tags.slice(0, 6).map((tag) => (
            <span className="noor-badge" key={`${hadith.id}-${tag}`}>#{tag}</span>
          ))}
        </div>
      ) : null}

      <SourceConnectionsPanel
        compact
        subtitle="This Hadith should not stand alone. Continue into topic, Quran/Tafseer context, or one practical action."
        connections={[
          {
            label: 'Topic',
            badge: 'Topic',
            title: firstTopic ? `Explore #${firstTopic}` : 'Explore related topic',
            description: firstTopic
              ? 'Open a guided path that groups Quran, Tafseer and Hadith around this theme.'
              : 'Use Explore to find the wider guidance path for this narration.',
            href: topicHref ?? '/explore'
          },
          {
            label: 'Quran',
            badge: 'Quran',
            title: 'Find Quran foundation',
            description: 'Search for ayat and tafseer that connect with the meaning of this narration.',
            href: firstTopic ? `/explore?topic=${encodeURIComponent(firstTopic)}` : '/explore'
          },
          {
            label: 'Practise',
            badge: 'Practise',
            title: 'Turn into one action',
            description: 'Save the narration, reflect on it, then practise one small Sunnah action today.',
            href: '/library'
          }
        ]}
      />

      <HadithActionButtons
        bookmarkItem={{
          id: `hadith-${hadith.id}`,
          type: 'hadith',
          title: primaryText,
          reference: referenceText,
          href: '/learn/hadith'
        }}
        copyText={copyText}
        referenceText={referenceText}
        topicHref={topicHref}
      />
    </NoorCard>
  );
}
