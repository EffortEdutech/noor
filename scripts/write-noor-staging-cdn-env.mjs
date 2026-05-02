import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const STAGING_BASE = (process.env.NOOR_STAGING_CDN_BASE || 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn').replace(/\/+$/, '');
const writeLocal = process.argv.includes('--write-local');

if (!STAGING_BASE.includes('@staging-ilm-mate-v1')) {
  throw new Error(`Refusing to write staging env because base is not staging branch: ${STAGING_BASE}`);
}

const envContent = `# NOOR Sprint 27.9 staging CDN runtime test\n# Staging-only branch. Do not use this as production CDN main.\nNEXT_PUBLIC_NOOR_DATA_MODE=cdn\nNEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${STAGING_BASE}\nNEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${STAGING_BASE}\nNEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${STAGING_BASE}\nNEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${STAGING_BASE}\nNOOR_STAGING_CDN_BASE=${STAGING_BASE}\n`;

const templatePath = path.join(root, '.env.local.staging-ilm-mate-v1');
fs.writeFileSync(templatePath, envContent, 'utf8');

const reviewDir = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'noor-cdn-staging-runtime');
fs.mkdirSync(reviewDir, { recursive: true });
fs.writeFileSync(
  path.join(reviewDir, 'staging-env-template.md'),
  `# NOOR Sprint 27.9 staging env template\n\nGenerated file:\n\n\`\`\`text\n.env.local.staging-ilm-mate-v1\n\`\`\`\n\nStaging base:\n\n\`\`\`text\n${STAGING_BASE}\n\`\`\`\n\nTo run local app against staging CDN:\n\n\`\`\`powershell\npnpm cdn:staging-env -- --write-local\npnpm dev\n\`\`\`\n\nThen open http://localhost:3200/settings and choose External CDN if the cookie is not already set to cdn.\n`,
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
