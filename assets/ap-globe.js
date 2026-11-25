/* ap-globe.js: dotted globe centred on the US. Drag (mouse or touch) or use the left/right arrow keys to spin it.
   It drifts gently while idle and eases back to face the US. Reduced motion: drawn once, spins only when you drag or press keys. */
const NA = [[-168,66],[-162,70],[-141,70],[-128,70],[-115,68],[-95,72],[-85,69],[-82,64],[-93,59],[-92,57],[-82,55],[-79,51],[-78,58],[-77,62],[-70,60],[-65,60],[-62,57],[-57,52],[-56,49],[-60,46],[-66,44],[-70,42],[-74,40],[-76,35],[-81,31],[-80,25],[-82,27],[-84,30],[-89,30],[-94,29],[-97,26],[-97,22],[-95,19],[-91,19],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-80,8],[-78,9],[-80,7],[-84,9],[-86,12],[-92,14],[-96,16],[-105,20],[-106,23],[-110,24],[-112,28],[-115,30],[-110,23],[-112,25],[-115,29],[-117,32],[-121,35],[-124,40],[-124,46],[-127,50],[-131,55],[-138,59],[-148,60],[-154,58],[-162,55],[-165,60],[-166,63]];
const US = [[-124.7,48.4],[-123,49],[-95,49],[-89,48],[-84,46.5],[-83,45],[-82.5,42],[-79,43],[-76,44],[-71,45],[-67,47.2],[-67,44.8],[-70,43.5],[-70,41.7],[-74,40.5],[-75.5,38],[-76,35],[-81,31.5],[-80,25.3],[-82,26.5],[-84,30],[-89,30],[-94,29.5],[-97.2,26],[-99.5,27.5],[-104.5,29.5],[-106.5,31.8],[-111,31.3],[-117,32.5],[-120.5,34.5],[-122.5,37.5],[-124.2,40.5],[-124.5,43]];
const inPoly = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { if ((p[i][1] > y) !== (p[j][1] > y) && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; } return c; };
const rad = Math.PI / 180;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function build() {
  const pts = [];
  const step = 2.3;
  for (let lat = 8; lat <= 72; lat += step) {
    const ls = step / Math.max(0.35, Math.cos(lat * rad));
    for (let lon = -170; lon <= -52; lon += ls) {
      if (!inPoly(lon, lat, NA)) continue;
      const us = inPoly(lon, lat, US);
      const la = lat * rad, lo = lon * rad;
      pts.push({ lo, la, x0: Math.cos(la), y0: Math.sin(la), us, hot: us && Math.random() < 0.09, ph: Math.random() * 6.28 });
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
    let rot = home, vel = 0, size = 0, dpr = 1, drag = false, lastX = 0, lastMove = 0, visible = true, raf = 0;
    const tilt = 24 * rad, ct = Math.cos(tilt), st = Math.sin(tilt);
    const css = getComputedStyle(cv);
    const col = (n, d) => (css.getPropertyValue(n).trim() || d);

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      const w = cv.clientWidth;
      size = w;
      cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr);
      draw(performance.now());
    };

    function draw(t) {
      const R = size * 0.46, cx = size / 2, cy = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      g.addColorStop(0, 'rgba(228,163,177,.10)'); g.addColorStop(1, 'rgba(20,4,8,.35)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = col('--g-ring', 'rgba(228,163,177,.45)'); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
      const dim = col('--g-dim', 'rgba(245,230,232,.26)'), us = col('--g-us', '#fff'), hot = col('--g-hot', '#E4A3B1');
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
          ctx.beginPath(); ctx.arc(px, py, 2.1 + tw * 1.6, 0, 6.2832); ctx.fill();
          ctx.globalAlpha = edge * 0.28 * tw; ctx.beginPath(); ctx.arc(px, py, 6.5, 0, 6.2832); ctx.fill();
        } else {
          ctx.globalAlpha = p.us ? edge * 0.95 : edge;
          ctx.fillStyle = p.us ? us : dim;
          ctx.beginPath(); ctx.arc(px, py, p.us ? 1.7 : 1.4, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame(t) {
      raf = 0;
      if (!drag) {
        if (Math.abs(vel) > 0.00008) { rot += vel; vel *= 0.94; lastMove = t; }
        else if (!reduce && t - lastMove > 2500) {
          const target = home + 0.38 * Math.sin(t * 0.00035);
          rot += (target - rot) * 0.02;
        }
      }
      draw(t);
      if (visible && (!reduce || drag || Math.abs(vel) > 0.00008)) raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

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
