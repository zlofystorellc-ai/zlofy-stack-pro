/* ap-globe.js: a dotted world globe with the United States highlighted. Drag (mouse or touch) or use the left/right arrow keys to spin it.
   It turns slowly by itself and starts facing the US. Reduced motion: drawn once, only moves when you drag or press keys.
   Land data: Natural Earth 1:110m countries (public domain), reduced to dots by scripts/gen-globe-data.mjs. */
const DATA = {"S":2.2,"latMin":-58,"latMax":84,"n":7897,"land":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAiAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAQAAAAABwAAAAAAAAAABAIAAAAAA8AAAAAAAAAAAAAIAAAAAA/AAAAAAAAAAABgBAAAAAAD8AAAAAAAAAAADwAAAAAAAA/gAAADgAAAADw/AAAAAAAAB/gAAADwAAAAB//wAAAAAAAAf8AAAA/AAAAAH//AAAAAAAAAf8AAAA/gAAAAD//wAAAAAAAAD/gAAAH+EAAAAP//AAAAAAAAAH/4AAAH+GAAAAP//AAAAAAAAAB/+AAAD/hgAAAAf/wIAAAAAAAAP/4AAAP/HAAAAAf+AAP/////////////////////////4AAAAAAAf/+AAAD/8IAAAAAuQAAAAAAAAAD//4AAAP/wAAAAAABAAAAAAAAAAf//4AAA//AAAAAAAAgAAAAAAAAA///wAAA//AAAAA4APAAAAAAAAAA///wAAA//AAAAAAAHiAAAAAAAAAf//wAAA//wAAABzZfAAAAAAAAAAP//AAAAf/8AAAAR8EAAAAAAAAAAB//AAAAH//gAAAMeEAAAAAAAAAAAf/gAAAB//8AAAKDAAAAAAAAAAAAP/gAAHz///AAABAgAAAAAAAAAAAX+AAAP////gAIAAGAAAAAAAAAABC0AAAf////AAgAgIAAAAAAAAAAGAAAAB////gAHAHgQAAAAAAAAADwAAAAf///7gAwD4AAAAAAAAAAHwAAAAH///98A8D4EAAAAAAAAAOYGAAAD///7+A+H0AAAAAAAAAA4xAAAAf///f8P4/QAAAAAAAAAOAAAAAH///v+H//+gAAAAAAAA+AAAAAH//+/H///8AAAAAAAAXwIAAAA///vv////AAAAAAAAX/YAAAAf///f///+AAAAAAAD//AAAAH/kP/////AAAAAAAH//AAAAH4Af////4YAAAAAD//4AAACcB/////7MAAAAAP//gAAAcBf5///8wAAAAAH//4AAAcL/z////EAAAAB//+AAAPrw3////kAAAAD///AAAe++////4AAAAB//8gAB///////wAAAB//8QAA//////+AAAAP//8AA3//////EAAB//fgAE/////+CAED/48AAhf////BgCH/xoAAZ////4QH//hgAB3////7B//wxAD////////////0AAAAP/////yEAAActM+Bwf//gDseAA/7ABAfAEcAAWfAEYAB/gAAAfgEACgAA","us":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQIAAAAAAAAAAAAAAAAAAAAAA/YAAAAAAAAAAAAAAAAAAAAB//AAAAAAAAAAAAAAAAAAAAH//AAAAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAP//gAAAAAAAAAAAAAAAAAH//4AAAAAAAAAAAAAAAAB//uAAAAAAAAAAAAAAAAD/+EAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAACEAAAAAAAAAAAAH4AAAAAAAAAAAB8AAAAAAAAAAA+AAAAAAAAAADwAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"};
const rad = Math.PI / 180;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const bits = (s, n) => { let o = ''; for (let i = 0; i < s.length; i++) o += B64.indexOf(s[i]).toString(2).padStart(6, '0'); return o.slice(0, n); };

function build() {
  const land = bits(DATA.land, DATA.n), us = bits(DATA.us, DATA.n);
  const pts = [];
  let k = 0;
  for (let lat = DATA.latMin; lat <= DATA.latMax; lat += DATA.S) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * rad)) / DATA.S));
    for (let i = 0; i < n; i++, k++) {
      if (land[k] !== '1') continue;
      const lon = -180 + ((i + 0.5) * 360) / n;
      const la = lat * rad, lo = lon * rad;
      const isUs = us[k] === '1';
      pts.push({ lo, x0: Math.cos(la), y0: Math.sin(la), us: isUs, hot: isUs && Math.random() < 0.1, ph: Math.random() * 6.28 });
    }
  }
  return pts;
}

function init(root) {
  root.querySelectorAll('[data-ap-globe]').forEach((cv) => {
    if (cv.dataset.apBound) return;
    cv.dataset.apBound = '1';
    const ctx = cv.getContext('2d');
    const pts = build();
    const home = -98 * rad;
    let rot = home, vel = 0, size = 0, dpr = 1, drag = false, lastX = 0, lastMove = 0, visible = true, raf = 0, last = 0;
    const tilt = 22 * rad, ct = Math.cos(tilt), st = Math.sin(tilt);
    const css = getComputedStyle(cv);
    const col = (n, d) => (css.getPropertyValue(n).trim() || d);

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      size = cv.clientWidth;
      cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
      draw(performance.now());
    };

    function draw(t) {
      const R = size * 0.46, cx = size / 2, cy = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      g.addColorStop(0, 'rgba(228,163,177,.12)'); g.addColorStop(1, 'rgba(20,4,8,.4)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = col('--g-ring', 'rgba(228,163,177,.45)'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
      const dim = col('--g-dim', 'rgba(245,230,232,.5)'), us = col('--g-us', '#fff'), hot = col('--g-hot', '#E4A3B1');
      const r1 = Math.max(1.1, size / 330), r2 = r1 * 1.25;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const a = p.lo - rot;
        const x = p.x0 * Math.sin(a), z0 = p.x0 * Math.cos(a), y0 = p.y0;
        const y = y0 * ct - z0 * st, z = y0 * st + z0 * ct;
        if (z <= 0.02) continue;
        const px = cx + x * R, py = cy - y * R;
        const edge = Math.min(1, z * 2.2);
        if (p.hot) {
          const tw = 0.55 + 0.45 * Math.sin(t * 0.003 + p.ph);
          ctx.globalAlpha = edge; ctx.fillStyle = hot;
          ctx.beginPath(); ctx.arc(px, py, r2 + tw * 1.5, 0, 6.2832); ctx.fill();
          ctx.globalAlpha = edge * 0.28 * tw; ctx.beginPath(); ctx.arc(px, py, 6, 0, 6.2832); ctx.fill();
        } else {
          ctx.globalAlpha = edge;
          ctx.fillStyle = p.us ? us : dim;
          ctx.beginPath(); ctx.arc(px, py, p.us ? r2 : r1, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame(t) {
      raf = 0;
      const dt = last ? Math.min(50, t - last) : 16; last = t;
      if (!drag) {
        if (Math.abs(vel) > 0.00008) { rot += vel; vel *= 0.94; lastMove = t; }
        else if (!reduce && t - lastMove > 1500) rot += dt * 0.00012;
      }
      draw(t);
      if (visible && (!reduce || drag || Math.abs(vel) > 0.00008)) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };

    cv.addEventListener('pointerdown', (e) => { drag = true; lastX = e.clientX; vel = 0; cv.classList.add('is-drag'); cv.setPointerCapture(e.pointerId); kick(); });
    cv.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - lastX; lastX = e.clientX; const d = (dx / size) * 3.2; rot -= d; vel = -d * 0.6; lastMove = performance.now(); kick(); });
    const end = () => { drag = false; cv.classList.remove('is-drag'); kick(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('keydown', (e) => { const k = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0; if (!k) return; e.preventDefault(); vel = k * 0.035; lastMove = performance.now(); kick(); });

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(cv);
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) kick(); }, { threshold: 0.05 }).observe(cv);
    resize(); kick();
  });
}
init(document);
document.addEventListener('shopify:section:load', (e) => init(e.target));
