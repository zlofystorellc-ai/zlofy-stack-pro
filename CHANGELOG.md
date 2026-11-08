# Changelog

## 0.5.2
- New section `ap-faq-split` ("FAQ with image"): blush-red FAQ panel on the left, empty image space on the right (upload later in the Image setting). Placed above the footer. No JSON-LD (main FAQ already has it).

## 0.5.1 — 2026-11-07 — Ingredients section

- New `ap-ingredients`: intro, ingredient cards (plain-language materials), a "Full ingredient list" disclosure and small print. Anchor `#ingredients`.
- Full list comes from product metafield `custom.ingredients`, else the section setting. All defaults are placeholders: replace them with your real formula and match the pack label.
- Placed after the feature cards in the template

## 0.5.0 — 2026-11-07 — Three more template sections

Same page structure as the reference (section types and order), own content:
- `ap-marquee` ("Facts band"): slim dark band of short product facts, static (no motion)
- `ap-stats-strip` ("Big numbers"): large-number tiles. Defaults are product facts (patch count, types, sizes, wear time), clearly marked as examples.
- `ap-feature-cards` ("Feature cards"): four icon cards (covers, protects, day, night)
- Template order: ... product form, **Facts band**, **Big numbers**, Problem, How it works, **Feature cards**, Day vs night ...
- Not added on purpose: survey/"clinical" percentages, celebrity or expert blocks, press logos, certification badges (add real ones later)

## 0.4.0 — 2026-11-07 — Clean sans typography, more air

- Headings switch from serif to the same clean system sans as the body: weight 500, tight tracking (-0.02em), line-height 1.12
- Product title up to 3.25rem on desktop (34 px on phones), lead 1.125rem / 1.55, price 2rem
- Benefit pills 10 × 16 px padding, weight 500; option labels 0.75rem uppercase with wider tracking; hairline dividers under pills and each option group
- Nav 1.0625rem / 500 with wider gaps; section titles up to 3rem; body line-height 1.6
- No layout or colour changes; contrast unchanged (34/34)

## 0.3.3 — 2026-11-07 — Logo: wordmark with a patch "O"

- `snippets/ap-logo.liquid`: ZL + a round patch as the O + FY. The O is drawn as a hydrocolloid patch (solid disc, soft inner ring, clear centre), so the logo shows the product. Letters are real text; screen readers get the brand name.
- Only the exact name "ZLOFY" gets the patch O; any other brand name falls back to plain text. Uploading a logo image in Theme settings still replaces it.

## 0.3.2 — 2026-11-07 — Cream backgrounds now blush-tinted

- Sand/cream backgrounds `#F4EDE4` → blush cream `#FBEBED`; borders `#D8CDBF` → `#EBCDD2`; Day/night cell tints and the comparison highlight follow
- Setting label "Sand (backgrounds)" is now "Blush cream (backgrounds)" (same setting id `color_sand`, so saved values stay)
- Contrast: still 34/34 pairs pass

## 0.3.1 — 2026-11-07 — Blush red replaces green

- Every teal/green token is now blush red: `--ap-blush` (#E5707F, icons and large shapes only) and `--ap-blush-deep` (#B3384B, text, links, buttons; white on it is 5.9:1). Settings renamed to `color_blush` / `color_blush_deep`.
- Comparison tint, announcement gradient, logo mark and preview mock images follow the new colour
- Contrast check: still 34/34 pairs pass
- Note: if you saved custom colours in the theme editor under the old teal settings, they are ignored; re-pick them under "Blush red".

## 0.3.0 — 2026-11-07 — Header like the reference, ZLOFY logo

- Announcement bar: gradient, optional second line per message, optional **countdown** (only with a real end date; hides itself when it passes), country/currency picker (only when the store sells in more than one country)
- Header: links with sub-links become dropdowns (keyboard + Escape), account icon, mobile menu button with a collapsible menu
- New original **ZLOFY logo** (`snippets/ap-logo.liquid`): rounded patch-shaped mark with a Z and a dot, plus the brand name as real text. Uploading a logo image in Theme settings replaces it.
- Brand name default is now ZLOFY (was BRAND_NAME)
- Preview: mock menu with sub-links, a fake countdown (preview only), `localization` form handled

## 0.2.1 — 2026-11-07 — Buy box layout like the reference screenshot

- Product form: soft gradient band behind the product, divider between gallery and buy box (desktop), uppercase option labels, bigger gallery thumbnails (88 px on desktop)
- Kit chooser: **round swatches** using each variant's image (setting `option_style`: swatches or cards; swatches apply to single-option products)
- Subscribe card: corner tag (setting `plan_badge`, default "Best value"; empty hides it). Keep it only if Subscribe really is the best price.
- Sticky bar: button now shows the live price (follows Subscribe or one-time)
- Deliberately not copied: countdown timer, "clinicians' choice" style badges, press logos (unverifiable or time-pressure claims)

## 0.2.0 — 2026-11-07 — Gifts, "Which patch, when" tabs, founder note

Page structure inspired by a long-form supplement product page (section order only; no names, images, claims or copy reused):
- Product form: new **Welcome gift** blocks (max 3), shown under the Subscribe card; `gifts_heading` setting. List only gifts you really ship.
- New section `ap-when-tabs` ("Which patch, when") with `assets/ap-tabs.js`: accessible tabs (arrow keys, Home/End); all panels visible without JavaScript.
- New section `ap-founder-note`: renders nothing until you write a note; photo optional.
- Template order: ... Day vs night, **Which patch, when**, Size guide ... FAQ, **Founder note**, Guarantee ...
- Deliberately NOT added: celebrity/athlete/expert endorsements, "clinically proven" or percentage results, press logos, countdown timers.

## 0.1.1 — 2026-11-07 — Layout like the earlier prototype (new palette, original copy)

Same page flow and buy-box structure as the old static page, rebuilt with the theme's own palette and copy (nothing copied):
- Header: centered logo, menu split left / right, cart at the far right (logo left on small screens)
- Slim trust strip directly under the header (template order: trust strip, then product)
- Product block: rating row, eyebrow chip, title, intro line (`lead` setting), price, benefit **pills**, kit cards, **plan cards** (radio dot, savings badge, price; Subscribe card expands with perks and delivery frequency), add to bag, then **accordions** under the buy box
- Dark centered footer
- New Product form blocks: `plan_perk` (Subscribe perks) and `accordion`; new `lead` setting
- Subscribe card now always shows the subscription price and "Save X%" when a selling plan covers the variant
- Contrast check extended to 34 pairs (footer, pills): all pass
- Not carried over on purpose: maroon / red palette and gradient bar, welcome-kit and quarterly mechanics, press ticker, social carousel, advisory board, all unsourced claims
- **Customer videos** under "Shipping and returns": new `video` blocks in the Product form (merchant-uploaded video, poster, caption, captions file; swipeable row; never autoplay; hidden when empty; creator disclosure shown). The local preview shows 3 fake poster-only videos so the layout is visible
- The sticky add-to-cart stays a bottom bar on every screen (the old page used a top bar) because it works better on phones

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
- `claims-lint`: clean; `contrast-check`: 34 / 34 pass; `check-theme`: OK; all JS modules pass `node --check`
- Local mock preview: page renders; variant switch, subscribe pricing, add to bag, cart drawer, free-shipping bar, upsell and sticky bar exercised; checked at 375 / 390 px and about 800 px
- **Not run:** 360 / 768 / 1280 px, Lighthouse, real Shopify cart and selling plans (need a development store)
