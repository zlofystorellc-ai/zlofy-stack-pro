/* Mock Shopify objects for the local preview. ALL values here are fake and exist only so the
   layout and the interactions can be seen. Nothing in this file ships with the theme. */

const variant = (id, title, price, patchCount, mediaId, compare = 0) => ({
  id, title, options: [title], option1: title, price, compare_at_price: compare, available: true,
  sku: `PREVIEW-${id}`, url: `/products/day-night-duo?variant=${id}`,
  metafields: { custom: { patch_count: { value: patchCount } } },
  featured_media: { id: mediaId },
  selling_plan_allocations: [
    { selling_plan: { id: 11 }, price: Math.round(price * 0.85) },
    { selling_plan: { id: 12 }, price: Math.round(price * 0.85) }
  ]
});

const media = (id, alt) => ({ id, alt, media_type: 'image', width: 1200, height: 1200, key: `m${id}` });
const mediaList = [
  media(101, 'Mock photo: day and night patch kit'),
  media(102, 'Mock photo: three-month stash'),
  media(103, 'Mock photo: refill pouch'),
  media(104, 'Mock photo: sizes')
];
mediaList.forEach((m) => { m.preview_image = m; });

export const variants = [
  variant(1001, 'Day & Night Duo', 1800, 36, 101),
  variant(1002, '3-Month Stash', 4200, 108, 102, 5400),
  variant(1003, 'Refill Pouch', 1200, 36, 103)
];

export const product = {
  id: 9001,
  title: 'Day & Night Pimple Patches',
  handle: 'day-night-duo',
  url: '/products/day-night-duo',
  description: '<p>Mock description for the local preview.</p>',
  available: true,
  has_only_default_variant: false,
  variants,
  options: ['Kit'],
  options_with_values: [{ name: 'Kit', values: variants.map((v) => v.title), selected_value: variants[0].title }],
  selected_or_first_available_variant: variants[0],
  media: mediaList,
  images: mediaList,
  featured_image: mediaList[0],
  selling_plan_groups: [{ selling_plans: [{ id: 11, name: 'Deliver every 4 weeks' }, { id: 12, name: 'Deliver every 8 weeks' }] }],
  metafields: {
    custom: {
      patch_count: { value: 36 },
      wear_time: { value: 'Day 4–6 hours, night 6–8 hours' },
      patch_sizes: { value: ['8 mm', '10 mm', '12 mm', 'XL body strip'] }
    },
    reviews: {}
  }
};

const single = (id, handle, title, price, mediaId) => ({
  id, handle, title, url: `/products/${handle}`, price, available: true,
  variants: [{ ...variant(id * 10, title, price, 0, mediaId), id: id * 10 }],
  selected_or_first_available_variant: { ...variant(id * 10, title, price, 0, mediaId), id: id * 10 },
  featured_image: { ...media(mediaId, `Mock photo: ${title}`), preview_image: null },
  metafields: { custom: {} }
});

export const others = [
  single(9101, 'travel-case', 'Travel Case', 900, 201),
  single(9102, 'body-strips', 'Body Strips', 1400, 202),
  single(9103, 'gentle-cleanser', 'Gentle Cleanser', 1600, 203)
];

// Bundle cards in the Bundles section (local preview only: gives the cards something to show)
const bundleOf = (v, handle, title, mediaId) => ({
  id: v.id * 3, handle, title, url: `/products/${handle}`, price: v.price, available: true,
  variants: [v], selected_or_first_available_variant: v,
  featured_image: { ...media(mediaId, `Mock photo: ${title}`), preview_image: null },
  metafields: { custom: { patch_count: { value: v.metafields.custom.patch_count.value } } }
});
export const bundleProducts = [
  bundleOf(variants[0], 'duo-kit', 'Day & Night Duo', 301),
  bundleOf(variants[1], 'stash-kit', '3-Month Stash', 302),
  bundleOf(variants[2], 'body-add-on', 'Body Add-on', 303),
  bundleOf({ ...variants[0], id: 1004, price: 1400, metafields: { custom: { patch_count: { value: 12 } } } }, 'travel-compact', 'Travel Compact', 304)
];
export const bundleCompare = [
  [single(9201, 'day-only', 'Day Patch Pack', 1100, 211), single(9202, 'night-only', 'Night Patch Pack', 1100, 212)],
  [single(9203, 'day-3', 'Day Patch x3', 2400, 213), single(9204, 'night-3', 'Night Patch x3', 2400, 214), single(9205, 'case', 'Case', 1200, 215)],
  [], []
];

export const settingsOverrides = {};

export const linklists = {
  'main-menu': { links: [{ title: 'Shop', url: '/collections/all', links: [{ title: 'Day patches', url: '#' }, { title: 'Night patches', url: '#' }] }, { title: 'How it works', url: '#how' }, { title: 'Reviews', url: '#reviews' }, { title: 'FAQ', url: '#faq' }] },
  footer: { links: [{ title: 'Refund policy', url: '/policies/refund-policy' }, { title: 'Shipping', url: '/policies/shipping-policy' }, { title: 'Contact', url: '/pages/contact' }] }
};
