import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const packagePath = path.join(ROOT, 'package.json');
const settingsPath = path.join(ROOT, 'apps', 'web', 'app', 'settings', 'page.tsx');

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeText(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function updatePackageScripts() {
  if (!fs.existsSync(packagePath)) {
    throw new Error(`package.json not found at ${packagePath}`);
  }

  const pkg = JSON.parse(readText(packagePath));
  pkg.scripts ??= {};

  const additions = {
    'qa:staging-browser': 'node scripts/generate-staging-browser-qa-checklist.mjs',
    'qa:staging-browser:update': 'node scripts/update-staging-browser-qa-result.mjs',
    'check:qa-staging-browser': 'node scripts/check-staging-browser-qa-checklist.mjs',
    'check:sprint27-11': 'pnpm check:cdn-staging-acceptance && pnpm check:cdn-staging-runtime && pnpm check:qa-staging-browser',
  };

  const added = [];
  for (const [name, value] of Object.entries(additions)) {
    if (pkg.scripts[name] !== value) {
      pkg.scripts[name] = value;
      added.push(name);
    }
  }

  writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log('Sprint 27.11 package scripts registered.');
  for (const name of added) console.log(`Added/updated: pnpm ${name}`);
  if (added.length === 0) console.log('No package script changes were needed.');
}

function updateSettingsPage() {
  if (!fs.existsSync(settingsPath)) {
    console.warn(`Settings page not found at ${settingsPath}; skipping Settings card insertion.`);
    return;
  }

  let source = readText(settingsPath);
  const importLine = "import { NoorStagingBrowserQaCard } from '../../components/NoorStagingBrowserQaCard';";

  if (!source.includes('NoorStagingBrowserQaCard')) {
    const acceptanceImport = /import \{ NoorCdnStagingAcceptanceCard \} from ['"]\.\.\/\.\.\/components\/NoorCdnStagingAcceptanceCard['"];\r?\n/;
    if (acceptanceImport.test(source)) {
      source = source.replace(acceptanceImport, (match) => `${match}${importLine}\n`);
    } else {
      const sourceGovernanceImport = /import \{ SourceGovernanceCard \} from ['"]\.\.\/\.\.\/components\/SourceGovernanceCard['"];\r?\n/;
      if (sourceGovernanceImport.test(source)) {
        source = source.replace(sourceGovernanceImport, `${importLine}\n$&`);
      } else {
        source = `${importLine}\n${source}`;
      }
    }
  }

  if (!source.includes('<NoorStagingBrowserQaCard />')) {
    if (source.includes('<NoorCdnStagingAcceptanceCard />')) {
      source = source.replace('<NoorCdnStagingAcceptanceCard />', '<NoorCdnStagingAcceptanceCard />\n      <NoorStagingBrowserQaCard />');
    } else if (source.includes('<RuntimeContentSourceCard')) {
      source = source.replace('<RuntimeContentSourceCard', '<NoorStagingBrowserQaCard />\n      <RuntimeContentSourceCard');
    } else {
      console.warn('Could not find a stable Settings insertion point; please add <NoorStagingBrowserQaCard /> manually.');
    }
  }

  writeText(settingsPath, source);
  console.log('Sprint 27.11 Settings card inserted/verified.');
}

updatePackageScripts();
updateSettingsPage();
console.log('Sprint 27.11 setup complete.');
