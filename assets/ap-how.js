/* ap-how.js: "How it works" timeline. Fills the connecting line as the steps scroll past
   and highlights the step nearest the middle of the screen. Pure enhancement: without JS
   (or with reduced motion) the steps simply show in a static list. */
document.querySelectorAll('[data-ap-how]').forEach((sec) => {
  const list = sec.querySelector('[data-ap-how-steps]');
  if (!list || !sec.classList.contains('apx-how--media')) return;
  const steps = Array.from(list.children);
  if (!steps.length) return;
  let ticking = false;

  const update = () => {
    ticking = false;
    const mid = innerHeight * 0.5;
    const box = list.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (mid - box.top) / Math.max(box.height, 1)));
    list.style.setProperty('--ap-how-p', p.toFixed(3));
    let active = -1;
    let best = Infinity;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < best) { best = d; active = i; }
    });
    const inView = box.top < innerHeight && box.bottom > 0;
    steps.forEach((s, i) => {
      s.classList.toggle('is-active', inView && i === active);
      s.classList.toggle('is-done', inView && i < active);
    });
  };
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
});
