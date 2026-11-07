/* ap-upsell.js — swaps the server-rendered fallback for live Shopify "complementary" recommendations.
   If the request fails or returns nothing, the fallback collection (already in the page) stays. */

const box = document.querySelector('[data-ap-upsell-section]');
if (box && box.dataset.url) {
  fetch(box.dataset.url)
    .then((r) => (r.ok ? r.text() : ''))
    .then((html) => {
      if (!html) return;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-ap-upsell-list]');
      const current = box.querySelector('[data-ap-upsell-list]');
      if (fresh && current && fresh.children.length) current.replaceChildren(...fresh.children);
    })
    .catch(() => {});
}
