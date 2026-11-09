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
