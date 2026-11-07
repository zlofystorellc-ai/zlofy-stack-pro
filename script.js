const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Gallery ---------- */
/* To use your own product photos, list them here (e.g. 'img/1.jpg'). When filled, they replace the drawn slides. */
const GALLERY_IMAGES = [];

const boxArt = (x, y, c) => `<g transform="translate(${x},${y})"><path d="M0 18 L32 0 L64 18 L64 92 L32 110 L0 92Z" fill="url(#bx${c})"/><path d="M32 0 L64 18 L64 92 L32 110Z" fill="rgba(0,0,0,.16)"/><text x="32" y="38" fill="#fff" font-family="Newsreader,serif" font-size="9" text-anchor="middle" letter-spacing="1.5">Z·L·O·F·Y</text><text x="32" y="70" fill="#fff" font-family="Inter,sans-serif" font-size="4.6" text-anchor="middle" letter-spacing=".6">DAILY ULTIMATE</text><text x="32" y="77" fill="#fff" font-family="Inter,sans-serif" font-size="4.6" text-anchor="middle" letter-spacing=".6">ESSENTIALS</text></g>`;
const productArt = `<svg class="art" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bx0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f08a3e"/><stop offset=".5" stop-color="#c2331b"/><stop offset="1" stop-color="#8a0012"/></linearGradient>
    <linearGradient id="bx1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4421f"/><stop offset="1" stop-color="#8a0012"/></linearGradient>
    <linearGradient id="cup" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a0010"/><stop offset=".45" stop-color="#c41c20"/><stop offset="1" stop-color="#6a000d"/></linearGradient>
    <linearGradient id="sach" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4306a"/><stop offset="1" stop-color="#6a0a4a"/></linearGradient>
  </defs>
  <g transform="translate(130 76) scale(.62)">${boxArt(262, 40, 0)}${boxArt(330, 28, 0)}${boxArt(398, 42, 0)}${boxArt(290, 118, 1)}${boxArt(362, 130, 1)}${boxArt(432, 120, 1)}</g>
  <g transform="translate(30 88) scale(.85)">
  <!-- cup -->
  <rect x="38" y="298" width="92" height="170" rx="12" fill="url(#cup)"/><rect x="42" y="282" width="84" height="22" rx="6" fill="#8a0012"/>
  <text x="84" y="392" fill="#fff" font-family="Newsreader,serif" font-size="16" text-anchor="middle" letter-spacing="3" transform="rotate(-90 84 392)">Z·L·O·F·Y</text>
  <!-- glass -->
  <path d="M150 380 h82 l-8 86 q-1 12 -13 12 h-40 q-12 0 -13 -12z" fill="#e8402a" opacity=".92"/><path d="M150 380 h82 l-2 20 h-78z" fill="#f3a38a" opacity=".6"/>
  <!-- mixer -->
  <rect x="244" y="330" width="14" height="130" rx="6" fill="#c8c8cc"/><rect x="244" y="400" width="14" height="40" fill="#a40011"/><path d="M251 330 c-14 -22 -14 -40 0 -52 c14 12 14 30 0 52z" fill="none" stroke="#9a9a9e" stroke-width="3"/>
  <!-- sachets -->
  <g transform="translate(330 340) rotate(-14)"><rect x="0" y="0" width="34" height="116" rx="4" fill="url(#sach)"/></g>
  <g transform="translate(364 336) rotate(-8)"><rect x="0" y="0" width="34" height="116" rx="4" fill="url(#sach)" opacity=".95"/></g>
  <g transform="translate(398 334) rotate(-2)"><rect x="0" y="0" width="34" height="116" rx="4" fill="url(#sach)"/></g>
  <g transform="translate(432 336) rotate(5)"><rect x="0" y="0" width="34" height="116" rx="4" fill="url(#sach)" opacity=".95"/></g>
  <g transform="translate(466 340) rotate(12)"><rect x="0" y="0" width="34" height="116" rx="4" fill="url(#sach)"/></g>
  </g>
</svg>`;
const slides = GALLERY_IMAGES.length ? GALLERY_IMAGES.map(s => `<img src="${s}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`) : [
  `${productArt}
   <div class="choice"><b class="l">Clinicians'<br>Choice</b><span><b>871 clinicians</b> share this<br>without compensation.</span></div>
   <span class="pill">THE QUARTERLY PACKAGE</span>
   <h4 class="head">More energy.<br>Better gut health.<br>Improved sleep.<br>Healthy aging.</h4>
   <div class="big">US$80 Welcome kit—Included.</div>
   <div class="labels"><div>Signature<br>Red Cup<br><s>US$44</s> VALUE</div><div>Luxe Edition<br>Mixer<br><s>US$18</s> VALUE</div><div>5x Daily Ultimate<br>Essentials Pro Sachets<br><s>US$18</s> VALUE</div></div>
   <div class="cap">Three months of ZLOFY Stack. US$80 of added value.</div>`,
  `<div class="alt">Replace 20+<br>supplements<br>with 1 ritual.</div>`,
  `<div class="alt">Clinically Proven<br>Third-Party Tested*</div>`,
  `<div class="alt">Replace 16 Supplements</div>`,
  `<div class="alt">Incredible Value:<br>Save 57% vs<br>individual supplements</div>`,
  `<div class="alt">Supplement<br>Facts</div>`
];
const main = $('#galMain'), thumbs = $('#galThumbs');
slides.forEach((h, i) => {
  main.insertAdjacentHTML('beforeend', `<div class="slide ${i ? 'alt' : ''} ${i === 0 ? 'on' : ''}" data-i="${i}">${h}</div>`);
  thumbs.insertAdjacentHTML('beforeend', `<div class="thumb ${i === 0 ? 'on' : ''}" data-i="${i}">${i === 0 ? 'ZLOFY<br>Stack' : 'Image ' + (i + 1)}</div>`);
});
thumbs.addEventListener('click', e => {
  const t = e.target.closest('.thumb'); if (!t) return;
  $$('.slide').forEach(s => s.classList.toggle('on', s.dataset.i === t.dataset.i));
  $$('.thumb').forEach(s => s.classList.toggle('on', s === t));
});

/* ---------- Flavors ---------- */
const flavors = [
  ['Variety Pack', 'linear-gradient(135deg,#a40011,#6e0010)', 1],
  ['Açaí + Mixed Berries', 'linear-gradient(135deg,#8a4a9a,#d46a8a)'],
  ['Lemon + Orange', 'linear-gradient(135deg,#f08a3e,#f6b75a)'],
  ['Mango Passion Fruit', 'linear-gradient(135deg,#e0509a,#f3a15a)']
];
$('#flavors').innerHTML = flavors.map((f, i) =>
  `<div class="fl ${i === 0 ? 'on' : ''}">${f[2] ? '<span class="best">BEST</span>' : ''}<div class="c" style="background:${f[1]}">Z</div>${f[0]}</div>`).join('');
$('#flavors').addEventListener('click', e => {
  const f = e.target.closest('.fl'); if (!f) return;
  $$('.fl').forEach(x => x.classList.toggle('on', x === f));
});

/* ---------- Plans ---------- */
$$('.plan').forEach(p => p.addEventListener('click', e => {
  e.preventDefault();
  $$('.plan').forEach(x => x.classList.toggle('plan--on', x === p));
  $('#cta').textContent = p.dataset.plan === '90' ? 'SAVE 30% + FREE GIFTS' : 'SAVE 20% + FREE GIFTS';
}));

/* ---------- Program experts ---------- */
const experts = [
  ['Expert Name', 'Chief Medical Officer'], ['Expert Name', 'Performance Trainer'], ['Expert Name', 'Gut Health Expert'],
  ['Expert Name', 'Breathwork Expert'], ['Expert Name', 'Physician & Podcast Host'], ['Expert Name', 'Longevity Physician']
];
$('#programGrid').innerHTML = experts.map(e => `<div class="exp"><div class="photo">Z</div><div class="cap"><b>${e[0]}</b>${e[1]}</div></div>`).join('');

/* ---------- Ambassador videos ----------
   Add your own clips: put a file URL in `src` (mp4) and an optional `poster` image. */
const vids = [
  { t: "It's everything you need", src: '', poster: '' },
  { t: 'Through your workouts or just', src: '', poster: '' },
  { t: 'Had this every morning', src: '', poster: '' },
  { t: 'There is nothing like it', src: '', poster: '' },
  { t: 'Probiotics, greens, all in one', src: '', poster: '' },
  { t: 'My daily ritual', src: '', poster: '' }
];
$('#videoRow').innerHTML = vids.map((v, i) =>
  `<button class="vid" data-i="${i}">${v.poster ? `<img src="${v.poster}" alt="">` : ''}<span class="t">${v.t}</span><span class="p">▶</span></button>`).join('');
const vModal = $('#vModal'), vBody = $('#vBody');
const closeV = () => { vModal.classList.remove('on'); vBody.innerHTML = ''; };
$('#videoRow').addEventListener('click', e => {
  const b = e.target.closest('.vid'); if (!b) return;
  const v = vids[+b.dataset.i];
  vBody.innerHTML = v.src ? `<video src="${v.src}" controls autoplay playsinline></video>` : '<p>Add your ambassador video here.<br><small>Set <code>src</code> in the <code>vids</code> list in script.js</small></p>';
  vModal.classList.add('on');
});
$('#vClose').addEventListener('click', closeV);
vModal.addEventListener('click', e => { if (e.target === vModal) closeV(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeV(); });

/* ---------- Sticky bar ---------- */
const sticky = $('#sticky');
addEventListener('scroll', () => sticky.classList.toggle('show', scrollY > 520), { passive: true });

/* ---------- Ticker ---------- */
const tk = ['"REPLACE ALL YOUR SUPPLEMENTS" — PRESS NAME', '700,000+ CUSTOMERS', '48M+ SERVINGS', '"SCIENCE-BACKED" — PRESS NAME', 'FEATURED: OUTLET · OUTLET · OUTLET', 'CLINICALLY PROVEN IN 12-WEEK TRIAL'];
const tkHtml = tk.map(t => `<span>${t}</span>`).join('<span>✦</span>');
$('#ticker').innerHTML = tkHtml + '<span>✦</span>' + tkHtml + '<span>✦</span>';

/* ---------- Social carousel ---------- */
const people = [
  ['Ambassador One', 'Co-Founder of ZLOFY', ''],
  ['Ambassador Two', 'Global Ambassador & Shareholder', 'ATHLETE TITLE GOES HERE'],
  ['Ambassador Three', 'Global Ambassador & Shareholder', 'ATHLETE TITLE GOES HERE'],
  ['Ambassador Four', 'Global Ambassador & Shareholder', 'ATHLETE TITLE GOES HERE'],
  ['Doctor Name', 'Chief Medical Officer', 'CREDENTIAL GOES HERE'],
  ['Ambassador Five', 'Global Ambassador', 'ATHLETE TITLE GOES HERE'],
  ['Ambassador Six', 'Global Ambassador', 'ATHLETE TITLE GOES HERE']
];
$('#socialCar').innerHTML = people.map(p =>
  `<div class="pcard"><div class="img">${p[0][0]}</div><div class="meta"><b>${p[0]}</b><small>${p[1]}</small>${p[2] ? `<span class="chip">${p[2]}</span>` : ''}</div></div>`).join('');
$('#socialDots').innerHTML = people.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
const sc = $('#socialCar');
sc.addEventListener('scroll', () => {
  const i = Math.round(sc.scrollLeft / 350);
  $$('#socialDots i').forEach((d, k) => d.classList.toggle('on', k === i));
}, { passive: true });

/* ---------- Reviews ---------- */
const revs = [
  ['Real energy, no crash', 'I replaced my whole cabinet of supplements with this. By week two my afternoons felt completely different.', 'Customer Name', 'Verified Buyer'],
  ['My digestion is finally calm', 'Less bloating and a much better routine. Tastes great too — the berry flavour is my favourite.', 'Customer Name', 'Verified Buyer'],
  ['Sleeping better than in years', 'Did not expect much but my sleep has improved noticeably. Subscribed for the 90-day plan.', 'Customer Name', 'Verified Buyer'],
  ['Worth every penny', 'One simple ritual every morning. The Longevity set is a great add-on.', 'Customer Name', 'Verified Buyer'],
  ['Sharper focus at work', 'Clear-headed through long days. Easy to mix and genuinely enjoyable.', 'Customer Name', 'Verified Buyer'],
  ['Simple and effective', 'Love that everything is in one place. Shipping was fast and support was great.', 'Customer Name', 'Verified Buyer']
];
const revHtml = r => `<div class="rev"><span class="stars">★★★★★</span><h4>${r[0]}</h4><p>${r[1]}</p><small><b>${r[2]}</b><span>✔ ${r[3]}</span></small></div>`;
const rg = $('#reviewGrid'); rg.innerHTML = revs.slice(0, 3).map(revHtml).join('');
$('#moreRev').addEventListener('click', e => { rg.insertAdjacentHTML('beforeend', revs.slice(3).map(revHtml).join('')); e.target.style.display = 'none'; });

/* ---------- Spectrum ---------- */
const spec = [
  ['Vitamin B12', 'METHYLCOBALAMIN', '24mcg', '200mcg', '+733%', 'Cellular Energy Unlocked', '⚡', '#fdecd5'],
  ['Cell Renewal', 'CRT8™ COMPLEX', '25mg', '100mg', '+300%', 'Accelerated Rejuvenation', '🌿', '#e3f3e4'],
  ['Vitamin K2', 'MENAQUINONE-7', '40mcg', '100mcg', '+150%', 'Arterial & Bone Health', '❤', '#fde3e8'],
  ['Vitamin D3', 'VEGD3® (LICHEN)', '30mcg', '50mcg', '+67%', 'Immune & Mood Support', '☀', '#fdf0cf'],
  ['Choline', 'BITARTRATE', '35mg', '55mg', '+57%', 'Focus & Memory', '✺', '#f9dfe6'],
  ['Magnesium', 'BISGLYCINATE CHELATE', '65mg', '100mg', '+54%', 'Relaxation & Recovery', '◐', '#e8e2f8'],
  ['Joint Support', 'MSM', '1,000mg', '1,500mg', '+50%', 'Clinical-Grade Mobility', '✚', '#dff0f8'],
  ['Amino Complex', 'MUSCLE RECOVERY', '1,165mg', '1,580mg', '+36%', 'Enhanced Tissue Repair', '≋', '#fde7d6'],
  ['Mood & Focus', 'SAFFRON EXTRACT', '—', '30mg', 'NEW', 'Sharper Mental Clarity', '✿', '#fbe1e1'],
  ['Vitamin B6', 'PYRIDOXAL 5-PHOSPHATE', 'HCl Form', 'P5P Form', 'UPGRADE', 'Bioactive Absorption', '⬡', '#e5f0e0'],
  ['Riboflavin', 'RIBOFLAVIN-5-PHOSPHATE', 'Standard', 'R5P Form', 'UPGRADE', 'Metabolic Efficiency', '◆', '#fdf0cf']
];
$('#specRows').innerHTML = spec.map(r =>
  `<div class="tr"><div class="ing"><i style="background:${r[7]}">${r[6]}</i><div><b>${r[0]}</b><small>${r[1]}</small></div></div><span class="orig">${r[2]}</span><div class="pro"><b>${r[3]}</b><em>${r[4]}</em></div><span class="benefit">${r[5]}</span></div>`).join('');

/* ---------- Body support ---------- */
const sys = [
  ['🫁', 'Digestive', 'Complete 4-tier system: Prebiotics, Probiotics (10B CFU), Postbiotics, and Digestive Enzymes. 89% of trial participants experienced better digestion.'],
  ['🛡️', 'Immune', 'Vitamin D3, zinc, vitamin C and a broad antioxidant matrix to keep your defences ready every day.'],
  ['❤️', 'Heart', 'CoQ10, vitamin K2 and magnesium to support healthy circulation and cardiovascular function.'],
  ['💪', 'Muscular', 'A complete amino complex plus magnesium for faster recovery and everyday strength.'],
  ['🦴', 'Skeletal', 'Calcium-supporting K2 and D3 with MSM for bone density and joint comfort.'],
  ['✨', 'Skin & Hair', 'Biotin, collagen-supporting nutrients and antioxidants for visible radiance.'],
  ['🧠', 'Brain', 'Choline, saffron and B-complex for sharper focus, memory and mood.'],
  ['⚡', 'Endocrine', 'Adaptogens and key minerals to help balance stress response and energy.'],
  ['💧', 'Hydration', 'Electrolytes in the right ratios to keep you hydrated through the day.']
];
$('#chips').innerHTML = sys.map((s, i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-i="${i}">${s[0]} ${s[1]}</button>`).join('');
const showSys = i => { $('#chipCard').innerHTML = `<h4>${sys[i][0]} ${sys[i][1]} Support</h4><p>${sys[i][2]}</p>`; $$('.chip').forEach(c => c.classList.toggle('on', +c.dataset.i === i)); };
showSys(0);
$('#chips').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) showSys(+c.dataset.i); });

/* ---------- Longevity ---------- */
const adv = [
  ['NAD+ Energy Revival', 'NMN 600mg boosts cellular energy production, reversing age-related NAD+ decline.', 'NMN 600MG + PQQ'],
  ['Senolytic Protection', 'Fisetin and Quercetin clear damaged zombie cells that accelerate aging.', 'FISETIN + QUERCETIN + RESVERATROL'],
  ['Cellular Renewal', "Spermidine activates autophagy — your body's natural cellular cleanup process.", 'SPERMIDINE-DRIVEN AUTOPHAGY'],
  ['Metabolic Optimization', 'Berberine and Astaxanthin activate AMPK and SIRT1 pathways for metabolic health.', 'AMPK/SIRT1 ACTIVATION']
];
$('#advGrid').innerHTML = adv.map(a => `<div class="adv"><h4>${a[0]}</h4><p>${a[1]}</p><span>${a[2]}</span></div>`).join('');

/* ---------- Count-up ---------- */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return; io.unobserve(en.target);
  const n = +en.target.dataset.n; let v = 0;
  const t = setInterval(() => { v += Math.ceil(n / 30); if (v >= n) { v = n; clearInterval(t); } en.target.textContent = v + '%'; }, 30);
}), { threshold: .5 });
$$('[data-n]').forEach(el => io.observe(el));

/* ---------- Advisory board ---------- */
const docs = [
  ['Advisor Name', 'Chief Medical Officer & Integrative Oncologist'], ['Advisor Name', 'Director of Microbiome Research Institute'],
  ['Advisor Name', 'Former Chief Scientist'], ['Advisor Name', 'Cardiovascular Research Scientist'],
  ['Advisor Name', 'Double-Board Certified Physician & Podcast Host'], ['Advisor Name', 'Performance Strategist & Sports Physician'],
  ['Advisor Name', 'Board Certified Surgeon & Longevity CEO'], ['Advisor Name', 'Nutritionist, Physiologist & Author'], ['Advisor Name', 'Orthopedic Surgeon, Regenerative Medicine']
];
$('#sabGrid').innerHTML = docs.map(d => `<div class="doc"><div class="avatar">Z</div><h4>${d[0]}</h4><p>${d[1]}</p><a href="#">VIEW BIO</a></div>`).join('');

/* ---------- Trusted carousel ---------- */
const quotes = [
  ['Expert Name', 'UK\'s Leading Bio-hacker', "I'm all about calling out products that fall short of their claims. ZLOFY delivers exactly what it promises — pure, effective ingredients, third-party tested."],
  ['Expert Name', 'Double-Board Certified Physician', 'As a physician who specializes in nutritional health, I recommend ZLOFY because it addresses so many foundational aspects of wellness in one formula.'],
  ['Athlete Name', 'Professional Freediver', "I'm extremely careful with what I put into my body. With ZLOFY, I know I'm fueling my body with only the best."],
  ['Athlete Name', 'Professional Fighter', "I've tried it all — endless pills and powders. After my team checked out the science, partnering with ZLOFY was a no-brainer."],
  ['Expert Name', 'Doctor of Pharmacy & Wellness Coach', 'I know the importance of science and practicality. ZLOFY gives me the daily support I need to balance my health and strength routines.'],
  ['Creator Name', 'Fitness & Wellness Influencer', "Nutrition should be as exciting as it is nourishing. I've tried countless supplements and ZLOFY stands out for both quality and results."],
  ['Expert Name', 'Celebrity Nutritionist', "I'm always skeptical of wellness claims. But ZLOFY impressed me with its clinical dosages. It's become my daily morning routine."]
];
$('#trustCar').innerHTML = quotes.map(q => `<div class="pcard"><div class="img"></div><div class="top"><span class="avatar" style="width:40px;height:40px;font-size:16px">${q[0][0]}</span><div><b>${q[0]}</b><small>${q[1]}</small></div></div><div class="meta"><p>${q[2]}</p></div></div>`).join('');

/* ---------- FAQ ---------- */
const faqs = [
  ['What is ZLOFY?', 'ZLOFY is premium core nutrition built on a science-first approach: 90 nutrient-rich ingredients plus a dedicated longevity formula, delivered in one simple daily ritual.'],
  ["What is the founder's involvement in ZLOFY?", 'The founder leads product vision and works hands-on with our scientific team on every formulation.'],
  ['Who is on the ZLOFY Scientific Advisory Board?', 'Our board brings together physicians, researchers and nutrition scientists from leading institutions.'],
  ['What are the main benefits of ZLOFY Daily Essentials?', 'Support for energy, digestion, sleep, focus and healthy aging — all in one serving.'],
  ['What does ZLOFY Daily Ultimate Essentials taste like?', 'A refreshing blend of açaí and mixed berries, with Lemon + Orange and Mango Passion Fruit also available.'],
  ['What countries do you currently ship to?', 'We ship across the United States with free shipping on every order. More countries coming soon.']
];
$('#faq').innerHTML = faqs.map((f, i) => `<div class="faq-item ${i === 0 ? 'on' : ''}"><button><span style="font-family:var(--serif)">${f[0]}</span><span>+</span></button><div>${f[1]}</div></div>`).join('');
$('#faq').addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.parentElement.classList.toggle('on'); });
