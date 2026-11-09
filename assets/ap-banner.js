/* ap-banner.js — home banner video: muted loop with a pause/play button (WCAG 2.2.2).
   Stays paused for visitors who prefer reduced motion, and pauses while the banner is off-screen to save battery and data. */
document.querySelectorAll('[data-ap-banner]').forEach((box) => {
  const video = box.querySelector('video');
  const btn = box.querySelector('[data-ap-banner-pause]');
  if (!video || !btn) return;
  const iconPause = btn.querySelector('[data-pause]');
  const iconPlay = btn.querySelector('[data-play]');
  let userPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const paint = () => {
    const paused = video.paused;
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? btn.dataset.labelPlay : btn.dataset.labelPause);
    iconPause.hidden = paused;
    iconPlay.hidden = !paused;
  };
  const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };

  if (userPaused) video.pause();
  btn.addEventListener('click', () => {
    userPaused = !video.paused;
    if (video.paused) play(); else video.pause();
  });
  video.addEventListener('play', paint);
  video.addEventListener('pause', paint);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (!userPaused) play(); } else if (!video.paused) video.pause();
    }, { threshold: 0.15 }).observe(box);
  }
  paint();
});

/* Pointer parallax for the banner visual: the video, badges and ring drift a little as the mouse moves.
   Mouse only (not touch), and never for visitors who prefer reduced motion. */
if (matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('[data-ap-hh]').forEach((sec) => {
    const set = (x, y) => { sec.style.setProperty('--px', x.toFixed(3)); sec.style.setProperty('--py', y.toFixed(3)); };
    sec.addEventListener('pointermove', (e) => {
      const r = sec.getBoundingClientRect();
      set((e.clientX - r.left) / r.width * 2 - 1, (e.clientY - r.top) / r.height * 2 - 1);
    });
    sec.addEventListener('pointerleave', () => set(0, 0));
  });
}

/* Scroll effects for the banner: as you scroll down, the video slowly zooms, the text and picture drift apart,
   and the little background patches float up at different speeds. Skipped for visitors who prefer reduced motion. */
if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('[data-ap-hh]').forEach((sec) => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(r.height, 1)));
      sec.style.setProperty('--hh-p', p.toFixed(3));
    };
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    update();
  });
}
