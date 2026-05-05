import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const globalsPath = path.join(root, 'apps', 'web', 'app', 'globals.css');
const quranPath = path.join(root, 'apps', 'web', 'components', 'QuranLastVisitLanding.tsx');

console.log('\nBismillah — validating chevron and Quran landing hotfix\n');

if (!fs.existsSync(globalsPath) || !fs.existsSync(quranPath)) {
  console.error('Validation failed: expected files not found.');
  process.exit(1);
}

const css = fs.readFileSync(globalsPath, 'utf8');
const quran = fs.readFileSync(quranPath, 'utf8');

const required = [
  'NOOR SPRINT 28.6A.2 HOTFIX - CHEVRON AND QURAN LANDING START',
  '.noor-learning-chevron::before',
  "content: '▸'",
  ".noor-learning-section[open] .noor-learning-chevron::before",
  "content: '▾'",
  'transform: none !important',
  'NOOR SPRINT 28.6A.2 HOTFIX - CHEVRON AND QURAN LANDING END'
];

const missing = required.filter((needle) => !css.includes(needle));
if (!quran.includes('aria-label="Quran reading continuation"')) missing.push('Quran landing continuation label');
if (!quran.includes("hasLastVisit ? 'Last viewed Quran page' : 'Start from Al-Fatihah'")) missing.push('Quran landing last/fallback heading');
if (!quran.includes('Open last viewed reading')) missing.push('Quran landing last viewed action');
if (!quran.includes('Open Al-Fatihah')) missing.push('Quran landing fallback action');
if (quran.includes('No Surah list blocking the page.')) missing.push('Remove old Quran note text');

if (missing.length) {
  console.error('Validation failed. Missing/incorrect:');
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}

const blocks = (css.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - CHEVRON AND QURAN LANDING START/g) ?? []).length;
if (blocks !== 1) {
  console.error(`Validation failed. Expected 1 CSS block, found ${blocks}.`);
  process.exit(1);
}

console.log('  ✓ Expand/collapse icon CSS uses ▸ and ▾');
console.log('  ✓ Chevron rotation is disabled');
console.log('  ✓ Quran landing old note is removed');
console.log('  ✓ Quran landing now shows last-viewed/fallback continuation');
console.log('\nAlhamdulillah — validation complete.\n');
