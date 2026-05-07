import type { AiActionMode, AiSourceContext, AiWritingStyle } from './ai/types';

export const NOOR_TALAB_RESULTS_KEY = 'noor.talab.results.v1';
export const NOOR_TALAB_RESULTS_EVENT = 'noor:talab-results-updated';
export const NOOR_TALAB_RESULTS_LIMIT = 50;

export type TalabSavedResult = {
  id: string;
  savedAt: string;
  reference: string;
  sourceHref?: string;
  surface: AiSourceContext['surface'];
  mode: AiActionMode;
  outputLanguage: string;
  writingStyle: AiWritingStyle;
  text: string;
  sourcesUsed: string[];
};

export type SaveTalabResultInput = Omit<TalabSavedResult, 'id' | 'savedAt'>;

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emitTalabResultsEvent() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOOR_TALAB_RESULTS_EVENT));
}

function safeReadTalabJson() {
  if (!hasBrowserStorage()) return [];

  try {
    const raw = window.localStorage.getItem(NOOR_TALAB_RESULTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as TalabSavedResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWriteTalabJson(items: TalabSavedResult[]) {
  if (!hasBrowserStorage()) return;

  window.localStorage.setItem(
    NOOR_TALAB_RESULTS_KEY,
    JSON.stringify(items.slice(0, NOOR_TALAB_RESULTS_LIMIT))
  );
  emitTalabResultsEvent();
}

export function readTalabResults() {
  return safeReadTalabJson().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

export function saveTalabResult(input: SaveTalabResultInput) {
  const nextItem: TalabSavedResult = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString()
  };

  const existing = readTalabResults();
  safeWriteTalabJson([nextItem, ...existing]);

  return nextItem;
}

export function deleteTalabResult(id: string) {
  const next = readTalabResults().filter((item) => item.id !== id);
  safeWriteTalabJson(next);
  return next;
}

export function clearTalabResults() {
  safeWriteTalabJson([]);
  return [];
}

export function slugifyTalabFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'talab-note';
}

export function downloadTalabTextFile(filename: string, text: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => window.URL.revokeObjectURL(url), 500);
  return true;
}
