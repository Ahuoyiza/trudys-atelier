/* Trudy's Atelier — catalogue data
   Prices are stored in USD and converted on display (see CURRENCIES).
   Photography: Unsplash (free licence). */

const img = (id, w = 900, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`;

const CURRENCIES = {
  NGN: { flag: '🇳🇬', label: 'Nigeria', symbol: '₦', rate: 1550, decimals: 0 },
  GHS: { flag: '🇬🇭', label: 'Ghana', symbol: 'GH₵', rate: 15, decimals: 0 },
  KES: { flag: '🇰🇪', label: 'Kenya', symbol: 'KSh', rate: 129, decimals: 0 },
  ZAR: { flag: '🇿🇦', label: 'South Africa', symbol: 'R', rate: 18, decimals: 0 },
  GBP: { flag: '🇬🇧', label: 'United Kingdom', symbol: '£', rate: 0.79, decimals: 0 },
  USD: { flag: '🇺🇸', label: 'United States', symbol: '$', rate: 1, decimals: 0 },
};

const COLLECTIONS = [
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Linen, light and lasting.',
    description:
      'The foundation of the atelier. Breathable linens and washed cottons cut long and loose, made for heat, for movement and for every day you want to feel quietly put together.',
    cover: '1558036496-420dadc075cf',
    season: 'Core',
  },
  {
    id: 'traxx',
    name: 'Traxx',
    tagline: 'Garments that move before you do.',
    description:
      'Built around motion. Wrap coats that catch the wind, kaftans with split hems and shell layers that fold to nothing. Designed for the woman between cities.',
    cover: '1680888470883-9c2917c307fc',
    season: 'SS27',
  },
  {
    id: 'double',
    name: 'Double',
    tagline: 'Two pieces. One silhouette.',
    description:
      'Matching sets engineered to separate. Each top and bottom is designed to stand alone, so a single set becomes three outfits.',
    cover: '1730140762303-8bc833a0c0bb',
    season: 'SS27',
  },
  {
    id: 'slim-fit',
    name: 'Slim Fit',
    tagline: 'Soft tailoring, sharp lines.',
    description:
      'Our take on tailoring: relaxed shoulders, precise seams and fabrics that drape rather than constrict. Structure without stiffness.',
    cover: '1641932481849-9ac1cacf360c',
    season: 'Core',
  },
  {
    id: 'harmattan',
    name: 'Harmattan',
    tagline: 'Earth tones for the dry season.',
    description:
      'Ochre, clay and ink. A capsule inspired by the dusty light of the harmattan: fluid evening shapes, sculpted knits and columns that glow against deep skin.',
    cover: '1527203561188-dae1bc1a417f',
    season: 'AW26',
  },
];

const PRODUCTS = [
  // Classic
  { id: 'halo-linen-midi', name: 'Halo Linen Midi', collection: 'classic', price: 185, image: '1558036496-420dadc075cf', colors: ['Ivory', 'Sand'], fabric: '100% washed linen', description: 'A softly gathered midi with a scooped neck and deep side pockets. Cut on a generous A-line that catches the breeze.' },
  { id: 'dune-slip-dress', name: 'Dune Slip Dress', collection: 'classic', price: 210, image: '1617551307578-7f5160d6615e', colors: ['Cream', 'Clay'], fabric: 'Sand-washed silk blend', description: 'A bias-cut slip that pours over the body. Adjustable straps, a cowl back and a hem that pools just above the ankle.' },
  { id: 'lagoon-off-shoulder-gown', name: 'Lagoon Off-Shoulder Gown', collection: 'classic', price: 240, image: '1686902443928-bffddd54f21b', colors: ['Ivory'], fabric: 'Cotton voile', description: 'Tiered voile with an elasticated off-shoulder neckline. Light enough for coastal heat, dramatic enough for an entrance.' },
  { id: 'atrium-smocked-dress', name: 'Atrium Smocked Dress', collection: 'classic', price: 165, image: '1730141100734-90e06e5966dd', colors: ['Ivory', 'Ink'], fabric: 'Organic cotton poplin', description: 'A smocked bodice and puff sleeves meet a fluid short skirt. Easy, airy and made to be lived in.' },
  { id: 'meridian-maxi', name: 'Meridian Maxi', collection: 'classic', price: 195, image: '1609782404042-36cb68310555', colors: ['Ivory', 'Sand'], fabric: 'Linen-cotton blend', description: 'A floor-grazing maxi with a fitted waist and a sweeping skirt. The one you will reach for every weekend.' },

  // Traxx
  { id: 'drift-wrap-coat', name: 'Drift Wrap Coat', collection: 'traxx', price: 320, image: '1680888470883-9c2917c307fc', colors: ['Mist', 'Sand'], fabric: 'Featherweight Tencel twill', description: 'An unlined wrap coat with dropped shoulders and a long tie belt. Wear it open and let it move.' },
  { id: 'orbit-shell-jacket', name: 'Orbit Shell Jacket', collection: 'traxx', price: 290, image: '1743680163158-4aeefa62dadb', colors: ['Ink'], fabric: 'Recycled technical crepe', description: 'An oversized, collarless shell with sculpted sleeves. Water-resistant, packable and quietly futuristic.' },
  { id: 'savanna-trail-kaftan', name: 'Savanna Trail Kaftan', collection: 'traxx', price: 230, image: '1681934518606-e787c6d8a08d', colors: ['Ivory'], fabric: 'Cotton gauze', description: 'A floor-length kaftan with high side slits for a long stride. Breathes in any climate.' },
  { id: 'wind-tunic-set', name: 'Wind Tunic Set', collection: 'traxx', price: 210, image: '1681934518560-fe115296953f', colors: ['Ivory', 'Mist'], fabric: 'Cotton gauze', description: 'A long tunic over wide trousers. Two layers of gauze that trail behind you as you walk.' },
  { id: 'signal-print-maxi', name: 'Signal Print Maxi', collection: 'traxx', price: 260, image: '1601653233006-5c9fd30eab12', colors: ['Signal print'], fabric: 'Printed cotton sateen', description: 'Our one bold note: a graphic print on a halter maxi with a sweeping high-low hem.' },

  // Double
  { id: 'terrace-mini-set', name: 'Terrace Mini Set', collection: 'double', price: 175, image: '1730140762303-8bc833a0c0bb', colors: ['Ivory'], fabric: 'Cotton broderie', description: 'A cropped corset top and a flared mini skirt. Sold as a set, worn every which way.' },
  { id: 'canopy-sheer-set', name: 'Canopy Sheer Set', collection: 'double', price: 220, image: '1730140762336-0083b5d1da7f', colors: ['Ivory', 'Ink'], fabric: 'Silk organza and cotton jersey', description: 'An organza overshirt layered over a fitted jersey column. Translucent and composed.' },
  { id: 'veil-mesh-two-piece', name: 'Veil Mesh Two-Piece', collection: 'double', price: 235, image: '1730140990656-478ea72f7ad9', colors: ['Ivory'], fabric: 'Fine stretch mesh', description: 'A long-sleeved mesh top and matching column skirt over a seamless slip. Future-forward, softly.' },
  { id: 'fern-column-set', name: 'Fern Column Set', collection: 'double', price: 210, image: '1730140990633-d752e4234e62', colors: ['Ivory', 'Sand'], fabric: 'Crinkle cotton', description: 'A boxy tie-front shirt over a straight column skirt. Made to be separated.' },

  // Slim Fit
  { id: 'ivory-line-blazer', name: 'Ivory Line Blazer', collection: 'slim-fit', price: 280, image: '1641932481849-9ac1cacf360c', colors: ['Ivory', 'Ink'], fabric: 'Wool-viscose crepe', description: 'A single-button blazer with a long, lean line and softened shoulders. Tailoring without the armour.' },
  { id: 'sandstone-trench', name: 'Sandstone Trench', collection: 'slim-fit', price: 340, image: '1651491646869-3f18f4d30be0', colors: ['Sand'], fabric: 'Cotton gabardine', description: 'A clean, collarless trench with a hidden placket and a belt that ties anywhere.' },
  { id: 'knot-crop-shirt', name: 'Knot Crop Shirt', collection: 'slim-fit', price: 120, image: '1506890533526-95e6102ad03d', colors: ['Ivory', 'Ink'], fabric: 'Crisp cotton poplin', description: 'A sleeveless shirt with extra-long front panels to knot, wrap or leave open.' },
  { id: 'crown-wrap-headpiece', name: 'Crown Wrap Headpiece', collection: 'slim-fit', price: 65, image: '1613876215075-276fd62c89a4', colors: ['Ivory', 'Sand', 'Clay'], fabric: 'Silk jersey', description: 'A pre-shaped gele-inspired wrap that sets in seconds. Sculptural, soft and secure.' },

  // Harmattan
  { id: 'ochre-column-gown', name: 'Ochre Column Gown', collection: 'harmattan', price: 310, image: '1527203561188-dae1bc1a417f', colors: ['Ochre'], fabric: 'Heavy silk satin', description: 'A strapless column with a low back and a long, sweeping train. Glows like late-afternoon light.' },
  { id: 'dusk-cami-dress', name: 'Dusk Cami Dress', collection: 'harmattan', price: 150, image: '1610892074832-9c11008ac7da', colors: ['Ink', 'Clay'], fabric: 'Washed viscose', description: 'A slim cami dress with a scooped back. The base layer for every harmattan evening.' },
  { id: 'asymmetric-drape-top', name: 'Asymmetric Drape Top', collection: 'harmattan', price: 140, image: '1772631943182-40f7dd301ab1', colors: ['Stone'], fabric: 'Matte jersey', description: 'A one-shoulder top draped by hand at the neckline. Pair it with anything long and lean.' },
  { id: 'ember-knit', name: 'Ember Knit', collection: 'harmattan', price: 160, image: '1701887714880-973785438426', colors: ['Ink'], fabric: 'Merino-cotton rib', description: 'A fitted mock-neck in a fine rib. Warm in the cool mornings, light by noon.' },
  { id: 'clay-sculpt-set', name: 'Clay Sculpt Set', collection: 'harmattan', price: 250, image: '1704208316515-a32f81e373ef', colors: ['Clay'], fabric: 'Bonded scuba', description: 'A cropped sculpted top and balloon trousers in one tone. Architecture you can sit down in.' },
];

const KITS = [
  {
    id: 'weekday',
    name: 'The Weekday Kit',
    summary: 'Five days, four pieces. From the studio to dinner without going home.',
    items: ['ivory-line-blazer', 'knot-crop-shirt', 'dusk-cami-dress', 'sandstone-trench'],
    discount: 0.12,
  },
  {
    id: 'coast',
    name: 'The Coast Kit',
    summary: 'For Lagos weekends, Accra beaches and Mombasa sunsets.',
    items: ['halo-linen-midi', 'savanna-trail-kaftan', 'terrace-mini-set', 'crown-wrap-headpiece'],
    discount: 0.1,
  },
  {
    id: 'occasion',
    name: 'The Occasion Kit',
    summary: 'Three statement pieces for the season of weddings and celebrations.',
    items: ['ochre-column-gown', 'lagoon-off-shoulder-gown', 'crown-wrap-headpiece'],
    discount: 0.1,
  },
];

/* Variables Set: modular pieces that combine. Each step picks one option. */
const VARIABLE_STEPS = [
  {
    id: 'base',
    label: 'Base',
    hint: 'The piece everything else builds on.',
    options: ['dusk-cami-dress', 'halo-linen-midi', 'dune-slip-dress', 'knot-crop-shirt'],
  },
  {
    id: 'layer',
    label: 'Layer',
    hint: 'Add structure, or let it flow.',
    options: [null, 'ivory-line-blazer', 'sandstone-trench', 'drift-wrap-coat'],
  },
  {
    id: 'accent',
    label: 'Accent',
    hint: 'The finishing note.',
    options: [null, 'crown-wrap-headpiece', 'asymmetric-drape-top'],
  },
];

const TONES = [
  { id: 'ivory', label: 'Ivory', hex: '#efe8de' },
  { id: 'sand', label: 'Sand', hex: '#cdb59b' },
  { id: 'clay', label: 'Clay', hex: '#a9653f' },
  { id: 'ink', label: 'Ink', hex: '#22201e' },
];

const SET_DISCOUNT = 0.15;
