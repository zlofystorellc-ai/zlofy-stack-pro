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
  (overrides.blocks || preset.blocks || []).forEach((b, i) => {
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

// "How it works" page (templates/page.how-it-works.json): create a page in Shopify admin and pick this template.
const howPage = {
  sections: {},
  order: []
};
const howSections = [
  ['banner', 'ap-page-banner', { settings: { eyebrow: 'How it works', heading: 'Two patches. One kit. Simple to use.', text: 'Drug-free hydrocolloid patches that cover a surfaced spot and help absorb fluid: a thin one for the day and a cushioned one for the night.', button_label: 'Shop now', note: '' } }],
  ['system', 'ap-system-parts', { settings: { eyebrow: 'The system', heading: 'Two patches. One kit.', text: 'Both are the same soft hydrocolloid layer with a breathable film on top. What changes is how thin or how cushioned they are, so you can pick the right one for the moment.' } }],
  ['watch', 'ap-how-it-works', { settings: { eyebrow: 'Watch it work', heading: 'Press, wait, peel.' }, blocks: [
    { type: 'step', settings: { title: 'Cleanse and dry', text: 'Wash your face gently and pat dry. Patches stick best to clean, dry skin.' } },
    { type: 'step', settings: { title: 'Press on', text: 'Place the patch over the spot and press from the center out so the edges seal.' } },
    { type: 'step', settings: { title: 'Wear, then peel', text: 'Leave it on for 6 to 8 hours, or until it turns white. Peel from an edge, toss it, and add a fresh one if the spot is still there.' } }
  ] }],
  ['built', 'ap-stats-strip', { settings: { eyebrow: 'Made for real days', heading: 'What you can expect', note: '' }, blocks: [
    { type: 'stat', settings: { value: '6–8h', label: 'typical wear time' } },
    { type: 'stat', settings: { value: '2', label: 'patch types: day and night' } },
    { type: 'stat', settings: { value: '3', label: 'sizes for different spots' } }
  ] }],
  ['spots', 'ap-feature-cards', { settings: { eyebrow: 'Spot by spot', heading: 'Different spots, one simple routine', text: 'Pick the size for the spot and the patch for the moment.' }, blocks: [
    { type: 'card', settings: { icon: 'shield', title: 'A single spot', text: 'A small patch that sits right over one surfaced spot.' } },
    { type: 'card', settings: { icon: 'layers', title: 'A few spots', text: 'Use several small patches side by side, each covering its own spot.' } },
    { type: 'card', settings: { icon: 'check', title: 'Back, shoulders, chest', text: 'The larger body strip covers more area. Press it flat and keep it dry.' } },
    { type: 'card', settings: { icon: 'clock', title: 'On the go', text: 'Keep a few in a bag and swap one when it has turned white or the edges lift.' } }
  ] }],
  ['sizes', 'ap-size-guide'],
  ['compare', 'ap-comparison'],
  ['faq', 'ap-faq'],
  ['newsletter', 'ap-newsletter']
];
for (const [key, type, overrides] of howSections) {
  howPage.sections[key] = sectionFromPreset(type, overrides || {});
  howPage.order.push(key);
}
writeFileSync(join(root, 'templates', 'page.how-it-works.json'), JSON.stringify(howPage, null, 2) + '\n');

const header = {
  name: 'Header',
  type: 'header',
  sections: { announcement: sectionFromPreset('ap-announcement') },
  order: ['announcement']
};
writeFileSync(join(root, 'sections', 'header-group.json'), JSON.stringify(header, null, 2) + '\n');

console.log(`Wrote templates/product.acne-duo.json (${product.order.length} sections), templates/index.json (${home.order.length} sections) and sections/header-group.json`);
