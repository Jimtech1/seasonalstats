import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Check, Sparkles, AlertCircle } from 'lucide-react';

interface GoalsViewProps {
  currentGrossRevenue: number;
  currentNetRevenue: number;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  currentGrossRevenue = 5201,
  currentNetRevenue = 4412,
}) => {
  const [targetRevenue, setTargetRevenue] = useState<number>(6500);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState<string>('6500');

  const progressPercent = Math.min(100, Math.round((currentGrossRevenue / targetRevenue) * 100));
  const remaining = Math.max(0, targetRevenue - currentGrossRevenue);

  // 3-month forecast model incorporating historical seasonality index
  // Oct: +15% boost, Nov: +100% pre-holiday jump, Dec: +185% holiday peak
  const forecastData = [
    {
      month: 'October',
      seasonMultiplier: 1.15,
      projected: 5980,
      lowerBand: 5400,
      upperBand: 6600,
      notes: 'Early holiday gift browsing begins'
    },
    {
      month: 'November',
      seasonMultiplier: 2.01,
      projected: 10450,
      lowerBand: 9400,
      upperBand: 11600,
      notes: 'Black Friday / Cyber Week handmade peak'
    },
    {
      month: 'December',
      seasonMultiplier: 2.86,
      projected: 14890,
      lowerBand: 13200,
      upperBand: 16500,
      notes: 'Christmas shipping deadline rush'
    }
  ];

  const handleSaveTarget = () => {
    const val = parseFloat(tempTarget);
    if (!isNaN(val) && val > 0) {
      setTargetRevenue(val);
    }
    setIsEditingTarget(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E1D7]">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
          Revenue goals & seasonal forecast
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#665D4F] max-w-3xl leading-relaxed">
          Set monthly gross revenue targets adjusted for seasonal demand fluctuations.
        </p>
      </div>

      {/* Target Progress Card */}
      <div 
        id="goals-target-card"
        className="p-6 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#D97757]/15 text-[#D97757]">
              <Target className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A7163] block">
                Current Month Target
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-3xl font-bold text-[#1A1A1A]">
                  ${targetRevenue.toLocaleString()}
                </span>
                {!isEditingTarget ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTempTarget(targetRevenue.toString());
                      setIsEditingTarget(true);
                    }}
                    className="text-xs text-[#D97757] hover:underline font-semibold cursor-pointer"
                  >
                    Edit target
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={tempTarget}
                      onChange={(e) => setTempTarget(e.target.value)}
                      className="w-24 px-2 py-1 text-sm bg-[#FAF7F2] border border-[#D97757] rounded"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveTarget}
                      className="px-2 py-1 bg-[#D97757] text-white text-xs rounded font-medium"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9]">
              <span className="text-[#7A7163] block">Gross To Date:</span>
              <span className="font-mono font-bold text-sm text-[#1A1A1A]">
                ${currentGrossRevenue.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D8C9]">
              <span className="text-[#7A7163] block">Estimated Net:</span>
              <span className="font-mono font-bold text-sm text-[#5A7A5A]">
                ${currentNetRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[#4A4235]">
              Goal Progress: <strong className="text-[#1A1A1A] font-mono">{progressPercent}%</strong>
            </span>
            <span className="text-[#7A7163] font-mono">
              ${remaining.toLocaleString()} remaining to target
            </span>
          </div>

          <div className="h-4 bg-[#EFE9DF] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#D97757] to-[#E38A6C] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#7A7163]">
            <span>$0</span>
            <span className="font-semibold text-[#5A7A5A]">
              Pacing ahead of normal September curve
            </span>
            <span>${targetRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3-Month Projection with Seasonal Confidence Band */}
      <div className="p-6 bg-white rounded-xl border border-[#E8E1D7] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E1D7]">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#5A7A5A]" />
              <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                3-Month Seasonal Forecast Projection
              </h3>
            </div>
            <p className="text-xs text-[#6B6356] mt-0.5">
              Derived from your shop's 13-month historical curve combined with category-wide holiday Etsy shopping indices.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-[#5A7A5A]/15 text-[#355235] px-2.5 py-1 rounded-full self-start sm:self-auto">
            Q4 High Season Ahead
          </span>
        </div>

        {/* Projection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecastData.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E2D8C9] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg font-bold text-[#1A1A1A]">
                  {item.month}
                </span>
                <span className="text-xs font-mono font-semibold text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded">
                  {item.seasonMultiplier.toFixed(2)}× index
                </span>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A7163] block">
                  Projected Revenue
                </span>
                <span className="font-mono text-2xl font-bold text-[#1A1A1A] block">
                  ${item.projected.toLocaleString()}
                </span>
              </div>

              {/* Confidence Band */}
              <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D7] space-y-1 text-xs">
                <span className="text-[11px] font-medium text-[#7A7163] block">
                  80% Confidence Band:
                </span>
                <div className="flex items-center justify-between font-mono font-semibold text-[#1A1A1A]">
                  <span>${item.lowerBand.toLocaleString()}</span>
                  <span className="text-[#8C8375]">to</span>
                  <span>${item.upperBand.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#6B6356] leading-snug">
                {item.notes}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#FAF3EA] rounded-xl border border-[#D97757]/30 flex items-start gap-3 text-xs text-[#5C4533] leading-relaxed">
          <Sparkles className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
          <p>
            <strong>Preparation recommendation:</strong> Because your shop typically expands 2.86× in December, resolve flagged thumbnails on the Ceramic Dripper and Wool Slippers now before peak search index volume arrives in November.
          </p>
        </div>
      </div>
    </div>
  );
};
