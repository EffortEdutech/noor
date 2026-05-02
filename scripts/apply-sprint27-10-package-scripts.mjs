import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeText(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

const packageJson = JSON.parse(readText(packagePath));
packageJson.scripts ??= {};
const scriptsToAdd = {
  'cdn:staging-acceptance': 'node scripts/run-staging-cdn-acceptance-checklist.mjs',
  'check:cdn-staging-acceptance': 'node scripts/check-staging-cdn-acceptance-checklist.mjs',
  'check:sprint27-10': 'pnpm check:cdn-staging-acceptance',
};

let changedPackage = false;
for (const [key, value] of Object.entries(scriptsToAdd)) {
  if (packageJson.scripts[key] !== value) {
    packageJson.scripts[key] = value;
    changedPackage = true;
  }
}

if (changedPackage) {
  writeText(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

if (fs.existsSync(settingsPath)) {
  let settings = readText(settingsPath);
  let changedSettings = false;

  const importLine = "import { NoorCdnStagingAcceptanceCard } from '../../components/NoorCdnStagingAcceptanceCard';";
  if (!settings.includes('NoorCdnStagingAcceptanceCard')) {
    const anchor = "import { NoorCdnStagingRuntimeTestCard } from '../../components/NoorCdnStagingRuntimeTestCard';";
    if (settings.includes(anchor)) {
      settings = settings.replace(anchor, `${anchor}\n${importLine}`);
    } else {
      const dynamicAnchor = "export const dynamic = 'force-dynamic';";
      settings = settings.replace(dynamicAnchor, `${importLine}\n\n${dynamicAnchor}`);
    }
    changedSettings = true;
  }

  if (!settings.includes('<NoorCdnStagingAcceptanceCard />')) {
    const runtimeCard = '<NoorCdnStagingRuntimeTestCard />';
    if (settings.includes(runtimeCard)) {
      settings = settings.replace(runtimeCard, `${runtimeCard}\n      <NoorCdnStagingAcceptanceCard />`);
    } else {
      const quranCard = '<QuranSourceGateCard />';
      settings = settings.replace(quranCard, `<NoorCdnStagingAcceptanceCard />\n      ${quranCard}`);
    }
    changedSettings = true;
  }

  if (changedSettings) {
    writeText(settingsPath, settings);
  }
}

console.log('Sprint 27.10 package scripts added.');
console.log('Added: pnpm cdn:staging-acceptance');
console.log('Added: pnpm check:cdn-staging-acceptance');
console.log('Added: pnpm check:sprint27-10');
