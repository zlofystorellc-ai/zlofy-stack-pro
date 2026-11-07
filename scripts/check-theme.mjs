#!/usr/bin/env node
/**
 * Static checks that need no Shopify store:
 *   1. every .json file parses
 *   2. every section's {% schema %} parses, preset block types exist, setting ids are unique
 *   3. Liquid block tags are balanced (if/unless/for/case/capture/form/paginate/tablerow)
 *   4. every 't' key used in Liquid exists in locales/en.default.json
 *   5. every asset referenced via asset_url exists
 *   6. CSS/JS size budgets (raw + gzip): CSS < 30 KB, JS < 25 KB
 *
 * Usage: node scripts/check-theme.mjs   (exit 1 on any error)
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const errors = [];
const err = (file, msg) => errors.push(`${relative(root, file)}: ${msg}`);

function* walk(dir) {
  let names = [];
  try { names = readdirSync(dir); } catch { return; }
  for (const n of names) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) yield* walk(p); else yield p;
  }
}
const files = THEME_DIRS.flatMap((d) => [...walk(join(root, d))]);
const read = (f) => readFileSync(f, 'utf8');

// 1. JSON
for (const f of files.filter((x) => x.endsWith('.json'))) {
  try { JSON.parse(read(f)); } catch (e) { err(f, `invalid JSON (${e.message})`); }
}

// 2. Schemas
const liquid = files.filter((x) => x.endsWith('.liquid'));
for (const f of liquid.filter((x) => x.includes('/sections/'))) {
  const m = read(f).match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if (!m) { err(f, 'missing {% schema %}'); continue; }
  let s;
  try { s = JSON.parse(m[1]); } catch (e) { err(f, `schema is invalid JSON (${e.message})`); continue; }
  const ids = new Set();
  for (const set of s.settings || []) {
    if (set.id) { if (ids.has(set.id)) err(f, `duplicate setting id "${set.id}"`); ids.add(set.id); }
  }
  const types = new Set((s.blocks || []).map((b) => b.type));
  for (const p of s.presets || []) {
    for (const b of p.blocks || []) if (!types.has(b.type)) err(f, `preset uses unknown block type "${b.type}"`);
  }
  for (const b of s.blocks || []) {
    const bids = new Set();
    for (const set of b.settings || []) {
      if (set.id) { if (bids.has(set.id)) err(f, `block "${b.type}" duplicate setting id "${set.id}"`); bids.add(set.id); }
    }
  }
}

// 3. Tag balance
const OPEN = new Set(['if', 'unless', 'for', 'case', 'capture', 'form', 'paginate', 'tablerow']);
for (const f of liquid) {
  let src = read(f)
    .replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '')
    .replace(/{%-?\s*schema\s*-?%}[\s\S]*?{%-?\s*endschema\s*-?%}/g, '')
    .replace(/{%-?\s*stylesheet\s*-?%}[\s\S]*?{%-?\s*endstylesheet\s*-?%}/g, '')
    .replace(/{%-?\s*javascript\s*-?%}[\s\S]*?{%-?\s*endjavascript\s*-?%}/g, '');
  const stack = [];
  const tagRe = /{%-?\s*([\s\S]*?)\s*-?%}/g;
  let t;
  const handle = (word, where) => {
    if (OPEN.has(word)) stack.push(word);
    else if (word.startsWith('end') && OPEN.has(word.slice(3))) {
      const top = stack.pop();
      if (top !== word.slice(3)) err(f, `unbalanced "${word}" near ${where} (expected end${top || '?'})`);
    }
  };
  while ((t = tagRe.exec(src))) {
    const body = t[1].trim();
    const word = body.split(/\s+/)[0];
    if (word === 'liquid') {
      body.split('\n').slice(1).forEach((line) => { const w = line.trim().split(/\s+/)[0]; if (w) handle(w, 'liquid tag'); });
    } else handle(word, `"${body.slice(0, 40)}"`);
  }
  if (stack.length) err(f, `unclosed tag(s): ${stack.join(', ')}`);
}

// 4. Locale keys
const locale = JSON.parse(read(join(root, 'locales', 'en.default.json')));
const hasKey = (key) => key.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), locale) !== undefined;
for (const f of liquid) {
  for (const m of read(f).matchAll(/'((?:ap)\.[\w.]+)'\s*\|\s*t\b/g)) {
    if (!hasKey(m[1])) err(f, `missing locale key "${m[1]}"`);
  }
}

// 5. Assets referenced
for (const f of liquid) {
  for (const m of read(f).matchAll(/'([\w.-]+\.(?:js|css))'\s*\|\s*asset_url/g)) {
    if (!existsSync(join(root, 'assets', m[1]))) err(f, `missing asset "${m[1]}"`);
  }
}

// 6. Budgets
let css = read(join(root, 'assets', 'ap-base.css'));
for (const f of liquid) {
  for (const m of read(f).matchAll(/{%-?\s*stylesheet\s*-?%}([\s\S]*?){%-?\s*endstylesheet\s*-?%}/g)) css += m[1];
}
const jsFiles = files.filter((x) => x.endsWith('.js'));
const js = jsFiles.map(read).join('\n');
const kb = (n) => (n / 1024).toFixed(1);
const minCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1');
const minJs = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.replace(/^\s*\/\/.*$/, '').trim()).filter(Boolean).join('\n');
const gz = (s) => gzipSync(s).length;
console.log('Size budget (all ap-* CSS / JS if every section is on the page):');
console.log(`  CSS  raw ${kb(css.length)} KB | whitespace-stripped ${kb(minCss(css).length)} KB | gzip ${kb(gz(css))} KB   (budget < 30 KB)`);
console.log(`  JS   raw ${kb(js.length)} KB | comments/blank-stripped ${kb(minJs(js).length)} KB | gzip ${kb(gz(js))} KB   (budget < 25 KB)`);
if (gz(css) >= 30 * 1024) errors.push('CSS gzip over 30 KB budget');
if (gz(js) >= 25 * 1024) errors.push('JS gzip over 25 KB budget');

if (errors.length) {
  console.error(`\ncheck-theme: ${errors.length} problem(s)\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`check-theme: OK (${files.length} files, ${liquid.length} Liquid files)`);
