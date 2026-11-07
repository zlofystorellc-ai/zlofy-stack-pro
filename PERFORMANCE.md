# Performance

## Targets (mobile, no apps installed)
- Lighthouse Performance ≥ 90
- CLS < 0.05
- LCP < 2.5 s on simulated 4G
- Added CSS < 30 KB, added JS < 25 KB

## Status
**Lighthouse has not been run.** The page is Liquid, which only renders inside Shopify, so there is nothing to measure locally. The numbers below are static measurements of the files. Run the Lighthouse steps below on a development theme and paste the results here.

## Static measurements (`node scripts/check-theme.mjs`)

| Asset | Raw | Whitespace/comments stripped | gzip (what is transferred) | Budget |
|---|---|---|---|---|
| All `ap-*` CSS (`ap-base.css` + every section's `{% stylesheet %}`) | 22.8 KB | 21.7 KB | 5.1 KB | < 30 KB |
| All `ap-*` JS (5 modules) | 20.4 KB | 16.5 KB | 6.8 KB | < 25 KB |

These are totals **if every section is on the page**. Section CSS is only loaded for sections that are present, and each JS module is only requested by the section that needs it:

| Module | Loaded by |
|---|---|
| `ap-cart.js`, `ap-product.js` | Product form |
| `ap-sticky.js` | Sticky add to cart |
| `ap-announcement.js` | Announcement bar |
| `ap-upsell.js` | Complete your routine |

The files are not minified in the repo (readable for the team). If you want a minified build, add a step; the minified-and-gzipped size will be smaller than the figures above.

## Design decisions that protect the budget
- No jQuery, no libraries, no web fonts (system font stack), no icon font (inline SVG), no third-party scripts.
- ES modules (`type="module"`) are deferred by default, so nothing blocks rendering.
- LCP image: the first gallery image is `loading="eager"`, `fetchpriority="high"` and uses `image_tag`'s `preload: true`. Every other image is `loading="lazy"` with `srcset`, `sizes`, and `width`/`height` (set by `image_tag`) so layout does not shift. Gallery slides have a fixed `aspect-ratio`.
- The sticky bar is `position: fixed`, so it cannot shift layout. The cart drawer is `position: fixed` and hidden.
- Videos use `preload="none"` (no bytes until play) and never autoplay.
- Cart upsell and recommendations are fetched after load and never block render; the fallback is server-rendered.

## How to measure
1. `shopify theme dev --store <your-store>.myshopify.com` (needs a login to your store), or push the branch to a development theme.
2. Open a product that uses the `product.acne-duo` template, with real images.
3. Run Lighthouse (Chrome DevTools → Lighthouse → Mobile, "Navigation", throttling = Simulated Slow 4G) in a **private window with extensions off**, or:
   ```bash
   npx lighthouse "https://<store>/products/<handle>?preview_theme_id=<id>" --form-factor=mobile --only-categories=performance --output=html --output-path=./lighthouse.html
   ```
4. Run it three times and record the median. Also run it **with** your reviews and subscriptions apps installed; those apps' scripts are outside this theme's budget and will lower the score.

## Results
| Date | URL | Performance | LCP | CLS | Notes |
|---|---|---|---|---|---|
| _not measured yet_ | | | | | |
