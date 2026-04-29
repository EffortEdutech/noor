'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getJourneyCompletionPercent,
  NOOR_JOURNEY_PROGRESS_EVENT,
  readJourneyProgressMap,
  resetJourneyProgress,
  toggleJourneyStep,
  type JourneyProgress,
  type ToggleJourneyStepInput
} from './local-store';

export function useJourneyProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, JourneyProgress>>({});

  const refresh = useCallback(() => {
    setProgressMap(readJourneyProgressMap());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(NOOR_JOURNEY_PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(NOOR_JOURNEY_PROGRESS_EVENT, refresh);
  }, [refresh]);

  const progressItems = useMemo(
    () =>
      Object.values(progressMap).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [progressMap]
  );

  const getJourneyProgress = useCallback(
    (journeyId: string) => progressMap[journeyId] ?? null,
    [progressMap]
  );

  const getJourneyPercent = useCallback(
    (journeyId: string) => getJourneyCompletionPercent(progressMap[journeyId]),
    [progressMap]
  );

  const isStepComplete = useCallback(
    (journeyId: string, stepId: string) => Boolean(progressMap[journeyId]?.completedStepIds.includes(stepId)),
    [progressMap]
  );

  const toggleStep = useCallback((input: ToggleJourneyStepInput) => {
    const next = toggleJourneyStep(input);
    refresh();
    return next;
  }, [refresh]);

  const resetJourney = useCallback((journeyId: string) => {
    const next = resetJourneyProgress(journeyId);
    setProgressMap(next);
    return next;
  }, []);

  return {
    progressMap,
    progressItems,
    getJourneyProgress,
    getJourneyPercent,
    isStepComplete,
    toggleStep,
    resetJourney
  };
}
