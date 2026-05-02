import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const VERSION = '0.27.7';
const reviewRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1');
const stagingGateRoot = path.join(reviewRoot, 'staging-cdn-publish');
const stagingGateReportPath = path.join(stagingGateRoot, 'staging-cdn-publish-report.json');
const candidateReviewRoot = path.join(reviewRoot, 'staging-cdn-candidate');
const migratedCdnRoot = path.join(root, 'content-pipeline', 'imported', 'ilm-mate-v1', 'noor-cdn');
const publishRoot = path.join(root, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn');
const candidateContentRoot = path.join(publishRoot, 'noor-cdn');
const noorCdnRepoDefault = path.resolve(root, '..', 'noor-cdn');
const targetBranch = 'staging-ilm-mate-v1';

function toPosix(relativePath) {
  return relativePath.replaceAll('\\', '/');
}

function rel(filePath) {
  return toPosix(path.relative(root, filePath));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, 'utf8');
}

function hashFile(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      out.push(entryPath);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows, headers) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  return `${lines.join('\n')}\n`;
}

function requireFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} missing: ${rel(filePath)}`);
  }
}

function writeMarkdown(report) {
  return `# NOOR Sprint 27.7 — ilm-mate Staging CDN Candidate Pack

Generated: ${report.generatedAt}

## Decision

- Can push noor-cdn staging branch: **${report.canPushNoorCdnStaging}**
- Target repository: \`${report.noorCdnTarget.repository}\`
- Target branch: \`${report.noorCdnTarget.branch}\`
- Candidate source folder: \`${report.candidate.contentRoot}\`
- Candidate files: **${report.candidate.fileCount}**
- Candidate JSON files: **${report.candidate.jsonFileCount}**
- Candidate bytes: **${report.candidate.totalBytes}**
- Production approved: **false**
- Can push noor-cdn main: **false**
- Can promote to production: **false**

## Domain readiness

${report.domains.map((domain) => `- ${domain.domainLabel}: stagingReady=${domain.stagingReady}, accepted=${domain.acceptedForStaging}/${domain.nonProductionRequired}`).join('\n')}

## Required next action

Use this candidate only for a separate \`noor-cdn/staging-ilm-mate-v1\` branch.

Do **not** push to \`noor-cdn/main\` in Sprint 27.7.

## Guardrails

${report.guardrails.map((item) => `- ${item}`).join('\n')}

`;
}

function writeCommands(report) {
  const noorDir = root.replaceAll('\\', '\\\\');
  const noorCdnDir = noorCdnRepoDefault.replaceAll('\\', '\\\\');
  return `# NOOR Sprint 27.7 — Copy Candidate to noor-cdn Staging Branch

This file contains the exact staging-only workflow.

## 1. From NOOR repo, regenerate the candidate

\`\`\`powershell
cd "${noorDir}"

pnpm ilm:staging-cdn-candidate
pnpm check:ilm-staging-cdn-candidate
\`\`\`

## 2. Go to local noor-cdn repo

\`\`\`powershell
cd "${noorCdnDir}"

git fetch origin
git checkout -B ${report.noorCdnTarget.branch}
\`\`\`

## 3. Copy candidate content

Copy everything inside:

\`\`\`text
${report.candidate.contentRoot}
\`\`\`

into your local noor-cdn repo root so the repo contains:

\`\`\`text
noor-cdn/
\`\`\`

PowerShell copy command:

\`\`\`powershell
robocopy "${path.join(root, report.candidate.contentRoot).replaceAll('\\', '\\\\')}" "${noorCdnDir}\\\\noor-cdn" /E
\`\`\`

Robocopy may return exit code 1 when files copied successfully. That is normal.

## 4. Commit to staging branch only

\`\`\`powershell
git status
git add .
git commit -m "Add ilm-mate v1 staging CDN candidate"
git push -u origin ${report.noorCdnTarget.branch}
\`\`\`

## Forbidden in Sprint 27.7

\`\`\`text
git checkout main
git push origin main
\`\`\`

Do not update \`noor-cdn/main\` yet.
`;
}

console.log('Regenerating Sprint 27.4 staging CDN gate before building candidate...');
await import('./generate-ilm-mate-staging-cdn-pack.mjs');

requireFile(stagingGateReportPath, 'Staging CDN gate report');
const gate = readJson(stagingGateReportPath);

if (gate.canPushNoorCdnStaging !== true) {
  throw new Error('Staging CDN candidate blocked: canPushNoorCdnStaging is not true. Complete required evidence acceptance first.');
}
if (gate.canPushNoorCdnMain !== false || gate.productionApproved !== false || gate.canPromoteToProduction !== false) {
  throw new Error('Unsafe gate state. Sprint 27.7 may only allow staging branch candidate, never production/main.');
}
if (gate.domainsReadyForStaging !== 3) {
  throw new Error(`Staging CDN candidate blocked: domainsReadyForStaging must be 3, got ${gate.domainsReadyForStaging}.`);
}

requireFile(path.join(migratedCdnRoot, 'metadata', 'surah-index.json'), 'Migrated Surah index');
requireFile(path.join(migratedCdnRoot, 'quran', 'surahs', '001.json'), 'Migrated Quran sample Surah 001');
requireFile(path.join(migratedCdnRoot, 'hadith', 'collections.json'), 'Migrated Hadith collections');
requireFile(path.join(migratedCdnRoot, 'search', 'search-index.json'), 'Migrated search index');

fs.rmSync(publishRoot, { recursive: true, force: true });
fs.mkdirSync(publishRoot, { recursive: true });
fs.cpSync(migratedCdnRoot, candidateContentRoot, { recursive: true });

const files = walkFiles(candidateContentRoot);
const fileRows = files.map((filePath) => {
  const stat = fs.statSync(filePath);
  const relativeToCandidate = toPosix(path.relative(candidateContentRoot, filePath));
  return {
    path: relativeToCandidate,
    bytes: stat.size,
    sha256: hashFile(filePath)
  };
});
const jsonFileCount = fileRows.filter((row) => row.path.endsWith('.json')).length;
const totalBytes = fileRows.reduce((sum, row) => sum + row.bytes, 0);

const topLevelFolders = fs.readdirSync(candidateContentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const report = {
  sprint: '27.7',
  version: VERSION,
  label: 'ilm-mate staging CDN candidate pack',
  generatedAt: new Date().toISOString(),
  status: 'staging-candidate-ready',
  productionApproved: false,
  canPromoteToProduction: false,
  canPushNoorCdnStaging: true,
  canPushNoorCdnMain: false,
  sourceGate: {
    reportPath: rel(stagingGateReportPath),
    domainsReadyForStaging: gate.domainsReadyForStaging,
    totalDomains: gate.totalDomains,
    acceptedForStaging: gate.acceptedForStaging
  },
  candidate: {
    publishRoot: rel(publishRoot),
    contentRoot: rel(candidateContentRoot),
    fileIndexPath: rel(path.join(candidateReviewRoot, 'staging-candidate-file-index.csv')),
    fileCount: fileRows.length,
    jsonFileCount,
    totalBytes,
    topLevelFolders
  },
  noorCdnTarget: {
    repository: 'EffortEdutech/noor-cdn',
    localRepoSuggestion: toPosix(noorCdnRepoDefault),
    branch: targetBranch,
    path: 'noor-cdn/',
    rule: 'Staging branch only. Do not push migrated ilm-mate content to noor-cdn/main in Sprint 27.7.'
  },
  domains: gate.domains,
  guardrails: [
    'noor-cdn/main must not be updated in Sprint 27.7.',
    'Only noor-cdn/staging-ilm-mate-v1 is allowed for this candidate.',
    'Production CDN remains blocked.',
    'production_promotion_approval records must remain blocked.',
    'Candidate files are generated under content-pipeline/publish and are intentionally ignored by Git in the noor app repo.'
  ],
  commands: [
    'pnpm ilm:staging-cdn-candidate',
    'pnpm check:ilm-staging-cdn-candidate',
    'robocopy "<NOOR>/content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn" "<noor-cdn>/noor-cdn" /E'
  ]
};

fs.mkdirSync(candidateReviewRoot, { recursive: true });
writeJson(path.join(candidateReviewRoot, 'staging-candidate-report.json'), report);
writeText(path.join(candidateReviewRoot, 'staging-candidate-report.md'), writeMarkdown(report));
writeText(path.join(candidateReviewRoot, 'copy-to-noor-cdn-staging-branch.md'), writeCommands(report));
writeText(
  path.join(candidateReviewRoot, 'staging-candidate-file-index.csv'),
  toCsv(fileRows, ['path', 'bytes', 'sha256'])
);
writeJson(path.join(publishRoot, 'staging-candidate-manifest.json'), {
  ...report,
  fileIndex: fileRows
});

console.log('NOOR Sprint 27.7 ilm-mate staging CDN candidate pack generated.');
console.log(`Candidate content: ${report.candidate.contentRoot}`);
console.log(`Files: ${report.candidate.fileCount}; JSON files: ${report.candidate.jsonFileCount}; bytes: ${report.candidate.totalBytes}.`);
console.log('Can push noor-cdn staging branch: true.');
console.log('Can push noor-cdn main: false.');
console.log('Production approved: false; canPromoteToProduction: false.');
console.log(`Review report: ${rel(path.join(candidateReviewRoot, 'staging-candidate-report.md'))}`);
