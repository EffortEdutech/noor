import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function write(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), value, 'utf8');
}

function registerPackageScripts() {
  const pkg = JSON.parse(read('package.json'));
  pkg.scripts = pkg.scripts ?? {};
  pkg.scripts['check:guidance-topic-detail-journey'] = 'node scripts/check-sprint28-6-guidance-topic-detail-journey.mjs';
  pkg.scripts['check:sprint28-6'] = 'pnpm check:sprint28-5 && pnpm check:guidance-topic-detail-journey && pnpm typecheck && pnpm build';
  write('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
}

function appendSearchJourneyModel() {
  const file = 'packages/noor-search/src/index.ts';
  const current = read(file);
  if (current.includes('NOOR_GUIDANCE_TOPIC_JOURNEYS')) return;

  const block = String.raw`

export type NoorGuidanceJourneyStep = {
  id: 'quran' | 'tafseer' | 'hadith';
  label: string;
  title: string;
  body: string;
  href: string;
  actionLabel: string;
};

export type NoorGuidanceTopicJourney = {
  id: string;
  label: string;
  arabicKeyword: string;
  prompt: string;
  summary: string;
  question: string;
  action: string;
  suggestedSearches: string[];
  readerSteps: NoorGuidanceJourneyStep[];
};

function buildTopicReaderSteps(topicId: string, quranHref: string, tafseerHref: string): NoorGuidanceJourneyStep[] {
  const encodedTopic = encodeURIComponent(topicId);
  return [
    {
      id: 'quran',
      label: 'Read',
      title: 'Begin with the Quran',
      body: 'Start by reading slowly. Let the ayah set the direction before moving into explanation or reflection.',
      href: quranHref,
      actionLabel: 'Open Quran reader'
    },
    {
      id: 'tafseer',
      label: 'Understand',
      title: 'Continue with Tafseer',
      body: 'Read the explanation so the topic is understood with care, context and humility.',
      href: tafseerHref,
      actionLabel: 'Open Tafseer understanding'
    },
    {
      id: 'hadith',
      label: 'Reflect',
      title: 'Reflect with Hadith',
      body: 'Move into Prophetic reminders and choose one action that can be practiced today.',
      href: '/learn/hadith?mode=reflect&topic=' + encodedTopic + '#hadith-reader',
      actionLabel: 'Open Hadith reader'
    }
  ];
}

export const NOOR_GUIDANCE_TOPIC_JOURNEYS: NoorGuidanceTopicJourney[] = [
  {
    id: 'mercy',
    label: 'Mercy',
    arabicKeyword: 'رحمة',
    prompt: 'When I need hope in Allah’s mercy',
    summary: 'A guided path for hope, compassion, forgiveness and returning to Allah.',
    question: 'Where do I need to remember that Allah’s mercy is wider than my fear?',
    action: 'Make one sincere du‘a for mercy, then show mercy to one person before the day ends.',
    suggestedSearches: ['mercy', 'forgiveness', 'hope'],
    readerSteps: buildTopicReaderSteps('mercy', '/learn/quran/1#ayah-1', '/learn/tafseer?surah=1#ayah-1')
  },
  {
    id: 'patience',
    label: 'Patience',
    arabicKeyword: 'صبر',
    prompt: 'When I am tested and need sabr',
    summary: 'A guided path for hardship, steadiness, trials and trust.',
    question: 'What test needs patience from me today instead of panic or complaint?',
    action: 'Name the test, pause before reacting, and make one patient choice with your words or actions.',
    suggestedSearches: ['patience', 'sabr', 'trial'],
    readerSteps: buildTopicReaderSteps('patience', '/learn/quran', '/learn/tafseer')
  },
  {
    id: 'rizq',
    label: 'Rizq',
    arabicKeyword: 'رزق',
    prompt: 'When I worry about provision',
    summary: 'A guided path for sustenance, trust, gratitude and effort.',
    question: 'Where can I combine trust in Allah with honest effort today?',
    action: 'Write one blessing you already have, then take one responsible step toward your work or provision.',
    suggestedSearches: ['rizq', 'provision', 'gratitude'],
    readerSteps: buildTopicReaderSteps('rizq', '/learn/quran', '/learn/tafseer')
  },
  {
    id: 'intention',
    label: 'Intention',
    arabicKeyword: 'نية',
    prompt: 'When I want to purify my intention',
    summary: 'A guided path for sincerity, deeds, worship and the heart.',
    question: 'Which action today needs to be returned from people’s praise back to Allah?',
    action: 'Renew your intention quietly before one task, and avoid announcing it unless there is benefit.',
    suggestedSearches: ['intention', 'sincerity', 'heart'],
    readerSteps: buildTopicReaderSteps('intention', '/learn/quran/112', '/learn/tafseer?surah=112')
  },
  {
    id: 'protection',
    label: 'Protection',
    arabicKeyword: 'حفظ',
    prompt: 'When I seek refuge and safety',
    summary: 'A guided path for refuge, remembrance, evil and safety.',
    question: 'What fear should I bring back to Allah through refuge and remembrance?',
    action: 'Read a short protection reminder and make one du‘a for safety with presence.',
    suggestedSearches: ['protection', 'refuge', 'remembrance'],
    readerSteps: buildTopicReaderSteps('protection', '/learn/quran/113#ayah-1', '/learn/tafseer?surah=113#ayah-1')
  },
  {
    id: 'prayer',
    label: 'Prayer',
    arabicKeyword: 'صلاة',
    prompt: 'When I want to return to prayer',
    summary: 'A guided path for salah, du‘a, guidance and nearness.',
    question: 'Which prayer can I improve today through presence, timing or humility?',
    action: 'Choose one prayer today to perform more slowly, with one du‘a after it.',
    suggestedSearches: ['prayer', 'salah', 'dua'],
    readerSteps: buildTopicReaderSteps('prayer', '/learn/quran/1#ayah-5', '/learn/tafseer?surah=1#ayah-5')
  },
  {
    id: 'repentance',
    label: 'Repentance',
    arabicKeyword: 'توبة',
    prompt: 'When I want to come back to Allah',
    summary: 'A guided path for tawbah, forgiveness, humility and renewal.',
    question: 'What can I leave, repair or ask forgiveness for today?',
    action: 'Make sincere istighfar, stop one harmful action, and repair one right if you are able.',
    suggestedSearches: ['repentance', 'tawbah', 'forgiveness'],
    readerSteps: buildTopicReaderSteps('repentance', '/learn/quran/1#ayah-3', '/learn/tafseer?surah=1#ayah-3')
  }
];

export function getNoorGuidanceTopicJourney(topicId: string) {
  const normalized = topicId.trim().toLowerCase();
  return NOOR_GUIDANCE_TOPIC_JOURNEYS.find((topic) => topic.id === normalized);
}
`;

  write(file, `${current.trimEnd()}${block}\n`);
}

function appendCss() {
  const file = 'apps/web/app/globals.css';
  const current = read(file);
  if (current.includes('Sprint 28.6: Guidance Topic Detail Journey')) return;

  const block = String.raw`

/* Sprint 28.6: Guidance Topic Detail Journey */
.noor-topic-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

.noor-topic-detail-card {
  display: grid;
  gap: 8px;
  min-height: 190px;
  border: 1px solid var(--noor-line);
  border-radius: 22px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.noor-topic-detail-card:hover {
  transform: translateY(-2px);
  border-color: rgba(216, 183, 90, 0.38);
  background: linear-gradient(145deg, rgba(216, 183, 90, 0.16), rgba(47, 191, 155, 0.1));
}

.noor-topic-detail-card strong {
  font-size: 18px;
}

.noor-topic-detail-card span {
  line-height: 1.45;
}

.noor-topic-detail-card small {
  color: var(--noor-muted);
  line-height: 1.5;
}

.noor-topic-detail-card em {
  color: var(--noor-gold);
  font-style: normal;
  font-weight: 900;
  margin-top: auto;
}

.noor-topic-journey-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
  gap: 14px;
  align-items: stretch;
}

.noor-topic-journey-hero-card,
.noor-topic-response-card {
  display: grid;
  align-content: start;
  gap: 12px;
}

.noor-topic-journey-hero-card h2,
.noor-topic-response-card h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(24px, 4vw, 38px);
}

.noor-topic-reader-path {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.noor-topic-reader-step {
  display: grid;
  gap: 10px;
  align-content: start;
  min-height: 250px;
}

.noor-topic-reader-step h3 {
  margin: 0;
  font-size: 21px;
}

.noor-topic-reader-step .noor-button {
  margin-top: auto;
}

@media (max-width: 860px) {
  .noor-topic-journey-hero-grid,
  .noor-topic-reader-path {
    grid-template-columns: 1fr;
  }
}
`;

  write(file, `${current.trimEnd()}${block}\n`);
}

registerPackageScripts();
appendSearchJourneyModel();
appendCss();
console.log('Registered Sprint 28.6 guidance topic detail journey scripts, search model, and CSS.');
