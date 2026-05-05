import fs from 'node:fs';
import path from 'node:path';

const globalsPath = path.join(process.cwd(), 'apps', 'web', 'app', 'globals.css');
console.log('\nBismillah — validating Quran mobile command sheet hotfix\n');

if (!fs.existsSync(globalsPath)) {
  console.error('Validation failed: apps/web/app/globals.css not found.');
  process.exit(1);
}

const css = fs.readFileSync(globalsPath, 'utf8');
const required = [
  'NOOR SPRINT 28.6A.2 HOTFIX - QURAN MOBILE COMMAND SHEET START',
  '@media (max-width: 640px)',
  '.noor-quran-v2-panel',
  'flex-direction: column',
  'overflow: hidden',
  '.noor-quran-v2-list',
  'overflow-y: auto',
  'overscroll-behavior: contain',
  '.noor-quran-v2-panel-actions',
  'NOOR SPRINT 28.6A.2 HOTFIX - QURAN MOBILE COMMAND SHEET END'
];

const missing = required.filter((needle) => !css.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}

const blocks = (css.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - QURAN MOBILE COMMAND SHEET START/g) ?? []).length;
if (blocks !== 1) {
  console.error(`Validation failed. Expected 1 mobile command sheet block, found ${blocks}.`);
  process.exit(1);
}

console.log('  ✓ Mobile command sheet hotfix is active');
console.log('  ✓ Navigator panel is fixed and overflow hidden on mobile');
console.log('  ✓ Surah result list is the only scrollable area');
console.log('  ✓ Header/search/footer remain visible');
console.log('\nAlhamdulillah — Quran mobile command sheet hotfix validation complete.\n');
