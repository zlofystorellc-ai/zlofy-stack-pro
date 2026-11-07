#!/usr/bin/env node
/**
 * Generates templates/product.acne-duo.json and sections/header-group.json from the `presets`
 * declared in each section's {% schema %}. This keeps ONE source of truth for default content
 * (JSON templates must list their blocks explicitly; presets are not applied to them).
 *
 * Usage: node scripts/build-template.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function readSchema(type) {
  const src = readFileSync(join(root, 'sections', `${type}.liquid`), 'utf8');
  const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if (!m) throw new Error(`No schema in ${type}`);
  return JSON.parse(m[1]);
}

function sectionFromPreset(type) {
  const schema = readSchema(type);
  const preset = (schema.presets && schema.presets[0]) || {};
  const out = { type };
  if (preset.settings) out.settings = preset.settings;
  const blocks = {};
  const order = [];
  (preset.blocks || []).forEach((b, i) => {
    const id = `${b.type.replace(/[^a-z0-9]/gi, '_')}_${i + 1}`;
    blocks[id] = { type: b.type };
    if (b.settings) blocks[id].settings = b.settings;
    order.push(id);
  });
  if (order.length) { out.blocks = blocks; out.block_order = order; }
  return out;
}

// Section order is editable in the theme editor; this is just the starting order.
const productOrder = [
  ['trust', 'ap-trust-strip'],
  ['main', 'ap-hero'],
  ['facts', 'ap-marquee'],
  ['stats', 'ap-stats-strip'],
  ['problem', 'ap-problem'],
  ['how', 'ap-how-it-works'],
  ['cards', 'ap-feature-cards'],
  ['ingredients', 'ap-ingredients'],
  ['daynight', 'ap-day-night'],
  ['when', 'ap-when-tabs'],
  ['size', 'ap-size-guide'],
  ['shade', 'ap-shade-proof'],
  ['comparison', 'ap-comparison'],
  ['bundles', 'ap-bundles'],
  ['reviews', 'ap-reviews'],
  ['faq', 'ap-faq'],
  ['founder', 'ap-founder-note'],
  ['guarantee', 'ap-guarantee'],
  ['upsell', 'ap-upsell'],
  ['sticky', 'ap-sticky-atc']
];

const product = { sections: {}, order: [] };
for (const [key, type] of productOrder) {
  product.sections[key] = sectionFromPreset(type);
  product.order.push(key);
}
writeFileSync(join(root, 'templates', 'product.acne-duo.json'), JSON.stringify(product, null, 2) + '\n');

const header = {
  name: 'Header',
  type: 'header',
  sections: { announcement: sectionFromPreset('ap-announcement') },
  order: ['announcement']
};
writeFileSync(join(root, 'sections', 'header-group.json'), JSON.stringify(header, null, 2) + '\n');

console.log(`Wrote templates/product.acne-duo.json (${product.order.length} sections) and sections/header-group.json`);
