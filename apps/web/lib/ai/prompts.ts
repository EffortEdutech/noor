import type { AiActionMode, AiSourceContext, AiWritingStyle } from './types';
import { getAiWritingStyleLabel } from './types';
import { ISLAMIC_AI_DISCLAIMER, ISLAMIC_AI_GUARDRAILS } from './islamic-ai-guardrails';

const MODE_INSTRUCTIONS: Record<AiActionMode, string> = {
  reflection: [
    'Generate personal reflection support.',
    'Use this structure:',
    '1. Source-based summary',
    '2. Reflection questions',
    '3. Practical action',
    '4. Reminder or caution',
    '5. Sources used'
  ].join('\n'),
  'teaching-notes': [
    'Generate teacher preparation notes.',
    'Use this structure:',
    '1. Main teaching point',
    '2. Key Arabic phrase',
    '3. Explanation from available tafseer',
    '4. Related evidence from supplied sources',
    '5. Discussion questions',
    '6. Sources used'
  ].join('\n'),
  lesson: [
    'Prepare a short lesson plan.',
    'Use this structure:',
    '1. Lesson title',
    '2. Learning objective',
    '3. Opening question',
    '4. Quran passage',
    '5. Tafseer explanation from supplied source',
    '6. Related hadith or related ayat if supplied',
    '7. Activity or reflection',
    '8. Closing reminder',
    '9. Sources used'
  ].join('\n')
};

const STYLE_INSTRUCTIONS: Record<AiWritingStyle, string> = {
  'clear-modern': [
    'Writing style: Clear Modern.',
    'Use warm, plain, readable language.',
    'Avoid archaic wording unless the source quotation itself contains it.',
    'Prioritize clarity, humility, and practical benefit.'
  ].join('\n'),
  'gentle-kitab': [
    'Writing style: Gentle Kitab Style.',
    'Use a respectful, traditional, soulful tone without becoming difficult to understand.',
    'For Bahasa Melayu or Bahasa Indonesia, you may use light classical flavour such as "Maka" or "Bahawasanya" sparingly where natural.',
    'For English, use solemn and dignified phrasing, but do not overuse "thee", "thou", or archaic endings.',
    'For Arabic, Urdu, Tamil, Chinese, Japanese, or Korean, use respectful literary register where appropriate.',
    'The style may beautify expression only; it must not change meaning or add unsupported religious claims.'
  ].join('\n'),
  'deep-kitab': [
    'Writing style: Deep Kitab Style.',
    'Use a more classical, literary, high-register tone suitable for advanced teaching drafts.',
    'For Bahasa Melayu, a controlled Gaya Kitab Jawi feel is allowed, including traditional connectors such as "Syahdan", "Maka", and "Bahawasanya" only when natural.',
    'For English, a solemn classical theological tone is allowed, but avoid making the output sound like revelation or scripture.',
    'For other languages, use a high, respectful, literary or devotional register while preserving meaning.',
    'Do not sacrifice clarity, source accuracy, or Islamic guardrails for style.'
  ].join('\n'),
  'academic-teaching': [
    'Writing style: Academic Teaching.',
    'Use structured, source-aware, teacher-friendly language.',
    'Prefer numbered points, short headings, and precise references.',
    'Avoid poetic expansion unless directly useful for teaching.'
  ].join('\n')
};

function compact(value: string | undefined, maxLength = 3200) {
  const text = value?.replace(/\s+/g, ' ').trim() ?? '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function formatTranslations(context: AiSourceContext) {
  const translations = context.translations?.filter((item) => item.text.trim()) ?? [];
  if (!translations.length) return 'No translation supplied.';

  return translations.map((item) => `- ${item.language}: ${compact(item.text, 700)}`).join('\n');
}

function formatRelatedAyat(context: AiSourceContext) {
  const items = context.relatedAyat?.filter((item) => item.reference.trim()) ?? [];
  if (!items.length) return 'No related ayat supplied.';

  return items.map((item) => [
    `- ${item.reference}`,
    item.arabic ? `  Arabic: ${compact(item.arabic, 700)}` : '',
    item.translation ? `  Translation: ${compact(item.translation, 700)}` : '',
    item.reason ? `  Reason: ${compact(item.reason, 300)}` : ''
  ].filter(Boolean).join('\n')).join('\n');
}

function formatRelatedHadith(context: AiSourceContext) {
  const items = context.relatedHadith?.filter((item) => item.reference.trim()) ?? [];
  if (!items.length) return 'No related hadith supplied.';

  return items.map((item) => [
    `- ${item.collection ? `${item.collection} ` : ''}${item.reference}`,
    item.authenticity ? `  Authenticity from source data: ${item.authenticity}` : '',
    item.text ? `  Text: ${compact(item.text, 1000)}` : '',
    item.reason ? `  Reason: ${compact(item.reason, 300)}` : ''
  ].filter(Boolean).join('\n')).join('\n');
}

function formatTafseer(context: AiSourceContext) {
  if (!context.tafseer?.body) return 'No tafseer entry supplied.';

  return [
    `Source: ${context.tafseer.sourceLabel}`,
    context.tafseer.reference ? `Reference: ${context.tafseer.reference}` : '',
    context.tafseer.language ? `Language: ${context.tafseer.language}` : '',
    context.tafseer.title ? `Title: ${context.tafseer.title}` : '',
    `Body: ${compact(context.tafseer.body, 4200)}`
  ].filter(Boolean).join('\n');
}

export function buildIslamicAiSystemPrompt() {
  return ISLAMIC_AI_GUARDRAILS;
}

export function buildIslamicAiUserPrompt(
  mode: AiActionMode,
  outputLanguage: string,
  writingStyle: AiWritingStyle,
  context: AiSourceContext
) {
  const range = context.fromAyah === context.toAyah
    ? `${context.surah}:${context.fromAyah}`
    : `${context.surah}:${context.fromAyah}-${context.toAyah}`;

  return [
    `Output language: ${outputLanguage}`,
    `Writing style profile: ${getAiWritingStyleLabel(writingStyle)}`,
    '',
    STYLE_INSTRUCTIONS[writingStyle],
    '',
    MODE_INSTRUCTIONS[mode],
    '',
    'Important opening notice to include briefly:',
    ISLAMIC_AI_DISCLAIMER,
    '',
    'Selected source context:',
    `Surface: ${context.surface}`,
    `Reference: ${context.reference || range}`,
    `Ayah range: ${range}`,
    '',
    'Quran Arabic:',
    compact(context.arabic, 2200),
    '',
    'Translations:',
    formatTranslations(context),
    '',
    'Tafseer supplied:',
    formatTafseer(context),
    '',
    'Related ayat supplied:',
    formatRelatedAyat(context),
    '',
    'Related hadith supplied:',
    formatRelatedHadith(context),
    '',
    'Additional notes:',
    context.notes?.length ? context.notes.map((note) => `- ${compact(note, 400)}`).join('\n') : 'No additional notes supplied.',
    '',
    'Final requirements:',
    '- Use only the supplied context above.',
    '- Do not add unsupported references.',
    '- If related hadith or related ayat are not supplied, say they were not supplied.',
    '- Do not call this tafseer or fatwa.',
    '- Keep the output useful for learners and teachers.',
    '- The selected writing style is expression only; never allow style to change meaning.'
  ].join('\n');
}

export function buildNotConfiguredResponse(
  mode: AiActionMode,
  outputLanguage: string,
  writingStyle: AiWritingStyle,
  context: AiSourceContext
) {
  const label = mode === 'reflection'
    ? 'Reflection'
    : mode === 'teaching-notes'
      ? 'Ishraq notes'
      : 'Lesson preparation';

  return [
    `${label} is ready to generate after OpenAI is configured on the server.`,
    '',
    'Status: OPENAI_API_KEY is not set.',
    '',
    'Source context prepared:',
    `- Reference: ${context.reference}`,
    `- Quran passage: ${context.arabic ? 'available' : 'missing'}`,
    `- Tafseer: ${context.tafseer?.body ? context.tafseer.sourceLabel : 'not supplied'}`,
    `- Related ayat: ${context.relatedAyat?.length ?? 0} supplied`,
    `- Related hadith: ${context.relatedHadith?.length ?? 0} supplied`,
    `- Requested language: ${outputLanguage}`,
    `- Writing style: ${getAiWritingStyleLabel(writingStyle)}`,
    '',
    'Add OPENAI_API_KEY and OPENAI_MODEL in server environment variables, then restart the app.'
  ].join('\n');
}

