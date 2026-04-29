'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  NOOR_READING_PROGRESS_EVENT,
  formatRelativeNoorDate,
  getNoorLightStats,
  readReadingHistory,
  readReadingProgress,
  recordReadingProgress,
  type NoorLightStats,
  type ReadingHistoryItem,
  type ReadingProgress
} from './local-store';

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [stats, setStats] = useState<NoorLightStats>({
    bookmarkCount: 0,
    readingSessions: 0,
    journeyCount: 0,
    journeyStepsCompleted: 0
  });

  const refresh = useCallback(() => {
    setProgress(readReadingProgress());
    setHistory(readReadingHistory());
    setStats(getNoorLightStats());
  }, []);

  useEffect(() => {
    refresh();

    window.addEventListener(NOOR_READING_PROGRESS_EVENT, refresh);
    window.addEventListener('noor:bookmarks-updated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(NOOR_READING_PROGRESS_EVENT, refresh);
      window.removeEventListener('noor:bookmarks-updated', refresh);
      window.removeEventListener('storage', refresh);
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
