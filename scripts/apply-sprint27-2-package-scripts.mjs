import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};
const additions = {
  'ilm:evidence-trial': 'node scripts/run-ilm-mate-evidence-update-trial.mjs',
  'check:ilm-evidence-trial': 'node scripts/check-ilm-mate-evidence-update-trial.mjs'
};
for (const [key, value] of Object.entries(additions)) {
  pkg.scripts[key] = value;
}
writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

let settings = readText(settingsPath);
const importLine = "import { IlmMateEvidenceTrialCard } from '../../components/IlmMateEvidenceTrialCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateEvidenceUpdateHelperCard } from '../../components/IlmMateEvidenceUpdateHelperCard';";
  if (!settings.includes(anchor)) throw new Error('Could not find IlmMateEvidenceUpdateHelperCard import anchor in settings page.');
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}
const componentLine = '      <IlmMateEvidenceTrialCard />';
if (!settings.includes(componentLine)) {
  const anchor = '      <IlmMateEvidenceUpdateHelperCard />';
  if (!settings.includes(anchor)) throw new Error('Could not find IlmMateEvidenceUpdateHelperCard render anchor in settings page.');
  settings = settings.replace(anchor, `${anchor}\n${componentLine}`);
}
writeText(settingsPath, settings);

console.log('Sprint 27.2 package scripts and Settings card registered.');
console.log('Added commands: pnpm ilm:evidence-trial, pnpm check:ilm-evidence-trial');
