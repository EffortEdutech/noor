import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

const packageJson = JSON.parse(readText(packagePath));
packageJson.scripts = packageJson.scripts || {};

const newScripts = {
  'ilm:required-evidence-trial': 'node scripts/run-ilm-mate-required-evidence-trial.mjs',
  'check:ilm-required-evidence-trial': 'node scripts/check-ilm-mate-required-evidence-trial.mjs'
};

for (const [key, value] of Object.entries(newScripts)) {
  packageJson.scripts[key] = value;
}

fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');

let settings = readText(settingsPath);

const importLine = "import { IlmMateRequiredEvidenceTrialCard } from '../../components/IlmMateRequiredEvidenceTrialCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateStagingCdnPackCard } from '../../components/IlmMateStagingCdnPackCard';";
  if (!settings.includes(anchor)) fail('Could not find IlmMateStagingCdnPackCard import anchor in settings page.');
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}

const cardLine = '      <IlmMateRequiredEvidenceTrialCard />';
if (!settings.includes(cardLine)) {
  const anchor = '      <IlmMateStagingCdnPackCard />';
  if (!settings.includes(anchor)) fail('Could not find IlmMateStagingCdnPackCard component anchor in settings page.');
  settings = settings.replace(anchor, `${anchor}\n${cardLine}`);
}

fs.writeFileSync(settingsPath, settings, 'utf8');

console.log('Sprint 27.5 package scripts and Settings card registered.');
console.log('Added commands:');
for (const key of Object.keys(newScripts)) {
  console.log(`- pnpm ${key}`);
}
