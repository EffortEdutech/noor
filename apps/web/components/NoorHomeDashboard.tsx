'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useState } from 'react';
import {
  formatRelativeNoorDate,
  getGuidancePathCompletionPercent,
  getLatestGuidancePath,
  getNoorLightStats,
  NOOR_BOOKMARKS_EVENT,
  NOOR_GUIDANCE_PATHS_EVENT,
  NOOR_JOURNEY_PROGRESS_EVENT,
  NOOR_READING_PROGRESS_EVENT,
  NOOR_REFLECTION_NOTES_EVENT,
  readReflectionNotes,
  type GuidancePathProgress,
  type NoorLightStats,
  type ReflectionNote
} from '../lib/local-store';

const emptyStats: NoorLightStats = {
  bookmarkCount: 0,
  readingSessions: 0,
  journeyCount: 0,
  journeyStepsCompleted: 0,
  reflectionCount: 0,
  guidancePathCount: 0,
  guidanceStepsCompleted: 0
};

export function NoorHomeDashboard() {
  const [stats, setStats] = useState<NoorLightStats>(emptyStats);
  const [latestPath, setLatestPath] = useState<GuidancePathProgress | null>(null);
  const [latestNote, setLatestNote] = useState<ReflectionNote | null>(null);

  function refresh() {
    setStats(getNoorLightStats());
    setLatestPath(getLatestGuidancePath());
    setLatestNote(readReflectionNotes()[0] ?? null);
  }

  useEffect(() => {
    refresh();
    const events = [
      NOOR_BOOKMARKS_EVENT,
      NOOR_READING_PROGRESS_EVENT,
      NOOR_JOURNEY_PROGRESS_EVENT,
      NOOR_REFLECTION_NOTES_EVENT,
      NOOR_GUIDANCE_PATHS_EVENT
    ];
    events.forEach((eventName) => window.addEventListener(eventName, refresh));
    return () => events.forEach((eventName) => window.removeEventListener(eventName, refresh));
  }, []);

  const pathPercent = getGuidancePathCompletionPercent(latestPath);

  return (
    <section className="noor-dashboard-grid" aria-label="NOOR home dashboard">
      <NoorCard variant="gold" className="noor-dashboard-main-card">
        <span className="noor-badge emerald">Continue my journey</span>
        {latestPath ? (
          <>
            <h2>{latestPath.topicLabel}</h2>
            <p className="noor-subtitle">
              {latestPath.completedStepIds.length}/{latestPath.totalSteps} guidance steps completed · {pathPercent}% complete.
            </p>
            <div className="noor-progress-bar" aria-label={`${pathPercent}% complete`}>
              <span style={{ width: `${pathPercent}%` }} />
            </div>
            <div className="noor-card-actions">
              <a className="noor-button" href={latestPath.href}>Resume path</a>
              <span className="noor-muted noor-small">Updated {formatRelativeNoorDate(latestPath.updatedAt)}</span>
            </div>
          </>
        ) : (
          <>
            <h2>Start from what your heart needs today.</h2>
            <p className="noor-subtitle">
              Choose a topic, read the Quran, understand with tafseer, reflect with Hadith and save one response.
            </p>
            <a className="noor-button" href="/explore">Find guidance</a>
          </>
        )}
      </NoorCard>

      <NoorCard variant="soft" className="noor-dashboard-stats-card">
        <span className="noor-kicker">Your saved light</span>
        <div className="noor-mini-grid">
          <div className="noor-stat">
            <strong>{stats.readingSessions}</strong>
            <span>reading moments</span>
          </div>
          <div className="noor-stat">
            <strong>{stats.guidancePathCount}</strong>
            <span>guidance paths</span>
          </div>
          <div className="noor-stat">
            <strong>{stats.reflectionCount}</strong>
            <span>reflections</span>
          </div>
          <div className="noor-stat">
            <strong>{stats.bookmarkCount}</strong>
            <span>bookmarks</span>
          </div>
        </div>
      </NoorCard>

      <NoorCard className="noor-dashboard-note-card">
        <div className="noor-row">
          <span className="noor-badge gold">Latest reflection</span>
          <a className="noor-reference" href="/library">Library</a>
        </div>
        {latestNote ? (
          <>
            <strong>{latestNote.topicLabel}</strong>
            <p className="noor-subtitle">{latestNote.note}</p>
            {latestNote.action ? <p className="noor-muted noor-small">Action: {latestNote.action}</p> : null}
          </>
        ) : (
          <p className="noor-subtitle">No reflection yet. Save one from a guidance topic page.</p>
        )}
      </NoorCard>
    </section>
  );
}
