import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function ensureScript(pkg, name, command) {
  if (pkg.scripts?.[name] === command) return false;
  pkg.scripts = pkg.scripts ?? {};
  pkg.scripts[name] = command;
  return true;
}

const packagePath = 'package.json';
if (!existsSync(packagePath)) {
  console.error('package.json not found. Run this from the NOOR repo root.');
  process.exit(1);
}

const pkg = readJson(packagePath);
const changes = [];

if (ensureScript(pkg, 'production:approval-gate', 'node scripts/run-production-cdn-approval-gate.mjs')) {
  changes.push('Added: pnpm production:approval-gate');
}
if (ensureScript(pkg, 'check:production-approval-gate', 'node scripts/check-production-cdn-approval-gate.mjs')) {
  changes.push('Added: pnpm check:production-approval-gate');
}
if (ensureScript(pkg, 'check:sprint27-13', 'pnpm check:sprint27-12 && pnpm check:production-approval-gate')) {
  changes.push('Added: pnpm check:sprint27-13');
}

writeJson(packagePath, pkg);

const settingsPath = 'apps/web/app/settings/page.tsx';
if (existsSync(settingsPath)) {
  let settings = readFileSync(settingsPath, 'utf8');
  if (!settings.includes('ProductionCdnApprovalGateCard')) {
    settings = settings.replace(
      "import { ProductionCdnPromotionCard } from '../../components/ProductionCdnPromotionCard';",
      "import { ProductionCdnPromotionCard } from '../../components/ProductionCdnPromotionCard';\nimport { ProductionCdnApprovalGateCard } from '../../components/ProductionCdnApprovalGateCard';"
    );
    settings = settings.replace(
      '      <ProductionCdnPromotionCard />',
      '      <ProductionCdnPromotionCard />\n      <ProductionCdnApprovalGateCard />'
    );
    writeFileSync(settingsPath, settings, 'utf8');
    changes.push('Patched Settings page with ProductionCdnApprovalGateCard');
  }
}

const packPath = 'scripts/check-noor-pack.mjs';
if (existsSync(packPath)) {
  let pack = readFileSync(packPath, 'utf8');
  if (!pack.includes("SPRINT_27_13_PRODUCTION_CDN_APPROVAL_GATE.md")) {
    pack = pack.replace(
      "  'apps/web/components/ProductionCdnPromotionCard.tsx',",
      "  'apps/web/components/ProductionCdnPromotionCard.tsx',\n  'apps/web/components/ProductionCdnApprovalGateCard.tsx',"
    );
    pack = pack.replace(
      "  'apps/web/lib/production-cdn-promotion.ts',",
      "  'apps/web/lib/production-cdn-promotion.ts',\n  'apps/web/lib/production-cdn-approval-gate.ts',"
    );
    pack = pack.replace(
      "  'scripts/check-noor-production-promotion.mjs',",
      "  'scripts/check-noor-production-promotion.mjs',\n  'scripts/run-production-cdn-approval-gate.mjs',\n  'scripts/check-production-cdn-approval-gate.mjs',"
    );
    pack = pack.replace(
      "  'content-pipeline/production-cdn/.env.noor-production-cdn.example',",
      "  'content-pipeline/production-cdn/.env.noor-production-cdn.example',\n  'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json',\n  'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md',"
    );
    pack = pack.replace(
      "  'docs/SPRINT_27_12_RELEASE_METADATA.md',",
      "  'docs/SPRINT_27_12_RELEASE_METADATA.md',\n  'docs/SPRINT_27_13_PRODUCTION_CDN_APPROVAL_GATE.md',"
    );
    pack = pack.replace(
      "  'check:sprint27-12'",
      "  'check:sprint27-12',\n  'production:approval-gate',\n  'check:production-approval-gate',\n  'check:sprint27-13'"
    );
    pack = pack.replace(
      "  'ProductionCdnPromotionCard',",
      "  'ProductionCdnPromotionCard',\n  'ProductionCdnApprovalGateCard',"
    );

    const approvalCheck = `
const productionApprovalGate = readJson('content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json');
if (productionApprovalGate.sprint !== '27.13') fail('Sprint 27.13 approval gate file must declare sprint 27.13.');
if (productionApprovalGate.approvalStatus !== 'approved_for_promotion') fail('Sprint 27.13 production approval gate must be approved before check:pack passes.');
if (productionApprovalGate.productionPromotionAllowed !== true) fail('Sprint 27.13 production promotion approval must allow the next promotion sprint.');
if (productionApprovalGate.promotionExecuted !== false || productionApprovalGate.noorCdnMainTouched !== false) {
  fail('Sprint 27.13 must approve promotion without touching noor-cdn/main.');
}
`;
    pack = pack.replace(
      "const stagingAcceptance = readJson('content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json');",
      approvalCheck + "\nconst stagingAcceptance = readJson('content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json');"
    );
    pack = pack.replace(
      "console.log('NOOR Sprint 0-27.12 pack check passed.');",
      "console.log('NOOR Sprint 0-27.13 pack check passed.');"
    );
    writeFileSync(packPath, pack, 'utf8');
    changes.push('Patched check-noor-pack.mjs for Sprint 27.13');
  }
}

if (changes.length === 0) {
  console.log('Sprint 27.13 package scripts/settings/checks already applied.');
} else {
  console.log('Sprint 27.13 package scripts/settings/checks applied.');
  for (const change of changes) console.log(change);
}
