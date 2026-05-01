import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}
function ensurePackageScripts() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  const additions = {
    'ilm:evidence-helper': 'node scripts/generate-ilm-mate-evidence-update-helper.mjs',
    'ilm:evidence:list': 'node scripts/list-ilm-mate-evidence-records.mjs',
    'ilm:evidence:update': 'node scripts/update-ilm-mate-evidence-record.mjs',
    'check:ilm-evidence-helper': 'node scripts/check-ilm-mate-evidence-update-helper.mjs'
  };
  for (const [name, command] of Object.entries(additions)) {
    pkg.scripts[name] = command;
  }
  write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}
function ensureSettingsCard() {
  let content = read(settingsPath);
  const importLine = "import { IlmMateEvidenceUpdateHelperCard } from '../../components/IlmMateEvidenceUpdateHelperCard';";
  if (!content.includes(importLine)) {
    const marker = "import { IlmMateEvidenceCompletionCard } from '../../components/IlmMateEvidenceCompletionCard';";
    if (!content.includes(marker)) throw new Error('Could not find IlmMateEvidenceCompletionCard import marker in settings page.');
    content = content.replace(marker, `${marker}\n${importLine}`);
  }
  const componentLine = '      <IlmMateEvidenceUpdateHelperCard />';
  if (!content.includes(componentLine)) {
    const marker = '      <IlmMateEvidenceCompletionCard />';
    if (!content.includes(marker)) throw new Error('Could not find IlmMateEvidenceCompletionCard render marker in settings page.');
    content = content.replace(marker, `${marker}\n${componentLine}`);
  }
  write(settingsPath, content);
}

ensurePackageScripts();
ensureSettingsCard();
console.log('Sprint 27.1 package scripts and Settings card added.');
console.log('Added: pnpm ilm:evidence-helper, ilm:evidence:list, ilm:evidence:update, check:ilm-evidence-helper.');
