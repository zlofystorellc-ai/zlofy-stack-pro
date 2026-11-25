/* ap-pdp-extras.js: product page extras. (1) "+ Inspect" zoom on the photo, (2) question chips that swap the answer. */
function init(root) {
  root.querySelectorAll('[data-ap-gal]').forEach((g) => {
    if (g.dataset.apBound) return;
    g.dataset.apBound = '1';
    const btn = g.querySelector('[data-ap-zoom]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const on = !g.classList.contains('is-zoom');
      g.classList.toggle('is-zoom', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  });
  root.querySelectorAll('[data-ap-qa]').forEach((q) => {
    if (q.dataset.apBound) return;
    q.dataset.apBound = '1';
    const tabs = Array.from(q.querySelectorAll('[role="tab"]'));
    const show = (t) => tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      const p = q.querySelector('#' + x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t));
      t.addEventListener('keydown', (e) => {
        const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!k) return;
        e.preventDefault();
        const n = tabs[(i + k + tabs.length) % tabs.length];
        n.focus(); show(n);
      });
    });
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
