import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const [, , versionArg, ...labelParts] = process.argv;
const version = versionArg;
const label = labelParts.join(' ').trim() || `NOOR v${version}`;
const date = new Date().toISOString().slice(0, 10);

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: pnpm release:bump <x.y.z> "Sprint label"');
  console.error('Example: pnpm release:bump 0.12.0 "Sprint 12 — CDN source switcher"');
  process.exit(1);
}

const appVersionPath = 'apps/web/lib/app-version.ts';
const versionJsonPath = 'apps/web/public/version.json';
const changelogPath = 'CHANGELOG.md';
const releaseNotesPath = 'RELEASE_NOTES.md';

writeFileSync(
  appVersionPath,
  `export const NOOR_APP_VERSION = '${version}';\n` +
    `export const NOOR_APP_BUILD_LABEL = '${label.replaceAll("'", "\\'")}';\n` +
    `export const NOOR_APP_RELEASE_DATE = '${date}';\n\n` +
    `export function getNoorVersionLabel() {\n` +
    `  return \`NOOR v\${NOOR_APP_VERSION}\`;\n` +
    `}\n`
);

writeFileSync(
  versionJsonPath,
  `${JSON.stringify({ name: 'NOOR', version, label, releasedAt: date }, null, 2)}\n`
);

const entry = `## v${version} — ${date}\n\n${label}\n\n- Update release notes before pushing.\n- Run pnpm check:release before committing.\n\n`;
const existingChangelog = existsSync(changelogPath) ? readFileSync(changelogPath, 'utf8') : '# NOOR Changelog\n\n';
if (!existingChangelog.includes(`v${version}`)) {
  const updated = existingChangelog.startsWith('# NOOR Changelog')
    ? existingChangelog.replace('# NOOR Changelog\n\n', `# NOOR Changelog\n\n${entry}`)
    : `# NOOR Changelog\n\n${entry}${existingChangelog}`;
  writeFileSync(changelogPath, updated);
}

writeFileSync(
  releaseNotesPath,
  `# NOOR v${version}\n\n${label}\n\nReleased: ${date}\n\n## Notes\n\n- Update this file with the release summary before pushing to main.\n- GitHub Actions will use this file as the GitHub Release body.\n`
);

console.log(`NOOR version files updated to v${version}.`);
console.log('Next: update apps/web/lib/release-notes.ts, then run pnpm check:release.');
