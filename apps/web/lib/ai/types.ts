export type AiActionMode = 'reflection' | 'teaching-notes' | 'lesson';

export type AiWritingStyle =
  | 'clear-modern'
  | 'gentle-kitab'
  | 'deep-kitab'
  | 'academic-teaching';

export type AiRelatedAyah = {
  reference: string;
  arabic?: string;
  translation?: string;
  reason?: string;
};

export type AiRelatedHadith = {
  reference: string;
  collection?: string;
  text?: string;
  authenticity?: string;
  reason?: string;
};

export type AiTafseerContext = {
  sourceLabel: string;
  language?: string;
  title?: string;
  body: string;
  reference?: string;
};

export type AiSourceContext = {
  surface: 'quran' | 'tafseer';
  reference: string;
  surah: number;
  fromAyah: number;
  toAyah: number;
  arabic: string;
  translations?: Array<{
    language: string;
    text: string;
  }>;
  tafseer?: AiTafseerContext;
  relatedAyat?: AiRelatedAyah[];
  relatedHadith?: AiRelatedHadith[];
  notes?: string[];
};

export type AiReflectionRequest = {
  mode: AiActionMode;
  outputLanguage: string;
  writingStyle: AiWritingStyle;
  context: AiSourceContext;
};

export type AiReflectionResponse = {
  ok: boolean;
  configured: boolean;
  mode: AiActionMode;
  outputLanguage: string;
  writingStyle: AiWritingStyle;
  text: string;
  sourcesUsed: string[];
  warning?: string;
};

export const AI_ACTIONS: Array<{
  mode: AiActionMode;
  label: string;
  helper: string;
}> = [
  {
    mode: 'reflection',
    label: 'Generate Reflection',
    helper: 'Personal reflection questions and practical response based on supplied sources.'
  },
  {
    mode: 'teaching-notes',
    label: 'Generate Ishraq Notes',
    helper: 'Teacher-friendly notes, key points, discussion prompts, and source reminders.'
  },
  {
    mode: 'lesson',
    label: 'Prepare Lesson',
    helper: 'A short halaqah or classroom lesson plan from the supplied ayah and tafseer.'
  }
];

export const AI_WRITING_STYLE_OPTIONS: Array<{
  id: AiWritingStyle;
  label: string;
  shortLabel: string;
  helper: string;
}> = [
  {
    id: 'clear-modern',
    label: 'Clear Modern',
    shortLabel: 'Modern',
    helper: 'Warm, clear, readable language for everyday learners.'
  },
  {
    id: 'gentle-kitab',
    label: 'Gentle Kitab Style',
    shortLabel: 'Gentle Kitab',
    helper: 'Traditional and soulful wording while remaining easy to understand.'
  },
  {
    id: 'deep-kitab',
    label: 'Deep Kitab Style',
    shortLabel: 'Deep Kitab',
    helper: 'More literary, classical, and ceremonial. Best for advanced teaching drafts.'
  },
  {
    id: 'academic-teaching',
    label: 'Academic Teaching',
    shortLabel: 'Academic',
    helper: 'Structured, source-aware teaching language for notes and lessons.'
  }
];

export function isAiActionMode(value: unknown): value is AiActionMode {
  return value === 'reflection' || value === 'teaching-notes' || value === 'lesson';
}

export function isAiWritingStyle(value: unknown): value is AiWritingStyle {
  return value === 'clear-modern'
    || value === 'gentle-kitab'
    || value === 'deep-kitab'
    || value === 'academic-teaching';
}

export function getAiWritingStyleLabel(value: AiWritingStyle | string | undefined) {
  return AI_WRITING_STYLE_OPTIONS.find((style) => style.id === value)?.label ?? 'Clear Modern';
}

