import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const quranPath = path.join(root, 'apps', 'web', 'components', 'QuranLastVisitLanding.tsx');

console.log('\nBismillah — validating Quran landing mojibake fix\n');

if (!fs.existsSync(quranPath)) {
  console.error('Validation failed: apps/web/components/QuranLastVisitLanding.tsx not found.');
  process.exit(1);
}

const text = fs.readFileSync(quranPath, 'utf8');

const forbidden = ['Â·', ' Â· ', 'Ø§Ù', 'Ø§Ù„Ù', 'Ù', 'Ù©'];
const found = forbidden.filter((needle) => text.includes(needle));

if (found.length) {
  console.error('Validation failed. Quran landing still contains broken text:');
  for (const item of found) console.error(`  - ${item}`);
  process.exit(1);
}

const required = [
  ' - Ayah {activeAyah}',
  ' - {activeSurah?.ayahCount ?? 7} ayat',
  "activeSurah?.nameArabic ?? 'Al-Fatihah'"
];

const missing = required.filter((needle) => !text.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing expected clean text:');
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}

console.log('  ✓ Quran landing separators are ASCII-safe');
console.log('  ✓ Broken Arabic fallback text is removed');
console.log('  ✓ Last visited card no longer renders A-circumflex artifacts');
console.log('\nAlhamdulillah — Quran landing mojibake fix validation complete.\n');
