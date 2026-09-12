import React, { useState } from 'react';
import { ListingItem, AlertItem } from '../types';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Calendar, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  CheckSquare,
  Square,
  TrendingUp,
  Tag,
  Eye,
  ShieldCheck,
  Target
} from 'lucide-react';

interface WeeklyActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  listings: ListingItem[];
  alerts: AlertItem[];
  onOpenListingEdit?: (listing: ListingItem) => void;
}

export const WeeklyActionPlanModal: React.FC<WeeklyActionPlanModalProps> = ({
  isOpen,
  onClose,
  shopName,
  listings,
  alerts,
  onOpenListingEdit,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    'task-1': false,
    'task-2': false,
    'task-3': false,
    'task-4': false,
  });

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Find priority flagged listings
  const seenNeverBought = listings.find(l => l.flags.includes('seen_never_bought')) || listings[0];
  const highCartLowCheckout = listings.find(l => l.flags.includes('high_cart_low_checkout')) || listings[1];
  const decliningMomentum = listings.find(l => l.flags.includes('declining_momentum')) || listings[2];

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `SEASONALSTAT WEEKLY ACTION PLAN
Shop: ${shopName}
Week: September 11 - September 18
Current Season Index: 1.12x (Early Q4 Holiday Ramp)

TOP 3 HIGH-PRIORITY ACTIONS:
1. Revamp Primary Thumbnail: "${seenNeverBought.title}"
   - Problem: 18,450 impressions but 0.98% CTR. This is a thumbnail clarity issue, not seasonal.
   - Action: Replace primary image with bright, high-contrast lifestyle photo featuring holiday gifting context.

2. Seasonal Tag Injection: Top 5 Catalog Items
   - Problem: Holiday search queries begin accelerating September 15.
   - Action: Batch apply "holiday gift", "stocking stuffer", and "christmas gift" to 13-tag slots.

3. Checkout Friction Fix: "${highCartLowCheckout.title}"
   - Problem: 320 cart additions but only 28 orders (8.7% conversion).
   - Action: Add Free Shipping guarantee over $35 or bundle discount to close checkout drop-off.

Weekly Revenue Target: $1,450.00 | Focus: Conversion Rate Optimization`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
    >
      <div 
        id="weekly-action-plan-container"
        className="bg-[#FAF7F2] rounded-2xl border border-[#D97757]/30 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp print:border-none print:shadow-none print:max-w-full print:rounded-none"
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-[#E8E1D7] flex items-center justify-between bg-white/70 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#5A7A5A] text-white flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#1A1A1A]">
                Weekly Action Plan
              </h2>
              <p className="text-xs text-[#665D4F]">
                Curated 3-task high leverage checklist for maximum seasonal sales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E2D8C9] text-xs font-semibold text-[#1A1A1A] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#5A7A5A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print 1-Page Checklist</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#7A7163] hover:text-[#1A1A1A] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FAF7F2] print:p-8 print:bg-white text-[#1A1A1A]">
          
          {/* Document Header */}
          <div className="border-b-2 border-[#1A1A1A] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-widest text-[#D97757] uppercase">
                  SeasonalStat • Executive Artisan Brief
                </span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                {shopName}
              </h1>
              <p className="text-xs text-[#665D4F] mt-0.5">
                Week of September 11 – September 18 • Etsy Write API Verified
              </p>
            </div>

            <div className="text-left sm:text-right bg-white p-2.5 rounded-lg border border-[#E2D8C9] print:border-black/20">
              <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Seasonal Index</span>
              <span className="font-mono text-base font-bold text-[#5A7A5A]">1.12× Expected Peak</span>
              <span className="text-[10px] text-[#665D4F] block">Early Q4 ramp window</span>
            </div>
          </div>

          {/* Quick Diagnosis Banner */}
          <div className="p-3.5 bg-[#FAF3EA] border border-[#D97757]/30 rounded-xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-[#1A1A1A]">
                Seasonal Diagnostic Verdict:
              </p>
              <p className="text-[#5C5549] leading-relaxed">
                Your shop is entering the autumn seasonal acceleration phase. Top-of-funnel impressions are healthy (+14% vs baseline). Your primary revenue drag is <strong>listing page conversion and mobile click-through</strong> on flagged items, not category seasonality.
              </p>
            </div>
          </div>

          {/* TOP 3 HIGH-PRIORITY ACTION ITEMS */}
          <div className="space-y-3">
            <h3 className="font-editorial text-lg font-bold text-[#1A1A1A] flex items-center justify-between">
              <span>Top 3 High-Priority Listing Fixes</span>
              <span className="text-xs font-normal text-[#7A7163]">Check off upon publishing</span>
            </h3>

            {/* Action 1: Thumbnail Revamp */}
            <div 
              onClick={() => toggleTask('task-1')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                completedTasks['task-1'] 
                  ? 'bg-[#5A7A5A]/10 border-[#5A7A5A]/40 line-through opacity-75' 
                  : 'bg-white border-[#E8E1D7] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-[#D97757]"
                  aria-label="Toggle task 1"
                >
                  {completedTasks['task-1'] ? (
                    <CheckSquare className="w-5 h-5 text-[#5A7A5A]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#8C8375]" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D97757] uppercase tracking-wider">
                      Priority 1 • Thumbnail CTR Fix
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-[#B85C4A]/10 text-[#B85C4A] px-2 py-0.5 rounded">
                      0.98% CTR (Below 1.5% target)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1A1A]">
                    {seenNeverBought.title}
                  </h4>

                  <p className="text-xs text-[#5C5549] leading-relaxed">
                    <strong>Diagnosis:</strong> 18,450 impressions but only 181 visits. Shoppers are seeing this item in search results, but scrolling past.
                  </p>
                  
                  <div className="p-2.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#E4DCD0] space-y-1 text-[#333]">
                    <p className="font-semibold text-[#1A1A1A]">Recommended Action:</p>
                    <p>• Replace the dimly lit studio photo with a bright, warm-toned hero shot showcasing the product in use.</p>
                    <p>• Front-load search term "Soy Candle Fig & Cedarwood" into the first 35 title characters for mobile shoppers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action 2: Batch Seasonal Tags */}
            <div 
              onClick={() => toggleTask('task-2')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                completedTasks['task-2'] 
                  ? 'bg-[#5A7A5A]/10 border-[#5A7A5A]/40 line-through opacity-75' 
                  : 'bg-white border-[#E8E1D7] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-[#D97757]"
                  aria-label="Toggle task 2"
                >
                  {completedTasks['task-2'] ? (
                    <CheckSquare className="w-5 h-5 text-[#5A7A5A]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#8C8375]" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D97757] uppercase tracking-wider">
                      Priority 2 • Early Q4 Tag Staging
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-[#5A7A5A]/15 text-[#5A7A5A] px-2 py-0.5 rounded">
                      Holiday Index Window
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1A1A]">
                    Batch-apply 5 Gifting Keywords Across All Giftable Items
                  </h4>

                  <p className="text-xs text-[#5C5549] leading-relaxed">
                    <strong>Diagnosis:</strong> Etsy search indexing takes 7–14 days. If you wait until November to add holiday tags, you miss early corporate & personal gift planners.
                  </p>

                  <div className="p-2.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#E4DCD0] space-y-1 text-[#333]">
                    <p className="font-semibold text-[#1A1A1A]">Recommended Action:</p>
                    <p>• Use the <strong>Batch Tag Editor</strong> to add: <code className="bg-white px-1 py-0.5 rounded border border-[#E2D8C9]">holiday gift</code>, <code className="bg-white px-1 py-0.5 rounded border border-[#E2D8C9]">stocking stuffer</code>, and <code className="bg-white px-1 py-0.5 rounded border border-[#E2D8C9]">handcrafted gift</code> across your top 5 sellers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action 3: Checkout Abandonment Fix */}
            <div 
              onClick={() => toggleTask('task-3')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                completedTasks['task-3'] 
                  ? 'bg-[#5A7A5A]/10 border-[#5A7A5A]/40 line-through opacity-75' 
                  : 'bg-white border-[#E8E1D7] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-[#D97757]"
                  aria-label="Toggle task 3"
                >
                  {completedTasks['task-3'] ? (
                    <CheckSquare className="w-5 h-5 text-[#5A7A5A]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#8C8375]" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">
                      Priority 3 • Cart Checkout Leak
                    </span>
                    <span className="text-[11px] font-mono font-bold bg-[#3B82F6]/10 text-[#1D4ED8] px-2 py-0.5 rounded">
                      8.7% Cart Conversion
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1A1A1A]">
                    {highCartLowCheckout.title}
                  </h4>

                  <p className="text-xs text-[#5C5549] leading-relaxed">
                    <strong>Diagnosis:</strong> 320 buyers added this to cart, but only 28 placed orders. This signals unexpected shipping costs or checkout hesitation.
                  </p>

                  <div className="p-2.5 bg-[#FAF7F2] rounded-lg text-xs border border-[#E4DCD0] space-y-1 text-[#333]">
                    <p className="font-semibold text-[#1A1A1A]">Recommended Action:</p>
                    <p>• Test offering Free Domestic Shipping (baking shipping into the item price) or add a clear dimensions graphic in slide 2 of your image gallery.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Weekly Studio Goals Table */}
          <div className="pt-2 border-t border-[#E8E1D7] grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-white rounded-xl border border-[#E8E1D7]">
              <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Target Orders</span>
              <span className="font-mono text-lg font-bold text-[#1A1A1A]">35 – 42</span>
              <span className="text-[10px] text-[#5A7A5A] block">+12% vs last week</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E8E1D7]">
              <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Target Gross Rev</span>
              <span className="font-mono text-lg font-bold text-[#1A1A1A]">$1,450.00</span>
              <span className="text-[10px] text-[#7A7163] block">Within forecast</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E8E1D7]">
              <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Safety Rollback</span>
              <span className="font-mono text-lg font-bold text-[#5A7A5A]">24 Hours</span>
              <span className="text-[10px] text-[#665D4F] block">Zero risk edits</span>
            </div>
          </div>

          {/* Footer note for printed copy */}
          <div className="text-[11px] text-[#7A7163] text-center pt-2 print:block border-t border-[#E8E1D7]/50">
            SeasonalStat • Real-time Seasonality Normalization & Listing Action Engine
          </div>

        </div>

      </div>
    </div>
  );
};
