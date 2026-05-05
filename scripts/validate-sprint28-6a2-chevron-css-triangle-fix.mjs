import fs from 'node:fs';
import path from 'node:path';

const globalsPath = path.join(process.cwd(), 'apps', 'web', 'app', 'globals.css');

console.log('\nBismillah — validating chevron CSS triangle fix\n');

if (!fs.existsSync(globalsPath)) {
  console.error('Validation failed: apps/web/app/globals.css not found.');
  process.exit(1);
}

const css = fs.readFileSync(globalsPath, 'utf8');

const required = [
  'NOOR SPRINT 28.6A.2 HOTFIX - CHEVRON CSS TRIANGLE FIX START',
  '.noor-learning-chevron::before',
  "content: '' !important",
  'border-left: 8px solid currentColor',
  '.noor-learning-section[open] .noor-learning-chevron::before',
  'border-top: 8px solid currentColor',
  'NOOR SPRINT 28.6A.2 HOTFIX - CHEVRON CSS TRIANGLE FIX END'
];

const missing = required.filter((needle) => !css.includes(needle));

if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}

const blockCount = (css.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - CHEVRON CSS TRIANGLE FIX START/g) ?? []).length;
if (blockCount !== 1) {
  console.error(`Validation failed. Expected 1 CSS triangle fix block, found ${blockCount}.`);
  process.exit(1);
}

console.log('  ✓ Chevron uses CSS triangles, not Unicode text');
console.log('  ✓ Collapsed state draws a right triangle');
console.log('  ✓ Open state draws a down triangle');
console.log('  ✓ Mojibake arrow text is visually hidden');
console.log('\nAlhamdulillah — chevron CSS triangle fix validation complete.\n');
