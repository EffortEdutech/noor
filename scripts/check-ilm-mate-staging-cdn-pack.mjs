import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-publish');
const reportPath = path.join(outputRoot, 'staging-cdn-publish-report.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Required Sprint 27.4 file missing: ${path.relative(root, filePath)}`);
  }
}

requireFile(reportPath);
requireFile(path.join(outputRoot, 'staging-cdn-publish-report.md'));
requireFile(path.join(outputRoot, 'staging-cdn-domain-readiness.csv'));
requireFile(path.join(outputRoot, 'staging-cdn-required-next-evidence.csv'));
requireFile(path.join(outputRoot, 'future-noor-cdn-staging-commands.md'));

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (report.sprint !== '27.4') fail(`Expected sprint 27.4, got ${report.sprint}`);
if (report.status !== 'blocked') fail(`Sprint 27.4 status must remain blocked, got ${report.status}`);
if (report.productionApproved !== false) fail('Sprint 27.4 must not approve production.');
if (report.canPromoteToProduction !== false) fail('Sprint 27.4 must not allow production promotion.');
if (report.canPushNoorCdnMain !== false) fail('Sprint 27.4 must not allow noor-cdn/main push.');
if (!Array.isArray(report.domains) || report.domains.length !== 3) fail('Sprint 27.4 report must contain 3 domain readiness rows.');
if (report.totalEvidenceRecords !== 18) fail(`Expected 18 evidence records, got ${report.totalEvidenceRecords}.`);
if (report.blockedProductionApprovalRecords !== 3) fail(`Expected 3 blocked production approval records, got ${report.blockedProductionApprovalRecords}.`);

for (const domain of report.domains) {
  if (domain.productionApproved !== false || domain.canPromoteToProduction !== false) {
    fail(`Domain ${domain.domain} must not be production approved.`);
  }
  if (domain.nonProductionRequired !== 5) {
    fail(`Domain ${domain.domain} should require 5 non-production evidence items.`);
  }
  if (domain.acceptedForStaging < 0 || domain.acceptedForStaging > 5) {
    fail(`Invalid accepted-for-staging count for ${domain.domain}: ${domain.acceptedForStaging}`);
  }
  if (domain.stagingReady === true && domain.acceptedForStaging !== 5) {
    fail(`Domain ${domain.domain} cannot be staging-ready unless all 5 evidence items are accepted.`);
  }
}

if (report.canPushNoorCdnStaging === true && report.domainsReadyForStaging !== 3) {
  fail('Cannot push noor-cdn staging unless all 3 domains are ready.');
}

if (report.canPushNoorCdnStaging === false && report.domainsReadyForStaging === 3) {
  fail('Report says all domains are ready but staging push is false. Regenerate Sprint 27.4 report.');
}

console.log('NOOR Sprint 27.4 ilm-mate staging CDN publish pack gate check passed.');
console.log(`Domains ready for staging: ${report.domainsReadyForStaging}/3`);
console.log(`Can push noor-cdn staging branch: ${report.canPushNoorCdnStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
