import fs from 'node:fs';
import path from 'node:path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...(packageJson.scripts ?? {}),
  'check:quran-reader-ux-v2': 'node scripts/check-sprint28-2-quran-reader-ux-v2.mjs',
  'check:sprint28-2': 'pnpm check:sprint28-1 && pnpm check:quran-reader-ux-v2 && pnpm typecheck && pnpm build'
};

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log('Applied Sprint 28.2 package.json scripts:');
console.log('- check:quran-reader-ux-v2');
console.log('- check:sprint28-2');
