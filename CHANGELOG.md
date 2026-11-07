# Changelog

## 0.1.0 — 2026-11-07 — Acne Duo product page (branch `shopify-acne-duo-theme`)

Nothing existing was changed or deleted. `index.html`, `style.css`, `script.js` and `.gitignore` are untouched.

### Added — documentation
- `AUDIT.md` — audit of the existing static prototype, problems found, keep / refactor / replace decision per file, assumptions
- `README.md` — setup (metafields, images, subscriptions, reviews, template assignment), checks, SEO and compliance notes, self-check
- `PERFORMANCE.md` — budgets, static size measurements, how to run Lighthouse (results not yet measured)
- `CHANGELOG.md` — this file
- `package.json` — npm script aliases only; no dependencies

### Added — theme shell
- `layout/theme.liquid` — minimal OS 2.0 layout (skip link, head, header group, header, footer)
- `config/settings_schema.json`, `config/settings_data.json` — brand, palette tokens, purchase and cart, claims and certifications
- `locales/en.default.json` — all UI strings (`ap.*`)
- `templates/product.acne-duo.json` — new product template (generated from section presets)
- `sections/header-group.json` — header group with the announcement bar (generated)

### Added — sections (`sections/`)
- `ap-announcement.liquid` — rotating messages, pause / play, reduced-motion aware
- `ap-hero.liquid` — product form: swipe gallery, real rating (reviews metafields only), bullets, variant cards, one-time vs subscribe (selling plans), price per patch, quantity, AJAX add to cart, shipping note, guarantee badge, payment icons, label / warnings block
- `ap-trust-strip.liquid` — drug-free badge, vegan / cruelty-free only when documented, US support contact
- `ap-problem.liquid` — empathetic problem section
- `ap-how-it-works.liquid` — 4 steps and the honest scope note
- `ap-day-night.liquid` — day vs night table (blocks or `custom.day_night_specs`)
- `ap-size-guide.liquid` — visual size chart (rounded squares), editable sizes
- `ap-shade-proof.liquid` — real wear photos, hidden below 3 photos
- `ap-comparison.liquid` — brand vs typical single-type patches, no competitor names, automatic price-per-patch row
- `ap-bundles.liquid` — bundle cards, savings shown only when real
- `ap-reviews.liquid` — app-block slot and optional customer video grid (captions track, no autoplay); no sample reviews
- `ap-faq.liquid` — `<details>` accordion plus FAQPage JSON-LD
- `ap-guarantee.liquid` — editable guarantee (placeholder wording)
- `ap-upsell.liquid` — product recommendations (complementary) with collection fallback
- `ap-sticky-atc.liquid` — sticky add-to-cart bar (IntersectionObserver)

### Added — snippets (`snippets/`)
- `ap-tokens.liquid` (design tokens + base stylesheet), `ap-icon.liquid` (original inline SVG icons), `ap-header.liquid`, `ap-footer.liquid`, `ap-cart-drawer.liquid` (drawer, free-shipping bar, i18n), `ap-product-jsonld.liquid` (Product + BreadcrumbList), `ap-quick-add.liquid`, `ap-disclosure.liquid` ("Some creators received free product.")

### Added — assets (`assets/`)
- `ap-base.css` — shared layout, buttons, focus ring, header / footer, cart drawer
- `ap-product.js` — variants, plans, prices, quantity, gallery sync, add to cart
- `ap-cart.js` — cart drawer, free-shipping bar, one upsell, quick add
- `ap-sticky.js`, `ap-announcement.js`, `ap-upsell.js`

### Added — scripts (`scripts/`)
- `claims-lint.mjs` — forbidden claims and competitor names (file:line output, non-zero exit)
- `contrast-check.mjs` — WCAG contrast for every colour pair
- `check-theme.mjs` — JSON, schemas, Liquid tag balance, locale keys, assets, size budgets
- `build-template.mjs` — generates the JSON template and header group from section presets

### Added — local preview (optional)
- `scripts/preview/server.mjs`, `mock.mjs`, `package.json` — renders the Liquid with mock data and a mock cart (liquidjs, dev only). Not Shopify's renderer
- Found and fixed with it: the Reviews section showed an empty heading when no reviews app was added (now hidden); the sticky bar covered the footer at the end of the page (now hides when the footer is visible); gallery image forced a square box on mobile (now a 5:4 box); several tap targets under 44 px (header brand, quantity input, card title links, contact links)

### Verification run for this release
- `shopify theme check`: 0 offenses (32 files)
- `claims-lint`: clean; `contrast-check`: 31 / 31 pass; `check-theme`: OK; all JS modules pass `node --check`
- Local mock preview: page renders; variant switch, subscribe pricing, add to bag, cart drawer, free-shipping bar, upsell and sticky bar exercised; checked at 375 / 390 px and about 800 px
- **Not run:** 360 / 768 / 1280 px, Lighthouse, real Shopify cart and selling plans (need a development store)
