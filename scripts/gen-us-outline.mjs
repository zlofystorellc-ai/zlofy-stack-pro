#!/usr/bin/env node
/**
 * Prints the lower-48 outline of the United States as an SVG path, plus the projection constants used by assets/ap-locator.js.
 * Source: Natural Earth 1:110m countries (public domain) via the world-atlas package. Albers equal-area conic projection.
 * Usage: node scripts/gen-us-outline.mjs /path/to/countries-110m.json
 */
import { readFileSync } from 'node:fs';
const topo = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((a) => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; }); });
const ring = (idx) => { const pts = []; for (const i of idx) { const a = i >= 0 ? arcs[i] : arcs[~i].slice().reverse(); for (const p of a) pts.push(p); } return pts; };
const g = topo.objects.countries.geometries.find((c) => String(c.id) === '840');
const polys = (g.type === 'Polygon' ? [g.arcs] : g.arcs).map((p) => p.map(ring));
const rad = Math.PI / 180;
const [p1, p2, lat0, lon0] = [29.5 * rad, 45.5 * rad, 37.5 * rad, -96 * rad];
const n = (Math.sin(p1) + Math.sin(p2)) / 2, C = Math.cos(p1) ** 2 + 2 * n * Math.sin(p1), rho0 = Math.sqrt(C - 2 * n * Math.sin(lat0)) / n;
const proj = (lon, lat) => { const rho = Math.sqrt(C - 2 * n * Math.sin(lat * rad)) / n, th = n * (lon * rad - lon0); return [rho * Math.sin(th), rho0 - rho * Math.cos(th)]; };
const main = polys.filter((p) => p[0].some(([lo, la]) => lo > -125 && lo < -66 && la > 24 && la < 50));
const all = main.flatMap((p) => p[0].map(([lo, la]) => proj(lo, la)));
const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
const W = 1000, k = (W - 40) / (x1 - x0), H = Math.round((y1 - y0) * k + 40);
const X = (p) => (20 + (p[0] - x0) * k).toFixed(1), Y = (p) => (20 + (y1 - p[1]) * k).toFixed(1);
let d = '';
for (const poly of main) for (const r of poly) { let last = ''; r.forEach(([lo, la], i) => { const q = proj(lo, la); const s = X(q) + ' ' + Y(q); if (s === last) return; last = s; d += (i === 0 ? 'M' : 'L') + s; }); d += 'Z'; }
console.log(JSON.stringify({ W, H, x0, y1, k, n, C, rho0, lon0, d }));
