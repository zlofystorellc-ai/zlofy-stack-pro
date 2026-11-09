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
// Brief order: announcement (section group) > header > buy box > what is in the box > day vs night > how to use >
// match the patch > reviews > materials and not > FAQ > final CTA > footer.
// Sections not built yet (match the patch, materials and not, final CTA) are added in a later phase.
const landingOrder = [
  ['buybox', 'ap-landing-buybox'],
  ['box', 'ap-kit-contents'],
  ['daynight', 'ap-day-night'],
  ['how', 'ap-how-it-works'],
  ['reviews', 'ap-reviews'],
  ['faq', 'ap-faq'],
  ['sticky', 'ap-sticky-atc']
];
const landing = { sections: {}, order: [] };
for (const [key, type] of landingOrder) {
  landing.sections[key] = sectionFromPreset(type);
  landing.order.push(key);
}
const landingJson = JSON.stringify(landing, null, 2) + '\n';
writeFileSync(join(root, 'templates', 'index.json'), landingJson);
writeFileSync(join(root, 'templates', 'product.json'), landingJson);

function routeTemplate(target) {
  return JSON.stringify({
    sections: { route: { type: 'ap-route-home', settings: { target } } },
    order: ['route']
  }, null, 2) + '\n';
}
writeFileSync(join(root, 'templates', 'collection.json'), routeTemplate('/'));
writeFileSync(join(root, 'templates', 'list-collections.json'), routeTemplate('/'));
writeFileSync(join(root, 'templates', 'search.json'), routeTemplate('/'));
writeFileSync(join(root, 'templates', 'product.addon.json'), routeTemplate('/#offers'));
writeFileSync(join(root, 'templates', 'cart.json'), JSON.stringify({ sections: { cart: { type: 'ap-cart-page' } }, order: ['cart'] }, null, 2) + '\n');

const header = {
  name: 'Header',
  type: 'header',
  sections: { announcement: sectionFromPreset('ap-announcement') },
  order: ['announcement']
};
writeFileSync(join(root, 'sections', 'header-group.json'), JSON.stringify(header, null, 2) + '\n');

console.log(`Wrote index.json + product.json (${landing.order.length} sections), route templates, cart.json and sections/header-group.json`);
