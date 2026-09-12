import React, { useState, useMemo } from 'react';
import { KpiMetric, HistoricalMonthItem } from '../types';
import { INITIAL_HISTORICAL_MONTHS } from '../data/sampleData';
import { SeasonIndexBadge } from './SeasonIndexBadge';
import { Sparkline } from './Sparkline';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  ArrowRight, 
  AlertTriangle, 
  Info, 
  Receipt, 
  HelpCircle,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface OverviewViewProps {
  kpis: KpiMetric[];
  history?: HistoricalMonthItem[];
  onNavigateToFunnel: () => void;
  onNavigateToListings: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: HistoricalMonthItem & { displayMonth: string };
  }>;
  label?: string;
}

const CustomRevenueTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E2D8C9] shadow-lg text-xs space-y-1.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-1.5">
          <span className="font-editorial font-bold text-[#1A1A1A] text-sm">{label} {data.year}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D97757]/10 text-[#D97757] font-semibold">
            {data.orders} orders
          </span>
        </div>
        <div className="space-y-1 pt-0.5 font-mono text-xs">
          <div className="flex items-center justify-between gap-3 text-[#D97757]">
            <span className="font-sans text-[#5C5549]">Gross Revenue:</span>
            <span className="font-bold">${data.grossRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[#5A7A5A]">
            <span className="font-sans text-[#5C5549]">Net Revenue:</span>
            <span className="font-semibold">${data.netRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[#8C8375]">
            <span className="font-sans text-[#5C5549]">Same Month LY:</span>
            <span>${data.lastYearRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#E8E1D7]/60 text-[11px] text-[#5C5549]">
            <span className="font-sans">Seasonal Index:</span>
            <span className="font-bold text-[#1A1A1A]">{data.seasonIndex.toFixed(2)}×</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const OverviewView: React.FC<OverviewViewProps> = ({
  kpis,
  history = INITIAL_HISTORICAL_MONTHS,
  onNavigateToFunnel,
  onNavigateToListings,
}) => {
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);

  // Take the last 6 months of historical data
  const last6Months = useMemo(() => {
    return (history && history.length >= 6 ? history.slice(-6) : INITIAL_HISTORICAL_MONTHS.slice(-6));
  }, [history]);

  const chartData = useMemo(() => {
    return last6Months.map(item => ({
      ...item,
      displayMonth: item.month.replace(' (Current)', ''),
      fullLabel: item.month
    }));
  }, [last6Months]);

  // Derived metrics for summary cards
  const { total6MoGross, avg6MoGross, peakMonth, latestMonth } = useMemo(() => {
    const total = last6Months.reduce((sum, item) => sum + item.grossRevenue, 0);
    const avg = Math.round(total / last6Months.length);
    const peak = [...last6Months].sort((a, b) => b.grossRevenue - a.grossRevenue)[0];
    const latest = last6Months[last6Months.length - 1];
    return {
      total6MoGross: total,
      avg6MoGross: avg,
      peakMonth: peak,
      latestMonth: latest
    };
  }, [last6Months]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E8E1D7]">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Shop overview
          </h1>
          <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
            Last 30 days against the same 30 days a year ago. An index of{' '}
            <span className="font-semibold font-mono text-[#1A1A1A]">1.00×</span> means you are
            exactly on your usual seasonal pace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="view-fee-breakdown-btn"
            type="button"
            onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
            className="text-xs font-semibold text-[#1A1A1A] hover:bg-[#FAF7F2] flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2D8C9] rounded-xl shadow-2xs transition-colors cursor-pointer"
            aria-expanded={showFeeBreakdown}
            aria-controls="fee-breakdown-panel"
          >
            <Receipt className="w-3.5 h-3.5 text-[#D97757]" />
            <span>{showFeeBreakdown ? 'Hide Etsy Fee Breakdown' : 'Etsy Fee Breakdown ($789)'}</span>
            {showFeeBreakdown ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#7A7163]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#7A7163]" />
            )}
          </button>
        </div>
      </div>

      {/* Etsy Fee Breakdown Accordion / Drawer if toggled */}
      {showFeeBreakdown && (
        <div id="fee-breakdown-panel" className="p-4 sm:p-5 bg-[#FAF7F2] rounded-xl border border-[#D97757]/30 shadow-xs space-y-3 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-editorial text-lg font-semibold text-[#1A1A1A]">
                Etsy Fee Normalization Breakdown (Last 30 Days)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-[#D97757]/10 text-[#D97757] px-2.5 py-0.5 rounded-full font-medium">
                15.2% Total Platform Deduction
              </span>
              <button
                type="button"
                onClick={() => setShowFeeBreakdown(false)}
                className="p-1 text-[#7A7163] hover:text-[#1A1A1A] rounded-lg transition-colors cursor-pointer"
                aria-label="Close fee breakdown"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-[#665D4F]">
            Gross Revenue is <strong className="text-[#1A1A1A] font-mono">$5,201</strong>. Net Revenue in your bank account is <strong className="text-[#1A1A1A] font-mono">$4,412</strong>. Calculated automatically according to Etsy's official seller schedule:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-[#E4DCD0]">
              <span className="text-[#7A7163] block">Transaction Fee (6.5%)</span>
              <span className="font-mono font-semibold text-[#1A1A1A] text-sm mt-0.5 block">$338.07</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E4DCD0]">
              <span className="text-[#7A7163] block">Payment Processing (3% + $0.25)</span>
              <span className="font-mono font-semibold text-[#1A1A1A] text-sm mt-0.5 block">$184.03</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E4DCD0]">
              <span className="text-[#7A7163] block">Listing Auto-Renews ($0.20/ea)</span>
              <span className="font-mono font-semibold text-[#1A1A1A] text-sm mt-0.5 block">$22.40</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E4DCD0]">
              <span className="text-[#7A7163] block">Offsite Ads & Regulatory Fees</span>
              <span className="font-mono font-semibold text-[#1A1A1A] text-sm mt-0.5 block">$244.50</span>
            </div>
          </div>
        </div>
      )}

      {/* Eight KPI Cards (4x2 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi) => {
          return (
            <div
              key={kpi.id}
              id={`kpi-card-${kpi.id}`}
              className="bg-white/80 rounded-xl p-5 border border-[#E8E1D7] shadow-xs hover:border-[#D97757]/40 transition-all flex flex-col justify-between group"
            >
              {/* Card Header: Label & Seasonality Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wider text-[#6B6356] uppercase">
                  {kpi.label}
                </span>
                <div id={kpi.id === kpis[0].id ? 'tour-kpi-season-badge' : undefined}>
                  <SeasonIndexBadge index={kpi.seasonIndex} size="sm" />
                </div>
              </div>

              {/* Large Current Value */}
              <div className="my-3 flex items-baseline justify-between gap-3">
                <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#1A1A1A]">
                  {kpi.currentValue}
                </div>
              </div>

              {/* Comparison Line & Subtext */}
              <div className="pt-3 border-t border-[#F0EAE1] space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span
                    className={
                      kpi.vsLastYear.includes('↗')
                        ? 'text-[#5A7A5A] font-semibold'
                        : kpi.vsLastYear.includes('↘')
                        ? 'text-[#B85C4A] font-semibold'
                        : 'text-[#6B6356]'
                    }
                  >
                    {kpi.vsLastYear}
                  </span>
                  <span className="text-[#7A7163] text-[11px] truncate max-w-[130px]">
                    {kpi.comparisonStatus}
                  </span>
                </div>
                {kpi.id === 'net_revenue' ? (
                  <button
                    type="button"
                    onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                    className="text-[11px] font-semibold text-[#D97757] hover:text-[#C26547] hover:underline flex items-center gap-1 cursor-pointer pt-0.5 text-left"
                    title="Click to toggle official Etsy fee breakdown"
                  >
                    <span>{showFeeBreakdown ? 'Hide fee breakdown' : 'Etsy Fee Breakdown ($789)'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : kpi.subDetail ? (
                  <p className="text-[11px] text-[#8C8375] line-clamp-1">
                    {kpi.subDetail}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gross Revenue Trend (Last 6 Months) Chart */}
      <div 
        id="gross-revenue-trend-section"
        className="bg-white/80 rounded-xl p-5 sm:p-6 border border-[#E8E1D7] shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE1]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#D97757]/10 text-[#D97757]">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Gross Revenue Trend (Last 6 Months)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#665D4F] mt-0.5">
              Trajectory of monthly gross sales leading into peak Q4 holiday surge
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D97757]" />
              <span className="font-semibold text-[#1A1A1A]">Gross Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#8C8375]">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#B8ACA0]" />
              <span>Same Month Last Year</span>
            </div>
          </div>
        </div>

        {/* Summary Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
            <span className="text-[#7A7163] block">6-Month Gross Total</span>
            <span className="font-mono font-bold text-[#1A1A1A] text-base mt-0.5 block">
              ${total6MoGross.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
            <span className="text-[#7A7163] block">Monthly Average</span>
            <span className="font-mono font-bold text-[#1A1A1A] text-base mt-0.5 block">
              ${avg6MoGross.toLocaleString()}/mo
            </span>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
            <span className="text-[#7A7163] block">Peak Month</span>
            <span className="font-mono font-bold text-[#5A7A5A] text-base mt-0.5 block">
              {peakMonth.month.replace(' (Current)', '')} (${peakMonth.grossRevenue.toLocaleString()})
            </span>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E4DCD0]">
            <span className="text-[#7A7163] block">Latest Month vs LY</span>
            <span className="font-mono font-bold text-[#D97757] text-base mt-0.5 block flex items-center gap-1">
              ${latestMonth.grossRevenue.toLocaleString()}
              <span className="text-[11px] font-sans font-medium text-[#5A7A5A] bg-[#5A7A5A]/10 px-1 rounded">
                +8.1%
              </span>
            </span>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="w-full h-72 pt-2 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
              <XAxis 
                dataKey="displayMonth" 
                stroke="#8C8375" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: '#E8E1D7' }} 
              />
              <YAxis 
                stroke="#8C8375" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val: number) => `$${(val / 1000).toFixed(1)}k`}
                domain={['dataMin - 500', 'dataMax + 600']}
              />
              <Tooltip content={<CustomRevenueTooltip />} />
              <Line
                type="monotone"
                dataKey="lastYearRevenue"
                name="Last Year"
                stroke="#B8ACA0"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#B8ACA0', r: 3, stroke: '#FAF7F2', strokeWidth: 1.5 }}
              />
              <Line
                type="monotone"
                dataKey="grossRevenue"
                name="Gross Revenue"
                stroke="#D97757"
                strokeWidth={3}
                dot={{ fill: '#D97757', r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#D97757', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* "Where to look first" Callout (amber) */}
      <div 
        id="tour-where-to-look-first"
        data-tour="where-to-look-first"
        className="rounded-xl border border-[#D97757]/40 bg-[#FAF3EA] p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#D97757]/15 text-[#D97757] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A]">
                  Where to look first
                </h3>
                <span className="text-[11px] font-mono font-semibold bg-[#D97757]/20 text-[#D97757] px-2 py-0.5 rounded-full">
                  Primary Funnel Bottleneck
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-[#4D4539] leading-relaxed">
                Clicks to listings is running at <strong className="text-[#1A1A1A] font-mono">0.74×</strong> its seasonal baseline — the biggest gap in your funnel. Shoppers see you in search and scroll past.
              </p>
            </div>
          </div>

          <button
            id="open-funnel-cta-btn"
            type="button"
            onClick={onNavigateToFunnel}
            className="shrink-0 px-4 py-2.5 bg-[#D97757] hover:bg-[#C26547] text-[#FAF7F2] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Open funnel diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Insights and Action Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white/70 rounded-xl border border-[#E8E1D7] flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B6356] uppercase tracking-wider block">
              Flagged Listings Requiring Attention
            </span>
            <h4 className="font-editorial text-lg font-bold text-[#1A1A1A] mt-1">
              3 listings flagged with high impressions but zero sales
            </h4>
            <p className="text-xs text-[#6B6356] mt-1 leading-relaxed">
              These items are getting organic visibility, but shoppers either bounce on thumbnail inspection or abandon the cart during checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToListings}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97757] hover:text-[#C26547] cursor-pointer"
          >
            <span>Review flagged listings in catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 bg-white/70 rounded-xl border border-[#E8E1D7] flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#6B6356] uppercase tracking-wider block">
              Seasonality Baseline Engine
            </span>
            <h4 className="font-editorial text-lg font-bold text-[#1A1A1A] mt-1">
              How the 1.00× index protects seller morale
            </h4>
            <p className="text-xs text-[#6B6356] mt-1 leading-relaxed">
              Instead of comparing visits to last month (which creates false panic when autumn sets in), SeasonalStat indexes against historical multi-year curve baselines.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center gap-2.5 px-3 py-2 bg-[#5A7A5A]/10 border border-[#5A7A5A]/25 rounded-xl text-xs text-[#2E472E] font-medium">
            <div className="w-6 h-6 rounded-md bg-[#5A7A5A] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="leading-tight">Normalizing against 13 months of Etsy receipts & search trends</span>
          </div>
        </div>
      </div>

      {/* Footer & Etsy Trademark Disclosures */}
      <footer className="pt-6 pb-2 border-t border-[#E8E1D7]/70 text-xs text-[#7A7163] space-y-2">
        <p className="leading-relaxed">
          Revenue shown gross and net of estimated Etsy fees. Figures shown are sample data until a shop is connected.
        </p>
        <p className="text-[11px] text-[#8C8375] leading-relaxed">
          The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
        </p>
      </footer>
    </div>
  );
};
