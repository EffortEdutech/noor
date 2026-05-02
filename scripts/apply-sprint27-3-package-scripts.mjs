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
const scriptsToAdd = {
  'ilm:reviewer-decision-trial': 'node scripts/run-ilm-mate-reviewer-decision-trial.mjs',
  'check:ilm-reviewer-decision-trial': 'node scripts/check-ilm-mate-reviewer-decision-trial.mjs'
};
for (const [name, command] of Object.entries(scriptsToAdd)) {
  pkg.scripts[name] = command;
}
writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

let settings = readText(settingsPath);
const importLine = "import { IlmMateReviewerDecisionTrialCard } from '../../components/IlmMateReviewerDecisionTrialCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateEvidenceTrialCard } from '../../components/IlmMateEvidenceTrialCard';";
  if (!settings.includes(anchor)) throw new Error('Could not find IlmMateEvidenceTrialCard import anchor in settings page.');
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}
const componentLine = '      <IlmMateReviewerDecisionTrialCard />';
if (!settings.includes(componentLine)) {
  const anchor = '      <IlmMateEvidenceTrialCard />';
  if (!settings.includes(anchor)) throw new Error('Could not find IlmMateEvidenceTrialCard component anchor in settings page.');
  settings = settings.replace(anchor, `${anchor}\n${componentLine}`);
}
writeText(settingsPath, settings);

console.log('Sprint 27.3 package scripts and Settings card registered.');
console.log('Added commands:');
for (const name of Object.keys(scriptsToAdd)) console.log(`- pnpm ${name}`);
