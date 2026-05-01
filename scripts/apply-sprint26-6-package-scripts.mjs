import { existsSync, readFileSync, writeFileSync } from 'node:fs';

function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }
function writeJson(path, value) { writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8'); }

function addPackageScripts() {
  const packagePath = 'package.json';
  const pkg = readJson(packagePath);
  pkg.scripts ??= {};
  const desired = {
    'ilm:review-console': 'node scripts/generate-ilm-mate-review-console.mjs',
    'check:ilm-review-console': 'node scripts/check-ilm-mate-review-console.mjs'
  };
  let changed = false;
  for (const [key, value] of Object.entries(desired)) {
    if (pkg.scripts[key] !== value) {
      pkg.scripts[key] = value;
      changed = true;
    }
  }
  if (changed) {
    writeJson(packagePath, pkg);
    console.log('Sprint 26.6 package scripts added to package.json.');
  } else {
    console.log('Sprint 26.6 package scripts already present.');
  }
}

function patchSettingsPage() {
  const settingsPath = 'apps/web/app/settings/page.tsx';
  if (!existsSync(settingsPath)) {
    console.warn(`Settings page not found: ${settingsPath}`);
    return;
  }

  let content = readFileSync(settingsPath, 'utf8');
  let changed = false;

  const importLine = "import { IlmMateReviewConsoleCard } from '../../components/IlmMateReviewConsoleCard';\n";
  if (!content.includes('IlmMateReviewConsoleCard')) {
    const anchor = "import { ScholarlyReviewConsoleCard } from '../../components/ScholarlyReviewConsoleCard';\n";
    content = content.includes(anchor) ? content.replace(anchor, `${anchor}${importLine}`) : `${importLine}${content}`;
    changed = true;
  }

  const cardLine = '      <IlmMateReviewConsoleCard />\n';
  if (!content.includes('<IlmMateReviewConsoleCard />')) {
    const anchor = '      <ScholarlyReviewConsoleCard />\n';
    const fallback = '      <QuranSourceGateCard />\n';
    content = content.includes(anchor) ? content.replace(anchor, `${anchor}${cardLine}`) : content.replace(fallback, `${cardLine}${fallback}`);
    changed = true;
  }

  if (changed) {
    writeFileSync(settingsPath, content, 'utf8');
    console.log('Settings page updated with Sprint 26.6 review console card.');
  } else {
    console.log('Settings page already contains Sprint 26.6 review console card.');
  }
}

addPackageScripts();
patchSettingsPage();
console.log('Sprint 26.6 patch registration complete.');
