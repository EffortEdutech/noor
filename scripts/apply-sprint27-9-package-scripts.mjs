import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const settingsPath = path.join(root, 'apps', 'web', 'app', 'settings', 'page.tsx');
const envExamplePath = path.join(root, '.env.example');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function updatePackageScripts() {
  const pkg = JSON.parse(readText(packagePath));
  pkg.scripts = pkg.scripts ?? {};

  const additions = {
    'cdn:staging-env': 'node scripts/write-noor-staging-cdn-env.mjs',
    'cdn:test-staging': 'node scripts/test-noor-cdn-staging-runtime.mjs',
    'check:cdn-staging-runtime': 'node scripts/check-noor-cdn-staging-runtime.mjs'
  };

  for (const [name, command] of Object.entries(additions)) {
    pkg.scripts[name] = command;
  }

  writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateSettingsPage() {
  if (!fs.existsSync(settingsPath)) {
    throw new Error(`Settings page not found: ${settingsPath}`);
  }

  let source = readText(settingsPath);

  const importLine = "import { NoorCdnStagingRuntimeTestCard } from '../../components/NoorCdnStagingRuntimeTestCard';";
  if (!source.includes(importLine)) {
    const preferredAnchors = [
      "import { NoorCdnStagingBranchHandoffCard } from '../../components/NoorCdnStagingBranchHandoffCard';",
      "import { IlmMateStagingCdnCandidateCard } from '../../components/IlmMateStagingCdnCandidateCard';"
    ];

    let inserted = false;
    for (const anchor of preferredAnchors) {
      if (source.includes(anchor)) {
        source = source.replace(anchor, `${anchor}\n${importLine}`);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      source = source.replace("import { SourceGovernanceCard } from '../../components/SourceGovernanceCard';", `${importLine}\nimport { SourceGovernanceCard } from '../../components/SourceGovernanceCard';`);
    }
  }

  const componentLine = '      <NoorCdnStagingRuntimeTestCard />';
  if (!source.includes(componentLine)) {
    const preferredAnchors = [
      '      <NoorCdnStagingBranchHandoffCard />',
      '      <IlmMateStagingCdnCandidateCard />'
    ];

    let inserted = false;
    for (const anchor of preferredAnchors) {
      if (source.includes(anchor)) {
        source = source.replace(anchor, `${anchor}\n${componentLine}`);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      source = source.replace('      <CdnPublishCard />', `${componentLine}\n      <CdnPublishCard />`);
    }
  }

  writeText(settingsPath, source);
}

function updateEnvExample() {
  if (!fs.existsSync(envExamplePath)) return;

  let source = readText(envExamplePath);
  const marker = '# Sprint 27.9 staging CDN branch test';
  if (source.includes(marker)) return;

  source += `\n${marker}\n# Staging-only test URL. Do not use this as production main CDN.\n# NEXT_PUBLIC_NOOR_DATA_MODE=cdn\n# NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn\n# NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn\n# NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn\n# NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn\n# NOOR_STAGING_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn\n`;
  writeText(envExamplePath, source);
}

updatePackageScripts();
updateSettingsPage();
updateEnvExample();

console.log('Sprint 27.9 package scripts, Settings card, and env example were updated.');
