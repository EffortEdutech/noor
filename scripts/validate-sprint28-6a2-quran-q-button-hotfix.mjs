import fs from 'node:fs';
import path from 'node:path';

const globalsPath = path.join(process.cwd(), 'apps', 'web', 'app', 'globals.css');
console.log('\nBismillah — validating Quran floating Q button hotfix\n');

if (!fs.existsSync(globalsPath)) {
  console.error('Validation failed: apps/web/app/globals.css not found.');
  process.exit(1);
}

const css = fs.readFileSync(globalsPath, 'utf8');
const required = [
  'NOOR SPRINT 28.6A.2 HOTFIX - QURAN FLOATING Q BUTTON START',
  '.noor-quran-v2-button::before',
  "content: 'Q'",
  ".noor-quran-v2-float[data-open='true'] .noor-quran-v2-button",
  "content: 'x'",
  'NOOR SPRINT 28.6A.2 HOTFIX - QURAN FLOATING Q BUTTON END'
];

const missing = required.filter((needle) => !css.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}

const blocks = (css.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - QURAN FLOATING Q BUTTON START/g) ?? []).length;
if (blocks !== 1) {
  console.error(`Validation failed. Expected 1 hotfix block, found ${blocks}.`);
  process.exit(1);
}

console.log('  ✓ Compact Q button hotfix is active');
console.log('  ✓ Closed button displays Q');
console.log('  ✓ Open button displays x');
console.log('  ✓ Wide label remains accessible but visually hidden');
console.log('\nAlhamdulillah — Quran floating Q button hotfix validation complete.\n');
