import { RegionConfig, TargetRegion } from '../types';

export const REGIONAL_MARKETS: Record<TargetRegion, RegionConfig> = {
  US: {
    id: 'US',
    label: 'United States (Primary Etsy Market)',
    flagEmoji: '🇺🇸',
    currencySymbol: '$',
    buyerDemographicSummary: 'Accounts for 62% of global Etsy traffic. Peak gift-buying starts early October with Thanksgiving, Black Friday/Cyber Monday, and early December shipping cutoffs.',
    upcomingHolidays: [
      {
        id: 'us-halloween',
        name: 'Halloween & Harvest',
        date: 'Oct 31',
        daysUntil: 50,
        leadTimeWeeks: 4,
        keySearchPhrases: ['halloween home decor', 'autumn harvest tabletop', 'cozy fall scented candle', 'pumpkin artisan decor'],
        advice: 'Front-load cozy rustic keywords now. Shoppers finalize decor purchases by Oct 12.',
        shippingCutoff: 'Oct 22 for standard USPS ground',
        seasonalCategoryImpact: '+35% surge in Home Decor & Kitchen wares'
      },
      {
        id: 'us-thanksgiving-bfcm',
        name: 'Thanksgiving & Black Friday / Cyber Monday',
        date: 'Nov 26 – Nov 30',
        daysUntil: 76,
        leadTimeWeeks: 6,
        keySearchPhrases: ['thanksgiving host gift', 'black friday handmade deal', 'artisan cutting board personalized', 'wood cheese board'],
        advice: 'Highest order-volume week of the year. Ensure inventory lead times are under 3 days.',
        shippingCutoff: 'Nov 18 for guaranteed Thanksgiving arrival',
        seasonalCategoryImpact: '+85% surge in dining, kitchen gifts, and hostess bundles'
      },
      {
        id: 'us-holiday-peak',
        name: 'Christmas & Holiday Gift Cutoff',
        date: 'Dec 25',
        daysUntil: 105,
        leadTimeWeeks: 8,
        keySearchPhrases: ['holiday gift for her', 'unique artisan gifts under 50', 'stocking stuffer handmade', 'christmas morning ceramic mug'],
        advice: 'Listings with $35 Free Shipping Guarantee convert 32% higher during the December crunch.',
        shippingCutoff: 'Dec 15 (Priority Mail) / Dec 18 (Express)',
        seasonalCategoryImpact: '+140% peak platform multiplier across all handmade categories'
      },
      {
        id: 'us-valentines',
        name: "Valentine's Day",
        date: 'Feb 14',
        daysUntil: 156,
        leadTimeWeeks: 5,
        keySearchPhrases: ['valentines gift for partner', 'custom keepsake gift', 'candle gift set couples', 'anniversary handmade gift'],
        advice: 'Stage keywords by Jan 10. Emphasis on personalization and romantic keepsake packaging.',
        shippingCutoff: 'Feb 6 for standard delivery',
        seasonalCategoryImpact: '+45% bump in candles, pottery, and personalized woodcraft'
      }
    ]
  },
  UK: {
    id: 'UK',
    label: 'United Kingdom (UK Shoppers)',
    flagEmoji: '🇬🇧',
    currencySymbol: '£',
    buyerDemographicSummary: 'Etsy’s 2nd largest buyer base. High preference for Royal Mail tracked delivery, distinct Mothering Sunday timing in March, and Boxing Day gifting traditions.',
    upcomingHolidays: [
      {
        id: 'uk-bonfire-night',
        name: 'Guy Fawkes / Autumn Season',
        date: 'Nov 5',
        daysUntil: 55,
        leadTimeWeeks: 4,
        keySearchPhrases: ['autumn home decor uk', 'cozy night in candle', 'hand thrown pottery mug uk', 'hygge gifts handmade'],
        advice: 'Target British domestic phrases ("cosy", "bespoke", "autumnal warmth").',
        shippingCutoff: 'Oct 29 (Royal Mail 48)',
        seasonalCategoryImpact: '+28% seasonal demand for warm ceramic and woolen items'
      },
      {
        id: 'uk-christmas-peak',
        name: 'Christmas & Boxing Day',
        date: 'Dec 25 – 26',
        daysUntil: 105,
        leadTimeWeeks: 7,
        keySearchPhrases: ['secret santa gifts under 20', 'bespoke christmas gift', 'artisan stocking fillers uk', 'handmade festive decor'],
        advice: 'Royal Mail strikes and peak delivery backlogs mean UK buyers stop ordering 4 days earlier than US buyers.',
        shippingCutoff: 'Dec 17 (Royal Mail Tracked 24)',
        seasonalCategoryImpact: '+125% holiday peak in handcrafted homewares'
      },
      {
        id: 'uk-mothering-sunday',
        name: 'Mothering Sunday (UK Mother’s Day)',
        date: 'Mar 14',
        daysUntil: 184,
        leadTimeWeeks: 6,
        keySearchPhrases: ['mothers day gift bespoke', 'mum birthday gift handmade', 'artisan linen apron uk', 'pottery plant mister'],
        advice: 'CRITICAL DIFFERENCE: UK Mother’s Day is in mid-March, whereas the US is in May! US-only sellers miss this massive £300M market.',
        shippingCutoff: 'Mar 8 for domestic Royal Mail',
        seasonalCategoryImpact: '+65% surge in bespoke home accessories and floral stationery'
      }
    ]
  },
  EU: {
    id: 'EU',
    label: 'European Union (Germany, France, Nordics)',
    flagEmoji: '🇪🇺',
    currencySymbol: '€',
    buyerDemographicSummary: 'Strong demand for sustainable, plastic-free craftsmanship, certified eco-materials, and early St. Nicholas Day (Dec 6) gift traditions in Germany/Austria.',
    upcomingHolidays: [
      {
        id: 'eu-st-nicholas',
        name: 'St. Nicholas Day (Nikolaustag)',
        date: 'Dec 6',
        daysUntil: 86,
        leadTimeWeeks: 5,
        keySearchPhrases: ['nikolaus geschenk klein', 'cadeau saint nicolas fait main', 'sustainable stocking filler', 'wood craft eco gift'],
        advice: 'Shoppers in Germany, Netherlands, and Belgium expect delivery by Dec 5th for boot gifting.',
        shippingCutoff: 'Nov 27 for DHL cross-border EU packet',
        seasonalCategoryImpact: '+48% early December bump in small craft gifts & kitchen items'
      },
      {
        id: 'eu-christmas-eve',
        name: 'Heiligabend / Christmas Eve Gifting',
        date: 'Dec 24',
        daysUntil: 104,
        leadTimeWeeks: 7,
        keySearchPhrases: ['weihnachtsgeschenk handgemacht', 'cadeau noel artisanal', 'scandi style home decor', 'minimalist ceramics'],
        advice: 'EU buyers celebrate and open gifts on Christmas Eve (Dec 24). Highlight plastic-free packaging and natural linen materials.',
        shippingCutoff: 'Dec 14 for domestic EU tracked',
        seasonalCategoryImpact: '+110% holiday gifting surge'
      },
      {
        id: 'eu-epiphany',
        name: 'Epiphany / Three Kings (Día de Reyes)',
        date: 'Jan 6',
        daysUntil: 117,
        leadTimeWeeks: 4,
        keySearchPhrases: ['reyes magos regalos artesania', 'galette des rois table decor', 'artisan winter gift'],
        advice: 'Spain and Southern Europe gift-giving extends through Jan 6, providing post-Christmas sales buffer.',
        shippingCutoff: 'Dec 28 for EU priority',
        seasonalCategoryImpact: '+30% extension to traditional Q4 holiday taper'
      }
    ]
  },
  AU: {
    id: 'AU',
    label: 'Australia & Southern Hemisphere',
    flagEmoji: '🇦🇺',
    currencySymbol: 'A$',
    buyerDemographicSummary: 'Inverted seasons! September is early Spring; December is high summer. Demand peaks for lightweight breathable linens, outdoor dining, and summer holiday gifting.',
    upcomingHolidays: [
      {
        id: 'au-spring-renovation',
        name: 'Spring Renewal & Outdoor Living',
        date: 'Sep – Oct',
        daysUntil: 25,
        leadTimeWeeks: 3,
        keySearchPhrases: ['spring tabletop linen', 'outdoor dining wood board', 'ceramic coffee cup beach house', 'handmade breathable apron'],
        advice: 'INVERTED SEASON: Avoid winter tags like "chunky knit" or "flannel". Promote lightweight stonewashed linen and outdoor entertaining.',
        shippingCutoff: 'Australia Post domestic 3-5 days',
        seasonalCategoryImpact: '+42% surge in Spring home refreshing'
      },
      {
        id: 'au-summer-christmas',
        name: 'Summer Christmas & Boxing Day',
        date: 'Dec 25',
        daysUntil: 105,
        leadTimeWeeks: 6,
        keySearchPhrases: ['summer christmas gift australia', 'beach house decor artisan', 'bbq cutting board bespoke', 'aussie maker gift'],
        advice: 'Christmas in hot summer weather: focus on barbecue boards, chilled drink ceramics, and lightweight linen pinafores.',
        shippingCutoff: 'Dec 12 for Australia Post parcel post',
        seasonalCategoryImpact: '+95% seasonal holiday spike'
      },
      {
        id: 'au-winter-cozy',
        name: 'Mid-Year Winter & Woolen Season',
        date: 'Jun – Jul',
        daysUntil: 290,
        leadTimeWeeks: 6,
        keySearchPhrases: ['winter felt slippers australia', 'warm wool mules', 'heavy ceramic mug winter', 'cozy indoor lighting'],
        advice: 'Australia’s coldest months are June and July. This is the prime time to liquidate wool slippers and warm heavy ceramics.',
        shippingCutoff: 'June 1 for winter gifting',
        seasonalCategoryImpact: '+55% winter peak during Northern Hemisphere summer lull'
      }
    ]
  }
};
