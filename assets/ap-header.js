/* ap-header.js — day/night toggle, shrink-on-scroll header, scroll-padding for anchors, optional Reviews link.
   The theme itself is set before first paint by the tiny inline script in layout/theme.liquid (data-theme on <html>);
   this file only handles the toggle button. Only CSS custom properties change between themes, never the layout. */
const root = document.documentElement;
const header = document.querySelector('[data-ap-header]');

/* ---- theme toggle ---- */
const toggle = document.querySelector('[data-ap-theme-toggle]');
if (toggle) {
  const sync = () => {
    const night = root.getAttribute('data-theme') === 'night';
    toggle.setAttribute('aria-pressed', String(night));
    toggle.setAttribute('aria-label', night ? toggle.dataset.labelToDay : toggle.dataset.labelToNight);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', night ? '#1F2A44' : '#F4EDE4');
  };
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ap-theme', next); } catch (e) { /* private mode: the choice just is not remembered */ }
    sync();
  });
  sync();
}

if (header) {
  /* ---- Reviews link only when a reviews section is on the page ---- */
  const rev = header.querySelector('[data-ap-reviews-link]');
  if (rev && document.getElementById('reviews')) rev.hidden = false;

  /* ---- keep anchors and focused elements clear of the sticky header (WCAG 2.4.11) ---- */
  const setOffset = () => {
    const h = Math.round(header.getBoundingClientRect().height);
    root.style.setProperty('--ap-header-h', `${h}px`);
    root.style.scrollPaddingTop = `${h + 12}px`;
  };

  /* ---- shrink on scroll ---- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const small = window.scrollY > 40;
      if (header.classList.contains('is-shrunk') !== small) {
        header.classList.toggle('is-shrunk', small);
        setOffset();
      }
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', setOffset);
  setOffset();
  onScroll();
}
