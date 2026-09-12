export interface CategoryBenchmarkData {
  id: string;
  name: string;
  description: string;
  typicalPeak: string;
  monthlyIndices: {
    month: string;
    seasonIndex: number;
    avgConversionRate: number; // percentage
    insight: string;
  }[];
}

export const CATEGORY_BENCHMARKS: Record<string, CategoryBenchmarkData> = {
  home_living: {
    id: 'home_living',
    name: 'Home & Living (Handmade & Decor)',
    description: 'Platform average for candles, ceramic wares, artisanal kitchen, and home textiles.',
    typicalPeak: 'Nov - Dec (Holiday Gifting) & May (Mother\'s Day)',
    monthlyIndices: [
      { month: 'Jan', seasonIndex: 0.81, avgConversionRate: 2.1, insight: 'Post-holiday lull and gift return window across Etsy.' },
      { month: 'Feb', seasonIndex: 0.88, avgConversionRate: 2.3, insight: 'Modest uptick for Valentine\'s Day home dining & gifts.' },
      { month: 'Mar', seasonIndex: 0.94, avgConversionRate: 2.4, insight: 'Spring refresh and easter tabletop decor interest.' },
      { month: 'Apr', seasonIndex: 0.98, avgConversionRate: 2.5, insight: 'Early Mother\'s Day shopping ramps up.' },
      { month: 'May', seasonIndex: 1.08, avgConversionRate: 2.8, insight: 'Peak spring surge driven by Mother\'s Day & outdoor entertaining.' },
      { month: 'Jun', seasonIndex: 0.91, avgConversionRate: 2.3, insight: 'Summer slowdown as shoppers spend outdoors.' },
      { month: 'Jul', seasonIndex: 0.86, avgConversionRate: 2.2, insight: 'Mid-summer low point across general home goods.' },
      { month: 'Aug', seasonIndex: 0.89, avgConversionRate: 2.3, insight: 'Early fall decor searches begin late August.' },
      { month: 'Sep', seasonIndex: 1.04, avgConversionRate: 2.6, insight: 'Cozy autumn transition; candle & wool searches surge +35%.' },
      { month: 'Oct', seasonIndex: 1.15, avgConversionRate: 2.9, insight: 'Pre-holiday planning and early gift basket hunting.' },
      { month: 'Nov', seasonIndex: 1.48, avgConversionRate: 3.8, insight: 'Major peak: Black Friday / Cyber Week and festive host gifts.' },
      { month: 'Dec', seasonIndex: 1.62, avgConversionRate: 4.2, insight: 'Highest revenue month: last-minute holiday gift shoppers.' }
    ]
  },
  jewelry: {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    description: 'Personalized jewelry, birthstone rings, handcrafted silver, and accessories.',
    typicalPeak: 'Feb (Valentine\'s), May (Mother\'s Day), Nov-Dec (Holidays)',
    monthlyIndices: [
      { month: 'Jan', seasonIndex: 0.76, avgConversionRate: 1.9, insight: 'Steepest post-holiday dip in discretionary accessories.' },
      { month: 'Feb', seasonIndex: 1.35, avgConversionRate: 3.4, insight: 'Massive Valentine\'s gift surge for engraved and custom jewelry.' },
      { month: 'Mar', seasonIndex: 0.89, avgConversionRate: 2.2, insight: 'Normalizing baseline after Valentine\'s rush.' },
      { month: 'Apr', seasonIndex: 1.02, avgConversionRate: 2.5, insight: 'Mother\'s Day gift hunting begins.' },
      { month: 'May', seasonIndex: 1.38, avgConversionRate: 3.6, insight: 'Mother\'s Day and spring wedding gift surge.' },
      { month: 'Jun', seasonIndex: 0.92, avgConversionRate: 2.3, insight: 'Wedding guest and graduation gift demand.' },
      { month: 'Jul', seasonIndex: 0.84, avgConversionRate: 2.1, insight: 'Summer travel; lower online purchasing intent.' },
      { month: 'Aug', seasonIndex: 0.87, avgConversionRate: 2.2, insight: 'Back-to-school and fall styling queries.' },
      { month: 'Sep', seasonIndex: 0.95, avgConversionRate: 2.4, insight: 'Stable shoulder month before Q4 push.' },
      { month: 'Oct', seasonIndex: 1.10, avgConversionRate: 2.7, insight: 'Early custom order deadlines create shopping urgency.' },
      { month: 'Nov', seasonIndex: 1.55, avgConversionRate: 4.1, insight: 'Record holiday gift demand.' },
      { month: 'Dec', seasonIndex: 1.70, avgConversionRate: 4.6, insight: 'Extreme demand for ready-to-ship boxed jewelry.' }
    ]
  },
  craft_supplies: {
    id: 'craft_supplies',
    name: 'Craft Supplies & DIY Tools',
    description: 'Yarn, woodworking blanks, candle waxes, pottery tools, and sewing patterns.',
    typicalPeak: 'Sep - Oct (Makers preparing inventory) & Jan (New hobbies)',
    monthlyIndices: [
      { month: 'Jan', seasonIndex: 1.12, avgConversionRate: 2.9, insight: 'New Year resolutions and indoor hobby crafting boom.' },
      { month: 'Feb', seasonIndex: 1.05, avgConversionRate: 2.7, insight: 'Winter crafting stays strong.' },
      { month: 'Mar', seasonIndex: 0.99, avgConversionRate: 2.5, insight: 'Spring gardening and floral supply shifts.' },
      { month: 'Apr', seasonIndex: 0.94, avgConversionRate: 2.4, insight: 'Moderate spring activity.' },
      { month: 'May', seasonIndex: 0.90, avgConversionRate: 2.3, insight: 'Slower consumer crafting during warm weather.' },
      { month: 'Jun', seasonIndex: 0.85, avgConversionRate: 2.1, insight: 'Lowest point for indoor craft materials.' },
      { month: 'Jul', seasonIndex: 0.88, avgConversionRate: 2.2, insight: 'Artisan sellers begin sourcing for their Q4 lines.' },
      { month: 'Aug', seasonIndex: 1.08, avgConversionRate: 2.8, insight: 'Makers rush to stock wholesale supplies before holiday rush.' },
      { month: 'Sep', seasonIndex: 1.28, avgConversionRate: 3.3, insight: 'Peak supply season: sellers stocking materials to make wares.' },
      { month: 'Oct', seasonIndex: 1.25, avgConversionRate: 3.2, insight: 'Last-chance maker supply orders before production closes.' },
      { month: 'Nov', seasonIndex: 0.96, avgConversionRate: 2.5, insight: 'Slows down as focus shifts from making to holiday selling.' },
      { month: 'Dec', seasonIndex: 0.82, avgConversionRate: 2.0, insight: 'Sellers are shipping finished goods, not buying raw supplies.' }
    ]
  },
  clothing: {
    id: 'clothing',
    name: 'Apparel & Knitwear',
    description: 'Linen apparel, hand-knitted cardigans, personalized hoodies, and loungewear.',
    typicalPeak: 'Oct - Dec (Winter layers & holiday garments)',
    monthlyIndices: [
      { month: 'Jan', seasonIndex: 0.85, avgConversionRate: 2.0, insight: 'Winter clearance and cozy restock.' },
      { month: 'Feb', seasonIndex: 0.88, avgConversionRate: 2.1, insight: 'Late winter loungewear interest.' },
      { month: 'Mar', seasonIndex: 0.96, avgConversionRate: 2.4, insight: 'Spring transitions and lightweight knit queries.' },
      { month: 'Apr', seasonIndex: 1.02, avgConversionRate: 2.6, insight: 'Easter and festival outfits.' },
      { month: 'May', seasonIndex: 1.06, avgConversionRate: 2.7, insight: 'Summer linen & wedding celebration apparel.' },
      { month: 'Jun', seasonIndex: 0.94, avgConversionRate: 2.3, insight: 'Mid-summer swim & resort queries.' },
      { month: 'Jul', seasonIndex: 0.89, avgConversionRate: 2.2, insight: 'Clearance period across clothing.' },
      { month: 'Aug', seasonIndex: 1.05, avgConversionRate: 2.6, insight: 'Back-to-school jackets and early sweater weather.' },
      { month: 'Sep', seasonIndex: 1.18, avgConversionRate: 2.9, insight: 'Autumn knitwear boom across all climates.' },
      { month: 'Oct', seasonIndex: 1.28, avgConversionRate: 3.2, insight: 'Halloween, autumn festivals, and cozy layers.' },
      { month: 'Nov', seasonIndex: 1.42, avgConversionRate: 3.7, insight: 'Sweater gifting and family matching holiday outfits.' },
      { month: 'Dec', seasonIndex: 1.50, avgConversionRate: 3.9, insight: 'Peak holiday partywear and gift scarves.' }
    ]
  }
};
