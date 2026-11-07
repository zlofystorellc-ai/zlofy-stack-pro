/* ap-cart.js — cart drawer, free-shipping bar, one upsell, quick add.
   Vanilla ES module, no dependencies. Loaded with type="module" (deferred) by sections/ap-hero.liquid.
   Public API (events on document):
     - "ap:cart-add"   { detail: { form: HTMLFormElement } } -> add via /cart/add.js, then open the drawer
     - "ap:cart-open" / "ap:cart-close"
   All text is rendered with textContent (never innerHTML) to avoid injection. */

const drawer = document.querySelector('[data-ap-drawer]');
const i18n = (() => {
  try { return JSON.parse(document.getElementById('ap-i18n').textContent); } catch (e) { return {}; }
})();
// Strings arrive from Liquid with __key__ placeholders (Liquid cannot nest {{ }} inside {{ }}).
const fmt = (s, map) => String(s || '').replace(/__(\w+)__/g, (_, k) => (map && map[k] != null ? map[k] : ''));

const cfg = drawer ? drawer.dataset : {};
const money = (cents) =>
  new Intl.NumberFormat(cfg.locale || undefined, { style: 'currency', currency: cfg.currency || 'USD' }).format(cents / 100);

const $ = (sel, root = drawer) => root.querySelector(sel);
let lastFocus = null;
let cartState = null;

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v === false || v == null) return;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v === true ? '' : v);
  });
  kids.flat().forEach((c) => c && n.append(c));
  return n;
}

function announce(msg) {
  if (!drawer) return;
  const live = $('[data-ap-live]');
  live.textContent = '';
  // re-set on next tick so screen readers re-announce identical text
  setTimeout(() => { live.textContent = msg; }, 30);
}

async function getCart() {
  const res = await fetch(`${cfg.cartUrl || '/cart'}.js`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('cart');
  return res.json();
}

function setCount(count) {
  document.querySelectorAll('[data-ap-cart-count]').forEach((n) => { n.textContent = count; });
  document.querySelectorAll('[data-ap-cart-toggle]').forEach((a) => {
    const label = fmt(count === 1 ? i18n.item_count_one : i18n.item_count_other, { num: count });
    if (label) a.setAttribute('aria-label', label);
  });
}

function renderBar(cart) {
  const bar = $('[data-ap-bar]');
  const threshold = parseInt(cfg.threshold, 10) || 0;
  if (!threshold || !cart.item_count) { bar.hidden = true; return; }
  const remaining = Math.max(threshold - cart.total_price, 0);
  bar.hidden = false;
  $('[data-ap-bar-text]').textContent = remaining
    ? fmt(i18n.bar_away, { amount: money(remaining) })
    : i18n.bar_reached;
  $('[data-ap-bar-fill]').style.width = `${Math.min(100, Math.round((cart.total_price / threshold) * 100))}%`;
}

function renderLines(cart) {
  const list = $('[data-ap-lines]');
  list.textContent = '';
  cart.items.forEach((item) => {
    const img = item.image
      ? el('img', { src: item.image.replace(/(\.\w+)(\?|$)/, '_144x144$1$2'), alt: item.featured_image && item.featured_image.alt ? item.featured_image.alt : '', width: 72, height: 72, loading: 'lazy' })
      : el('span');
    const input = el('input', { type: 'number', min: 0, value: item.quantity, 'aria-label': fmt(i18n.quantity, { title: item.product_title }), inputmode: 'numeric' });
    const dec = el('button', { type: 'button', 'aria-label': i18n.decrease }, '−');
    const inc = el('button', { type: 'button', 'aria-label': i18n.increase }, '+');
    const change = (q) => updateLine(item.key, q);
    dec.addEventListener('click', () => change(item.quantity - 1));
    inc.addEventListener('click', () => change(item.quantity + 1));
    input.addEventListener('change', () => change(Math.max(0, parseInt(input.value, 10) || 0)));
    const rm = el('button', { type: 'button', class: 'apx-drawer__remove', 'aria-label': fmt(i18n.remove_item, { title: item.product_title }), text: i18n.remove });
    rm.addEventListener('click', () => change(0));
    const meta = [item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '', item.selling_plan_allocation ? item.selling_plan_allocation.selling_plan.name : ''].filter(Boolean).join(' · ');
    list.append(el('li', { class: 'apx-drawer__line' },
      img,
      el('div', null,
        el('p', { class: 'apx-drawer__title', text: item.product_title }),
        meta ? el('p', { class: 'apx-drawer__meta', text: meta }) : null,
        el('div', { class: 'apx-qty' }, dec, input, inc),
        el('div', null, rm)),
      el('div', { class: 'apx-drawer__price', text: money(item.final_line_price) })));
  });
}

async function renderUpsell(cart) {
  const slot = $('[data-ap-upsell]');
  slot.hidden = true; slot.textContent = '';
  if (!cart.items.length) return;
  const inCart = new Set(cart.items.map((i) => i.product_id));
  let product = null;
  try {
    const recs = await fetch(`${cfg.recsUrl}.json?product_id=${cart.items[0].product_id}&limit=4&intent=complementary`);
    if (recs.ok) product = ((await recs.json()).products || []).find((p) => !inCart.has(p.id) && p.available);
    if (!product && cfg.fallbackCollection) {
      const res = await fetch(`${cfg.rootUrl}collections/${cfg.fallbackCollection}/products.json?limit=8`);
      if (res.ok) product = ((await res.json()).products || []).find((p) => !inCart.has(p.id) && p.variants.some((v) => v.available));
    }
  } catch (e) { /* upsell is optional */ }
  if (!product) return;
  const variant = product.variants.find((v) => v.available) || product.variants[0];
  const price = typeof variant.price === 'string' ? Math.round(parseFloat(variant.price) * 100) : variant.price;
  const media = product.featured_image || (product.images && product.images[0] && product.images[0].src);
  const action = product.variants.length === 1
    ? el('button', { type: 'button', class: 'apx-btn apx-btn--sm', text: i18n.add })
    : el('a', { class: 'apx-btn apx-btn--ghost apx-btn--sm', href: `${cfg.rootUrl}products/${product.handle}`, text: i18n.choose_options });
  if (product.variants.length === 1) action.addEventListener('click', () => addToCart({ id: variant.id, quantity: 1 }, action));
  slot.append(
    el('h3', { text: i18n.upsell_title }),
    el('div', { class: 'apx-mini' },
      media ? el('img', { src: typeof media === 'string' ? media : media.src, alt: '', width: 56, height: 56, loading: 'lazy' }) : el('span'),
      el('div', null, el('p', { class: 'apx-mini__t', text: product.title }), el('p', { class: 'apx-mini__p', text: money(price) })),
      action));
  slot.hidden = false;
}

function render(cart) {
  cartState = cart;
  setCount(cart.item_count);
  if (!drawer) return;
  const empty = !cart.item_count;
  $('[data-ap-empty]').hidden = !empty;
  $('[data-ap-foot]').hidden = empty;
  $('[data-ap-lines]').hidden = empty;
  $('[data-ap-subtotal]').textContent = money(cart.total_price);
  renderBar(cart);
  renderLines(cart);
  renderUpsell(cart);
}

async function refresh() { render(await getCart()); }

function open(trigger) {
  if (!drawer) return;
  lastFocus = trigger || document.activeElement;
  drawer.hidden = false;
  document.body.classList.add('apx-lock');
  $('.apx-drawer__panel').focus();
  document.dispatchEvent(new CustomEvent('ap:cart-open'));
}

function close() {
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  document.body.classList.remove('apx-lock');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
  document.dispatchEvent(new CustomEvent('ap:cart-close'));
}

async function updateLine(key, quantity) {
  try {
    const res = await fetch(`${cfg.changeUrl}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity })
    });
    if (!res.ok) throw new Error('change');
    render(await res.json());
    announce(quantity === 0 ? i18n.removed : i18n.cart_updated);
  } catch (e) { announce(i18n.error); }
}

/* Add to cart. `payload` is a FormData or plain object; returns true on success. */
export async function addToCart(payload, button) {
  const isForm = payload instanceof FormData;
  if (isForm) {
    // drop UI-only radios/selects (option_*, ap_*) so only cart fields are sent
    [...payload.keys()].forEach((k) => { if (/^(option_|ap_)/.test(k)) payload.delete(k); });
  }
  if (button) { button.setAttribute('aria-busy', 'true'); button.setAttribute('aria-disabled', 'true'); }
  try {
    const res = await fetch(`${cfg.addUrl || '/cart/add'}.js`, {
      method: 'POST',
      headers: isForm ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: isForm ? payload : JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.description || data.message || i18n.error);
    await refresh();
    open(button);
    announce(i18n.added);
    return { ok: true };
  } catch (e) {
    announce(e.message || i18n.error);
    return { ok: false, message: e.message || i18n.error };
  } finally {
    if (button) { button.removeAttribute('aria-busy'); button.removeAttribute('aria-disabled'); }
  }
}
window.apCart = { addToCart, open, close, refresh };

/* Wiring */
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('[data-ap-cart-toggle]');
  if (toggle && drawer) { e.preventDefault(); refresh().catch(() => {}); open(toggle); }
  if (e.target.closest('[data-ap-drawer-close]')) close();
});
document.addEventListener('keydown', (e) => {
  if (!drawer || drawer.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'Tab') {
    const f = [...drawer.querySelectorAll('a[href],button:not([disabled]),input,[tabindex="0"]')].filter((n) => !n.closest('[hidden]'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
document.addEventListener('submit', (e) => {
  const form = e.target.closest('[data-ap-quick-add]');
  if (!form) return;
  e.preventDefault();
  addToCart(new FormData(form), form.querySelector('button[type="submit"]'));
});
document.addEventListener('ap:cart-add', (e) => {
  const { form, button, onDone } = e.detail;
  addToCart(new FormData(form), button).then((r) => onDone && onDone(r));
});

if (drawer) refresh().catch(() => {});
