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

/* Countdown: shows only for a valid FUTURE end date; hides itself at zero. */
document.querySelectorAll('[data-ap-count]').forEach((box) => {
  const end = Date.parse(box.dataset.apCount);
  if (Number.isNaN(end) || end <= Date.now()) return;
  const pad = (n) => String(n).padStart(2, '0');
  const set = (sel, v) => { box.querySelector(sel).textContent = pad(v); };
  let t;
  const tick = () => {
    const left = Math.max(0, end - Date.now());
    if (left === 0) { box.hidden = true; clearInterval(t); return; }
    const s = Math.floor(left / 1000);
    set('[data-ap-d]', Math.floor(s / 86400)); set('[data-ap-h]', Math.floor((s % 86400) / 3600));
    set('[data-ap-m]', Math.floor((s % 3600) / 60)); set('[data-ap-s]', s % 60);
    box.hidden = false;
  };
  tick(); t = setInterval(tick, 1000);
});
document.querySelectorAll('[data-ap-country]').forEach((sel) => sel.addEventListener('change', () => sel.form.submit()));
