import { readFileSync, writeFileSync } from 'node:fs';

const packageFile = 'package.json';
const pkg = JSON.parse(readFileSync(packageFile, 'utf8'));
pkg.scripts = pkg.scripts ?? {};

const additions = {
  'ilm:hadith:view-model': 'node scripts/build-ilm-mate-hadith-view-model.mjs',
  'check:ilm-hadith-view-model': 'node scripts/check-ilm-mate-hadith-view-model.mjs',
  'check:sprint27-9-2': 'pnpm check:ilm-hadith-view-model'
};

let changed = false;
for (const [key, value] of Object.entries(additions)) {
  if (pkg.scripts[key] !== value) {
    pkg.scripts[key] = value;
    changed = true;
  }
}

if (changed) {
  writeFileSync(packageFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  console.log('Sprint 27.9.2 package scripts added to package.json.');
} else {
  console.log('Sprint 27.9.2 package scripts already exist.');
}
