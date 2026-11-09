/* ap-product.js — product form: variant cards, purchase option (one-time / subscribe),
   price + price-per-patch, quantity, gallery sync, AJAX add to cart.
   Vanilla ES module. Reads server-rendered markup + a JSON blob; no globals except events.
   Any element with [data-ap-out="price|compare|ppp|variant|atc-label|delivery|save"] is kept in sync,
   which is how the sticky bar mirrors the main form without extra code. */

const root = document.querySelector('[data-ap-product]');
if (root) init(root);

function init(root) {
  const form = root.querySelector('[data-ap-form]');
  const variants = JSON.parse(root.querySelector('[data-ap-variants]').textContent);
  const L = root.dataset; // translated labels (data-label-*)
  const locale = L.locale || undefined;
  const cur = L.currency || 'USD';
  const money = (c) => new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(c / 100);
  // Labels arrive from Liquid with __key__ placeholders (Liquid cannot nest {{ }} inside {{ }}).
  const fmt = (s, map) => String(s || '').replace(/__(\w+)__/g, (_, k) => (map[k] != null ? map[k] : ''));
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const outs = (name) => $$(`[data-ap-out="${name}"]`, document);
  const setOut = (name, text, hide) => outs(name).forEach((n) => { n.textContent = text; n.hidden = !!hide; });

  const idInput = form.elements.id;
  const planInput = form.elements.selling_plan;
  const qtyInput = form.elements.quantity;
  const atc = $('[data-ap-atc]');
  const live = $('[data-ap-live]');
  const errBox = $('[data-ap-error]');
  const planSelect = $('[data-ap-plan]');
  const planBox = $('[data-ap-plan-box]');

  const selectedOptions = () =>
    $$('[data-ap-option-group]').map((g) => (g.querySelector('input:checked') || {}).value);
  const findVariant = () => {
    const sel = selectedOptions();
    return variants.find((v) => v.options.every((o, i) => o === sel[i]));
  };
  const purchaseMode = () => (($('input[name="ap_purchase"]:checked') || {}).value || 'once');

  function update(pushHistory) {
    const v = findVariant();
    // The allocation (subscription price) for the chosen plan, if this variant is covered by it
    const alloc = v ? v.allocations.find((a) => String(a.plan_id) === String(planSelect ? planSelect.value : '')) : null;
    const sub = purchaseMode() === 'sub' && !!v && !!alloc;
    let price = v ? v.price : 0;
    let compare = v ? v.compare_at_price : 0;
    let save = '';

    if (v) {
      idInput.value = v.id;
      if (alloc) {
        const pct = Math.round(((v.price - alloc.price) / v.price) * 100);
        if (pct > 0) save = fmt(L.labelSave, { percent: pct });
      }
      if (sub) {
        price = alloc.price;
        compare = v.price;
        planInput.value = alloc.plan_id;
      } else {
        // one-time, or this variant is not covered by the chosen plan: sell it one-time instead of failing at the cart
        planInput.value = '';
      }
      planInput.disabled = !planInput.value; // disabled inputs are left out of FormData
    }

    // price block + plan cards
    setOut('price', v ? money(price) : '');
    const showCompare = compare && compare > price;
    setOut('compare', showCompare ? money(compare) : '', !showCompare);
    setOut('once-price', v ? money(v.price) : '');
    setOut('sub-price', alloc ? money(alloc.price) : '', !alloc);
    setOut('save', save, !save);
    setOut('delivery', sub ? fmt(L.labelDelivery, { price: money(price) }) : '', !sub);
    // Subscription disclosure, directly under the plan picker
    const planEl = planSelect ? (planSelect.selectedOptions ? planSelect.selectedOptions[0] : planSelect) : null;
    const interval = planEl && planEl.dataset ? planEl.dataset.interval : '';
    setOut('renew', sub && L.labelRenews ? fmt(L.labelRenews, { interval: interval || '', price: money(price) }) : '', !sub);

    // price per patch (custom.patch_count on the variant, else on the product)
    const count = v && v.patch_count ? Number(v.patch_count) : 0;
    setOut('ppp', count ? fmt(L.labelPpp, { price: money(Math.round(price / count)) }) : '', !count);

    // variant label + availability
    setOut('variant', v ? v.title : '');
    const ok = !!(v && v.available);
    $$('[data-ap-atc], [data-ap-sticky-atc]', document).forEach((b) => {
      b.disabled = !ok;
    });
    setOut('atc-label', ok ? L.labelAdd : (v ? L.labelSold : L.labelUnavailable));

    // plan box only visible for subscribe + matching plans
    if (planBox) planBox.hidden = purchaseMode() !== 'sub';

    // gallery follows the variant's featured media
    if (v && v.media_id) goToMedia(v.media_id);

    if (pushHistory && v && history.replaceState) {
      const url = new URL(location.href);
      url.searchParams.set('variant', v.id);
      history.replaceState(null, '', url);
    }
  }

  /* Gallery: scroll-snap track (swipe) + thumbnails */
  const track = $('[data-ap-track]');
  function goToMedia(id) {
    if (!track) return;
    const slide = track.querySelector(`[data-media-id="${id}"]`);
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  $$('[data-ap-thumb]').forEach((b) => b.addEventListener('click', () => goToMedia(b.dataset.apThumb)));
  if (track && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$('[data-ap-thumb]').forEach((t) => {
          const on = t.dataset.apThumb === en.target.dataset.mediaId;
          if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
        });
      });
    }, { root: track, threshold: 0.6 });
    $$('[data-media-id]', track).forEach((s) => io.observe(s));
  }

  /* Quantity */
  $$('[data-ap-qty]').forEach((b) => b.addEventListener('click', () => {
    const next = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + Number(b.dataset.apQty));
    qtyInput.value = next;
  }));
  qtyInput.addEventListener('change', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) || 1); });

  form.addEventListener('change', (e) => {
    if (e.target.matches('[data-ap-option-group] input, input[name="ap_purchase"], [data-ap-plan]')) update(true);
  });

  /* Add to cart via the AJAX Cart API (handled in ap-cart.js) */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errBox.hidden = true; errBox.textContent = '';
    const v = findVariant();
    if (!v || !v.available) { showError(L.labelUnavailable); return; }
    const button = e.submitter || atc;
    const prev = button.querySelector('[data-ap-out="atc-label"]');
    if (prev) prev.textContent = L.labelAdding;
    live.textContent = L.labelAdding;
    document.dispatchEvent(new CustomEvent('ap:cart-add', {
      detail: {
        form, button,
        onDone: (r) => {
          update(false);
          if (!r.ok) showError(r.message);
        }
      }
    }));
  });
  // The sticky bar button submits the main form so there is one code path.
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-ap-sticky-atc]')) form.requestSubmit(atc);
  });

  function showError(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
    live.textContent = msg;
  }

  // ?variant=ID preselects an offer (works on the homepage and on /products/...)
  try {
    const wanted = new URLSearchParams(location.search).get('variant');
    const pick = wanted && variants.find((v) => String(v.id) === wanted);
    if (pick) {
      $$('[data-ap-option-group]').forEach((g, i) => {
        const inp = Array.from(g.querySelectorAll('input')).find((x) => x.value === pick.options[i]);
        if (inp && !inp.disabled) inp.checked = true;
      });
    }
  } catch (e) { /* ignore a malformed URL */ }

  update(false);
  initDelivery();
}

/* Delivery estimate as a DATE RANGE: today + processing + transit, counted in business days (Mon-Fri). */
function initDelivery() {
  document.querySelectorAll('[data-ap-delivery]').forEach((li) => {
    const out = li.querySelector('[data-ap-delivery-text]');
    const n = (k, d) => { const v = parseInt(li.dataset[k], 10); return Number.isFinite(v) ? v : d; };
    const pmin = n('pmin', 1);
    const pmax = Math.max(n('pmax', 3), pmin);
    const tmin = n('tmin', 6);
    const tmax = Math.max(n('tmax', 8), tmin);
    const add = (days) => {
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      let left = days;
      while (left > 0) {
        d.setDate(d.getDate() + 1);
        const w = d.getDay();
        if (w !== 0 && w !== 6) left -= 1;
      }
      return d;
    };
    const a = add(pmin + tmin);
    const b = add(pmax + tmax);
    const loc = document.documentElement.lang || undefined;
    const mon = new Intl.DateTimeFormat(loc, { month: 'short' });
    const day = new Intl.DateTimeFormat(loc, { day: 'numeric' });
    const range = a.getMonth() === b.getMonth()
      ? `${mon.format(a)} ${day.format(a)}\u2013${day.format(b)}`
      : `${mon.format(a)} ${day.format(a)} \u2013 ${mon.format(b)} ${day.format(b)}`;
    if (out && li.dataset.label) out.textContent = li.dataset.label.replace('__range__', range);
  });
}

/* Arrow buttons for horizontally scrolling rows (customer videos). Rows still swipe/scroll without them. */
function initScrollRow(wrap) {
  const row = wrap.querySelector('[data-ap-scroll-row]');
  const nav = wrap.querySelector('[data-ap-scroll-nav]');
  if (!row || !nav) return;
  const prev = nav.querySelector('[data-ap-scroll-prev]');
  const next = nav.querySelector('[data-ap-scroll-next]');
  const step = () => (row.firstElementChild ? row.firstElementChild.offsetWidth + 10 : 160) * 2;
  const sync = () => {
    nav.hidden = row.scrollWidth <= row.clientWidth + 2;
    prev.disabled = row.scrollLeft <= 2;
    next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
  };
  prev.addEventListener('click', () => row.scrollBy({ left: -step() }));
  next.addEventListener('click', () => row.scrollBy({ left: step() }));
  row.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
}
document.querySelectorAll('.apx-vids').forEach(initScrollRow);
document.addEventListener('shopify:section:load', (e) => {
  e.target.querySelectorAll?.('.apx-vids').forEach(initScrollRow);
});
