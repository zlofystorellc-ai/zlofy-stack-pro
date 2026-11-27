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

/* Links like "/#faq" in the menu and footer: when the section is already on this page, scroll to it right here
   (no reload, works on the product page and the home page). Otherwise the browser goes to the home page section. */
const ALIAS = { ingredient: 'ingredients' };
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href^="/#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const id = a.getAttribute('href').slice(2);
  const el = document.getElementById(id) || document.getElementById(ALIAS[id] || '');
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', '#' + el.id);
  const menu = document.querySelector('[data-ap-menu]');
  if (menu && !menu.hidden) { menu.hidden = true; const b = document.querySelector('[data-ap-menu-toggle]'); if (b) b.setAttribute('aria-expanded', 'false'); }
});
