import fs from 'node:fs';
import path from 'node:path';

const globalsPath = path.join(process.cwd(), 'apps', 'web', 'app', 'globals.css');
console.log('\nBismillah — validating Quran mobile result one-line hotfix\n');

if (!fs.existsSync(globalsPath)) {
  console.error('Validation failed: apps/web/app/globals.css not found.');
  process.exit(1);
}

const css = fs.readFileSync(globalsPath, 'utf8');
const required = [
  'NOOR SPRINT 28.6A.2 HOTFIX - QURAN MOBILE RESULT ONE LINE START',
  '.noor-quran-v2-surah-name',
  'white-space: nowrap',
  'text-overflow: ellipsis',
  '.noor-quran-v2-surah-arabic',
  'grid-column: auto !important',
  'NOOR SPRINT 28.6A.2 HOTFIX - QURAN MOBILE RESULT ONE LINE END'
];

const missing = required.filter((needle) => !css.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}

const blocks = (css.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - QURAN MOBILE RESULT ONE LINE START/g) ?? []).length;
if (blocks !== 1) {
  console.error(`Validation failed. Expected 1 mobile one-line result block, found ${blocks}.`);
  process.exit(1);
}

console.log('  ✓ Mobile Surah result one-line hotfix is active');
console.log('  ✓ English/metadata text truncates instead of wrapping');
console.log('  ✓ Arabic name stays in the same result row');
console.log('\nAlhamdulillah — Quran mobile result one-line hotfix validation complete.\n');
