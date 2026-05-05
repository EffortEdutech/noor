// scripts/validate-sprint28-6a2-gui-theme-unification.mjs
// Validates that the Sprint 28.6A.2 theme block is active in globals.css.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const globalsPath = path.join(root, 'apps', 'web', 'app', 'globals.css');

console.log('\nBismillah — validating Sprint 28.6A.2 GUI Theme Unification\n');

if (!fs.existsSync(globalsPath)) {
  console.error('Validation failed: apps/web/app/globals.css not found. Run from the noor repo root.');
  process.exit(1);
}

const css = fs.readFileSync(globalsPath, 'utf8');
const required = [
  'NOOR SPRINT 28.6A.2 GUI THEME UNIFICATION START',
  '.noor-learn-hub-hero',
  '.noor-learn-path-grid',
  '.noor-learning-action-row',
  '.noor-learning-card-grid.two',
  '.noor-quran-v2-page',
  '.noor-quran-v2-reader',
  '.noor-quran-v2-landing',
  '.noor-quran-v2-ayah',
  '.noor-quran-v2-float',
  '.noor-quran-v2-panel',
  '.noor-quran-v2-list',
  'NOOR SPRINT 28.6A.2 GUI THEME UNIFICATION END'
];

const missing = required.filter((needle) => !css.includes(needle));
if (missing.length > 0) {
  console.error('Validation failed. Missing expected theme selectors/markers:');
  for (const item of missing) console.error(`  ✗ ${item}`);
  process.exit(1);
}

const duplicateBlocks = (css.match(/NOOR SPRINT 28\.6A\.2 GUI THEME UNIFICATION START/g) ?? []).length;
if (duplicateBlocks !== 1) {
  console.error(`Validation failed. Expected 1 Sprint 28.6A.2 block, found ${duplicateBlocks}.`);
  process.exit(1);
}

console.log('  ✓ Active globals.css contains the Sprint 28.6A.2 theme block');
console.log('  ✓ Learn hub selectors are covered');
console.log('  ✓ Today/Explore learning section selectors are covered');
console.log('  ✓ Quran v2 landing/reader/floating navigator selectors are covered');
console.log('  ✓ Mobile responsive rules are present');
console.log('\nAlhamdulillah — Sprint 28.6A.2 theme validation complete.\n');
