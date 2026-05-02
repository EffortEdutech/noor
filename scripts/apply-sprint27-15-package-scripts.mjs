import { readFileSync, writeFileSync } from 'node:fs';

const packageFile = 'package.json';
const pkg = JSON.parse(readFileSync(packageFile, 'utf8'));
pkg.scripts = pkg.scripts ?? {};

const scriptsToAdd = {
  'production:cdn-smoke-test': 'node scripts/run-production-cdn-smoke-test.mjs',
  'check:production-cdn-smoke-test': 'node scripts/check-production-cdn-smoke-test.mjs',
  'production:browser-qa': 'node scripts/generate-production-browser-qa.mjs',
  'production:browser-qa:update': 'node scripts/update-production-browser-qa.mjs',
  'check:production-browser-qa': 'node scripts/check-production-browser-qa.mjs',
  'check:sprint27-15': 'pnpm check:sprint27-14 && pnpm check:production-cdn-smoke-test && pnpm check:production-browser-qa'
};

for (const [name, command] of Object.entries(scriptsToAdd)) {
  pkg.scripts[name] = command;
}

writeFileSync(packageFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

console.log('Sprint 27.15 package scripts added.');
for (const name of Object.keys(scriptsToAdd)) console.log(`Added/updated: pnpm ${name}`);
console.log('Note: check:pack is intentionally not rewritten in Sprint 27.15 to avoid line-ending anchor issues. Sprint 27.15 is enforced by check:sprint27-15.');
