import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file missing: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};

const requiredScripts = {
  'ilm:required-evidence-acceptance': 'node scripts/run-ilm-mate-required-evidence-acceptance.mjs',
  'check:ilm-required-evidence-acceptance': 'node scripts/check-ilm-mate-required-evidence-acceptance.mjs'
};

let packageChanged = false;
for (const [name, command] of Object.entries(requiredScripts)) {
  if (pkg.scripts[name] !== command) {
    pkg.scripts[name] = command;
    packageChanged = true;
  }
}

if (packageChanged) {
  writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

let settings = readText(settingsPath);
const importLine = "import { IlmMateRequiredEvidenceAcceptanceCard } from '../../components/IlmMateRequiredEvidenceAcceptanceCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateRequiredEvidenceTrialCard } from '../../components/IlmMateRequiredEvidenceTrialCard';";
  if (!settings.includes(anchor)) {
    throw new Error('Could not find IlmMateRequiredEvidenceTrialCard import anchor in settings page.');
  }
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}

const cardLine = '      <IlmMateRequiredEvidenceAcceptanceCard />';
if (!settings.includes(cardLine)) {
  const anchor = '      <IlmMateRequiredEvidenceTrialCard />';
  if (!settings.includes(anchor)) {
    throw new Error('Could not find IlmMateRequiredEvidenceTrialCard JSX anchor in settings page.');
  }
  settings = settings.replace(anchor, `${anchor}\n${cardLine}`);
}

writeText(settingsPath, settings);

console.log('Sprint 27.6 package scripts and Settings card registered.');
console.log('Added commands:');
for (const [name, command] of Object.entries(requiredScripts)) {
  console.log(`- pnpm ${name} -> ${command}`);
}
