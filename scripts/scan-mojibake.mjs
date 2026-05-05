// scripts/scan-mojibake.mjs
// Scans source/document files for likely mojibake/broken encoding artifacts.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const includeExtensions = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.scss', '.md', '.mdx', '.json', '.txt'
]);

const ignoreDirs = new Set([
  '.git', '.next', 'node_modules', 'dist', 'build', '.turbo', 'coverage', '.vercel'
]);

const suspiciousPatterns = [
  { label: 'replacement character', regex: /\uFFFD/g },
  { label: 'latin-1 utf8 artifact A-circumflex', regex: /Â/g },
  { label: 'latin-1 utf8 artifact A-tilde', regex: /Ã/g },
  { label: 'smart punctuation artifact a-circumflex', regex: /â/g },
  { label: 'arabic mojibake cluster', regex: /[ØÙ][\s\S]{0,8}[ØÙ]/g },
  { label: 'common mojibake quote', regex: /â€™|â€œ|â€�|â€˜/g },
  { label: 'common mojibake dash or ellipsis', regex: /â€“|â€”|â€¦/g },
  { label: 'common mojibake bullet or middot', regex: /Â·|â€¢/g }
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (includeExtensions.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const findings = [];
for (const file of walk(root)) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const { label, regex } of suspiciousPatterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
      const line = lineNumberForIndex(text, match.index);
      const lines = text.split(/\r?\n/);
      const preview = (lines[line - 1] ?? '').trim();
      findings.push({
        file: path.relative(root, file).replaceAll(path.sep, '/'),
        line,
        label,
        match: match[0],
        preview
      });

      if (regex.lastIndex === match.index) regex.lastIndex++;
    }
  }
}

console.log('\nBismillah — mojibake scan\n');

if (findings.length === 0) {
  console.log('Alhamdulillah — no obvious mojibake artifacts found.\n');
  process.exit(0);
}

for (const item of findings) {
  console.log(`${item.file}:${item.line} [${item.label}] ${JSON.stringify(item.match)}`);
  console.log(`  ${item.preview}`);
}

console.log(`\nFound ${findings.length} suspicious encoding artifact(s). Review before commit.\n`);
process.exit(2);
