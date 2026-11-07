/* ap-tabs.js — progressive tabs. Without JS every panel is visible. */
function init(root) {
  const list = root.querySelector('[data-ap-tablist]');
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll('[data-ap-panel]'));
  if (!tabs.length || tabs.length !== panels.length) return;
  list.hidden = false;
  // The tab button already names the panel, so the panel's own heading is redundant in tab mode.
  panels.forEach((p) => p.querySelector('.apx-when__ph')?.classList.add('apx-sr'));

  const select = (i, focus) => {
    tabs.forEach((t, n) => {
      const on = n === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i, false));
    t.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      let n = null;
      if (e.key === 'ArrowRight') n = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft') n = i === 0 ? last : i - 1;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = last;
      if (n !== null) { e.preventDefault(); select(n, true); }
    });
  });
  select(0, false);
}

document.querySelectorAll('[data-ap-tabs]').forEach(init);
document.addEventListener('shopify:section:load', (e) => {
  e.target.querySelectorAll?.('[data-ap-tabs]').forEach(init);
});
