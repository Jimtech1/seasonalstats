import React from 'react';
import { 
  HelpCircle, 
  X, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  Filter, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E2D8C9] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E1D7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5A7A5A]/15 text-[#5A7A5A] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#1A1A1A]">
                Methodology & Transparency Guide
              </h2>
              <p className="text-xs text-[#665D4F]">
                How SeasonalStat calculates benchmarks, estimates, and safety protocols.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#7A7163] hover:text-[#1A1A1A] rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-[#4A4235] leading-relaxed">
          
          {/* Seasonality Normalization */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-2">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
              <Sparkles className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-editorial text-base">The 1.00× Seasonality Index</h3>
            </div>
            <p className="text-xs text-[#665D4F]">
              Handmade and craft shops experience sharp seasonal demand spikes (such as Q4 holiday gift surges or spring wedding waves). Comparing July directly to December creates false alarms. SeasonalStat indexes every metric against your shop’s rolling 13-month historical baseline:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7]">
                <strong className="text-[#5A7A5A] block">&gt; 1.05×</strong>
                <span className="text-[11px] text-[#7A7163]">Outperforming usual seasonal pace</span>
              </div>
              <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7]">
                <strong className="text-[#1A1A1A] block">0.95× – 1.05×</strong>
                <span className="text-[11px] text-[#7A7163]">On exact seasonal pace</span>
              </div>
              <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7]">
                <strong className="text-[#B85C4A] block">&lt; 0.90×</strong>
                <span className="text-[11px] text-[#7A7163]">Lagging baseline (Action needed)</span>
              </div>
            </div>
          </div>

          {/* Cart Adds Estimation Transparency */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-2">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
              <Filter className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-editorial text-base">Funnel Transparency: Adds to Cart</h3>
            </div>
            <p className="text-xs text-[#665D4F]">
              Etsy does not expose cart data directly in the Open API v3. In the Funnel diagnosis, Stage 3 ("Adds to cart") is transparently estimated from visit-to-order patterns, checkout initiation benchmarks, and category average cart abandonment curves. It is always labeled with an "Estimated" badge.
            </p>
          </div>

          {/* 24-Hour Rollback Protocol */}
          <div className="p-4 bg-white rounded-xl border border-[#E2D8C9] space-y-2">
            <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#5A7A5A]" />
              <h3 className="font-editorial text-base">24-Hour Rollback Guarantee</h3>
            </div>
            <p className="text-xs text-[#665D4F]">
              When you edit listing titles, tags, or prices through SeasonalStat, a complete pre-edit snapshot is stored in the Audit Log. Within 24 hours, you can revert the listing to its exact previous state with a single click. After 24 hours, the rollback expires so Etsy search ranking can settle, but the snapshot history remains permanently logged.
            </p>
          </div>

          {/* Legal and trademark notice */}
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D7] text-[11px] text-[#8C8375]">
            <p>
              The term "Etsy" is a trademark of Etsy, Inc. SeasonalStat is not affiliated with, endorsed by, or sponsored by Etsy, Inc. All API interactions adhere strictly to the Etsy Open API Terms of Service.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E1D7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
