/* ap-sticky.js — shows the sticky add-to-cart bar once the main add-to-cart button has scrolled
   out of view (IntersectionObserver, no scroll listener). Hidden again when the cart drawer is open. */

const bar = document.querySelector('[data-ap-sticky]');
const target = document.querySelector('[data-ap-atc]');

if (bar && target && 'IntersectionObserver' in window) {
  let pastTarget = false;
  let drawerOpen = false;
  const apply = () => {
    const show = pastTarget && !drawerOpen;
    bar.classList.toggle('is-visible', show);
    // keep hidden content out of the tab order and the accessibility tree while off-screen
    bar.toggleAttribute('inert', !show);
  };
  new IntersectionObserver(([entry]) => {
    // "past" = button is above the viewport (user scrolled down past it), not simply below the fold
    pastTarget = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    apply();
  }, { threshold: 0 }).observe(target);

  document.addEventListener('ap:cart-open', () => { drawerOpen = true; apply(); });
  document.addEventListener('ap:cart-close', () => { drawerOpen = false; apply(); });
  apply();
}
