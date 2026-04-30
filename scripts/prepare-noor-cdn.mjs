import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const SOURCE_ROOT = process.argv[2] ?? 'content-pipeline/source/noor-demo-v0.12';
const DIST_ROOT = 'content-pipeline/dist/noor-cdn';
const PUBLIC_ROOT = 'apps/web/public/noor-cdn';

function runValidator() {
  const result = spawnSync(
    process.execPath,
    ['scripts/validate-noor-cdn.mjs', SOURCE_ROOT],
    {
      stdio: 'inherit',
      shell: false
    }
  );

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function copyClean(source, target) {
  if (!existsSync(source)) {
    console.error(`NOOR CDN prepare failed: missing source folder: ${source}`);
    process.exit(1);
  }

  rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

function countJsonFiles(dir) {
  let count = 0;

  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      count += countJsonFiles(full);
    }

    if (stat.isFile() && name.endsWith('.json')) {
      count += 1;
    }
  }

  return count;
}

runValidator();

copyClean(SOURCE_ROOT, DIST_ROOT);
copyClean(SOURCE_ROOT, PUBLIC_ROOT);

console.log(`NOOR CDN pack prepared at ${DIST_ROOT} and ${PUBLIC_ROOT}.`);
console.log(`Generated ${countJsonFiles(PUBLIC_ROOT)} JSON files.`);