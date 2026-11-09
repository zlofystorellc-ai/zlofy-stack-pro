/* ap-header.js — mobile menu. Closes on Escape and returns focus to the menu button. */
const header = document.querySelector('[data-ap-header]');
if (header) {
  const burger = header.querySelector('[data-ap-menu-toggle]');
  const menu = header.querySelector('[data-ap-menu]');
  if (burger && menu) {
    const set = (open) => { burger.setAttribute('aria-expanded', String(open)); menu.hidden = !open; };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); burger.focus(); } });
    matchMedia('(min-width:760px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }
}
