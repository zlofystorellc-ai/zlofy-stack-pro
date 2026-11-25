#!/usr/bin/env node
/**
 * Builds the land / United States dot masks used by assets/ap-globe.js.
 * Source: Natural Earth 1:110m countries (public domain) via the world-atlas package.
 * Usage: node scripts/gen-globe-data.mjs /path/to/countries-110m.json   (prints a JSON line to paste into ap-globe.js)
 */
import { readFileSync } from 'node:fs';
const topo = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { scale, translate } = topo.transform;
const arcs = topo.arcs.map((a) => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; }); });
const ring = (idx) => { const pts = []; for (const i of idx) { const a = i >= 0 ? arcs[i] : arcs[~i].slice().reverse(); for (const p of a) pts.push(p); } return pts; };
const polysOf = (g) => (g.type === 'Polygon' ? [g.arcs] : g.arcs).map((poly) => poly.map(ring));
const countries = topo.objects.countries.geometries.map((g) => ({ id: String(g.id), name: g.properties.name, polys: polysOf(g) }));
const inRing = (x, y, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { if ((r[i][1] > y) !== (r[j][1] > y) && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c; } return c; };
const inPoly = (x, y, rings) => { let c = false; for (const r of rings) if (inRing(x, y, r)) c = !c; return c; };
const inCountry = (x, y, c) => c.polys.some((p) => inPoly(x, y, p));
const usa = countries.find((c) => c.id === '840');
const S = 2.2;
const rows = [];
let landBits = '', usBits = '';
for (let lat = -58; lat <= 84; lat += S) {
  const n = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / S));
  for (let i = 0; i < n; i++) {
    const lon = -180 + ((i + 0.5) * 360) / n;
    const land = countries.some((c) => c.id !== '010' && inCountry(lon, lat, c));
    landBits += land ? '1' : '0';
    usBits += land && inCountry(lon, lat, usa) ? '1' : '0';
  }
}
const toB64 = (bits) => { let out = ''; for (let i = 0; i < bits.length; i += 6) out += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[parseInt(bits.slice(i, i + 6).padEnd(6, '0'), 2)]; return out; };
console.log(JSON.stringify({ S, latMin: -58, latMax: 84, n: landBits.length, land: toB64(landBits), us: toB64(usBits) }));
