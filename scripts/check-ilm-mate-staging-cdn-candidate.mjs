import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-candidate');
const reportPath = path.join(reviewRoot, 'staging-candidate-report.json');
const fileIndexPath = path.join(reviewRoot, 'staging-candidate-file-index.csv');
const publishRoot = path.join(root, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn');
const manifestPath = path.join(publishRoot, 'staging-candidate-manifest.json');
const candidateRoot = path.join(publishRoot, 'noor-cdn');

function rel(filePath) {
  return path.relative(root, filePath).replaceAll('\\', '/');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function requireFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} missing: ${rel(filePath)}`);
  }
}

requireFile(reportPath, 'Sprint 27.7 staging candidate review report');
requireFile(fileIndexPath, 'Sprint 27.7 staging candidate file index');
requireFile(manifestPath, 'Sprint 27.7 staging candidate manifest');
requireFile(path.join(candidateRoot, 'metadata', 'surah-index.json'), 'Candidate Surah index');
requireFile(path.join(candidateRoot, 'quran', 'surahs', '001.json'), 'Candidate Quran sample Surah 001');
requireFile(path.join(candidateRoot, 'hadith', 'collections.json'), 'Candidate Hadith collections');
requireFile(path.join(candidateRoot, 'search', 'search-index.json'), 'Candidate search index');

const report = readJson(reportPath);
const manifest = readJson(manifestPath);

if (report.sprint !== '27.7') throw new Error(`Expected sprint 27.7 report, got ${report.sprint}`);
if (report.canPushNoorCdnStaging !== true) throw new Error('Sprint 27.7 must allow only staging branch candidate.');
if (report.canPushNoorCdnMain !== false) throw new Error('Sprint 27.7 must not allow noor-cdn/main.');
if (report.productionApproved !== false) throw new Error('Sprint 27.7 must keep productionApproved=false.');
if (report.canPromoteToProduction !== false) throw new Error('Sprint 27.7 must keep canPromoteToProduction=false.');
if (report.sourceGate?.domainsReadyForStaging !== 3) {
  throw new Error(`Expected 3 domains ready for staging, got ${report.sourceGate?.domainsReadyForStaging}.`);
}
if (report.noorCdnTarget?.branch !== 'staging-ilm-mate-v1') {
  throw new Error(`Expected noor-cdn staging branch staging-ilm-mate-v1, got ${report.noorCdnTarget?.branch}.`);
}
if (manifest.canPushNoorCdnMain !== false || manifest.canPromoteToProduction !== false) {
  throw new Error('Candidate manifest has unsafe production flags.');
}
if (!Array.isArray(manifest.fileIndex) || manifest.fileIndex.length === 0) {
  throw new Error('Candidate manifest fileIndex is empty.');
}
if (report.candidate.fileCount !== manifest.fileIndex.length) {
  throw new Error(`Candidate file count mismatch: report=${report.candidate.fileCount}, manifest=${manifest.fileIndex.length}.`);
}
if (report.candidate.jsonFileCount < 10) {
  throw new Error(`Candidate JSON file count is unexpectedly low: ${report.candidate.jsonFileCount}.`);
}

console.log('NOOR Sprint 27.7 ilm-mate staging CDN candidate check passed.');
console.log(`Candidate content: ${report.candidate.contentRoot}`);
console.log(`Files: ${report.candidate.fileCount}; JSON files: ${report.candidate.jsonFileCount}.`);
console.log('Allowed target: noor-cdn/staging-ilm-mate-v1 only.');
console.log('Blocked target: noor-cdn/main.');
console.log('Production approved: false; canPromoteToProduction: false.');
