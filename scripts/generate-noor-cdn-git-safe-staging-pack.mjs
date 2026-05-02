import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const sourceRoot = path.join(root, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn', 'noor-cdn');
const outputRoot = path.join(root, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn-git-safe', 'noor-cdn');
const reviewRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'noor-cdn-staging-git-safe');
const reportJsonPath = path.join(reviewRoot, 'git-safe-staging-pack-report.json');
const reportMdPath = path.join(reviewRoot, 'git-safe-staging-pack-report.md');
const pushGuidePath = path.join(reviewRoot, 'push-noor-cdn-staging-branch-git-safe.md');

const candidateReportPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-candidate', 'staging-candidate-report.json');
const publishReportPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-publish', 'staging-cdn-publish-report.json');

const GITHUB_HARD_LIMIT_BYTES = 100 * 1024 * 1024;
const SAFETY_LIMIT_BYTES = 90 * 1024 * 1024;
const SHARD_TARGET_BYTES = 24 * 1024 * 1024;
const LITE_ENTRY_LIMIT = 5000;

function rel(filePath, base = root) {
  return path.relative(base, filePath).split(path.sep).join('/');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value, pretty = true) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, pretty ? 2 : 0)}\n`, 'utf8');
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

function copyDir(src, dst) {
  ensureDir(dst);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else if (entry.isFile()) {
      ensureDir(path.dirname(dstPath));
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = [];
  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      if (entry.isFile()) files.push(fullPath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function summarizeFiles(dirPath) {
  const files = walkFiles(dirPath);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));
  const largestFiles = files
    .map((file) => ({ path: rel(file, dirPath), bytes: fs.statSync(file).size }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 20);
  const totalBytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  return { files, jsonFiles, largestFiles, totalBytes };
}

function assertStagingAllowed() {
  const candidateReport = readJson(candidateReportPath, {});
  const publishReport = readJson(publishReportPath, {});

  const canPushNoorCdnStaging = candidateReport.canPushNoorCdnStaging === true || publishReport.canPushNoorCdnStaging === true;
  const canPushNoorCdnMain = candidateReport.canPushNoorCdnMain === true || publishReport.canPushNoorCdnMain === true;
  const productionApproved = candidateReport.productionApproved === true || publishReport.productionApproved === true;
  const canPromoteToProduction = candidateReport.canPromoteToProduction === true || publishReport.canPromoteToProduction === true;

  if (!canPushNoorCdnStaging) {
    throw new Error('Current gate does not allow pushing noor-cdn staging branch. Run/complete Sprint 27.7 first.');
  }

  if (canPushNoorCdnMain || productionApproved || canPromoteToProduction) {
    throw new Error('Unsafe gate state: this hotfix must not run as production/main promotion.');
  }

  return { canPushNoorCdnStaging, canPushNoorCdnMain: false, productionApproved: false, canPromoteToProduction: false };
}

function writeSearchShards(searchIndexPath) {
  const originalBytes = fs.statSync(searchIndexPath).size;
  const originalSha256 = sha256File(searchIndexPath);
  const entries = readJson(searchIndexPath, []);

  if (!Array.isArray(entries)) {
    throw new Error(`Expected search index array at ${rel(searchIndexPath)}.`);
  }

  const shardDir = path.join(outputRoot, 'search', 'shards');
  removeDir(shardDir);
  ensureDir(shardDir);

  const shards = [];
  let current = [];
  let currentBytes = 2;
  let shardNumber = 1;

  function flushShard() {
    if (current.length === 0) return;
    const shardName = `search-index-${String(shardNumber).padStart(4, '0')}.json`;
    const shardPath = path.join(shardDir, shardName);
    writeJson(shardPath, current, false);
    const bytes = fs.statSync(shardPath).size;
    shards.push({
      number: shardNumber,
      path: `search/shards/${shardName}`,
      entries: current.length,
      bytes,
      megabytes: Math.round((bytes / 1024 / 1024) * 100) / 100,
      sha256: sha256File(shardPath)
    });
    shardNumber += 1;
    current = [];
    currentBytes = 2;
  }

  for (const entry of entries) {
    const serialized = JSON.stringify(entry);
    const entryBytes = Buffer.byteLength(serialized, 'utf8') + 2;
    if (current.length > 0 && currentBytes + entryBytes > SHARD_TARGET_BYTES) {
      flushShard();
    }
    current.push(entry);
    currentBytes += entryBytes;
  }
  flushShard();

  const liteEntries = entries.slice(0, Math.min(entries.length, LITE_ENTRY_LIMIT));
  const compatibilityPath = path.join(outputRoot, 'search', 'search-index.json');
  const litePath = path.join(outputRoot, 'search', 'search-index-lite.json');
  writeJson(compatibilityPath, liteEntries, false);
  writeJson(litePath, liteEntries, false);

  const byType = entries.reduce((acc, item) => {
    const key = String(item?.type ?? 'unknown');
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const shardManifest = {
    name: 'NOOR CDN Search Index',
    format: 'sharded-v1',
    generatedAt: new Date().toISOString(),
    source: 'ilm-mate-v1-staging-cdn',
    totalEntries: entries.length,
    byType,
    githubSafe: true,
    githubHardLimitBytes: GITHUB_HARD_LIMIT_BYTES,
    safetyLimitBytes: SAFETY_LIMIT_BYTES,
    originalMonolithicIndex: {
      path: 'search/search-index.json',
      bytes: originalBytes,
      megabytes: Math.round((originalBytes / 1024 / 1024) * 100) / 100,
      sha256: originalSha256,
      omittedFromGitSafePack: true,
      reason: 'GitHub blocks individual files larger than 100 MB.'
    },
    compatibilityIndex: {
      path: 'search/search-index.json',
      mode: 'lite-sample',
      entries: liteEntries.length,
      bytes: fs.statSync(compatibilityPath).size,
      sha256: sha256File(compatibilityPath),
      note: 'Temporary compatibility file for existing Sprint 26 browser loader. Full index is in shards.'
    },
    liteIndex: {
      path: 'search/search-index-lite.json',
      entries: liteEntries.length,
      bytes: fs.statSync(litePath).size,
      sha256: sha256File(litePath)
    },
    shards,
    fullIndexEntryCountFromShards: shards.reduce((sum, shard) => sum + shard.entries, 0)
  };

  writeJson(path.join(outputRoot, 'manifest', 'search-index-manifest.json'), shardManifest, true);

  return shardManifest;
}

function patchContentManifest(shardManifest) {
  const manifestPath = path.join(outputRoot, 'manifest', 'noor-content-manifest.json');
  const manifest = readJson(manifestPath, null);
  if (!manifest || typeof manifest !== 'object') return false;

  manifest.search = {
    ...(typeof manifest.search === 'object' && manifest.search ? manifest.search : {}),
    format: 'sharded-v1',
    compatibilityIndex: 'search/search-index.json',
    liteIndex: 'search/search-index-lite.json',
    shardManifest: 'manifest/search-index-manifest.json',
    shardCount: shardManifest.shards.length,
    totalEntries: shardManifest.totalEntries,
    githubSafe: true
  };

  writeJson(manifestPath, manifest, true);
  return true;
}

if (!fs.existsSync(sourceRoot)) {
  console.error(`Source staging CDN candidate not found: ${rel(sourceRoot)}`);
  console.error('Run pnpm ilm:staging-cdn-candidate first.');
  process.exit(1);
}

let gates;
try {
  gates = assertStagingAllowed();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

removeDir(outputRoot);
ensureDir(path.dirname(outputRoot));
copyDir(sourceRoot, outputRoot);

const sourceSearchIndex = path.join(sourceRoot, 'search', 'search-index.json');
const outputSearchIndex = path.join(outputRoot, 'search', 'search-index.json');
let shardManifest = null;
let searchWasSharded = false;

if (fs.existsSync(outputSearchIndex)) {
  const searchBytes = fs.statSync(outputSearchIndex).size;
  if (searchBytes > SAFETY_LIMIT_BYTES) {
    shardManifest = writeSearchShards(outputSearchIndex);
    searchWasSharded = true;
    patchContentManifest(shardManifest);
  }
}

const summary = summarizeFiles(outputRoot);
const overLimitFiles = summary.files
  .map((file) => ({ path: rel(file, outputRoot), bytes: fs.statSync(file).size }))
  .filter((file) => file.bytes >= GITHUB_HARD_LIMIT_BYTES)
  .sort((a, b) => b.bytes - a.bytes);
const overSafetyFiles = summary.files
  .map((file) => ({ path: rel(file, outputRoot), bytes: fs.statSync(file).size }))
  .filter((file) => file.bytes >= SAFETY_LIMIT_BYTES)
  .sort((a, b) => b.bytes - a.bytes);

if (overLimitFiles.length > 0) {
  console.error('GitHub-unsafe files remain in git-safe staging pack:');
  for (const file of overLimitFiles) {
    console.error(`- ${file.path} (${(file.bytes / 1024 / 1024).toFixed(2)} MB)`);
  }
  process.exit(1);
}

ensureDir(reviewRoot);

const report = {
  sprint: '27.8-hotfix',
  title: 'Git-safe noor-cdn staging pack',
  generatedAt: new Date().toISOString(),
  status: overSafetyFiles.length === 0 ? 'git-safe-staging-ready' : 'git-safe-staging-ready-with-warnings',
  sourceRoot: 'content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn',
  outputRoot: 'content-pipeline/publish/ilm-mate-v1-staging-cdn-git-safe/noor-cdn',
  targetRepository: 'EffortEdutech/noor-cdn',
  targetBranch: 'staging-ilm-mate-v1',
  allowedTarget: 'noor-cdn/staging-ilm-mate-v1',
  blockedTargets: ['noor-cdn/main', 'production CDN'],
  ...gates,
  githubHardLimitBytes: GITHUB_HARD_LIMIT_BYTES,
  safetyLimitBytes: SAFETY_LIMIT_BYTES,
  searchWasSharded,
  searchShardManifest: shardManifest ? 'manifest/search-index-manifest.json' : null,
  files: summary.files.length,
  jsonFiles: summary.jsonFiles.length,
  totalBytes: summary.totalBytes,
  totalMegabytes: Math.round((summary.totalBytes / 1024 / 1024) * 100) / 100,
  largestFiles: summary.largestFiles.map((file) => ({
    ...file,
    megabytes: Math.round((file.bytes / 1024 / 1024) * 100) / 100
  })),
  overLimitFiles,
  overSafetyFiles: overSafetyFiles.map((file) => ({
    ...file,
    megabytes: Math.round((file.bytes / 1024 / 1024) * 100) / 100
  })),
  shardManifest
};

writeJson(reportJsonPath, report, true);

const md = `# NOOR Sprint 27.8 Hotfix — Git-safe noor-cdn Staging Pack

Status: **${report.status}**

## Target

- Repository: \`${report.targetRepository}\`
- Branch: \`${report.targetBranch}\`
- Allowed push: \`${report.allowedTarget}\`

## Blocked

- \`noor-cdn/main\`
- Production CDN
- Production promotion

## Pack summary

| Metric | Value |
|---|---:|
| Files | ${report.files} |
| JSON files | ${report.jsonFiles} |
| Total size | ${report.totalMegabytes} MB |
| Search sharded | ${report.searchWasSharded} |
| Over GitHub hard limit files | ${report.overLimitFiles.length} |
| Production approved | ${report.productionApproved} |
| Can promote to production | ${report.canPromoteToProduction} |

## Largest files

${report.largestFiles.map((file) => `- \`${file.path}\` — ${file.megabytes} MB`).join('\n')}

## Search sharding

${shardManifest ? `- Full search entries: ${shardManifest.totalEntries}\n- Shards: ${shardManifest.shards.length}\n- Compatibility lite entries: ${shardManifest.compatibilityIndex.entries}` : '- Search index did not require sharding.'}

## Next action

Follow:

\`content-pipeline/review/ilm-mate-v1/noor-cdn-staging-git-safe/push-noor-cdn-staging-branch-git-safe.md\`
`;
fs.writeFileSync(reportMdPath, md, 'utf8');

const pushGuide = `# Push noor-cdn Staging Branch — Git-safe Route

Use this guide after running:

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\Noor"
pnpm cdn:staging-git-safe
pnpm check:cdn-staging-git-safe
\`\`\`

## Important safety rule

Push only:

\`\`\`text
noor-cdn/staging-ilm-mate-v1
\`\`\`

Do not push:

\`\`\`text
noor-cdn/main
\`\`\`

## 1. Reset local noor-cdn staging branch if the previous attempt copied big files

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"

git status
git reset
git restore .
git clean -fd noor-cdn

git checkout main
git pull origin main
git checkout -B staging-ilm-mate-v1 main

git status
git branch --show-current
\`\`\`

Expected branch:

\`\`\`text
staging-ilm-mate-v1
\`\`\`

## 2. Copy the git-safe pack

\`\`\`powershell
$NOOR = "C:\\Users\\user\\Documents\\00 Combo3\\Noor"
$CDN = "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"
$SRC = Join-Path $NOOR "content-pipeline\\publish\\ilm-mate-v1-staging-cdn-git-safe\\noor-cdn"
$DST = Join-Path $CDN "noor-cdn"

Test-Path $SRC
git branch --show-current

robocopy $SRC $DST /MIR
if ($LASTEXITCODE -le 7) { $global:LASTEXITCODE = 0 }
\`\`\`

## 3. Confirm no file is above 100 MB

\`\`\`powershell
Get-ChildItem "noor-cdn" -Recurse -File |
  Sort-Object Length -Descending |
  Select-Object -First 20 FullName, @{Name="MB";Expression={[math]::Round($_.Length / 1MB, 2)}}
\`\`\`

Stop if any single file is near or above 100 MB.

## 4. Commit and push staging branch only

\`\`\`powershell
git status
git add .
git commit -m "Publish ilm-mate v1 git-safe staging CDN candidate"
git push -u origin staging-ilm-mate-v1
git status
\`\`\`

Do not push \`main\`.
`;
fs.writeFileSync(pushGuidePath, pushGuide, 'utf8');

console.log('NOOR Sprint 27.8 git-safe noor-cdn staging pack generated.');
console.log(`Output: ${rel(outputRoot)}`);
console.log(`Files: ${report.files}; JSON files: ${report.jsonFiles}; Size: ${report.totalMegabytes} MB.`);
console.log(`Search sharded: ${searchWasSharded}`);
if (shardManifest) {
  console.log(`Search entries: ${shardManifest.totalEntries}; shards: ${shardManifest.shards.length}; lite entries: ${shardManifest.compatibilityIndex.entries}.`);
}
console.log('Allowed target: noor-cdn/staging-ilm-mate-v1 only.');
console.log('Blocked target: noor-cdn/main and production CDN.');
