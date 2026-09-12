import React, { useState } from 'react';
import { HistoricalMonthItem } from '../types';
import { SeasonIndexBadge } from './SeasonIndexBadge';
import { CATEGORY_BENCHMARKS } from '../data/categoryBenchmarks';
import { 
  Download, 
  Calendar, 
  BarChart2, 
  Table as TableIcon, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Info, 
  Compass,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface HistoryViewProps {
  history: HistoricalMonthItem[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'visual' | 'benchmark'>('table');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('home_living');

  const selectedBenchmark = CATEGORY_BENCHMARKS[selectedCategoryKey] || CATEGORY_BENCHMARKS.home_living;

  const handleExportCsv = () => {
    const headers = [
      'Month',
      'Year',
      'Visits',
      'Orders',
      'Conversion Rate (%)',
      'Gross Revenue ($)',
      'Net Revenue ($)',
      'Last Year Revenue ($)',
      'Seasonality Index'
    ];

    const rows = history.map((item) => [
      item.month,
      item.year,
      item.visits,
      item.orders,
      item.conversionRate.toFixed(2),
      item.grossRevenue,
      item.netRevenue,
      item.lastYearRevenue,
      item.seasonIndex.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `seasonalstat_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div id="tour-history-view" className="space-y-6 animate-fadeIn">
      {/* Header with Export CSV button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E8E1D7]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Historical comparison
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
            Twelve months of shop performance, each month set beside the same month a year earlier.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-[#EFE9DF] p-1 rounded-lg border border-[#E4DCD0]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#7A7163]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'visual' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#7A7163]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Revenue Visual</span>
            </button>
            <button
              id="category-benchmark-toggle-btn"
              type="button"
              onClick={() => setViewMode('benchmark')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'benchmark' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#7A7163]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#D97757]" />
              <span>Category Benchmark</span>
            </button>
          </div>

          {/* Export CSV button */}
          <button
            id="export-csv-btn"
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#333] text-[#FAF7F2] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />
                <span>Downloaded CSV</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        /* History Table */
        <div className="bg-white rounded-xl border border-[#E8E1D7] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F4EE] border-b border-[#E8E1D7] text-[#665D4F] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Month</th>
                  <th className="py-3.5 px-3 text-right">Visits</th>
                  <th className="py-3.5 px-3 text-right">Orders</th>
                  <th className="py-3.5 px-3 text-right">Conversion</th>
                  <th className="py-3.5 px-4 text-right">Gross Revenue</th>
                  <th className="py-3.5 px-4 text-right">Net Revenue</th>
                  <th className="py-3.5 px-4 text-right">Last Year</th>
                  <th className="py-3.5 px-4 text-center">Season Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DF]">
                {history.map((row, idx) => (
                  <tr
                    key={idx}
                    id={`history-row-${idx}`}
                    className={`hover:bg-[#FAF7F2]/80 transition-colors ${
                      row.month.includes('Current') ? 'bg-[#FAF3EA]/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1A1A1A]">
                          {row.month} {row.year}
                        </span>
                        {row.month.includes('Current') && (
                          <span className="text-[10px] font-bold bg-[#D97757] text-white px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-[#4D4539]">
                      {row.visits.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-medium text-[#1A1A1A]">
                      {row.orders}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-[#4D4539]">
                      {row.conversionRate.toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1A1A1A]">
                      ${row.grossRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[#5A7A5A] font-bold">
                      ${row.netRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[#7A7163]">
                      ${row.lastYearRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <SeasonIndexBadge index={row.seasonIndex} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'visual' ? (
        /* Visual Comparison Mode */
        <div className="p-6 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-lg font-bold text-[#1A1A1A]">
              Gross Revenue: Current Year vs Previous Year
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#D97757]" />
                <span>Current / 2025-26</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#E4DCD0]" />
                <span>Last Year Baseline</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-64 pt-8 border-b border-[#E8E1D7]">
            {history.map((item, idx) => {
              const maxRev = 16000;
              const heightCurrent = (item.grossRevenue / maxRev) * 100;
              const heightLastYear = (item.lastYearRevenue / maxRev) * 100;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    {/* Last year bar */}
                    <div
                      className="w-2.5 sm:w-3.5 bg-[#E4DCD0] rounded-t-sm transition-all"
                      style={{ height: `${heightLastYear}%` }}
                      title={`Last Year: $${item.lastYearRevenue}`}
                    />
                    {/* Current year bar */}
                    <div
                      className="w-2.5 sm:w-3.5 bg-[#D97757] rounded-t-sm transition-all group-hover:bg-[#C26547]"
                      style={{ height: `${heightCurrent}%` }}
                      title={`Current: $${item.grossRevenue} (${item.seasonIndex}×)`}
                    />
                  </div>
                  <span className="text-[10px] text-[#7A7163] font-mono truncate max-w-full">
                    {item.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#7A7163]">
            Note the prominent seasonal holiday spike in November & December ($10k-$14k), reflecting natural gift demand patterns for handmade goods.
          </p>
        </div>
      ) : (
        /* Category Benchmark Overlay Mode */
        <div className="space-y-6">
          
          {/* Category Selector Bar & Overview */}
          <div className="p-6 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E1D7] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97757] flex items-center gap-1.5 mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Etsy Platform Category Benchmark</span>
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                  {selectedBenchmark.name}
                </h3>
                <p className="text-xs text-[#665D4F] mt-0.5">
                  {selectedBenchmark.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-[#4A4235] whitespace-nowrap">
                  Compare with:
                </label>
                <select
                  id="category-benchmark-select"
                  value={selectedCategoryKey}
                  onChange={(e) => setSelectedCategoryKey(e.target.value)}
                  className="px-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-lg text-xs font-semibold text-[#1A1A1A] focus:outline-hidden focus:border-[#D97757] cursor-pointer"
                >
                  <option value="home_living">Home & Living (Handmade & Decor)</option>
                  <option value="jewelry">Jewelry & Accessories</option>
                  <option value="craft_supplies">Craft Supplies & DIY Tools</option>
                  <option value="clothing">Apparel & Knitwear</option>
                </select>
              </div>
            </div>

            {/* Peak Window Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
                <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Platform Typical Peak</span>
                <span className="text-xs font-bold text-[#1A1A1A]">{selectedBenchmark.typicalPeak}</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
                <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Holiday Peak Index</span>
                <span className="text-xs font-bold text-[#D97757]">1.62× Platform Average</span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
                <span className="text-[10px] uppercase font-bold text-[#7A7163] block">Summer Baseline Lull</span>
                <span className="text-xs font-bold text-[#7A7163]">0.86× Expected Low</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Seasonal Curve Visualizer */}
          <div className="p-6 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-editorial text-base font-bold text-[#1A1A1A]">
                Seasonal Index Overlay: Your Shop vs. Category Platform Average
              </h4>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#D97757]" />
                  <span className="font-medium text-[#1A1A1A]">Your Shop Index</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#4A5568]" />
                  <span className="font-medium text-[#4A5568]">Category Benchmark</span>
                </div>
              </div>
            </div>

            {/* Visual Bar / Curve comparison */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 sm:gap-3 items-end h-64 pt-8 border-b border-[#E8E1D7]">
              {selectedBenchmark.monthlyIndices.map((bMonth, idx) => {
                const shopMonth = history.find(h => h.month.slice(0, 3).toLowerCase() === bMonth.month.slice(0, 3).toLowerCase());
                const shopIndex = shopMonth ? shopMonth.seasonIndex : 1.0;
                const benchIndex = bMonth.seasonIndex;

                // Max index around 2.0
                const shopHeight = (shopIndex / 1.8) * 100;
                const benchHeight = (benchIndex / 1.8) * 100;

                const isHigher = shopIndex >= benchIndex;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="flex items-end gap-1 w-full justify-center h-full">
                      {/* Category Benchmark Bar */}
                      <div
                        className="w-2.5 sm:w-3.5 bg-[#CBD5E1] rounded-t-sm transition-all group-hover:bg-[#94A3B8]"
                        style={{ height: `${benchHeight}%` }}
                        title={`Category Benchmark: ${benchIndex.toFixed(2)}x`}
                      />
                      {/* Your Shop Bar */}
                      <div
                        className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all ${
                          isHigher ? 'bg-[#D97757]' : 'bg-[#D97757]/80'
                        }`}
                        style={{ height: `${shopHeight}%` }}
                        title={`Your Shop: ${shopIndex.toFixed(2)}x (Delta: ${(shopIndex - benchIndex).toFixed(2)})`}
                      />
                    </div>
                    <span className="text-[10px] text-[#7A7163] font-mono truncate max-w-full">
                      {bMonth.month}
                    </span>
                    <span className={`text-[9px] font-mono font-bold ${
                      shopIndex > benchIndex ? 'text-[#5A7A5A]' : shopIndex < benchIndex ? 'text-[#B85C4A]' : 'text-[#7A7163]'
                    }`}>
                      {shopIndex >= benchIndex ? '+' : ''}{(shopIndex - benchIndex).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A7163] pt-2">
              <span>Baseline: 1.00× (Average monthly performance)</span>
              <span>Values &gt; 1.00× indicate high-demand seasonal peaks</span>
            </div>
          </div>

          {/* Diagnostic Verdict Callout: Is this shop-specific or platform-wide? */}
          <div className="p-5 bg-gradient-to-r from-[#FAF3EA] to-[#F5ECE0] rounded-xl border border-[#D97757]/40 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#5A7A5A] text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="font-editorial text-base font-bold text-[#1A1A1A]">
                Seasonality Normalization Verdict
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E2D8C9] space-y-1">
                <span className="font-bold text-[#1A1A1A] block flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-[#5A7A5A]" />
                  <span>Summer Lull (June – July): Normal Category Trend</span>
                </span>
                <p className="text-[#665D4F] leading-relaxed">
                  Home & Living across Etsy experiences a normal 14%–19% drop in visits during mid-summer. Your shop dipped 18%. <strong>This was a platform-wide pattern, not a flaw with your listings.</strong>
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#E2D8C9] space-y-1">
                <span className="font-bold text-[#1A1A1A] block flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-[#B85C4A]" />
                  <span>August Shoulder Month: Shop-Specific Leak Detected</span>
                </span>
                <p className="text-[#665D4F] leading-relaxed">
                  The category benchmark began early recovery in August (0.89×) as early autumn shoppers emerged. However, your shop remained at 0.79×. <strong>This points to underperforming tags and late seasonal staging on fall items.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Month by Month Benchmark Table */}
          <div className="bg-white rounded-xl border border-[#E8E1D7] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E1D7] bg-[#F8F4EE]">
              <h4 className="font-editorial text-base font-bold text-[#1A1A1A]">
                Detailed Month-by-Month Category Comparison
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#E8E1D7] text-[#665D4F] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-3 text-center">Your Shop Index</th>
                    <th className="py-3 px-3 text-center">Category Benchmark</th>
                    <th className="py-3 px-3 text-center">Variance (Delta)</th>
                    <th className="py-3 px-3 text-center">Diagnostic Status</th>
                    <th className="py-3 px-4">Etsy Shopper Behavior Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DF]">
                  {selectedBenchmark.monthlyIndices.map((bench, idx) => {
                    const shop = history.find(h => h.month.slice(0, 3).toLowerCase() === bench.month.slice(0, 3).toLowerCase());
                    const shopIdx = shop ? shop.seasonIndex : 1.0;
                    const delta = shopIdx - bench.seasonIndex;

                    return (
                      <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#1A1A1A]">
                          {bench.month}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-[#D97757]">
                          {shopIdx.toFixed(2)}×
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-[#4A5568]">
                          {bench.seasonIndex.toFixed(2)}×
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            delta > 0.05 ? 'bg-[#5A7A5A]/15 text-[#5A7A5A]' : delta < -0.05 ? 'bg-[#B85C4A]/15 text-[#B85C4A]' : 'bg-[#EFE9DF] text-[#665D4F]'
                          }`}>
                            {delta > 0 ? '+' : ''}{delta.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {delta > 0.05 ? (
                            <span className="text-[11px] font-semibold text-[#5A7A5A]">Overperforming</span>
                          ) : delta < -0.05 ? (
                            <span className="text-[11px] font-semibold text-[#B85C4A]">Underperforming</span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#7A7163]">Tracking Benchmark</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#665D4F]">
                          {bench.insight}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
