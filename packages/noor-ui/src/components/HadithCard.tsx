import type { HadithItem } from '@noor/content';
import { HadithActionButtons } from './HadithActionButtons';
import { NoorCard } from './NoorCard';

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

function getNarratorText(hadith: HadithItem) {
  if (!hadith.narrator) return undefined;
  return hadith.narrator.replace(/^Narrated by\s+/iu, '').trim();
}

function isMeaningfulTopic(tag: string) {
  const normalized = tag.trim().toLowerCase();
  return (
    Boolean(normalized) &&
    normalized !== 'en' &&
    normalized !== 'ar' &&
    normalized !== 'ms' &&
    normalized !== 'id' &&
    normalized !== 'ur' &&
    normalized !== 'zh' &&
    normalized !== 'ta' &&
    !normalized.startsWith('by_') &&
    !normalized.includes('__') &&
    !/^[a-z0-9-]+:\d+$/u.test(normalized)
  );
}

function getMeaningfulTopics(hadith: HadithItem) {
  return hadith.tags.filter(isMeaningfulTopic);
}

function getModePrompt(mode: HadithReaderMode) {
  if (mode === 'reflect') {
    return {
      label: 'Reflect',
      text: 'What meaning, character trait, warning or encouragement should I carry from this narration?'
    };
  }

  if (mode === 'practice') {
    return {
      label: 'Practise',
      text: 'Choose one small Sunnah action from this narration that can be lived today.'
    };
  }

  return {
    label: 'Read',
    text: 'Read the Arabic, translation, narrator and reference as one focused source.'
  };
}

function buildTopicHref(hadith: HadithItem) {
  const topic = getMeaningfulTopics(hadith)[0];
  if (!topic) return undefined;
  const params = new URLSearchParams({ topic: topic.toLowerCase() });
  return `/explore?${params.toString()}`;
}

export function HadithCard({ hadith, mode = 'read', index }: HadithCardProps) {
  const primaryText = getPrimaryText(hadith);
  const referenceText = hadith.sourceLabel;
  const copyText = buildCopyText(hadith);
  const topicHref = buildTopicHref(hadith);
  const meaningfulTopics = getMeaningfulTopics(hadith);
  const narratorText = getNarratorText(hadith);
  const modePrompt = getModePrompt(mode);

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

      {narratorText ? <p className="noor-hadith-narrator">{narratorText}</p> : null}
      {hadith.arabic ? <div className="noor-arabic small noor-hadith-arabic">{hadith.arabic}</div> : null}

      {hadith.translations.en ? (
        <div className="noor-hadith-translation-block" lang="en">
          <span className="noor-kicker">English</span>
          <p className="noor-translation noor-hadith-primary-text">{hadith.translations.en}</p>
        </div>
      ) : null}
      {hadith.translations.ms ? <p className="noor-subtitle">{hadith.translations.ms}</p> : null}

      <div className="noor-hadith-mode-note" data-mode={mode}>
        <span className="noor-kicker">{modePrompt.label}</span>
        <p>{modePrompt.text}</p>
      </div>

      {meaningfulTopics.length > 0 ? (
        <div className="noor-topic-chip-row">
          {meaningfulTopics.slice(0, 6).map((tag) => (
            <span className="noor-badge" key={`${hadith.id}-${tag}`}>#{tag}</span>
          ))}
        </div>
      ) : null}

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
        compact={mode === 'read'}
      />
    </NoorCard>
  );
}
