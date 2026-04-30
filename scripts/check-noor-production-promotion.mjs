import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.25.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function read(file) { return readFileSync(file, 'utf8'); }
function readJson(file) { return JSON.parse(read(file)); }

for (const file of [
  'scripts/promote-noor-production-cdn.mjs',
  'scripts/check-noor-production-promotion.mjs',
  'content-pipeline/production-cdn/noor-production-cdn-promotion.json',
  'content-pipeline/production-cdn/noor-production-cdn-promotion.md',
  'content-pipeline/production-cdn/.env.noor-production-cdn.example',
  'apps/web/components/ProductionCdnPromotionCard.tsx',
  'apps/web/lib/production-cdn-promotion.ts',
  'docs/NOOR_PRODUCTION_CDN_PROMOTION.md',
  'docs/SPRINT_25_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_25.md'
]) {
  if (!existsSync(file)) fail(`Missing Sprint 25 production CDN promotion file: ${file}`);
}

const promotion = readJson('content-pipeline/production-cdn/noor-production-cdn-promotion.json');
if (promotion.version !== EXPECTED_VERSION) fail(`Production promotion file must be ${EXPECTED_VERSION}.`);
if (promotion.promotionId !== 'noor-production-cdn-v1-promotion') fail('Unexpected production promotion id.');
if (promotion.status !== 'blocked') fail('Sprint 25 must keep production CDN promotion blocked until real approvals exist.');
if (promotion.productionPromotionAllowed !== false) fail('Sprint 25 must not allow production promotion automatically.');
if (promotion.runtimeDefault !== 'bundled') fail('Sprint 25 must keep runtime default bundled.');
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (promotion.gates?.[domain]?.approved !== false) fail(`Production ${domain} gate must remain unapproved.`);
}
if (!Array.isArray(promotion.blockedReasons) || promotion.blockedReasons.length < 1) fail('Blocked promotion must explain blocked reasons.');

const env = read('content-pipeline/production-cdn/.env.noor-production-cdn.example');
if (!env.includes('NEXT_PUBLIC_NOOR_CONTENT_SOURCE=bundled')) fail('Production env preview must keep bundled source.');
if (!env.includes('# NEXT_PUBLIC_NOOR_CONTENT_SOURCE=cdn')) fail('Production env preview must include commented CDN candidate.');

const pkg = readJson('package.json');
if (!pkg.scripts?.['production:promote']) fail('package.json missing production:promote script.');
if (!pkg.scripts?.['check:production-promotion']) fail('package.json missing check:production-promotion script.');

const settings = read('apps/web/app/settings/page.tsx');
if (!settings.includes('ProductionCdnPromotionCard')) fail('Settings must render ProductionCdnPromotionCard.');

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of ['pnpm production:promote', 'pnpm check:production-promotion']) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

console.log(`NOOR Sprint 25 production CDN promotion check passed for v${EXPECTED_VERSION}.`);
