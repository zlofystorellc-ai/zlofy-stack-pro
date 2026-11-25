# Changelog

## 2.13.1
- Product page: the "1. Kit" cards (the four formula / kit cards) are removed from the buy box. New setting "Show the kit / formula cards (variant choice)" in the product section, off by default. While it is off, the product's first variant stays selected and Add to bag works as before; the step numbering now starts at "1. Purchase options". Turn the setting on if you add more variants that customers should choose from.

## 2.13.0
- Phone layout reworked to feel like a shopping app. Checked at 375 to 390 px wide: no sideways scrolling and no overlaps. The product page is about 17 percent shorter (18,200 px to about 15,100 px) and the home page about 25 percent shorter (about 13,400 px).
  - Top: the announcement bar is one or two short lines (the pill is hidden), the trust line under the header is one swipeable row, and the offer banner is slimmer.
  - Buy box: photo tabs are one swipeable row of small tiles, formula cards are a one-column list, the question chips and benefit pills are swipeable rows, and the buy button stays easy to reach.
  - "A spot's day" and "How a patch looks" are swipe cards (instead of long vertical stacks). Day and Night cards, video cards, globe, FAQ and footer have tighter spacing.
  - Overlaps fixed: the "Still have a question" card no longer covers the FAQ video; floating dots over text are hidden on phones; the "How it works" orb label stays inside the screen.
  - Tap targets are at least 40 to 44 px.
- The CSS size check now allows 36 KB (was 30 KB), because the sections added since then need it; it counts every section as if all were on one page.

## 2.12.0
- New contact form page: section `Contact form` and template `page.contact`. Visitors fill in name, email, an optional order number and a message, and Shopify sends it to the store email, so it works even when the visitor's device has no email app. Under the form there is the support email (mailto) and a "Write in Gmail" link. Where the support email used to be the only way to reach you, there is now also a "send a message" link: in the product page "Good to know" note, the footer care card, the footer Contact us link and the FAQ card (the FAQ card now opens the contact page). The address is Theme settings > Support email > Contact page address (default /pages/contact); create a page called Contact in Shopify admin with the page.contact template. Removed old unused footer and payment CSS to stay under the 30 KB CSS budget (now 29.9 KB).

## 2.11.1
- Footer colour now uses the site's own ink colour (the same oxblood as the buttons, banners and headings, `--ap-ink`, #3B0A14) instead of a separate darker brown, so it follows Theme settings > Colors. The US delivery globe and Video cards bands use the same ink colour (fading to a slightly warmer oxblood), so the dark bands on the page now match each other.

## 2.11.0
- "Video cards" section redesigned as a filmstrip: deep oxblood background with slow colour glows, tall rounded cards with a number and a "Demonstration" tag, the middle card grows and plays by itself (muted, looping, with a thin progress line), the others dim; tap any card to play or pause, arrows, dots and the arrow keys move along, cards tilt toward the mouse on laptops, and the stats sit in glass tiles. It now uses the theme's own demonstration clips (press-wait-peel, spot then close-up, patch close-up, patch cutaway), which are AI-generated and labelled, so nothing is called a customer. The "Real routines" pill, "First name / Customer" cards and the "6-8 hours per patch" stat are gone; stats are now 2 patch types, 1 kit for day and night, 30-day guarantee. Your own video or photo still works on any card. Nothing autoplays for visitors who prefer reduced motion.

## 2.10.2
- Header "Shop" link now opens the product page instead of the all-products list. Theme settings > Header links > Link 1 address is the word `product`, which means the first product in the store (works on the desktop menu and the phone menu); typing any address there still works.

## 2.10.1
- The "Find a store" button is removed from the US delivery globe section (the second button is now empty by default and stays hidden). The Store locator page template is kept for later.

## 2.10.0
- New "Find a store" page: section `Store locator` (`sections/ap-store-locator.liquid`, `assets/ap-locator.js`) and template `page.find-us`. It has a search box (zip, city, state or name), filter chips, a list of places and a map of the lower 48 states (real outline from Natural Earth, Albers projection, made by `scripts/gen-us-outline.mjs`) with a pin per place. The list comes ONLY from "Place" blocks you add (name, type, address, zip, latitude, longitude, website). With no places it honestly says Zlofy is sold online for now and offers a Shop button; no store or hospital is invented. The US delivery globe now has a second button, "Find a store", linking to /pages/find-us (create a page called Find us in Shopify admin with the page.find-us template).

## 2.9.1
- US delivery globe now shows the whole real world map: land is drawn from Natural Earth 1:110m country outlines (public domain), reduced to dots (about 3,000), with the United States, Alaska and Hawaii highlighted in white and a few softly twinkling dots. It starts facing the US and turns slowly on its own so every continent comes into view; drag or arrow keys spin it. Reduced motion keeps it still until dragged. The data is made by `scripts/gen-globe-data.mjs` and sits inside `assets/ap-globe.js` (8 KB). The hint now reads "Drag to spin the globe."

## 2.9.0
- New section "US delivery globe" (`sections/ap-us-globe.liquid`, `assets/ap-globe.js`, 8 KB): a dotted globe you can drag or spin with the arrow keys, centred on the United States with a few softly twinkling dots, beside a short heading, two points and a button, on a deep oxblood background like the footer. Placed on the product page just above Reviews. Wording is deliberately factual and editable: "Delivered across the United States.", "Ships in 3 to 5 business days", "A tracking email when your order ships", "Shop the kit". The reference's invented numbers (providers, locations) and "recommended by professionals" were not used. The map is an illustration (hint says so). It idles with a gentle sway and eases back to the US; reduced motion draws it once and only moves when dragged. Pauses when off screen.

## 2.8.7
- The support email in the product page "Good to know" note is now a clickable link (opens a new email to the support address). Every place the email shows (note, top trust line, FAQ card, footer card and footer Contact link) is a mailto link.

## 2.8.6
- Support email set to contact@zlofy.com (Theme settings > Support email default). It now shows in the "Good to know" note, the top trust line, the footer's customer care card and the footer Contact link. The placeholder SUPPORT_EMAIL is gone.

## 2.8.5
- Product page "Good to know" note and the accordions under it made compact and tidier: a small uppercase title with an icon, a thin rose accent line, smaller text, the wear time as a small pill, a one-line contact, and tighter gaps (12 px to the accordions, shorter accordion rows). The note is about 25 percent shorter.

## 2.8.4
- Product page: the "Customer videos" row under the accordions is gone from the preview (it was fed by placeholder videos). The starting product template never contained customer videos. The option to add real customer videos in the product section is kept but stays hidden until a video is added in the theme editor.

## 2.8.3
- Product page intro under the title replaced with: "Wear the 0.15 mm ultra-thin matte Day patch to school or work. Switch to the 0.35 mm cushioned Night patch before bed. One kit engineered for every stage of a surfaced spot." The two sizes (0.15 mm and 0.35 mm) come from the owner and must match the real patches.

## 2.8.2
- Product page title ("Day & Night Pimple Patches") now stays on one line on laptops: the size scales with the screen from 28 px up to 40 px. Phones still wrap it if needed.

## 2.8.1
- Product page top section made smaller on laptops: the frame is 1120 px wide (was up to 1440 px), so each column is about 520 px instead of 676 px, with a 48 px gap. Same proportions: square photo card, tall photo tabs (about 121 x 145 px), kit cards in rows.

## 2.8.0
- Product page top section: proportions set like the reference on laptops. The frame is wider (up to 1440 px), the photo column and the buy column are equal width with a 56 px gap and no divider line, the photo card is a square, the photo tabs are tall tiles with a large preview (about 160 x 185 px), and the kit cards sit three to a row. Phones and tablets are unchanged.

## 2.7.3
- Product page: the "Complete your routine" section (Add to your routine) is removed from the starting template. Its file (`sections/ap-upsell.liquid`) is kept. The bag drawer's own suggestions are not changed.

## 2.7.2
- Product page: the "Every patch in the box" section (Your kit) is removed from the starting template. Its file (`sections/ap-kit-contents.liquid`) is kept, so it can be added back from the theme editor if wanted.

## 2.7.1
- Real ingredient list added: Cellulose Gum, Hydrogenated Poly(C6-20 Olefin), Polyisobutene, Pectin. It is the default of the product page ingredient label (now titled "Full ingredients (INCI)"; a product metafield custom.ingredients, if set, still wins) and it shows in the small print of the home ingredient section. Because the list has four ingredients, the home section no longer says "The only ingredient" or "One ingredient. Nothing else to guess."; it now says "Inside the patch" and "A short ingredient list, shown in full." The preview product uses the same list.

## 2.7.0
- Home "One kit for the whole day" (Day and night panels) rebuilt to the new reference: outlined pill, big serif heading with a small gold-to-oxblood rule, a pale gold Day card (wider) and a deep oxblood Night card, each with a round icon, a time pill, short text, three chips and a side-on cross-section drawing panel, then a white strip with two points and a small note. Every word is editable. Left out because unverified: millimetre sizes, 15 degree edge, "8+ hour pillow-lock", "medical-grade", "fragrance-free", "non-drying", "visibly flattens in 6 hours", "safe for sensitive skin", "stays put while you sleep" and "absorbs deeper". The drawings are marked as illustrations, not to scale. The old hover-grow, round decorative circles and photo slots are gone.

## 2.6.0
- Footer reworked to the newer reference: a four-point trust bar on top (drug-free hydrocolloid, day and night patches, US dispatch, 30-day guarantee), then the ZLOFY name with a tagline, small badges and the email sign-up, three link columns (Shop, The science, Support), a "US customer care" card with your support email, the big soft wordmark, and a bottom bar with four legal links, payment logos and the cosmetic-use note. Everything is editable in Theme settings > Footer links. Not added because they are unverified: "Dermatologist tested", "Cruelty-free", "Fragrance-free", "Visible results in 6 hours", "Reply under 4 hours", opening hours, the company name and address line, shipping within 24 hours, and the footnote claiming blemishes are reduced in 6 hours. Product prices in the Shop links were left out.

## 2.5.0
- New footer in the reference layout: dark oxblood, four link columns, a cream "Stay in the loop" sign-up card, a big soft ZLOFY wordmark, and a bottom bar with copyright and legal links. Links are edited in Theme settings > Footer links (one "Text | address" per line; "email" opens your support email). Starting links only point to things that exist: Shop all, Cart, Hydrocolloid science, How it works, FAQs, Shipping policy, Refund policy, Contact us (email), Privacy policy, Terms of service. The reference's other columns (Skincare, Press, Sustainability, Wholesale, Track Order) and "Formulated in California | Cruelty-Free" were not added because they do not exist or are not verified. The separate newsletter band on the home page is removed because the footer now has the sign-up.

## 2.4.1
- Product page "Before and after" now starts with two demonstration pairs (the placeholder third card, "Customer C", is gone) and the same honest copy as the home page: "How a patch looks", an AI-generated disclaimer, no "real customers" wording. The section's preset also starts with two pairs.

## 2.4.0
- "A spot's day" timeline redone in the reference layout: four time labels over round icons joined by a line, four photo cards with a time tag, "Step 1: ... Step 4:" titles (numbering is automatic), and under each title a small line drawing (magnifier, thin day patch, cushioned night patch, round patch) above a soft caption box. Captions are aligned. The longer "annoyance" line is hidden by default (switch on in the section). Starting copy rewritten to say only what is safe: no "healing", no "less inflamed", no "stays put while you sleep".

## 2.3.0
- FAQ with image: the empty right side is now an original panel: a soft rose background with a framed close-up patch video (muted, loops, pause button, "AI-generated illustration" note) and a "Still have a question?" card with an email link taken from Theme settings. Your own photo (Image setting) still replaces it. First question renamed to "What are Zlofy Day and Night patches?" (the old text used the theme's working name). No other brand's packaging or photos are used.

## 2.2.3
- Product page: the payment logo strip is centred under the trust strip.

## 2.2.2
- Product page: the payment icons under the trust strip are now a picture of the real logos (Visa, Mastercard, American Express, Apple Pay, Shop Pay) in white tiles (`assets/ap-payment-strip.png`, 60 KB), replacing the plain text boxes. Turn it off with "Show payment logos". Show it only for methods your checkout accepts.

## 2.2.1
- Product page "Add to bag" button: soft oxblood shadow, lifts a little on hover, presses down on click; no shadow when disabled.

## 2.2.0
- Header matches the reference: a slim oxblood announcement bar with a small outlined pill ("Free US shipping $35+") and one calm line, the logo on the left, links centred, and a dark "Bag" pill with a count on the right (the old icon is gone). The links now come from Theme settings > Header links (Shop, Hydrocolloid science, How it works, FAQ), so they work without editing the store's Main menu; clear every label to use the Main menu instead. Anchors that exist: #shop, #ingredient, #how, #faq on the home page; the links use /#... so they also work from the product page. Added id="faq" to both FAQ sections. A "Verified Results" link was not added.

## 2.1.2
- Product page benefit pills: shorter starting text ("Thin, low-shine day patches", "Cushioned night patches", "Less picking", "Drug-free hydrocolloid") so they sit two to a row instead of stacking one per line. Removed the "stays put while you sleep" wording, which was not verified.

## 2.1.1
- Product page buy box: formula cards can now carry an icon, a second line and a small tag (new "Formula card note" blocks, matched by option value), a 3-column trust strip (US dispatch, guarantee, clean formula; edit the text to match your real policy), the question panel is titled "Inside the patch · Hydrocolloid science", and the starting template fills the top banner and the photo chip. Preview product now uses the four formula names.

## 2.1.0
- Product page buy box restyled to the editorial layout: optional dark banner above the photo, a framed photo with a kit chip and a working "+ Inspect" zoom, labelled photo tabs in a row of four, a category pill, numbered steps ("1. Kit", "2. Purchase options"), outlined formula cards in two columns, radio-style purchase cards, a 3-up trust strip, a new "Inside the patch" question panel (tap a question, the answer swaps; keyboard arrows work), and plus/minus accordions. The big price is hidden when the product has subscription plans (the cards show prices). The banner, chip and rating stay hidden until you fill them or have real reviews. Default answers are plain and make no medical claim.

## 2.0.0
- New palette across the whole store: deep oxblood (#3B0A14 ink, #6E1423 buttons) with warm alabaster (#FBF7F5) and soft rose accents, instead of navy and bright pink. Done in one place: the colour defaults in `snippets/ap-tokens.liquid` and `config/settings_schema.json` (editable in Theme settings), plus the fixed colours inside sections, shadows and dark panels. All 39 contrast pairs still pass. The buying panel on the product page (formula cards, one-time or subscribe, quantity, sticky bar, bag drawer) already existed and now uses the new colours. Colours saved earlier in the theme editor (if any) override the defaults and must be reset there.

## 1.15.1
- Product page ingredient label box: a built-in close-up video (`assets/ap-ingredient-label-video.mp4`, 10 s, 1.8 MB, landscape 16:9, audio removed) sits inside the box. On laptops it is beside the ingredient list; on phones it stacks above it at full width. It loads only when scrolled near (preload none), plays only while on screen, has a pause button, and never autoplays for reduced motion. It is an AI-generated illustration (noted on the video). Turn it off in the section with "Show the close-up video inside the ingredient label box".

## 1.15.0
- Product page "What the patch is made of": the demonstration photo is replaced by a built-in close-up video (`assets/ap-ingredient-prod-video.mp4`, 10 s, 2 MB, audio removed) of a thin patch over a small spot, in a clean portrait window with a soft ring, a pause button and an "AI-generated illustration" note. It plays only while on screen and never autoplays for reduced motion. The section also gets the site's soft blush-to-lilac background with drifting glows and floating patch dots, a staged entrance, and a mouse tilt on laptops. The photo is still there as an option (turn the video off).

## 1.14.2
- Home banner: the built-in video is replaced by a new 15 s clip (a face with a spot, then a close-up of a patch on it). Audio removed, 3.2 MB, new cover image. It is an AI-generated illustration, not a real customer.

## 1.14.1
- Home "One ingredient": the dark navy background is now the site's soft blush-to-lilac gradient with drifting colour glows and floating patch dots. The three facts are white cards that take turns lighting up (with a progress line); hover, tap or keyboard focus holds one, and the ring around the video changes colour to match. Everything rises in one after another, the video leans toward the mouse on laptops, and all of it stops for visitors who prefer reduced motion.

## 1.14.0
- Home "One ingredient" section: a built-in close-up video of a thin patch on skin (`assets/ap-ingredient-video.mp4`, 10 s, 1.3 MB, audio removed) in a round window inside the orbit rings. Muted, loops, plays only while on screen, has a pause button, and does not autoplay for visitors who prefer reduced motion. A small "AI-generated illustration" note sits under it. Turn it off in the section to use your own photo or the old drawing.

## 1.13.1
- "Before and after": the dark navy background is replaced with the site's soft blush-to-lilac gradient. It has slowly drifting colour glows and little translucent patch dots that float up, and the glows move a little as you scroll. The headline lines rise in one by one. On laptops each photo card leans toward the mouse in 3D with a soft light following the pointer. Everything stops for visitors who prefer reduced motion.

## 1.13.0
- "Before and after" is now interactive and more polished. Tap "Patch ready" or "Patch worn" to glide to that side, or drag / use the arrow keys. A pulsing handle and a "Drag" hint show it moves (hint disappears after the first touch), and each slider gives one gentle nudge when it scrolls into view. Soft entrance, hover lift on laptops, frosted labels, and a small "AI-generated illustration" badge on each photo (editable, clear it only for your own real photos). All extra motion is off for visitors who prefer reduced motion.

## 1.12.4
- Before and after: second pair added in the preview (cropped to remove the AI watermark). Disclaimer now says plainly: AI-generated illustrations, not real customers and not real results.

## 1.12.3
- "Before and after": two photo pairs side by side on laptops (centred, max 920 px), stacked on phones, with portrait 4:5 photo frames so faces are not cropped. A single pair is centred at a narrower width. Starting template has two pairs.

## 1.12.2
- Home "Before and after" section: starting copy is now honest for demonstration photos ("How a patch looks", labels "Patch ready" / "Patch worn", AI-generated disclaimer) and starts with one pair. Replace the pair with your own photos in the theme editor. Preview shows two demonstration photos.

## 1.12.1
- "How it works" video: a 6-second clip showing a used patch being peeled off and a fresh one shown beside it is added to the end, so all four steps are now covered (26 s, audio removed, 5.5 MB). AI-generated demonstration, not a real customer.

## 1.12.0
- Product page "What the patch is made of" (Ingredients): defaults now match the one-ingredient story (Hydrocolloid only; no unverified "breathable film" or "skin-friendly adhesive" claims). New optional trust fields, all hidden until filled: facts at a glance (diameter, thickness, patches per kit, wear time), where it is made, a link to a real test report, and three short questions (patch test, what if it will not stick, where to see the full list). Built-in demonstration photo (used patch beside a fresh one) with a caption; AI-generated, not a real customer. The ingredient label must match your real pack.

## 1.11.0
- "How it works": a 3D feel. The video leans toward the mouse with depth (mouse only), the step cards swing in from the side in 3D, and a little 3D patch beside the video acts out the step you are on: drops fall (cleanse), it gets pressed with a ripple (press), it slowly turns white (wait), it peels off and a fresh one appears (swap). Its label shows the current step title. Everything stops for visitors who prefer reduced motion.

## 1.10.1
- "How it works": a built-in how-to video (`assets/ap-how-video.mp4`, 20 s, audio removed, tap to play, never autoplays) with a "Demonstration video" note. It is AI-generated, not a real customer. Turn off "Use the built-in how-to video" in the section to use your own video or photo.

## 1.10.0
- "A spot's day" rewritten around real pain points: new eyebrow, a "Sound familiar?" row of everyday annoyances, a time tag on each photo (7:30 AM, 1:00 PM, 10:30 PM, 7:00 AM), new titles and text that describe exactly what each photo shows, and small labels above "The problem" and "What helps". All wording is editable in the section settings. Keep every line true for your product (especially the night patch line).

## 1.9.5
- "A spot's day": card 4 (Next morning) now shows a built-in demonstration photo of a used patch (turned white in the middle) beside a fresh one (`assets/ap-card-swap.jpg`). All four cards now have photos. AI-generated, not real customers.

## 1.9.4
- "A spot's day": card 3 (Night) now shows a built-in demonstration photo of an adult in bed with a patch on a small spot (`assets/ap-card-night.jpg`). AI-generated, not a real customer.

## 1.9.3
- "A spot's day": card 2 (Midday) now shows a built-in demonstration photo of a fingertip pressing a patch onto a small spot (`assets/ap-card-midday.jpg`). AI-generated, not a real customer.

## 1.9.2
- "A spot's day": card 1 (Morning) now shows a built-in demonstration photo (an adult holding a patch next to a small spot, `assets/ap-card-morning.jpg`). Each card has a "Built-in sample photo" choice; set it to None to use your own photo. A small note under the cards says the photos are illustrative demonstrations, not customer testimonials (clear it once all photos are your own). The photo is AI-generated: do not call it a real customer.

## 1.9.1
- "A spot's day" section: a trust line under the button (Free US shipping on kits, US-based support, Secure checkout). Larger screens show the picture strip (`assets/ap-trust-strip.png`); phones show the same three points as readable text with icons. Editable in the section settings; untick the picture if you change the wording. Keep every point true for your store.

## 1.9.0
- Home banner: ten little glassy patches float in the background, a fine grain texture adds depth, and scrolling now moves the banner: the video slowly zooms, the text and picture drift apart and the patches rise at different speeds (`assets/ap-banner.js`). All of it stops for visitors who prefer reduced motion.

## 1.8.2
- Home banner: built-in video swapped to the first Arcads draft (the 1 MB one), cropped to portrait around the face and chin, with a seamless cross-fade loop (1.7 MB). Still an AI-generated sample, not a real customer.

## 1.8.1
- Home banner: the right side is now one plain video panel that fills the whole space (no arch, badges, sparkles or ring when a video or photo is shown). The built-in video is an AI-generated sample of an adult applying a patch (`assets/ap-banner-video.mp4`, 7 s, seamless loop with a cross-fade, 1.8 MB). It is NOT a real customer: replace it with your own video, and never label it as a customer.

## 1.8.0
- Home banner: a soft photo sits behind the banner (the patch on a pink surface, drifting slowly) and the video stays on the right. New editor settings: background photo (or built-in until you add yours), optional video label for real customer videos (needs the customer's written permission, unedited, no results claims). The spinning ring is now off by default.

## 1.7.1
- Banner scrolling strip restyled: clean white band with fine borders, a round icon before each fact, small blush dots between facts and soft white edge fades (was a plain dark bar).

## 1.7.0 (one-ingredient section)
- New home section "One ingredient" (`sections/ap-home-ingredient.liquid`), placed after the day/night split: the single ingredient in big type, a plain-words explanation, three editable facts, and an animated drawing of a patch taking in fluid and turning white (or your own photo). Placeholder wording: match it to your real label.

## 1.6.0 (premium animated banner)
- Home banner: headline words fly in one by one and the second sentence shimmers; the video reveals from an arch; glass badges and a spinning text ring drift with the mouse; twinkling sparkles; the main button glows and sweeps with light; a scrolling strip of true brand facts sits under the banner (editable). Everything stops for visitors who prefer reduced motion. New editor settings: ring text, scrolling strip.

## 1.5.2
- "How it works" section redesigned: subheading, soft glow background, framed video with a play button and caption, and a connected timeline of step cards (icon, optional time tag such as "10 sec") whose line fills and whose current step highlights as you scroll (`assets/ap-how.js`). New editor settings: subheading, video caption, per-step icon and time tag.

## 1.5.1
- Home "Shop the kit" section is now for ONE product: one block only, a wide card (image left, name, price and button right) on desktop, no "See all products" link by default.

## 1.5.0 (animated banner with video)
- Home banner: the copy rises in one line at a time, the visual pops in, the badges float. The visual can now be a video: your own Shopify-hosted video (muted loop), else your photo, else a built-in demo loop, else the drawn patch. The demo loop (`assets/ap-demo-banner.mp4`, 6 s, 1 MB, original animation, no people, no text, no claims) shows until you add your own.
- Pause / play button on the video (WCAG 2.2.2); the video stays paused for visitors who prefer reduced motion and pauses while off-screen (`assets/ap-banner.js`).
- Preview server: serves mp4 with Range requests.

## 1.4.0 (How it works page)
- New page template `templates/page.how-it-works.json` (generated by `npm run build:template`): page banner with Shop now button, the system (day and night patch cards), watch it work (video + 3 steps), what you can expect, spot by spot, size guide, comparison, FAQ, email sign-up. In Shopify: Online Store > Pages > Add page "How it works", template `page.how-it-works`.
- New sections: `ap-page-banner`, `ap-system-parts`. The preview serves it at /pages/how-it-works and the header link points there.
- Layout and structure follow the reference page; all copy is original and cosmetic only. Numbers and sizes are examples to be replaced with real ones.

## 1.3.1
- Header: "Shop" is now a plain link (no dropdown, no sub-categories). Sub-links in the menu are ignored on purpose, so a dropdown can never reappear. In the preview, Shop goes to the product page. Removed the dropdown CSS and JS. In Shopify, set the "Shop" link in Online Store > Navigation > Main menu to your product page.

## 1.3.0 (home page)
- New `templates/index.json` (generated by `scripts/build-template.mjs`): home banner, product cards, spot's-day timeline, day and night panels, how to use (`#how`), before/after, customer videos, founder note, guarantee, FAQ, email sign-up.
- New sections: `ap-home-banner` (benefit headline, two CTAs, trust points, your photo or a drawn patch illustration with floating Day/Night badges), `ap-home-products` (up to 4 product cards from product pickers), `ap-home-split` (Day / Night panels, the hovered one grows), `ap-newsletter` (Shopify customer form tagged `newsletter`).
- `ap-before-after`, `ap-video-cards`, `ap-founder-note`, `ap-faq-split` can now be used on the home page too; the how-to section got `id="how"`.
- Organization JSON-LD on the home page; preview server renders it at `/home`.

## 1.2.0 (responsive QA)
- Tested at 360, 375, 390, 768 and 1440 px: no horizontal overflow at any width.
- iPhone: `viewport-fit=cover` so the sticky bar and footer respect the home-indicator safe area; form fields are 16 px or larger (no zoom-on-focus); footer gets extra bottom space so the sticky bar never covers the copyright line.
- Phones: sticky bar is one tidy line (title + button with price), comparison table fits 360 px without sideways scroll, before/after cards are square (shorter page), timeline photos landscape, kit tiles tighter, quantity box is a 44 px tap target, labels below 12 px raised to 12 px, spacing between the Add to bag row and benefit pills.
- Tablets (600–899 px): spot's-day timeline is a 2 x 2 grid instead of a very long single column.
- Not tested: a real iPhone/Safari (Xcode is not installed on this Mac, so the iOS Simulator cannot run) and real Android Chrome.

## 1.1.3
- Logo is now option 4, the script wordmark: italic serif "Zlofy" with a hand-drawn swash underneath ending in a red patch dot (the dot hops on hover). Real text plus a small SVG swash. Adds the italic of the heading font (`assets/ap-font-display-italic.woff2`, SIL OFL). Favicon is a matching red circle with a white swash and dot.

## 1.1.2
- Logo is now option A, the classic serif wordmark: lowercase "zlofy" in the heading serif with the "o" in blush red (header 42 px, footer 44 px, white with a lighter red o). Real text, no image. Favicon is a matching red circle with a white ring (the o).

## 1.1.1
- Logo is now just the letter Z: a white Z on the round glossy blush patch, in the header (52 px, 44 px on phones) and footer (60 px). Drawn as a path, same artwork as the favicon. Brand name stays as screen-reader text.

## 1.1.0 (logo)
- New logo: lowercase serif "zlofy" (DM Serif Display) with the o drawn as a glossy blush hydrocolloid patch (tilted, spins on hover). Same in the header and the footer (white). Still real text for screen readers; uploading a logo in Theme settings still overrides it.
- Favicon: `assets/ap-favicon.svg` (the patch), linked in `layout/theme.liquid`.

## 1.0.1
- Font change: headings now use DM Serif Display (elegant serif) and body text uses DM Sans; both self-hosted (SIL OFL). Headings are regular weight, so the faux-bold is switched off (`font-synthesis:none`). Replaced Plus Jakarta Sans.

## 1.0.0 (bold look)
- Palette refreshed to a brighter, more modern blush-red set (ink #1B1B3A, blush #F95D75, blush deep #CF2749, lilac #CDB8FF, blush cream #FFF0F2, apricot #FFB270, butter #FFE066). Contrast script updated: 40 pairs pass.
- Typography: Plus Jakarta Sans (self-hosted, SIL OFL, no Google request), 800-weight tight headings, larger section titles.
- Backgrounds now alternate for rhythm: white, cream, rose (how to use), navy (before/after, customer videos), butter (guarantee), red (FAQ).
- Animation: headline words rise one by one, scroll-progress bar, slow drifting colour glow behind the buy box, pulsing ring on the guarantee shield (all off with reduced motion).
- Guarantee band restyled (light butter, red heading, pill on navy).

## 0.9.0 (clean-up)
- Removed from the default product template as repeats (files kept in `sections/`): facts ticker (repeats the trust strip), feature cards (repeat the hero bullets), which-patch-when tabs (repeat the spot's-day timeline and day vs night), size guide (sizes are in the kit section), real-wear photos (customer photos already covered by before/after and video cards), bundles (repeat the hero kit options), old FAQ.
- The FAQ-with-image band now carries the FAQPage schema and 8 questions. Do not add the older FAQ section as well.
- Order is now: trust, buy box, problem timeline, day vs night, how to use, ingredients, before/after, kit contents, comparison, reviews, founder note, upsell, video cards, guarantee, FAQ, sticky bar.
- Instruction-style default text ("edit every row…", "Example numbers…") no longer shows to customers; it is an editor-only note.

## 0.8.0
- Conversion copy pass: hero intro and bullets now lead with the benefit (wear the thin day patch anywhere, cushioned night patch for sleep, less picking, three sizes); feature cards rewritten the same way. All cosmetic wording, nothing to verify beyond your own product facts.
- Animation pass: hero entrance (text rises in sequence), facts band is now a slow ticker (pauses on hover, static with reduced motion), section headings get a scroll-drawn accent bar (where the browser supports scroll-driven animation), kit total counts up, buttons get a shine on hover.
- New optional colour: `Butter yellow` (`--ap-butter`, use with ink text), used for the heading accent bar.

## 0.7.3
- `ap-problem` photos are now rectangles (portrait 3:4 by default, squarer corners); new `Photo shape` setting (portrait, landscape, square).

## 0.7.2
- `ap-problem` timeline: optional photo per step (hidden when empty), with a slow zoom on hover.

## 0.7.1
- `ap-problem` rebuilt as "A spot's day": a four-step timeline (morning, midday, night, next morning). Each step pairs the real annoyance with a "What helps" line, with a gradient line that draws in on scroll and a button to the buy box. Block settings gained `time` and `fix`; copy is cosmetic-only and must stay true for your product.

## 0.7.0
- New section `ap-kit-contents` ("What is in your kit") replaces the stat tiles in the product template: each kit item is drawn as its real number of patches at relative size (dots pop in on scroll), plus a summary card with the total, price and approximate price per patch (calculated from your own counts) and a buy button that scrolls to the buy box (`#buy`). Replaces the visible "Example numbers" line with an editor-only note. `ap-stats-strip` stays in the repo but is no longer in the default template.

## 0.6.2
- `ap-ingredients` redesigned to feel like the real product: an exploded layer-stack drawing (or your own photo) beside numbered layers, and the full ingredient list printed openly in a pack-label box instead of a hidden dropdown. Optional "Free from" chips (empty by default). No visible "example text"; the placeholder warning is now an editor-only note. Layer 1 is the top layer.
- Which-patch-when preview mock uses photos instead of video.

## 0.6.1
- `ap-when-tabs` ("Which patch, when"): each tab can have its own video (tap to play, muted, never autoplay) or photo beside the text. Panels without media look as before.

## 0.6.0
- Motion: `assets/ap-motion.js` adds a soft scroll-reveal (fade + rise, staggered) to below-the-fold content only, plus gentle hover lift on cards. Respects `prefers-reduced-motion`; everything is visible without JavaScript; a 6 s safety net never leaves content hidden.
- New section `ap-before-after` (+ `assets/ap-before-after.js`): drag/keyboard comparison sliders (native range input), up to 6 pairs, required-style disclaimer line. Renders nothing until a pair has both photos. Use only real, consenting customers' unedited photos.
- `ap-how-it-works`: optional how-to video (tap to play, muted, never autoplay) or photo beside the steps, steps become a numbered list when media is present.
- `ap-ingredients`: optional photo beside the cards (left/right) and a small photo per ingredient card.
- Template order: before/after sits right after Ingredients.

## 0.5.6
- Hero gallery now plays product video/external-video media (controls, muted, never autoplay) instead of showing only the poster.
- New hero blocks `Gallery photo` (up to 8) and `Gallery video` (up to 4) append your own media after the product's media, with thumbnails (video thumbs get a play badge).
- Preview server: poster-only `video_tag` mock so video slides can be seen locally.

## 0.5.5
- Hero "Customer videos" row: previous/next arrow buttons (shown only when the row overflows), up to 10 video blocks (was 6). Preview mock now has 6 fake videos so the scroll can be seen.

## 0.5.4
- New section `ap-video-cards` ("Video cards") + `assets/ap-video-cards.js`: swipeable row of tall video/poster cards with name and label, a pill + heading, and a stats row below. Empty tinted slots until you add your own media. Placed above the guarantee band. Tap-to-play, muted, no autoplay.

## 0.5.3
- `ap-guarantee` restyled as a centred "Risk-free" band (shield, pill, heading, subheading, big-number card, chips) on blush cream, and moved directly above the FAQ-with-image band. Chips are the existing `point` blocks; wording stays a placeholder that must match the real refund policy.

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
