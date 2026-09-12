import React from 'react';
import { SearchTermItem } from '../types';
import { SeasonIndexBadge } from './SeasonIndexBadge';
import { Search, AlertTriangle, ArrowRight, Tag, HelpCircle } from 'lucide-react';

interface SearchTermsViewProps {
  terms: SearchTermItem[];
  onNavigateToListings: () => void;
}

export const SearchTermsView: React.FC<SearchTermsViewProps> = ({
  terms,
  onNavigateToListings,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E1D7]">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
          Search terms
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
          What shoppers typed before landing on your listings, measured against the same weeks last year.
        </p>
      </div>

      {/* 'Terms worth attention' Callout (amber) */}
      <div 
        id="terms-attention-callout"
        className="rounded-xl border border-[#D97757]/40 bg-[#FAF3EA] p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#D97757]/15 text-[#D97757] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Terms worth attention
              </h3>
              <p className="mt-1 text-sm sm:text-base text-[#4D4539] leading-relaxed">
                <span className="font-semibold text-[#1A1A1A]">"personalised cutting board"</span>, <span className="font-semibold text-[#1A1A1A]">"linen apron"</span>, and <span className="font-semibold text-[#1A1A1A]">"letterpress cards"</span> used to bring far more traffic at this point in the year. Check whether your tags and titles still match how shoppers phrase it.
              </p>
            </div>
          </div>

          <button
            id="audit-tags-cta-btn"
            type="button"
            onClick={onNavigateToListings}
            className="shrink-0 px-4 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-[#FAF7F2] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Audit listing tags</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Term List Table */}
      <div className="bg-white rounded-xl border border-[#E8E1D7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#E8E1D7] text-[#665D4F] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Search Term</th>
                <th className="py-3.5 px-4 text-right">This Period</th>
                <th className="py-3.5 px-4 text-right">Last Year</th>
                <th className="py-3.5 px-6 min-w-[220px]">Seasonal Benchmark Pace</th>
                <th className="py-3.5 px-4 text-center">Seasonality Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DF]">
              {terms.map((item, idx) => {
                const isUnderperforming = item.seasonIndex < 0.80;
                // Bar width relative to baseline
                const barPercent = Math.min(100, Math.max(10, (item.visitsThisPeriod / (item.visitsLastYear || 1)) * 70));

                return (
                  <tr
                    key={idx}
                    id={`search-term-row-${idx}`}
                    className={`hover:bg-[#FAF7F2]/80 transition-colors ${
                      item.isAttention ? 'bg-[#FAF3EA]/40' : ''
                    }`}
                  >
                    {/* Search Term */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-[#1A1A1A] text-xs">
                          "{item.term}"
                        </span>
                        {item.isAttention && (
                          <span className="text-[10px] font-semibold bg-[#D97757]/15 text-[#D97757] px-2 py-0.5 rounded-full">
                            Attention
                          </span>
                        )}
                      </div>
                    </td>

                    {/* This period */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#1A1A1A]">
                      {item.visitsThisPeriod} visits
                    </td>

                    {/* Last year */}
                    <td className="py-3.5 px-4 text-right font-mono text-[#7A7163]">
                      {item.visitsLastYear} visits
                    </td>

                    {/* Bar comparison */}
                    <td className="py-3.5 px-6">
                      <div className="space-y-1">
                        <div className="relative h-2.5 bg-[#EFE9DF] rounded-full overflow-hidden">
                          {/* Baseline reference marker at 70% */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-[#1A1A1A]/80 z-10" 
                            style={{ left: '70%' }}
                            title="1.00× Historical baseline"
                          />
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.seasonIndex >= 1.05
                                ? 'bg-[#5A7A5A]'
                                : item.seasonIndex >= 0.90
                                ? 'bg-[#D97757]'
                                : 'bg-[#B85C4A]'
                            }`}
                            style={{ width: `${barPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Seasonality Index Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <SeasonIndexBadge index={item.seasonIndex} size="sm" />
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
