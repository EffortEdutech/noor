import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('content-pipeline', 'production-cdn', 'environment-finalization');
const JSDELIVR_MAIN = 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn';
const RAW_MAIN = 'https://raw.githubusercontent.com/EffortEdutech/noor-cdn/main/noor-cdn';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function read(file) {
  return readFileSync(file, 'utf8');
}

mkdirSync(OUT_DIR, { recursive: true });

const productionExecutionPath = path.join('content-pipeline', 'production-cdn', 'promotion-execution', 'noor-cdn-production-promotion-execution.json');
const smokePath = path.join('content-pipeline', 'production-cdn', 'runtime-qa', 'production-cdn-smoke-test-report.json');
const browserQaPath = path.join('content-pipeline', 'production-cdn', 'runtime-qa', 'production-browser-qa-report.json');

const productionExecution = existsSync(productionExecutionPath) ? readJson(productionExecutionPath) : null;
const smokeReport = existsSync(smokePath) ? readJson(smokePath) : null;
const browserQaReport = existsSync(browserQaPath) ? readJson(browserQaPath) : null;
const configSource = read(path.join('packages', 'noor-data', 'src', 'config.ts'));

const checks = [
  {
    id: 'promotion-executed',
    required: true,
    passed: productionExecution?.promotionStatus === 'production_promoted' && productionExecution?.targetBranch === 'noor-cdn/main',
    detail: 'noor-cdn/main has been promoted from the approved staging branch.'
  },
  {
    id: 'smoke-test-passed',
    required: true,
    passed: String(smokeReport?.status ?? '').includes('passed') || smokeReport?.accepted === true || smokeReport?.passed === true,
    detail: 'Production CDN public endpoints have passed the Sprint 27.15 smoke test.'
  },
  {
    id: 'browser-qa-passed',
    required: true,
    passed: String(browserQaReport?.status ?? '').includes('accepted') || browserQaReport?.accepted === true || browserQaReport?.passed === true,
    detail: 'Production browser QA has been accepted for runtime usage.'
  },
  {
    id: 'production-default-cdn',
    required: true,
    passed: configSource.includes("PRODUCTION_NOOR_DATA_MODE: NoorDataMode = 'cdn'") && configSource.includes('process.env?.NODE_ENV') && configSource.includes("DEVELOPMENT_NOOR_DATA_MODE: NoorDataMode = 'mock'"),
    detail: 'Production builds default to external CDN while development remains mock fallback.'
  },
  {
    id: 'main-cdn-base',
    required: true,
    passed: configSource.includes(JSDELIVR_MAIN),
    detail: 'Default production CDN base points to noor-cdn@main.'
  },
  {
    id: 'fallback-safety',
    required: true,
    passed: configSource.includes('fallbackEnabled: true'),
    detail: 'Bundled fallback remains enabled for runtime safety.'
  }
];

const requiredFailures = checks.filter((check) => check.required && !check.passed).map((check) => check.id);
const status = requiredFailures.length === 0 ? 'production_runtime_default_finalized' : 'blocked';

const report = {
  sprint: '27.16',
  title: 'Production Mode Default / Environment Finalization',
  generatedAt: new Date().toISOString(),
  status,
  productionRuntimeDefault: 'cdn',
  developmentRuntimeDefault: 'mock',
  canonicalProductionCdnBase: JSDELIVR_MAIN,
  rawProductionCdnBase: RAW_MAIN,
  noorCdnBranch: 'main',
  productionFallbackEnabled: true,
  localDeveloperOverrideStillAllowed: true,
  requiredFailures,
  checks,
  environmentVariables: {
    NEXT_PUBLIC_NOOR_DATA_MODE: 'cdn',
    NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE: JSDELIVR_MAIN,
    NEXT_PUBLIC_NOOR_QURAN_CDN_BASE: JSDELIVR_MAIN,
    NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE: JSDELIVR_MAIN,
    NEXT_PUBLIC_NOOR_HADITH_CDN_BASE: JSDELIVR_MAIN
  },
  notes: [
    'Sprint 27.16 changes the production build default from mock fallback to external CDN.',
    'Local development remains mock by default unless the developer explicitly switches source in Settings or sets env variables.',
    'Production CDN content remains noor-cdn/main, already promoted and verified in Sprints 27.14 and 27.15.'
  ]
};

const envExample = `# NOOR production CDN runtime environment\n# Sprint 27.16 — Production Mode Default / Environment Finalization\n# Use these values in Vercel Production Environment Variables.\n\nNEXT_PUBLIC_NOOR_DATA_MODE=cdn\nNEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${JSDELIVR_MAIN}\n`;

const localExample = `# NOOR local production-mode test environment\n# Copy this file to .env.local only when testing production CDN locally.\n# Normal development can stay on mock fallback or use the Settings source switcher.\n\nNEXT_PUBLIC_NOOR_DATA_MODE=cdn\nNEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${JSDELIVR_MAIN}\n`;

const vercelGuide = `# NOOR Sprint 27.16 — Vercel Production Environment\n\nUse these values in Vercel → Project → Settings → Environment Variables → Production.\n\n\`\`\`text\nNEXT_PUBLIC_NOOR_DATA_MODE=cdn\nNEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${JSDELIVR_MAIN}\n\`\`\`\n\nSafety rule: keep Preview and Development environments flexible. Production uses noor-cdn/main. Local development can remain mock fallback.\n\nFallback remains enabled in code so the app can still show bundled demo content if a CDN request fails.\n`;

const markdown = `# NOOR Sprint 27.16 — Production Mode Default / Environment Finalization\n\n## Status\n\n${status === 'production_runtime_default_finalized' ? '✅ Production runtime default finalized.' : '❌ Blocked.'}\n\n## Runtime default\n\n| Environment | Default source | Notes |\n|---|---|---|\n| Production build | External CDN | Uses noor-cdn/main by default. |\n| Local development | Mock fallback | Safe offline/dev mode unless switched manually. |\n| Manual source switch | Allowed | Settings source switch remains available. |\n\n## Canonical production CDN\n\n\`\`\`text\n${JSDELIVR_MAIN}\n\`\`\`\n\n## Required checks\n\n${checks.map((check) => `- ${check.passed ? '✅' : '❌'} ${check.id}: ${check.detail}`).join('\n')}\n\n## Required failures\n\n${requiredFailures.length === 0 ? 'None.' : requiredFailures.map((item) => `- ${item}`).join('\n')}\n\n## Production environment variables\n\n\`\`\`text\nNEXT_PUBLIC_NOOR_DATA_MODE=cdn\nNEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${JSDELIVR_MAIN}\nNEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${JSDELIVR_MAIN}\n\`\`\`\n\n## Safety\n\nProduction CDN is now the default for production builds only. Local development remains safe on mock fallback by default.\n`;

writeFileSync(path.join(OUT_DIR, 'noor-production-env-finalization.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(path.join(OUT_DIR, 'noor-production-env-finalization.md'), markdown);
writeFileSync(path.join(OUT_DIR, '.env.production.noor-cdn-main.example'), envExample);
writeFileSync(path.join(OUT_DIR, '.env.local.production-noor-cdn-main.example'), localExample);
writeFileSync(path.join(OUT_DIR, 'vercel-production-env.md'), vercelGuide);

console.log(`NOOR Sprint 27.16 production environment finalization generated. Status: ${status}.`);
console.log(`Report: ${path.join(OUT_DIR, 'noor-production-env-finalization.md')}`);
