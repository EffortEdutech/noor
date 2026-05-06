import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const paths = {
  globals: path.join(root, 'apps', 'web', 'app', 'globals.css'),
  appShell: path.join(root, 'packages', 'noor-ui', 'src', 'components', 'AppShell.tsx'),
  reader: path.join(root, 'apps', 'web', 'components', 'QuranReadingExperience.tsx')
};

console.log('\nBismillah - validating Quran topbar mode final fix\n');

for (const [name, file] of Object.entries(paths)) {
  if (!fs.existsSync(file)) {
    console.error(`Validation failed: missing ${name}: ${file}`);
    process.exit(1);
  }
}

const globals = fs.readFileSync(paths.globals, 'utf8');
const appShell = fs.readFileSync(paths.appShell, 'utf8');
const reader = fs.readFileSync(paths.reader, 'utf8');

const checks = [
  [globals, 'NOOR SPRINT 28.6A.2 FIX - QURAN MODE IN APP TOPBAR START', 'final CSS marker'],
  [globals, '.noor-topbar-mode-slot:empty', 'topbar slot CSS'],
  [globals, '.noor-quran-v2-modebar', 'old modebar hide CSS'],
  [appShell, 'id="noor-quran-reader-mode-slot"', 'AppShell slot before Settings'],
  [appShell, 'href="/settings">Settings</a>', 'Settings link still exists'],
  [reader, "import { createPortal } from 'react-dom';", 'createPortal import'],
  [reader, 'function QuranReaderModeSwitcher', 'mode switcher component'],
  [reader, 'const [modeSlot, setModeSlot]', 'mode slot state'],
  [reader, "document.getElementById('noor-quran-reader-mode-slot')", 'slot lookup'],
  [reader, 'topbarModeControls', 'portal controls'],
  [reader, 'variant="topbar"', 'topbar variant']
];

const missing = checks.filter(([text, needle]) => !text.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const [, , label] of missing) console.error(`  - ${label}`);
  process.exit(1);
}

const forbidden = ['Â', 'Ã', 'â€™', 'â€œ', 'â€�', 'â€“', 'â€”', 'â€¦', 'noor-quran-v2-modes"'];
const found = forbidden.filter((needle) => reader.includes(needle) || globals.includes(needle));
if (found.length) {
  console.error('Validation failed. Found forbidden/broken text or old inline mode buttons:');
  for (const item of found) console.error(`  - ${item}`);
  process.exit(1);
}

if (reader.includes('<nav className="noor-quran-v2-modebar"')) {
  console.error('Validation failed: QuranReadingExperience still renders sticky modebar.');
  process.exit(1);
}

console.log('  OK App topbar has slot before Settings');
console.log('  OK Quran reader portals Read / Meaning / Study into app topbar');
console.log('  OK Sticky in-page modebar is removed/hidden');
console.log('  OK Broken text artifacts are removed from reader files');
console.log('\nAlhamdulillah - validation complete.\n');
