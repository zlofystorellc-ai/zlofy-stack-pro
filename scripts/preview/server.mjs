#!/usr/bin/env node
/**
 * Local preview of the theme WITHOUT a Shopify store.
 *
 *   cd scripts/preview && npm install && npm start      (or: npm run preview from the repo root)
 *   open http://localhost:8766            add ?design=1 to see the theme-editor-only notes
 *
 * It renders layout/theme.liquid + sections/*.liquid with liquidjs and the fake data in mock.mjs,
 * and answers /cart.js, /cart/add.js, /cart/change.js and /recommendations/products.json with an
 * in-memory cart so the drawer, quantity, sticky bar and variant logic can be exercised.
 *
 * IT IS AN APPROXIMATION. Shopify's real renderer differs in details (filters, image handling,
 * metafields, selling plans). Always do a final check on a development theme.
 * Liquid files are re-read on every request, so edit and reload.
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';
import { product, variants, others, bundleProducts, bundleCompare, linklists } from './mock.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const PORT = Number(process.env.PORT || 8766);

const read = (p) => readFileSync(join(root, p), 'utf8');
const locale = JSON.parse(read('locales/en.default.json'));
const settingsSchema = JSON.parse(read('config/settings_schema.json'));

/* ---------- theme settings (defaults from the schema) ---------- */
const settings = {};
for (const group of settingsSchema) for (const s of group.settings || []) if (s.id) settings[s.id] = s.default !== undefined ? s.default : null;
settings.upsell_collection = null;

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const named = (args) => {
  const out = {};
  for (const a of args) if (Array.isArray(a) && a.length === 2 && typeof a[0] === 'string') out[a[0]] = a[1];
  return out;
};
const money = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

function translate(key, args) {
  const params = named(args);
  let node = key.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), locale);
  if (node === undefined) return `[missing ${key}]`;
  if (typeof node === 'object') node = Number(params.count) === 1 ? node.one : node.other;
  return String(node).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => (params[k] != null ? params[k] : ''));
}

function schemaOf(src) {
  const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  return m ? JSON.parse(m[1]) : {};
}
function defaultsOf(list = []) {
  const o = {};
  for (const s of list) if (s.id) o[s.id] = s.default !== undefined ? s.default : (s.type === 'checkbox' ? false : null);
  return o;
}

/* Turn Shopify-only tags into plain output the stock liquidjs understands */
function preprocess(src) {
  return src
    .replace(/{%-?\s*schema\s*-?%}[\s\S]*?{%-?\s*endschema\s*-?%}/g, '')
    .replace(/{%-?\s*stylesheet\s*-?%}/g, '<style>')
    .replace(/{%-?\s*endstylesheet\s*-?%}/g, '</style>')
    .replace(/{%-?\s*form\s+'localization'[\s\S]*?-?%}/g, '<form method="post" action="/localization">')
    .replace(/{%-?\s*form\s+'customer'[\s\S]*?-?%}/g, '<form method="post" action="#" id="ap-newsletter-form" class="apx-nl__form">')
    .replace(/{%-?\s*form\s+'product'[\s\S]*?-?%}/g, '<form method="post" action="/cart/add" id="{{ form_id }}" novalidate="novalidate" data-ap-form="true">')
    .replace(/{%-?\s*endform\s*-?%}/g, '</form>')
    .replace(/{%-?\s*sections\s+'header-group'\s*-?%}/g, '{{ header_group }}');
}

function makeEngine(globals) {
  // Snippets (partials) also go through preprocess, so wrap the default file system.
  const baseFs = { ...new Liquid().options.fs };
  const fs = {
    ...baseFs,
    readFileSync: (p) => preprocess(baseFs.readFileSync(p)),
    readFile: async (p) => preprocess(await baseFs.readFile(p))
  };
  const engine = new Liquid({
    root: [join(root, 'sections')],
    partials: [join(root, 'snippets')],
    extname: '.liquid',
    strictVariables: false,
    strictFilters: false,
    globals,
    fs
  });

  engine.registerFilter('t', (key, ...args) => translate(String(key), args));
  engine.registerFilter('money', (v) => money(v));
  engine.registerFilter('money_with_currency', (v) => `${money(v)} USD`);
  engine.registerFilter('asset_url', (f) => `/assets/${f}`);
  engine.registerFilter('handleize', (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  engine.registerFilter('image_url', (obj, ...args) => {
    if (!obj) return '';
    const p = named(args);
    return `/preview-img/${obj.key || obj.id || 'x'}.svg?w=${p.width || 1200}`;
  });
  engine.registerFilter('image_tag', (url, ...args) => {
    if (!url) return '';
    const p = named(args);
    const w = Number(p.width) || Number((String(url).match(/w=(\d+)/) || [])[1]) || 800;
    const h = Number(p.height) || w;
    let srcset = '';
    if (p.widths) srcset = ` srcset="${String(p.widths).split(',').map((x) => `${String(url).replace(/w=\d+/, `w=${x.trim()}`)} ${x.trim()}w`).join(', ')}"`;
    return `<img src="${esc(url)}"${srcset}${p.sizes ? ` sizes="${esc(p.sizes)}"` : ''} alt="${esc(p.alt || '')}" width="${w}" height="${h}"${p.loading ? ` loading="${p.loading}"` : ''}${p.fetchpriority ? ` fetchpriority="${p.fetchpriority}"` : ''}${p.class ? ` class="${esc(p.class)}"` : ''}>`;
  });
  // Preview only: a poster-only <video> (the mock has no real video files).
  engine.registerFilter('video_tag', (obj, ...args) => {
    if (!obj) return '';
    const p = named(args);
    const poster = p.poster && p.poster.key ? p.poster : obj.preview_image;
    const src = poster ? `/preview-img/${poster.key || poster.id || 'x'}.svg?w=1200` : '';
    return `<video controls muted playsinline preload="none"${src ? ` poster="${esc(src)}"` : ''}${p.class ? ` class="${esc(p.class)}"` : ''}></video>`;
  });
  engine.registerFilter('external_video_tag', () => '');
  engine.registerFilter('placeholder_svg_tag', (_name, cls) => `<svg class="${esc(cls || '')}" viewBox="0 0 525 525" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder"><rect width="525" height="525" fill="#FBEBED"/><rect x="170" y="170" width="185" height="185" rx="60" fill="#C8B6E2" stroke="#1F2A44" stroke-width="6"/></svg>`);
  engine.registerFilter('payment_type_svg_tag', (type, ...args) => {
    const p = named(args);
    const label = String(type).replace(/_/g, ' ').toUpperCase().slice(0, 8);
    return `<svg class="${esc(p.class || '')}" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}"><rect x=".5" y=".5" width="37" height="23" rx="4" fill="#fff" stroke="#44506B"/><text x="19" y="14.5" font-size="6" font-family="sans-serif" text-anchor="middle" fill="#1F2A44">${esc(label)}</text></svg>`;
  });
  return engine;
}

/* ---------- sections ---------- */
async function renderSection(engine, scopeBase, id, type, overrides = {}) {
  const src = read(`sections/${type}.liquid`);
  const schema = schemaOf(src);
  const blockDefs = Object.fromEntries((schema.blocks || []).map((b) => [b.type, b]));
  const section = {
    id,
    settings: { ...defaultsOf(schema.settings), ...(overrides.settings || {}) },
    blocks: (overrides.block_order || []).map((bid) => {
      const b = overrides.blocks[bid];
      return { id: bid, type: b.type, settings: { ...defaultsOf((blockDefs[b.type] || {}).settings), ...(b.settings || {}) }, shopify_attributes: '' };
    })
  };
  if (type === 'ap-announcement') {
    // Preview only: a fake countdown (5 days from now) so the layout can be seen. Real stores enter a real end date.
    section.settings.countdown_end = new Date(Date.now() + 5 * 864e5).toISOString();
  }
  if (type === 'ap-problem') {
    section.blocks.forEach((b, i) => { b.settings.image = { key: `v${[101, 102, 103, 104][i % 4]}`, alt: 'Mock photo' }; });
  }
  if (type === 'ap-home-products') {
    const pool = [product, ...others];
    section.blocks.forEach((b, i) => {
      const p = pool[i % pool.length];
      p.price = p.price || (p.variants && p.variants[0] ? p.variants[0].price : 0);
      p.url = p.url || '/products/' + (p.handle || 'day-night-duo');
      b.settings.product = p;
      b.settings.badge = i === 0 ? 'Most popular' : '';
    });
  }
  if (type === 'ap-when-tabs') {
    section.blocks.forEach((b, i) => {
      b.settings.video = null;
      b.settings.poster = { key: `v${[101, 102, 103][i % 3]}`, alt: 'Mock photo' };
    });
  }
  if (type === 'ap-before-after') {
    section.blocks.forEach((b, i) => {
      b.settings.before = { key: `v${[101, 103, 104][i % 3]}`, alt: 'Mock before photo' };
      b.settings.after = { key: `v${[102, 104, 101][i % 3]}`, alt: 'Mock after photo' };
      b.settings.name = ['Customer A', 'Customer B', 'Customer C'][i % 3];
      b.settings.caption = 'Mock caption';
    });
  }
  if (type === 'ap-how-it-works') {
    section.settings.video = { sources: [], preview_image: { key: 'v102' } };
    section.settings.poster = null;
  }
  if (type === 'ap-hero') {
    // Preview only: fake customer videos (no video files, poster only) so the row's layout can be seen
    section.blocks.push({ id: 'gal_img_1', type: 'gallery_image', shopify_attributes: '', settings: { image: { key: 'v103', alt: 'Mock extra photo' } } });
    section.blocks.push({ id: 'gal_vid_1', type: 'gallery_video', shopify_attributes: '', settings: { video: { sources: [], preview_image: { key: 'v102' } }, poster: null } });
    [101, 102, 103, 104, 101, 102].forEach((mid, i) => {
      section.blocks.push({
        id: `video_${i + 1}`, type: 'video', shopify_attributes: '',
        settings: { video: { sources: [], preview_image: { key: `v${mid}` } }, poster: null, caption: `Mock video ${i + 1}`, captions_vtt: '' }
      });
    });
  }
  if (type === 'ap-bundles') {
    section.blocks.forEach((b, i) => {
      b.settings.product = bundleProducts[i] || null;
      (bundleCompare[i] || []).forEach((p, j) => { b.settings[`compare_${j + 1}`] = p; });
    });
  }
  const html = await engine.parseAndRender(preprocess(src), { ...scopeBase, section, form_id: undefined });
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}

async function renderGroup(engine, scopeBase, file) {
  const json = JSON.parse(read(file));
  let out = '';
  for (const key of json.order) out += await renderSection(engine, scopeBase, key, json.sections[key].type, json.sections[key]);
  return out;
}

async function renderPage(query, pageName = 'product') {
  const design = query.get('design') === '1';
  const cart = cartObject();
  const globals = {
    settings,
    shop: { name: 'Local preview', url: 'http://localhost:' + PORT, enabled_payment_types: ['visa', 'master', 'american_express', 'apple_pay', 'shop_pay'] },
    cart,
    request: { locale: { iso_code: 'en' }, design_mode: design },
    routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', product_recommendations_url: '/recommendations/products' },
    linklists,
    template: { name: pageName === 'home' ? 'index' : 'product' },
    canonical_url: 'http://localhost:' + PORT + (pageName === 'home' ? '/' : '/products/day-night-duo'),
    page_title: pageName === 'home' ? 'Home' : product.title,
    page_description: pageName === 'home' ? 'Local preview of the home page (mock data).' : 'Local preview of the product page (mock data).',
    current_page: 1,
    collection: null,
    product,
    recommendations: { performed: false, products: others }
  };
  const engine = makeEngine(globals);
  const requested = Number(query.get('variant'));
  const picked = variants.find((v) => v.id === requested);
  product.selected_or_first_available_variant = picked || variants[0];
  product.options_with_values[0].selected_value = product.selected_or_first_available_variant.title;

  const header_group = await renderGroup(engine, globals, 'sections/header-group.json');
  const tpl = JSON.parse(read(pageName === 'home' ? 'templates/index.json' : 'templates/product.acne-duo.json'));
  let content = '';
  for (const key of tpl.order) content += await renderSection(engine, globals, key, tpl.sections[key].type, tpl.sections[key]);

  const layout = preprocess(read('layout/theme.liquid'));
  let html = await engine.parseAndRender(layout, { ...globals, header_group, content_for_layout: content, content_for_header: '' });
  // The layout outputs {{ content_for_layout }} as plain text; liquidjs already substituted it.
  html = html.replace('</body>', `<div style="position:fixed;left:8px;bottom:8px;z-index:5;padding:3px 9px;border-radius:999px;background:#1F2A44;color:#fff;font:600 11px system-ui;opacity:.85">Local preview · mock data</div></body>`);
  return html;
}

/* ---------- mock cart ---------- */
const cart = new Map();
const catalog = new Map();
for (const p of [product, ...others, ...bundleProducts, ...bundleCompare.flat()]) {
  for (const v of p.variants) catalog.set(Number(v.id), { v, title: p.title, mediaId: (p.featured_image || {}).key || (p.featured_image || {}).id });
}
function cartObject() {
  const items = [...cart.values()];
  return {
    item_count: items.reduce((n, i) => n + i.quantity, 0),
    total_price: items.reduce((n, i) => n + i.final_line_price, 0),
    currency: { iso_code: 'USD' },
    items
  };
}
function addToCart({ id, quantity = 1, selling_plan }) {
  const entry = catalog.get(Number(id));
  if (!entry) return { status: 404, body: { status: 404, message: 'Cannot find variant', description: 'Preview: unknown variant' } };
  const key = `${id}:${selling_plan || ''}`;
  const alloc = selling_plan ? entry.v.selling_plan_allocations.find((a) => String(a.selling_plan.id) === String(selling_plan)) : null;
  const unit = alloc ? alloc.price : entry.v.price;
  const line = cart.get(key) || {
    key, id: Number(id), product_id: 1, product_title: entry.title, variant_title: entry.v.title,
    image: `/preview-img/${entry.mediaId}.svg?w=600`, featured_image: { alt: entry.title },
    quantity: 0, final_line_price: 0,
    selling_plan_allocation: alloc ? { selling_plan: { name: 'Deliver every 4 weeks' } } : null, unit
  };
  line.quantity += Number(quantity) || 1;
  line.final_line_price = line.unit * line.quantity;
  cart.set(key, line);
  return { status: 200, body: line };
}

/* ---------- placeholder images (mock photos) ---------- */
const PALETTE = [['#FBEBED', '#C8B6E2'], ['#FCDDE2', '#E5707F'], ['#ECE7F5', '#1F2A44'], ['#FDF1F2', '#F4A261'], ['#EEF2F8', '#44506B']];
function mockImage(key) {
  let n = 0; for (const c of String(key)) n = (n * 31 + c.charCodeAt(0)) % 997;
  const [bg, fg] = PALETTE[n % PALETTE.length];
  const pebbles = [[150, 170, 130], [300, 230, 100], [210, 330, 80]].map(([x, y, s], i) =>
    `<rect x="${x + (n % 40) * (i ? 1 : -1)}" y="${y}" width="${s}" height="${s}" rx="${s * 0.34}" fill="${fg}" opacity="${0.9 - i * 0.18}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 525 525"><rect width="525" height="525" fill="${bg}"/>${pebbles}<text x="262" y="492" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#44506B">MOCK PHOTO · ${esc(key)}</text></svg>`;
}

/* ---------- http ---------- */
const MIME = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const json = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
const readBody = (req) => new Promise((r) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => r(Buffer.concat(c))); });

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith('/assets/')) {
      const file = normalize(join(root, 'assets', url.pathname.slice(8)));
      if (file.startsWith(join(root, 'assets')) && existsSync(file) && statSync(file).isFile()) {
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        return res.end(readFileSync(file));
      }
      res.writeHead(404); return res.end('not found');
    }
    if (url.pathname.startsWith('/preview-img/')) {
      const key = url.pathname.slice(13).replace(/\.svg$/, '').replace(/_\d+x\d+$/, '');
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'max-age=60' });
      return res.end(mockImage(key));
    }
    if (url.pathname === '/cart.js') return json(res, 200, cartObject());
    if (url.pathname === '/cart/add.js' && req.method === 'POST') {
      const buf = await readBody(req);
      const type = req.headers['content-type'] || '';
      let data = {};
      if (type.includes('application/json')) data = JSON.parse(buf.toString() || '{}');
      else { const fd = await new Response(buf, { headers: { 'content-type': type } }).formData(); fd.forEach((v, k) => { data[k] = v; }); }
      const r = addToCart(data);
      return json(res, r.status, r.body);
    }
    if (url.pathname === '/cart/change.js' && req.method === 'POST') {
      const { id, quantity } = JSON.parse((await readBody(req)).toString() || '{}');
      const line = cart.get(id);
      if (line) { if (quantity <= 0) cart.delete(id); else { line.quantity = quantity; line.final_line_price = line.unit * quantity; } }
      return json(res, 200, cartObject());
    }
    if (url.pathname === '/recommendations/products.json') {
      return json(res, 200, { products: others.map((p) => ({ id: p.id, title: p.title, handle: p.handle, available: true, featured_image: `/preview-img/${p.featured_image.key}.svg?w=300`, variants: [{ id: p.variants[0].id, price: (p.price / 100).toFixed(2), available: true }] })) });
    }
    if (url.pathname.startsWith('/recommendations/')) { res.writeHead(404); return res.end(); }
    if (url.pathname === '/home' || url.pathname === '/products/' || url.pathname === '/' || url.pathname.startsWith('/products/')) {
      const html = await renderPage(url.searchParams, url.pathname === '/home' ? 'home' : 'product');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(html);
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<p>Preview only renders the product page. <a href="/">Go to the product</a>.</p>');
  } catch (e) {
    console.error(e);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Preview render error:\n\n${e.stack || e}`);
  }
}).listen(PORT, () => console.log(`Local preview: http://localhost:${PORT}  (mock data, not Shopify's renderer)`));
