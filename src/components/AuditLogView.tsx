import React, { useState } from 'react';
import { ListingEditRecord } from '../types';
import { 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  Check, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  History,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers
} from 'lucide-react';

interface AuditLogViewProps {
  records: ListingEditRecord[];
  onRevertEdit: (recordId: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  records,
  onRevertEdit,
}) => {
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'performance_tracker'>('performance_tracker');

  const handleRevert = (id: string) => {
    setRevertingId(id);
    setTimeout(() => {
      onRevertEdit(id);
      setRevertingId(null);
    }, 600);
  };

  const cohorts = records.filter(r => r.postEditPerformance);
  const positiveCohortsCount = cohorts.filter(r => r.postEditPerformance?.status === 'positive_lift').length;
  const avgNetLift = cohorts.length > 0 
    ? (cohorts.reduce((acc, c) => acc + (c.postEditPerformance?.netAttributedLiftPct || 0), 0) / cohorts.length).toFixed(1)
    : '0.0';

  const displayedRecords = activeTab === 'performance_tracker' 
    ? records.filter(r => r.postEditPerformance) 
    : records;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E1D7]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-[#5A7A5A]" />
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Safety layer & 14-day performance tracker
          </h1>
        </div>
        <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
          Every listing edit pushed to Etsy is logged with full snapshots, 24-hour rollback guarantee, and automated 14-day seasonally-adjusted performance tracking.
        </p>
      </div>

      {/* Cohort Performance Summary Banner */}
      <div id="tour-safety-cohorts-card" className="p-5 bg-white rounded-xl border border-[#E8E1D7] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7163]">
            Tracked Edit Cohorts
          </span>
          <div className="text-2xl font-bold text-[#1A1A1A]">
            {cohorts.length} listing changes
          </div>
          <p className="text-[11px] text-[#6B6356]">
            Automated 14-day observation window
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7163]">
            Positive Lift Rate
          </span>
          <div className="text-2xl font-bold text-[#5A7A5A] flex items-center gap-1.5">
            <ArrowUpRight className="w-5 h-5 text-[#5A7A5A]" />
            <span>{cohorts.length > 0 ? `${Math.round((positiveCohortsCount / cohorts.length) * 100)}%` : '0%'}</span>
          </div>
          <p className="text-[11px] text-[#6B6356]">
            {positiveCohortsCount} of {cohorts.length} produced verified lift
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7163]">
            Average Net SEO Lift
          </span>
          <div className="text-2xl font-bold text-[#5A7A5A]">
            +{avgNetLift}%
          </div>
          <p className="text-[11px] text-[#6B6356]">
            Excludes seasonal category tailwind
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7163]">
            Etsy Safety Protocol
          </span>
          <div className="text-base font-bold text-[#1A1A1A] flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#5A7A5A]" />
            <span>24h Rollback Ready</span>
          </div>
          <p className="text-[11px] text-[#6B6356]">
            Sequential write queue & character safety
          </p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('performance_tracker')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'performance_tracker'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#6B6356] border border-[#E8E1D7] hover:text-[#1A1A1A]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>14-Day Post-Edit Performance Cohorts ({cohorts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-[#6B6356] border border-[#E8E1D7] hover:text-[#1A1A1A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Write Transactions ({records.length})</span>
          </button>
        </div>

        <span className="text-xs text-[#7A7163] hidden sm:inline">
          Seasonality index decoupled from raw traffic
        </span>
      </div>

      {/* Audit Log / Cohort List */}
      <div className="space-y-4">
        {displayedRecords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E8E1D7] text-[#7A7163] text-sm space-y-2">
            <History className="w-8 h-8 mx-auto text-[#9C9281]" />
            <p>No records found in this view.</p>
            <p className="text-xs text-[#8C8375]">
              When you edit listings in the Listings tab, a performance tracking cohort is automatically generated.
            </p>
          </div>
        ) : (
          displayedRecords.map((rec) => {
            const isReverted = rec.status === 'reverted';
            const perf = rec.postEditPerformance;

            return (
              <div
                key={rec.id}
                id={`audit-record-${rec.id}`}
                className={`p-5 rounded-xl border transition-all ${
                  isReverted
                    ? 'bg-[#FAF7F2]/60 border-[#E8E1D7] opacity-75'
                    : 'bg-white border-[#E8E1D7] shadow-xs'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#F0EAE1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#1A1A1A]">
                        {rec.listingTitle}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isReverted
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-[#5A7A5A]/15 text-[#355235]'
                      }`}>
                        {isReverted ? 'Reverted' : 'Live on Etsy'}
                      </span>
                      {perf && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          perf.status === 'positive_lift'
                            ? 'bg-[#5A7A5A]/15 text-[#355235]'
                            : 'bg-[#B38E46]/15 text-[#634B19]'
                        }`}>
                          {perf.daysTracked === 14 ? '14/14 Days Complete' : `Day ${perf.daysTracked} of 14`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#7A7163] mt-1">
                      <span>Field Modified: <strong className="capitalize">{rec.fieldChanged}</strong></span>
                      <span>•</span>
                      <span>Published: {rec.timestamp}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#7A7163]" />
                        Undo Status: {rec.canUndoUntil}
                      </span>
                    </div>
                  </div>

                  {/* Revert button */}
                  {!isReverted && (() => {
                    const isUndoable = rec.canUndoUntil.toLowerCase().includes('active') || rec.canUndoUntil.toLowerCase().includes('left');
                    return (
                      <div className="relative group/revert self-start shrink-0">
                        <button
                          type="button"
                          disabled={!isUndoable || revertingId === rec.id}
                          onClick={() => handleRevert(rec.id)}
                          title={
                            isUndoable
                              ? `Revert to previous snapshot on Etsy (${rec.canUndoUntil})`
                              : '24-hour rollback guarantee window has expired. Historical snapshots remain logged for reference.'
                          }
                          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors ${
                            isUndoable
                              ? 'bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#D97757] border border-[#D97757]/40 cursor-pointer'
                              : 'bg-[#F2ECE2] text-[#8C8375] border border-[#E2D8C9] cursor-not-allowed opacity-60'
                          }`}
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${revertingId === rec.id ? 'animate-spin' : ''}`} />
                          <span>
                            {revertingId === rec.id
                              ? 'Reverting on Etsy...'
                              : isUndoable
                              ? 'Revert to Previous'
                              : 'Revert Expired (>24h)'}
                          </span>
                        </button>
                        {!isUndoable && (
                          <div className="absolute right-0 top-full mt-1 z-30 hidden group-hover/revert:block w-56 p-2 bg-[#1A1A1A] text-white text-[11px] rounded shadow-lg">
                            Revert window expired after 24 hours. Etsy API state has settled into standard historical ranking.
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* 14-Day Post-Edit Performance Matrix */}
                {perf && (
                  <div className="my-4 p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E1D7] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                        <BarChart3 className="w-4 h-4 text-[#5A7A5A]" />
                        <span>14-Day Post-Edit A/B Impact Matrix</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-[#7A7163]">Net Attributed Lift:</span>
                        <span className="px-2 py-0.5 rounded bg-[#5A7A5A] text-white font-bold text-xs">
                          +{perf.netAttributedLiftPct}%
                        </span>
                      </div>
                    </div>

                    {/* Pre vs Post Comparison Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D7]">
                        <span className="text-[10px] font-bold text-[#7A7163] uppercase block">
                          Visits (14d)
                        </span>
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#1A1A1A] mt-0.5">
                          <span>{perf.preEditMetrics.visits}</span>
                          <span className="text-[#7A7163]">→</span>
                          <span className="text-[#5A7A5A]">{perf.postEditMetrics.visits}</span>
                        </div>
                        <span className="text-[10px] text-[#5A7A5A] font-semibold">
                          +{perf.rawLiftPct}% raw
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D7]">
                        <span className="text-[10px] font-bold text-[#7A7163] uppercase block">
                          Search CTR
                        </span>
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#1A1A1A] mt-0.5">
                          <span>{perf.preEditMetrics.ctr}%</span>
                          <span className="text-[#7A7163]">→</span>
                          <span className="text-[#5A7A5A]">{perf.postEditMetrics.ctr}%</span>
                        </div>
                        <span className="text-[10px] text-[#5A7A5A] font-semibold">
                          +{(perf.postEditMetrics.ctr - perf.preEditMetrics.ctr).toFixed(2)}% pts
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D7]">
                        <span className="text-[10px] font-bold text-[#7A7163] uppercase block">
                          Orders (14d)
                        </span>
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#1A1A1A] mt-0.5">
                          <span>{perf.preEditMetrics.orders}</span>
                          <span className="text-[#7A7163]">→</span>
                          <span className="text-[#5A7A5A]">{perf.postEditMetrics.orders}</span>
                        </div>
                        <span className="text-[10px] text-[#5A7A5A] font-semibold">
                          +{Math.round(((perf.postEditMetrics.orders - perf.preEditMetrics.orders) / perf.preEditMetrics.orders) * 100)}%
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D7]">
                        <span className="text-[10px] font-bold text-[#7A7163] uppercase block">
                          Revenue (14d)
                        </span>
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#1A1A1A] mt-0.5">
                          <span>${perf.preEditMetrics.revenue}</span>
                          <span className="text-[#7A7163]">→</span>
                          <span className="text-[#5A7A5A]">${perf.postEditMetrics.revenue}</span>
                        </div>
                        <span className="text-[10px] text-[#5A7A5A] font-semibold">
                          +${perf.postEditMetrics.revenue - perf.preEditMetrics.revenue} gained
                        </span>
                      </div>
                    </div>

                    {/* Seasonality Decomposition Callout */}
                    <div className="p-3 bg-white rounded-lg border border-[#E8E1D7] text-xs space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#6B6356] text-[11px] pb-1 border-b border-[#F0EAE1]">
                        <span>Raw Listing Lift: <strong>+{perf.rawLiftPct}%</strong></span>
                        <span>Category Seasonal Tailwind: <strong>+{perf.categorySeasonLiftPct}%</strong></span>
                        <span className="text-[#355235] font-bold">True Attributable Net Lift: +{perf.netAttributedLiftPct}%</span>
                      </div>
                      <p className="text-[#1A1A1A] pt-1">
                        <strong>Statistical Verdict:</strong> {perf.verdict}
                      </p>
                    </div>
                  </div>
                )}

                {/* Diff summary */}
                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E1D7] space-y-1">
                    <span className="text-[10px] font-bold text-[#7A7163] uppercase block">
                      Previous Snapshot (Baseline)
                    </span>
                    {rec.oldValue.title && (
                      <p className="text-[#6B6356] truncate">
                        <strong>Title:</strong> {rec.oldValue.title}
                      </p>
                    )}
                    {rec.oldValue.tags && (
                      <p className="text-[#6B6356] text-[11px]">
                        <strong>Tags:</strong> {rec.oldValue.tags.join(', ')}
                      </p>
                    )}
                    {rec.oldValue.price !== undefined && (
                      <p className="text-[#6B6356]">
                        <strong>Price:</strong> ${rec.oldValue.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8E1D7] space-y-1">
                    <span className="text-[10px] font-bold text-[#5A7A5A] uppercase block">
                      Published Snapshot (New)
                    </span>
                    {rec.newValue.title && (
                      <p className="text-[#1A1A1A] font-medium truncate">
                        <strong>Title:</strong> {rec.newValue.title}
                      </p>
                    )}
                    {rec.newValue.tags && (
                      <p className="text-[#1A1A1A] text-[11px]">
                        <strong>Tags:</strong> {rec.newValue.tags.join(', ')}
                      </p>
                    )}
                    {rec.newValue.price !== undefined && (
                      <p className="text-[#1A1A1A] font-medium">
                        <strong>Price:</strong> ${rec.newValue.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
