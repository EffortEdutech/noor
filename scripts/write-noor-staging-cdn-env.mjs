import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const DEFAULT_STAGING_BASE = 'https://raw.githubusercontent.com/EffortEdutech/noor-cdn/staging-ilm-mate-v1/noor-cdn';
const STAGING_BASE = (process.env.NOOR_STAGING_CDN_BASE || DEFAULT_STAGING_BASE).replace(/\/+$/, '');
const writeLocal = process.argv.includes('--write-local');

const isStagingBranchBase =
  STAGING_BASE.includes('@staging-ilm-mate-v1') ||
  STAGING_BASE.includes('/staging-ilm-mate-v1/');

if (!isStagingBranchBase) {
  throw new Error(`Refusing to write staging env because base is not staging branch: ${STAGING_BASE}`);
}

const envContent = `# NOOR Sprint 27.9 staging CDN runtime test
# Staging-only branch. Do not use this as production CDN main.
# Default uses raw.githubusercontent.com to avoid jsDelivr branch-cache delay during staging tests.
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${STAGING_BASE}
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${STAGING_BASE}
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${STAGING_BASE}
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${STAGING_BASE}
NOOR_STAGING_CDN_BASE=${STAGING_BASE}
`;

const templatePath = path.join(root, '.env.local.staging-ilm-mate-v1');
fs.writeFileSync(templatePath, envContent, 'utf8');

const reviewDir = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'noor-cdn-staging-runtime');
fs.mkdirSync(reviewDir, { recursive: true });
fs.writeFileSync(
  path.join(reviewDir, 'staging-env-template.md'),
  `# NOOR Sprint 27.9 staging env template

Generated file:

\`\`\`text
.env.local.staging-ilm-mate-v1
\`\`\`

Staging base:

\`\`\`text
${STAGING_BASE}
\`\`\`

To run local app against staging CDN:

\`\`\`powershell
pnpm cdn:staging-env -- --write-local
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
pnpm dev -- --port 3200
\`\`\`

Then open http://localhost:3200/settings and choose External CDN if the cookie is not already set to cdn.

For staging tests, raw.githubusercontent.com is preferred because jsDelivr can cache a branch snapshot while the staging branch is changing.
`,
  'utf8'
);

if (writeLocal) {
  const localPath = path.join(root, '.env.local');
  if (fs.existsSync(localPath)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(root, `.env.local.backup-before-sprint27-9-${stamp}`);
    fs.copyFileSync(localPath, backupPath);
    console.log(`Existing .env.local backed up to ${path.basename(backupPath)}`);
  }
  fs.writeFileSync(localPath, envContent, 'utf8');
  console.log('.env.local written for staging CDN runtime testing.');
} else {
  console.log('.env.local.staging-ilm-mate-v1 generated.');
  console.log('Run pnpm cdn:staging-env -- --write-local to write .env.local safely with backup.');
}

console.log(`Staging CDN base: ${STAGING_BASE}`);
