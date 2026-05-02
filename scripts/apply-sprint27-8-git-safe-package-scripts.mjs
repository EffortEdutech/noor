import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');

if (!fs.existsSync(packagePath)) {
  console.error('package.json not found. Run this from the NOOR repo root.');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts ?? {};

const scriptsToAdd = {
  'cdn:staging-git-safe': 'node scripts/generate-noor-cdn-git-safe-staging-pack.mjs',
  'check:cdn-staging-git-safe': 'node scripts/check-noor-cdn-git-safe-staging-pack.mjs'
};

let changed = false;
for (const [name, command] of Object.entries(scriptsToAdd)) {
  if (pkg.scripts[name] !== command) {
    pkg.scripts[name] = command;
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

console.log('Sprint 27.8 git-safe noor-cdn staging scripts registered.');
console.log('Added/confirmed commands:');
for (const name of Object.keys(scriptsToAdd)) {
  console.log(`- pnpm ${name}`);
}
