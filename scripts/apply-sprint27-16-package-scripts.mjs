import { readFileSync, writeFileSync } from 'node:fs';

function read(file) {
  return readFileSync(file, 'utf8');
}

function write(file, content) {
  writeFileSync(file, content);
}

function addRequiredFiles(source, files) {
  const start = source.indexOf('const requiredFiles = [');
  if (start === -1) throw new Error('Unable to patch check-noor-pack.mjs. Missing requiredFiles array.');

  const marker = '\n];\n\nconst missing =';
  const end = source.indexOf(marker, start);
  if (end === -1) throw new Error('Unable to patch check-noor-pack.mjs. Missing requiredFiles end marker.');

  let body = source.slice(start, end);
  const additions = files.filter((file) => !body.includes(`'${file}'`));
  if (additions.length === 0) return source;

  const additionText = additions.map((file) => `,\n  '${file}'`).join('');
  return `${source.slice(0, end)}${additionText}${source.slice(end)}`;
}

function addPackageScriptChecks(source, scripts) {
  const start = source.indexOf('for (const script of [');
  if (start === -1) throw new Error('Unable to patch check-noor-pack.mjs. Missing package script check block.');

  const endMarker = '\n]) {';
  const end = source.indexOf(endMarker, start);
  if (end === -1) throw new Error('Unable to patch check-noor-pack.mjs. Missing package script check end marker.');

  let body = source.slice(start, end);
  const additions = scripts.filter((script) => !body.includes(`'${script}'`));
  if (additions.length === 0) return source;

  const additionText = additions.map((script) => `,\n  '${script}'`).join('');
  return `${source.slice(0, end)}${additionText}${source.slice(end)}`;
}

function addBeforeConsole(source, marker, block) {
  if (source.includes(marker)) return source;

  const consoleIndex = source.lastIndexOf("console.log('NOOR Sprint");
  if (consoleIndex === -1) throw new Error('Unable to patch check-noor-pack.mjs. Missing final console log.');

  return `${source.slice(0, consoleIndex)}${block}\n${source.slice(consoleIndex)}`;
}

const packageJsonPath = 'package.json';
const pkg = JSON.parse(read(packageJsonPath));
pkg.scripts = pkg.scripts ?? {};

const scriptsToAdd = {
  'production:env-finalization': 'node scripts/generate-noor-production-env-finalization.mjs',
  'check:production-env-finalization': 'node scripts/check-noor-production-env-finalization.mjs',
  'check:sprint27-16': 'pnpm check:sprint27-15 && pnpm production:env-finalization && pnpm check:production-env-finalization && pnpm check:pack'
};

const added = [];
for (const [name, command] of Object.entries(scriptsToAdd)) {
  if (!pkg.scripts[name]) {
    pkg.scripts[name] = command;
    added.push(name);
  }
}

write(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);

const checkPackPath = 'scripts/check-noor-pack.mjs';
let checkPack = read(checkPackPath).replace(/\r\n/g, '\n');

checkPack = addRequiredFiles(checkPack, [
  'docs/SPRINT_27_15_PRODUCTION_CDN_RUNTIME_QA.md',
  'docs/SPRINT_27_16_PRODUCTION_MODE_DEFAULT.md',
  'scripts/generate-noor-production-env-finalization.mjs',
  'scripts/check-noor-production-env-finalization.mjs',
  'scripts/apply-sprint27-16-package-scripts.mjs',
  'content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json',
  'content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.md',
  'content-pipeline/production-cdn/environment-finalization/.env.production.noor-cdn-main.example',
  'content-pipeline/production-cdn/environment-finalization/.env.local.production-noor-cdn-main.example',
  'content-pipeline/production-cdn/environment-finalization/vercel-production-env.md'
]);

checkPack = addPackageScriptChecks(checkPack, [
  'production:env-finalization',
  'check:production-env-finalization',
  'check:sprint27-16'
]);

const validationMarker = 'Sprint 27.16 production environment finalization';
const validationBlock = `
const productionEnvFinalization = readJson('content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json');
if (productionEnvFinalization.sprint !== '27.16') fail('Sprint 27.16 production environment finalization file must declare sprint 27.16.');
if (productionEnvFinalization.status !== 'production_runtime_default_finalized') fail('Sprint 27.16 production environment finalization must be finalized.');
if (productionEnvFinalization.productionRuntimeDefault !== 'cdn') fail('Sprint 27.16 production runtime default must be cdn.');
if (productionEnvFinalization.developmentRuntimeDefault !== 'mock') fail('Sprint 27.16 development runtime default must remain mock.');
if (productionEnvFinalization.requiredFailures?.length > 0) fail('Sprint 27.16 production environment finalization must have no required failures.');

const noorDataConfigSource = read('packages/noor-data/src/config.ts');
for (const expected of [
  "const PRODUCTION_NOOR_DATA_MODE: NoorDataMode = 'cdn'",
  "const DEVELOPMENT_NOOR_DATA_MODE: NoorDataMode = 'mock'",
  'function getDefaultNoorDataMode()',
  'process.env?.NODE_ENV',
  "sourceOverride ?? env('NEXT_PUBLIC_NOOR_DATA_MODE', getDefaultNoorDataMode())",
  'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn'
]) {
  if (!noorDataConfigSource.includes(expected)) fail(\`Sprint 27.16 production mode default missing: \${expected}\`);
}

`;
checkPack = addBeforeConsole(checkPack, validationMarker, validationBlock);
checkPack = checkPack.replace(/NOOR Sprint 0-27\.\d+ pack check passed\./g, 'NOOR Sprint 0-27.16 pack check passed.');

write(checkPackPath, checkPack);

console.log('Sprint 27.16 package scripts and pack checks applied.');
for (const name of added) console.log(`Added: pnpm ${name}`);
if (added.length === 0) console.log('No package scripts were missing.');
