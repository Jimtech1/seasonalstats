import { 
  ListingItem, 
  KpiMetric, 
  FunnelStage, 
  SearchTermItem, 
  HistoricalMonthItem, 
  AlertItem, 
  ListingEditRecord 
} from '../types';

export const INITIAL_KPIS: KpiMetric[] = [
  {
    id: 'visits',
    label: 'VISITS',
    currentValue: '3,681',
    seasonIndex: 0.96,
    sparkline: [3200, 3400, 3900, 3800, 3500, 3300, 3450, 3600, 3550, 3720, 3610, 3681],
    vsLastYear: '↘ 4.1% vs last year',
    comparisonStatus: 'Slightly below baseline',
    subDetail: 'Seasonal pace typically dips in late summer'
  },
  {
    id: 'conversion_rate',
    label: 'CONVERSION RATE',
    currentValue: '3.70%',
    seasonIndex: 1.06,
    sparkline: [3.1, 3.2, 3.4, 3.5, 3.3, 3.4, 3.6, 3.5, 3.6, 3.65, 3.68, 3.70],
    vsLastYear: '↗ 0.2% pts vs last year',
    comparisonStatus: 'Outperforming seasonal pace',
    subDetail: 'Etsy handmade average: 2.4%'
  },
  {
    id: 'aov',
    label: 'AVERAGE ORDER VALUE',
    currentValue: '$41.65',
    seasonIndex: 1.00,
    sparkline: [39.5, 40.2, 41.0, 42.1, 41.5, 41.0, 40.8, 41.2, 41.5, 41.4, 41.6, 41.65],
    vsLastYear: '→ 0.0% vs last year',
    comparisonStatus: 'Exactly on baseline',
    subDetail: 'Bundling offers holding basket size stable'
  },
  {
    id: 'orders',
    label: 'ORDERS',
    currentValue: '112',
    seasonIndex: 0.95,
    sparkline: [98, 105, 120, 118, 108, 102, 106, 110, 111, 115, 109, 112],
    vsLastYear: '↘ 5.2% vs last year',
    comparisonStatus: 'Slightly below baseline',
    subDetail: 'Expected pre-holiday buildup begins next month'
  },
  {
    id: 'gross_revenue',
    label: 'GROSS REVENUE',
    currentValue: '$5,201',
    seasonIndex: 1.08,
    sparkline: [4300, 4500, 5100, 5300, 4900, 4700, 4850, 4990, 5050, 5150, 5080, 5201],
    vsLastYear: '↗ 8.1% vs last year',
    comparisonStatus: 'Ahead of seasonal curve',
    subDetail: 'Higher tier woodcraft & linen items drove total'
  },
  {
    id: 'net_revenue',
    label: 'NET REVENUE',
    currentValue: '$4,412',
    seasonIndex: 1.04,
    sparkline: [3650, 3820, 4320, 4500, 4160, 3990, 4110, 4230, 4290, 4370, 4310, 4412],
    vsLastYear: '↗ 4.2% vs last year',
    comparisonStatus: 'Healthy net retention',
    subDetail: 'After Etsy listing, tx & payment fees ($789)'
  },
  {
    id: 'repeat_purchase_rate',
    label: 'REPEAT PURCHASE RATE',
    currentValue: '14.01%',
    seasonIndex: 1.28,
    sparkline: [9.8, 10.2, 11.0, 11.5, 12.0, 12.4, 12.8, 13.1, 13.4, 13.7, 13.8, 14.01],
    vsLastYear: '↗ 28.0% vs last year',
    comparisonStatus: 'Strong customer loyalty',
    subDetail: 'Branded packaging & thank-you cards driving repeats'
  },
  {
    id: 'net_margin',
    label: 'NET MARGIN %',
    currentValue: '84.8%',
    seasonIndex: 1.00,
    sparkline: [83.5, 84.0, 84.5, 85.0, 84.2, 84.5, 84.7, 84.6, 84.9, 84.8, 84.7, 84.8],
    vsLastYear: '→ 0.1% pts vs last year',
    comparisonStatus: 'Steady after platform fees',
    subDetail: 'Fee load: ~15.2% total deductions'
  }
];

export const INITIAL_FUNNEL_STAGES: FunnelStage[] = [
  {
    stageNumber: 1,
    label: 'STAGE 1',
    name: 'Impressions in search',
    value: '214,800',
    numericCurrent: 214800,
    numericLastYear: 208400,
    seasonIndex: 1.03,
    baselineText: 'seasonal baseline 208,400 · 1.03×',
    statusType: 'green',
    statusMessage: 'Holding its seasonal pace. No action needed here this month.',
    fixSuggestions: ['SEO keyword alignment', 'Attribute tags freshness', 'Renew listing recency']
  },
  {
    stageNumber: 2,
    label: 'STAGE 2',
    name: 'Clicks to listings',
    value: '3,912',
    numericCurrent: 3912,
    numericLastYear: 5286,
    seasonIndex: 0.74,
    baselineText: 'seasonal baseline 5,286 · 0.74×',
    statusType: 'amber',
    statusMessage: 'Shoppers see you and scroll past. Rethink first thumbnails and shorten title front-loads.',
    fixSuggestions: [
      'Replace primary thumbnail with higher contrast, well-lit lifestyle photo',
      'Front-load critical keywords in the first 40 characters of your title',
      'Audit badge cues (Free Shipping, Star Seller badge prominence)'
    ]
  },
  {
    stageNumber: 3,
    label: 'STAGE 3',
    name: 'Adds to cart',
    value: '524',
    numericCurrent: 524,
    numericLastYear: 738,
    seasonIndex: 0.71,
    baselineText: 'seasonal baseline 738 · 0.71×',
    statusType: 'amber',
    statusMessage: "Shoppers click but don't add to cart. The listing page isn't convincing — review photos, pricing, description, and reviews.",
    fixSuggestions: [
      'Provide scale photos (in hand, on table) to remove sizing doubt',
      'Clarify materials & dimensions in the top 2 paragraphs of description',
      'Test offering bundled variations or free standard shipping guarantee'
    ],
    isEstimated: true,
    tooltip: 'Estimated from visit-to-order patterns. Etsy does not expose cart data directly.'
  },
  {
    stageNumber: 4,
    label: 'STAGE 4',
    name: 'Orders from cart',
    value: '148',
    numericCurrent: 148,
    numericLastYear: 152,
    seasonIndex: 0.97,
    baselineText: 'seasonal baseline 152 · 0.97×',
    statusType: 'green',
    statusMessage: 'Checkout is converting at its usual seasonal pace. No action needed.',
    fixSuggestions: ['Inspect shipping cost profiles', 'Review delivery estimate window', 'Clarify return policies']
  }
];

export const INITIAL_LISTINGS: ListingItem[] = [
  {
    id: 'listing-1',
    title: 'Hand-poured soy candle, fig & cedarwood artisan candle in amber jar',
    category: 'Home & Living',
    thumbnail: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    description: 'Handcrafted in small batches using 100% natural American-grown soy wax and clean fragrance oils infused with essential oils of earthy wild fig, virginian cedar, and subtle musk.\n\n• Clean 45-hour burn\n• Lead-free cotton braided wick\n• 8 oz reusable amber glass jar with brass twist lid\n• Free from phthalates, parabens, and petroleum',
    tags: ['soy candle', 'fig cedar candle', 'amber glass jar', 'hand poured candle', 'woodsy scent', 'artisan candle', 'fall home decor', 'cozy gift', 'clean burning'],
    impressions: 29100,
    visits: 454,
    addToCart: 68,
    orders: 18,
    revenue: 504,
    netRevenue: 412,
    ctr: 1.56,
    listingAgeDays: 180,
    momentum: 'stable',
    seasonIndex: 1.29,
    flags: [],
    topSearchTerms: [
      { term: 'soy candle fig cedar', visits: 184 },
      { term: 'woodsy jar candle', visits: 92 },
      { term: 'fall scents home', visits: 48 }
    ],
    price: 28,
    shippingCost: 5.50,
    stockLevel: 22,
    weeklyMakeRate: 35,
    leadTimeDays: 2,
    materialsUnitCost: 6.20
  },
  {
    id: 'listing-2',
    title: 'Personalised oak cutting board, engraved wedding & anniversary gift',
    category: 'Kitchen & Dining',
    thumbnail: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
    description: 'Carved from sustainably harvested European white oak, precision laser-engraved with family crest, names, or meaningful dates. Finished by hand with food-grade organic mineral oil and organic beeswax.\n\n• Deep juice groove on reversible side\n• Ergonomic thumb handle\n• 16" x 10" x 1.25" solid hardwood',
    tags: ['personalised board', 'engraved cutting', 'wedding gift oak', 'custom wood board', 'charcuterie tray', 'anniversary gift', 'kitchen keepsake'],
    impressions: 25860,
    visits: 422,
    addToCart: 61,
    orders: 17,
    revenue: 534,
    netRevenue: 437,
    ctr: 1.63,
    listingAgeDays: 240,
    momentum: 'stable',
    seasonIndex: 1.13,
    flags: [],
    topSearchTerms: [
      { term: 'personalised cutting board', visits: 210 },
      { term: 'engraved wedding cutting board', visits: 112 },
      { term: 'oak cheese board custom', visits: 64 }
    ],
    price: 68,
    shippingCost: 8.50,
    stockLevel: 14,
    weeklyMakeRate: 10,
    leadTimeDays: 4,
    materialsUnitCost: 14.50
  },
  {
    id: 'listing-3',
    title: 'Ceramic pour-over dripper, matte speckled stoneware coffee maker',
    category: 'Kitchen & Dining',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-craft wheel thrown stoneware coffee dripper with interior radial ridges engineered for consistent brew extraction. Matte bone white glaze with iron specks.\n\n• Fits standard v60 size 02 paper filters\n• Dishwasher & microwave safe ceramic\n• Designed to sit securely on mugs from 2.75" to 4" diameter',
    tags: ['ceramic dripper', 'pour over coffee', 'stoneware dripper', 'slow coffee maker', 'barista gift', 'minimalist coffee', 'hand thrown pottery'],
    impressions: 25654,
    visits: 103,
    addToCart: 4,
    orders: 0,
    revenue: 0,
    netRevenue: 0,
    ctr: 0.40,
    listingAgeDays: 90,
    momentum: 'stable',
    seasonIndex: 0.00,
    flags: ['seen_never_bought'],
    whyFlagged: 'High impressions (25,654) but very low 0.40% CTR and 0 orders. The primary thumbnail is underexposed and shoppers scroll past before seeing the brew ridges.',
    cartToOrderRatio: '4% add to cart, 0% checkout conversion',
    topSearchTerms: [
      { term: 'ceramic coffee dripper', visits: 54 },
      { term: 'pour over stoneware', visits: 28 },
      { term: 'hand thrown dripper', visits: 12 }
    ],
    price: 44,
    shippingCost: 6.00,
    stockLevel: 8,
    weeklyMakeRate: 12,
    leadTimeDays: 7,
    materialsUnitCost: 7.80
  },
  {
    id: 'listing-4',
    title: 'Linen apron, stonewashed clay cross-back pinafore with deep pockets',
    category: 'Clothing & Accessories',
    thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
    description: '100% European flax linen pinafore apron. Japanese style cross-back design requires no uncomfortable neck strap or waist ties. Pre-washed for buttery softness.\n\n• Two reinforced roomy front patch pockets\n• Breathable, thermoregulating pure linen\n• One size comfortably fits US 4-14',
    tags: ['linen apron', 'cross back apron', 'pinafore apron', 'clay linen', 'gardening smock', 'baking apron', 'japanese apron', 'linen smock'],
    impressions: 24877,
    visits: 443,
    addToCart: 58,
    orders: 16,
    revenue: 557,
    netRevenue: 456,
    ctr: 1.78,
    listingAgeDays: 365,
    momentum: 'declining',
    seasonIndex: 1.00,
    flags: ['declining_momentum'],
    whyFlagged: 'Traffic and conversion momentum down for 8 consecutive weeks. Seasonality index has drifted from 1.35x to 1.00x as autumn kitchen search queries evolve.',
    topSearchTerms: [
      { term: 'linen apron clay', visits: 198 },
      { term: 'cross back pinafore linen', visits: 124 },
      { term: 'japanese pottery apron', visits: 72 }
    ],
    price: 58,
    shippingCost: 5.00,
    stockLevel: 19,
    weeklyMakeRate: 15,
    leadTimeDays: 3,
    materialsUnitCost: 12.00
  },
  {
    id: 'listing-5',
    title: 'Botanical letterpress card set, handmade wildflower greeting cards',
    category: 'Paper & Party Supplies',
    thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    description: 'Set of 6 letterpress note cards printed on an antique 1914 Chandler & Price press using heavyweight 100% cotton rag paper. Deep textural impression of botanicals.\n\n• Blank inside for personal message\n• Paired with matching kraft paper envelopes\n• Packaged in recyclable protective paper sleeve',
    tags: ['letterpress cards', 'botanical stationery', 'wildflower notes', 'cotton paper cards', 'hand printed cards', 'gratitude notes', 'pressed flowers'],
    impressions: 22770,
    visits: 376,
    addToCart: 49,
    orders: 15,
    revenue: 624,
    netRevenue: 511,
    ctr: 1.65,
    listingAgeDays: 210,
    momentum: 'stable',
    seasonIndex: 0.88,
    flags: [],
    topSearchTerms: [
      { term: 'botanical letterpress cards', visits: 162 },
      { term: 'handmade thank you stationery', visits: 94 },
      { term: 'pressed plant cards', visits: 58 }
    ],
    price: 24,
    shippingCost: 3.50,
    stockLevel: 45,
    weeklyMakeRate: 50,
    leadTimeDays: 1,
    materialsUnitCost: 3.50
  },
  {
    id: 'listing-6',
    title: 'Speckled stoneware mug, 12oz hand thrown ceramic coffee cup with handle',
    category: 'Kitchen & Dining',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable oversized hand loop handle with thumb rest. Wheel thrown with buff clay and finished in toasted marshmallow glaze with raw clay foot ring.\n\n• 12 fl oz capacity (approx 350ml)\n• Lead-free, food-safe glaze formula\n• Microwave & dishwasher durable',
    tags: ['stoneware mug', 'speckled ceramic mug', 'coffee cup 12oz', 'hand thrown pottery', 'cozy ceramic mug', 'tea mug rustic', 'morning ritual'],
    impressions: 19284,
    visits: 309,
    addToCart: 41,
    orders: 12,
    revenue: 622,
    netRevenue: 509,
    ctr: 1.60,
    listingAgeDays: 400,
    momentum: 'stable',
    seasonIndex: 1.00,
    flags: [],
    topSearchTerms: [
      { term: 'speckled stoneware mug', visits: 142 },
      { term: 'ceramic coffee cup hand thrown', visits: 88 },
      { term: 'rustic morning mug', visits: 40 }
    ],
    price: 36,
    shippingCost: 6.50,
    stockLevel: 9,
    weeklyMakeRate: 16,
    leadTimeDays: 6,
    materialsUnitCost: 5.50
  },
  {
    id: 'listing-7',
    title: 'Wool felt slippers, adult sizes warm indoor mules with suede leather sole',
    category: 'Shoes & Slippers',
    thumbnail: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
    description: 'Seamless wet-felted 100% natural unbleached New Zealand wool slippers. Molds naturally to foot contours while allowing natural breathability.\n\n• Non-slip vegetable-tanned suede leather outsole\n• Cushioned 6mm wool felt insole\n• Available in EU 36 to 46 (US 5 to 13)',
    tags: ['wool felt slippers', 'warm indoor shoes', 'house mules wool', 'suede sole slippers', 'winter felt footwear', 'natural fiber shoes', 'scandi slipper'],
    impressions: 18416,
    visits: 326,
    addToCart: 52,
    orders: 0,
    revenue: 0,
    netRevenue: 0,
    ctr: 1.77,
    listingAgeDays: 150,
    momentum: 'stable',
    seasonIndex: 0.00,
    flags: ['seen_never_bought', 'high_cart_low_checkout'],
    whyFlagged: '52 shoppers added these slippers to cart, but 0 completed checkout (0% conversion). Sizing guide confusion or high domestic shipping tier is causing abandonment at checkout.',
    cartToOrderRatio: '16.0% add to cart, 0.0% checkout conversion',
    topSearchTerms: [
      { term: 'felt slippers wool', visits: 154 },
      { term: 'indoor wool mules suede', visits: 82 },
      { term: 'natural house shoes', visits: 44 }
    ],
    price: 54,
    shippingCost: 9.50,
    stockLevel: 11,
    weeklyMakeRate: 8,
    leadTimeDays: 5,
    materialsUnitCost: 16.00
  },
  {
    id: 'listing-8',
    title: 'Brass herb snips with hand-stitched leather sheath garden scissors',
    category: 'Home & Garden',
    thumbnail: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
    description: 'Forged solid brass traditional bonsai and kitchen herb snips. Razor sharp high carbon steel core sandwiched between brass arms for lasting edge retention.\n\n• Includes custom vegetable tanned bridle leather protector\n• 4.5" length, perfect for indoor windowsill herb gardens\n• Embossed gift packaging included',
    tags: ['brass herb snips', 'garden scissors', 'bonsai shears', 'leather sheath', 'kitchen herb cutter', 'gardener gift', 'artisan tools'],
    impressions: 18240,
    visits: 326,
    addToCart: 44,
    orders: 12,
    revenue: 581,
    netRevenue: 476,
    ctr: 1.79,
    listingAgeDays: 300,
    momentum: 'improving',
    seasonIndex: 1.09,
    flags: [],
    topSearchTerms: [
      { term: 'brass herb snips', visits: 146 },
      { term: 'garden scissors leather case', visits: 86 },
      { term: 'botanical pruning shears', visits: 42 }
    ],
    price: 48,
    shippingCost: 5.00,
    stockLevel: 24,
    weeklyMakeRate: 20,
    leadTimeDays: 3,
    materialsUnitCost: 11.00
  },
  {
    id: 'listing-9',
    title: 'Dried flower wreath, autumn mix with eucalyptus, wheat & strawflowers',
    category: 'Home Decor',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    description: 'Everlasting seasonal door and wall wreath hand-bound onto natural grapevine base. Features naturally dried golden wheat, silver dollar eucalyptus, and peach strawflowers.\n\n• 16-18" outside diameter\n• Treated with UV botanical protectant for indoor longevity\n• Ships securely wired in reinforced keepsake box',
    tags: ['dried flower wreath', 'autumn wall wreath', 'eucalyptus wreath', 'thanksgiving door decor', 'strawflower wreath', 'harvest decor', 'everlasting floral'],
    impressions: 16723,
    visits: 263,
    addToCart: 35,
    orders: 11,
    revenue: 607,
    netRevenue: 497,
    ctr: 1.57,
    listingAgeDays: 60,
    momentum: 'improving',
    seasonIndex: 0.92,
    flags: [],
    topSearchTerms: [
      { term: 'dried flower autumn wreath', visits: 118 },
      { term: 'harvest door wreath eucalyptus', visits: 72 },
      { term: 'everlasting fall floral', visits: 38 }
    ],
    price: 72,
    shippingCost: 11.00,
    stockLevel: 6,
    weeklyMakeRate: 8,
    leadTimeDays: 4,
    materialsUnitCost: 18.00
  },
  {
    id: 'listing-10',
    title: 'Beeswax food wraps, set of 3 reusable organic cotton food covers',
    category: 'Kitchen & Dining',
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'GOTS-certified organic cotton fabric infused with pure beeswax, organic jojoba oil, and tree resin. Natural antibacterial seal activated with hand warmth.\n\n• Includes Small (7x8"), Medium (10x11"), and Large (13x14")\n• Replaces single-use cling film for cheese, sandwiches & produce\n• Washable in cool water with gentle soap',
    tags: ['beeswax wraps', 'reusable food cover', 'zero waste kitchen', 'plastic free storage', 'organic cotton wrap', 'eco friendly gift', 'sustainable kitchen'],
    impressions: 14641,
    visits: 261,
    addToCart: 36,
    orders: 9,
    revenue: 558,
    netRevenue: 457,
    ctr: 1.78,
    listingAgeDays: 500,
    momentum: 'stable',
    seasonIndex: 1.29,
    flags: [],
    topSearchTerms: [
      { term: 'beeswax food wraps 3 pack', visits: 122 },
      { term: 'reusable bowl covers cotton', visits: 66 },
      { term: 'zero waste lunch wrap', visits: 34 }
    ],
    price: 22,
    shippingCost: 4.00,
    stockLevel: 55,
    weeklyMakeRate: 40,
    leadTimeDays: 2,
    materialsUnitCost: 4.00
  },
  {
    id: 'listing-11',
    title: 'Embroidered market tote, botanical linen canvas heavy duty everyday bag',
    category: 'Bags & Purses',
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    description: 'Heavyweight 14oz washed cotton canvas tote bag with dense botanical meadow hand-embroidery. Reinforced box stitching at handles and flat bottom base.\n\n• Interior zipped slip pocket for keys & phone\n• Magnetic snap closure\n• 15" tall x 14" wide with 5" expandable gusset',
    tags: ['embroidered tote bag', 'botanical canvas bag', 'linen market shopper', 'canvas book tote', 'wildflower embroidery', 'grocery tote heavy duty'],
    impressions: 14149,
    visits: 57,
    addToCart: 5,
    orders: 2,
    revenue: 117,
    netRevenue: 96,
    ctr: 0.40,
    listingAgeDays: 45,
    momentum: 'stable',
    seasonIndex: 1.00,
    flags: [],
    topSearchTerms: [
      { term: 'embroidered market tote', visits: 28 },
      { term: 'botanical canvas bag', visits: 16 },
      { term: 'floral grocery shopper', visits: 7 }
    ],
    price: 42,
    shippingCost: 5.00,
    stockLevel: 7,
    weeklyMakeRate: 6,
    leadTimeDays: 5,
    materialsUnitCost: 9.50
  },
  {
    id: 'listing-12',
    title: 'Custom pet portrait, ink on cold-press paper original watercolor sketch',
    category: 'Art & Collectibles',
    thumbnail: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-painted pet portrait created from your favorite photo. Drawn with waterproof archival sepia ink and finished with soft watercolor washes on 300gsm Arches paper.\n\n• Unframed 8" x 10" standard size\n• Digital proof sent via Etsy messages within 4 business days\n• Signed by artist on front and back',
    tags: ['custom pet portrait', 'dog ink sketch', 'cat watercolor art', 'memorial pet painting', 'personalised animal art', 'gift for dog mom', 'artist commission'],
    impressions: 13404,
    visits: 222,
    addToCart: 31,
    orders: 8,
    revenue: 523,
    netRevenue: 428,
    ctr: 1.66,
    listingAgeDays: 720,
    momentum: 'stable',
    seasonIndex: 1.14,
    flags: [],
    topSearchTerms: [
      { term: 'custom pet portrait ink', visits: 104 },
      { term: 'personalized dog watercolor', visits: 62 },
      { term: 'memorial pet sketch', visits: 31 }
    ],
    price: 85,
    shippingCost: 4.50,
    stockLevel: 5,
    weeklyMakeRate: 4,
    leadTimeDays: 8,
    materialsUnitCost: 8.00
  }
];

export const INITIAL_SEARCH_TERMS: SearchTermItem[] = [
  {
    term: 'personalised cutting board',
    visitsThisPeriod: 210,
    visitsLastYear: 328,
    seasonIndex: 0.64,
    isAttention: true
  },
  {
    term: 'linen apron',
    visitsThisPeriod: 198,
    visitsLastYear: 282,
    seasonIndex: 0.70,
    isAttention: true
  },
  {
    term: 'letterpress cards',
    visitsThisPeriod: 162,
    visitsLastYear: 238,
    seasonIndex: 0.68,
    isAttention: true
  },
  {
    term: 'soy candle fig cedar',
    visitsThisPeriod: 184,
    visitsLastYear: 142,
    seasonIndex: 1.30,
    isAttention: false
  },
  {
    term: 'speckled stoneware mug',
    visitsThisPeriod: 142,
    visitsLastYear: 140,
    seasonIndex: 1.01,
    isAttention: false
  },
  {
    term: 'wool felt slippers',
    visitsThisPeriod: 154,
    visitsLastYear: 158,
    seasonIndex: 0.97,
    isAttention: false
  },
  {
    term: 'ceramic coffee dripper',
    visitsThisPeriod: 54,
    visitsLastYear: 122,
    seasonIndex: 0.44,
    isAttention: true
  },
  {
    term: 'dried flower autumn wreath',
    visitsThisPeriod: 118,
    visitsLastYear: 128,
    seasonIndex: 0.92,
    isAttention: false
  }
];

export const INITIAL_HISTORICAL_MONTHS: HistoricalMonthItem[] = [
  { month: 'Oct', year: 2025, visits: 4120, orders: 134, conversionRate: 3.25, grossRevenue: 5920, netRevenue: 5010, lastYearRevenue: 5120, seasonIndex: 1.15 },
  { month: 'Nov', year: 2025, visits: 6840, orders: 248, conversionRate: 3.62, grossRevenue: 10450, netRevenue: 8850, lastYearRevenue: 9200, seasonIndex: 1.13 },
  { month: 'Dec', year: 2025, visits: 8920, orders: 342, conversionRate: 3.83, grossRevenue: 14890, netRevenue: 12620, lastYearRevenue: 13100, seasonIndex: 1.14 },
  { month: 'Jan', year: 2026, visits: 2980, orders: 84, conversionRate: 2.81, grossRevenue: 3480, netRevenue: 2950, lastYearRevenue: 3410, seasonIndex: 1.02 },
  { month: 'Feb', year: 2026, visits: 3120, orders: 92, conversionRate: 2.95, grossRevenue: 3890, netRevenue: 3300, lastYearRevenue: 3750, seasonIndex: 1.04 },
  { month: 'Mar', year: 2026, visits: 3450, orders: 104, conversionRate: 3.01, grossRevenue: 4320, netRevenue: 3660, lastYearRevenue: 4190, seasonIndex: 1.03 },
  { month: 'Apr', year: 2026, visits: 3680, orders: 118, conversionRate: 3.20, grossRevenue: 4980, netRevenue: 4220, lastYearRevenue: 4720, seasonIndex: 1.05 },
  { month: 'May', year: 2026, visits: 4210, orders: 138, conversionRate: 3.27, grossRevenue: 5840, netRevenue: 4950, lastYearRevenue: 5520, seasonIndex: 1.06 },
  { month: 'Jun', year: 2026, visits: 3820, orders: 115, conversionRate: 3.01, grossRevenue: 4890, netRevenue: 4140, lastYearRevenue: 4940, seasonIndex: 0.99 },
  { month: 'Jul', year: 2026, visits: 3510, orders: 106, conversionRate: 3.02, grossRevenue: 4480, netRevenue: 3790, lastYearRevenue: 4610, seasonIndex: 0.97 },
  { month: 'Aug', year: 2026, visits: 3490, orders: 103, conversionRate: 2.95, grossRevenue: 4380, netRevenue: 3710, lastYearRevenue: 4520, seasonIndex: 0.97 },
  { month: 'Sep (Current)', year: 2026, visits: 3681, orders: 112, conversionRate: 3.70, grossRevenue: 5201, netRevenue: 4412, lastYearRevenue: 4810, seasonIndex: 1.08 }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'red',
    title: 'Ceramic pour-over dripper: 0 orders from 25,654 impressions for 30 days',
    listingTitle: 'Ceramic pour-over dripper, matte speckled stoneware coffee maker',
    message: 'Extreme search visibility with 0.40% CTR indicates primary thumbnail image failure. Shoppers bypass the listing in search results.',
    metricInfo: '25,654 imp · 103 visits · 0 orders · 0.00× index',
    timeAgo: 'Updated 2h ago',
    resolved: false,
    listingId: 'listing-3'
  },
  {
    id: 'alert-2',
    type: 'red',
    title: 'Wool felt slippers: 52 add-to-carts but 0 orders — checkout friction',
    listingTitle: 'Wool felt slippers, adult sizes warm indoor mules with suede leather sole',
    message: 'High desire but sudden abandonment at cart. Likely caused by high shipping tier or ambiguous European-to-US shoe size conversion.',
    metricInfo: '52 add to cart · 0 checkout · 0.00× index',
    timeAgo: 'Updated 5h ago',
    resolved: false,
    listingId: 'listing-7'
  },
  {
    id: 'alert-3',
    type: 'amber',
    title: 'Linen apron: momentum declining for 8 weeks',
    listingTitle: 'Linen apron, stonewashed clay cross-back pinafore with deep pockets',
    message: 'Trailing visits dropped from 1.35x seasonal index down to 1.00x. Seasonal search phrasing has shifted from summer cooking to holiday baking.',
    metricInfo: '8 weeks declining · 443 visits · 1.00× index',
    timeAgo: 'Updated 1d ago',
    resolved: false,
    listingId: 'listing-4'
  },
  {
    id: 'alert-4',
    type: 'amber',
    title: 'Personalised cutting board search term down 0.64× vs last year',
    message: 'Shoppers previously reached this item through general anniversary keywords. Check whether title and tags match current gift phrasing.',
    metricInfo: '210 visits vs 328 last year · 0.64× pace',
    timeAgo: 'Updated 2d ago',
    resolved: false,
    listingId: 'listing-2'
  }
];

export const INITIAL_AUDIT_LOG: ListingEditRecord[] = [
  {
    id: 'edit-100',
    listingId: 'listing-1',
    listingTitle: 'Hand-poured soy candle, fig & cedarwood artisan candle in amber jar',
    timestamp: '2 hours ago',
    fieldChanged: 'tags',
    oldValue: {
      tags: ['soy candle', 'scented candle', 'jar candle', 'fall candle', 'cozy home']
    },
    newValue: {
      tags: ['soy candle', 'fig cedar candle', 'amber glass jar', 'hand poured candle', 'woodsy scent', 'fall decor', 'cozy gift']
    },
    status: 'published',
    canUndoUntil: 'Active (22 hours remaining)'
  },
  {
    id: 'edit-101',
    listingId: 'listing-1',
    listingTitle: 'Hand-poured soy candle, fig & cedarwood artisan candle in amber jar',
    timestamp: '14 days ago',
    fieldChanged: 'tags',
    oldValue: {
      tags: ['soy candle', 'scented candle', 'jar candle', 'fall candle', 'cozy home']
    },
    newValue: {
      tags: ['soy candle', 'fig cedar candle', 'amber glass jar', 'hand poured candle', 'woodsy scent', 'artisan candle', 'fall home decor', 'cozy gift', 'clean burning']
    },
    status: 'published',
    canUndoUntil: 'Expired (Past 24h)',
    postEditPerformance: {
      daysTracked: 14,
      preEditMetrics: {
        visits: 312,
        ctr: 1.25,
        orders: 11,
        revenue: 308
      },
      postEditMetrics: {
        visits: 454,
        ctr: 1.56,
        orders: 18,
        revenue: 504
      },
      rawLiftPct: 45.5,
      categorySeasonLiftPct: 14.2,
      netAttributedLiftPct: 31.3,
      status: 'positive_lift',
      verdict: 'Outperformed general home candle seasonality by +31.3% net lift. The long-tail "fig cedar candle" & "woodsy scent" tags unlocked qualified high-intent holiday searchers.'
    }
  },
  {
    id: 'edit-102',
    listingId: 'listing-2',
    listingTitle: 'Personalised oak cutting board, engraved wedding & anniversary gift',
    timestamp: '18 days ago',
    fieldChanged: 'title',
    oldValue: {
      title: 'Oak Cutting Board With Custom Laser Engraving Kitchen Gift'
    },
    newValue: {
      title: 'Personalised oak cutting board, engraved wedding & anniversary gift'
    },
    status: 'published',
    canUndoUntil: 'Expired (Past 24h)',
    postEditPerformance: {
      daysTracked: 14,
      preEditMetrics: {
        visits: 360,
        ctr: 1.38,
        orders: 12,
        revenue: 372
      },
      postEditMetrics: {
        visits: 422,
        ctr: 1.63,
        orders: 17,
        revenue: 534
      },
      rawLiftPct: 17.2,
      categorySeasonLiftPct: 6.5,
      netAttributedLiftPct: 10.7,
      status: 'positive_lift',
      verdict: 'Front-loading "Personalised oak cutting board" produced a +10.7% net traffic lift above category baseline, while lift in CTR from 1.38% to 1.63% confirmed higher click engagement on mobile search.'
    }
  },
  {
    id: 'edit-103',
    listingId: 'listing-4',
    listingTitle: 'Linen apron, stonewashed clay cross-back pinafore with deep pockets',
    timestamp: '4 days ago',
    fieldChanged: 'tags',
    oldValue: {
      tags: ['linen apron', 'cross back apron', 'pinafore apron', 'clay linen', 'gardening smock', 'baking apron', 'japanese apron', 'linen smock']
    },
    newValue: {
      tags: ['linen apron', 'cross back apron', 'clay linen smock', 'baking gift apron', 'stonewashed pinafore', 'pottery apron', 'kitchen linen gift']
    },
    status: 'published',
    canUndoUntil: 'Expired (Past 24h)',
    postEditPerformance: {
      daysTracked: 4,
      preEditMetrics: {
        visits: 128,
        ctr: 1.78,
        orders: 4,
        revenue: 139
      },
      postEditMetrics: {
        visits: 132,
        ctr: 1.75,
        orders: 5,
        revenue: 174
      },
      rawLiftPct: 3.1,
      categorySeasonLiftPct: 2.0,
      netAttributedLiftPct: 1.1,
      status: 'collecting_data',
      verdict: '4 days of 14-day cohort elapsed. Initial trend tracking steady with seasonal pace (+1.1% net lift). Recommended observation period: 10 more days.'
    }
  }
];

export const INITIAL_SCHEDULED_RULES: import('../types').ScheduledTagRule[] = [
  {
    id: 'rule-holiday-rush',
    name: 'Holiday Gift Rush Seasonality Transition',
    targetHoliday: 'Christmas & Winter Holiday Gifting',
    scheduledDate: '2026-11-01',
    status: 'scheduled',
    targetListingIds: ['all'],
    tagsToRemove: ['autumn home decor', 'fall table runner', 'halloween gift', 'harvest centerpiece'],
    tagsToAdd: ['christmas gift 2026', 'holiday artisan gift', 'cozy winter gift', 'stocking stuffer', 'unique gifts for her'],
    titlePrefix: 'Holiday Gift - ',
    affectedListingsCount: 8,
    description: 'Sunsets late autumn and Halloween seasonal queries and injects holiday gifting search terms right as Etsy buyer search queries peak in November.'
  },
  {
    id: 'rule-black-friday',
    name: 'Cyber Week & Gifting Surge Kickoff',
    targetHoliday: 'Cyber Week & Black Friday',
    scheduledDate: '2026-11-20',
    status: 'scheduled',
    targetListingIds: ['listing-1', 'listing-2', 'listing-6', 'listing-8'],
    tagsToRemove: ['thanksgiving decor', 'fall craft'],
    tagsToAdd: ['cyber week deal', 'holiday gifts under 50', 'artisan secret santa', 'last minute xmas gift'],
    affectedListingsCount: 4,
    description: 'Optimizes high-volume gift items with high-converting Cyber Week long-tail keywords.'
  },
  {
    id: 'rule-new-year-reset',
    name: 'New Year & Mindful Living Reset',
    targetHoliday: 'New Year & Winter Organizing',
    scheduledDate: '2027-01-05',
    status: 'paused',
    targetListingIds: ['all'],
    tagsToRemove: ['christmas gift', 'holiday artisan gift', 'stocking stuffer', 'secret santa'],
    tagsToAdd: ['mindful home decor', 'new year gift', 'winter cozy home', 'minimalist aesthetic', 'sustainable craft'],
    affectedListingsCount: 8,
    description: 'Transitions shop keywords out of holiday rush into winter self-care, sustainable living, and cozy home refresh themes.'
  }
];

export const INITIAL_ORDER_BATCH_SLIPS: import('../types').ArtisanOrderBatchSlip[] = [
  {
    orderId: 'ETSY-29481',
    customerName: 'Eleanor Vance',
    destinationCity: 'Seattle, WA',
    destinationCountry: 'US',
    orderDate: '2026-09-11 09:14',
    shippingCutoffDate: '2026-09-14 (Mon)',
    shippingMethod: 'USPS Priority',
    carrierCutoffHoursLeft: 38,
    urgencyStatus: 'critical',
    isPacked: false,
    items: [
      {
        listingId: 'listing-1',
        title: 'Ceramic coffee mug, rustic speckled stoneware pottery cup',
        quantity: 2,
        variation: 'Warm Oatmeal / 12 oz',
        materials: 'Speckled stoneware clay, lead-free food-safe matte glaze',
        isCustomized: true,
        personalizationNote: 'Gift note: "Happy 30th Birthday to my favorite coffee partner! Love, Sam"'
      }
    ],
    packagingChecklist: [
      { id: 'chk-1', label: 'Inspect rim and handle under workshop daylight for glaze micro-crazing', completed: true },
      { id: 'chk-2', label: 'Wrap each piece in biodegradable embossed honeycomb paper (3 wraps minimum)', completed: false },
      { id: 'chk-3', label: 'Enclose handwritten studio botanical thank-you note', completed: false },
      { id: 'chk-4', label: 'Print & affix thermal USPS shipping label onto 8x8x8 corrugated box', completed: false }
    ]
  },
  {
    orderId: 'ETSY-29485',
    customerName: 'Marcus Thorne',
    destinationCity: 'Edinburgh',
    destinationCountry: 'UK',
    orderDate: '2026-09-11 11:22',
    shippingCutoffDate: '2026-09-15 (Tue)',
    shippingMethod: 'Royal Mail Tracked 24',
    carrierCutoffHoursLeft: 62,
    urgencyStatus: 'urgent',
    isPacked: false,
    items: [
      {
        listingId: 'listing-4',
        title: 'Linen apron, stonewashed clay cross-back pinafore with deep pockets',
        quantity: 1,
        variation: 'Earthy Clay / Regular (Fits US 4-12)',
        materials: '100% Certified European Flax Linen, reinforced bar-tack stitching'
      }
    ],
    packagingChecklist: [
      { id: 'chk-5', label: 'Lint roll and steam press cross-back linen straps', completed: true },
      { id: 'chk-6', label: 'Tie with natural jute twine and dried lavender sprig', completed: true },
      { id: 'chk-7', label: 'Insert UK customs declaration CN22 document pouch', completed: false }
    ]
  },
  {
    orderId: 'ETSY-29490',
    customerName: 'Chloe Dupont',
    destinationCity: 'Lyon',
    destinationCountry: 'FR',
    orderDate: '2026-09-11 14:05',
    shippingCutoffDate: '2026-09-16 (Wed)',
    shippingMethod: 'DHL Express Air',
    carrierCutoffHoursLeft: 86,
    urgencyStatus: 'normal',
    isPacked: false,
    items: [
      {
        listingId: 'listing-2',
        title: 'Soy wax candle in amber glass jar, cedarwood and vanilla hand poured',
        quantity: 3,
        variation: 'Smoked Cedarwood & Amber / 8 oz',
        materials: '100% American farmed soy wax, FSC wood wick, phthalate-free oils'
      }
    ],
    packagingChecklist: [
      { id: 'chk-8', label: 'Trim wooden wicks to exact 1/8 inch height', completed: false },
      { id: 'chk-9', label: 'Wipe amber glass jars with microfiber cloth', completed: false },
      { id: 'chk-10', label: 'Nest jars into molded kraft pulp safety dividers', completed: false }
    ]
  }
];

export const INITIAL_MATERIALS_REPLENISHMENT: import('../types').MaterialReplenishmentItem[] = [
  {
    id: 'mat-1',
    material: 'Stoneware Clay (Cone 6 Speckled Buff)',
    requiredUnits: 45,
    unit: 'kg',
    inWorkshopStock: 18,
    status: 'critical_shortage',
    estimatedCost: 82.50,
    supplierLeadDays: 6,
    category: 'Ceramics & Pottery'
  },
  {
    id: 'mat-2',
    material: 'Lead-Free Matte Glaze (Warm Oatmeal)',
    requiredUnits: 12,
    unit: 'liters',
    inWorkshopStock: 9,
    status: 'order_soon',
    estimatedCost: 68.00,
    supplierLeadDays: 4,
    category: 'Ceramics & Pottery'
  },
  {
    id: 'mat-3',
    material: 'Natural Golden Soy Wax (464 Flakes)',
    requiredUnits: 30,
    unit: 'kg',
    inWorkshopStock: 35,
    status: 'sufficient',
    estimatedCost: 110.00,
    supplierLeadDays: 3,
    category: 'Candle Craft'
  },
  {
    id: 'mat-4',
    material: 'Recycled Kraft Corrugated Boxes (8x8x8")',
    requiredUnits: 60,
    unit: 'boxes',
    inWorkshopStock: 22,
    status: 'order_soon',
    estimatedCost: 45.00,
    supplierLeadDays: 2,
    category: 'Shipping & Packaging'
  },
  {
    id: 'mat-5',
    material: 'Protective Honeycomb Paper Cushion Roll',
    requiredUnits: 250,
    unit: 'meters',
    inWorkshopStock: 310,
    status: 'sufficient',
    estimatedCost: 38.00,
    supplierLeadDays: 2,
    category: 'Shipping & Packaging'
  }
];

export const INITIAL_ETSY_SYNC_STATUS: import('../types').EtsySyncStatus = {
  connected: true,
  shopId: '38920194',
  shopName: 'The Woodland Artisan Studio',
  userId: 'artisan_maker_77',
  lastSyncedAt: 'Just now (12s ago)',
  tokenExpiresAt: 'in 89 days (Auto-refreshed via OAuth 2.0 PKCE)',
  activeListingsCount: 8,
  openOrdersCount: 3,
  rateLimitRemaining: 4892,
  webhookSubscriptionActive: true,
  recentWebhooks: [
    {
      id: 'wh-101',
      event: 'shop.receipt.created',
      timestamp: '18 mins ago',
      payloadSummary: 'New order ETSY-29490 placed by Chloe Dupont (Lyon, FR)',
      affectedItemTitle: 'Soy wax candle in amber glass jar'
    },
    {
      id: 'wh-102',
      event: 'listing.inventory.updated',
      timestamp: '18 mins ago',
      payloadSummary: 'Stock reduced from 15 to 12 units after receipt checkout',
      affectedItemTitle: 'Soy wax candle in amber glass jar'
    },
    {
      id: 'wh-103',
      event: 'listing.updated',
      timestamp: '2 hours ago',
      payloadSummary: 'Etsy algorithmic search index refreshed listing tags',
      affectedItemTitle: 'Ceramic coffee mug, rustic speckled stoneware pottery cup'
    }
  ]
};

// Initial Customer Loyalty Data
export const INITIAL_LOYALTY_METRICS: import('../types').LoyaltyMetrics = {
  repeatBuyerRate: 28.4,
  totalRepeatRevenue: 2840.00,
  avgDaysBetweenOrders: 44,
  holidayGiftRetentionRate: 36.2,
  activeCouponRedemptions: 42
};

export const INITIAL_LOYALTY_CUSTOMERS: import('../types').LoyaltyCustomer[] = [
  {
    id: 'cust-1',
    customerName: 'Eleanor Vance',
    emailMasked: 'e*****e@gmail.com',
    segment: 'vip_artisan',
    totalOrders: 4,
    lifetimeValue: 342.00,
    firstOrderDate: '2025-11-12',
    lastOrderDate: '2026-08-20',
    daysSinceLastOrder: 22,
    favoriteCategory: 'Ceramics & Pottery',
    notes: 'Avid collector of speckled stoneware. Left glowing 5-star review mentioning rustic comfort weight.',
    nextPredictedReorderWindow: 'Oct 15 - Nov 2 (Holiday Pre-Season)',
    lastPurchasedItems: ['Ceramic coffee mug (Oatmeal)', 'Ceramic pour-over coffee dripper']
  },
  {
    id: 'cust-2',
    customerName: 'Marcus Sterling',
    emailMasked: 'm*****g@outlook.com',
    segment: 'holiday_gifter',
    totalOrders: 2,
    lifetimeValue: 168.00,
    firstOrderDate: '2025-11-28',
    lastOrderDate: '2025-12-14',
    daysSinceLastOrder: 271,
    favoriteCategory: 'Home Fragrance',
    notes: 'Purchased 4 amber jar soy candles as corporate holiday gifts with gift wrapping.',
    nextPredictedReorderWindow: 'Oct 20 - Nov 10 (Corporate Holiday Gifting)',
    lastPurchasedItems: ['Soy wax candle in amber glass jar (Cedarwood & Vanilla) x3']
  },
  {
    id: 'cust-3',
    customerName: 'Chloe Dupont',
    emailMasked: 'c*****t@orange.fr',
    segment: 'collector_repeat',
    totalOrders: 3,
    lifetimeValue: 224.00,
    firstOrderDate: '2026-02-14',
    lastOrderDate: '2026-09-02',
    daysSinceLastOrder: 9,
    favoriteCategory: 'Kitchen & Dining',
    notes: 'International buyer in France. Values sustainable unbleached natural linen and woodcraft.',
    nextPredictedReorderWindow: 'Nov 1 - Nov 15 (Thanksgiving Table Settings)',
    lastPurchasedItems: ['Linen bread bag for sourdough', 'Hand-carved walnut wood spoon']
  },
  {
    id: 'cust-4',
    customerName: 'David Chen',
    emailMasked: 'd*****n@yahoo.com',
    segment: 'at_risk',
    totalOrders: 1,
    lifetimeValue: 48.00,
    firstOrderDate: '2026-03-10',
    lastOrderDate: '2026-03-10',
    daysSinceLastOrder: 185,
    favoriteCategory: 'Gardening & Botanical',
    notes: 'Ordered brass herb snips for spring garden opening. No repurchase in 6 months.',
    nextPredictedReorderWindow: 'Immediate re-engagement opportunity (Autumn harvest care card)',
    lastPurchasedItems: ['Brass herb snips with leather blade sheath']
  },
  {
    id: 'cust-5',
    customerName: 'Sienna Ross',
    emailMasked: 's*****s@icloud.com',
    segment: 'vip_artisan',
    totalOrders: 5,
    lifetimeValue: 418.00,
    firstOrderDate: '2025-09-18',
    lastOrderDate: '2026-07-28',
    daysSinceLastOrder: 45,
    favoriteCategory: 'Home Decor & Florals',
    notes: 'Interior stylist. Buys seasonal wreaths and display ceramics for studio staging.',
    nextPredictedReorderWindow: 'Sept 25 - Oct 10 (Autumn harvest wreath refresh)',
    lastPurchasedItems: ['Dried flower wreath with eucalyptus', 'Ceramic textured vase']
  }
];

export const INITIAL_CARE_TEMPLATES: import('../types').CareInsertTemplate[] = [
  {
    id: 'insert-pottery',
    name: 'Handcrafted Stoneware & Ceramic Care Card',
    category: 'pottery',
    headline: 'Cherish Your Handmade Stoneware',
    careInstructions: [
      'Each piece is hand-thrown on our studio wheel and fired to 2,232°F for daily durability.',
      'Food, microwave, and dishwasher safe. Hand-washing is gently recommended to preserve satin matte glaze patina.',
      'Avoid extreme thermal shock (do not transfer directly from the freezer to a preheated oven).'
    ],
    personalArtisanNote: 'Thank you for inviting our handmade pottery into your daily coffee ritual. Crafted with patience and natural earth clays.',
    qrCodeDestination: 'Review on Etsy & Join Secret Kiln Drops',
    couponCode: 'STUDIOVIP15',
    discountPercent: 15,
    includeSocialHandle: '@thewoodlandartisan'
  },
  {
    id: 'insert-candle',
    name: 'Clean Soy Wax Candle & Amber Jar Longevity Guide',
    category: 'candle_wax',
    headline: 'Burn Clean, Warm & Slow',
    careInstructions: [
      'Allow the wax to melt to the glass edge on your first burn (2–3 hours) to prevent candle tunneling.',
      'Always trim the cotton wick to 1/4" before relighting to prevent soot and ensure a clean amber glow.',
      'Once 1/2" of wax remains, soak jar in warm soapy water to clean and repurpose for stationery or succulents.'
    ],
    personalArtisanNote: 'Hand-poured in small 12-jar batches in our workshop using 100% Midwestern soy wax and phthalate-free botanical oils.',
    qrCodeDestination: 'Reorder Refill Jar with 15% VIP Craft Discount',
    couponCode: 'AUTUMNGLOW15',
    discountPercent: 15,
    includeSocialHandle: '@thewoodlandartisan'
  },
  {
    id: 'insert-textiles',
    name: 'Heirloom Flax Linen & Fiber Care Guide',
    category: 'textiles',
    headline: 'Heirloom Linen Only Softens With Time',
    careInstructions: [
      'Machine wash cold on gentle cycle with mild detergent; avoid chlorine bleach.',
      'Line dry or tumble dry low. Remove slightly damp to preserve natural rustic crushed texture.',
      'Linen breathability keeps artisan sourdough crusts crisp while retaining soft crumb hydration.'
    ],
    personalArtisanNote: 'Woven with certified OEKO-TEX European flax, designed to last decades in your artisan kitchen.',
    qrCodeDestination: 'Explore Our Complete Linen & Kitchen Collection',
    couponCode: 'HEIRLOOM15',
    discountPercent: 15,
    includeSocialHandle: '@thewoodlandartisan'
  },
  {
    id: 'insert-gift',
    name: 'Artisan Thank You & Gifting Insert with Handwritten Signature',
    category: 'general_gift',
    headline: 'A Special Gift, Made by Hand Just for You',
    careInstructions: [
      'Handcrafted in small studio batches with zero factory shortcuts or synthetic fillers.',
      'Every subtle curve and glaze variation is an authentic signature of the maker’s hands.',
      'If you have any questions or custom requests, message our workshop anytime via Etsy.'
    ],
    personalArtisanNote: 'A heartfelt note from our small studio: Your support allows traditional craftsmanship to thrive.',
    qrCodeDestination: 'Leave a 5-Star Review with Photo & Tag Our Studio',
    couponCode: 'MAKERFRIEND15',
    discountPercent: 15,
    includeSocialHandle: '@thewoodlandartisan'
  }
];


