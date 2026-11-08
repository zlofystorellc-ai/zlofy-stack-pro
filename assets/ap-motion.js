/* ap-motion.js: subtle scroll-reveal + tap-to-play for media. Everything is visible without JS and
   with prefers-reduced-motion. Only elements BELOW the fold get animated, so nothing flashes on load. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function reveal() {
  if (reduce || !('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('main .shopify-section');
  const targets = [];
  sections.forEach((sec) => {
    if (sec.querySelector('.apx-hero, .apx-sticky')) return;
    const groups = sec.querySelectorAll('[class*="__grid"], [class*="__steps"], [class*="__stats"], [class*="__chips"], [class*="__list"]:not([role="tablist"])');
    const grouped = new Set();
    groups.forEach((g) => {
      Array.from(g.children).forEach((c, i) => {
        c.style.setProperty('--ap-d', String(Math.min(i, 5)));
        targets.push(c);
        grouped.add(c);
      });
    });
    sec.querySelectorAll('.apx-wrap > *, .apx-center, .apx-vc__head, .apx-vc__row, .apx-fs__inner > *, .apx-guar__wrap > *').forEach((el) => {
      if (grouped.has(el) || el.matches('[class*="__grid"], [class*="__steps"], [class*="__stats"], [class*="__chips"]')) return;
      targets.push(el);
    });
  });
  const fresh = targets.filter((el) => el.getBoundingClientRect().top > innerHeight * 0.92);
  fresh.forEach((el) => el.setAttribute('data-ap-in', '0'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.setAttribute('data-ap-in', '1');
      io.unobserve(el);
      // Once settled, drop the reveal state so hover effects are not delayed.
      setTimeout(() => { el.removeAttribute('data-ap-in'); el.style.removeProperty('--ap-d'); }, 1500);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  fresh.forEach((el) => io.observe(el));
  // Safety net: never leave content hidden.
  setTimeout(() => fresh.forEach((el) => el.getAttribute('data-ap-in') === '0' && el.setAttribute('data-ap-in', '1')), 6000);
}

/* Tap-to-play for [data-ap-media] (a video with a play button). Muted, never autoplay. */
function media() {
  document.querySelectorAll('[data-ap-media]').forEach((box) => {
    if (box.dataset.apBound) return;
    box.dataset.apBound = '1';
    const v = box.querySelector('video');
    const b = box.querySelector('[data-ap-media-play]');
    if (!v || !b) return;
    b.addEventListener('click', () => {
      if (v.paused) {
        document.querySelectorAll('[data-ap-media] video').forEach((o) => o !== v && o.pause());
        v.play().then(() => b.setAttribute('aria-pressed', 'true')).catch(() => {});
      } else {
        v.pause();
        b.setAttribute('aria-pressed', 'false');
      }
    });
    v.addEventListener('pause', () => b.setAttribute('aria-pressed', 'false'));
    v.addEventListener('ended', () => b.setAttribute('aria-pressed', 'false'));
  });
}

reveal();
media();
document.addEventListener('shopify:section:load', media);
