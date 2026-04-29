'use client';

import { NoorCard } from '@noor/ui';
import { searchNoorLocal } from '@noor/search';
import { useMemo, useState } from 'react';

export function SearchPanel() {
  const [query, setQuery] = useState('mercy');
  const results = useMemo(() => searchNoorLocal(query), [query]);

  return (
    <div className="noor-stack">
      <label className="noor-form-field">
        <span className="noor-kicker">Smart search</span>
        <input
          className="noor-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try mercy, fatiha, intention, ikhlas..."
        />
      </label>

      <div className="noor-grid">
        {results.map((result) => (
          <NoorCard key={`${result.type}-${result.id}`} className="noor-link-card">
            <div className="noor-row">
              <span className="noor-badge emerald">{result.type}</span>
              <span className="noor-reference">{result.reference}</span>
            </div>
            <strong>{result.title}</strong>
            <p className="noor-subtitle">{result.excerpt}</p>
            {result.href ? <a className="noor-button secondary" href={result.href}>Open</a> : null}
          </NoorCard>
        ))}
      </div>

      {results.length === 0 ? (
        <NoorCard>
          <p className="noor-subtitle">No demo results yet. Sprint 4 will add the full search index.</p>
        </NoorCard>
      ) : null}
    </div>
  );
}
