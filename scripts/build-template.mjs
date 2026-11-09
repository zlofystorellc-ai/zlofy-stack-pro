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

function sectionFromPreset(type, overrides = {}) {
  const schema = readSchema(type);
  const preset = (schema.presets && schema.presets[0]) || {};
  const out = { type };
  if (preset.settings || overrides.settings) out.settings = { ...(preset.settings || {}), ...(overrides.settings || {}) };
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
  // Removed as repeats of other sections (files stay in /sections if you want them back):
  // ap-marquee (repeats trust strip), ap-feature-cards (repeats hero bullets), ap-when-tabs (repeats the timeline and day vs night),
  // ap-size-guide (sizes are in the kit section), ap-shade-proof (customer photos: before/after + video cards),
  // ap-bundles (repeats the hero kit options), ap-faq (replaced by the FAQ-with-image band, which now carries the FAQ schema).
  ['trust', 'ap-trust-strip'],
  ['main', 'ap-hero'],
  ['problem', 'ap-problem'],
  ['daynight', 'ap-day-night'],
  ['how', 'ap-how-it-works'],
  ['ingredients', 'ap-ingredients'],
  ['beforeafter', 'ap-before-after'],
  ['kit', 'ap-kit-contents'],
  ['comparison', 'ap-comparison'],
  ['reviews', 'ap-reviews'],
  ['founder', 'ap-founder-note'],
  ['upsell', 'ap-upsell'],
  ['videos', 'ap-video-cards'],
  ['guarantee', 'ap-guarantee'],
  ['faqsplit', 'ap-faq-split'],
  ['sticky', 'ap-sticky-atc']
];

const product = { sections: {}, order: [] };
for (const [key, type] of productOrder) {
  product.sections[key] = sectionFromPreset(type);
  product.order.push(key);
}
writeFileSync(join(root, 'templates', 'product.acne-duo.json'), JSON.stringify(product, null, 2) + '\n');

// Home page (templates/index.json). Product-only sections are not used here.
const homeOrder = [
  ['banner', 'ap-home-banner'],
  ['products', 'ap-home-products'],
  ['problem', 'ap-problem', { settings: { button_link: '/collections/all' } }],
  ['split', 'ap-home-split'],
  ['how', 'ap-how-it-works'],
  ['beforeafter', 'ap-before-after'],
  ['videos', 'ap-video-cards'],
  ['founder', 'ap-founder-note'],
  ['guarantee', 'ap-guarantee'],
  ['faq', 'ap-faq-split'],
  ['newsletter', 'ap-newsletter']
];
const home = { sections: {}, order: [] };
for (const [key, type, overrides] of homeOrder) {
  home.sections[key] = sectionFromPreset(type, overrides || {});
  home.order.push(key);
}
writeFileSync(join(root, 'templates', 'index.json'), JSON.stringify(home, null, 2) + '\n');

const header = {
  name: 'Header',
  type: 'header',
  sections: { announcement: sectionFromPreset('ap-announcement') },
  order: ['announcement']
};
writeFileSync(join(root, 'sections', 'header-group.json'), JSON.stringify(header, null, 2) + '\n');

console.log(`Wrote templates/product.acne-duo.json (${product.order.length} sections), templates/index.json (${home.order.length} sections) and sections/header-group.json`);
