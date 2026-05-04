import type { BookmarkItem } from '@noor/content';

export const NOOR_BOOKMARKS_KEY = 'noor.bookmarks.v1';
export const NOOR_READING_PROGRESS_KEY = 'noor.readingProgress.v1';
export const NOOR_READING_HISTORY_KEY = 'noor.readingHistory.v1';
export const NOOR_JOURNEY_PROGRESS_KEY = 'noor.journeyProgress.v1';
export const NOOR_REFLECTION_NOTES_KEY = 'noor.reflectionNotes.v1';
export const NOOR_GUIDANCE_PATHS_KEY = 'noor.guidancePaths.v1';

export const NOOR_BOOKMARKS_EVENT = 'noor:bookmarks-updated';
export const NOOR_READING_PROGRESS_EVENT = 'noor:reading-progress-updated';
export const NOOR_JOURNEY_PROGRESS_EVENT = 'noor:journey-progress-updated';
export const NOOR_REFLECTION_NOTES_EVENT = 'noor:reflection-notes-updated';
export const NOOR_GUIDANCE_PATHS_EVENT = 'noor:guidance-paths-updated';

export type ReadingProgress = {
  surah: number;
  ayah: number;
  key: string;
  title: string;
  subtitle?: string;
  href: string;
  updatedAt: string;
  readCount: number;
};

export type ReadingHistoryItem = ReadingProgress & {
  sessionId: string;
};

export type JourneyProgress = {
  journeyId: string;
  journeyTitle: string;
  href: string;
  completedStepIds: string[];
  currentStepId?: string;
  totalSteps: number;
  updatedAt: string;
};

export type ToggleJourneyStepInput = {
  journeyId: string;
  journeyTitle: string;
  href: string;
  stepId: string;
  stepIds: string[];
  totalSteps: number;
};

export type ReflectionNote = {
  id: string;
  topicId: string;
  topicLabel: string;
  prompt: string;
  note: string;
  action?: string;
  sourceHref?: string;
  sourceLabel?: string;
  createdAt: string;
  updatedAt: string;
};

export type GuidancePathProgress = {
  topicId: string;
  topicLabel: string;
  href: string;
  completedStepIds: string[];
  currentStepId?: string;
  totalSteps: number;
  intention?: string;
  lastReflection?: string;
  updatedAt: string;
};

export type SaveReflectionNoteInput = {
  topicId: string;
  topicLabel: string;
  prompt: string;
  note: string;
  action?: string;
  sourceHref?: string;
  sourceLabel?: string;
};

export type SaveGuidancePathInput = {
  topicId: string;
  topicLabel: string;
  href: string;
  completedStepIds: string[];
  stepIds: string[];
  intention?: string;
  lastReflection?: string;
};

export type NoorLightStats = {
  bookmarkCount: number;
  readingSessions: number;
  journeyCount: number;
  journeyStepsCompleted: number;
  reflectionCount: number;
  guidancePathCount: number;
  guidanceStepsCompleted: number;
  lastReadAt?: string;
};

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function safeReadJson<T>(key: string, fallback: T): T {
  if (!hasBrowserStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeWriteJson<T>(key: string, value: T) {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function emitNoorEvent(eventName: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(eventName));
}

export function readBookmarks(): BookmarkItem[] {
  return safeReadJson<BookmarkItem[]>(NOOR_BOOKMARKS_KEY, []);
}

export function writeBookmarks(items: BookmarkItem[]) {
  safeWriteJson(NOOR_BOOKMARKS_KEY, items);
  emitNoorEvent(NOOR_BOOKMARKS_EVENT);
}

export function removeBookmark(id: string) {
  const next = readBookmarks().filter((bookmark) => bookmark.id !== id);
  writeBookmarks(next);
  return next;
}

export function readReadingProgress(): ReadingProgress | null {
  return safeReadJson<ReadingProgress | null>(NOOR_READING_PROGRESS_KEY, null);
}

export function writeReadingProgress(progress: ReadingProgress) {
  safeWriteJson(NOOR_READING_PROGRESS_KEY, progress);
  emitNoorEvent(NOOR_READING_PROGRESS_EVENT);
}

export function readReadingHistory(): ReadingHistoryItem[] {
  return safeReadJson<ReadingHistoryItem[]>(NOOR_READING_HISTORY_KEY, []);
}

export function writeReadingHistory(items: ReadingHistoryItem[]) {
  safeWriteJson(NOOR_READING_HISTORY_KEY, items.slice(0, 50));
  emitNoorEvent(NOOR_READING_PROGRESS_EVENT);
}

export function recordReadingProgress(input: Omit<ReadingProgress, 'updatedAt' | 'readCount'>) {
  const current = readReadingProgress();
  const now = new Date().toISOString();
  const next: ReadingProgress = {
    ...input,
    updatedAt: now,
    readCount: current?.key === input.key ? current.readCount + 1 : 1
  };

  writeReadingProgress(next);

  const history = readReadingHistory();
  const deduped = history.filter((item) => item.key !== input.key);
  writeReadingHistory([
    {
      ...next,
      sessionId: `${input.key}-${Date.now()}`
    },
    ...deduped
  ]);

  return next;
}

export function readJourneyProgressMap(): Record<string, JourneyProgress> {
  return safeReadJson<Record<string, JourneyProgress>>(NOOR_JOURNEY_PROGRESS_KEY, {});
}

export function writeJourneyProgressMap(items: Record<string, JourneyProgress>) {
  safeWriteJson(NOOR_JOURNEY_PROGRESS_KEY, items);
  emitNoorEvent(NOOR_JOURNEY_PROGRESS_EVENT);
}

export function getJourneyCompletionPercent(progress?: JourneyProgress | null) {
  if (!progress || progress.totalSteps <= 0) return 0;
  return Math.round((progress.completedStepIds.length / progress.totalSteps) * 100);
}

export function toggleJourneyStep(input: ToggleJourneyStepInput) {
  const map = readJourneyProgressMap();
  const current = map[input.journeyId];
  const completed = new Set(current?.completedStepIds ?? []);

  if (completed.has(input.stepId)) {
    completed.delete(input.stepId);
  } else {
    completed.add(input.stepId);
  }

  const completedStepIds = input.stepIds.filter((stepId) => completed.has(stepId));
  const currentStepId =
    input.stepIds.find((stepId) => !completedStepIds.includes(stepId)) ??
    input.stepIds[input.stepIds.length - 1] ??
    input.stepId;

  const next: JourneyProgress = {
    journeyId: input.journeyId,
    journeyTitle: input.journeyTitle,
    href: input.href,
    completedStepIds,
    currentStepId,
    totalSteps: input.totalSteps,
    updatedAt: new Date().toISOString()
  };

  const nextMap = {
    ...map,
    [input.journeyId]: next
  };

  writeJourneyProgressMap(nextMap);
  return next;
}

export function resetJourneyProgress(journeyId: string) {
  const map = readJourneyProgressMap();
  const next = { ...map };
  delete next[journeyId];
  writeJourneyProgressMap(next);
  return next;
}

export function getJourneyProgressItems() {
  return Object.values(readJourneyProgressMap()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function readReflectionNotes(): ReflectionNote[] {
  return safeReadJson<ReflectionNote[]>(NOOR_REFLECTION_NOTES_KEY, []);
}

export function writeReflectionNotes(items: ReflectionNote[]) {
  safeWriteJson(NOOR_REFLECTION_NOTES_KEY, items.slice(0, 100));
  emitNoorEvent(NOOR_REFLECTION_NOTES_EVENT);
}

export function saveReflectionNote(input: SaveReflectionNoteInput) {
  const now = new Date().toISOString();
  const existing = readReflectionNotes();
  const next: ReflectionNote = {
    id: `${input.topicId}-${Date.now()}`,
    topicId: input.topicId,
    topicLabel: input.topicLabel,
    prompt: input.prompt,
    note: input.note.trim(),
    action: input.action?.trim() || undefined,
    sourceHref: input.sourceHref,
    sourceLabel: input.sourceLabel,
    createdAt: now,
    updatedAt: now
  };

  writeReflectionNotes([next, ...existing]);
  return next;
}

export function deleteReflectionNote(id: string) {
  const next = readReflectionNotes().filter((note) => note.id !== id);
  writeReflectionNotes(next);
  return next;
}

export function readGuidancePathMap(): Record<string, GuidancePathProgress> {
  return safeReadJson<Record<string, GuidancePathProgress>>(NOOR_GUIDANCE_PATHS_KEY, {});
}

export function writeGuidancePathMap(items: Record<string, GuidancePathProgress>) {
  safeWriteJson(NOOR_GUIDANCE_PATHS_KEY, items);
  emitNoorEvent(NOOR_GUIDANCE_PATHS_EVENT);
}

export function saveGuidancePathProgress(input: SaveGuidancePathInput) {
  const completedStepIds = input.stepIds.filter((stepId) => input.completedStepIds.includes(stepId));
  const currentStepId =
    input.stepIds.find((stepId) => !completedStepIds.includes(stepId)) ??
    input.stepIds[input.stepIds.length - 1];

  const next: GuidancePathProgress = {
    topicId: input.topicId,
    topicLabel: input.topicLabel,
    href: input.href,
    completedStepIds,
    currentStepId,
    totalSteps: input.stepIds.length,
    intention: input.intention,
    lastReflection: input.lastReflection,
    updatedAt: new Date().toISOString()
  };

  const map = readGuidancePathMap();
  writeGuidancePathMap({
    ...map,
    [input.topicId]: next
  });
  return next;
}

export function getGuidancePathItems() {
  return Object.values(readGuidancePathMap()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getLatestGuidancePath() {
  return getGuidancePathItems()[0] ?? null;
}

export function getGuidancePathCompletionPercent(progress?: GuidancePathProgress | null) {
  if (!progress || progress.totalSteps <= 0) return 0;
  return Math.round((progress.completedStepIds.length / progress.totalSteps) * 100);
}

export function getNoorLightStats(): NoorLightStats {
  const bookmarks = readBookmarks();
  const history = readReadingHistory();
  const progress = readReadingProgress();
  const journeyItems = getJourneyProgressItems();
  const reflectionNotes = readReflectionNotes();
  const guidancePaths = getGuidancePathItems();

  return {
    bookmarkCount: bookmarks.length,
    readingSessions: history.length,
    journeyCount: journeyItems.length,
    journeyStepsCompleted: journeyItems.reduce((total, item) => total + item.completedStepIds.length, 0),
    reflectionCount: reflectionNotes.length,
    guidancePathCount: guidancePaths.length,
    guidanceStepsCompleted: guidancePaths.reduce((total, item) => total + item.completedStepIds.length, 0),
    lastReadAt: progress?.updatedAt
  };
}

export function formatRelativeNoorDate(value?: string) {
  if (!value) return 'Not started yet';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
