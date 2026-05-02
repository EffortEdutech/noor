import { readFileSync, writeFileSync } from 'node:fs';

const file = 'scripts/check-noor-pack.mjs';

const requiredScripts = [
  'check:pack',
  'check:content',
  'check:release',
  'check:runtime',
  'check:review-console',
  'check:production-promotion',
  'check:roadmap',
  'review:console',
  'production:promote',
  'roadmap:status',
  'search:build-cdn-index',
  'cdn:pack',
  'cdn:verify',
  'check:sprint27-10',
  'check:sprint27-11',
  'check:sprint27-12',
  'production:approval-gate',
  'check:production-approval-gate',
  'check:sprint27-13',
  'production:cdn-promotion-plan',
  'check:production-cdn-promotion-plan',
  'production:cdn-record-promotion',
  'check:production-cdn-promoted',
  'check:sprint27-14'
];

let source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const replacement = `for (const script of [
${requiredScripts.map((script) => `  '${script}'`).join(',\n')}
]) {
  if (!pkg.scripts?.[script]) fail(\`package.json missing script: \${script}\`);
}

const appVersion`;

source = source.replace(
  /for \(const script of \[\n[\s\S]*?\n\}\n\nconst appVersion/,
  replacement
);

writeFileSync(file, source, 'utf8');

console.log('Repaired scripts/check-noor-pack.mjs Sprint 27.14 package script block.');
