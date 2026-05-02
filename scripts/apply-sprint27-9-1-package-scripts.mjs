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

function updatePackageScripts() {
  const pkg = JSON.parse(readText(packagePath));
  pkg.scripts = pkg.scripts ?? {};
  const scripts = {
    'ilm:hadith:normalize-ids': 'node scripts/normalize-ilm-mate-hadith-ids.mjs',
    'check:ilm-hadith-normalized-ids': 'node scripts/check-ilm-mate-hadith-normalized-ids.mjs'
  };

  let changed = false;
  for (const [name, command] of Object.entries(scripts)) {
    if (pkg.scripts[name] !== command) {
      pkg.scripts[name] = command;
      changed = true;
    }
  }

  if (changed) writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  return changed;
}

function updateSettingsCard() {
  if (!fs.existsSync(settingsPath)) return false;
  let text = readText(settingsPath);
  let changed = false;

  const importLine = "import { IlmMateHadithIdNormalizationCard } from '../../components/IlmMateHadithIdNormalizationCard';";
  if (!text.includes('IlmMateHadithIdNormalizationCard')) {
    const anchor = "import { NoorCdnStagingRuntimeTestCard } from '../../components/NoorCdnStagingRuntimeTestCard';";
    if (text.includes(anchor)) {
      text = text.replace(anchor, `${anchor}\n${importLine}`);
    } else {
      text = `${importLine}\n${text}`;
    }
    changed = true;
  }

  if (!text.includes('<IlmMateHadithIdNormalizationCard />')) {
    const anchor = '<NoorCdnStagingRuntimeTestCard />';
    if (text.includes(anchor)) {
      text = text.replace(anchor, `${anchor}\n      <IlmMateHadithIdNormalizationCard />`);
    } else {
      text = text.replace('<QuranSourceGateCard />', '<IlmMateHadithIdNormalizationCard />\n      <QuranSourceGateCard />');
    }
    changed = true;
  }

  if (changed) writeText(settingsPath, text);
  return changed;
}

const packageChanged = updatePackageScripts();
const settingsChanged = updateSettingsCard();

console.log('Sprint 27.9.1 package scripts applied.');
console.log(`package.json changed: ${packageChanged}`);
console.log(`settings card changed: ${settingsChanged}`);
console.log('Added scripts:');
console.log('- pnpm ilm:hadith:normalize-ids');
console.log('- pnpm check:ilm-hadith-normalized-ids');
