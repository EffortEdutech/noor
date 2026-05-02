import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn-git-safe', 'noor-cdn');
const reviewRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'noor-cdn-staging-git-safe');
const reportJsonPath = path.join(reviewRoot, 'git-safe-staging-pack-report.json');
const pushGuidePath = path.join(reviewRoot, 'push-noor-cdn-staging-branch-git-safe.md');
const GITHUB_HARD_LIMIT_BYTES = 100 * 1024 * 1024;
const SAFETY_LIMIT_BYTES = 90 * 1024 * 1024;

function rel(filePath, base = root) {
  return path.relative(base, filePath).split(path.sep).join('/');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`Required file missing: ${rel(filePath)}`);
}

function readJson(filePath) {
  requireFile(filePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

requireFile(reportJsonPath);
requireFile(pushGuidePath);
if (!fs.existsSync(outputRoot)) fail('Git-safe staging CDN output folder missing. Run pnpm cdn:staging-git-safe first.');

const report = readJson(reportJsonPath);
if (report.sprint !== '27.8-hotfix') fail(`Expected sprint 27.8-hotfix, got ${report.sprint}`);
if (report.targetRepository !== 'EffortEdutech/noor-cdn') fail(`Unexpected target repository: ${report.targetRepository}`);
if (report.targetBranch !== 'staging-ilm-mate-v1') fail(`Unexpected target branch: ${report.targetBranch}`);
if (report.canPushNoorCdnStaging !== true) fail('Expected canPushNoorCdnStaging=true.');
if (report.canPushNoorCdnMain !== false) fail('Expected canPushNoorCdnMain=false.');
if (report.productionApproved !== false || report.canPromoteToProduction !== false) fail('Production must remain blocked.');
if (!Array.isArray(report.blockedTargets) || !report.blockedTargets.includes('noor-cdn/main')) fail('Blocked target noor-cdn/main must be declared.');

const requiredFiles = [
  'manifest/noor-content-manifest.json',
  'manifest/noor-content-health.json',
  'metadata/surah-index.json',
  'quran/surahs/001.json',
  'hadith/collections.json',
  'search/search-index.json',
  'manifest/search-index-manifest.json'
];
for (const item of requiredFiles) {
  requireFile(path.join(outputRoot, item));
}

const searchIndex = readJson(path.join(outputRoot, 'search', 'search-index.json'));
if (!Array.isArray(searchIndex)) fail('Compatibility search/search-index.json must remain an array.');

const searchManifest = readJson(path.join(outputRoot, 'manifest', 'search-index-manifest.json'));
if (searchManifest.format !== 'sharded-v1' && report.searchWasSharded === true) fail('Expected sharded-v1 search manifest.');
if (report.searchWasSharded === true) {
  if (!Array.isArray(searchManifest.shards) || searchManifest.shards.length < 1) fail('Expected search shards in manifest.');
  const shardEntryCount = searchManifest.shards.reduce((sum, shard) => sum + Number(shard.entries ?? 0), 0);
  if (shardEntryCount !== Number(searchManifest.totalEntries)) fail(`Shard entry count mismatch: ${shardEntryCount} vs ${searchManifest.totalEntries}`);
  for (const shard of searchManifest.shards) {
    requireFile(path.join(outputRoot, shard.path));
  }
}

const files = walkFiles(outputRoot);
const overHardLimit = files.filter((file) => fs.statSync(file).size >= GITHUB_HARD_LIMIT_BYTES);
if (overHardLimit.length > 0) {
  fail(`GitHub unsafe file(s) remain: ${overHardLimit.map((file) => `${rel(file, outputRoot)} (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB)`).join(', ')}`);
}

const overSafety = files.filter((file) => fs.statSync(file).size >= SAFETY_LIMIT_BYTES);
if (overSafety.length > 0) {
  console.warn('Warning: file(s) above safety threshold but below GitHub hard limit:');
  for (const file of overSafety) {
    console.warn(`- ${rel(file, outputRoot)} (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

const guide = fs.readFileSync(pushGuidePath, 'utf8');
if (!guide.includes('staging-ilm-mate-v1')) fail('Push guide must mention staging-ilm-mate-v1.');
if (guide.includes('git push origin main')) fail('Push guide must not instruct git push origin main.');
if (!guide.includes('git push -u origin staging-ilm-mate-v1')) fail('Push guide must instruct pushing staging-ilm-mate-v1.');

const totalBytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
const jsonFiles = files.filter((file) => file.endsWith('.json'));
const largest = files
  .map((file) => ({ path: rel(file, outputRoot), bytes: fs.statSync(file).size }))
  .sort((a, b) => b.bytes - a.bytes)[0];

console.log('NOOR Sprint 27.8 git-safe noor-cdn staging pack check passed.');
console.log(`Files: ${files.length}; JSON files: ${jsonFiles.length}; Size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB.`);
console.log(`Largest file: ${largest.path} (${(largest.bytes / 1024 / 1024).toFixed(2)} MB).`);
console.log(`Search sharded: ${report.searchWasSharded}.`);
if (report.searchWasSharded) {
  console.log(`Search entries: ${searchManifest.totalEntries}; shards: ${searchManifest.shards.length}; compatibility entries: ${searchIndex.length}.`);
}
console.log('Allowed target: noor-cdn/staging-ilm-mate-v1 only.');
console.log('Blocked target: noor-cdn/main and production CDN.');
