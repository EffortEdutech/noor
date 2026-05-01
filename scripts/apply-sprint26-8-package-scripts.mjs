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

const pkg = JSON.parse(readText(packagePath));
pkg.scripts = pkg.scripts || {};

pkg.scripts['ilm:promotion-readiness'] = 'node scripts/generate-ilm-mate-promotion-readiness.mjs';
pkg.scripts['check:ilm-promotion-readiness'] = 'node scripts/check-ilm-mate-promotion-readiness.mjs';

writeText(packagePath, JSON.stringify(pkg, null, 2) + '\n');

let settings = readText(settingsPath);

const importLine = "import { IlmMatePromotionReadinessCard } from '../../components/IlmMatePromotionReadinessCard';";
if (!settings.includes(importLine)) {
  const anchor = "import { IlmMateReviewActionsCard } from '../../components/IlmMateReviewActionsCard';";
  settings = settings.replace(anchor, `${anchor}\n${importLine}`);
}

const componentLine = "      <IlmMatePromotionReadinessCard />";
if (!settings.includes(componentLine)) {
  const anchor = "      <IlmMateReviewActionsCard />";
  settings = settings.replace(anchor, `${anchor}\n${componentLine}`);
}

writeText(settingsPath, settings);

console.log('Sprint 26.8 package scripts and Settings promotion-readiness card registered.');
console.log('Added commands: pnpm ilm:promotion-readiness, pnpm check:ilm-promotion-readiness');
