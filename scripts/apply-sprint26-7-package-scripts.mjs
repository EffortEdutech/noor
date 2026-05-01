import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};

const additions = {
  'ilm:review-actions': 'node scripts/generate-ilm-mate-review-actions.mjs',
  'check:ilm-review-actions': 'node scripts/check-ilm-mate-review-actions.mjs'
};

let packageChanged = false;
for (const [name, command] of Object.entries(additions)) {
  if (pkg.scripts[name] !== command) {
    pkg.scripts[name] = command;
    packageChanged = true;
  }
}

if (packageChanged) {
  writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

let settings = readText(settingsPath);
const importLine = "import { IlmMateReviewActionsCard } from '../../components/IlmMateReviewActionsCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateReviewConsoleCard } from '../../components/IlmMateReviewConsoleCard';";
  if (!settings.includes(anchor)) {
    throw new Error('Could not find IlmMateReviewConsoleCard import anchor in settings page.');
  }
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}

const cardLine = '      <IlmMateReviewActionsCard />';
if (!settings.includes(cardLine)) {
  const anchor = '      <IlmMateReviewConsoleCard />';
  if (!settings.includes(anchor)) {
    throw new Error('Could not find IlmMateReviewConsoleCard JSX anchor in settings page.');
  }
  settings = settings.replace(anchor, `${anchor}\n${cardLine}`);
}

writeText(settingsPath, settings);

console.log('Sprint 26.7 package scripts and Settings review-actions card registered.');
console.log('Added commands: pnpm ilm:review-actions, pnpm check:ilm-review-actions');
