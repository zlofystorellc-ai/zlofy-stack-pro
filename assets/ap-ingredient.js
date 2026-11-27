/* ap-ingredient.js: home "one ingredient" section.
   - round close-up video: plays muted only while on screen, pause button, no autoplay for reduced motion
   - facts take turns being highlighted (hover, tap or focus holds one); the ring around the video changes colour
   - soft entrance, background glows drift on scroll, the video leans toward the mouse on laptops */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

function initVideo(box) {
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
  if (!reduce && fine) {
    box.addEventListener('pointermove', (e) => {
      const r = box.getBoundingClientRect();
      box.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`);
      box.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2)}deg`);
    });
    box.addEventListener('pointerleave', () => { box.style.setProperty('--rx', '0deg'); box.style.setProperty('--ry', '0deg'); });
  }
}

function initFacts(sec) {
  const facts = Array.from(sec.querySelectorAll('[data-ap-hi-fact]'));
  if (!facts.length) return;
  const scope = sec.querySelector('.apx-hi__visual') || sec;
  const MS = 3200;
  let cur = -1, timer = 0, held = false, visible = false;
  sec.style.setProperty('--hi-t', `${MS}ms`);
  const show = (i) => {
    cur = i;
    facts.forEach((f, k) => { f.classList.toggle('is-active', k === i); f.classList.toggle('is-held', held && k === i); });
    scope.dataset.fact = String(i);
  };
  const next = () => { clearTimeout(timer); if (held || reduce || !visible) return; timer = setTimeout(() => { show((cur + 1) % facts.length); next(); }, MS); };
  facts.forEach((f, i) => {
    const hold = () => { held = true; clearTimeout(timer); show(i); };
    const release = () => { held = false; show(cur); next(); };
    f.addEventListener('pointerenter', hold); f.addEventListener('pointerleave', release);
    f.addEventListener('focus', hold); f.addEventListener('blur', release);
    f.addEventListener('click', hold);
  });
  show(0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) next(); else clearTimeout(timer); }, { threshold: 0.3 }).observe(sec);
  }
}

function init(root) {
  root.querySelectorAll('[data-ap-hi]').forEach((box) => { if (box.dataset.apBound) return; box.dataset.apBound = '1'; initVideo(box); });
  root.querySelectorAll('[data-ap-hi-root]').forEach((sec) => {
    if (sec.dataset.apBound) return;
    sec.dataset.apBound = '1';
    initFacts(sec);
    if (reduce || !('IntersectionObserver' in window)) return;
    sec.classList.add('is-armed');
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { sec.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(sec);
    setTimeout(() => sec.classList.add('is-in'), 5000);
    let tick = false;
    const sp = () => {
      tick = false;
      const r = sec.getBoundingClientRect();
      sec.style.setProperty('--sp', Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height))).toFixed(3));
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(sp); } }, { passive: true });
    sp();
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
