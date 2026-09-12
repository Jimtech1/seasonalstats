import React, { useState, useMemo } from 'react';
import { ActiveTab } from '../types';
import { 
  HelpCircle, 
  Search, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Heart, 
  Target, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Tag, 
  Calculator, 
  TrendingUp, 
  Compass, 
  Printer, 
  CheckSquare, 
  Globe, 
  Bell, 
  BookOpen, 
  DollarSign, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Info,
  RotateCcw,
  Check
} from 'lucide-react';

interface HelpDocsViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenConnectEtsy?: () => void;
  onOpenRegionalCalendar?: () => void;
  onOpenPackingSheets?: () => void;
  onOpenWeeklyPlan?: () => void;
  onLaunchTour?: () => void;
}

type GuideCategory = 'all' | 'tour_guides' | 'methodology' | 'studio_tools' | 'safety' | 'faq';

interface DocGuide {
  id: string;
  category: 'tour_guides' | 'methodology' | 'studio_tools' | 'safety';
  chapter: string;
  chapterBadgeColor: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  summary: string;
  stepsToUse: string[];
  whyItMatters: string;
  proTip: string;
  actionButton?: {
    label: string;
    tab?: ActiveTab;
    modalAction?: 'connect_etsy' | 'calendar' | 'packing' | 'plan';
  };
}

export const HelpDocsView: React.FC<HelpDocsViewProps> = ({
  onNavigateTab,
  onOpenConnectEtsy,
  onOpenRegionalCalendar,
  onOpenPackingSheets,
  onOpenWeeklyPlan,
  onLaunchTour,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('all');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('tag_scheduler');
  const [copiedFormula, setCopiedFormula] = useState(false);

  // All guides, prominently highlighting the remaining tour guides trimmed from the 7-step quick tour
  const guides: DocGuide[] = [
    // --- REMAINING GUIDES FROM THE COMPREHENSIVE TOUR ---
    {
      id: 'tag_scheduler',
      category: 'tour_guides',
      chapter: 'Search & Automation',
      chapterBadgeColor: 'bg-[#6A7B8C]/15 text-[#2E4057] border-[#6A7B8C]/30',
      title: 'Automated Seasonal Tag Scheduler',
      subtitle: 'Schedule holiday keyword shifts 4–6 weeks before peak search surges',
      icon: <Clock className="w-5 h-5 text-[#6A7B8C]" />,
      summary: 'Stop manually updating 13 Etsy tags on dozens of listings at midnight. The Automated Seasonal Tag Scheduler allows you to queue keyword shifts (e.g. Autumn Warmth → Holiday Gifting → Valentine’s Keepsakes) to apply automatically on specific calendar dates.',
      stepsToUse: [
        'Open the "Tag Scheduler" tab in the left sidebar.',
        'Click "Create Scheduled Rule" and name your seasonal campaign (e.g., "Early Christmas Gift Prep").',
        'Choose the target execution date (recommended: 4 to 6 weeks before holiday shipping deadlines).',
        'Select which listings receive the update, enter the new 13 tags, and optionally preview with "Execute Now".'
      ],
      whyItMatters: 'Shoppers begin searching for holiday gift ideas long before artisans think to update tags. Capturing search momentum early gives your listings a critical ranking head start.',
      proTip: 'Always schedule tag shifts at least 30 days before peak holiday traffic so the Etsy search indexing algorithm has time to rank your listing.',
      actionButton: {
        label: 'Open Tag Scheduler',
        tab: 'scheduler'
      }
    },
    {
      id: 'customer_loyalty',
      category: 'tour_guides',
      chapter: 'Retention & Loyalty',
      chapterBadgeColor: 'bg-[#7C6354]/15 text-[#4A382C] border-[#7C6354]/30',
      title: 'Repeat Buyer Engine & Care Card Inserts',
      subtitle: 'Turn one-time gift shoppers into lifelong collectors and patrons',
      icon: <Heart className="w-5 h-5 text-[#B85C4A]" />,
      summary: 'Repeat artisan customers generate 3.4× higher average order value (AOV) and incur zero customer acquisition ad costs. The Customer Loyalty view segments your past buyers into VIP Patrons, Holiday Gifters, and Craft Collectors, providing ready-to-print unboxing care cards and QR coupon templates.',
      stepsToUse: [
        'Navigate to "Customer Loyalty" from the sidebar navigation.',
        'Review your Repeat Buyer Rate and Lifetime Value (LTV) cohorts.',
        'Click the "Care Inserts" tab to customize your studio printing templates.',
        'Print custom unboxing cards with QR codes offering returning buyers an exclusive thank-you discount on their next direct commission.'
      ],
      whyItMatters: 'Etsy fees and ad costs take 15%+ of first-time sales. Cultivating direct repeat patrons is the single fastest way to increase net profit margins.',
      proTip: 'Slip a personalized care card into every unboxing parcel—handmade buyers cherish knowing how to preserve artisanal materials.',
      actionButton: {
        label: 'Open Customer Loyalty',
        tab: 'loyalty'
      }
    },
    {
      id: 'pricing_elasticity',
      category: 'tour_guides',
      chapter: 'Catalog & Margin',
      chapterBadgeColor: 'bg-[#D97757]/15 text-[#D97757] border-[#D97757]/30',
      title: 'Pricing Elasticity & $35 Free Shipping Simulator',
      subtitle: 'Model conversion lift vs profit margin before changing retail prices',
      icon: <Calculator className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'Handmade artisans often underprice their work or fear adopting Etsy’s $35 Free Shipping Guarantee. The Pricing Elasticity Simulator models exactly how absorbing postage costs or raising retail prices affects unit margin, checkout conversion, and net weekly profit.',
      stepsToUse: [
        'Open the "Listings" tab in the sidebar.',
        'Locate any listing and click the green "Pricing" button in the right-hand Actions column.',
        'Use the slider to adjust simulated retail price or check "Adopt $35 Free Shipping Guarantee".',
        'Compare the simulated net profit per unit against the baseline before committing the change.'
      ],
      whyItMatters: 'Tests whether absorbing $5.50 postage creates enough cart-to-checkout conversion lift to result in higher total net dollars.',
      proTip: 'Listings with high cart additions but low checkout rates are prime candidates for testing free shipping.',
      actionButton: {
        label: 'Explore Listings & Pricing',
        tab: 'listings'
      }
    },
    {
      id: 'search_terms_tracker',
      category: 'tour_guides',
      chapter: 'Search & SEO',
      chapterBadgeColor: 'bg-[#6A7B8C]/15 text-[#2E4057] border-[#6A7B8C]/30',
      title: 'Search Terms Seasonality Tracker',
      subtitle: 'Monitor buyer search intent shifts from evergreen phrases to holiday queries',
      icon: <Search className="w-5 h-5 text-[#6A7B8C]" />,
      summary: 'Shoppers continuously evolve their phrasing across the year. The Search Terms view distinguishes between normal seasonal phrasing shifts (e.g. "ceramic mug" transitioning to "hygge autumn gift box") and keywords that are genuinely decaying in Etsy search rank.',
      stepsToUse: [
        'Select "Search terms" in the left sidebar.',
        'Review the "Attention Needed" callout highlighting rising seasonal queries.',
        'Examine the Season Index column for each search phrase.',
        'Click "Audit listing tags" on emerging keywords to ensure all 13 tags on your products capture active search phrasing.'
      ],
      whyItMatters: 'Prevents you from abandoning good evergreen keywords while ensuring your catalog adapts to holiday gift-seeking vocabulary.',
      proTip: 'Combine high-intent gifting keywords ("cozy anniversary gift for her") with your product material tags.',
      actionButton: {
        label: 'Open Search Terms',
        tab: 'search_terms'
      }
    },
    {
      id: 'history_benchmarks',
      category: 'tour_guides',
      chapter: 'Analytics & Benchmarks',
      chapterBadgeColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      title: '13-Month History & Category Benchmarks',
      subtitle: 'Benchmark your studio against Home & Living, Jewelry, Crafts, and Vintage',
      icon: <Calendar className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'SeasonalStat maintains rolling 13-month performance records to evaluate long-term shop health. Benchmark your monthly conversion rate, order volume, and visit trends against industry averages across major Etsy craft categories with 1-click CSV accounting export.',
      stepsToUse: [
        'Click "History" in the sidebar navigation.',
        'Toggle between "Visual Trend Curves", "Data Table", and "Category Benchmarks".',
        'Select your craft category (Home & Living, Jewelry, Art & Crafts, Vintage).',
        'Click "Export CSV" to download a clean spreadsheet for your quarterly studio bookkeeping.'
      ],
      whyItMatters: 'Contextualizes whether a dip in visitors is an isolated shop issue or reflects platform-wide handmade category trends.',
      proTip: 'Compare your Q4 conversion rate from last year against current pace to order accurate raw material inventory.',
      actionButton: {
        label: 'View History & Benchmarks',
        tab: 'history'
      }
    },
    {
      id: 'attributed_lift_log',
      category: 'tour_guides',
      chapter: 'Safety & Audit',
      chapterBadgeColor: 'bg-[#7C6354]/15 text-[#4A382C] border-[#7C6354]/30',
      title: '14-Day Post-Edit Attributed Lift & Safety Log',
      subtitle: 'Measure net revenue lift factoring out category-wide seasonal tailwinds',
      icon: <ShieldCheck className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'When you update listing tags or titles, did your change actually help, or was the shop just benefiting from an autumn sales lift? The 14-Day Performance Tracker observes listing revenue for two weeks and subtracts category-wide seasonal growth to isolate net attributed lift.',
      stepsToUse: [
        'Navigate to "Audit Log & Undo" from the sidebar.',
        'Review the list of recent listing edits.',
        'Inspect the "Attributed 14-Day Lift" indicator for completed cohorts.',
        'If an edit causes negative drag, click the 1-click Revert button to immediately restore the pre-edit snapshot.'
      ],
      whyItMatters: 'Gives scientific certainty to your listing experiments so you can double down on winning keywords and eliminate harmful edits.',
      proTip: 'Give new tags at least 10 to 14 days before evaluating performance to allow the Etsy search algorithm to re-index your products.',
      actionButton: {
        label: 'View Audit Log & Lift',
        tab: 'audit_log'
      }
    },
    {
      id: 'revenue_goals',
      category: 'tour_guides',
      chapter: 'Planning & Multipliers',
      chapterBadgeColor: 'bg-[#7C6354]/15 text-[#4A382C] border-[#7C6354]/30',
      title: 'Seasonality-Adjusted Revenue Goals',
      subtitle: 'Set targets that adjust dynamically for peak holiday shopping volume',
      icon: <Target className="w-5 h-5 text-[#D97757]" />,
      summary: 'Static monthly revenue goals fail for artisans because demand varies dramatically by month. The Goals view applies empirical seasonal multipliers (+15% in Oct, +101% in Nov, +186% in Dec) so your targets reflect real handmade buying waves.',
      stepsToUse: [
        'Click "Goals" in the sidebar navigation.',
        'Enter your annual or baseline monthly target.',
        'Observe the automatically calculated seasonal demand curve.',
        'Use the projected order volume bands to calculate your required weekly production make-rate.'
      ],
      whyItMatters: 'Prevents setting discouraging summer targets or dangerously underestimating holiday packaging inventory.',
      proTip: 'Align your studio material orders with the November and December projected unit order volume.',
      actionButton: {
        label: 'Configure Revenue Goals',
        tab: 'goals'
      }
    },

    // --- ARTISAN STUDIO TOOLS GUIDES ---
    {
      id: 'regional_holidays_guide',
      category: 'studio_tools',
      chapter: 'Operations & Deadlines',
      chapterBadgeColor: 'bg-[#3E5C76]/15 text-[#1D2D44] border-[#3E5C76]/30',
      title: 'Regional Shipping Deadlines & Carrier Cutoffs',
      subtitle: 'Postal cutoffs for US, UK, Canada, Australia, Germany, and France',
      icon: <Globe className="w-5 h-5 text-[#D97757]" />,
      summary: 'International holiday sales require precise cutoff tracking. This utility lists official carrier dispatch dates (USPS Ground Advantage, Priority Mail, Royal Mail 1st Class, Canada Post, Australia Post) so you can update listing shipping profiles before dispatch guarantees expire.',
      stepsToUse: [
        'Click the "Regional Holidays" button in the top navigation bar.',
        'Switch between US, UK, CA, AU, and EU country tabs.',
        'Review upcoming gift holidays (e.g. Canadian Thanksgiving, UK Mother’s Day, US Black Friday).',
        'Update your listing processing times 5 business days ahead of carrier cutoffs to avoid shipping delays.'
      ],
      whyItMatters: 'Late holiday deliveries result in negative reviews and dispute cases that hurt your Etsy Star Seller badge.',
      proTip: 'Add an announcement banner in your Etsy shop 3 days before each regional postal deadline.',
      actionButton: {
        label: 'Open Regional Calendars',
        modalAction: 'calendar'
      }
    },
    {
      id: 'batch_packing_sheets',
      category: 'studio_tools',
      chapter: 'Operations & Fulfillment',
      chapterBadgeColor: 'bg-[#3E5C76]/15 text-[#1D2D44] border-[#3E5C76]/30',
      title: 'Batch Packing Sheets & Material Replenishment',
      subtitle: 'Printable workbench slips sorted by carrier dispatch deadlines',
      icon: <Printer className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'Bridges digital analytics with physical studio workbench fulfillment. Generates batch packing slips sorted by carrier pickup urgency, interactive item verification checklists, and a raw materials inventory replenishment tracker.',
      stepsToUse: [
        'Click "Packing Sheets" in the top navigation bar.',
        'Filter open orders by carrier cutoff time or gift wrap requirement.',
        'Verify packaging components (care insert, thank-you note, bubble buffer).',
        'Click "Print Batch Slips" to generate a crisp 1-page workbench manifest.'
      ],
      whyItMatters: 'Eliminates packing errors during high-volume holiday rushes and ensures materials never run out mid-production.',
      proTip: 'Print batch slips every morning to stage gift boxes and packaging supplies before making begins.',
      actionButton: {
        label: 'Open Packing Sheets',
        modalAction: 'packing'
      }
    },
    {
      id: 'weekly_action_plan_guide',
      category: 'studio_tools',
      chapter: 'Studio Workflow',
      chapterBadgeColor: 'bg-[#3E5C76]/15 text-[#1D2D44] border-[#3E5C76]/30',
      title: '1-Page Printable Weekly Action Plan',
      subtitle: 'Your Monday morning studio roadmap prioritized by revenue impact',
      icon: <CheckSquare className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'Translates all diagnostic anomalies, flagged listings, and upcoming shipping cutoffs into a concise, 1-page printable studio checklist designed for your workbench clipboard.',
      stepsToUse: [
        'Click "Weekly Action Plan" in the top bar.',
        'Review the 4 core weekly focus areas: Critical Fixes, Seasonal Tag Shifts, Materials to Order, and Shipping Deadlines.',
        'Click "Print 1-Page Plan" to pin it directly above your craft workbench.'
      ],
      whyItMatters: 'Keeps you focused on high-leverage studio tasks without getting distracted by social media or complex analytics.',
      proTip: 'Review your weekly plan every Monday morning before opening raw material bins.',
      actionButton: {
        label: 'Open Weekly Action Plan',
        modalAction: 'plan'
      }
    },

    // --- CORE TOUR GUIDES ---
    {
      id: 'seasonality_index_core',
      category: 'methodology',
      chapter: 'Methodology & Baseline',
      chapterBadgeColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      title: 'The 1.00× Seasonality Index Normalization',
      subtitle: 'Why month-over-month comparisons mislead handmade sellers',
      icon: <Sparkles className="w-5 h-5 text-[#D97757]" />,
      summary: 'Handmade shops experience dramatic seasonal swings. A 30% drop in July visits is normal for many craft categories and does not mean your products have failed. SeasonalStat indexes every metric against your shop’s 13-month historical baseline curve.',
      stepsToUse: [
        'Values > 1.05×: Outperforming expected seasonal volume.',
        'Values 0.95× to 1.05×: Performing on exact pace for this calendar month.',
        'Values < 0.90×: Underperforming baseline (requires diagnostic investigation).'
      ],
      whyItMatters: 'Protects artisans from panic-discounting work or making reckless listing edits during natural platform-wide seasonal valleys.',
      proTip: 'Always check the Seasonality Index badge before changing prices or tags.',
      actionButton: {
        label: 'View Overview Baseline',
        tab: 'overview'
      }
    },
    {
      id: 'where_to_look_first',
      category: 'methodology',
      chapter: 'Diagnostics',
      chapterBadgeColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      title: '"Where to Look First" Bottleneck Callout',
      subtitle: 'Translates 20+ analytics metrics into a single plain-language diagnosis',
      icon: <Compass className="w-5 h-5 text-[#D97757]" />,
      summary: 'Artisans often suffer from analytics fatigue. The "Where to Look First" callout evaluates search impressions, click-through rates, visit volume, and checkout conversion to isolate your single highest-leverage constraint.',
      stepsToUse: [
        'Check the top banner on your Overview dashboard.',
        'Read the diagnosed bottleneck (e.g. Thumbnail Click-Through Friction).',
        'Click the direct diagnosis link to view the exact listings or stages causing the issue.'
      ],
      whyItMatters: 'Eliminates analysis paralysis and directs your limited hours to what actually moves the revenue needle.',
      proTip: 'Focus on one bottleneck at a time until its diagnostic flag resolves from Red to Green.',
      actionButton: {
        label: 'View Dashboard Callout',
        tab: 'overview'
      }
    },
    {
      id: 'etsy_fee_breakdown',
      category: 'methodology',
      chapter: 'Financial Transparency',
      chapterBadgeColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      title: 'Etsy Fee Breakdown & True Bank Deposits',
      subtitle: 'Itemizing 6.5% transaction, payment processing, renewals, and offsite ads',
      icon: <DollarSign className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'Top-line gross sales can be deceiving. SeasonalStat decomposes official Etsy seller fees ($789 / 15.2%) to show authentic net take-home pay landing in your studio bank account.',
      stepsToUse: [
        'On the Overview tab, click "Etsy Fee Breakdown" under the 6-Month Gross Revenue section.',
        'Audit Transaction Fees (6.5%), Payment Processing (3% + $0.25), Listing Renewals ($0.20), and Offsite Ads.',
        'Compare Net Revenue ($4,412) with Gross Sales ($5,201) to price for true margins.'
      ],
      whyItMatters: 'Accurate profit margins prevent you from discovering at tax time that holiday sales were less profitable than expected.',
      proTip: 'Incorporate the 15.2% fee deduction into your pricing formula before launching new product lines.',
      actionButton: {
        label: 'Audit Fee Breakdown',
        tab: 'overview'
      }
    },
    {
      id: 'conversion_waterfall',
      category: 'methodology',
      chapter: 'Funnel Diagnosis',
      chapterBadgeColor: 'bg-[#D97757]/15 text-[#D97757] border-[#D97757]/30',
      title: '4-Stage Conversion Waterfall Diagnosis',
      subtitle: 'Pinpoint exactly where shoppers drop off between search and order',
      icon: <Filter className="w-5 h-5 text-[#D97757]" />,
      summary: 'The conversion funnel traces shoppers across 4 sequential stages: Search Impressions → Listing Visits → Adds to Cart → Completed Orders. Benchmarked against last year’s seasonal baseline with color-coded health indicators.',
      stepsToUse: [
        'Stage 1 (Impressions): SEO, tag relevance, and search placement.',
        'Stage 2 (Visits): Thumbnail clarity, photo appeal, and pricing competitiveness.',
        'Stage 3 (Cart Adds): Product description, dimensions, reviews, and trust.',
        'Stage 4 (Orders): Shipping rates, delivery speed guarantees, and checkout confidence.'
      ],
      whyItMatters: 'Identifies the exact friction point so you never change photos when shipping rates are the real issue.',
      proTip: 'If visits are high but cart adds are low, add photos showing product dimensions and scale against everyday objects.',
      actionButton: {
        label: 'Open Funnel Diagnosis',
        tab: 'funnel'
      }
    },
    {
      id: 'safety_rollback_protocol',
      category: 'safety',
      chapter: 'Write-Safety & Security',
      chapterBadgeColor: 'bg-[#5A7A5A]/15 text-[#2E472E] border-[#5A7A5A]/30',
      title: '24-Hour Rollback Guarantee & API Security',
      subtitle: 'Immutable snapshot logging and OAuth2 PKCE token isolation',
      icon: <ShieldCheck className="w-5 h-5 text-[#5A7A5A]" />,
      summary: 'SeasonalStat adheres strictly to Etsy Open API v3 security standards. When you edit listings, an immutable pre-edit snapshot is saved to your Audit Log. If an edit harms traffic or ranking, revert it with a single click within 24 hours.',
      stepsToUse: [
        'All listing updates create an instantaneous timestamped snapshot.',
        'A persistent floating undo toast appears with a direct 1-click restore button.',
        'After 24 hours, the rollback window closes to allow Etsy search algorithms to settle.',
        'All master Etsy credentials remain protected through client-isolated OAuth2 PKCE.'
      ],
      whyItMatters: 'Eliminates anxiety when experimenting with competitive holiday keywords or seasonal pricing.',
      proTip: 'If an experimental tag doesn’t produce clicks within 24 hours, revert to your proven baseline tags.',
      actionButton: {
        label: 'View Audit Log',
        tab: 'audit_log'
      }
    }
  ];

  // Filter guides based on search query and category
  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const matchesQuery = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [guides, selectedCategory, searchQuery]);

  const handleAction = (guide: DocGuide) => {
    if (!guide.actionButton) return;
    const { tab, modalAction } = guide.actionButton;
    if (tab) {
      onNavigateTab(tab);
    } else if (modalAction === 'connect_etsy' && onOpenConnectEtsy) {
      onOpenConnectEtsy();
    } else if (modalAction === 'calendar' && onOpenRegionalCalendar) {
      onOpenRegionalCalendar();
    } else if (modalAction === 'packing' && onOpenPackingSheets) {
      onOpenPackingSheets();
    } else if (modalAction === 'plan' && onOpenWeeklyPlan) {
      onOpenWeeklyPlan();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF3EA] rounded-2xl border border-[#E2D8C9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A7A5A]/15 text-[#2E472E] border border-[#5A7A5A]/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Artisan Knowledge & Documentation Center</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Help & Documentation
          </h1>
          <p className="text-sm sm:text-base text-[#5C5549] leading-relaxed">
            In-depth operational walkthroughs, seasonality calculation formulas, artisan fulfillment strategies, and transparent write-safety protocols for your handmade studio.
          </p>
        </div>

        {/* Quick Tour Re-launch Callout */}
        <div className="mt-6 pt-5 border-t border-[#E8E1D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97757]/15 text-[#D97757] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-[#1A1A1A] block">
                7-Step Interactive Quick Tour
              </span>
              <span className="text-xs text-[#665D4F]">
                Need a fast visual walkthrough of core dashboard elements?
              </span>
            </div>
          </div>
          {onLaunchTour && (
            <button
              type="button"
              onClick={onLaunchTour}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Compass className="w-4 h-4 text-[#D97757]" />
              <span>Launch 7-Step Tour</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Announcement: Remaining Tour Guides Live in Help & Docs */}
      <div className="p-4 bg-[#FAF3EA] rounded-xl border border-[#E8DFC8] flex items-start gap-3.5 shadow-2xs">
        <Sparkles className="w-5 h-5 text-[#D97757] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-[#7A4B29] uppercase tracking-wider">
            All Specialized Operational Guides are Documented Here
          </h3>
          <p className="text-xs text-[#5C5549] leading-relaxed">
            The 7-step quick tour covers the core foundation (Seasonality Index, Bottlenecks, Funnel, Listings, and Etsy connection). All remaining specialized workflows—such as the <strong>Automated Tag Scheduler</strong>, <strong>Customer Care Card Templates</strong>, <strong>Pricing Elasticity Simulator</strong>, and <strong>Regional Carrier Cutoffs</strong>—are thoroughly documented below with step-by-step instructions and 1-click dashboard shortcuts.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#8C8375] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, formulas, keywords, or troubleshooting tips..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[#E2D8C9] text-sm text-[#1A1A1A] placeholder-[#8C8375] focus:outline-hidden focus:ring-2 focus:ring-[#D97757]/40 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A7163] hover:text-[#1A1A1A]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: `All Guides (${guides.length})` },
            { id: 'tour_guides', label: 'Feature Walkthroughs (7)' },
            { id: 'studio_tools', label: 'Artisan Studio Utilities (3)' },
            { id: 'methodology', label: 'Methodology & Formulas (4)' },
            { id: 'safety', label: 'Safety & Security (1)' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSelectedCategory(pill.id as GuideCategory)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === pill.id
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white border border-[#E2D8C9] text-[#6B6356] hover:bg-[#F2ECE2]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E1D7] text-[#7A7163] space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-[#B5ABA0]" />
            <p className="font-semibold text-sm text-[#1A1A1A]">No guides found</p>
            <p className="text-xs">Try searching for different keywords or select "All Guides".</p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isExpanded = expandedGuideId === guide.id;
            return (
              <div
                key={guide.id}
                id={`guide-${guide.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isExpanded ? 'border-[#D97757] ring-1 ring-[#D97757]/30' : 'border-[#E2D8C9] hover:border-[#D97757]/50'
                }`}
              >
                {/* Header / Summary Clickable Bar */}
                <div 
                  onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/50 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E4DCD0] flex items-center justify-center shrink-0 mt-0.5">
                      {guide.icon}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${guide.chapterBadgeColor}`}>
                          {guide.chapter}
                        </span>
                      </div>
                      <h2 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
                        {guide.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#665D4F] line-clamp-1">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <span className="text-xs text-[#7A7163] font-medium hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'Expand guide'}
                    </span>
                    <div className="p-1 rounded-lg bg-[#FAF7F2] border border-[#E8E1D7] text-[#665D4F]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Guide Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-[#EFE9DF] space-y-5 bg-[#FAF7F2]/30 animate-fadeIn">
                    {/* Summary Overview */}
                    <div className="text-xs sm:text-sm text-[#4A4235] leading-relaxed">
                      {guide.summary}
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-2.5">
                      <span className="font-bold text-xs text-[#1A1A1A] block uppercase tracking-wider">
                        How to Use in SeasonalStat:
                      </span>
                      <ol className="space-y-2 text-xs text-[#5C5549]">
                        {guide.stepsToUse.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E4DCD0] text-[#1A1A1A] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Why It Matters & Pro Tip Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Why it matters */}
                      <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E4DCD0] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5A7A5A]" />
                          <span>Why this matters for your shop:</span>
                        </div>
                        <p className="text-xs text-[#5C5549] leading-relaxed pl-5">
                          {guide.whyItMatters}
                        </p>
                      </div>

                      {/* Pro tip */}
                      <div className="p-3.5 bg-[#FAF3EA] rounded-xl border border-[#E8DFC8] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#7A4B29]">
                          <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
                          <span className="uppercase text-[11px] tracking-wider">Pro Seller Tip:</span>
                        </div>
                        <p className="text-xs text-[#5C5549] leading-relaxed pl-5">
                          {guide.proTip}
                        </p>
                      </div>
                    </div>

                    {/* Action Button to Launch Tool directly */}
                    {guide.actionButton && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleAction(guide)}
                          className="px-4 py-2 bg-[#D97757] hover:bg-[#C26547] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <span>{guide.actionButton.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Mathematical Formulas & Methodology Deep Dive */}
      <div className="p-6 bg-white rounded-2xl border border-[#E2D8C9] space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5A7A5A]/15 text-[#5A7A5A] flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#1A1A1A]">
              Methodology & Transparency Formulas
            </h2>
            <p className="text-xs text-[#665D4F]">
              Inspect the exact mathematical formulas used to normalize seasonal fluctuations and attribute net revenue growth.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Formula 1: Seasonality Index */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A1A1A]">1. Seasonality Index Calculation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A7A5A]/15 text-[#5A7A5A] font-mono font-bold">1.00× Baseline</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E4DCD0] font-mono text-[11px] text-[#2E472E]">
              Seasonality Index = Current Month Metric / 13-Month Historical Normal
            </div>
            <p className="text-[#665D4F] leading-relaxed">
              If visits in July are 4,500 and the 13-month polynomial seasonal model expects 4,200, your index is <strong>1.07×</strong> (+7% above seasonal pace), confirming strong organic health despite lower numbers than December.
            </p>
          </div>

          {/* Formula 2: Net Attributed Lift */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1A1A1A]">2. 14-Day Attributed Lift</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D97757]/15 text-[#D97757] font-mono font-bold">Normalized Lift</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E4DCD0] font-mono text-[11px] text-[#7A4B29]">
              Net Attributed Lift = Raw Listing Lift % − Category Seasonal Lift %
            </div>
            <p className="text-[#665D4F] leading-relaxed">
              If an edited listing gains +24.5% in revenue while the entire Home & Living category grew +7.2% due to holiday shopping, the Net Attributed Lift from your tag edit is precisely <strong>+17.3%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="p-6 bg-white rounded-2xl border border-[#E2D8C9] space-y-4 shadow-xs">
        <h2 className="font-editorial text-xl font-bold text-[#1A1A1A]">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-[#EFE9DF] text-xs">
          <div className="py-3 space-y-1">
            <span className="font-bold text-[#1A1A1A]">
              Does SeasonalStat modify my live Etsy listings without my approval?
            </span>
            <p className="text-[#665D4F] leading-relaxed">
              Never. SeasonalStat only updates listings when you explicitly click "Save to Etsy", schedule an automated rule, or click "Execute Now". Every change creates an immutable snapshot in your Audit Log with a 24-hour single-click undo button.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <span className="font-bold text-[#1A1A1A]">
              Why are "Adds to Cart" labeled as estimated in the Funnel Diagnosis?
            </span>
            <p className="text-[#665D4F] leading-relaxed">
              The public Etsy Open API v3 does not expose direct add-to-cart events. SeasonalStat estimates cart volume based on checkout initiation ratios, visit-to-order curves, and handmade category abandonment benchmarks.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <span className="font-bold text-[#1A1A1A]">
              Are my Etsy shop passwords or payment accounts exposed?
            </span>
            <p className="text-[#665D4F] leading-relaxed">
              No. Authentication uses Etsy's official OAuth2 PKCE standard. SeasonalStat never sees your password or bank account credentials. Tokens are scoped strictly to listing read/write permissions.
            </p>
          </div>

          <div className="py-3 space-y-1">
            <span className="font-bold text-[#1A1A1A]">
              Can I export my historical data for studio accounting?
            </span>
            <p className="text-[#665D4F] leading-relaxed">
              Yes. Navigate to the History tab and click "Export CSV" to download clean historical sales, orders, and fee records compatible with QuickBooks, Wave, or Excel.
            </p>
          </div>
        </div>
      </div>

      {/* Legal & Trademark Footer */}
      <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D7] text-xs text-[#8C8375] flex items-center justify-between flex-wrap gap-2">
        <p>
          The term "Etsy" is a trademark of Etsy, Inc. SeasonalStat is not affiliated with, endorsed by, or sponsored by Etsy, Inc. All API interactions adhere strictly to the Etsy Open API Terms of Service.
        </p>
        <span className="font-mono text-[11px] text-[#A69B8D]">
          v2.4.0 · Production Ready
        </span>
      </div>
    </div>
  );
};
