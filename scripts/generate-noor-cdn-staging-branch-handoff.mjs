import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();

const sourceCandidateRoot = path.join(root, "content-pipeline", "publish", "ilm-mate-v1-staging-cdn", "noor-cdn");
const candidateReportPath = path.join(root, "content-pipeline", "review", "ilm-mate-v1", "staging-cdn-candidate", "staging-candidate-report.json");
const stagingPackReportPath = path.join(root, "content-pipeline", "review", "ilm-mate-v1", "staging-cdn-publish", "staging-cdn-publish-report.json");

const outputRoot = path.join(root, "content-pipeline", "review", "ilm-mate-v1", "noor-cdn-staging-branch");
const reportJsonPath = path.join(outputRoot, "noor-cdn-staging-branch-handoff.json");
const reportMdPath = path.join(outputRoot, "noor-cdn-staging-branch-handoff.md");
const pushGuidePath = path.join(outputRoot, "push-noor-cdn-staging-branch.md");
const verifyPs1Path = path.join(outputRoot, "verify-noor-cdn-staging-branch-local.ps1");
const copyPs1Path = path.join(outputRoot, "copy-to-noor-cdn-staging-branch.ps1");

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file not found: ${path.relative(root, filePath)}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function walkFiles(dirPath) {
  const files = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function relativePortable(filePath) {
  return path.relative(sourceCandidateRoot, filePath).split(path.sep).join("/");
}

if (!fs.existsSync(sourceCandidateRoot)) {
  throw new Error(
    `Staging CDN candidate folder not found: ${path.relative(root, sourceCandidateRoot)}\n` +
    "Run pnpm ilm:staging-cdn-candidate first."
  );
}

const candidateReport = readJson(candidateReportPath);
const stagingPackReport = readJson(stagingPackReportPath);

const files = walkFiles(sourceCandidateRoot);
const jsonFiles = files.filter((file) => file.endsWith(".json"));
const totalBytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
const largestFiles = files
  .map((file) => ({ path: relativePortable(file), bytes: fs.statSync(file).size }))
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 20);

const sampledChecksums = files
  .filter((file) =>
    file.endsWith("manifest/noor-content-manifest.json") ||
    file.endsWith("manifest/noor-content-health.json") ||
    file.endsWith("metadata/surah-index.json") ||
    file.endsWith("search/search-index.json") ||
    file.endsWith("hadith/collections.json") ||
    file.endsWith("quran/surahs/001.json")
  )
  .map((file) => ({ path: relativePortable(file), sha256: sha256File(file), bytes: fs.statSync(file).size }));

const canPushNoorCdnStaging = candidateReport.canPushNoorCdnStaging === true || stagingPackReport.canPushNoorCdnStaging === true;
const canPushNoorCdnMain = candidateReport.canPushNoorCdnMain === true || stagingPackReport.canPushNoorCdnMain === true;
const productionApproved = candidateReport.productionApproved === true || stagingPackReport.productionApproved === true;
const canPromoteToProduction = candidateReport.canPromoteToProduction === true || stagingPackReport.canPromoteToProduction === true;

if (!canPushNoorCdnStaging) {
  throw new Error("Staging branch push is not allowed by the current gate.");
}

if (canPushNoorCdnMain || productionApproved || canPromoteToProduction) {
  throw new Error("Unsafe state: production/main promotion is not expected in Sprint 27.8.");
}

ensureDir(outputRoot);

const report = {
  sprint: "27.8",
  title: "NOOR CDN staging branch handoff",
  generatedAt: new Date().toISOString(),
  status: "staging-branch-ready",
  sourceCandidateRoot: "content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn",
  targetRepository: "EffortEdutech/noor-cdn",
  targetBranch: "staging-ilm-mate-v1",
  allowedTarget: "noor-cdn/staging-ilm-mate-v1",
  blockedTargets: ["noor-cdn/main", "production CDN"],
  canPushNoorCdnStaging: true,
  canPushNoorCdnMain: false,
  productionApproved: false,
  canPromoteToProduction: false,
  files: files.length,
  jsonFiles: jsonFiles.length,
  totalBytes,
  totalMegabytes: Math.round((totalBytes / 1024 / 1024) * 100) / 100,
  largestFiles,
  sampledChecksums,
  notes: [
    "This handoff does not push anything automatically.",
    "Use the generated PowerShell copy script only after switching the local noor-cdn repo to staging-ilm-mate-v1.",
    "Do not push noor-cdn/main in Sprint 27.8."
  ]
};

fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const md = `# NOOR Sprint 27.8 — noor-cdn Staging Branch Handoff

Status: **${report.status}**

## Allowed

- Target repo: \`${report.targetRepository}\`
- Target branch: \`${report.targetBranch}\`

## Blocked

- \`noor-cdn/main\`
- Production CDN
- Production promotion

## Candidate summary

| Metric | Value |
|---|---:|
| Files | ${report.files} |
| JSON files | ${report.jsonFiles} |
| Total size | ${report.totalMegabytes} MB |
| Can push staging branch | ${report.canPushNoorCdnStaging} |
| Can push noor-cdn/main | ${report.canPushNoorCdnMain} |
| Production approved | ${report.productionApproved} |
| Can promote to production | ${report.canPromoteToProduction} |

## Largest files

${largestFiles.map((file) => `- \`${file.path}\` — ${(file.bytes / 1024 / 1024).toFixed(2)} MB`).join("\n")}

## Sampled checksums

${sampledChecksums.map((item) => `- \`${item.path}\` — \`${item.sha256}\``).join("\n")}

## Next action

Follow:

\`\`\`text
content-pipeline/review/ilm-mate-v1/noor-cdn-staging-branch/push-noor-cdn-staging-branch.md
\`\`\`
`;

fs.writeFileSync(reportMdPath, md, "utf8");

const pushGuide = `# Push noor-cdn Staging Branch

This guide is for Sprint 27.8 only.

Allowed branch:

\`\`\`text
staging-ilm-mate-v1
\`\`\`

Blocked branch:

\`\`\`text
main
\`\`\`

## 1. Confirm NOOR candidate exists

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\Noor"

Test-Path "content-pipeline\\publish\\ilm-mate-v1-staging-cdn\\noor-cdn"
pnpm check:ilm-staging-cdn-candidate
pnpm check:cdn-staging-handoff
\`\`\`

## 2. Prepare local noor-cdn repo

If the local repo already exists:

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"
git checkout main
git pull origin main
git checkout -B staging-ilm-mate-v1
\`\`\`

If it does not exist:

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3"
git clone https://github.com/EffortEdutech/noor-cdn.git
cd "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"
git checkout -B staging-ilm-mate-v1
\`\`\`

## 3. Copy candidate into noor-cdn staging branch

From the \`noor-cdn\` repo folder:

\`\`\`powershell
$NOOR = "C:\\Users\\user\\Documents\\00 Combo3\\Noor"
$CDN = "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"
$SRC = Join-Path $NOOR "content-pipeline\\publish\\ilm-mate-v1-staging-cdn\\noor-cdn"
$DST = Join-Path $CDN "noor-cdn"

Test-Path $SRC
git branch --show-current

robocopy $SRC $DST /MIR
if ($LASTEXITCODE -le 7) { $global:LASTEXITCODE = 0 }

git status
\`\`\`

Before pushing, confirm current branch says:

\`\`\`text
staging-ilm-mate-v1
\`\`\`

## 4. Safety size check

\`\`\`powershell
Get-ChildItem "noor-cdn" -Recurse -File |
  Sort-Object Length -Descending |
  Select-Object -First 20 FullName, @{Name="MB";Expression={[math]::Round($_.Length / 1MB, 2)}}
\`\`\`

If any single file is close to or above 100 MB, stop and review before pushing.

## 5. Commit and push staging branch only

\`\`\`powershell
git add .
git commit -m "Publish ilm-mate v1 staging CDN candidate"
git push -u origin staging-ilm-mate-v1
\`\`\`

Do not push \`main\`.

## 6. Verify branch

After push:

\`\`\`powershell
git status
git branch --show-current
\`\`\`

Expected:

\`\`\`text
staging-ilm-mate-v1
nothing to commit, working tree clean
\`\`\`
`;

fs.writeFileSync(pushGuidePath, pushGuide, "utf8");

const copyPs1 = `# NOOR Sprint 27.8 helper
# This mirrors the staging candidate into the local noor-cdn repo on branch staging-ilm-mate-v1.
# It does not push main.

$ErrorActionPreference = "Stop"

$NOOR = "C:\\Users\\user\\Documents\\00 Combo3\\Noor"
$CDN = "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"
$SRC = Join-Path $NOOR "content-pipeline\\publish\\ilm-mate-v1-staging-cdn\\noor-cdn"
$DST = Join-Path $CDN "noor-cdn"

if (!(Test-Path $SRC)) {
  throw "NOOR staging candidate folder not found: $SRC"
}

if (!(Test-Path $CDN)) {
  throw "Local noor-cdn repo not found: $CDN"
}

Set-Location $CDN
git checkout main
git pull origin main
git checkout -B staging-ilm-mate-v1

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne "staging-ilm-mate-v1") {
  throw "Unsafe branch: $currentBranch. Expected staging-ilm-mate-v1."
}

robocopy $SRC $DST /MIR
if ($LASTEXITCODE -le 7) { $global:LASTEXITCODE = 0 }

git status

Write-Host ""
Write-Host "Ready to review and then run:"
Write-Host "git add ."
Write-Host "git commit -m 'Publish ilm-mate v1 staging CDN candidate'"
Write-Host "git push -u origin staging-ilm-mate-v1"
`;

fs.writeFileSync(copyPs1Path, copyPs1, "utf8");

const verifyPs1 = `# NOOR Sprint 27.8 local verification helper
$ErrorActionPreference = "Stop"

$CDN = "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"
Set-Location $CDN

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne "staging-ilm-mate-v1") {
  throw "Unsafe branch: $currentBranch. Expected staging-ilm-mate-v1."
}

$required = @(
  "noor-cdn\\manifest\\noor-content-manifest.json",
  "noor-cdn\\manifest\\noor-content-health.json",
  "noor-cdn\\metadata\\surah-index.json",
  "noor-cdn\\quran\\surahs\\001.json",
  "noor-cdn\\hadith\\collections.json",
  "noor-cdn\\search\\search-index.json"
)

foreach ($file in $required) {
  if (!(Test-Path $file)) {
    throw "Missing required staging CDN file: $file"
  }
}

$files = Get-ChildItem "noor-cdn" -Recurse -File
$jsonFiles = $files | Where-Object { $_.Extension -eq ".json" }
$totalMB = [math]::Round((($files | Measure-Object -Property Length -Sum).Sum / 1MB), 2)

Write-Host "NOOR CDN staging branch local verification passed."
Write-Host "Branch: $currentBranch"
Write-Host "Files: $($files.Count)"
Write-Host "JSON files: $($jsonFiles.Count)"
Write-Host "Total size MB: $totalMB"
Write-Host "Allowed push: origin staging-ilm-mate-v1"
Write-Host "Blocked push: origin main"
`;

fs.writeFileSync(verifyPs1Path, verifyPs1, "utf8");

console.log("NOOR Sprint 27.8 noor-cdn staging branch handoff generated.");
console.log(`Candidate content: ${path.relative(root, sourceCandidateRoot)}`);
console.log(`Files: ${files.length}; JSON files: ${jsonFiles.length}; Size: ${report.totalMegabytes} MB.`);
console.log("Allowed target: noor-cdn/staging-ilm-mate-v1 only.");
console.log("Blocked target: noor-cdn/main.");
