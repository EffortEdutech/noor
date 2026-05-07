import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const files = {
  layout: path.join(root, 'apps', 'web', 'app', 'layout.tsx'),
  manifest: path.join(root, 'apps', 'web', 'public', 'manifest.json'),
  appShell: path.join(root, 'packages', 'noor-ui', 'src', 'components', 'AppShell.tsx'),
  floatingQuran: path.join(root, 'apps', 'web', 'components', 'FloatingQuranNavigator.tsx'),
  floatingTafseer: path.join(root, 'apps', 'web', 'components', 'FloatingTafseerNavigator.tsx'),
  tafseerCss: path.join(root, 'apps', 'web', 'components', 'FloatingTafseerNavigator.module.css'),
  globals: path.join(root, 'apps', 'web', 'app', 'globals.css'),
  appIcon: path.join(root, 'apps', 'web', 'public', 'icons', 'noor-mark.svg'),
  floatingIcon: path.join(root, 'apps', 'web', 'public', 'icons', '09-spread-mark.png'),
  clientShell: path.join(root, 'apps', 'web', 'components', 'ClientShell.tsx')
};

console.log('\nBismillah - validating NOOR icon identity scope\n');

for (const [label, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    console.error(`Validation failed: missing ${label}: ${filePath}`);
    process.exit(1);
  }
}

const texts = Object.fromEntries(
  Object.entries(files)
    .filter(([label]) => !['appIcon', 'floatingIcon', 'clientShell'].includes(label))
    .map(([label, filePath]) => [label, fs.readFileSync(filePath, 'utf8')])
);

const required = [
  ['layout', "@/components/ClientShell", 'layout uses stable @ alias for ClientShell'],
  ['layout', "const noorAppIcon = '/icons/noor-mark.svg';", 'metadata app icon uses noor-mark.svg'],
  ['manifest', '/icons/noor-mark.svg', 'manifest app icon uses noor-mark.svg'],
  ['appShell', '/icons/noor-mark.svg?v=noor-app-mark', 'AppShell logo uses noor-mark.svg'],
  ['floatingQuran', '/icons/09-spread-mark.png?v=noor-floating-quran', 'Quran floating button uses 09-spread-mark.png'],
  ['floatingQuran', 'noor-floating-icon-button', 'Quran floating button icon class'],
  ['floatingTafseer', '/icons/09-spread-mark.png?v=noor-floating-tafseer', 'Tafseer floating button uses 09-spread-mark.png'],
  ['tafseerCss', '.floatMark', 'Tafseer floating image mark CSS'],
  ['globals', 'NOOR SPRINT 28.7-09 - ICON IDENTITY AND FLOATING BUTTONS START', 'global floating icon CSS block'],
  ['globals', '.noor-quran-v2-button.noor-floating-icon-button::before', 'Quran Q glyph override']
];

const missing = required.filter(([label, needle]) => !texts[label].includes(needle));

if (missing.length) {
  console.error('Validation failed. Missing:');
  for (const [, , description] of missing) console.error(`  - ${description}`);
  process.exit(1);
}

const wrongAppSurfaces = [
  ['layout', '/icons/09-spread-mark.png'],
  ['manifest', '/icons/09-spread-mark.png'],
  ['appShell', '/icons/09-spread-mark.png']
].filter(([label, needle]) => texts[label].includes(needle));

if (wrongAppSurfaces.length) {
  console.error('Validation failed. 09-spread-mark.png is still used in app identity surfaces:');
  for (const [label, needle] of wrongAppSurfaces) console.error(`  - ${label}: ${needle}`);
  process.exit(1);
}

console.log('  OK apps/web/public/icons/noor-mark.svg exists');
console.log('  OK apps/web/public/icons/09-spread-mark.png exists');
console.log('  OK HTML metadata icon uses noor-mark.svg');
console.log('  OK manifest icon uses noor-mark.svg');
console.log('  OK AppShell logo uses noor-mark.svg');
console.log('  OK Quran floating button uses 09-spread-mark.png');
console.log('  OK Tafseer floating button uses 09-spread-mark.png');
console.log('  OK ClientShell.tsx exists');
console.log('\nAlhamdulillah - NOOR icon scope validation complete.\n');
