/* ap-video-cards.js: tap a card to play/pause its video (muted). Posters work without JS. */
function init(root) {
  const cards = Array.from(root.querySelectorAll('.apx-vc__card'));
  const row = root.querySelector('.apx-vc__row');
  const nav = root.querySelector('[data-ap-vc-nav]');
  if (row && nav) {
    const prev = nav.querySelector('[data-ap-vc-prev]');
    const next = nav.querySelector('[data-ap-vc-next]');
    const step = () => (cards[0] ? cards[0].offsetWidth + 14 : 300);
    const sync = () => {
      nav.hidden = row.scrollWidth <= row.clientWidth + 2;
      prev.disabled = row.scrollLeft <= 2;
      next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
    };
    prev.addEventListener('click', () => row.scrollBy({ left: -step() }));
    next.addEventListener('click', () => row.scrollBy({ left: step() }));
    row.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }
  const stop = (card) => {
    const v = card.querySelector('video');
    const b = card.querySelector('[data-ap-vc-play]');
    if (v) v.pause();
    if (b) b.setAttribute('aria-pressed', 'false');
  };
  cards.forEach((card) => {
    const v = card.querySelector('video');
    const b = card.querySelector('[data-ap-vc-play]');
    if (!v || !b) return;
    b.addEventListener('click', () => {
      if (v.paused) {
        cards.forEach((c) => c !== card && stop(c));
        v.play().then(() => b.setAttribute('aria-pressed', 'true')).catch(() => {});
      } else {
        stop(card);
      }
    });
    v.addEventListener('ended', () => stop(card));
  });
}
document.querySelectorAll('[data-ap-vc]').forEach(init);
document.addEventListener('shopify:section:load', (e) => {
  e.target.querySelectorAll?.('[data-ap-vc]').forEach(init);
});
