/* ap-before-after.js: drag/keyboard slider. The native range input does the work, so it is accessible. */
function init(root) {
  root.querySelectorAll('[data-ap-ba]').forEach((item) => {
    if (item.dataset.apBound) return;
    item.dataset.apBound = '1';
    const stage = item.querySelector('.apx-ba__stage');
    const range = item.querySelector('[data-ap-ba-range]');
    if (!stage || !range) return;
    const set = () => stage.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', set);
    set();
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
