# Acne Duo product page (Shopify OS 2.0)

An original, mobile-first product page for a **hydrocolloid pimple patch** brand (day + night patches).
Sections, snippets, assets and one JSON template: `templates/product.acne-duo.json`.

> The page **layout follows the earlier static prototype** (`index.html`, `style.css`, `script.js`, kept untouched as a reference): centered-logo header, slim trust strip, gallery + buy box with pills, plan cards and accordions, dark footer.
> The palette, fonts and every word of copy are new. The prototype's copy and claims must not be reused. See [AUDIT.md](AUDIT.md).

## What is in here

| Path | Purpose |
|---|---|
| `templates/product.acne-duo.json` | The new product template (generated, see "Regenerating the template") |
| `sections/ap-*.liquid` | 15 sections: announcement, hero (product form), trust strip, problem, how it works, day vs night, size guide, real wear photos, comparison, bundles, reviews, FAQ, guarantee, upsell, sticky add to cart |
| `sections/header-group.json` | Header group holding the announcement bar |
| `snippets/ap-*.liquid` | tokens, icons, header, footer, cart drawer, product JSON-LD, quick add, creator disclosure |
| `assets/ap-*.js` / `ap-base.css` | Vanilla ES modules and one small shared stylesheet (section CSS lives in each section) |
| `layout/theme.liquid`, `config/`, `locales/en.default.json` | Minimal OS 2.0 shell, settings, all UI strings |
| `scripts/` | `claims-lint`, `contrast-check`, `check-theme`, `build-template` (Node, no dependencies) |

## Setup

1. **Create the metafields** (Settings → Custom data → Products, and Variants for `patch_count`):

   | Namespace and key | Type | Where | Used for |
   |---|---|---|---|
   | `custom.patch_count` | Integer | Product **and** variant | Price per patch. The variant value wins; the product value is the fallback |
   | `custom.patch_sizes` | List of single line text | Product | "In this kit" line in the size guide |
   | `custom.day_night_specs` | JSON | Product | Optional. Shape: `{"rows":[{"label":"Finish","day":"…","night":"…"}]}`. If empty, the section's row blocks are used |
   | `custom.wear_time` | Single line text | Product | Wear-time line in the label box and the day vs night section |
   | `custom.material` | Multi-line text | Product | "Material" disclosure in the label box |
   | `custom.warnings` | Multi-line text | Product | Replaces the default warning text |
   | `custom.vegan_verified` | Boolean | Product | Vegan badge (also needs the theme setting) |
   | `custom.cruelty_free_verified` | Boolean | Product | Cruelty-free badge (also needs the theme setting) |

2. **Create the product options** so the value ladder works. One option (for example "Kit") with three values:
   `Day & Night Duo` (anchor) → `3-Month Stash` (best value) → `Refill Pouch`. Set `custom.patch_count` on each variant.
3. **Upload images and videos** in the theme editor (Product media, How it works, Real wear photos, Reviews videos, and the **Customer videos** under the accordions in the Product form: add "Customer video" blocks, each with a video, optional poster, caption and a .vtt captions URL).
   Upload only images you own or have licensed. No supplier or competitor photos. Before/after only from real, consenting customers, unedited.
4. **Subscriptions:** install a Shopify selling-plan app (Shopify Subscriptions, Recharge, Appstle, Seal…) and attach a selling-plan group to the product.
   The purchase options appear automatically. No plans = the block hides itself. Tick "Select Subscribe by default" in the Product form section if you want that.
5. **Reviews:** add your reviews app as an **app block** in the Reviews section. The star rating and `aggregateRating` JSON-LD appear only when the app writes `reviews.rating` and `reviews.rating_count`. No reviews = nothing is shown. There are no sample reviews.
6. **Theme settings** (Customize → Theme settings): brand name, product names, **support email** (shown as the adverse-event contact), palette, shipping note, free-shipping bar threshold, upsell fallback collection, and the vegan / cruelty-free documentation switches.
7. **Assign the template:** Products → your product → Theme template → `product.acne-duo`.
8. **Run the claims lint** (below) before publishing, and again after every copy edit.

### Merging into an existing theme
This repo includes a minimal `layout/theme.liquid` so it works standalone. If you copy the files into another OS 2.0 theme: keep that theme's own layout, add `{% render 'ap-tokens' %}` inside its `<head>`, copy `sections/ap-*`, `snippets/ap-*`, `assets/ap-*`, merge the `ap` block of `locales/en.default.json`, and merge the settings groups from `config/settings_schema.json`. The cart drawer is rendered by the Product form section, so the cart link in your theme's header can carry `data-ap-cart-toggle` to open it.

## Local preview (no Shopify store needed)

```bash
cd scripts/preview && npm install     # once (installs liquidjs only)
npm run preview                       # from the repo root, then open http://localhost:8766
```
Renders the real Liquid files with **fake product data** (`scripts/preview/mock.mjs`) and a mock cart, so you can see the layout, switch variants, try subscribe, add to bag and the sticky bar. Add `?design=1` to see the editor-only hints. It is an **approximation**: Shopify's renderer differs in details, so always do a final check on a development theme.

## Checks

```bash
node scripts/build-template.mjs   # regenerate templates/product.acne-duo.json + sections/header-group.json from the section presets
node scripts/claims-lint.mjs      # forbidden claims + competitor names (exit 1 on any hit, prints file:line)
node scripts/contrast-check.mjs   # WCAG contrast for every colour pair
node scripts/check-theme.mjs      # JSON validity, schemas, Liquid tag balance, locale keys, assets, size budgets
shopify theme check --path .      # Shopify's official Theme Check
```

### Regenerating the template
JSON templates must list their blocks explicitly (presets do not apply to them). To keep one source of truth, the default content lives in each section's `presets`, and `scripts/build-template.mjs` writes the template from them. Edit a section preset, then re-run the script.

### What the claims lint blocks
Cosmetic copy only. It fails on: treat / treats / treatment, cure, heal / healing, kills bacteria, prevents acne, anti-inflammatory, medical grade, FDA approved, clinically proven, dermatologist approved, guaranteed results, instant results, removes scars, and the names Mighty, Hero, Starface, Hydro-Star, Miracle Patch, "The Original" (plus close inflections). Matching is case-insensitive and whole-word, so code names like `ap-hero` are not flagged but visible text is. It scans `sections/`, `snippets/`, `templates/`, `locales/` (and `layout/`, `config/` as extra cover).

Allowed wording: "covers and protects blemishes", "absorbs fluid from surfaced spots", "helps flatten the look of a spot overnight", "keeps fingers off", "blends in", "drug-free hydrocolloid".

## SEO notes
- **Meta title / description:** set per product in Shopify (Edit website SEO). Lead with the product and format ("Day + night pimple patches"), keep the title under about 60 characters and the description under about 155. Describe what the product is; do not stuff keywords.
- **Never** use competitor trademarks as keywords, in alt text, in tags or in meta fields.
- **Image file names:** descriptive and plain, for example `day-and-night-pimple-patches-kit.jpg`, not `IMG_0042.jpg`. Write real alt text in the media editor.
- JSON-LD: `Product` (+ `aggregateRating` only from real review data), `BreadcrumbList`, and `FAQPage` generated from the FAQ blocks.

## Compliance reminders (not legal advice)
- Keep claims cosmetic. A product that claims to treat or prevent acne can be regulated as a drug.
- US cosmetic labels need contact information for adverse events (MoCRA). The page shows the support email you set; make sure the email is monitored and your own reporting process exists.
- Subscription, shipping, free-shipping and guarantee text are **placeholders**: they must match what you actually do.
- The defaults in Day vs night, Size guide and FAQ are **examples**: edit them to match the real product.

## Self-check

Verified automatically in this repo (re-run the commands above to confirm):

- [x] No competitor names or trade dress in customer-facing files (claims lint clean; the palette is a soft blush red + navy ink + sand/lilac (chosen by the owner), with no red/white circle motif, no star-shaped patches, no maroon-to-orange gradient; icons are original inline SVG)
- [x] No supplier or competitor images (the repo contains no images; every image is a merchant upload slot with the licensing note)
- [x] No forbidden claims (`claims-lint` passes: 29 files, 33 terms)
- [x] No hard-coded reviews, ratings or counters (rating and `aggregateRating` come from app metafields only)
- [x] WCAG 2.2 AA contrast for every colour pair used (`contrast-check`: 34/34 pass)
- [x] Shopify Theme Check: 0 offenses; Liquid tag balance, locale keys and assets verified
- [x] Added CSS and JS inside budget: CSS about 5 KB gzip (22.8 KB raw), JS about 7 KB gzip (20.4 KB raw), measured by `check-theme`

**Not yet verified — needs a development store** (Liquid cannot be rendered locally without Shopify):

- [ ] Mobile layout at 360 / 768 / 1280 px. Looked at 375 and 390 px (no horizontal overflow; add-to-cart reachable after about 1.3 screens) and roughly 800 px, in the **local mock preview** only, not on Shopify
- [ ] Lighthouse mobile Performance ≥ 90, CLS < 0.05, LCP < 2.5 s (see [PERFORMANCE.md](PERFORMANCE.md))
- [ ] Add to cart, selling plans, cart drawer and sticky bar against real products. They work against the mock cart in the local preview (variant switch, subscribe price, drawer, free-shipping bar, sticky bar), which is not Shopify's cart
- [ ] Screen-reader and keyboard pass (focus order, drawer focus trap, announcement pause button)

## Notes on repo layout
`AUDIT.md`, `CHANGELOG.md`, `PERFORMANCE.md`, `README.md`, `package.json`, `scripts/` and the legacy `index.html` / `style.css` / `script.js` are not Shopify theme files. When you connect the repo to Shopify (Online Store → Themes → Add theme → Connect from GitHub), confirm on first sync that Shopify ignores them; if it complains, move them into a subfolder or a separate branch.
