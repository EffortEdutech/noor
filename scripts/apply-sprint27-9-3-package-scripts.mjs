import fs from 'node:fs';
import path from 'node:path';

const packagePath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'tafseer:index': 'node scripts/generate-noor-tafseer-index.mjs',
  'check:tafseer-index': 'node scripts/check-noor-tafseer-index.mjs',
  'check:sprint27-9-3': 'pnpm check:tafseer-index && pnpm typecheck && pnpm build'
};

fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
console.log('Sprint 27.9.3 package scripts added to package.json.');
