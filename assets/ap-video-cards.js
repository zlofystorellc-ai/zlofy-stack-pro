/* ap-video-cards.js: tap a card to play/pause its video (muted). Posters work without JS. */
function init(root) {
  const cards = Array.from(root.querySelectorAll('.apx-vc__card'));
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
