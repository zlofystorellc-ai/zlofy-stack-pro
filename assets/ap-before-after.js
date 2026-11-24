/* ap-before-after.js: drag / tap / keyboard slider. The native range input does the work, so it is accessible.
   Extras: tap a label to snap, a one-time gentle nudge when it scrolls into view, a soft entrance.
   Everything extra is skipped for visitors who prefer reduced motion. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function init(root) {
  root.querySelectorAll('[data-ap-ba]').forEach((item) => {
    if (item.dataset.apBound) return;
    item.dataset.apBound = '1';
    const stage = item.querySelector('.apx-ba__stage');
    const range = item.querySelector('[data-ap-ba-range]');
    if (!stage || !range) return;
    let raf = 0;
    const paint = () => {
      const v = Number(range.value);
      stage.style.setProperty('--pos', `${v}%`);
      item.dataset.side = v >= 70 ? 'before' : v <= 30 ? 'after' : '';
      item.querySelectorAll('[data-ap-ba-snap]').forEach((b) => {
        b.setAttribute('aria-pressed', String((b.dataset.apBaSnap === '100' && v >= 70) || (b.dataset.apBaSnap === '0' && v <= 30)));
      });
    };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const to = (target, ms) => {
      stop();
      if (reduce) { range.value = target; paint(); return; }
      const from = Number(range.value);
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        range.value = from + (target - from) * ease(k);
        paint();
        raf = k < 1 ? requestAnimationFrame(step) : 0;
      };
      raf = requestAnimationFrame(step);
    };
    const touched = () => { stop(); item.classList.add('is-touched'); };
    range.addEventListener('input', () => { touched(); paint(); });
    range.addEventListener('pointerdown', touched);
    item.querySelectorAll('[data-ap-ba-snap]').forEach((b) => b.addEventListener('click', () => {
      item.classList.add('is-touched');
      to(Number(b.dataset.apBaSnap), 520);
    }));
    paint();

    // one gentle nudge when half of it is on screen, so people see it moves
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        setTimeout(() => {
          if (item.classList.contains('is-touched')) return;
          to(72, 700);
          setTimeout(() => { if (!item.classList.contains('is-touched')) to(28, 1000); }, 900);
          setTimeout(() => { if (!item.classList.contains('is-touched')) to(50, 700); }, 2100);
        }, 500);
      }, { threshold: 0.6 });
      io.observe(stage);
    }
  });

  // soft entrance for the whole section
  root.querySelectorAll('.apx-ba').forEach((sec) => {
    if (sec.dataset.apIn || reduce || !('IntersectionObserver' in window)) return;
    sec.dataset.apIn = '1';
    sec.classList.add('is-armed');
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) { sec.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(sec);
    setTimeout(() => sec.classList.add('is-in'), 5000);
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
