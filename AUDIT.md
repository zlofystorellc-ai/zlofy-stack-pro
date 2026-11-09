# AUDIT (single-product landing, 2026-11-09)

Branch `ap-landing-p0-3`. Written before any code for this phase. Earlier audit of the original static prototype: `docs/AUDIT-prototype.md`.

## 1. Inventory

| Area | Finding |
|---|---|
| Theme family | Custom Online Store 2.0 theme (sections + JSON templates + section group). **Not** Horizon/theme-blocks, **not** Dawn. All sections are `ap-*`. |
| Layout | `layout/theme.liquid` (minimal shell: tokens, header, `{{ content_for_layout }}`, footer snippet). |
| Templates | `templates/index.json` (a multi-section home page from the previous phase), `templates/product.acne-duo.json`. No `cart`, `collection`, `search`, `list-collections`, `page` templates yet. |
| Sections (30) | buy box (`ap-hero`), kit contents, day vs night, how to use, ingredients, before/after, video cards, reviews, FAQ (two), guarantee, comparison, upsell, sticky ATC, announcement, plus home-only sections. |
| Snippets | header, logo, footer, cart drawer, icons, tokens, product JSON-LD, quick add, disclosure. |
| Assets | `ap-base.css`, 10 small vanilla ES modules, 3 self-hosted woff2 fonts, favicon. No jQuery, no framework. |
| Locales | `locales/en.default.json` only (no `en.default.schema.json`: schema labels are plain English). |
| Config | `settings_schema.json` (brand, colors, logo, shipping note, support email, social). |
| App embeds / app blocks | None. Reviews are read from `reviews.*` metafields only (no seeded reviews). |

## 2. Baseline checks

- `shopify theme check`: **0 offenses** at the start of this phase.
- Project checks (`npm run check`): claims lint clean, contrast 39/39, structure OK.
- JS weight (gzip): announcement 1.0 KB, before/after 0.4, cart 3.7, header 0.6, motion 2.1, product 3.1, sticky 0.7, tabs 0.7, upsell 0.4, video cards 0.7 = **13.5 KB total** (budget 40 KB).
- CSS weight (gzip): `ap-base.css` 4.2 KB + section `{% stylesheet %}` blocks ≈ 10 KB = **≈ 14 KB** (budget 60 KB).
- Fonts: two families, self-hosted (heading serif + body sans), `font-display: swap`.

## 3. Keep / change / remove

**Keep (already good):** product form logic (`ap-hero` + `ap-product.js`: variant cards, selling plans, live price, price per patch, URL `?variant=` via `replaceState`, aria-live price, gallery with video support), cart drawer module (`ap-cart.js`: focus trap, Esc, bundled free-shipping bar, one upsell), claims lint, contrast script, `check-theme`, preview server, image helpers (`image_url`/`image_tag` with srcset), motion helpers that respect `prefers-reduced-motion`.

**Change in this phase (P0-P3):**
- Buy box becomes the landing buy box: fieldset "Choose your pack", offer cards with contents / price per patch / savings, no quantity selector, accelerated checkout, delivery **date range**, one guarantee line.
- Palette to the brief (ink, teal, lilac, sand, apricot) with a day / night theme; primary button apricot with ink text; teal only for icons, borders and large text (a deeper teal is used where text needs AA).
- Minimal header (logo, theme toggle, cart, three anchors on desktop).
- Templates: `index.json` is the landing page, `product.json` renders the same sections, collection / search / list-collections / add-on product templates route to `/`, minimal no-JS cart.
- Hero product binding via `settings.hero_product`; canonical points to `/` for the hero product.

**Remove from the default templates (files stay for reuse):** the previous multi-section home page and the extra marketing sections that are not in the brief (home banner, home products, day / night panels, newsletter, problem timeline, comparison, ingredients, video cards, before/after).

## 4. Risks

1. **Palette vs earlier direction:** the project earlier moved from green to blush red; this brief re-introduces teal, and the merchant confirmed it. Old blush colours remain only in unused legacy sections.
2. **Night theme coverage:** dark mode is done by remapping tokens. Sections that still contain hard-coded light hex values will look wrong in night mode; every section on the landing page is checked in both themes, legacy ones are not.
3. **Redirects:** Shopify URL redirects cannot override live `/products` or `/collections` URLs, so collection / search / add-on pages use a theme-level `route-home` section (meta noindex, JS `location.replace('/')`, visible no-JS link).
4. **Real-device testing:** Xcode is not installed on the dev Mac, so real iPhone Safari and the iOS Simulator cannot be used; only viewport emulation is available.
5. **Not verified on a real store:** selling plans, metafield types (rich text, money), accelerated checkout buttons and bundled section rendering behave differently in Shopify than in the local preview mock.

## 5. Decision

Keep the existing custom OS 2.0 section architecture and extend it. Rationale: it is healthy (0 theme-check offenses, ≈ 14 KB JS), already implements most of the buy box, and migrating to a Horizon-style `/blocks` architecture would add risk and weight without helping a single-product store. The brief's section names are kept as the visible section names; files keep the `ap-` prefix.
