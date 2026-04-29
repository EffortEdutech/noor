'use client';

import { NoorCard } from '@noor/ui';
import {
  getNoorSearchTypeLabel,
  getNoorSearchSuggestions,
  NOOR_SEARCH_TOPICS,
  NOOR_SEARCH_TYPES,
  searchNoorLocal,
  type NoorSearchType
} from '@noor/search';
import { useEffect, useMemo, useState } from 'react';

const RECENT_SEARCHES_KEY = 'noor.search.recent.v1';

const activeButtonStyle = {
  borderColor: 'rgba(216, 183, 90, 0.42)',
  background: 'linear-gradient(135deg, rgba(216, 183, 90, 0.22), rgba(47, 191, 155, 0.11))',
  color: 'var(--noor-ink)'
};

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
  const [selectedTypes, setSelectedTypes] = useState<NoorSearchType[]>(
    NOOR_SEARCH_TYPES.map((item) => item.id)
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>('mercy');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  const suggestions = useMemo(() => getNoorSearchSuggestions(query), [query]);
  const results = useMemo(
    () => searchNoorLocal(query, { types: selectedTypes, topic: selectedTopic, limit: 24 }),
    [query, selectedTypes, selectedTopic]
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
        <div className="noor-grid" style={{ alignItems: 'end' }}>
          <label className="noor-form-field">
            <span className="noor-kicker">Explore search</span>
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
              placeholder="Try mercy, guidance, ikhlas, intention, protection..."
            />
          </label>

          <button className="noor-button" type="button" onClick={() => rememberSearch()}>
            Search
          </button>
        </div>

        <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
          <span className="noor-kicker">Content filters</span>
          <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
            {NOOR_SEARCH_TYPES.map((item) => (
              <SearchTypeToggle
                key={item.id}
                type={item.id}
                active={selectedTypes.includes(item.id)}
                onToggle={() => toggleType(item.id)}
              />
            ))}
          </div>
        </div>

        <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
          <span className="noor-kicker">Quick topics</span>
          <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
            {NOOR_SEARCH_TOPICS.map((topic) => (
              <button
                key={topic.id}
                className="noor-button secondary"
                type="button"
                onClick={() => applyTopic(topic.id, topic.label)}
                style={selectedTopic === topic.id ? activeButtonStyle : undefined}
                title={topic.description}
              >
                {topic.label}
              </button>
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

      <div className="noor-row">
        <div>
          <span className="noor-kicker">Results</span>
          <p className="noor-subtitle">
            {results.length > 0
              ? `${results.length} ranked result${results.length === 1 ? '' : 's'} from Quran, Tafseer, Hadith and Journeys demo content.`
              : 'No result found for the current search and filters.'}
          </p>
        </div>
        {suggestions.length > 0 ? (
          <span className="noor-badge gold">
            Suggestions: {suggestions.map((item) => item.label).join(', ')}
          </span>
        ) : null}
      </div>

      <div className="noor-grid">
        {results.map((result) => (
          <NoorCard key={`${result.type}-${result.id}`} className="noor-link-card">
            <div className="noor-row">
              <span className="noor-badge emerald">{getNoorSearchTypeLabel(result.type)}</span>
              <span className="noor-reference">{result.reference}</span>
            </div>

            <div>
              <strong>{result.title}</strong>
              {result.sourceLabel ? <p className="noor-muted">{result.sourceLabel}</p> : null}
            </div>

            <p className="noor-subtitle">{result.excerpt}</p>

            <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
              <span className="noor-badge">Score {result.score}</span>
              {result.matchedFields.slice(0, 3).map((field) => (
                <span className="noor-badge" key={`${result.type}-${result.id}-${field}`}>
                  {field}
                </span>
              ))}
            </div>

            {result.tags.length > 0 ? (
              <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
                {Array.from(new Set(result.tags)).slice(0, 4).map((tag) => (
                  <span className="noor-badge" key={`${result.type}-${result.id}-${tag}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {result.href ? (
              <a className="noor-button secondary" href={result.href} onClick={() => rememberSearch()}>
                Open
              </a>
            ) : null}
          </NoorCard>
        ))}
      </div>

      {results.length === 0 ? (
        <NoorCard>
          <h3 style={{ marginTop: 0 }}>No matching demo content yet</h3>
          <p className="noor-subtitle">
            Try a broader search such as mercy, guidance, ikhlas, intention, refuge, straight path,
            Allah, Al-Fatihah, foundations, prayer, protection, or journey. When the full CDN index is
            connected, this same search interface can search the wider Quran, Tafseer, Hadith and
            journey dataset.
          </p>
        </NoorCard>
      ) : null}
    </div>
  );
}
