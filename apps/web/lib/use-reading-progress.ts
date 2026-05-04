'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  NOOR_BOOKMARKS_EVENT,
  NOOR_GUIDANCE_PATHS_EVENT,
  NOOR_JOURNEY_PROGRESS_EVENT,
  NOOR_READING_PROGRESS_EVENT,
  NOOR_REFLECTION_NOTES_EVENT,
  formatRelativeNoorDate,
  getNoorLightStats,
  readReadingHistory,
  readReadingProgress,
  recordReadingProgress,
  type NoorLightStats,
  type ReadingHistoryItem,
  type ReadingProgress
} from './local-store';

const emptyStats: NoorLightStats = {
  bookmarkCount: 0,
  readingSessions: 0,
  journeyCount: 0,
  journeyStepsCompleted: 0,
  reflectionCount: 0,
  guidancePathCount: 0,
  guidanceStepsCompleted: 0
};

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [stats, setStats] = useState<NoorLightStats>(emptyStats);

  const refresh = useCallback(() => {
    setProgress(readReadingProgress());
    setHistory(readReadingHistory());
    setStats(getNoorLightStats());
  }, []);

  useEffect(() => {
    refresh();

    const events = [
      NOOR_READING_PROGRESS_EVENT,
      NOOR_BOOKMARKS_EVENT,
      NOOR_JOURNEY_PROGRESS_EVENT,
      NOOR_REFLECTION_NOTES_EVENT,
      NOOR_GUIDANCE_PATHS_EVENT,
      'storage'
    ];

    events.forEach((eventName) => window.addEventListener(eventName, refresh));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, refresh));
    };
  }, [refresh]);

  const markCurrent = useCallback((input: Omit<ReadingProgress, 'updatedAt' | 'readCount'>) => {
    const next = recordReadingProgress(input);
    setProgress(next);
    setHistory(readReadingHistory());
    setStats(getNoorLightStats());
    return next;
  }, []);

  return {
    progress,
    history,
    stats,
    markCurrent,
    refresh,
    lastReadLabel: formatRelativeNoorDate(progress?.updatedAt)
  };
}
