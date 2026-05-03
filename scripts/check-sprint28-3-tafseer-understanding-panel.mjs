import fs from 'node:fs';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`${file} is missing.`);
  return fs.readFileSync(file, 'utf8');
}

const panel = read('apps/web/components/TafseerUnderstandingPanel.tsx');
const ayahCard = read('apps/web/components/AyahStudyCard.tsx');
const tafseerPage = read('apps/web/app/learn/tafseer/page.tsx');
const globals = read('apps/web/app/globals.css');
const pkg = JSON.parse(read('package.json'));

[
  'TafseerUnderstandingPanel',
  'Read',
  'Understand',
  'Respond',
  'BookmarkButton',
  "type: 'tafseer'",
  'Open tafseer library',
  'Return to ayah'
].forEach((needle) => {
  if (!panel.includes(needle)) fail(`TafseerUnderstandingPanel.tsx must include ${needle}.`);
});

[
  "import { TafseerUnderstandingPanel } from './TafseerUnderstandingPanel';",
  '<TafseerUnderstandingPanel',
  'showTafseer && tafseer'
].forEach((needle) => {
  if (!ayahCard.includes(needle)) fail(`apps/web/components/AyahStudyCard.tsx must include ${needle}.`);
});

[
  'Read → Understand → Respond',
  'Tafseer study workflow',
  'Quran reader → Study mode → Understand this ayah'
].forEach((needle) => {
  if (!tafseerPage.includes(needle)) fail(`apps/web/app/learn/tafseer/page.tsx must include ${needle}.`);
});

[
  'Sprint 28.3: Tafseer Understanding Panel',
  '.noor-tafseer-understanding-panel',
  '.noor-understanding-flow'
].forEach((needle) => {
  if (!globals.includes(needle)) fail(`apps/web/app/globals.css must include ${needle}.`);
});

if (pkg.scripts['check:tafseer-understanding-panel'] !== 'node scripts/check-sprint28-3-tafseer-understanding-panel.mjs') {
  fail('package.json must include check:tafseer-understanding-panel.');
}

if (!pkg.scripts['check:sprint28-3']?.includes('check:tafseer-understanding-panel')) {
  fail('package.json must include check:sprint28-3 with tafseer understanding panel check.');
}

console.log('NOOR Sprint 28.3 Tafseer Understanding Panel check passed.');
