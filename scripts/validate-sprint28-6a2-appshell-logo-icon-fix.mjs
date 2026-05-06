import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const globalsPath = path.join(root, 'apps', 'web', 'app', 'globals.css');
const appShellPath = path.join(root, 'packages', 'noor-ui', 'src', 'components', 'AppShell.tsx');
const iconPath = path.join(root, 'public', 'icon-192.png');

console.log('\nBismillah - validating AppShell logo icon fix\n');

for (const file of [globalsPath, appShellPath, iconPath]) {
  if (!fs.existsSync(file)) {
    console.error(`Validation failed: missing file ${file}`);
    process.exit(1);
  }
}

const globals = fs.readFileSync(globalsPath, 'utf8');
const appShell = fs.readFileSync(appShellPath, 'utf8');

const required = [
  [globals, 'NOOR SPRINT 28.6A.2 HOTFIX - APPSHELL LOGO ICON FIX START', 'CSS start marker'],
  [globals, '.noor-mark-img', 'logo image CSS'],
  [globals, 'font-size: 0 !important', 'text glyph hidden'],
  [appShell, 'className="noor-mark-img"', 'AppShell logo image class'],
  [appShell, 'src="/icon-192.png"', 'AppShell icon source'],
  [appShell, 'width="42"', 'AppShell icon width'],
  [appShell, 'height="42"', 'AppShell icon height']
];

const missing = required.filter(([text, needle]) => !text.includes(needle));
if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const [, , label] of missing) console.error(`  - ${label}`);
  process.exit(1);
}

const forbidden = ['âœ¦', 'Â', 'Ã', 'â€™', 'â€œ', 'â€�', 'â€“', 'â€”', 'â€¦'];
const found = forbidden.filter((needle) => appShell.includes(needle));
if (found.length) {
  console.error('Validation failed. AppShell still contains broken text:');
  for (const item of found) console.error(`  - ${item}`);
  process.exit(1);
}

const cssBlocks = (globals.match(/NOOR SPRINT 28\.6A\.2 HOTFIX - APPSHELL LOGO ICON FIX START/g) ?? []).length;
if (cssBlocks !== 1) {
  console.error(`Validation failed. Expected 1 AppShell logo CSS block, found ${cssBlocks}.`);
  process.exit(1);
}

console.log('  OK AppShell logo uses /icon-192.png');
console.log('  OK Text glyph logo is hidden/replaced');
console.log('  OK Broken mojibake logo text is removed from AppShell');
console.log('\nAlhamdulillah - AppShell logo icon fix validation complete.\n');
