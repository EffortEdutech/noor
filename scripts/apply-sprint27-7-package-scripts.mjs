import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, value) {
  fs.writeFileSync(filePath, value, 'utf8');
}

if (!fs.existsSync(packagePath)) {
  throw new Error(`package.json not found at ${packagePath}`);
}

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};

const scriptsToAdd = {
  'ilm:staging-cdn-candidate': 'node scripts/build-ilm-mate-staging-cdn-candidate.mjs',
  'check:ilm-staging-cdn-candidate': 'node scripts/check-ilm-mate-staging-cdn-candidate.mjs'
};

for (const [key, value] of Object.entries(scriptsToAdd)) {
  pkg.scripts[key] = value;
}

writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

if (!fs.existsSync(settingsPath)) {
  throw new Error(`Settings page not found at ${settingsPath}`);
}

let settings = readText(settingsPath);
const importLine = "import { IlmMateStagingCdnCandidateCard } from '../../components/IlmMateStagingCdnCandidateCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateRequiredEvidenceAcceptanceCard } from '../../components/IlmMateRequiredEvidenceAcceptanceCard';";
  if (!settings.includes(anchor)) {
    throw new Error('Could not find Sprint 27.6 card import anchor in settings page.');
  }
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}

const componentLine = '      <IlmMateStagingCdnCandidateCard />';
if (!settings.includes(componentLine)) {
  const anchor = '      <IlmMateRequiredEvidenceAcceptanceCard />';
  if (!settings.includes(anchor)) {
    throw new Error('Could not find Sprint 27.6 card component anchor in settings page.');
  }
  settings = settings.replace(anchor, `${anchor}\n${componentLine}`);
}

writeText(settingsPath, settings);

console.log('Sprint 27.7 package scripts and Settings card registered.');
console.log('Added commands: pnpm ilm:staging-cdn-candidate, pnpm check:ilm-staging-cdn-candidate.');
