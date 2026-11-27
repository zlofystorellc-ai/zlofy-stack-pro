/* ap-video-cards.js: filmstrip of video cards.
   - the card nearest the middle is "active": it grows and plays muted (only while the section is on screen)
   - tap a card to play or pause it; arrows, dots and the arrow keys move along
   - reduced motion: nothing starts by itself, tap to play. Posters work without JS. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

function init(sec) {
  if (sec.dataset.apBound) return;
  sec.dataset.apBound = '1';
  const row = sec.querySelector('[data-ap-vc-row]');
  if (!row) return;
  const cards = Array.from(row.querySelectorAll('.apx-vc__card'));
  const prev = sec.querySelector('[data-ap-vc-prev]');
  const next = sec.querySelector('[data-ap-vc-next]');
  const dotsBox = sec.querySelector('[data-ap-vc-dots]');
  const dots = cards.map(() => { const i = document.createElement('i'); dotsBox && dotsBox.appendChild(i); return i; });
  let active = -1, visible = false, paused = new Set(), ticking = false;

  const vid = (c) => c.querySelector('video');
  const setPlaying = (c, on) => {
    const v = vid(c); if (!v) return;
    const b = c.querySelector('[data-ap-vc-play]');
    if (on) v.play().then(() => { c.classList.add('is-playing'); b && b.setAttribute('aria-pressed', 'true'); }).catch(() => {});
    else { v.pause(); c.classList.remove('is-playing'); b && b.setAttribute('aria-pressed', 'false'); }
  };
  const nearest = () => {
    const mid = row.scrollLeft + row.clientWidth / 2;
    let best = 0, bd = Infinity;
    cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
    return best;
  };
  const update = () => {
    ticking = false;
    const i = nearest();
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
    if (i === active) return;
    active = i;
    cards.forEach((c, k) => { c.classList.toggle('is-active', k === i); if (k !== i) setPlaying(c, false); });
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    if (visible && !reduce && !paused.has(cards[i])) setPlaying(cards[i], true);
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  row.addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);

  const go = (i) => { const c = cards[Math.max(0, Math.min(cards.length - 1, i))]; row.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - row.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); };
  prev && prev.addEventListener('click', () => go(active - 1));
  next && next.addEventListener('click', () => go(active + 1));
  row.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); } });

  cards.forEach((c, i) => {
    const v = vid(c);
    const b = c.querySelector('[data-ap-vc-play]');
    const bar = c.querySelector('.apx-vc__bar b');
    if (v && b) {
      b.addEventListener('click', () => {
        if (i !== active) { go(i); }
        if (v.paused) { paused.delete(c); cards.forEach((o) => o !== c && setPlaying(o, false)); setPlaying(c, true); }
        else { paused.add(c); setPlaying(c, false); }
      });
      v.addEventListener('timeupdate', () => { if (bar && v.duration) bar.style.width = (v.currentTime / v.duration * 100).toFixed(1) + '%'; });
    }
    if (!reduce && fine) {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`);
        c.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2)}deg`);
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (!visible) cards.forEach((c) => setPlaying(c, false));
      else if (!reduce && active >= 0 && !paused.has(cards[active])) setPlaying(cards[active], true);
    }, { threshold: 0.35 }).observe(sec);
  }
  // start on the second card so cards show on both sides
  if (cards.length > 2) requestAnimationFrame(() => { const c = cards[1]; row.scrollLeft = c.offsetLeft + c.offsetWidth / 2 - row.clientWidth / 2; update(); });
  else update();
}
document.querySelectorAll('[data-ap-vc]').forEach(init);
document.addEventListener('shopify:section:load', (e) => { e.target.querySelectorAll?.('[data-ap-vc]').forEach(init); });
