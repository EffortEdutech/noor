import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const packageFile = 'package.json';

if (!existsSync(packageFile)) {
  console.error('package.json not found. Run this from the NOOR repo root.');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(packageFile, 'utf8'));
pkg.scripts ??= {};

const scripts = {
  'ilm:inspect': 'node scripts/inspect-ilm-mate-content.mjs',
  'ilm:migrate:quran': 'node scripts/migrate-ilm-mate-content.mjs --only=quran',
  'ilm:migrate:tafseer': 'node scripts/migrate-ilm-mate-content.mjs --only=tafseer',
  'ilm:migrate:hadith': 'node scripts/migrate-ilm-mate-content.mjs --only=hadith',
  'ilm:migrate:all': 'node scripts/migrate-ilm-mate-content.mjs --only=all',
  'check:ilm-migration': 'node scripts/check-ilm-mate-migration.mjs'
};

let changed = false;
for (const [name, command] of Object.entries(scripts)) {
  if (pkg.scripts[name] !== command) {
    pkg.scripts[name] = command;
    changed = true;
  }
}

writeFileSync(packageFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

if (changed) {
  console.log('Sprint 26.5 package scripts added to package.json.');
} else {
  console.log('Sprint 26.5 package scripts already present.');
}
