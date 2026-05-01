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

if (!fs.existsSync(packagePath)) {
  throw new Error(`package.json not found at ${packagePath}`);
}

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['ilm:evidence-intake'] = 'node scripts/generate-ilm-mate-evidence-intake.mjs';
pkg.scripts['check:ilm-evidence-intake'] = 'node scripts/check-ilm-mate-evidence-intake.mjs';
writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

if (!fs.existsSync(settingsPath)) {
  throw new Error(`Settings page not found at ${settingsPath}`);
}

let settings = readText(settingsPath);
const importLine = "import { IlmMateEvidenceIntakeCard } from '../../components/IlmMateEvidenceIntakeCard';";
const anchorImport = "import { IlmMatePromotionReadinessCard } from '../../components/IlmMatePromotionReadinessCard';";
if (!settings.includes(importLine)) {
  if (!settings.includes(anchorImport)) {
    throw new Error('Could not find IlmMatePromotionReadinessCard import anchor in Settings page.');
  }
  settings = settings.replace(anchorImport, `${anchorImport}\n${importLine}`);
}

const cardLine = '      <IlmMateEvidenceIntakeCard />';
const anchorCard = '      <IlmMatePromotionReadinessCard />';
if (!settings.includes(cardLine)) {
  if (!settings.includes(anchorCard)) {
    throw new Error('Could not find IlmMatePromotionReadinessCard render anchor in Settings page.');
  }
  settings = settings.replace(anchorCard, `${anchorCard}\n${cardLine}`);
}
writeText(settingsPath, settings);

console.log('Sprint 26.9 package scripts and Settings evidence-intake card registered.');
console.log('Added commands: pnpm ilm:evidence-intake, pnpm check:ilm-evidence-intake');
