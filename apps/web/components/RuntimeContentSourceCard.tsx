'use client';

import type { NoorDataConfig, NoorDataMode, NoorResolverDiagnosticsReport } from '@noor/data';
import { NoorCard } from '@noor/ui';
import {
  NOOR_CONTENT_SOURCE_COOKIE,
  NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY
} from '../lib/runtime-content-source-constants';

const SOURCE_OPTIONS: {
  id: NoorDataMode;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    id: 'mock',
    label: 'Mock fallback',
    badge: 'Offline-safe',
    description: 'Uses bundled demo content only. Best for guaranteed local testing.'
  },
  {
    id: 'local-cdn',
    label: 'Local CDN',
    badge: 'Runtime test',
    description: 'Uses files prepared under apps/web/public/noor-cdn.'
  },
  {
    id: 'cdn',
    label: 'External CDN',
    badge: 'Future production',
    description: 'Uses configured CDN endpoints, with bundled fallback enabled.'
  }
];

function statusClass(status: string) {
  if (status === 'ok') return 'noor-badge emerald';
  if (status === 'error') return 'noor-badge danger';
  if (status === 'fallback') return 'noor-badge gold';
  return 'noor-badge';
}

function setContentSource(source: NoorDataMode) {
  document.cookie = `${NOOR_CONTENT_SOURCE_COOKIE}=${source};path=/;max-age=31536000;samesite=lax`;
  localStorage.setItem(NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY, source);
  window.location.reload();
}

function resetContentSource() {
  document.cookie = `${NOOR_CONTENT_SOURCE_COOKIE}=;path=/;max-age=0;samesite=lax`;
  localStorage.removeItem(NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY);
  window.location.reload();
}

export function RuntimeContentSourceCard({
  initialSource,
  config,
  diagnostics
}: {
  initialSource: NoorDataMode;
  config: NoorDataConfig;
  diagnostics: NoorResolverDiagnosticsReport;
}) {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Runtime content source</span>
        <span className={diagnostics.isHealthy ? 'noor-badge emerald' : 'noor-badge gold'}>
          {diagnostics.isHealthy ? 'Ready' : 'Fallback active'}
        </span>
      </div>

      <h2>Source switching</h2>
      <p className="noor-subtitle">
        Choose whether NOOR reads from bundled mock content, the local prepared CDN folder, or configured external CDN endpoints.
      </p>

      <div className="noor-divider" />

      <div className="noor-grid">
        {SOURCE_OPTIONS.map((option) => {
          const active = option.id === initialSource;
          return (
            <button
              className="noor-card is-soft noor-source-option"
              type="button"
              key={option.id}
              aria-pressed={active}
              onClick={() => setContentSource(option.id)}
            >
              <div className="noor-row">
                <strong>{option.label}</strong>
                <span className={active ? 'noor-badge emerald' : 'noor-badge'}>
                  {active ? 'Active' : option.badge}
                </span>
              </div>
              <p className="noor-subtitle">{option.description}</p>
            </button>
          );
        })}
      </div>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat">
          <strong>{config.sourceLabel}</strong>
          <span>{config.sourceDescription}</span>
        </div>
        <div className="noor-stat">
          <strong>{config.usesNetwork ? 'Network' : 'No network'}</strong>
          <span>{config.fallbackEnabled ? 'Bundled fallback enabled' : 'Fallback disabled'}</span>
        </div>
        <div className="noor-stat">
          <strong>{initialSource}</strong>
          <span>Cookie: {NOOR_CONTENT_SOURCE_COOKIE}</span>
        </div>
      </div>

      <div className="noor-divider" />

      <h3>Resolver diagnostics</h3>
      <div className="noor-stack tight">
        {diagnostics.diagnostics.map((item) => (
          <div className="noor-card is-soft" key={item.id}>
            <div className="noor-row">
              <strong>{item.label}</strong>
              <span className={statusClass(item.status)}>{item.status}</span>
            </div>
            <p className="noor-subtitle">{item.detail}</p>
            <p className="noor-muted noor-small" style={{ wordBreak: 'break-all' }}>{item.url}</p>
          </div>
        ))}
      </div>

      <div className="noor-divider" />

      <div className="noor-card-actions">
        <button className="noor-button secondary" type="button" onClick={resetContentSource}>
          Reset to environment default
        </button>
        <a className="noor-button secondary" href="/learn/quran/1">
          Test Quran reader
        </a>
        <a className="noor-button secondary" href="/learn/hadith">
          Test Hadith
        </a>
      </div>
    </NoorCard>
  );
}
