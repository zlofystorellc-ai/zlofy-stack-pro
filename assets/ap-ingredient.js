/* ap-ingredient.js: the round close-up video on the home "one ingredient" section.
   Plays muted and loops only while on screen; a pause button is always there; no autoplay for reduced motion. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function init(root) {
  root.querySelectorAll('[data-ap-hi]').forEach((box) => {
    if (box.dataset.apBound) return;
    box.dataset.apBound = '1';
    const v = box.querySelector('[data-ap-hi-video]');
    const btn = box.querySelector('[data-ap-hi-pause]');
    if (!v || !btn) return;
    let userPaused = reduce;
    const sync = () => btn.setAttribute('aria-pressed', String(v.paused));
    const play = () => { if (!userPaused) v.play().then(sync).catch(sync); };
    btn.addEventListener('click', () => {
      if (v.paused) { userPaused = false; v.play().then(sync).catch(sync); } else { userPaused = true; v.pause(); sync(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { es[0].isIntersecting ? play() : v.pause(); sync(); }, { threshold: 0.35 }).observe(box);
    } else play();
    sync();
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
