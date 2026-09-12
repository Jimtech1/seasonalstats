import React, { useState } from 'react';
import { FunnelStage } from '../types';
import { SeasonIndexBadge } from './SeasonIndexBadge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  ArrowRight, 
  Wrench, 
  Layers, 
  Info,
  Sliders
} from 'lucide-react';

interface FunnelViewProps {
  stages: FunnelStage[];
  onNavigateToListingsFlagged: () => void;
}

export const FunnelView: React.FC<FunnelViewProps> = ({
  stages,
  onNavigateToListingsFlagged,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Find max numeric value for relative bar calculation (use Stage 1 numeric current)
  const maxImpressions = Math.max(...stages.map(s => Math.max(s.numericCurrent, s.numericLastYear)));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E1D7]">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
          Funnel diagnosis
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
          Shoppers move from search impressions to listing clicks to cart adds to orders. Only one stage is usually the real cause of a slow month.
        </p>
      </div>

      {/* Four Stage Cards (Stacked Vertically) */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const isGreen = stage.statusType === 'green';
          const isAmber = stage.statusType === 'amber';
          const isRed = stage.statusType === 'red';

          // Visual bar percentage calculation (using logarithmic scale or proportional relative width for stage visual comfort)
          // Since impressions are 214k and orders are 148, pure linear scaling makes stage 4 invisible (0.07%).
          // We calculate stage performance relative to its own baseline: current vs last year
          const ratioCurrentVsTarget = Math.min(100, Math.max(15, (stage.numericCurrent / (stage.numericLastYear || 1)) * 75));
          const baselineMarkerPercent = 75; // 1.00x baseline mark

          return (
            <div
              key={stage.stageNumber}
              id={`funnel-stage-${stage.stageNumber}`}
              className="bg-white/85 rounded-xl border border-[#E8E1D7] p-5 sm:p-6 shadow-xs hover:border-[#D97757]/40 transition-all space-y-4"
            >
              {/* Top Row: Stage number/label + Title vs Value & Seasonality Index */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#EFE9DF] text-[#6B6356] font-mono text-xs font-bold flex items-center justify-center">
                    {stage.stageNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wider text-[#7A7163] uppercase">
                        {stage.label}
                      </span>
                      {stage.isEstimated && (
                        <div className="relative inline-block">
                          <span 
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#EFE9DF] text-[#7A7163] px-2 py-0.5 rounded-full cursor-help"
                            onMouseEnter={() => setActiveTooltip(`stage-${stage.stageNumber}`)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            onClick={() => setActiveTooltip(activeTooltip === `stage-${stage.stageNumber}` ? null : `stage-${stage.stageNumber}`)}
                          >
                            <span>Estimated</span>
                            <HelpCircle className="w-3 h-3 text-[#9C9281]" />
                          </span>

                          {activeTooltip === `stage-${stage.stageNumber}` && (
                            <div className="absolute left-0 top-full mt-1.5 z-30 w-72 p-3 text-xs bg-[#1A1A1A] text-white rounded-lg shadow-xl leading-relaxed">
                              {stage.tooltip || 'Estimated from visit-to-order patterns. Etsy does not expose cart data directly.'}
                              <div className="absolute -top-1 left-4 border-solid border-b-[#1A1A1A] border-b-4 border-x-transparent border-x-4 border-t-0" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      {stage.name}
                    </h2>
                  </div>
                </div>

                {/* Value & Seasonality Badge */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-[#1A1A1A] block">
                      {stage.value}
                    </span>
                    <span className="text-xs font-mono text-[#7A7163] block">
                      {stage.baselineText}
                    </span>
                  </div>
                  <SeasonIndexBadge index={stage.seasonIndex} size="md" />
                </div>
              </div>

              {/* Horizontal Comparison Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#7A7163]">
                  <span>Current Pace ({stage.numericCurrent.toLocaleString()})</span>
                  <span>Seasonal Baseline ({stage.numericLastYear.toLocaleString()})</span>
                </div>
                
                <div className="relative h-4 bg-[#EFE9DF] rounded-full overflow-hidden">
                  {/* Baseline Reference Marker (Last Year) */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-[#1A1A1A] z-10" 
                    style={{ left: `${baselineMarkerPercent}%` }}
                    title={`Seasonal Baseline Pace: 1.00× (${stage.numericLastYear.toLocaleString()})`}
                  />

                  {/* Solid Fill for Current Pace */}
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isGreen 
                        ? 'bg-[#5A7A5A]' 
                        : isAmber 
                        ? 'bg-[#D97757]' 
                        : 'bg-[#B85C4A]'
                    }`}
                    style={{ width: `${ratioCurrentVsTarget}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8C8375]">
                  <span>0%</span>
                  <span className="font-semibold text-[#1A1A1A]">1.00× Historical baseline pace</span>
                  <span>1.50×</span>
                </div>
              </div>

              {/* Status Message with Icon */}
              <div className={`p-3.5 rounded-lg border flex items-start gap-3 text-xs sm:text-sm leading-relaxed ${
                isGreen
                  ? 'bg-[#5A7A5A]/10 border-[#5A7A5A]/30 text-[#2B422B]'
                  : isAmber
                  ? 'bg-[#D97757]/10 border-[#D97757]/30 text-[#6B2F1C]'
                  : 'bg-[#B85C4A]/10 border-[#B85C4A]/30 text-[#5C2318]'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {isGreen && <CheckCircle2 className="w-5 h-5 text-[#5A7A5A]" />}
                  {isAmber && <AlertTriangle className="w-5 h-5 text-[#D97757]" />}
                  {isRed && <AlertOctagon className="w-5 h-5 text-[#B85C4A]" />}
                </div>
                <div className="space-y-1">
                  <p className="font-medium">
                    {stage.statusMessage}
                  </p>

                  {/* Stage-specific Diagnostic fix suggestions */}
                  <div className="pt-2 border-t border-black/10 mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold opacity-75 flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      Fix if below:
                    </span>
                    {stage.fixSuggestions.map((suggestion, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-white/70 px-2 py-0.5 rounded-md border border-black/5 font-medium"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Summary Callout Below the Funnel */}
      <div 
        id="funnel-summary-callout"
        className="rounded-xl border border-[#D97757]/40 bg-[#FAF3EA] p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#D97757]/15 text-[#D97757] flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Funnel Diagnostic Verdict
              </h3>
              <p className="mt-1 text-sm sm:text-base text-[#4D4539] leading-relaxed">
                Your biggest gap is <strong className="text-[#1A1A1A]">Stage 2 — Clicks to listings at 0.74×</strong>. The 3 listings flagged <span className="inline-block px-2 py-0.5 bg-[#B85C4A]/15 text-[#B85C4A] rounded-full text-xs font-semibold">"Seen, never bought"</span> in the Listings tab are the likely cause.
              </p>
            </div>
          </div>

          <button
            id="view-flagged-listings-cta-btn"
            type="button"
            onClick={onNavigateToListingsFlagged}
            className="shrink-0 px-4 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-[#FAF7F2] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>View flagged listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footnote */}
      <footer className="pt-4 border-t border-[#E8E1D7]/70 text-xs text-[#7A7163]">
        <p>
          Revenue is top-line before Etsy fees. Figures shown are sample data until a shop is connected.
        </p>
      </footer>
    </div>
  );
};
