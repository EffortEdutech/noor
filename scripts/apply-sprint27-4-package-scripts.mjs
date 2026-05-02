import fs from 'node:fs';

const packagePath = 'package.json';
const settingsPath = 'apps/web/app/settings/page.tsx';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function updatePackageScripts() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};

  const scriptsToAdd = {
    'ilm:staging-cdn-pack': 'node scripts/generate-ilm-mate-staging-cdn-pack.mjs',
    'check:ilm-staging-cdn-pack': 'node scripts/check-ilm-mate-staging-cdn-pack.mjs'
  };

  let changed = false;
  for (const [name, command] of Object.entries(scriptsToAdd)) {
    if (pkg.scripts[name] !== command) {
      pkg.scripts[name] = command;
      changed = true;
    }
  }

  if (changed) {
    write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  return changed;
}

function updateSettingsPage() {
  if (!fs.existsSync(settingsPath)) {
    throw new Error(`Settings page not found: ${settingsPath}`);
  }

  let content = read(settingsPath);
  let changed = false;

  const importLine = "import { IlmMateStagingCdnPackCard } from '../../components/IlmMateStagingCdnPackCard';";
  if (!content.includes(importLine)) {
    const anchor = "import { IlmMateReviewerDecisionTrialCard } from '../../components/IlmMateReviewerDecisionTrialCard';";
    if (!content.includes(anchor)) {
      throw new Error('Could not find reviewer decision card import anchor in Settings page.');
    }
    content = content.replace(anchor, `${anchor}\n${importLine}`);
    changed = true;
  }

  const componentLine = '      <IlmMateStagingCdnPackCard />';
  if (!content.includes(componentLine)) {
    const anchor = '      <IlmMateReviewerDecisionTrialCard />';
    if (!content.includes(anchor)) {
      throw new Error('Could not find reviewer decision card component anchor in Settings page.');
    }
    content = content.replace(anchor, `${anchor}\n${componentLine}`);
    changed = true;
  }

  if (changed) {
    write(settingsPath, content);
  }

  return changed;
}

const packageChanged = updatePackageScripts();
const settingsChanged = updateSettingsPage();

console.log('Sprint 27.4 package scripts and Settings card registration complete.');
console.log(`package.json changed: ${packageChanged}`);
console.log(`settings page changed: ${settingsChanged}`);
