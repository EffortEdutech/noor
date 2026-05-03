import fs from 'node:fs';
import path from 'node:path';

const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'check:real-reading-ux': 'node scripts/check-sprint28-1-real-reading-ux.mjs',
  'check:sprint28-1': 'pnpm check:sprint27-16 && pnpm check:real-reading-ux && pnpm typecheck && pnpm build'
};

fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log('Applied Sprint 28.1 package.json scripts:');
console.log('- check:real-reading-ux');
console.log('- check:sprint28-1');
