/* ap-header.js — dropdown nav + mobile menu. Closes on Escape and outside click. Returns focus on Escape. */
const header = document.querySelector('[data-ap-header]');
if (header) {
  const dds = [...header.querySelectorAll('[data-ap-dd]')];
  const closeDd = (dd, refocus) => {
    const b = dd.querySelector('[data-ap-dd-btn]');
    b.setAttribute('aria-expanded', 'false');
    dd.querySelector('.apx-dd__panel').hidden = true;
    if (refocus) b.focus();
  };
  dds.forEach((dd) => {
    const b = dd.querySelector('[data-ap-dd-btn]');
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      dds.forEach((o) => closeDd(o, false));
      if (!open) { b.setAttribute('aria-expanded', 'true'); dd.querySelector('.apx-dd__panel').hidden = false; }
    });
    dd.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDd(dd, true); });
  });
  document.addEventListener('click', (e) => { dds.forEach((dd) => { if (!dd.contains(e.target)) closeDd(dd, false); }); });

  const burger = header.querySelector('[data-ap-menu-toggle]');
  const menu = header.querySelector('[data-ap-menu]');
  if (burger && menu) {
    const set = (open) => { burger.setAttribute('aria-expanded', String(open)); menu.hidden = !open; };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); burger.focus(); } });
    matchMedia('(min-width:760px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }
}
