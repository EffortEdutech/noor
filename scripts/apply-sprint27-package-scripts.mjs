import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['ilm:evidence-records'] = 'node scripts/generate-ilm-mate-evidence-records.mjs';
pkg.scripts['check:ilm-evidence-records'] = 'node scripts/check-ilm-mate-evidence-records.mjs';
writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

let content = readText(settingsPath);
const importLine = "import { IlmMateEvidenceCompletionCard } from '../../components/IlmMateEvidenceCompletionCard';";
if (!content.includes(importLine)) {
  const anchor = "import { IlmMateEvidenceIntakeCard } from '../../components/IlmMateEvidenceIntakeCard';";
  if (!content.includes(anchor)) throw new Error('Could not find IlmMateEvidenceIntakeCard import anchor.');
  content = content.replace(anchor, `${anchor}\n${importLine}`);
}

const componentLine = '      <IlmMateEvidenceCompletionCard />';
if (!content.includes(componentLine)) {
  const anchor = '      <IlmMateEvidenceIntakeCard />';
  if (!content.includes(anchor)) throw new Error('Could not find IlmMateEvidenceIntakeCard render anchor.');
  content = content.replace(anchor, `${anchor}\n${componentLine}`);
}

writeText(settingsPath, content);

console.log('Sprint 27 package scripts and Settings card registered.');
console.log('Added commands: pnpm ilm:evidence-records, pnpm check:ilm-evidence-records');
