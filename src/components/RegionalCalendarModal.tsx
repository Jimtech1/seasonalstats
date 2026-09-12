import React from 'react';
import { TargetRegion } from '../types';
import { REGIONAL_MARKETS } from '../data/regionalCalendars';
import { 
  X, 
  Globe2, 
  Calendar, 
  Truck, 
  Sparkles, 
  Tag, 
  Check, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface RegionalCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: TargetRegion;
  onSelectRegion: (region: TargetRegion) => void;
}

export const RegionalCalendarModal: React.FC<RegionalCalendarModalProps> = ({
  isOpen,
  onClose,
  currentRegion,
  onSelectRegion,
}) => {
  if (!isOpen) return null;

  const currentConfig = REGIONAL_MARKETS[currentRegion];
  const regions: TargetRegion[] = ['US', 'UK', 'EU', 'AU'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FAF7F2] rounded-2xl border border-[#E8E1D7] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E8E1D7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#5A7A5A]/10 rounded-lg text-[#5A7A5A]">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold tracking-tight">
                Regional Holiday Calendars & Marketplace Timing
              </h2>
              <p className="text-xs text-[#6B6356]">
                Align listing keywords, production lead times, and shipping cutoffs to your target buyers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#7A7163] hover:text-[#1A1A1A] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Region Switcher Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A7163] block">
              Active Buyer Market Region
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {regions.map((regId) => {
                const cfg = REGIONAL_MARKETS[regId];
                const isSelected = currentRegion === regId;

                return (
                  <button
                    key={regId}
                    type="button"
                    onClick={() => onSelectRegion(regId)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#5A7A5A] ring-2 ring-[#5A7A5A]/20 shadow-xs'
                        : 'bg-[#F5EFE6] border-[#E8E1D7] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cfg.flagEmoji}</span>
                      <div>
                        <span className="font-bold text-sm text-[#1A1A1A] block">
                          {cfg.id}
                        </span>
                        <span className="text-[10px] text-[#7A7163]">
                          Currency: {cfg.currencySymbol}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#5A7A5A] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demographic & Strategic Context */}
          <div className="p-4 bg-white rounded-xl border border-[#E8E1D7] flex items-start gap-3 shadow-xs">
            <span className="text-3xl shrink-0">{currentConfig.flagEmoji}</span>
            <div className="space-y-1">
              <h3 className="font-editorial text-base font-bold text-[#1A1A1A]">
                {currentConfig.label}
              </h3>
              <p className="text-xs text-[#6B6356] leading-relaxed">
                {currentConfig.buyerDemographicSummary}
              </p>
            </div>
          </div>

          {/* Key Upcoming Holiday Timeline */}
          <div className="space-y-3">
            <h4 className="font-editorial text-base font-bold text-[#1A1A1A] flex items-center justify-between">
              <span>Upcoming Seasonal Milestones & Cutoffs ({currentConfig.upcomingHolidays.length})</span>
              <span className="text-xs font-sans font-normal text-[#7A7163]">
                Sorted by chronological urgency
              </span>
            </h4>

            <div className="space-y-4">
              {currentConfig.upcomingHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="p-5 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-3.5 transition-all hover:border-[#D97757]/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#D97757]/10 text-[#D97757] rounded-lg shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#1A1A1A]">
                          {holiday.name}
                        </h5>
                        <span className="text-xs text-[#7A7163]">
                          Calendar Date: <strong>{holiday.date}</strong> (in ~{holiday.daysUntil} days)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#5A7A5A] bg-[#5A7A5A]/10 px-2.5 py-1 rounded-lg">
                        {holiday.seasonalCategoryImpact}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Strategy & Advice */}
                    <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#7A7163] block">
                        Timing & Strategic Guidance
                      </span>
                      <p className="text-[#6B6356] leading-relaxed">
                        {holiday.advice}
                      </p>
                    </div>

                    {/* Shipping Deadline */}
                    <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#D97757] flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#D97757]" />
                        Shipping Cutoff Deadline
                      </span>
                      <p className="text-[#1A1A1A] font-semibold">
                        {holiday.shippingCutoff}
                      </p>
                      <p className="text-[11px] text-[#7A7163]">
                        Stage tags {holiday.leadTimeWeeks} weeks ahead of cutoff
                      </p>
                    </div>
                  </div>

                  {/* Local Search Phrases */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase text-[#7A7163] block mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#5A7A5A]" />
                      Local Search Phrases to Front-Load in Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {holiday.keySearchPhrases.map((phrase, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E8E1D7] rounded-md text-xs font-mono text-[#1A1A1A]"
                        >
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E8E1D7] flex items-center justify-between">
          <span className="text-xs text-[#7A7163]">
            Active Region: <strong>{currentConfig.label}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
