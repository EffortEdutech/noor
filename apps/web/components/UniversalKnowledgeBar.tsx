'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const QUICK_INTENTS = [
  { label: 'Patience', query: 'patience', helper: 'Quran, tafseer and hadith for sabr.' },
  { label: 'Mercy', query: 'mercy', helper: 'Hope, forgiveness and returning to Allah.' },
  { label: 'Rizq', query: 'rizq', helper: 'Provision, effort, trust and gratitude.' },
  { label: 'Intention', query: 'intention', helper: 'Sincerity and purpose of deeds.' },
  { label: 'Prayer', query: 'prayer', helper: 'Salah, du‘a and nearness.' }
];

function normaliseQuery(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function stripSourceWords(value: string) {
  return value
    .replace(/\b(quran|ayah|verse|surah|tafsir|tafseer|hadith|hadeeth|about|on|of)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveKnowledgeHref(rawQuery: string) {
  const query = normaliseQuery(rawQuery);

  if (!query) return '/explore';

  const referenceMatch = query.match(/^(\d{1,3})(?::(\d{1,3}))?$/);
  if (referenceMatch) {
    const surah = Number(referenceMatch[1]);
    const ayah = referenceMatch[2] ? Number(referenceMatch[2]) : undefined;

    if (surah >= 1 && surah <= 114) {
      return `/learn/quran/${surah}${ayah ? `#ayah-${ayah}` : ''}`;
    }
  }

  const lower = query.toLowerCase();

  if (lower.includes('tafsir') || lower.includes('tafseer')) {
    const topic = stripSourceWords(query);
    return topic ? `/explore?topic=${encodeURIComponent(topic)}` : '/learn/tafseer';
  }

  if (lower.includes('hadith') || lower.includes('hadeeth')) {
    const topic = stripSourceWords(query);
    const params = new URLSearchParams({ mode: 'reflect' });
    if (topic) params.set('topic', topic.toLowerCase());
    return `/learn/hadith?${params.toString()}#hadith-reader`;
  }

  if (lower.startsWith('surah ')) {
    return `/explore?topic=${encodeURIComponent(query)}`;
  }

  return `/explore?topic=${encodeURIComponent(query)}`;
}

export function UniversalKnowledgeBar({
  defaultValue = '',
  title = 'What guidance are you seeking?',
  subtitle = 'Search by need, topic, question, Quran reference, tafseer doorway or Hadith topic.'
}: {
  defaultValue?: string;
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function go(value = query) {
    const href = resolveKnowledgeHref(value);
    router.push(href);
  }

  return (
    <section className="noor-card noor-knowledge-bar-card" aria-label="Universal Knowledge Bar">
      <div className="noor-knowledge-bar-header">
        <div>
          <span className="noor-badge gold">Knowledge Navigation</span>
          <h2>{title}</h2>
          <p className="noor-subtitle">{subtitle}</p>
        </div>
      </div>

      <form
        className="noor-knowledge-bar-form"
        onSubmit={(event) => {
          event.preventDefault();
          go();
        }}
      >
        <input
          className="noor-input noor-knowledge-bar-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try 2:255, patience, hadith intention, tafseer al-fatiha..."
        />
        <button className="noor-button" type="submit">
          Seek guidance
        </button>
      </form>

      <div className="noor-knowledge-intent-grid" aria-label="Quick guidance intents">
        {QUICK_INTENTS.map((intent) => (
          <button
            key={intent.query}
            type="button"
            className="noor-knowledge-intent-card"
            onClick={() => {
              setQuery(intent.query);
              go(intent.query);
            }}
          >
            <strong>{intent.label}</strong>
            <span>{intent.helper}</span>
          </button>
        ))}
      </div>

      <div className="noor-knowledge-bar-hints">
        <span>Reference: 2:255</span>
        <span>Topic: sabr</span>
        <span>Question: anxiety</span>
        <span>Source: hadith intention</span>
      </div>
    </section>
  );
}
