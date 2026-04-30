import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PUBLISH_ROOT = process.argv[2] ?? 'content-pipeline/publish/noor-cdn-gh-pages';
const MANIFEST_FILE = join(PUBLISH_ROOT, 'publish-manifest.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

if (!existsSync(MANIFEST_FILE)) {
  fail(`NOOR CDN publish manifest missing: ${MANIFEST_FILE}. Run pnpm cdn:pack first.`);
}

const manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'));

for (const requiredPath of manifest.requiredResolverPaths ?? []) {
  const full = join(PUBLISH_ROOT, requiredPath);
  if (!existsSync(full)) {
    fail(`Required CDN resolver file missing: ${requiredPath}`);
  }
}

let checked = 0;
for (const entry of manifest.files ?? []) {
  const full = join(PUBLISH_ROOT, entry.path);
  if (!existsSync(full)) {
    fail(`Manifest file missing from publish pack: ${entry.path}`);
  }

  const stat = statSync(full);
  if (stat.size !== entry.bytes) {
    fail(`Byte size mismatch for ${entry.path}: expected ${entry.bytes}, got ${stat.size}`);
  }

  const hash = sha256(full);
  if (hash !== entry.sha256) {
    fail(`SHA-256 mismatch for ${entry.path}: expected ${entry.sha256}, got ${hash}`);
  }

  checked += 1;
}

if (checked === 0) {
  fail('Publish manifest does not contain any files.');
}

console.log(`NOOR CDN publish pack verification passed: ${checked} files checked.`);
console.log(`GitHub Pages base: ${manifest.hosting?.githubPagesBase ?? 'not set'}`);
console.log(`jsDelivr base: ${manifest.hosting?.jsDelivrBase ?? 'not set'}`);
