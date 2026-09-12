export type ListingFlag = 'seen_never_bought' | 'declining_momentum' | 'high_cart_low_checkout';

export interface ListingItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  tags: string[];
  impressions: number;
  visits: number;
  addToCart: number;
  orders: number;
  revenue: number;
  netRevenue: number;
  ctr: number; // percentage, e.g. 1.56
  listingAgeDays: number;
  momentum: 'stable' | 'declining' | 'improving';
  seasonIndex: number;
  flags: ListingFlag[];
  whyFlagged?: string;
  cartToOrderRatio?: string;
  topSearchTerms: { term: string; visits: number }[];
  price?: number;
  shippingCost?: number;
  stockLevel?: number;
  weeklyMakeRate?: number;
  leadTimeDays?: number;
  materialsUnitCost?: number;
}

export interface KpiMetric {
  id: string;
  label: string;
  currentValue: string;
  seasonIndex: number;
  sparkline: number[];
  vsLastYear: string;
  comparisonStatus: string;
  subDetail?: string;
}

export interface FunnelStage {
  stageNumber: number;
  label: string;
  name: string;
  value: string;
  numericCurrent: number;
  numericLastYear: number;
  seasonIndex: number;
  baselineText: string;
  statusType: 'green' | 'amber' | 'red';
  statusMessage: string;
  fixSuggestions: string[];
  isEstimated?: boolean;
  tooltip?: string;
}

export interface SearchTermItem {
  term: string;
  visitsThisPeriod: number;
  visitsLastYear: number;
  seasonIndex: number;
  isAttention?: boolean;
}

export interface HistoricalMonthItem {
  month: string;
  year: number;
  visits: number;
  orders: number;
  conversionRate: number; // percentage
  grossRevenue: number;
  netRevenue: number;
  lastYearRevenue: number;
  seasonIndex: number;
}

export interface AlertItem {
  id: string;
  type: 'red' | 'amber' | 'green';
  title: string;
  listingTitle?: string;
  message: string;
  metricInfo: string;
  timeAgo: string;
  resolved: boolean;
  listingId?: string;
}

export interface ListingEditRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  timestamp: string;
  fieldChanged: 'title' | 'description' | 'tags' | 'thumbnail' | 'price' | 'all';
  oldValue: {
    title?: string;
    description?: string;
    tags?: string[];
    thumbnail?: string;
    price?: number;
    shippingCost?: number;
  };
  newValue: {
    title?: string;
    description?: string;
    tags?: string[];
    thumbnail?: string;
    price?: number;
    shippingCost?: number;
  };
  status: 'published' | 'reverted';
  canUndoUntil: string;
  postEditPerformance?: PostEditPerformance;
}

export interface PostEditPerformance {
  daysTracked: number;
  preEditMetrics: {
    visits: number;
    ctr: number;
    orders: number;
    revenue: number;
  };
  postEditMetrics: {
    visits: number;
    ctr: number;
    orders: number;
    revenue: number;
  };
  rawLiftPct: number; // e.g. +24.5%
  categorySeasonLiftPct: number; // e.g. +7.2%
  netAttributedLiftPct: number; // rawLift - categorySeasonLift = +17.3%
  status: 'positive_lift' | 'neutral' | 'negative_drag' | 'collecting_data';
  verdict: string;
}

export type TargetRegion = 'US' | 'UK' | 'EU' | 'AU';

export interface RegionalHoliday {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
  leadTimeWeeks: number;
  keySearchPhrases: string[];
  advice: string;
  shippingCutoff: string;
  seasonalCategoryImpact: string;
}

export interface RegionConfig {
  id: TargetRegion;
  label: string;
  flagEmoji: string;
  currencySymbol: string;
  buyerDemographicSummary: string;
  upcomingHolidays: RegionalHoliday[];
}

export type PlatformType = 'etsy' | 'shopify' | 'amazon' | 'ebay';

export type ActiveTab = 
  | 'overview' 
  | 'funnel' 
  | 'listings' 
  | 'search_terms' 
  | 'history'
  | 'scheduler'
  | 'loyalty'
  | 'alerts' 
  | 'goals'
  | 'audit_log'
  | 'help_docs';

export type TabType = ActiveTab;

// Automated Seasonal Tag Scheduler Types
export interface ScheduledTagRule {
  id: string;
  name: string;
  targetHoliday: string;
  scheduledDate: string; // e.g. "2026-11-01"
  status: 'scheduled' | 'active' | 'executed' | 'paused';
  targetListingIds: string[]; // 'all' or specific IDs
  tagsToRemove: string[];
  tagsToAdd: string[];
  titlePrefix?: string;
  titleSuffix?: string;
  lastExecuted?: string;
  affectedListingsCount: number;
  description: string;
}

// Artisan Order Batch & Production Packing Types
export interface ArtisanOrderBatchSlip {
  orderId: string;
  customerName: string;
  destinationCity: string;
  destinationCountry: string;
  orderDate: string;
  shippingCutoffDate: string;
  shippingMethod: 'USPS Priority' | 'USPS Ground Advantage' | 'Royal Mail Tracked 24' | 'DHL Express Air';
  carrierCutoffHoursLeft: number;
  urgencyStatus: 'critical' | 'urgent' | 'normal';
  items: {
    listingId: string;
    title: string;
    quantity: number;
    variation?: string;
    materials: string;
    isCustomized?: boolean;
    personalizationNote?: string;
  }[];
  packagingChecklist: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  isPacked: boolean;
}

export interface MaterialReplenishmentItem {
  id: string;
  material: string;
  requiredUnits: number;
  unit: string;
  inWorkshopStock: number;
  status: 'sufficient' | 'order_soon' | 'critical_shortage';
  estimatedCost: number;
  supplierLeadDays: number;
  category: string;
}

// Etsy API v3 Integration Types
export interface EtsySyncStatus {
  connected: boolean;
  shopId: string;
  shopName: string;
  userId: string;
  lastSyncedAt: string;
  tokenExpiresAt: string;
  activeListingsCount: number;
  openOrdersCount: number;
  rateLimitRemaining: number;
  webhookSubscriptionActive: boolean;
  recentWebhooks: EtsyWebhookEvent[];
}

export interface EtsyWebhookEvent {
  id: string;
  event: 'shop.receipt.created' | 'shop.receipt.updated' | 'listing.inventory.updated' | 'listing.updated';
  timestamp: string;
  payloadSummary: string;
  affectedItemTitle?: string;
  details?: Record<string, any>;
}

// Customer Loyalty & Packaging Care Inserts Types
export type CustomerSegmentType = 'holiday_gifter' | 'collector_repeat' | 'at_risk' | 'vip_artisan';

export interface LoyaltyCustomer {
  id: string;
  customerName: string;
  emailMasked: string;
  segment: CustomerSegmentType;
  totalOrders: number;
  lifetimeValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  favoriteCategory: string;
  notes: string;
  nextPredictedReorderWindow: string;
  lastPurchasedItems: string[];
}

export interface CareInsertTemplate {
  id: string;
  name: string;
  category: 'pottery' | 'candle_wax' | 'textiles' | 'woodwork' | 'general_gift';
  headline: string;
  careInstructions: string[];
  personalArtisanNote: string;
  qrCodeDestination: string;
  couponCode: string;
  discountPercent: number;
  includeSocialHandle: string;
}

export interface LoyaltyMetrics {
  repeatBuyerRate: number;
  totalRepeatRevenue: number;
  avgDaysBetweenOrders: number;
  holidayGiftRetentionRate: number;
  activeCouponRedemptions: number;
}

