'use client';

import { NoorCard } from '@noor/ui';
import { NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY } from '../lib/runtime-content-source-constants';
import {
  getNoorSearchTypeLabel,
  NOOR_SEARCH_TYPES,
  searchNoorLocal,
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

async function fetchCdnSearchResults({
  query,
  selectedTypes
}: {
  query: string;
  selectedTypes: NoorSearchType[];
}): Promise<NoorSearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    types: selectedTypes.join(','),
    limit: '36'
  });
  const response = await fetch(`/api/explore/search?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to search CDN index: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data.results) ? (data.results as NoorSearchResult[]) : [];
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
  if (result.href?.startsWith('/learn/tafseer')) return result.href;

  const parsed = parseReference(result);
  if (!parsed) return '/learn/tafseer';

  const params = new URLSearchParams({ surah: String(parsed.surah) });
  return `/learn/tafseer?${params.toString()}${parsed.ayah ? `#ayah-${parsed.ayah}` : ''}`;
}

function buildHadithReaderHref(result: NoorSearchResult) {
  if (result.href?.startsWith('/learn/hadith')) return result.href;

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

const KNOWLEDGE_PATH_STEPS: Array<{
  type: NoorSearchType;
  label: string;
  title: string;
  empty: string;
  actionFallback: string;
}> = [
  {
    type: 'quran',
    label: '1. Quran',
    title: 'Foundation',
    empty: 'No Quran foundation found yet for this query.',
    actionFallback: 'Open Quran'
  },
  {
    type: 'tafseer',
    label: '2. Tafseer',
    title: 'Understanding',
    empty: 'No tafseer explanation found yet for this query.',
    actionFallback: 'Open Tafseer'
  },
  {
    type: 'hadith',
    label: '3. Hadith',
    title: 'Guidance',
    empty: 'No Hadith guidance found yet for this query.',
    actionFallback: 'Open Hadith'
  }
];

function getPathResultAction(result: NoorSearchResult) {
  if (result.type === 'quran') {
    return {
      label: 'Read Quran',
      href: buildQuranReaderHref(result)
    };
  }

  if (result.type === 'tafseer') {
    return {
      label: 'Understand Tafseer',
      href: buildTafseerHref(result)
    };
  }

  return {
    label: 'Reflect Hadith',
    href: buildHadithReaderHref(result)
  };
}

function getTopicPrompt(query: string) {
  const trimmed = query.trim();
  return trimmed ? `Knowledge related to "${trimmed}"` : 'Search for a topic, question or reference';
}

function KnowledgePathCard({
  query,
  results,
  onRemember,
}: {
  query: string;
  results: NoorSearchResult[];
  onRemember: () => void;
}) {
  const pathResults = KNOWLEDGE_PATH_STEPS.map((step) => ({
    ...step,
    result: results.find((result) => result.type === step.type)
  }));
  const hasPathResult = pathResults.some((step) => step.result);

  return (
    <NoorCard className="noor-knowledge-path-card">
      <div className="noor-knowledge-path-head">
        <div>
          <span className="noor-badge emerald">Knowledge Path</span>
          <h2>{getTopicPrompt(query)}</h2>
          <p className="noor-subtitle">
            Study in order: begin with Quran, continue into tafseer, then reflect with Hadith.
          </p>
        </div>
        <span className="noor-badge gold">{hasPathResult ? 'Ready to study' : 'Choose a wider word'}</span>
      </div>

      <div className="noor-knowledge-path-grid">
        {pathResults.map((step) => {
          const result = step.result;
          const action = result ? getPathResultAction(result) : undefined;

          return (
            <article className="noor-knowledge-path-step" key={step.type} data-empty={!result}>
              <span className="noor-kicker">{step.label}</span>
              <h3>{step.title}</h3>
              {result ? (
                <>
                  <strong>{result.title}</strong>
                  <span className="noor-reference">{result.reference}</span>
                  <p>{result.excerpt}</p>
                  {result.sourceLabel ? <small>{result.sourceLabel}</small> : null}
                  <a className="noor-button secondary" href={action?.href} onClick={onRemember}>
                    {action?.label}
                  </a>
                </>
              ) : (
                <>
                  <p>{step.empty}</p>
                  <span className="noor-muted">Try a broader topic or remove a source filter.</span>
                </>
              )}
            </article>
          );
        })}
      </div>

      <div className="noor-knowledge-path-footer">
        <div>
          <span className="noor-kicker">Continue</span>
          <p className="noor-subtitle">After reading, save one reflection or continue through the linked source pages.</p>
        </div>
      </div>
    </NoorCard>
  );
}

export function SearchPanel() {
  const [query, setQuery] = useState('mercy');
  const [selectedTypes, setSelectedTypes] = useState<NoorSearchType[]>(NOOR_DISCOVERY_SOURCE_TYPES);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [cdnResults, setCdnResults] = useState<NoorSearchResult[]>([]);
  const [searchReadyLabel, setSearchReadyLabel] = useState('Guidance search ready');

  useEffect(() => {
    setRecentSearches(readRecentSearches());

    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic')?.trim();
    if (topic) {
      setQuery(topic);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const source = readRuntimeSearchSource();

    if (source === 'mock') {
      setCdnResults([]);
      setSearchReadyLabel('Guidance search ready');
      return;
    }

    setSearchReadyLabel('Searching CDN knowledge index...');

    fetchCdnSearchResults({ query, selectedTypes })
      .then((results) => {
        if (cancelled) return;
        setCdnResults(results);
        setSearchReadyLabel('CDN knowledge search ready');
      })
      .catch(() => {
        if (cancelled) return;
        setCdnResults([]);
        setSearchReadyLabel('CDN search unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [query, selectedTypes]);

  const results = useMemo(() => {
    if (readRuntimeSearchSource() !== 'mock') return cdnResults;
    const options = { types: selectedTypes, limit: 36 };
    return searchNoorLocal(query, options);
  }, [cdnResults, query, selectedTypes]);

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
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </NoorCard>

      <KnowledgePathCard
        query={query}
        results={results}
        onRemember={() => rememberSearch()}
      />

      <div className="noor-result-summary">
        <div>
          <span className="noor-kicker">All matching sources</span>
          <p className="noor-subtitle">
            {results.length > 0
              ? `${results.length} reminder${results.length === 1 ? '' : 's'} found. The strongest matches are arranged above as a knowledge path.`
              : 'No result yet for the current search and filters.'}
          </p>
        </div>
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
            Use a broader word, remove one filter, or try another search term from the source index.
          </p>
        </NoorCard>
      ) : null}
    </div>
  );
}
