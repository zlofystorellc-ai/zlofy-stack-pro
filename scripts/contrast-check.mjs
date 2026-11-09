#!/usr/bin/env node
/**
 * WCAG 2.2 contrast check for the text / background and UI pairs used by the theme, in BOTH themes.
 * Text pairs need >= 4.5:1 (normal text) or 3:1 (large text). UI graphics and control borders need >= 3:1.
 * Values mirror config/settings_schema.json defaults and snippets/ap-tokens.liquid (day and night token sets).
 *
 * Usage: node scripts/contrast-check.mjs   (exit 1 if any pair fails)
 */
const C = {
  ink: '#1F2A44', teal: '#2A9D8F', tealDeep: '#1D6F66', lilac: '#C8B6E2', sand: '#F4EDE4', apricot: '#F4A261', white: '#FFFFFF',
  // day tokens
  daySurface: '#FFFFFF', dayTint: '#EBE1D2', daySoft: '#46506B', dayLine: '#D6C9B4',
  // night tokens
  nightBg: '#1F2A44', nightSurface: '#2A3658', nightTint: '#25304F', nightSoft: '#C9CEDB', nightLine: '#44517A',
  onDark: '#FFFFFF', lede: '#E6E9F2'
};

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [label, foreground, background, minimum]
const PAIRS = [
  // ---- DAY ----
  ['Day: body text ink on sand (page)', C.ink, C.sand, 4.5],
  ['Day: body text ink on white (cards)', C.ink, C.daySurface, 4.5],
  ['Day: body text ink on tint', C.ink, C.dayTint, 4.5],
  ['Day: secondary text on sand', C.daySoft, C.sand, 4.5],
  ['Day: secondary text on white', C.daySoft, C.daySurface, 4.5],
  ['Day: secondary text on tint', C.daySoft, C.dayTint, 4.5],
  ['Day: links / small accent text (teal deep) on sand', C.tealDeep, C.sand, 4.5],
  ['Day: links / small accent text (teal deep) on white', C.tealDeep, C.daySurface, 4.5],
  ['Day: links / small accent text (teal deep) on tint', C.tealDeep, C.dayTint, 4.5],
  ['Day: white text on teal deep (selected chips)', C.white, C.tealDeep, 4.5],
  ['Day: primary button ink on apricot', C.ink, C.apricot, 4.5],
  ['Day: button hover white on ink', C.onDark, C.ink, 4.5],
  ['Day: announcement and footer white on ink', C.onDark, C.ink, 4.5],
  ['Day: light lede on ink', C.lede, C.ink, 4.5],
  ['Day UI: control border ink-soft on sand', C.daySoft, C.sand, 3],
  ['Day UI: control border ink-soft on white', C.daySoft, C.daySurface, 3],
  ['Day UI: selected card border ink on sand', C.ink, C.sand, 3],
  ['Day UI: icon teal deep on sand', C.tealDeep, C.sand, 3],
  ['Day UI: focus ring ink on sand', C.ink, C.sand, 3],
  ['Decorative only, never relied on: pure teal on sand (below 3:1 on purpose)', C.teal, C.sand, 2.5],
  ['Day UI: teal on ink (logo swash, h2 bar on dark)', C.teal, C.ink, 3],
  // ---- NIGHT ----
  ['Night: body text sand on ink (page)', C.sand, C.nightBg, 4.5],
  ['Night: body text sand on surface (cards)', C.sand, C.nightSurface, 4.5],
  ['Night: body text sand on tint', C.sand, C.nightTint, 4.5],
  ['Night: secondary text on page', C.nightSoft, C.nightBg, 4.5],
  ['Night: secondary text on surface', C.nightSoft, C.nightSurface, 4.5],
  ['Night: links / accent text lilac on page', C.lilac, C.nightBg, 4.5],
  ['Night: links / accent text lilac on surface', C.lilac, C.nightSurface, 4.5],
  ['Night: ink text on lilac (selected chips)', C.ink, C.lilac, 4.5],
  ['Night: primary button ink on apricot', C.ink, C.apricot, 4.5],
  ['Night UI: selected card border sand on surface', C.sand, C.nightSurface, 3],
  ['Night UI: icon lilac on page', C.lilac, C.nightBg, 3],
  ['Night UI: focus ring sand on page', C.sand, C.nightBg, 3]
];

let fail = 0;
for (const [label, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}`);
}
console.log(fail ? `\n${fail} pair(s) FAIL` : `\nAll ${PAIRS.length} pairs pass.`);
process.exit(fail ? 1 : 0);
