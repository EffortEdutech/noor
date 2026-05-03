'use client';

import { NoorCard } from '@noor/ui';
import { NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY } from '../lib/runtime-content-source-constants';
import {
  getNoorSearchSuggestions,
  getNoorSearchTypeLabel,
  NOOR_SEARCH_TOPICS,
  NOOR_SEARCH_TYPES,
  searchNoorIndex,
  searchNoorLocal,
  type NoorSearchIndexEntry,
  type NoorSearchResult,
  type NoorSearchType
} from '@noor/search';
import { useEffect, useMemo, useState } from 'react';

const RECENT_SEARCHES_KEY = 'noor.search.recent.v1';

const activeButtonStyle = {
  borderColor: 'rgba(216, 183, 90, 0.42)',
  background: 'linear-gradient(135deg, rgba(216, 183, 90, 0.22), rgba(47, 191, 155, 0.11))',
  color: 'var(--noor-ink)'
};

const DEFAULT_EXTERNAL_CDN_BASE = 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn';

const NOOR_DISCOVERY_SOURCE_TYPES: NoorSearchType[] = ['quran', 'tafseer', 'hadith'];

const SOURCE_GROUPS: Array<{
  type: NoorSearchType;
  title: string;
  helper: string;
}> = [
  {
    type: 'quran',
    title: 'Quran',
    helper: 'Begin with the ayah and read it in context.'
  },
  {
    type: 'tafseer',
    title: 'Tafseer',
    helper: 'Continue into explanation and guided understanding.'
  },
  {
    type: 'hadith',
    title: 'Hadith',
    helper: 'Reflect on Prophetic reminders connected to the topic.'
  }
];

const GUIDANCE_TOPIC_PROMPTS = [
  {
    id: 'mercy',
    icon: 'رحمة',
    title: 'Mercy',
    prompt: 'When I need hope in Allah’s mercy',
    query: 'mercy',
    description: 'For hope, compassion, forgiveness and returning to Allah.'
  },
  {
    id: 'patience',
    icon: 'صبر',
    title: 'Patience',
    prompt: 'When I am tested and need sabr',
    query: 'patience',
    description: 'For hardship, steadiness, trials and trust.'
  },
  {
    id: 'rizq',
    icon: 'رزق',
    title: 'Rizq',
    prompt: 'When I worry about provision',
    query: 'rizq',
    description: 'For sustenance, trust, gratitude and effort.'
  },
  {
    id: 'intention',
    icon: 'نية',
    title: 'Intention',
    prompt: 'When I want to purify my intention',
    query: 'intention',
    description: 'For sincerity, deeds, worship and the heart.'
  },
  {
    id: 'protection',
    icon: 'حفظ',
    title: 'Protection',
    prompt: 'When I seek refuge and safety',
    query: 'protection',
    description: 'For refuge, remembrance, evil and safety.'
  },
  {
    id: 'prayer',
    icon: 'صلاة',
    title: 'Prayer',
    prompt: 'When I want to return to prayer',
    query: 'prayer',
    description: 'For salah, du‘a, guidance and nearness.'
  },
  {
    id: 'repentance',
    icon: 'توبة',
    title: 'Repentance',
    prompt: 'When I want to come back to Allah',
    query: 'repentance',
    description: 'For tawbah, forgiveness, humility and renewal.'
  }
];

type RuntimeSearchSource = 'mock' | 'local-cdn' | 'cdn';

function normalizeRuntimeSearchSource(value: string | null | undefined): RuntimeSearchSource {
  if (value === 'cdn') return 'cdn';
  if (value === 'local-cdn' || value === 'local') return 'local-cdn';
  return 'mock';
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function readRuntimeSearchSource(): RuntimeSearchSource {
  try {
    const saved = localStorage.getItem(NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY);
    if (saved) return normalizeRuntimeSearchSource(saved);
  } catch {
    // Ignore blocked localStorage and fall back to cookie/environment.
  }

  const cookieValue = readCookie(NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY);
  if (cookieValue) return normalizeRuntimeSearchSource(cookieValue);

  return normalizeRuntimeSearchSource(process.env.NEXT_PUBLIC_NOOR_DATA_MODE);
}

function trimBase(value: string) {
  return value.replace(/\/+$/, '');
}

function getSearchIndexEndpoint(source: RuntimeSearchSource) {
  if (source === 'mock') return null;

  if (source === 'local-cdn') {
    const localBase = process.env.NEXT_PUBLIC_NOOR_LOCAL_CDN_BASE ?? '/noor-cdn';
    return `${trimBase(localBase)}/search/search-index.json`;
  }

  const externalBase = process.env.NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE ?? DEFAULT_EXTERNAL_CDN_BASE;
  return `${trimBase(externalBase)}/search/search-index.json`;
}

async function fetchSearchIndex(endpoint: string): Promise<NoorSearchIndexEntry[]> {
  const response = await fetch(endpoint, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load search index: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? (data as NoorSearchIndexEntry[]) : [];
}

function readRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(items: string[]) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items.slice(0, 8)));
}

function parseReference(result: NoorSearchResult) {
  const raw = `${result.reference} ${result.id}`;
  const match = raw.match(/(?:^|\D)(\d{1,3})(?::(\d{1,3}))?/);
  if (!match) return undefined;

  const surah = Number.parseInt(match[1], 10);
  const ayah = match[2] ? Number.parseInt(match[2], 10) : undefined;
  if (!Number.isFinite(surah) || surah < 1 || surah > 114) return undefined;

  return {
    surah,
    ayah: ayah && Number.isFinite(ayah) && ayah > 0 ? ayah : undefined
  };
}

function buildQuranReaderHref(result: NoorSearchResult) {
  if (result.href?.startsWith('/learn/quran')) return result.href;

  const parsed = parseReference(result);
  if (!parsed) return '/learn/quran';

  return `/learn/quran/${parsed.surah}${parsed.ayah ? `#ayah-${parsed.ayah}` : ''}`;
}

function buildTafseerHref(result: NoorSearchResult) {
  const parsed = parseReference(result);
  if (!parsed) return '/learn/tafseer';

  const params = new URLSearchParams({ surah: String(parsed.surah) });
  return `/learn/tafseer?${params.toString()}${parsed.ayah ? `#ayah-${parsed.ayah}` : ''}`;
}

function buildHadithReaderHref(result: NoorSearchResult) {
  const firstTag = result.tags.find((tag) => tag.length > 1);
  const params = new URLSearchParams({ mode: 'reflect' });
  if (firstTag) params.set('topic', firstTag.toLowerCase());
  return `/learn/hadith?${params.toString()}#hadith-reader`;
}

function getPrimaryAction(result: NoorSearchResult) {
  if (result.type === 'tafseer') {
    return {
      label: 'Open Tafseer understanding',
      href: buildTafseerHref(result)
    };
  }

  if (result.type === 'hadith') {
    return {
      label: 'Open Hadith reader',
      href: buildHadithReaderHref(result)
    };
  }

  return {
    label: 'Open Quran reader',
    href: buildQuranReaderHref(result)
  };
}

function getSupportingActions(result: NoorSearchResult) {
  if (result.type === 'quran') {
    return [
      {
        label: 'Understand with Tafseer',
        href: buildTafseerHref(result)
      },
      {
        label: 'Hadith reminders',
        href: buildHadithReaderHref(result)
      }
    ];
  }

  if (result.type === 'tafseer') {
    return [
      {
        label: 'Read Quran context',
        href: buildQuranReaderHref(result)
      }
    ];
  }

  if (result.type === 'hadith') {
    return [
      {
        label: 'Explore Quran and Tafseer',
        href: `/explore?topic=${encodeURIComponent(result.tags[0] ?? result.title)}`
      }
    ];
  }

  return [];
}

function SearchTypeToggle({
  type,
  active,
  onToggle
}: {
  type: NoorSearchType;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="noor-button secondary"
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      style={active ? activeButtonStyle : undefined}
      title={NOOR_SEARCH_TYPES.find((item) => item.id === type)?.description}
    >
      {getNoorSearchTypeLabel(type)}
    </button>
  );
}

export function SearchPanel() {
  const [query, setQuery] = useState('mercy');
  const [selectedTypes, setSelectedTypes] = useState<NoorSearchType[]>(NOOR_DISCOVERY_SOURCE_TYPES);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>('mercy');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [cdnSearchIndex, setCdnSearchIndex] = useState<NoorSearchIndexEntry[] | null>(null);
  const [searchReadyLabel, setSearchReadyLabel] = useState('Guidance search ready');

  useEffect(() => {
    setRecentSearches(readRecentSearches());

    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic')?.trim();
    if (topic) {
      const matchingTopic = NOOR_SEARCH_TOPICS.find(
        (item) => item.id === topic.toLowerCase() || item.label.toLowerCase() === topic.toLowerCase()
      );
      setSelectedTopic(matchingTopic?.id);
      setQuery(matchingTopic?.label ?? topic);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const source = readRuntimeSearchSource();
    const endpoint = getSearchIndexEndpoint(source);

    if (!endpoint) {
      setCdnSearchIndex(null);
      setSearchReadyLabel('Guidance search ready');
      return;
    }

    setSearchReadyLabel('Preparing guidance search…');

    fetchSearchIndex(endpoint)
      .then((index) => {
        if (cancelled) return;
        if (index.length > 0) {
          setCdnSearchIndex(index);
          setSearchReadyLabel('Guidance search ready');
        } else {
          setCdnSearchIndex(null);
          setSearchReadyLabel('Guidance search ready');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setCdnSearchIndex(null);
        setSearchReadyLabel('Guidance search ready');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = useMemo(() => getNoorSearchSuggestions(query), [query]);
  const results = useMemo(() => {
    const options = { types: selectedTypes, topic: selectedTopic, limit: 36 };
    return cdnSearchIndex
      ? searchNoorIndex(query, cdnSearchIndex, options)
      : searchNoorLocal(query, options);
  }, [cdnSearchIndex, query, selectedTypes, selectedTopic]);

  const groupedResults = useMemo(
    () =>
      SOURCE_GROUPS.map((group) => ({
        ...group,
        results: results.filter((result) => result.type === group.type)
      })).filter((group) => group.results.length > 0),
    [results]
  );

  function rememberSearch(value = query) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
    setRecentSearches(next.slice(0, 8));
    writeRecentSearches(next);
  }

  function toggleType(type: NoorSearchType) {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        const next = current.filter((item) => item !== type);
        return next.length > 0 ? next : current;
      }
      return [...current, type];
    });
  }

  function applyTopic(topicId: string, topicQuery: string) {
    setSelectedTopic((current) => (current === topicId ? undefined : topicId));
    setQuery(topicQuery);
    rememberSearch(topicQuery);
  }

  return (
    <div className="noor-stack">
      <NoorCard variant="soft">
        <div className="noor-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <span className="noor-badge emerald">{searchReadyLabel}</span>
            <p className="noor-subtitle" style={{ marginTop: 10 }}>
              Search in simple words, or begin from a prompt below. Each result gives you a clear next step into reading, understanding or reflection.
            </p>
          </div>
          <span className="noor-badge gold">Quran · Tafseer · Hadith</span>
        </div>

        <div className="noor-grid" style={{ alignItems: 'end' }}>
          <label className="noor-form-field">
            <span className="noor-kicker">What guidance are you looking for?</span>
            <input
              className="noor-input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedTopic(undefined);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') rememberSearch();
              }}
              placeholder="Try mercy, patience, rizq, intention, protection, prayer..."
            />
          </label>

          <button className="noor-button" type="button" onClick={() => rememberSearch()}>
            Search guidance
          </button>
        </div>

        <div className="noor-stack" style={{ gap: 10, marginTop: 18 }}>
          <span className="noor-kicker">Choose a guidance prompt</span>
          <div className="noor-topic-prompt-grid">
            {GUIDANCE_TOPIC_PROMPTS.map((topic) => (
              <button
                key={topic.id}
                className="noor-topic-prompt-card"
                data-active={selectedTopic === topic.id}
                type="button"
                onClick={() => applyTopic(topic.id, topic.query)}
              >
                <span className="noor-topic-prompt-icon">{topic.icon}</span>
                <strong>{topic.title}</strong>
                <span>{topic.prompt}</span>
                <small>{topic.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
          <span className="noor-kicker">Show me</span>
          <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
            {NOOR_DISCOVERY_SOURCE_TYPES.map((type) => (
              <SearchTypeToggle
                key={type}
                type={type}
                active={selectedTypes.includes(type)}
                onToggle={() => toggleType(type)}
              />
            ))}
          </div>
        </div>

        {recentSearches.length > 0 ? (
          <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
            <span className="noor-kicker">Recent searches</span>
            <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
              {recentSearches.map((item) => (
                <button
                  key={item}
                  className="noor-badge"
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    setSelectedTopic(undefined);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </NoorCard>

      <div className="noor-result-summary">
        <div>
          <span className="noor-kicker">Guidance results</span>
          <p className="noor-subtitle">
            {results.length > 0
              ? `${results.length} reminder${results.length === 1 ? '' : 's'} found, grouped by Quran, Tafseer and Hadith.`
              : 'No result yet for the current search and filters.'}
          </p>
        </div>
        {suggestions.length > 0 ? (
          <div className="noor-suggestion-row" aria-label="Suggested searches">
            {suggestions.map((item) => (
              <button
                key={item.id}
                className="noor-badge gold"
                type="button"
                onClick={() => applyTopic(item.id, item.label)}
              >
                Try {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {groupedResults.map((group) => (
        <section className="noor-result-group" key={group.type}>
          <div className="noor-result-group-header">
            <div>
              <span className="noor-badge emerald">{group.title}</span>
              <h2>{group.results.length} result{group.results.length === 1 ? '' : 's'}</h2>
            </div>
            <p className="noor-subtitle">{group.helper}</p>
          </div>

          <div className="noor-grid">
            {group.results.map((result) => {
              const primaryAction = getPrimaryAction(result);
              const supportingActions = getSupportingActions(result);

              return (
                <NoorCard key={`${result.type}-${result.id}`} className="noor-link-card noor-explore-result-card">
                  <div className="noor-row">
                    <span className="noor-badge emerald">{getNoorSearchTypeLabel(result.type)}</span>
                    <span className="noor-reference">{result.reference}</span>
                  </div>

                  <div>
                    <strong>{result.title}</strong>
                    {result.sourceLabel ? <p className="noor-muted">{result.sourceLabel}</p> : null}
                  </div>

                  <p className="noor-subtitle">{result.excerpt}</p>

                  {result.tags.length > 0 ? (
                    <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
                      {Array.from(new Set(result.tags)).slice(0, 4).map((tag) => (
                        <span className="noor-badge" key={`${result.type}-${result.id}-${tag}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="noor-result-card-actions">
                    <a className="noor-button" href={primaryAction.href} onClick={() => rememberSearch()}>
                      {primaryAction.label}
                    </a>
                    {supportingActions.map((action) => (
                      <a
                        key={`${result.type}-${result.id}-${action.href}`}
                        className="noor-button secondary"
                        href={action.href}
                        onClick={() => rememberSearch()}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                </NoorCard>
              );
            })}
          </div>
        </section>
      ))}

      {results.length === 0 ? (
        <NoorCard className="noor-empty-guidance-card">
          <span className="noor-badge gold">No result yet</span>
          <h3>Try a wider doorway into guidance</h3>
          <p className="noor-subtitle">
            Use a broader word, remove one filter, or begin from a topic prompt. Good starting points are mercy, patience, rizq, intention, protection, prayer and repentance.
          </p>
          <div className="noor-card-actions">
            {GUIDANCE_TOPIC_PROMPTS.slice(0, 5).map((topic) => (
              <button
                key={`empty-${topic.id}`}
                className="noor-button secondary"
                type="button"
                onClick={() => applyTopic(topic.id, topic.query)}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </NoorCard>
      ) : null}
    </div>
  );
}
