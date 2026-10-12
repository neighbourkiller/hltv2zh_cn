import { build } from 'esbuild';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const meta = JSON.parse(await readFile(new URL('../userscript.meta.json', import.meta.url), 'utf8'));
const lines = ['// ==UserScript=='];
for (const [key, value] of Object.entries({ ...meta, version: pkg.version })) {
  for (const item of Array.isArray(value) ? value : [value]) lines.push(`// @${key} ${item === true ? '' : item}`.trimEnd());
}
lines.push('// ==/UserScript==');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await build({ entryPoints: ['src/main.ts'], bundle: true, format: 'iife', target: ['chrome110', 'firefox115'],
  outfile: 'dist/hltv-zh-cn.user.js', banner: { js: lines.join('\n') }, legalComments: 'inline', charset: 'utf8' });
await writeFile(new URL('../dist/hltv-zh-cn.meta.js', import.meta.url), lines.join('\n') + '\n');
console.log(`已构建 HLTV 简体中文 ${pkg.version}`);
