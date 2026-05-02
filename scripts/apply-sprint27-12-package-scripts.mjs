import { readFileSync, writeFileSync } from 'node:fs';

const packagePath = 'package.json';
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
pkg.scripts ??= {};

const scriptsToAdd = {
  'check:sprint27-12': 'pnpm roadmap:status && pnpm check:release && pnpm check:roadmap && pnpm check:pack && pnpm check:sprint27-11'
};

let changed = false;
for (const [name, command] of Object.entries(scriptsToAdd)) {
  if (pkg.scripts[name] !== command) {
    pkg.scripts[name] = command;
    changed = true;
  }
}

if (changed) {
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  console.log('Sprint 27.12 package scripts added.');
  for (const name of Object.keys(scriptsToAdd)) console.log(`Added/updated: pnpm ${name}`);
} else {
  console.log('Sprint 27.12 package scripts already present.');
}
