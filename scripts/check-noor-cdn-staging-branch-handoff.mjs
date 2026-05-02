import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const outputRoot = path.join(root, "content-pipeline", "review", "ilm-mate-v1", "noor-cdn-staging-branch");
const reportJsonPath = path.join(outputRoot, "noor-cdn-staging-branch-handoff.json");
const reportMdPath = path.join(outputRoot, "noor-cdn-staging-branch-handoff.md");
const pushGuidePath = path.join(outputRoot, "push-noor-cdn-staging-branch.md");
const copyPs1Path = path.join(outputRoot, "copy-to-noor-cdn-staging-branch.ps1");
const verifyPs1Path = path.join(outputRoot, "verify-noor-cdn-staging-branch-local.ps1");
const sourceCandidateRoot = path.join(root, "content-pipeline", "publish", "ilm-mate-v1-staging-cdn", "noor-cdn");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Required file missing: ${path.relative(root, filePath)}`);
  }
}

for (const file of [reportJsonPath, reportMdPath, pushGuidePath, copyPs1Path, verifyPs1Path]) {
  requireFile(file);
}

if (!fs.existsSync(sourceCandidateRoot)) {
  fail("Candidate folder missing. Run pnpm ilm:staging-cdn-candidate first.");
}

const report = JSON.parse(fs.readFileSync(reportJsonPath, "utf8"));

if (report.sprint !== "27.8") fail(`Expected sprint 27.8, got ${report.sprint}`);
if (report.targetRepository !== "EffortEdutech/noor-cdn") fail(`Unexpected target repo: ${report.targetRepository}`);
if (report.targetBranch !== "staging-ilm-mate-v1") fail(`Unexpected target branch: ${report.targetBranch}`);
if (report.canPushNoorCdnStaging !== true) fail("Expected canPushNoorCdnStaging=true.");
if (report.canPushNoorCdnMain !== false) fail("Expected canPushNoorCdnMain=false.");
if (report.productionApproved !== false || report.canPromoteToProduction !== false) fail("Production promotion must remain blocked.");
if (!Array.isArray(report.blockedTargets) || !report.blockedTargets.includes("noor-cdn/main")) fail("Blocked target noor-cdn/main must be declared.");
if (Number(report.files) < 1 || Number(report.jsonFiles) < 1) fail("Report must include file counts.");

const guide = fs.readFileSync(pushGuidePath, "utf8");
if (!guide.includes("staging-ilm-mate-v1")) fail("Push guide must mention staging-ilm-mate-v1.");
if (guide.includes("git push origin main")) fail("Push guide must not instruct git push origin main.");
if (!guide.includes("git push -u origin staging-ilm-mate-v1")) fail("Push guide must instruct pushing staging-ilm-mate-v1.");

console.log("NOOR Sprint 27.8 noor-cdn staging branch handoff check passed.");
console.log(`Files: ${report.files}; JSON files: ${report.jsonFiles}; Size: ${report.totalMegabytes} MB.`);
console.log("Allowed target: noor-cdn/staging-ilm-mate-v1 only.");
console.log("Blocked target: noor-cdn/main.");
console.log("Production approved: false; canPromoteToProduction: false.");
