#!/usr/bin/env node
/**
 * WCAG 2.2 contrast check for every text/background and UI-component pair used by the theme.
 * Text pairs need >= 4.5:1 (normal text) or 3:1 (large text). UI graphics and control borders need >= 3:1.
 * Palette values mirror config/settings_schema.json defaults and snippets/ap-tokens.liquid.
 *
 * Usage: node scripts/contrast-check.mjs   (exit 1 if any pair fails)
 */
const C = {
  ink: '#1B1B3A', blush: '#F95D75', blushDeep: '#CF2749', lilac: '#CDB8FF', sand: '#FFF0F2',
  apricot: '#FFB270', white: '#FFFFFF', inkSoft: '#4A4A6A',
  cmpUs: '#FCDDE2', dayCell: '#FFF7F7', nightCell: '#ECE7F5', star: '#757E94', ledeOnInk: '#E6E9F2'
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
  ['Body text: ink on white', C.ink, C.white, 4.5],
  ['Body text: ink on sand', C.ink, C.sand, 4.5],
  ['Secondary text: ink-soft on white', C.inkSoft, C.white, 4.5],
  ['Secondary text: ink-soft on sand', C.inkSoft, C.sand, 4.5],
  ['Primary button: white on blush-deep', C.white, C.blushDeep, 4.5],
  ['Button hover: white on ink', C.white, C.ink, 4.5],
  ['Link: blush-deep on white', C.blushDeep, C.white, 4.5],
  ['Link: blush-deep on sand', C.blushDeep, C.sand, 4.5],
  ['Eyebrow: blush-deep on sand', C.blushDeep, C.sand, 4.5],
  ['Savings: blush-deep on white', C.blushDeep, C.white, 4.5],
  ['Comparison "us" column: ink on tint', C.ink, C.cmpUs, 4.5],
  ['Comparison "us" header: white on blush-deep', C.white, C.blushDeep, 4.5],
  ['Day/night: ink on day cell', C.ink, C.dayCell, 4.5],
  ['Day/night: ink on night cell', C.ink, C.nightCell, 4.5],
  ['Night header: white on ink', C.white, C.ink, 4.5],
  ['Announcement bar: white on ink', C.white, C.ink, 4.5],
  ['Dark sections: light lede on ink', C.ledeOnInk, C.ink, 4.5],
  ['Dark sections: eyebrow lilac on ink', C.lilac, C.ink, 4.5],
  ['Dark section: butter on ink (stats, highlights)', '#FFE066', C.ink, 4.5],
  ['Guarantee band: blush-deep on butter cream', C.blushDeep, '#FFF3BC', 4.5],
  ['Guarantee band: ink on butter cream', C.ink, '#FFF3BC', 4.5],
  ['Guarantee pill: butter on ink', '#FFE066', C.ink, 4.5],
  ['Video cards pill: ink on butter', C.ink, '#FFE066', 4.5],
  ['Badge: ink on apricot', C.ink, C.apricot, 4.5],
  ['Guarantee badge: ink on lilac', C.ink, C.lilac, 4.5],
  ['Cart count: white on ink', C.white, C.ink, 4.5],
  ['Footer: white on ink', C.white, C.ink, 4.5],
  ['Footer fine print: light grey on ink', '#C9CFDD', C.ink, 4.5],
  ['Benefit pills: ink on white', C.ink, C.white, 4.5],
  ['UI: control border ink-soft on white', C.inkSoft, C.white, 3],
  ['UI: control border ink-soft on sand', C.inkSoft, C.sand, 3],
  ['UI: selected card border ink on sand', C.ink, C.sand, 3],
  ['UI: check/icon blush-deep on white', C.blushDeep, C.white, 3],
  ['UI: check/icon blush-deep on sand', C.blushDeep, C.sand, 3],
  ['UI: rating star (empty) on white', C.star, C.white, 3],
  ['UI: lilac icon on ink', C.lilac, C.ink, 3],
  ['UI: focus ring ink on white', C.ink, C.white, 3],
  ['UI: focus ring white on ink', C.white, C.ink, 3],
  ['Decorative only (not required): blush on white', C.blush, C.white, 3]
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
