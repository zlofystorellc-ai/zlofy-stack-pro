# AUDIT — existing template

Audited: 2026-11-07, branch `shopify-acne-duo-theme`, before any new file was added.

## 1. Repo tree (before this work)

```
.gitignore
index.html     (309 lines)
style.css      (371 lines)
script.js      (233 lines)
```

## 2. Theme structure

**None.** The repo is a static HTML/CSS/JS prototype, not a Shopify theme. There is no
`/layout`, `/templates` (no `product*.json` / `product*.liquid`), `/sections`, `/snippets`,
`/config` (`settings_schema.json`, `settings_data.json`) or `/locales`. It cannot be imported
by Shopify's GitHub integration as a theme in its current shape.

## 3. What exists

| Area | Finding |
|---|---|
| Page flow | Announcement bar → header → trust strip → 2-column product block (gallery left, buy box right) → sticky bar → press ticker → social carousel → reviews → ingredient table → body-support chips → longevity cards → "clinical" stats → founder note → advisory board → testimonials → guarantee → FAQ → footer |
| Sections (HTML `<section>`) | trial, program, videos, social, reviews, spectrum, body-support, longevity, cnu, note, sab, trusted, guarantee, faq |
| Settings / blocks | None (everything hard-coded in HTML, or in JS arrays) |
| Apps / app blocks | None |
| JS | One vanilla `script.js`, no jQuery, no libraries. Builds gallery, flavours, plans, reviews, FAQ, tables and carousels **by injecting HTML strings at runtime** |
| CSS | One `style.css`, 2 media queries only |
| Third party | Google Fonts (Inter + Newsreader) via `<link>` |
| Images | None. Product art is inline SVG drawn in JS; people/ambassadors are letter placeholders |

## 4. Problems

### Performance
- Two Google Font families loaded via render-blocking stylesheet link (plus 2 preconnects).
- Almost all content (reviews, FAQ, spec table, advisors, quotes, gallery) is created by JS after load → large layout shift, nothing indexable without JS.
- No responsive images (no `srcset`, no `width/height`, no LCP strategy) — there are no real images yet.
- One 371-line CSS and one 233-line JS shipped for the whole page regardless of what is shown (not section-scoped).

### Accessibility
- No `:focus-visible` styles at all (0 focus rules in `style.css`).
- Clickable `<div>`s (`.thumb`, `.fl` flavours, `.vid`, `.plan` labels without inputs) are not keyboard-operable and have no roles.
- Variant/plan pickers are not radio inputs; no `aria-checked`, no group labels.
- FAQ and accordion toggles are `<button>`s without `aria-expanded`.
- Video modal has no `role="dialog"`, no focus trap, no focus return.
- Star ratings are text glyphs with no accessible name; emoji used as icons without labels.
- `alt` attributes: 0 in `index.html`; gallery images set `alt=""` in JS.
- Heading order skips levels (`h1` → `h3`/`h4` inside cards, `h2` for sections without landmarks).
- Contrast not verified; gold-on-maroon and light-on-gradient banners are likely to fail AA at small sizes.
- Auto-animating count-up numbers and an auto-scrolling ticker with no pause and no `prefers-reduced-motion` handling.

### SEO
- No JSON-LD (Product, FAQPage, BreadcrumbList).
- Meta description exists but is generic; no canonical, no Open Graph.
- FAQ/review content is JS-injected, so it is invisible to non-rendering crawlers.

### Mobile UX
- Header uses fixed `padding: 0 118px` and a 3-column grid; only 2 breakpoints; header links wrap and break at ≤ 800 px (seen in the preview at 800 px).
- Buy box has many stacked boxes before the CTA; CTA is far below the first screen.
- Tap targets under 44 px on several controls (`.fl`, thumbnails on small screens).

### Conversion gaps
- Purchase options are not wired to anything (no cart, no selling plans, no variant logic).
- No price-per-unit logic, no quantity control, no stock/sold-out states, no error states.
- No cart drawer, no free-shipping progress, no upsell.
- Sticky bar appears at a fixed 520 px scroll instead of when the real CTA leaves the viewport.

### Compliance / IP risk (highest priority)
- **Resemblance to another brand's page.** Structure, section order and wording closely track a well-known supplement-subscription brand's product page ("Welcome Kit" gift-with-subscription, "Tested for Sport", "Clinicians' Choice" badge, quarterly package, "Transformation Program", "replace 20+ supplements", advisory-board grid, ambassador carousel, "Risk-Free" guarantee). This is a trade-dress / copy risk and must be rewritten, not paraphrased.
- **Unsubstantiated claims shipped as copy:** "871 clinicians share this without compensation", "95% felt a boost…", "12-week randomized controlled trial", "Clinically Proven", "WADA compliant", "Lab-verified — 63 substances screened", "Replaces $4,000+/year", "72M+ servings", "1M+ purchases", "700,000+ customers", "4.8 from 22,104 reviews". All are placeholders with no source.
- **Fake / unsourced social proof:** ambassadors, "Chief Medical Officer" advisors, fabricated review text with "Verified Buyer" labels.
- **Disease-style / health claims:** "Healthy aging", "targets all 12 hallmarks of aging", "supports 9 organ systems".
- **Urgency:** "OCTOBER WELCOME OFFER – SAVE 30%" with no end date or mechanism (stale and potentially misleading).
- **Brand name** hard-coded in many places (`Z·L·O·F·Y`, "ZLOFY Stack").
- Images: none used (good), but the page structure expects supplier/ambassador photos.

## 5. Decisions per file

| File | Decision | Why |
|---|---|---|
| `index.html` | **Keep, untouched** — legacy static prototype / design reference only | Not a Shopify file; must not be edited so the old look is not lost. Not part of the theme. Do not assign to a product |
| `style.css` | **Keep, untouched** | Same as above. Only the *ideas* (layout skeleton, spacing rhythm) are reused |
| `script.js` | **Keep, untouched** | Runtime HTML injection is the opposite of what OS 2.0 needs; replaced by server-rendered Liquid + small modules |
| `.gitignore` | **Keep** | — |
| `layout/theme.liquid`, `config/*`, `locales/*`, `templates/product.acne-duo.json`, `sections/*`, `snippets/*`, `assets/*` | **New** (prefix `ap-` where the name could clash) | See `CHANGELOG.md` |

### Patterns reused from the old page (re-implemented, not copied)
- Page skeleton: announcement → header → trust strip → 2-column product block → sticky buy bar → accordions → FAQ → guarantee.
- Gallery-left / buy-box-right desktop layout, single column on mobile.
- Accordion pattern for FAQ (now native `<details>`/`<summary>`).
- Spacing rhythm: generous vertical padding, rounded cards, one strong CTA.

### Not reused
- All copy, all numbers, all labels, gradients, the red/maroon palette, serif/sans pairing via Google Fonts, the "welcome kit/quarterly/ambassador/advisory board" mechanics.

## 6. Assumptions (no questions were asked)

1. Product: a hydrocolloid pimple patch sold as cosmetic skin-covering patches (US store, USD). Not a drug, no active ingredient claims.
2. The brand name, support email and product names are **placeholders** (`BRAND_NAME`, `Day Patch`, `Night Patch`, `SUPPORT_EMAIL`) set in theme settings.
3. The merchant will use Shopify Online Store 2.0 and a reviews app that writes the standard `reviews.rating` / `reviews.rating_count` product metafields (Shopify Product Reviews, Judge.me, Okendo, Yotpo and others do).
4. Subscriptions use Shopify **selling plans** from a subscriptions app. If the product has none, the purchase-option UI hides itself.
5. Because the repo has no existing theme, this work ships a **minimal standalone OS 2.0 shell** (`layout/theme.liquid`, header/footer, settings). If the files are merged into an existing theme, keep that theme's own `layout/theme.liquid` and copy only the `ap-*` files, `config` entries and locale keys (see README).
6. No real photos exist yet. Every image slot is an `image_picker` with a neutral placeholder.
7. The sizes in the size guide (8 / 10 / 12 mm + XL body strip) are **example defaults**; the merchant must set the sizes of their actual product.
8. The guarantee length ("30-day happiness promise") is a **placeholder** that must match the real return policy.
9. Local rendering is not possible without a Shopify store (Liquid needs Shopify's renderer). Static checks run locally; visual QA and Lighthouse must be run on a development theme (see `PERFORMANCE.md`).
