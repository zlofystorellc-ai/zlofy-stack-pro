#!/usr/bin/env node
/**
 * claims-lint — blocks non-compliant copy and competitor names in the theme's customer-facing files.
 *
 * Scans: sections/, snippets/, templates/, locales/ (plus layout/ and config/ as an extra safety net).
 * Case-insensitive, whole-word matching. A term only matches when it is NOT glued to letters, digits,
 * "_" or "-", so code identifiers such as the section name "ap-hero" are not flagged, but visible
 * text such as "Hero" is.
 *
 * Exit code 0 = clean, 1 = violations (file:line printed).
 * Usage: node scripts/claims-lint.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['sections', 'snippets', 'templates', 'locales', 'layout', 'config'];
const EXT = new Set(['.liquid', '.json']);

// Drug-style / unsubstantiated claims (cosmetic copy only), plus competitor names and trade names.
const FORBIDDEN = [
  'treat', 'treats', 'treated', 'treating', 'treatment', 'treatments',
  'cure', 'cures', 'cured', 'curing',
  'heal', 'heals', 'healed', 'healing',
  'kills bacteria', 'prevents acne',
  'anti-inflammatory', 'medical grade', 'medical-grade',
  'FDA approved', 'FDA-approved', 'clinically proven', 'dermatologist approved', 'dermatologist-approved',
  'guaranteed results', 'instant results', 'removes scars',
  'Mighty Patch', 'Hero Cosmetics', 'Starface', 'Hydro-Star', 'Miracle Patch', 'The Original'
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rules = FORBIDDEN.map((term) => ({
  term,
  re: new RegExp(`(?<![\\w-])${esc(term).replace(/\\? /g, '\\s+')}(?![\\w-])`, 'i')
}));

function* walk(dir) {
  let entries = [];
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (EXT.has(name.slice(name.lastIndexOf('.')))) yield p;
  }
}

let hits = 0;
let files = 0;
for (const d of DIRS) {
  for (const file of walk(join(root, d))) {
    files += 1;
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const { term, re } of rules) {
        if (re.test(line)) {
          hits += 1;
          console.error(`${relative(root, file)}:${i + 1}  forbidden "${term}"  →  ${line.trim().slice(0, 140)}`);
        }
      }
    });
  }
}

if (hits) {
  console.error(`\nclaims-lint: ${hits} violation(s) in ${files} files.`);
  process.exit(1);
}
console.log(`claims-lint: clean (${files} files scanned, ${FORBIDDEN.length} forbidden terms).`);
