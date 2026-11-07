/* ap-announcement.js — rotates announcement messages.
   - Never rotates when the visitor prefers reduced motion.
   - Pause / play button (WCAG 2.2.2). Rotation also pauses on hover and focus.
   - Only one message is exposed to assistive tech at a time. */

document.querySelectorAll('[data-ap-announce]').forEach((box) => {
  const items = [...box.querySelectorAll('[data-ap-msg]')];
  const btn = box.querySelector('[data-ap-announce-toggle]');
  if (items.length < 2) { if (btn) btn.hidden = true; return; }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer = null, userPaused = reduce;
  const show = (n) => items.forEach((m, k) => { m.hidden = k !== n; });
  const next = () => { i = (i + 1) % items.length; show(i); };
  const start = () => { stop(); if (!userPaused) timer = setInterval(next, 6000); };
  const stop = () => { clearInterval(timer); timer = null; };
  const paint = () => {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(userPaused));
    btn.querySelector('[data-pause]').hidden = userPaused;
    btn.querySelector('[data-play]').hidden = !userPaused;
    btn.setAttribute('aria-label', userPaused ? btn.dataset.labelPlay : btn.dataset.labelPause);
  };

  if (btn) btn.addEventListener('click', () => { userPaused = !userPaused; paint(); userPaused ? stop() : start(); });
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', start);
  box.addEventListener('focusin', stop);
  box.addEventListener('focusout', start);
  show(0); paint(); start();
});
