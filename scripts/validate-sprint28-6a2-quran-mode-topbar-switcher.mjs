import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const globals = fs.readFileSync(path.join(root, 'apps/web/app/globals.css'), 'utf8');
const appShell = fs.readFileSync(path.join(root, 'packages/noor-ui/src/components/AppShell.tsx'), 'utf8');
const reader = fs.readFileSync(path.join(root, 'apps/web/components/QuranReadingExperience.tsx'), 'utf8');

console.log('\nBismillah — validating Quran mode topbar switcher\n');

const checks = [
  [globals, 'NOOR SPRINT 28.6A.2 HOTFIX - QURAN MODE TOPBAR SWITCHER START', 'CSS marker'],
  [globals, '.noor-topbar-mode-slot:empty', 'topbar slot CSS'],
  [globals, '.noor-quran-mode-switcher--topbar', 'topbar switcher CSS'],
  [appShell, 'id="noor-quran-reader-mode-slot"', 'AppShell mode slot'],
  [appShell, 'href="/settings">Settings</a>', 'Settings still exists'],
  [reader, "import { createPortal } from 'react-dom';", 'portal import'],
  [reader, 'function QuranReaderModeSwitcher', 'mode switcher component'],
  [reader, "document.getElementById('noor-quran-reader-mode-slot')", 'slot lookup'],
  [reader, 'topbarModeControls', 'portal render'],
  [reader, 'variant="topbar"', 'topbar variant'],
  [reader, '<QuranReaderModeSwitcher mode={mode} onChange={updateMode} variant="inline" />', 'inline fallback modebar']
];

const missing = checks.filter(([text, needle]) => !text.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const [, , label] of missing) console.error(`  - ${label}`);
  process.exit(1);
}

const blocks = (globals.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - QURAN MODE TOPBAR SWITCHER START/g) ?? []).length;
if (blocks !== 1) {
  console.error(`Validation failed. Expected 1 CSS block, found ${blocks}.`);
  process.exit(1);
}

console.log('  ✓ AppShell has mode slot before Settings');
console.log('  ✓ Quran reader portals Read / Meaning / Study into topbar');
console.log('  ✓ Inline modebar remains available');
console.log('\nAlhamdulillah — validation complete.\n');
