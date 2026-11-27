/* ap-locator.js: store locator. Filter chips, text search (zip, city, state, name), a map of the lower 48 states with pins.
   The places come only from the section's Place blocks. Projection: Albers equal-area conic, same as scripts/gen-us-outline.mjs. */
const P = {"lon0":-1.6755160819145563,"W":1000,"H":637,"x0":-0.369030366887895,"y1":0.24496061308335837,"k":1329.0184020000966,"n":0.6028370046288244,"C":1.351221325417899,"rho0":1.3032624269880215};
const rad = Math.PI / 180, NS = 'http://www.w3.org/2000/svg';
const proj = (lon, lat) => {
  const rho = Math.sqrt(P.C - 2 * P.n * Math.sin(lat * rad)) / P.n, th = P.n * (lon * rad - P.lon0);
  const x = rho * Math.sin(th), y = P.rho0 - rho * Math.cos(th);
  return [20 + (x - P.x0) * P.k, 20 + (P.y1 - y) * P.k];
};
function init(root) {
  root.querySelectorAll('[data-ap-loc]').forEach((sec) => {
    if (sec.dataset.apBound) return;
    sec.dataset.apBound = '1';
    const items = Array.from(sec.querySelectorAll('.apx-loc__item'));
    if (!items.length) return;
    const pinsG = sec.querySelector('[data-ap-loc-pins]');
    const count = sec.querySelector('[data-ap-loc-count]');
    const none = sec.querySelector('[data-ap-loc-none]');
    const q = sec.querySelector('[data-ap-loc-q]');
    const chips = Array.from(sec.querySelectorAll('[data-ap-loc-chips] button'));
    let kind = 'all';
    const pins = new Map();
    items.forEach((li) => {
      const lat = parseFloat(li.dataset.lat), lon = parseFloat(li.dataset.lon);
      if (isNaN(lat) || isNaN(lon) || lat < 24 || lat > 50 || lon < -125 || lon > -66) return;
      const [x, y] = proj(lon, lat);
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'apx-loc__pin'); g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '11'); g.appendChild(c);
      g.addEventListener('click', () => select(li, true));
      pinsG.appendChild(g); pins.set(li, g);
    });
    function select(li, scroll) {
      items.forEach((x) => { x.classList.toggle('is-on', x === li); const p = pins.get(x); if (p) p.classList.toggle('is-on', x === li); });
      if (scroll) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    function apply() {
      const term = (q.value || '').trim().toLowerCase();
      let shown = 0;
      items.forEach((li) => {
        const ok = (kind === 'all' || li.dataset.kind === kind) && (!term || li.dataset.text.toLowerCase().includes(term));
        li.hidden = !ok;
        const p = pins.get(li); if (p) p.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      count.textContent = shown + (shown === 1 ? ' place' : ' places');
      none.hidden = shown !== 0;
    }
    items.forEach((li) => li.querySelector('[data-ap-loc-card]').addEventListener('click', () => select(li, false)));
    chips.forEach((b) => b.addEventListener('click', () => { kind = b.dataset.kind; chips.forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); }); apply(); }));
    sec.querySelector('[data-ap-loc-form]').addEventListener('submit', (e) => { e.preventDefault(); apply(); });
    q.addEventListener('input', apply);
    apply();
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
